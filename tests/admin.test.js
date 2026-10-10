import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createClient } from '@supabase/supabase-js';
import { crearManejadorAdmin } from '../api/admin.js';
import { crearManejadorSesion } from '../api/admin-sesion.js';

process.env.ADMIN_EMAIL = 'admin@gotfix.test';
const ID = '10000000-0000-4000-8000-000000000001';
const ADMIN = { id: ID, email: 'admin@gotfix.test', email_confirmed_at: '2026-10-10T00:00:00Z' };
const PQR = { id: ID, estado: 'radicado', radicado: 'PQRS-2026-0001', adjuntos: [{ ruta: `${ID}/1-foto.png`, nombre: 'foto.png' }] };

function fixture(opciones = {}) {
  const llamadas = [];
  const respuesta = (datos, status = 200, headers = {}) => new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json', ...headers } });
  const fetch = async (url, init) => {
    const u = new URL(url); llamadas.push({ url: u, init });
    if (u.pathname === '/auth/v1/user') return opciones.tokenInvalido ? respuesta({ message: 'Invalid JWT' }, 401) : respuesta(opciones.user || ADMIN);
    if (u.pathname === '/auth/v1/token') return opciones.loginInvalido ? respuesta({ message: 'Invalid credentials' }, 400) : respuesta({ access_token: 'token-valido', refresh_token: 'refresh', token_type: 'bearer', expires_in: 3600, user: opciones.user || ADMIN });
    if (u.pathname.startsWith('/auth/v1/logout')) return respuesta({});
    if (u.pathname.includes('/rpc/')) return opciones.rpcError ? respuesta({ code: opciones.rpcError, message: 'Prueba de conflicto' }, 400) : respuesta(null);
    if (u.pathname.includes('/storage/v1/object/sign/')) return opciones.sinArchivo ? respuesta({ statusCode: '404', error: 'not_found', message: 'Object not found' }, 404) : respuesta({ signedURL: '/object/sign/firmas/prueba.pdf?token=temporal' });
    if (u.pathname === '/rest/v1/pqrs_seguimiento') return respuesta([]);
    if (u.pathname === '/rest/v1/pqrs') return respuesta(opciones.sinRegistro ? [] : [PQR], 200, { 'Content-Range': '0-0/26' });
    if (u.pathname === '/rest/v1/aceptaciones_terminos') return respuesta(opciones.sinRegistro ? [] : [{ id: ID, nombre: 'Ana', firma_url: `firmas/2026/${ID}/firma.png` }], 200, { 'Content-Range': '0-0/1' });
    throw new Error(`Petición inesperada: ${u.pathname}`);
  };
  const cliente = () => createClient('https://prueba.supabase.co', 'clave-de-prueba', { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch } });
  const servicio = cliente();
  return { llamadas, admin: crearManejadorAdmin({ servicio: () => servicio }), sesion: crearManejadorSesion({ servicio: () => servicio, autenticacion: cliente }) };
}

async function llamar(handler, { method = 'GET', query = { recurso: 'pqrs' }, body, cookie = 'gotfix_admin=token-valido', origin = 'https://gotfix.test' } = {}) {
  const req = { method, query, body, headers: { cookie, origin, host: 'gotfix.test', 'x-forwarded-proto': 'https' } };
  const res = { headers: {}, statusCode: 200, setHeader(k, v) { this.headers[k] = v; }, status(v) { this.statusCode = v; return this; }, json(v) { this.body = v; return this; } };
  await handler(req, res); return res;
}

