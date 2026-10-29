import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createClient } from '@supabase/supabase-js';
import { crearManejadorContactos } from '../api/academy-contactos.js';

const ID = '10000000-0000-4000-8000-000000000001';
const DATOS = { envioId: ID, nombre: ' Ana María ', correo: 'ANA+CURSO@EXAMPLE.TEST', pais: 'Colombia', whatsapp: '+57 310 123 4567', experiencia: 'microsoldadura', variant: 'B', cta: 'hero' };
function fixture({ fallo = false } = {}) {
  const llamadas = [], registros = new Map();
  const supabase = createClient('https://prueba.supabase.co', 'clave-de-servidor-de-prueba', { auth: { persistSession: false }, global: { fetch: async (url, init) => {
    llamadas.push({ url: new URL(url), init });
    const registro = JSON.parse(init.body);
    assert.equal(new URL(url).pathname, '/rest/v1/curso_contactos');
    assert.match(new Headers(init.headers).get('prefer'), /resolution=ignore-duplicates/);
    if (fallo) return new Response(JSON.stringify({ code: '42P01', message: 'Tabla no disponible' }), { status: 400 });
    if (!registros.has(registro.id)) registros.set(registro.id, registro);
    return new Response(null, { status: 201 });
  } } });
  return { llamadas, registros, handler: crearManejadorContactos({ servicio: () => supabase }) };
}
async function llamar(handler, { body = DATOS, method = 'POST', origin = 'https://gotfix.test', type = 'application/json' } = {}) {
  const req = { method, body, headers: { origin, host: 'gotfix.test', 'content-type': type } };
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(v) { this.code = v; return this; }, json(v) { this.body = v; return this; } };
  await handler(req, res);
  return res;
}

test('guarda los cinco datos normalizados, sin confiar en curso, fecha o columnas del cliente', async () => {
  const f = fixture();
  const res = await llamar(f.handler, { body: { ...DATOS, curso: 'Curso falso', creado_en: '2000-01-01', documento: 'privado', utm_source: ' facebook ', utm_campaign: 'x'.repeat(250) } });
  assert.equal(res.code, 200); assert.deepEqual(res.body, { ok: true });
  assert.match(res.headers['Cache-Control'], /no-store/);
  const registro = f.registros.get(ID);
  assert.equal(registro.nombre, 'Ana María'); assert.equal(registro.correo, 'ana+curso@example.test');
  assert.equal(registro.whatsapp, '+573101234567'); assert.equal(registro.experiencia, 'microsoldadura');
  assert.equal(registro.curso, 'Reparación de placas de iPhone'); assert.equal(registro.utm_source, 'facebook'); assert.equal(registro.utm_campaign.length, 200);
  assert.ok(!('creado_en' in registro)); assert.ok(!('documento' in registro));
});

test('el mismo envío se puede reintentar sin duplicar ni reemplazar el contacto', async () => {
  const f = fixture();
  await llamar(f.handler);
  await llamar(f.handler, { body: { ...DATOS, nombre: 'Otro nombre' } });
  assert.equal(f.registros.size, 1); assert.equal(f.registros.get(ID).nombre, 'Ana María');
  assert.equal(f.llamadas[0].url.searchParams.get('on_conflict'), 'id');
});

test('rechaza acceso de lectura y envíos desde otro origen antes de consultar la base', async () => {
  const f = fixture();
  for (const method of ['GET', 'PATCH', 'DELETE']) assert.equal((await llamar(f.handler, { method })).code, 405);
  for (const origin of ['https://otro.test', undefined, 'null']) assert.equal((await llamar(f.handler, { origin: origin === undefined ? '' : origin })).code, 403);
  assert.equal(f.llamadas.length, 0);
});

test('valida formato, longitud, teléfono, experiencia e identificador antes de guardar', async () => {
  const f = fixture();
  for (const datos of [null, [], { nombre: 'A' }, { correo: 'sin-correo' }, { pais: '' }, { whatsapp: '300' }, { experiencia: '__proto__' }, { experiencia: ['android'] }, { envioId: 'no-uuid' }, { nombre: 'x'.repeat(161) }]) {
    const body = datos === null || Array.isArray(datos) ? datos : { ...DATOS, ...datos };
    assert.equal((await llamar(f.handler, { body })).code, 400);
  }
  assert.equal((await llamar(f.handler, { type: 'text/plain' })).code, 415);
  assert.equal((await llamar(f.handler, { body: { ...DATOS, extra: 'x'.repeat(9000) } })).code, 413);
  assert.equal(f.llamadas.length, 0);
});

test('un fallo de almacenamiento no responde éxito ni filtra el error de Supabase', async (t) => {
  t.mock.method(console, 'error', () => {});
  const f = fixture({ fallo: true }); const res = await llamar(f.handler);
  assert.equal(res.code, 500); assert.ok(!res.body.ok); assert.doesNotMatch(JSON.stringify(res.body), /42P01|Tabla no disponible/);
});
