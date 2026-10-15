// Consulta de solo lectura. La llave privada nunca se entrega al navegador.
export function crearManejadorPago({ solicitar = fetch, obtenerClave = () => process.env.WOMPI_PRIVATE_KEY } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ mensaje: 'Método no permitido.' });
    }
    const id = req.query?.id;
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{5,120}$/.test(id)) {
      return res.status(400).json({ mensaje: 'Referencia de pago no válida.' });
    }
    const clave = obtenerClave() || '';
    if (!/^prv_(prod|test)_\S+$/.test(clave)) {
      return res.status(503).json({ mensaje: 'El asesor puede validar tu pago con el comprobante.' });
    }
    const host = clave.startsWith('prv_test_') ? 'sandbox.wompi.co' : 'production.wompi.co';
    try {
      const respuesta = await solicitar(`https://${host}/v1/transactions/${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${clave}` },
        signal: AbortSignal.timeout(8000),
      });
      if (!respuesta.ok) return res.status(respuesta.status === 404 ? 404 : 503).json({ mensaje: 'No pudimos consultar el pago. Compártenos el comprobante.' });
      const { data } = await respuesta.json();
      if (data?.id !== id || !['APPROVED', 'PENDING', 'DECLINED', 'VOIDED', 'ERROR'].includes(data.status)) {
        return res.status(502).json({ mensaje: 'No pudimos confirmar el estado del pago.' });
      }
      if (!Number.isSafeInteger(data.amount_in_cents) || data.amount_in_cents <= 0 || data.currency !== 'COP') {
        return res.status(502).json({ mensaje: 'El asesor revisará los datos del comprobante.' });
      }
      return res.status(200).json({ id, status: data.status, amount_in_cents: data.amount_in_cents, currency: data.currency });
    } catch {
      return res.status(503).json({ mensaje: 'La consulta no está disponible. Compártenos el comprobante.' });
    }
  };
}

export default crearManejadorPago();