for (const recurso of ['pqrs', 'aceptaciones', 'detalle', 'pdf', 'adjunto']) {
  test(`${recurso}: sin sesión se rechaza y no se consulta ningún registro`, async () => {
    const f = fixture(); const r = await llamar(f.admin, { cookie: '', query: { recurso, id: ID } });
    assert.equal(r.statusCode, 401); assert.equal(f.llamadas.length, 0);
    assert.match(r.headers['Cache-Control'], /no-store/);
  });
}
test('una sesión inválida recibe 401 y elimina la cookie', async () => {
  const r = await llamar(fixture({ tokenInvalido: true }).admin);
  assert.equal(r.statusCode, 401); assert.match(r.headers['Set-Cookie'], /Max-Age=0/);
});
test('un usuario autenticado sin permiso recibe 403 aunque declare ser admin en sus metadatos', async () => {
  const f = fixture({ user: { ...ADMIN, email: 'cliente@gotfix.test', user_metadata: { role: 'admin' } } });
  const r = await llamar(f.admin); assert.equal(r.statusCode, 403); assert.equal(f.llamadas.length, 1);
});
test('login correcto usa cookie HttpOnly, Secure y SameSite; no devuelve tokens', async () => {
  const r = await llamar(fixture().sesion, { method: 'POST', body: { correo: ADMIN.email, clave: 'contraseña-prueba' }, cookie: '' });
  assert.equal(r.statusCode, 200); assert.deepEqual(r.body, { correo: ADMIN.email });
  for (const propiedad of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/api', 'Max-Age=3600']) assert.ok(r.headers['Set-Cookie'].includes(propiedad));
});
test('login con credenciales incorrectas y cuentas no autorizadas o no confirmadas', async () => {
  for (const opciones of [{ loginInvalido: true }, { user: { ...ADMIN, email: 'cliente@gotfix.test' } }, { user: { ...ADMIN, email_confirmed_at: null } }]) {
    const r = await llamar(fixture(opciones).sesion, { method: 'POST', body: { correo: ADMIN.email, clave: 'prueba' } });
    assert.equal(r.statusCode, 401); assert.match(r.headers['Set-Cookie'], /Max-Age=0/);
  }
});
test('login y cambios rechazan peticiones de otro origen antes de autenticar', async () => {
  const f = fixture();
  for (const [handler, method] of [[f.sesion, 'POST'], [f.sesion, 'DELETE'], [f.admin, 'PATCH']]) {
    const r = await llamar(handler, { method, origin: 'https://otro.test' }); assert.equal(r.statusCode, 403);
  }
  assert.equal(f.llamadas.length, 0);
});
test('PATCH no permite modificar datos sin sesión', async () => {
  const f = fixture(); const r = await llamar(f.admin, { method: 'PATCH', cookie: '', body: { id: ID, estado: 'cerrado', estadoAnterior: 'radicado' } });
  assert.equal(r.statusCode, 401); assert.equal(f.llamadas.length, 0);
});
test('listado busca en servidor, filtra estado y pagina sin exponer datos de firma', async () => {
  const f = fixture(); const r = await llamar(f.admin, { query: { recurso: 'pqrs', buscar: 'Ana', estado: 'en_tramite', pagina: '2' } });
  assert.equal(r.statusCode, 200); assert.equal(r.body.total, 26); assert.equal(r.body.limite, 25);
  const u = f.llamadas.at(-1).url; assert.equal(u.searchParams.get('offset'), '25'); assert.equal(u.searchParams.get('limit'), '25');
  assert.equal(u.searchParams.get('estado'), 'eq.en_tramite'); assert.match(u.searchParams.get('or'), /nombre.ilike/);
  const a = await llamar(f.admin, { query: { recurso: 'aceptaciones', buscar: '123' } }); assert.equal(a.statusCode, 200);
  assert.doesNotMatch(f.llamadas.at(-1).url.searchParams.get('select'), /(^|,)(firma_url|hash_terminos|user_agent|ip)(,|$)/);
});
test('búsqueda escapa operadores de PostgREST', async () => {
  const f = fixture(); await llamar(f.admin, { query: { recurso: 'pqrs', buscar: 'Ana"),estado.eq.cerrado,%' } });
  const filtro = f.llamadas.at(-1).url.searchParams.get('or');
  assert.doesNotMatch(filtro, /estado\.eq\.cerrado,/); assert.ok(!filtro.includes('%'));
});
test('rechaza páginas y enums fuera del contrato', async () => {
  for (const query of [{ recurso: 'pqrs', pagina: '0' }, { recurso: 'pqrs', pagina: '1.5' }, { recurso: 'pqrs', estado: 'eliminado' }]) assert.equal((await llamar(fixture().admin, { query })).statusCode, 400);
  for (const estado of ['eliminado', ['radicado']]) assert.equal((await llamar(fixture().admin, { method: 'PATCH', body: { id: ID, estado, estadoAnterior: 'radicado' } })).statusCode, 400);
  assert.equal((await llamar(fixture().admin, { query: { recurso: 'detalle', id: [ID] } })).statusCode, 400);
});
test('actualización toma la identidad del servidor y pasa el estado leído para evitar sobrescrituras', async () => {
  const f = fixture(); const r = await llamar(f.admin, { method: 'PATCH', body: { id: ID, estado: 'en_tramite', estadoAnterior: 'radicado', nota: '  Se revisó el equipo  ', admin_correo: 'impostor@test' } });
  assert.equal(r.statusCode, 200); const enviado = JSON.parse(f.llamadas.at(-1).init.body);
  assert.equal(enviado.p_admin_correo, ADMIN.email); assert.equal(enviado.p_admin_id, ADMIN.id);
  assert.equal(enviado.p_estado_anterior, 'radicado'); assert.equal(enviado.p_nota, 'Se revisó el equipo');
});
test('conflicto de estado devuelve 409; un caso inexistente devuelve 404', async () => {
  for (const [code, esperado] of [['40001', 409], ['P0002', 404]]) {
    const r = await llamar(fixture({ rpcError: code }).admin, { method: 'PATCH', body: { id: ID, estado: 'cerrado', estadoAnterior: 'radicado' } }); assert.equal(r.statusCode, esperado);
  }
});
test('acepta notas sin transición, exige contenido y respeta el límite', async () => {
  const body = { id: ID, estado: 'radicado', estadoAnterior: 'radicado' };
  assert.equal((await llamar(fixture().admin, { method: 'PATCH', body })).statusCode, 400);
  assert.equal((await llamar(fixture().admin, { method: 'PATCH', body: { ...body, nota: 'Contactado por WhatsApp' } })).statusCode, 200);
  assert.equal((await llamar(fixture().admin, { method: 'PATCH', body: { ...body, nota: 'a'.repeat(2001) } })).statusCode, 400);
});
test('descarga el PDF histórico desde la ruta guardada y firma un enlace de solo 60 segundos', async () => {
  const f = fixture(); const r = await llamar(f.admin, { query: { recurso: 'pdf', id: ID, ruta: 'otro/pdf.pdf' } });
  assert.equal(r.statusCode, 200); const peticion = f.llamadas.at(-1);
  assert.ok(peticion.url.pathname.endsWith(`/firmas/2026/${ID}/aceptacion.pdf`));
  assert.equal(JSON.parse(peticion.init.body).expiresIn, 60); assert.ok(r.body.nombre.endsWith('.pdf'));
});
test('aceptación inexistente o PDF ausente devuelve 404', async () => {
  for (const opciones of [{ sinRegistro: true }, { sinArchivo: true }]) {
    const r = await llamar(fixture(opciones).admin, { query: { recurso: 'pdf', id: ID } }); assert.equal(r.statusCode, 404);
  }
});
test('adjuntos se consultan por índice del registro, sin aceptar rutas del navegador', async () => {
  const f = fixture(); const r = await llamar(f.admin, { query: { recurso: 'adjunto', id: ID, indice: '0', ruta: 'otro/privado.pdf' } });
  assert.equal(r.statusCode, 200); assert.ok(f.llamadas.at(-1).url.pathname.endsWith(`/pqrs-adjuntos/${ID}/1-foto.png`));
  assert.equal((await llamar(f.admin, { query: { recurso: 'adjunto', id: ID, indice: '50' } })).statusCode, 404);
});
test('logout borra la cookie y revoca la sesión de Auth', async () => {
  const f = fixture(); const r = await llamar(f.sesion, { method: 'DELETE' });
  assert.equal(r.statusCode, 200); assert.match(r.headers['Set-Cookie'], /Max-Age=0/);
  assert.match(f.llamadas.at(-1).url.pathname, /logout/);
});
