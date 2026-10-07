// Utilidades comunes para las funciones /api.

export function soloPost(req, res) {
  if (req.method === 'POST') return true;
  res.setHeader('Allow', 'POST');
  res.status(405).json({ mensaje: 'Método no permitido.' });
  return false;
}

export function obtenerIp(req) {
  const reenviada = req.headers['x-forwarded-for'];
  if (reenviada) return String(reenviada).split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || null;
}

export const obtenerUserAgent = (req) => String(req.headers['user-agent'] || '').slice(0, 500) || null;

export function errorDeValidacion(res, errores) {
  return res.status(400).json({ mensaje: 'Revisa los campos marcados en rojo.', errores });
}

export function errorInterno(res, error) {
  console.error(error);
  return res.status(500).json({
    mensaje: 'No pudimos procesar tu solicitud en este momento. Inténtalo de nuevo en unos minutos o escríbenos por WhatsApp.',
  });
}

const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escaparHtml = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => ENTIDADES[c]);

export const fechaBogota = (fecha) =>
  new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'medium' })
    .format(fecha)
    .replace(/[\u00a0\u202f]/g, ' ');
