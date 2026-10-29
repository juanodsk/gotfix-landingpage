import { randomUUID } from 'node:crypto';
import { EXPERIENCIAS_CURSO } from '../src/data/experienciaCurso.js';
import { origenValido, respuestaPrivada } from './_lib/adminAuth.js';
import { clienteSupabase, verificar } from './_lib/servicios.js';
import { errorInterno, soloPost } from './_lib/http.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const texto = (valor) => typeof valor === 'string' ? valor.trim() : '';
const opcional = (valor, maximo) => texto(valor).slice(0, maximo) || null;

export function crearManejadorContactos({ servicio = clienteSupabase } = {}) {
  return async function handler(req, res) {
    respuestaPrivada(res);
    if (!soloPost(req, res) || !origenValido(req, res)) return;
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
      return res.status(415).json({ mensaje: 'Envía el formulario como JSON.' });
    }
    const cuerpo = req.body;
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) return res.status(400).json({ mensaje: 'Formulario no válido.' });
    if (Buffer.byteLength(JSON.stringify(cuerpo), 'utf8') > 8192) return res.status(413).json({ mensaje: 'El formulario excede el tamaño permitido.' });
    const nombre = texto(cuerpo.nombre), correo = texto(cuerpo.correo).toLowerCase(), pais = texto(cuerpo.pais);
    const telefono = texto(cuerpo.whatsapp), digitos = telefono.replace(/\D/g, '');
    if (nombre.length < 2 || nombre.length > 160 || correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)
      || pais.length < 2 || pais.length > 100 || !/^\+?[\d\s().-]+$/.test(telefono) || digitos.length < 10 || digitos.length > 15
      || typeof cuerpo.experiencia !== 'string' || !Object.hasOwn(EXPERIENCIAS_CURSO, cuerpo.experiencia) || (cuerpo.envioId !== undefined && (typeof cuerpo.envioId !== 'string' || !UUID.test(cuerpo.envioId)))) {
      return res.status(400).json({ mensaje: 'Revisa el nombre, correo, país, WhatsApp y experiencia técnica.' });
    }
    try {
      const registro = {
        id: cuerpo.envioId || randomUUID(), nombre, correo, pais,
        whatsapp: (telefono.startsWith('+') ? '+' : '') + digitos, experiencia: cuerpo.experiencia,
        curso: 'Reparación de placas de iPhone', variante: cuerpo.variant === 'A' ? 'A' : 'B',
        cta: opcional(cuerpo.cta, 100), utm_source: opcional(cuerpo.utm_source, 200),
        utm_medium: opcional(cuerpo.utm_medium, 200), utm_campaign: opcional(cuerpo.utm_campaign, 200),
      };
      // Reintentar el mismo envío no duplica ni sobrescribe datos ya recibidos.
      verificar(await servicio().from('curso_contactos').upsert(registro, { onConflict: 'id', ignoreDuplicates: true }), 'Guardar contacto del curso');
      return res.status(200).json({ ok: true });
    } catch (error) { return errorInterno(res, error); }
  };
}

export default crearManejadorContactos();
