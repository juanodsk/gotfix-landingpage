import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crearManejadorPago } from '../api/academy-pago.js';

const ID = '1292-1602113476-10985';
const payment = { id: ID, status: 'APPROVED', amount_in_cents: 81746600, currency: 'COP', customer_email: 'privado@ejemplo.test', customer_data: { full_name: 'Dato privado' } };
async function call(options = {}, request = {}) {
  const calls = [];
  const handler = crearManejadorPago({ obtenerClave: () => options.key ?? 'prv_test_fake', solicitar: async (url, init) => {
    calls.push({ url, init });
    if (options.fail) throw new Error('Proveedor no disponible');
    return new Response(JSON.stringify({ data: options.data ?? payment }), { status: options.status ?? 200 });
  } });
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(v) { this.code = v; return this; }, json(v) { this.body = v; return this; } };
  await handler({ method: 'GET', query: { id: ID }, ...request }, res);
  return { ...res, calls };
}

test('consulta autenticada solo desde servidor, sin datos personales ni llave en la respuesta', async () => {
  const res = await call();
  assert.equal(res.code, 200);
  assert.deepEqual(res.body, { id: ID, status: 'APPROVED', amount_in_cents: 81746600, currency: 'COP' });
  assert.equal(res.calls[0].url, `https://sandbox.wompi.co/v1/transactions/${ID}`);
  assert.equal(res.calls[0].init.headers.Authorization, 'Bearer prv_test_fake');
  assert.equal(res.headers['Cache-Control'], 'private, no-store');
  assert.equal(JSON.stringify(res.body).includes('privado'), false);
  const prod = await call({ key: 'prv_prod_fake' });
  assert.equal(prod.calls[0].url, `https://production.wompi.co/v1/transactions/${ID}`);
});

test('rechaza métodos, IDs inválidos y falta de llave antes de contactar a Wompi', async () => {
  for (const req of [{ method: 'POST' }, { query: {} }, { query: { id: ['abcde', 'fghij'] } }, { query: { id: '../admin' } }, { query: { id: 'x'.repeat(121) } }]) {
    const res = await call({}, req);
    assert.ok([400, 405].includes(res.code));
    assert.equal(res.calls.length, 0);
  }
  for (const key of ['', 'pub_prod_fake']) {
    const res = await call({ key });
    assert.equal(res.code, 503);
    assert.equal(res.calls.length, 0);
  }
});

test('no convierte fallos, transacciones distintas o importes inválidos en aprobaciones', async () => {
  for (const data of [{ ...payment, id: 'otra-transaccion' }, { ...payment, status: 'NEW_STATE' }, { ...payment, amount_in_cents: -1 }, { ...payment, currency: 'USD' }]) {
    const res = await call({ data });
    assert.equal(res.code, 502);
    assert.equal(res.body.status, undefined);
  }
  assert.equal((await call({ status: 404 })).code, 404);
  assert.equal((await call({ status: 401 })).code, 503);
  assert.equal((await call({ fail: true })).code, 503);
});

test('conserva todos los estados oficiales para que la interfaz no confunda pendiente, error o anulación con éxito', async () => {
  for (const status of ['PENDING', 'DECLINED', 'VOIDED', 'ERROR']) {
    const res = await call({ data: { ...payment, status } });
    assert.equal(res.code, 200);
    assert.equal(res.body.status, status);
  }
});
