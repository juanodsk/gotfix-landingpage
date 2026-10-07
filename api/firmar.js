// POST /api/firmar — guarda la aceptación firmada de los Términos y envía la copia en PDF.
import { randomUUID } from 'node:crypto';
import { terminos } from '../src/data/terminos.js';
import { validarFirma } from '../src/utils/validaciones.js';
import { BUCKET_FIRMAS, clienteSupabase, correoGotfix, enviarCorreo, verificar } from './_lib/servicios.js';
import { errorDeValidacion, errorInterno, fechaBogota, obtenerIp, obtenerUserAgent, soloPost } from './_lib/http.js';
import { generarPdfAceptacion } from './_lib/pdfTerminos.js';
import { HASH_TERMINOS } from './_lib/terminosHash.js';
import { correoFirma } from './_lib/correos.js';

const PREFIJO_PNG = 'data:image/png;base64,';
const FIRMA_MAX_BYTES = 1024 * 1024;

export default async function handler(req, res) {
  if (!soloPost(req, res)) return;
  const cuerpo = req.body ?? {};

  // Campo trampa: si lo llenó un robot, respondemos "ok" sin guardar nada.
  if (cuerpo.sitioWeb) return res.status(200).json({ ok: true, correoEnviado: true });

  const { errores, datos } = validarFirma(cuerpo);
  const firmaPng = decodificarFirma(cuerpo.firma);
  if (!firmaPng && !errores.firma) errores.firma = 'No pudimos leer la firma. Bórrala y vuelve a firmar.';
  if (Object.keys(errores).length) return errorDeValidacion(res, errores);

  if (cuerpo.version !== terminos.version) {
    return res.status(409).json({ mensaje: 'Los Términos y Condiciones se actualizaron. Recarga la página y vuelve a firmar.' });
  }

  try {
    const supabase = clienteSupabase();
    const id = randomUUID();
    const fecha = new Date();
    const fechaTexto = fechaBogota(fecha);
    const ip = obtenerIp(req);
    const carpeta = `${fecha.getUTCFullYear()}/${id}`;

    verificar(
      await supabase.storage.from(BUCKET_FIRMAS).upload(`${carpeta}/firma.png`, firmaPng, { contentType: 'image/png' }),
      'Subir firma',
    );

    verificar(
      await supabase.from('aceptaciones_terminos').insert({
        id,
        nombre: datos.nombre,
        documento: datos.documento,
        correo: datos.correo,
        whatsapp: datos.whatsapp,
        equipo: datos.equipo,
        orden: datos.orden || null,
        version_terminos: terminos.version,
        hash_terminos: HASH_TERMINOS,
        firma_url: `${BUCKET_FIRMAS}/${carpeta}/firma.png`,
        ip,
        user_agent: obtenerUserAgent(req),
        creado_en: fecha.toISOString(),
      }),
      'Guardar aceptación',
    );

    // La aceptación ya quedó guardada: si el PDF o el correo fallan, se informa pero no se pierde.
    let correoEnviado = false;
    try {
      const pdf = await generarPdfAceptacion({ datos, firmaPng, fecha, fechaTexto, ip, id, hash: HASH_TERMINOS });
      verificar(
        await supabase.storage.from(BUCKET_FIRMAS).upload(`${carpeta}/aceptacion.pdf`, pdf, { contentType: 'application/pdf' }),
        'Subir PDF',
      );
      await enviarCorreo({
        to: datos.correo,
        cc: correoGotfix(),
        subject: 'Copia de tu aceptación de Términos y Condiciones – GOTFIX',
        html: correoFirma({ datos, version: terminos.version, fecha: fechaTexto }),
        attachments: [{ filename: `GOTFIX-Terminos-${terminos.version}-${datos.documento.replace(/\D/g, '')}.pdf`, content: Buffer.from(pdf) }],
      });
      correoEnviado = true;
    } catch (error) {
      console.error('Aceptación guardada, pero falló el PDF o el correo:', error);
    }

    return res.status(200).json({ ok: true, id, correoEnviado });
  } catch (error) {
    return errorInterno(res, error);
  }
}

function decodificarFirma(valor) {
  if (typeof valor !== 'string' || !valor.startsWith(PREFIJO_PNG)) return null;
  const buffer = Buffer.from(valor.slice(PREFIJO_PNG.length), 'base64');
  const esPng = buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return esPng && buffer.length <= FIRMA_MAX_BYTES ? buffer : null;
}
