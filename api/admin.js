import { esEstadoPqrs } from '../src/data/estadosPqrs.js';
import { exigirAdministrador, origenValido, respuestaPrivada } from './_lib/adminAuth.js';
import { BUCKET_FIRMAS, BUCKET_PQRS, clienteSupabase, verificar } from './_lib/servicios.js';
import { errorInterno } from './_lib/http.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const esId = (id) => typeof id === 'string' && UUID.test(id);
const LIMITE = 25;
const CAMPOS_PQRS = 'id,radicado,nombre,documento,correo,whatsapp,orden,tipo,estado,creado_en,actualizado_en';
const CAMPOS_ACEPTACIONES = 'id,nombre,documento,correo,whatsapp,equipo,orden,version_terminos,creado_en';

export function crearManejadorAdmin({ servicio = clienteSupabase } = {}) {
  return async function handler(req, res) {
    respuestaPrivada(res);
    if (!['GET', 'PATCH'].includes(req.method)) {
      res.setHeader('Allow', 'GET, PATCH');
      return res.status(405).json({ mensaje: 'Método no permitido.' });
    }
    if (req.method === 'PATCH' && !origenValido(req, res)) return;
    try {
      const supabase = servicio();
      const user = await exigirAdministrador(req, res, supabase);
      if (!user) return;
      if (req.method === 'PATCH') return await actualizar(supabase, req.body ?? {}, user, res);
      const consulta = req.query ?? {};
      if (['pqrs', 'aceptaciones'].includes(consulta.recurso)) return await listar(supabase, consulta, res);
      if (!esId(consulta.id)) return res.status(400).json({ mensaje: 'Identificador no válido.' });
      if (consulta.recurso === 'detalle') {
        const pqr = verificar(await supabase.from('pqrs').select('*').eq('id', consulta.id).maybeSingle(), 'Consultar PQRS');
        if (!pqr) return res.status(404).json({ mensaje: 'No encontramos esta PQRS.' });
        const historial = verificar(await supabase.from('pqrs_seguimiento').select('id,estado_anterior,estado_nuevo,nota,admin_correo,creado_en').eq('pqr_id', pqr.id).order('creado_en', { ascending: false }), 'Consultar seguimiento');
        return res.status(200).json({ pqr, historial });
      }
      if (['pdf', 'adjunto'].includes(consulta.recurso)) return await archivo(supabase, consulta, res);
      return res.status(400).json({ mensaje: 'Consulta no válida.' });
    } catch (error) { return errorInterno(res, error); }
  };
}

async function listar(supabase, consulta, res) {
  const pagina = Number(consulta.pagina || 1);
  if (!Number.isSafeInteger(pagina) || pagina < 1 || pagina > 100000 || (consulta.buscar && typeof consulta.buscar !== 'string')) {
    return res.status(400).json({ mensaje: 'Los filtros de búsqueda no son válidos.' });
  }
  const esPqrs = consulta.recurso === 'pqrs';
  if (esPqrs && consulta.estado && !esEstadoPqrs(consulta.estado)) return res.status(400).json({ mensaje: 'Estado no válido.' });
  let query = supabase.from(esPqrs ? 'pqrs' : 'aceptaciones_terminos').select(esPqrs ? CAMPOS_PQRS : CAMPOS_ACEPTACIONES, { count: 'exact' });
  // Solo texto literal en la gramática PostgREST; no se interpolan comas, paréntesis ni comodines del usuario.
  const buscar = String(consulta.buscar || '').slice(0, 100).replace(/[^\p{L}\p{N}@.'+\-\s]/gu, ' ').trim();
  if (buscar) {
    const campos = ['nombre', 'documento', 'correo', 'whatsapp', 'orden', esPqrs ? 'radicado' : 'equipo'];
    query = query.or(campos.map((campo) => `${campo}.ilike."*${buscar}*"`).join(','));
  }
  if (esPqrs && consulta.estado) query = query.eq('estado', consulta.estado);
  const { data, count, error } = await query.order('creado_en', { ascending: false }).order('id', { ascending: false }).range((pagina - 1) * LIMITE, pagina * LIMITE - 1);
  verificar({ data, error }, 'Consultar registros');
  return res.status(200).json({ registros: data, total: count, pagina, limite: LIMITE });
}

async function actualizar(supabase, cuerpo, user, res) {
  const { id, estado, estadoAnterior, nota = '' } = cuerpo;
  if (!esId(id) || !esEstadoPqrs(estado) || !esEstadoPqrs(estadoAnterior) || typeof nota !== 'string' || nota.trim().length > 2000 || (estado === estadoAnterior && !nota.trim())) {
    return res.status(400).json({ mensaje: 'Selecciona un estado válido o escribe una nota de seguimiento (máximo 2000 caracteres).' });
  }
  const resultado = await supabase.rpc('actualizar_estado_pqrs', {
    p_id: id, p_estado: estado, p_estado_anterior: estadoAnterior, p_nota: nota.trim(), p_admin_id: user.id, p_admin_correo: user.email,
  });
  if (resultado.error?.code === 'P0002') return res.status(404).json({ mensaje: 'No encontramos esta PQRS.' });
  if (resultado.error?.code === '40001') return res.status(409).json({ mensaje: 'El estado cambió desde que abriste el caso. Actualiza el detalle antes de guardar.' });
  verificar(resultado, 'Actualizar seguimiento');
  return res.status(200).json({ ok: true });
}

async function archivo(supabase, consulta, res) {
  let bucket, ruta, nombre;
  if (consulta.recurso === 'pdf') {
    const registro = verificar(await supabase.from('aceptaciones_terminos').select('id,firma_url').eq('id', consulta.id).maybeSingle(), 'Consultar aceptación');
    if (!registro) return res.status(404).json({ mensaje: 'No encontramos esta aceptación.' });
    bucket = BUCKET_FIRMAS;
    // El PDF histórico vive junto a firma.png. No se regenera con los términos actuales.
    if (!/^firmas\/\d{4}\/[0-9a-f-]+\/firma\.png$/i.test(registro.firma_url)) throw new Error('Ruta de firma no válida.');
    ruta = registro.firma_url.slice(`${bucket}/`.length).replace(/firma\.png$/, 'aceptacion.pdf');
    nombre = `GOTFIX-Aceptacion-${registro.id}.pdf`;
  } else {
    const pqr = verificar(await supabase.from('pqrs').select('adjuntos').eq('id', consulta.id).maybeSingle(), 'Consultar adjunto');
    if (!pqr) return res.status(404).json({ mensaje: 'No encontramos esta PQRS.' });
    const indice = Number(consulta.indice);
    const adjunto = Number.isInteger(indice) && indice >= 0 ? pqr.adjuntos[indice] : null;
    if (!adjunto) return res.status(404).json({ mensaje: 'No encontramos este adjunto.' });
    bucket = BUCKET_PQRS;
    ruta = adjunto.ruta;
    nombre = adjunto.nombre;
  }
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(ruta, 60, { download: nombre });
  if (error && ['404', '400'].includes(String(error.statusCode))) return res.status(404).json({ mensaje: consulta.recurso === 'pdf' ? 'El PDF no está disponible. Revisa si falló su generación al guardar la firma.' : 'El adjunto ya no está disponible.' });
  verificar({ data, error }, 'Descargar archivo');
  return res.status(200).json({ url: data.signedUrl, nombre });
}

export default crearManejadorAdmin();
