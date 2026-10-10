// Datos simulados exclusivamente para la revisión visual local. No son clientes reales.
async (page) => {
  let autenticado = false;
  const casos = [
    { id: '10000000-0000-4000-8000-000000000001', radicado: 'PQRS-2026-0001', nombre: 'Ana María Rodríguez', documento: '1075123456', correo: 'ana.rodriguez@ejemplo.test', whatsapp: '3101234567', orden: 'GF-2481', estado: 'radicado', creado_en: '2026-10-09T15:30:00Z', actualizado_en: '2026-10-09T15:30:00Z', descripcion: 'El equipo volvió a presentar la falla después de la reparación.\nSolicito una revisión de la garantía.', paso_por_tienda: true, adjuntos: [{ ruta: 'prueba/foto.png', nombre: 'foto-del-equipo.png' }] },
    { id: '20000000-0000-4000-8000-000000000002', radicado: 'PQRS-2026-0002', nombre: 'Carlos Andrés Martínez', documento: '1234567890', correo: 'carlos.martinez@ejemplo.test', whatsapp: '3207654321', orden: null, estado: 'en_tramite', creado_en: '2026-10-08T20:10:00Z', actualizado_en: '2026-10-09T17:10:00Z', descripcion: 'Quisiera conocer el resultado del diagnóstico.', paso_por_tienda: false, adjuntos: [] },
  ];
  const aceptaciones = [
    { id: casos[0].id, nombre: casos[0].nombre, documento: casos[0].documento, correo: casos[0].correo, whatsapp: casos[0].whatsapp, equipo: 'iPhone 13 Pro', orden: 'GF-2481', version_terminos: '2026-09', creado_en: casos[0].creado_en },
    { id: casos[1].id, nombre: casos[1].nombre, documento: casos[1].documento, correo: casos[1].correo, whatsapp: casos[1].whatsapp, equipo: 'MacBook Air M1', orden: 'GF-2450', version_terminos: '2026-09', creado_en: casos[1].creado_en },
  ];
  const historial = [];
  await page.route('**/api/admin*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (url.pathname.endsWith('/admin-sesion')) {
      if (request.method() === 'POST') {
        const datos = request.postDataJSON();
        if (datos.correo !== 'administrador@gotfix.test' || datos.clave !== 'Prueba-Gotfix-2026') return json(401, { mensaje: 'Correo o contraseña incorrectos, o cuenta sin acceso.' });
        autenticado = true;
      }
      if (request.method() === 'DELETE') { autenticado = false; return json(200, { ok: true }); }
      return autenticado ? json(200, { correo: 'administrador@gotfix.test' }) : json(401, { mensaje: 'Inicia sesión para acceder al panel.' });
    }
    if (!autenticado) return json(401, { mensaje: 'Tu sesión venció. Vuelve a iniciar sesión.' });
    if (request.method() === 'PATCH') {
      const datos = request.postDataJSON();
      const pqr = casos.find((r) => r.id === datos.id);
      if (datos.nota === 'forzar conflicto') { pqr.estado = 'respondido'; return json(409, { mensaje: 'El estado cambió desde que abriste el caso. Actualiza el detalle antes de guardar.' }); }
      historial.unshift({ id: `historial-${historial.length}`, estado_anterior: pqr.estado, estado_nuevo: datos.estado, nota: datos.nota, admin_correo: 'administrador@gotfix.test', creado_en: '2026-10-10T14:00:00Z' });
      pqr.estado = datos.estado; pqr.actualizado_en = '2026-10-10T14:00:00Z';
      return json(200, { ok: true });
    }
    const recurso = url.searchParams.get('recurso');
    if (recurso === 'detalle') return json(200, { pqr: casos.find((r) => r.id === url.searchParams.get('id')), historial });
    if (['pdf', 'adjunto'].includes(recurso)) return json(200, { url: '/mock-archivo', nombre: recurso === 'pdf' ? 'GOTFIX-Aceptacion-prueba.pdf' : 'foto-del-equipo.png' });
    let registros = recurso === 'pqrs' ? casos : aceptaciones;
    const buscar = url.searchParams.get('buscar')?.toLowerCase();
    const estado = url.searchParams.get('estado');
    if (buscar) registros = registros.filter((r) => Object.values(r).some((v) => typeof v === 'string' && v.toLowerCase().includes(buscar)));
    if (estado) registros = registros.filter((r) => r.estado === estado);
    return json(200, { registros, total: registros.length, pagina: 1, limite: 25 });
  });
  await page.route('**/mock-archivo', (route) => route.fulfill({ contentType: 'application/pdf', body: '%PDF-1.4\n% Documento simulado para probar descarga\n%%EOF' }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload();
  await page.getByRole('heading', { name: 'Administración', exact: true }).waitFor();
  await page.screenshot({ path: '.impeccable/review/login-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.impeccable/review/login-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  return 'Mock local preparado. Capturas del login en escritorio y celular.';
}
