// Plantillas HTML de los correos (estilos en línea para que se vean bien en Gmail y Outlook).
import { escaparHtml as e } from './http.js';

const AZUL_MARINO = '#00162b';
const AZUL = '#0087fa';

function plantilla(titulo, cuerpo) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f2f4f7;font-family:Arial,Helvetica,sans-serif;color:#1f2933">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f7;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:${AZUL_MARINO};padding:22px 28px;border-bottom:3px solid ${AZUL}">
<span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:1px">GOTFIX</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:20px;color:${AZUL_MARINO}">${e(titulo)}</h1>
${cuerpo}
</td></tr>
<tr><td style="padding:18px 28px;background:#f7f9fb;font-size:12px;color:#6b7785">
GOTFIX S.A.S. · Neiva, Huila · WhatsApp (+57) 312 504 2689 · <a href="https://www.gotfix.co" style="color:${AZUL}">www.gotfix.co</a>
</td></tr></table></td></tr></table></body></html>`;
}

const parrafo = (html) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6">${html}</p>`;

function tabla(filas) {
  const celdas = filas
    .filter(([, valor]) => valor !== undefined)
    .map(
      ([etiqueta, valor]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-size:14px;color:#6b7785;vertical-align:top;white-space:nowrap">${e(etiqueta)}</td>` +
        `<td style="padding:8px 0;font-size:14px;color:#1f2933">${valor}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e3e8ee;margin:8px 0 18px">${celdas}</table>`;
}

export function correoFirma({ datos, version, fecha }) {
  return plantilla(
    'Copia de tu aceptación de Términos y Condiciones',
    parrafo(`Hola, ${e(datos.nombre.split(' ')[0])}:`) +
      parrafo(
        'Gracias por confiar en GOTFIX. Adjuntamos en PDF los Términos y Condiciones del servicio técnico que aceptaste, con tus datos y tu firma.',
      ) +
      tabla([
        ['Equipo', e(datos.equipo)],
        ['N.º de orden', datos.orden ? e(datos.orden) : undefined],
        ['Fecha y hora', e(fecha)],
        ['Versión aceptada', e(version)],
      ]) +
      parrafo('Si tienes dudas, escríbenos por WhatsApp al (+57) 312 504 2689.'),
  );
}

const ETIQUETAS_TIPO = { peticion: 'Petición', queja: 'Queja', reclamo: 'Reclamo', garantia: 'Garantía' };

export function correoPqrsCliente({ datos, radicado }) {
  return plantilla(
    `Recibimos tu solicitud ${radicado}`,
    parrafo(`Hola, ${e(datos.nombre.split(' ')[0])}:`) +
      parrafo('Tu caso quedó radicado. Guarda este número para hacer seguimiento:') +
      `<p style="margin:0 0 18px;font-size:24px;font-weight:bold;color:${AZUL_MARINO};letter-spacing:1px">${e(radicado)}</p>` +
      tabla([
        ['Tipo', datos.tipo ? e(ETIQUETAS_TIPO[datos.tipo]) : undefined],
        ['N.º de orden', datos.orden ? e(datos.orden) : undefined],
      ]) +
      parrafo('Te responderemos dentro de los plazos que establece la ley.'),
  );
}

export function correoPqrsGotfix({ datos, radicado, fecha, adjuntos }) {
  const listaAdjuntos = adjuntos.length
    ? adjuntos
        .map((a) => `<a href="${e(a.enlace)}" style="color:${AZUL}">${e(a.nombre)}</a> (${(a.tamano / 1048576).toFixed(1)} MB)`)
        .join('<br>') + '<br><span style="color:#6b7785;font-size:12px">Los enlaces vencen en 7 días. Después, descarga los archivos desde Supabase.</span>'
    : 'Sin adjuntos';
  return plantilla(
    `Nueva PQRS ${radicado}`,
    tabla([
      ['Radicado', `<strong>${e(radicado)}</strong>`],
      ['Fecha', e(fecha)],
      ['Tipo', datos.tipo ? e(ETIQUETAS_TIPO[datos.tipo]) : undefined],
      ['Nombre', e(datos.nombre)],
      ['Cédula o NIT', e(datos.documento)],
      ['Correo', `<a href="mailto:${e(datos.correo)}" style="color:${AZUL}">${e(datos.correo)}</a>`],
      ['WhatsApp', `<a href="https://wa.me/${e(datos.whatsapp.replace('+', ''))}" style="color:${AZUL}">${e(datos.whatsapp)}</a>`],
      ['N.º de orden', e(datos.orden || 'No indicó')],
      ['Pasó por la tienda', datos.pasoPorTienda ? 'Sí, y no recibió solución' : 'No lo indicó'],
      ['Adjuntos', listaAdjuntos],
    ]) +
      `<p style="margin:0 0 6px;font-size:14px;color:#6b7785">Descripción</p>` +
      `<div style="font-size:15px;line-height:1.6;white-space:pre-wrap;border-left:3px solid ${AZUL};padding-left:12px">${e(datos.descripcion)}</div>`,
  );
}
