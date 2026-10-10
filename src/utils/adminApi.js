export class ErrorAdmin extends Error {
  constructor(mensaje, status) { super(mensaje); this.status = status; }
}

export async function adminApi(url, opciones = {}) {
  let respuesta;
  try { respuesta = await fetch(url, { credentials: 'same-origin', ...opciones }); }
  catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ErrorAdmin('No pudimos conectarnos. Revisa tu conexión y vuelve a intentar.');
  }
  const datos = await respuesta.json().catch(() => null);
  if (!datos) throw new ErrorAdmin('El panel no está disponible. Revisa el despliegue de las funciones /api en Vercel.');
  if (!respuesta.ok) throw new ErrorAdmin(datos.mensaje || 'No pudimos completar la solicitud. Vuelve a intentar.', respuesta.status);
  return datos;
}

export const escribirAdmin = (url, method, datos) => adminApi(url, {
  method, headers: { 'Content-Type': 'application/json' }, ...(datos ? { body: JSON.stringify(datos) } : {}),
});

export async function descargarAdmin(recurso, id, indice) {
  const params = new URLSearchParams({ recurso, id, ...(indice === undefined ? {} : { indice }) });
  const { url, nombre } = await adminApi(`/api/admin?${params}`);
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new ErrorAdmin('El archivo no está disponible. Vuelve a intentar o revisa su almacenamiento.');
  const blob = await respuesta.blob();
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
}
