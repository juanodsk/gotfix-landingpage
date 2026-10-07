// POST /api/pqrs — radica peticiones, quejas y reclamos.
//
// Con adjuntos se hace en dos pasos, porque Vercel no acepta archivos de más de 4,5 MB:
//   1. { accion: "subida", archivos: [{ nombre, tipo, tamano }] }
//      → devuelve URLs de subida de un solo uso al bucket privado y un token que las respalda.
//   2. El navegador sube cada archivo con su URL y luego envía
//      { accion: "radicar", ...datos, subidaId, token }  → genera el radicado y envía los correos.
// Sin adjuntos basta con el paso 2.
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { MAX_ADJUNTOS, MAX_ADJUNTOS_BYTES, TIPOS_ADJUNTO, validarAdjuntos, validarPqrs } from '../src/utils/validaciones.js';
import { BUCKET_PQRS, claveSupabase, clienteSupabase, correoGotfix, enviarCorreo, verificar } from './_lib/servicios.js';
import { errorDeValidacion, errorInterno, fechaBogota, obtenerIp, soloPost } from './_lib/http.js';
import { correoPqrsCliente, correoPqrsGotfix } from './_lib/correos.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SIETE_DIAS = 7 * 24 * 60 * 60;

export default async function handler(req, res) {
  if (!soloPost(req, res)) return;
  const cuerpo = req.body ?? {};
  try {
    if (cuerpo.accion === 'subida') return await prepararSubida(cuerpo, res);
    return await radicar(cuerpo, req, res);
  } catch (error) {
    return errorInterno(res, error);
  }
}

async function prepararSubida({ archivos }, res) {
  const lista = Array.isArray(archivos) ? archivos : [];
  const error = lista.length ? validarAdjuntos(lista) : 'No hay archivos para subir.';
  if (error) return errorDeValidacion(res, { adjuntos: error });

  const supabase = clienteSupabase();
  const subidaId = randomUUID();
  const urls = [];
  for (const [i, archivo] of lista.entries()) {
    const ruta = `${subidaId}/${i + 1}-${nombreSeguro(archivo.nombre)}`;
    const { signedUrl } = verificar(await supabase.storage.from(BUCKET_PQRS).createSignedUploadUrl(ruta), 'URL de subida');
    urls.push(signedUrl);
  }
  return res.status(200).json({ subidaId, token: firmarSubida(subidaId), urls });
}

async function radicar(cuerpo, req, res) {
  if (cuerpo.sitioWeb) return res.status(200).json({ radicado: 'PQRS-RECIBIDA', correoEnviado: true });

  const { errores, datos } = validarPqrs(cuerpo, []);
  if (Object.keys(errores).length) return errorDeValidacion(res, errores);

  const supabase = clienteSupabase();
  let adjuntos = [];

  if (cuerpo.subidaId) {
    if (!UUID.test(cuerpo.subidaId) || !tokenValido(cuerpo.subidaId, cuerpo.token)) {
      return res.status(400).json({ mensaje: 'La subida de archivos no es válida. Vuelve a adjuntarlos.' });
    }
    // Se revisa lo que realmente quedó en el bucket, no lo que dice el navegador.
    const archivos = verificar(await supabase.storage.from(BUCKET_PQRS).list(cuerpo.subidaId, { limit: 20 }), 'Listar adjuntos');
    adjuntos = archivos.map((a) => ({
      ruta: `${cuerpo.subidaId}/${a.name}`,
      nombre: a.name.replace(/^\d+-/, ''),
      tamano: a.metadata?.size ?? 0,
      tipo: a.metadata?.mimetype ?? '',
    }));
    const total = adjuntos.reduce((s, a) => s + a.tamano, 0);
    if (adjuntos.length > MAX_ADJUNTOS || total > MAX_ADJUNTOS_BYTES || adjuntos.some((a) => !TIPOS_ADJUNTO.test(a.tipo))) {
      await supabase.storage.from(BUCKET_PQRS).remove(adjuntos.map((a) => a.ruta));
      return errorDeValidacion(res, { adjuntos: 'Los adjuntos deben ser fotos o videos de máximo 20 MB en total.' });
    }
  }

  const radicado = verificar(await supabase.rpc('siguiente_radicado'), 'Generar radicado');
  const fecha = new Date();

  verificar(
    await supabase.from('pqrs').insert({
      radicado,
      nombre: datos.nombre,
      documento: datos.documento,
      correo: datos.correo,
      whatsapp: datos.whatsapp,
      orden: datos.orden || null,
      tipo: datos.tipo || null,
      descripcion: datos.descripcion,
      adjuntos,
      paso_por_tienda: datos.pasoPorTienda,
      estado: 'radicado',
      creado_en: fecha.toISOString(),
    }),
    'Guardar PQRS',
  );

  const fechaTexto = fechaBogota(fecha);
  let correoEnviado = false;
  try {
    await enviarCorreo({
      to: datos.correo,
      subject: `Recibimos tu solicitud ${radicado} – GOTFIX`,
      html: correoPqrsCliente({ datos, radicado }),
    });
    correoEnviado = true;
  } catch (error) {
    console.error(`PQRS ${radicado} guardada, pero falló el correo al cliente:`, error);
  }

  try {
    const enlaces = adjuntos.length
      ? verificar(
          await supabase.storage.from(BUCKET_PQRS).createSignedUrls(adjuntos.map((a) => a.ruta), SIETE_DIAS),
          'Enlaces de adjuntos',
        )
      : [];
    await enviarCorreo({
      to: correoGotfix(),
      replyTo: datos.correo,
      subject: `Nueva PQRS ${radicado} – ${datos.nombre}`,
      html: correoPqrsGotfix({
        datos,
        radicado,
        fecha: `${fechaTexto} · IP ${obtenerIp(req) ?? 'no disponible'}`,
        adjuntos: adjuntos.map((a, i) => ({ ...a, enlace: enlaces[i]?.signedUrl })),
      }),
    });
  } catch (error) {
    console.error(`PQRS ${radicado} guardada, pero falló el aviso a GOTFIX:`, error);
  }

  return res.status(200).json({ radicado, correoEnviado });
}

function nombreSeguro(nombre) {
  const limpio = String(nombre || 'archivo')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(-80);
  return limpio || 'archivo';
}

// El token prueba que la carpeta de subida la creó este servidor.
const firmarSubida = (subidaId) =>
  createHmac('sha256', claveSupabase()).update(`pqrs:${subidaId}`).digest('hex');

function tokenValido(subidaId, token) {
  if (typeof token !== 'string') return false;
  const esperado = Buffer.from(firmarSubida(subidaId));
  const recibido = Buffer.from(token);
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
}
