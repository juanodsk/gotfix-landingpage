/* =========================================================================
   CONFIGURACIÓN DE LA LANDING
   Todo lo que cambia (precios, fechas, pagos, testimonios, videos, IDs de
   tracking) se edita AQUÍ. No hace falta tocar index.html ni main.js.
   Fechas: formato ISO con zona -05:00 (hora Colombia).
   ========================================================================= */
window.LANDING_CONFIG = {
  /* "A" = con VSL (video de venta) · "B" = página escrita, sin VSL.
     También se fuerza por URL: ?v=A o ?v=B. La oferta es idéntica en ambas. */
  variant: "B",

  /* Video de venta (solo variante A): un .mp4 (recomendado) o un enlace de YouTube.
     Arranca en silencio con la capa "Toca para ver con sonido" y controles visibles.
     Si está vacío, la variante A muestra un recuadro [VSL – PENDIENTE]. */
  vslUrl: "",
  vslPoster: "/ricardo-academy/img/ricardo-gotfix-800.webp",

  marca: "Ricardo Hernández",
  courseName: "Reparación de placas de iPhone",
  nivel: "BÁSICO – INTERMEDIO",

  /* Inicio CONFIRMADO: lunes 2 de noviembre de 2026, 1:00 p. m. (Colombia).
     La fecha de fin NO se muestra en la página mientras el calendario completo
     no esté confirmado (ver README → decisiones pendientes). */
  fechaInicio: "2026-11-02T13:00:00-05:00",
  fechaFin: null,
  fechaPendiente: false,

  horario: { dias: "Lunes, miércoles y viernes", inicio: "13:00", fin: "15:00" },

  /* LOTES DE PRECIO (solo los reales: preventa y precio normal)
     - cierre: fecha/hora ISO en que el lote deja de estar disponible.
     - El último lote lleva cierre: null.
     - Mientras la preventa esté abierta se muestra su cuenta regresiva.
       Al cerrar, la página pasa sola a US$470 y la cuenta regresiva desaparece.
     - estado: "auto" (por fecha) o "cerrado" (cerrar a mano).
     - checkoutUrl: enlace de pago de ESE lote (cada lote tiene su propio monto en Wompi).
       Al cerrar la preventa, los botones usan solos el enlace del precio normal.
     - cobro: lo que de verdad cobra la pasarela (Wompi cobra en pesos colombianos). */
  lotes: [
    { id: "preventa", nombre: "Preventa", precio: 257, cierre: "2026-10-25T23:59:59-05:00", estado: "auto", bonos: [],
      checkoutUrl: "https://checkout.wompi.co/l/ClzfzW", cobro: "COP 817.466" },
    { id: "normal", nombre: "Precio normal", precio: 470, cierre: null, estado: "auto", bonos: [],
      checkoutUrl: "", cobro: "" } // ⛔ PENDIENTE: enlace de Wompi por el valor de US$470 en COP
  ],
  moneda: "USD",

  /* BONOS: vacío = la sección no aparece. No inventar bonos. */
  bonos: [],

  /* GARANTÍA: inactiva = la sección no aparece. No inventar políticas. */
  garantia: { activa: false, titulo: "", texto: "" },

  /* TESTIMONIOS REALES Y AUTORIZADOS (no inventar ni editar lo que dijo el estudiante).
     { nombre, pais, video: "img/testi-1.mp4", poster: "img/testi-1.webp", texto (cita literal opcional), tema: "Interpretar consumos" } */
  testimonios: [
    {
      "nombre": "Camilo F.",
      "video": "/ricardo-academy/videos/testimonio-camilo-f-720p-web-f520c45d8f4e.mp4",
      "poster": "/ricardo-academy/videos/testimonio-camilo-f-poster-e2eb92147587.webp",
      "original": "https://gotfix-supabase-cb387e-152-53-91-93.sslip.io/storage/v1/object/sign/VIDEOS/LANDING%20CURSO/TESTIMONIO%20CAMILO%20F.MOV?token=eyJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWSURFT1MvTEFORElORyBDVVJTTy9URVNUSU1PTklPIENBTUlMTyBGLk1PViIsImlhdCI6MTc5MjEwNjEwMiwiZXhwIjozMzMyODEwNjEwMn0.RBF6Yp7ilswDJpNWfPo0h6EHa-w9J1W0Ftb_SjQOj9U"
    },
    {
      "nombre": "Juan",
      "video": "/ricardo-academy/videos/testimonio-juan-720p-web-37366abec936.mp4",
      "poster": "/ricardo-academy/videos/testimonio-juan-poster-1f2958c069b7.webp",
      "original": "https://gotfix-supabase-cb387e-152-53-91-93.sslip.io/storage/v1/object/sign/VIDEOS/LANDING%20CURSO/TESTIMONIO%20JUAN%20.MOV?token=eyJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWSURFT1MvTEFORElORyBDVVJTTy9URVNUSU1PTklPIEpVQU4gLk1PViIsImlhdCI6MTc5MjEwNjE1MywiZXhwIjozMzMyODEwNjE1M30.z74sLSPZgb85Tmd5dDyAHqgDClneomU0ap5WShaVLb0"
    },
    {
      "nombre": "Kevin",
      "video": "/ricardo-academy/videos/testimonio-kevin-720p-web-ceec84478119.mp4",
      "poster": "/ricardo-academy/videos/testimonio-kevin-poster-da46b39994f2.webp",
      "original": "https://gotfix-supabase-cb387e-152-53-91-93.sslip.io/storage/v1/object/sign/VIDEOS/LANDING%20CURSO/TESTIMONIO%20KEVIN.MOV?token=eyJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWSURFT1MvTEFORElORyBDVVJTTy9URVNUSU1PTklPIEtFVklOLk1PViIsImlhdCI6MTc5MjEwNjE2NSwiZXhwIjozMzMyODEwNjE2NX0.qvsruj-FAET_uvSaiUggrmUbzWZ1hOUIFG9gR5Y5pE0"
    },
    {
      "nombre": "Yan Carlos",
      "video": "/ricardo-academy/videos/testimonio-yan-carlos-720p-web-2e59cf9987a4.mp4",
      "poster": "/ricardo-academy/videos/testimonio-yan-carlos-poster-f7171ba79138.webp",
      "original": "https://gotfix-supabase-cb387e-152-53-91-93.sslip.io/storage/v1/object/sign/VIDEOS/LANDING%20CURSO/TESTIMONIO%20YAN%20CARLOS%20.MOV?token=eyJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWSURFT1MvTEFORElORyBDVVJTTy9URVNUSU1PTklPIFlBTiBDQVJMT1MgLk1PViIsImlhdCI6MTc5MjEwNjE4NCwiZXhwIjozMzMyODEwNjE4NH0.ey5f6AJyhzO5Vx1hTatnqXXKnk9ofbqsAQ8lhSICbKg"
    }
  ],

  /* EVIDENCIA DEL LABORATORIO: videos y fotos reales de Ricardo.
     { tipo: "video" | "foto", src, poster (video), titulo, vertical: true|false } */
  evidencia: [],

  /* true = muestra los recuadros [PENDIENTE] donde falta material real */
  mostrarPlaceholders: true,

  /* PAGO (Wompi). Los botones "Inscribirme" y "Quiero comenzar mi formación" usan el
     checkoutUrl del lote activo; si el lote no tiene, usan este de respaldo.
     Si ninguno existe, bajan a la sección de precio y se ve [ENLACE DE PAGO – PENDIENTE]. */
  checkoutUrl: "",
  pasarela: "Wompi",
  metodosPago: "Tarjeta débito o crédito (Visa, Mastercard, American Express), PSE, Nequi, transferencia o corresponsales Bancolombia.",

  /* Página de agradecimiento (gracias.html). En Wompi, configura la "URL de redirección"
     del enlace de pago como https://gotfix.co/ricardo-academy/gracias.html. Wompi agrega ?id=<transacción>.
     La página consulta a Wompi y solo registra "Purchase" si el pago está APROBADO. */
  purchaseParam: "id",
  verificarWompi: true,

  whatsappNumero: "573133068507",
  whatsappMensaje: "Hola, quiero hablar con el Asesor Académico sobre el curso de placas de iPhone. Ref: {variante}-{utm_campaign}",

  /* Tracking (vacío = desactivado) */
  metaPixelId: "",
  ga4Id: "",
  /* Formulario de WhatsApp → CRM/webhook (POST con JSON). Ver ENTREGA_INGENIERO.md.
     leadWebhookSimple: true si el destino es Google Apps Script (envía el JSON como text/plain). */
  leadWebhookUrl: "",
  leadWebhookSimple: false,

  siteUrl: "https://gotfix.co/ricardo-academy"
};
