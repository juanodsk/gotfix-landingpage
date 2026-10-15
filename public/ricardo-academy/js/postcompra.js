(() => {
  'use strict';
  const cfg = window.LANDING_CONFIG || {};
  const byId = (id) => document.getElementById(id);
  const form = byId('purchaseForm');
  const name = byId('buyerName');
  const error = byId('nameError');
  const submit = byId('whatsappSubmit');
  const recheck = byId('recheck');
  const query = new URLSearchParams(location.search);
  const rawTx = query.get(cfg.purchaseParam || 'id');
  const tx = /^[a-zA-Z0-9_-]{5,120}$/.test(rawTx || '') ? rawTx : '';
  const number = String(cfg.whatsappNumero || '').replace(/\D/g, '');
  let state = 'desconocido';
  let checking = false;
  let purchaseTracked = false;

  function buyerName() { return name.value.replace(/\s+/g, ' ').trim(); }

  function message() {
    const buyer = buyerName() || '[tu nombre]';
    const intro = {
      pendiente: 'Hola, inicié el pago del curso de reparación de placas de iPhone y aparece en proceso.',
      rechazado: 'Hola, intenté comprar el curso de reparación de placas de iPhone, pero el pago no fue aprobado.',
    }[state] || 'Hola, he realizado mi compra del curso de reparación de placas de iPhone.';
    const next = state === 'rechazado'
      ? '¿Me ayudas a revisar el pago y completar mi inscripción?'
      : 'Quiero confirmar mi inscripción y recibir las indicaciones para acceder a las clases. Adjunto mi comprobante de pago.';
    return `${intro} Mi nombre es ${buyer}. ${next}${tx ? ` Referencia de la transacción: ${tx}.` : ''}`;
  }

  function refreshMessage() {
    const text = message();
    byId('messagePreview').textContent = text;
    byId('whatsappMessage').value = text;
  }

  function render(next, payment) {
    state = next;
    const copy = {
      consultando: ['Estamos consultando tu pago', 'Puedes escribir tu nombre mientras confirmamos la información.'],
      aprobado: ['Pago aprobado', 'Tu pago fue aprobado. Envíale el comprobante al asesor para completar tu inscripción.'],
      pendiente: ['Tu pago está en proceso', 'Wompi aún está procesando el pago. Comparte el comprobante con el asesor y vuelve a consultar en unos minutos.'],
      rechazado: ['El pago no fue aprobado', 'Puedes volver a intentarlo o pedirle ayuda al asesor. Si ves un movimiento en tu cuenta, compártele el comprobante para revisarlo.'],
      desconocido: ['Confirmación con el asesor', 'Envíanos tu comprobante para que podamos validar tu pago y orientarte con el acceso.'],
    }[next];
    byId('paymentLabel').textContent = copy[0];
    byId('paymentNote').textContent = copy[1];
    if (next === 'aprobado' && payment) {
      byId('paymentLabel').textContent += ` · ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: payment.currency, maximumFractionDigits: 0 }).format(payment.amount_in_cents / 100)} COP`;
    }
    byId('purchaseTitle').innerHTML = next === 'rechazado' ? 'Revisemos<br>tu <span>pago.</span>'
      : next === 'pendiente' ? 'Tu inscripción<br>está en <span>camino.</span>' : '¡Gracias por<br>tu <span>compra!</span>';
    byId('purchaseIntro').textContent = next === 'rechazado'
      ? 'Estamos aquí para ayudarte a completar tu compra. Escríbele al asesor y revisen juntos lo que pasó.'
      : 'Estás un paso más cerca de entender lo que pasa en una placa de iPhone. Ahora, completemos tu inscripción.';
    byId('retry').hidden = next !== 'rechazado';
    recheck.hidden = !tx || next === 'aprobado' || next === 'rechazado' || !cfg.verificarWompi;
    recheck.disabled = next === 'consultando';
    recheck.textContent = next === 'consultando' ? 'Consultando…' : 'Volver a consultar el pago';
    byId('whatsappButtonText').textContent = next === 'rechazado' ? 'Pedir ayuda por WhatsApp' : 'Confirmar por WhatsApp';
    refreshMessage();
  }

  // Solo después de una respuesta APPROVED del servidor. No se toma el estado de la URL.
  function trackPurchase(payment) {
    if (purchaseTracked || (!cfg.metaPixelId && !cfg.ga4Id)) return;
    const key = `lp_purchase_${tx}`;
    try { if (localStorage.getItem(key)) return; } catch { /* Almacenamiento opcional. */ }
    const value = payment.amount_in_cents / 100;
    const currency = payment.currency;
    const variant = query.get('variant') === 'A' ? 'A' : 'B';
    if (cfg.metaPixelId) {
      if (!window.fbq) {
        const fbq = function () { fbq.callMethod ? fbq.callMethod(...arguments) : fbq.queue.push(arguments); };
        fbq.queue = []; fbq.loaded = true; fbq.version = '2.0';
        window.fbq = fbq; window._fbq = fbq;
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/fbevents.js'; script.async = true;
        document.head.appendChild(script);
      }
      window.fbq('init', cfg.metaPixelId);
      window.fbq('track', 'Purchase', { value, currency, variant }, { eventID: `purchase_${tx}` });
    }
    if (cfg.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4Id)}`; script.async = true;
      document.head.appendChild(script);
      window.gtag('js', new Date()); window.gtag('config', cfg.ga4Id);
      window.gtag('event', 'purchase', { transaction_id: tx, value, currency, variant });
    }
    purchaseTracked = true;
    try { localStorage.setItem(key, '1'); } catch { /* Sin persistencia, se evita repetir durante esta visita. */ }
  }

  async function checkPayment() {
    if (checking || !tx || !cfg.verificarWompi) { if (!checking) render('desconocido'); return; }
    checking = true;
    render('consultando');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`/api/academy-pago?id=${encodeURIComponent(tx)}`, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('Consulta no disponible');
      const payment = await response.json();
      if (payment.id !== tx) throw new Error('Referencia diferente');
      if (payment.status === 'APPROVED' && Number.isSafeInteger(payment.amount_in_cents) && payment.amount_in_cents > 0 && payment.currency === 'COP') {
        render('aprobado', payment);
        try { trackPurchase(payment); } catch { /* La medición no interrumpe la inscripción. */ }
      } else if (payment.status === 'PENDING') render('pendiente');
      else if (['DECLINED', 'VOIDED', 'ERROR'].includes(payment.status)) render('rechazado');
      else render('desconocido');
    } catch { render('desconocido'); }
    finally { clearTimeout(timeout); checking = false; }
  }

  try {
    const lead = JSON.parse(sessionStorage.getItem('lp_lead') || '{}');
    if (typeof lead?.nombre === 'string') name.value = lead.nombre.slice(0, 100);
  } catch { /* El nombre también se puede escribir aquí. */ }
  if (tx) {
    byId('paymentReference').textContent = `Referencia de la transacción: ${tx}`;
    byId('paymentReference').hidden = false;
  }
  if (/^\d{10,15}$/.test(number)) {
    form.action = `https://wa.me/${number}`;
    submit.disabled = false;
  } else {
    error.textContent = 'El canal de WhatsApp no está disponible. Vuelve al curso para contactarnos.';
    error.hidden = false;
  }
  name.addEventListener('input', () => {
    name.removeAttribute('aria-invalid'); error.hidden = true; refreshMessage();
  });
  form.addEventListener('submit', (event) => {
    const value = buyerName();
    if (submit.disabled || value.length < 2 || !/\p{L}/u.test(value)) {
      event.preventDefault();
      error.textContent = 'Escribe tu nombre completo para preparar el mensaje.';
      error.hidden = false; name.setAttribute('aria-invalid', 'true'); name.focus();
      return;
    }
    name.value = value;
    refreshMessage();
    // El envío nativo abre únicamente el borrador de WhatsApp; el comprador decide enviarlo.
  });
  recheck.addEventListener('click', checkPayment);
  refreshMessage();
  checkPayment();
})();
