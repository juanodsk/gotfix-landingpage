// Reglas de validación compartidas por los formularios (navegador) y las funciones /api (servidor).
// Cada validador devuelve { errores, datos }: "errores" tiene un mensaje por campo inválido y
// "datos" los valores ya limpios (sin espacios sobrantes, WhatsApp en formato +57...).

export const TIPOS_PQRS = [
  { valor: 'peticion', etiqueta: 'Petición' },
  { valor: 'queja', etiqueta: 'Queja' },
  { valor: 'reclamo', etiqueta: 'Reclamo' },
  { valor: 'garantia', etiqueta: 'Garantía' },
];

export const MAX_ADJUNTOS_BYTES = 20 * 1024 * 1024;
export const MAX_ADJUNTOS = 5;
export const TIPOS_ADJUNTO = /^(image|video)\//;

const texto = (v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '');
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validarContacto(entrada, errores) {
  const nombre = texto(entrada.nombre);
  if (!nombre) errores.nombre = 'Escribe tu nombre completo.';
  else if (nombre.length < 5 || !nombre.includes(' ')) errores.nombre = 'Escribe tu nombre y apellido.';
  else if (nombre.length > 120) errores.nombre = 'El nombre es demasiado largo.';

  const documento = texto(entrada.documento);
  const digitos = documento.replace(/\D/g, '');
  if (!documento) errores.documento = 'Escribe tu número de cédula o NIT.';
  else if (!/^[\d.\- ]+$/.test(documento) || digitos.length < 5 || digitos.length > 15)
    errores.documento = 'Escribe solo números (puedes incluir el dígito de verificación del NIT con guion).';

  const correo = texto(entrada.correo).toLowerCase();
  if (!correo) errores.correo = 'Escribe tu correo electrónico.';
  else if (!CORREO.test(correo) || correo.length > 160) errores.correo = 'Revisa el correo, parece que no es válido.';

  let whatsapp = texto(entrada.whatsapp).replace(/\D/g, '');
  if (whatsapp.length === 12 && whatsapp.startsWith('57')) whatsapp = whatsapp.slice(2);
  if (!whatsapp) errores.whatsapp = 'Escribe tu número de WhatsApp.';
  else if (!/^3\d{9}$/.test(whatsapp)) errores.whatsapp = 'Escribe un celular de 10 dígitos, por ejemplo 312 504 2689.';

  const orden = texto(entrada.orden);
  if (orden.length > 30) errores.orden = 'El número de orden es demasiado largo.';

  return { nombre, documento, correo, whatsapp: whatsapp ? `+57${whatsapp}` : '', orden };
}

export function validarFirma(entrada = {}) {
  const errores = {};
  const datos = validarContacto(entrada, errores);

  datos.equipo = texto(entrada.equipo);
  if (!datos.equipo) errores.equipo = 'Escribe el modelo de tu equipo, por ejemplo iPhone 13 Pro.';
  else if (datos.equipo.length > 80) errores.equipo = 'El modelo es demasiado largo.';

  if (entrada.aceptaTerminos !== true) errores.aceptaTerminos = 'Debes aceptar los Términos y Condiciones para continuar.';
  if (entrada.autorizaDatos !== true) errores.autorizaDatos = 'Debes autorizar el tratamiento de tus datos personales.';
  if (!entrada.firma) errores.firma = 'Dibuja tu firma o usa tu nombre completo como firma electrónica.';

  return { errores, datos };
}

export function validarPqrs(entrada = {}, adjuntos = []) {
  const errores = {};
  const datos = validarContacto(entrada, errores);

  // El formulario actual no pide el tipo; si llega uno, debe ser válido.
  datos.tipo = TIPOS_PQRS.some((t) => t.valor === entrada.tipo) ? entrada.tipo : '';
  if (entrada.tipo && !datos.tipo) errores.tipo = 'El tipo de solicitud no es válido.';

  datos.descripcion = typeof entrada.descripcion === 'string' ? entrada.descripcion.trim() : '';
  if (datos.descripcion.length < 20) errores.descripcion = 'Cuéntanos tu caso con más detalle (mínimo 20 caracteres).';
  else if (datos.descripcion.length > 3000) errores.descripcion = 'La descripción no puede pasar de 3.000 caracteres.';

  datos.pasoPorTienda = entrada.pasoPorTienda === true;

  const errorAdjuntos = validarAdjuntos(adjuntos);
  if (errorAdjuntos) errores.adjuntos = errorAdjuntos;

  return { errores, datos };
}

// "adjuntos" es una lista de { nombre, tipo, tamano } (o de File, que tiene name/type/size).
export function validarAdjuntos(adjuntos) {
  const lista = adjuntos.map((a) => ({ tipo: a.tipo ?? a.type, tamano: a.tamano ?? a.size }));
  if (lista.length > MAX_ADJUNTOS) return `Puedes adjuntar máximo ${MAX_ADJUNTOS} archivos.`;
  if (lista.some((a) => !TIPOS_ADJUNTO.test(a.tipo ?? ''))) return 'Solo se permiten fotos o videos.';
  const total = lista.reduce((suma, a) => suma + (Number(a.tamano) || 0), 0);
  if (total > MAX_ADJUNTOS_BYTES) return 'Los adjuntos pesan más de 20 MB en total. Quita alguno o envía un video más corto.';
  return null;
}
