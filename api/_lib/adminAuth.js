import { createClient } from '@supabase/supabase-js';
import { clienteSupabase } from './servicios.js';

const COOKIE = 'gotfix_admin';

export function clienteAutenticacion() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Falta configurar Supabase Auth (URL y Publishable key).');
  // Nunca iniciar sesión en el cliente service_role compartido: cambiaría su autorización.
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function esAdministrador(user) {
  const autorizado = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!autorizado) throw new Error('Falta configurar ADMIN_EMAIL.');
  return Boolean(user?.email_confirmed_at && user.email?.toLowerCase() === autorizado);
}

export function tokenSesion(req) {
  const valor = String(req.headers.cookie || '').split(';')
    .map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!valor) return null;
  try { return decodeURIComponent(valor.slice(COOKIE.length + 1)); }
  catch { return null; }
}

export function guardarSesion(req, res, session) {
  const segura = process.env.VERCEL || process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https';
  const segundos = session ? Math.max(0, Math.min(session.expires_in || 3600, 3600)) : 0;
  res.setHeader('Set-Cookie', `${COOKIE}=${session ? encodeURIComponent(session.access_token) : ''}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=${segundos}${segura ? '; Secure' : ''}`);
}

export function respuestaPrivada(res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

export function origenValido(req, res) {
  try {
    const origin = new URL(req.headers.origin);
    if (origin.host === req.headers.host && ['http:', 'https:'].includes(origin.protocol)) return true;
  } catch { /* Las escrituras del panel requieren un Origin del mismo sitio. */ }
  res.status(403).json({ mensaje: 'La solicitud debe hacerse desde el panel de GOTFIX.' });
  return false;
}

export async function exigirAdministrador(req, res, supabase = clienteSupabase()) {
  const token = tokenSesion(req);
  if (!token) {
    res.status(401).json({ mensaje: 'Inicia sesión para acceder al panel.' });
    return null;
  }
  // Consulta Auth en cada petición. Nunca se confía en datos de localStorage ni en un JWT sin verificar.
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    guardarSesion(req, res, null);
    res.status(401).json({ mensaje: 'Tu sesión venció. Vuelve a iniciar sesión.' });
    return null;
  }
  if (!esAdministrador(data.user)) {
    res.status(403).json({ mensaje: 'Esta cuenta no tiene acceso al panel.' });
    return null;
  }
  return data.user;
}
