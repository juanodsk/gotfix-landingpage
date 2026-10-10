import { clienteAutenticacion, esAdministrador, exigirAdministrador, guardarSesion, origenValido, respuestaPrivada, tokenSesion } from './_lib/adminAuth.js';
import { clienteSupabase } from './_lib/servicios.js';
import { errorInterno } from './_lib/http.js';

export function crearManejadorSesion({ servicio = clienteSupabase, autenticacion = clienteAutenticacion } = {}) {
  return async function handler(req, res) {
    respuestaPrivada(res);
    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST, DELETE');
      return res.status(405).json({ mensaje: 'Método no permitido.' });
    }
    if (req.method !== 'GET' && !origenValido(req, res)) return;
    try {
      if (req.method === 'GET') {
        const user = await exigirAdministrador(req, res, servicio());
        if (user) return res.status(200).json({ correo: user.email });
        return;
      }
      if (req.method === 'DELETE') {
        const token = tokenSesion(req);
        guardarSesion(req, res, null);
        if (token) await servicio().auth.admin.signOut(token, 'local');
        return res.status(200).json({ ok: true });
      }
      const { correo, clave } = req.body ?? {};
      if (typeof correo !== 'string' || correo.length > 254 || typeof clave !== 'string' || !clave || clave.length > 1024) {
        return res.status(400).json({ mensaje: 'Escribe tu correo y contraseña.' });
      }
      const { data, error } = await autenticacion().auth.signInWithPassword({ email: correo.trim(), password: clave });
      if (error || !data.session || !esAdministrador(data.user)) {
        guardarSesion(req, res, null);
        if (error?.status === 429) return res.status(429).json({ mensaje: 'Demasiados intentos. Espera unos minutos antes de volver a intentar.' });
        return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos, o cuenta sin acceso.' });
      }
      guardarSesion(req, res, data.session);
      return res.status(200).json({ correo: data.user.email });
    } catch (error) { return errorInterno(res, error); }
  };
}

export default crearManejadorSesion();
