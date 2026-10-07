// Conexiones con Supabase y Resend. Las claves vienen de las variables de entorno de Vercel
// (ver .env.example) y nunca llegan al navegador.
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const BUCKET_FIRMAS = 'firmas';
export const BUCKET_PQRS = 'pqrs-adjuntos';

function variable(nombre) {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
  return valor;
}

let supabase;
export function claveSupabase() {
  const clave = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!clave) throw new Error('Falta la variable de entorno SUPABASE_SECRET_KEY');
  return clave;
}

export function clienteSupabase() {
  supabase ??= createClient(variable('SUPABASE_URL'), claveSupabase(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return supabase;
}

export const correoGotfix = () => process.env.CORREO_GOTFIX || 'gotfixco@gmail.com';

export async function enviarCorreo(opciones) {
  const resend = new Resend(variable('RESEND_API_KEY'));
  const { data, error } = await resend.emails.send({ from: variable('RESEND_FROM'), ...opciones });
  if (error) throw new Error(`Resend: ${error.message}`);
  return data;
}

// Lanza un error si Supabase respondió con error; si no, devuelve los datos.
export function verificar({ data, error }, contexto) {
  if (error) throw new Error(`${contexto}: ${error.message}`);
  return data;
}
