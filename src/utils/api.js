// Llamadas del navegador a las funciones serverless (/api/firmar y /api/pqrs).
// El navegador nunca habla directamente con Supabase ni con Resend.

async function postJson(url, cuerpo) {
  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new ErrorApi('No pudimos conectarnos. Revisa tu conexión a internet e inténtalo de nuevo.');
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new ErrorApi(datos.mensaje || 'Ocurrió un error inesperado. Inténtalo de nuevo en unos minutos.', datos.errores);
  }
  return datos;
}

export class ErrorApi extends Error {
  constructor(mensaje, errores) {
    super(mensaje);
    this.errores = errores;
  }
}

export const enviarFirma = (datos) => postJson('/api/firmar', datos);

// Paso 1 de PQRS con adjuntos: pide al servidor URLs de subida de un solo uso.
export const pedirSubidaPqrs = (archivos) =>
  postJson('/api/pqrs', {
    accion: 'subida',
    archivos: archivos.map((a) => ({ nombre: a.name, tipo: a.type, tamano: a.size })),
  });

// Paso 2: sube cada archivo directamente al bucket privado con su URL firmada.
export function subirArchivo(url, archivo, onProgreso) {
  return new Promise((resolve, reject) => {
    const cuerpo = new FormData();
    cuerpo.append('cacheControl', '3600');
    cuerpo.append('', archivo);
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgreso?.(e.loaded);
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new ErrorApi(`No pudimos subir "${archivo.name}". Inténtalo de nuevo.`));
    xhr.onerror = () => reject(new ErrorApi(`No pudimos subir "${archivo.name}". Revisa tu conexión.`));
    xhr.send(cuerpo);
  });
}

// Paso 3: radica la PQRS (con la referencia de los adjuntos ya subidos, si hay).
export const radicarPqrs = (datos) => postJson('/api/pqrs', { accion: 'radicar', ...datos });
