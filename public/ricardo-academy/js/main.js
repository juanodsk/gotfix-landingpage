/* ==========================================================================
   Lógica de la landing: variantes, lotes (UTC-5), cuenta regresiva de la
   preventa, VSL, UTM, WhatsApp, formulario y tracking (Meta Pixel + GA4).
   Todo lo editable vive en js/config.js.

   Eventos (ver README):
   - Contact          → clic en un botón de WhatsApp (NO es un lead)
   - Lead             → formulario enviado y recibido por el webhook (lead real)
   - InitiateCheckout → clic hacia la pasarela de pago (NO es una matrícula)
   - Purchase         → solo en gracias.html, con confirmación de la pasarela
   - VSL_*            → reproducción, sonido y progreso del video (variante A)
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.LANDING_CONFIG || {};
  var variant = document.documentElement.getAttribute("data-variant") || "B";
  var TZ = "America/Bogota";
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

  /* ---------------- Utilidades ---------------- */
  function usd(n) { return "US$" + Number(n).toLocaleString("es-CO", { maximumFractionDigits: 0 }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ts(iso) { return iso ? new Date(iso).getTime() : null; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso, opts) {
    try { return new Intl.DateTimeFormat("es-CO", Object.assign({ timeZone: TZ }, opts)).format(new Date(iso)); }
    catch (e) { return ""; }
  }
  function put(el, txt) { if (el && el.textContent !== txt) el.textContent = txt; } // evita relayout si no cambió
  function setText(sel, txt) { $$(sel).forEach(function (el) { put(el, txt); }); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(sessionStorage.getItem(key) || "null");
      sessionStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  /* ---------------- UTM ---------------- */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id", "fbclid"];
  var utm = (function () {
    var saved = store("lp_utm") || {};
    var qs = new URLSearchParams(location.search);
    var found = false, fresh = {};
    UTM_KEYS.forEach(function (k) { var v = qs.get(k); if (v) { fresh[k] = v.slice(0, 200); found = true; } });
    var out = found ? fresh : saved;
    if (found) store("lp_utm", out);
    return out;
  })();

  function withParams(url, extra) {
    try {
      var u = new URL(url, location.href);
      UTM_KEYS.forEach(function (k) { if (utm[k]) u.searchParams.set(k, utm[k]); });
      Object.keys(extra || {}).forEach(function (k) { u.searchParams.set(k, extra[k]); });
      return u.toString();
    } catch (e) { return url; }
  }

  /* ---------------- Tracking ---------------- */
  function loadPixel(id) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id);
    window.fbq("track", "PageView", { variant: variant });
  }
  function loadGA(id) {
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { variant: variant });
    window.gtag("set", "user_properties", { landing_variant: variant });
  }
  // Meta estándar → nombre GA4
  var STANDARD = { ViewContent: "view_item", Contact: "contact_whatsapp", Lead: "generate_lead", InitiateCheckout: "begin_checkout" };
  function track(name, params) {
    var p = Object.assign({ variant: variant }, params || {});
    try {
      if (window.fbq) { if (STANDARD[name]) window.fbq("track", name, p); else window.fbq("trackCustom", name, p); }
      if (window.gtag) window.gtag("event", STANDARD[name] || name, p);
    } catch (e) { /* nunca romper la página por tracking */ }
    if (isLocal) console.info("[track]", name, p);
  }
  function initTracking() {
    if (cfg.metaPixelId) loadPixel(cfg.metaPixelId);
    if (cfg.ga4Id) loadGA(cfg.ga4Id); // PageView / page_view se envían al iniciar Pixel y GA4
    track("ViewContent", { content_name: cfg.courseName });
  }

  /* ---------------- Lotes ---------------- */
  var state = {};
  function computeLotes(now) {
    var lotes = (cfg.lotes || []).map(function (l) { return Object.assign({}, l, { _cierre: ts(l.cierre) }); });
    var active = null;
    lotes.forEach(function (l) {
      var manual = l.estado && l.estado !== "auto" ? l.estado : null;
      if (manual === "cerrado" || (!manual && l._cierre && now > l._cierre)) { l._estado = "cerrado"; return; }
      if (!active) { active = l; l._estado = "activo"; } else { l._estado = "próximo"; }
    });
    if (!active && lotes.length) { active = lotes[lotes.length - 1]; active._estado = "activo"; }
    var idx = lotes.indexOf(active);
    var next = lotes.slice(idx + 1).filter(function (l) { return l._estado !== "cerrado"; })[0] || null;
    var maxPrice = lotes.reduce(function (m, l) { return Math.max(m, l.precio); }, 0);
    return {
      lotes: lotes, active: active, next: next,
      tachado: active.precio < maxPrice ? maxPrice : null,
      ahorro: active.precio < maxPrice ? maxPrice - active.precio : 0,
      // Solo hay cuenta regresiva si el lote activo tiene una fecha real de cierre
      target: next && active._cierre ? active._cierre : null
    };
  }

  function priceLine(s) {
    if (s.ahorro) return s.active.nombre + " " + usd(s.active.precio) + " · Ahorras " + usd(s.ahorro) + " · Pago único";
    return "Precio " + usd(s.active.precio) + " · Pago único";
  }

  function renderPrices(s) {
    setText("[data-price-line]", priceLine(s));
    setText("[data-precio-actual]", usd(s.active.precio));
    setText("[data-precio-tachado]", s.tachado ? usd(s.tachado) : "");
    setText("[data-lote-nombre]", s.active.nombre);
    // Lo que de verdad cobra la pasarela (Wompi cobra en pesos colombianos)
    $$("[data-cobro]").forEach(function (el) {
      el.hidden = !s.active.cobro;
      el.textContent = s.active.cobro
        ? "Se cobra en pesos colombianos: " + s.active.cobro + " (equivale a " + usd(s.active.precio) + "), pago seguro con " + (cfg.pasarela || "la pasarela") + ". Si pagas desde otro país, tu banco hace la conversión."
        : "";
    });

    var urg = s.target
      ? s.active.nombre + " a " + usd(s.active.precio) + " hasta el " + fmtDate(s.active.cierre, { day: "numeric", month: "long" }) + " a las 11:59 p. m. (hora Colombia). Desde el día siguiente, " + usd(s.next.precio) + "."
      : "Inscripciones abiertas. El curso inicia el " + fmtDate(cfg.fechaInicio, { weekday: "long", day: "numeric", month: "long" }) + ".";
    setText("[data-urgency]", urg);

    var contrast = $("[data-contrast]");
    if (contrast) contrast.innerHTML = s.target && s.next.precio > s.active.precio
      ? "Inscribirte después del cierre de la preventa = <strong>pagar " + usd(s.next.precio - s.active.precio) + " más</strong> por el mismo curso."
      : "";

    // La cuenta regresiva solo existe mientras hay una fecha real de cierre
    $$("[data-cd-block]").forEach(function (el) { el.hidden = !s.target; });
    $$(".stickybar__cd").forEach(function (el) { el.hidden = !s.target; });

    // Lotes: solo se muestran los vigentes; si queda uno solo, no hace falta la comparación
    var wrap = $("#lotes");
    if (wrap) {
      var vigentes = s.lotes.filter(function (l) { return l._estado !== "cerrado"; });
      wrap.hidden = vigentes.length < 2;
      wrap.innerHTML = vigentes.map(function (l) {
        var tag = l._estado === "activo" ? "DISPONIBLE HOY" : "DESPUÉS DEL CIERRE";
        var when = l._cierre ? "Hasta el " + fmtDate(l.cierre, { day: "numeric", month: "long" }) + ", 11:59 p. m. (hora Colombia)"
          : (s.active._cierre ? "Desde el " + fmtDate(new Date(s.active._cierre + 1000).toISOString(), { day: "numeric", month: "long" }) : "");
        return '<article class="lote lote--' + (l._estado === "activo" ? "activo" : "proximo") + '">' +
          '<span class="lote__tag">' + tag + "</span>" +
          '<p class="lote__name">' + esc(l.nombre) + "</p>" +
          '<p class="lote__price"><small>US$</small>' + Number(l.precio).toLocaleString("es-CO") + "</p>" +
          '<p class="lote__when">' + esc(when) + "</p></article>";
      }).join("");
    }
  }

  /* ---------------- Cuenta regresiva ---------------- */
  function tick() {
    var now = Date.now();
    var s = computeLotes(now);
    var changed = !state.active || state.active.id !== s.active.id || !!state.target !== !!s.target;
    state = s;
    if (changed) { renderPrices(s); refreshLinks(); }
    if (!s.target) return;
    var diff = Math.max(0, s.target - now);
    var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5), m = Math.floor(diff % 36e5 / 6e4), sec = Math.floor(diff % 6e4 / 1e3);
    $$("[data-countdown]").forEach(function (el) {
      put(el.querySelector("[data-d]"), pad(d));
      put(el.querySelector("[data-h]"), pad(h));
      put(el.querySelector("[data-m]"), pad(m));
      put(el.querySelector("[data-s]"), pad(sec));
    });
    setText("[data-countdown-short]", "Preventa cierra en " + pad(d) + "d : " + pad(h) + "h : " + pad(m) + "m");
  }

  /* ---------------- Contenido desde config ---------------- */
  function renderStatic() {
    var start = cfg.fechaInicio;
    var pend = cfg.fechaPendiente ? " (por confirmar)" : "";
    if (start) {
      setText("[data-fecha-inicio]", fmtDate(start, { day: "numeric", month: "long" }).toUpperCase() + pend.toUpperCase());
      setText("[data-fecha-inicio-larga]", fmtDate(start, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + pend);
    }
    setText("[data-year]", String(new Date().getFullYear()));
    setText("[data-metodos]", cfg.metodosPago || "");
    if (cfg.horario && cfg.horario.dias) setText("[data-sched-days]", cfg.horario.dias);

    renderHorarios();
    renderBonos();
    renderGarantia();
    renderEvidencia();
    renderTestimonios();
    // Numeración tipo manual solo de las secciones visibles
    $$(".eyebrow").filter(function (el) { return !el.closest("[hidden]"); })
      .forEach(function (el, i) { el.setAttribute("data-n", pad(i + 1)); });
  }

  function renderHorarios() {
    var base = (cfg.fechaInicio || "2026-11-02T13:00:00-05:00").slice(0, 10); // día real de noviembre: aplica el horario de esa fecha
    var h = cfg.horario || { inicio: "13:00", fin: "15:00" };
    var a = new Date(base + "T" + h.inicio + ":00-05:00"), b = new Date(base + "T" + h.fin + ":00-05:00");
    var zones = [
      ["Colombia", "America/Bogota"], ["México (CDMX)", "America/Mexico_City"], ["Perú", "America/Lima"],
      ["Chile", "America/Santiago"], ["Argentina", "America/Argentina/Buenos_Aires"],
      ["EE. UU. (Miami / Nueva York)", "America/New_York"], ["EE. UU. (Los Ángeles)", "America/Los_Angeles"],
      ["España (peninsular)", "Europe/Madrid"]
    ];
    var local = "";
    try { local = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    var known = zones.some(function (z) { return z[1] === local; });
    if (local && !known) zones.push(["Tu hora local", local]);
    function parts(d, tz) {
      try {
        var t = new Intl.DateTimeFormat("es-CO", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true }).format(d).replace(/\s+/g, " ");
        var m = t.match(/^(\d{1,2}:\d{2})\s?(.*)$/);
        return m ? { t: m[1], p: m[2] } : { t: t, p: "" };
      } catch (e) { return null; }
    }
    var rows = zones.map(function (z) {
      var s = parts(a, z[1]), e = parts(b, z[1]);
      if (!s || !e) return "";
      // Si inicio y fin tienen el mismo periodo (a. m./p. m.) se muestra una sola vez; si no, ambos
      var range = s.p === e.p ? s.t + " – " + e.t + " " + e.p : s.t + " " + s.p + " – " + e.t + " " + e.p;
      return "<tr" + (z[1] === local ? ' class="is-local"' : "") + "><td>" + esc(z[0]) + (z[1] === local && z[0] !== "Tu hora local" ? " · tu zona" : "") + "</td><td>" + esc(range) + "</td></tr>";
    }).join("");
    $$("[data-horarios] tbody").forEach(function (tb) { tb.innerHTML = rows; });
  }

  function renderBonos() {
    var list = cfg.bonos || [];
    var sec = $("#bonos");
    if (!sec || !list.length) return;
    $("#bonosList").innerHTML = list.map(function (b, i) {
      return '<article class="card card--bono"><span class="bono__tag">BONO #' + (i + 1) + "</span>" +
        (b.imagen ? '<img src="' + esc(b.imagen) + '" alt="" loading="lazy" width="600" height="400">' : "") +
        "<h3>" + esc(b.titulo) + "</h3><p>" + esc(b.descripcion) + "</p></article>";
    }).join("");
    sec.hidden = false;
  }

  function renderGarantia() {
    var g = cfg.garantia || {};
    if (!g.activa) return;
    setText("[data-garantia-titulo]", g.titulo || "");
    setText("[data-garantia-texto]", g.texto || "");
    $("#garantia").hidden = false;
  }

  function renderEvidencia() {
    var list = cfg.evidencia || [], ph = cfg.mostrarPlaceholders !== false, w = $("#evidencia");
    if (!w) return;
    if (list.length) {
      w.innerHTML = list.map(function (x) {
        var media = x.tipo === "video"
          ? '<video src="' + esc(x.src) + '"' + (x.poster ? ' poster="' + esc(x.poster) + '"' : "") + ' controls playsinline preload="none"></video>'
          : '<img src="' + esc(x.src) + '" alt="' + esc(x.titulo || "Laboratorio de Ricardo Hernández") + '" loading="lazy" width="800" height="600">';
        return '<figure class="ev' + (x.vertical ? " ev--v" : "") + '">' + media + "<figcaption>" + esc(x.titulo || "") + "</figcaption></figure>";
      }).join("");
    } else if (ph) {
      w.innerHTML = ["VIDEO: DIAGNÓSTICO REAL", "VIDEO: REPARACIÓN DE PLACA", "VIDEO: MICROSOLDADURA", "FOTO: RICARDO EN LABORATORIO"].map(function (t) {
        return '<figure class="ev"><div class="placeholder placeholder--dark">[' + t + " – PENDIENTE]</div><figcaption>Material real del laboratorio</figcaption></figure>";
      }).join("");
    } else {
      w.hidden = true; var t = $(".evidence__title"); if (t) t.hidden = true;
    }
  }

  function renderTestimonios() {
    var t = cfg.testimonios || [], ph = cfg.mostrarPlaceholders !== false, tw = $("#testimonios");
    tw.classList.toggle("testis--four", t.length === 4);
    if (t.length) {
      tw.innerHTML = t.map(function (x) {
        var vid = x.video ? '<div class="phonevid"><video src="' + esc(x.video) + '" aria-label="Testimonio de ' + esc(x.nombre) + '"' + (x.poster ? ' poster="' + esc(x.poster) + '"' : "") + ' controls playsinline preload="none"></video></div>' : "";
        return '<article class="testi' + (x.video ? ' testi--video' : '') + '">' + vid +
          (x.video ? "" : '<p class="testi__name">' + esc(x.nombre) + '</p><p class="testi__meta">' + esc(x.pais || "") + "</p>") +
          (x.tema ? '<span class="testi__fail">' + esc(x.tema) + "</span>" : "") +
          (x.texto ? '<p class="testi__txt">“' + esc(x.texto) + '”</p>' : "") + "</article>";
      }).join("");
      var videos = $$("video", tw);
      videos.forEach(function (video) {
        video.addEventListener("play", function () { videos.forEach(function (other) { if (other !== video) other.pause(); }); });
      });
      // MP4 compactos con el índice al comienzo: preparar el búfer antes del clic.
      // En ahorro de datos se limita a metadatos, conservando el control del visitante.
      function loadVideo(video) { video.preload = navigator.connection && navigator.connection.saveData ? "metadata" : "auto"; video.load(); }
      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) { loadVideo(entry.target); observer.unobserve(entry.target); } });
        }, { rootMargin: "240px" });
        videos.forEach(function (video) { observer.observe(video); });
      } else videos.forEach(loadVideo);
    } else if (ph) {
      tw.innerHTML = [1, 2, 3].map(function () { return '<article class="testi testi--ph"><div class="phonevid phonevid--ph">[TESTIMONIO EN VIDEO – PENDIENTE]</div></article>'; }).join("");
    } else {
      $("#prueba").hidden = true;
    }
  }

  /* ---------------- CTAs / WhatsApp / checkout ---------------- */
  // Enlace de pago del lote activo (cada lote tiene su monto en la pasarela); si no tiene, el de respaldo
  function checkoutBase() { return (state.active && state.active.checkoutUrl) || cfg.checkoutUrl || ""; }
  function checkoutReady() {
    var u = checkoutBase();
    return /^https:\/\//.test(u) && !/\[|ejemplo|example/i.test(u);
  }
  function waUrl(tpl, extraText) {
    var msg = (tpl || cfg.whatsappMensaje || "")
      .replace("{variante}", variant)
      .replace("{utm_campaign}", utm.utm_campaign || "organico")
      .replace("{precio}", state.active ? usd(state.active.precio) : "");
    if (extraText) msg += "\n" + extraText;
    return "https://wa.me/" + String(cfg.whatsappNumero || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
  }
  // Los botones de inscripción SIEMPRE van al pago. WhatsApp queda solo para consultar con el asesor.
  // Mientras checkoutUrl no esté configurada, llevan a la sección de precio (con el aviso [ENLACE DE PAGO – PENDIENTE]).
  function checkoutHref() {
    if (!checkoutReady()) return "#precio";
    return withParams(checkoutBase(), { variant: variant, lote: state.active ? state.active.id : "" });
  }
  function refreshLinks() {
    var ready = checkoutReady();
    $$('[data-cta="checkout"]').forEach(function (a) {
      a.href = checkoutHref();
      if (ready) a.removeAttribute("target");
    });
    $$('[data-cta="whatsapp"]').forEach(function (a) { a.href = waUrl(); });
    $$("[data-checkout-pending]").forEach(function (el) { el.hidden = ready; });
  }
  function bindCtas() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-cta]");
      if (!a) return;
      var type = a.getAttribute("data-cta"), loc = a.getAttribute("data-cta-loc") || "";
      if (type === "checkout") {
        a.href = checkoutHref();
        if (checkoutReady()) {
          track("InitiateCheckout", { cta: loc, value: state.active && state.active.precio, currency: cfg.moneda || "USD", lote: state.active && state.active.id });
        } else if (isLocal) {
          console.warn("[checkout] checkoutUrl vacío: el botón solo baja a la sección de precio");
        }
      } else if (type === "whatsapp") {
        // Siempre se piden los datos antes de WhatsApp (si ya los dejó en esta visita, aparecen pre-llenados)
        e.preventDefault();
        openLead(loc);
      } else if (type === "precio") {
        track("cta_scroll", { cta: loc });
      }
    });
  }

  /* ---------------- Barra fija ---------------- */
  function initSticky() {
    var bar = $("#stickybar"), hero = $("#hero");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;
    var mq = window.matchMedia("(max-width: 767px)");
    var heroVisible = true;
    function apply() {
      var on = mq.matches && !heroVisible;
      bar.classList.toggle("is-on", on);
      bar.setAttribute("aria-hidden", on ? "false" : "true");
      var btn = bar.querySelector("a"); if (btn) btn.tabIndex = on ? 0 : -1;
      document.body.classList.toggle("has-sticky", on);
      document.documentElement.style.setProperty("--sticky-h", on ? bar.offsetHeight + "px" : "0px");
    }
    new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; apply(); }, { rootMargin: "0px 0px -35% 0px" }).observe(hero);
    if (mq.addEventListener) mq.addEventListener("change", apply);
  }

  /* ---------------- Animaciones al entrar (mínimas) ---------------- */
  function initObservers() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.35 });
    $$(".phone-chat").forEach(function (el) { io.observe(el); });
  }

  /* ---------------- VSL (variante A) ----------------
     Arranca en silencio. Nunca activa el audio sin interacción.
     Controles visibles desde el inicio (pausa y barra de progreso). */
  function initVSL() {
    if (variant !== "A" || !cfg.vslUrl) return;
    var frame = $("#vslFrame"), btn = $("#vslUnmute");
    var marks = {}, unmuted = false, started = false;
    function progress(cur, dur) {
      if (!dur || !unmuted) return; // solo cuenta reproducción con sonido elegida por la persona
      var pct = cur / dur * 100;
      [25, 50, 75, 95].forEach(function (m) { if (!marks[m] && pct >= m) { marks[m] = true; track("VSL_" + m, { percent: m }); } });
    }
    function onUnmute(source) {
      if (unmuted) return;
      unmuted = true; btn.hidden = true;
      track("VSL_Unmute", { source: source });
    }
    var yt = cfg.vslUrl.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (yt) {
      frame.innerHTML = '<div id="ytVsl"></div>';
      window.onYouTubeIframeAPIReady = function () {
        var player = new window.YT.Player("ytVsl", {
          videoId: yt[1],
          playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, controls: 1, modestbranding: 1 },
          events: {
            onReady: function (e) { e.target.mute(); e.target.playVideo(); btn.hidden = false; },
            onStateChange: function (e) {
              if (e.data === 1 && !started) { started = true; track("VSL_Play"); }
            }
          }
        });
        btn.addEventListener("click", function () {
          player.seekTo(0, true); player.unMute(); player.setVolume(100); player.playVideo();
          onUnmute("capa");
        });
        setInterval(function () {
          try {
            if (!unmuted && !player.isMuted()) onUnmute("controles");
            progress(player.getCurrentTime(), player.getDuration());
          } catch (e) {}
        }, 1000);
      };
      var s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s);
    } else {
      var v = document.createElement("video");
      v.src = cfg.vslUrl; v.muted = true; v.autoplay = true; v.playsInline = true; v.controls = true;
      v.setAttribute("playsinline", ""); v.setAttribute("muted", ""); v.preload = "metadata";
      if (cfg.vslPoster) v.poster = cfg.vslPoster;
      frame.innerHTML = ""; frame.appendChild(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      btn.hidden = false;
      btn.addEventListener("click", function () {
        v.currentTime = 0; v.muted = false; v.play();
        onUnmute("capa");
      });
      v.addEventListener("volumechange", function () { if (!v.muted && v.volume > 0) onUnmute("controles"); });
      v.addEventListener("play", function () { if (!started) { started = true; track("VSL_Play"); } });
      v.addEventListener("timeupdate", function () { progress(v.currentTime, v.duration); });
    }
  }

  /* ---------------- Formulario antes de WhatsApp ----------------
     Los botones de WhatsApp abren este formulario. Al enviarlo:
     1) se registra en el webhook/CRM (leadWebhookUrl) → evento Lead solo si el webhook responde OK
     2) se abre WhatsApp con los datos del formulario en un borrador → evento Contact
        El visitante revisa el mensaje y pulsa Enviar en WhatsApp.
     Si el webhook falla o tarda más de 3 s, WhatsApp se abre igual: nunca se pierde la conversación. */
  var openLead = function () {};
  function initLead() {
    var modal = $("#leadModal"), form = $("#leadForm"), err = $("#leadErr"), ok = $("#leadOk");
    if (!modal || !form) return;
    var lastFocus = null, ctaLoc = "", ultimoEnvio = null;
    openLead = function (loc) {
      ctaLoc = loc || "";
      lastFocus = document.activeElement;
      var prev = store("lp_lead");
      if (prev) {
        ["nombre", "correo", "pais", "whatsapp"].forEach(function (k) { if (prev[k] && form[k]) form[k].value = prev[k]; });
        var r = prev.experiencia && form.querySelector('[name="experiencia"][value="' + prev.experiencia + '"]'); if (r) r.checked = true;
      }
      modal.hidden = false; document.body.style.overflow = "hidden";
      track("LeadFormOpen", { cta: ctaLoc });
      setTimeout(function () { form.querySelector("input").focus(); }, 30);
    };
    function close() { modal.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    $$("[data-open-lead]").forEach(function (b) { b.addEventListener("click", function () { openLead("enlace"); }); });
    $$("[data-close-lead]").forEach(function (b) { b.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form), data = {}, bad = [];
      fd.forEach(function (v, k) { data[k] = String(v).trim(); });
      $$(".is-invalid", form).forEach(function (el) { el.classList.remove("is-invalid"); });
      ok.hidden = true;
      if (!data.nombre || data.nombre.length < 2) bad.push(["nombre", "Escribe tu nombre."]);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.correo || "")) bad.push(["correo", "Revisa tu correo."]);
      if (!data.pais) bad.push(["pais", "Selecciona tu país."]);
      var digits = (data.whatsapp || "").replace(/\D/g, "");
      if (!/^\+?[\d\s().-]+$/.test(data.whatsapp || "") || digits.length < 10 || digits.length > 15) bad.push(["whatsapp", "Escribe tu WhatsApp con indicativo (ej. +57 300 000 0000)."]);
      if (!data.experiencia) bad.push(["experiencia", "Cuéntanos tu experiencia."]);
      if (bad.length) {
        bad.forEach(function (b) { $$('[name="' + b[0] + '"]', form).forEach(function (el) { el.classList.add("is-invalid"); }); });
        err.textContent = bad[0][1];
        var first = form.querySelector('[name="' + bad[0][0] + '"]'); if (first) first.focus();
        return;
      }
      err.textContent = "";
      var payload = Object.assign({}, data, utm, {
        variant: variant, fecha: new Date().toISOString(), pagina: location.href.split("?")[0],
        lote: state.active ? state.active.id : ""
      });
      payload.cta = ctaLoc;
      var huella = JSON.stringify(data);
      if (!ultimoEnvio || ultimoEnvio.huella !== huella) {
        ultimoEnvio = { huella: huella, id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : undefined };
      }
      payload.envioId = ultimoEnvio.id;
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true; submit.textContent = "Abriendo WhatsApp…";
      var seleccion = form.querySelector('[name="experiencia"]:checked');
      var experiencia = seleccion ? seleccion.closest("label").textContent.trim() : data.experiencia;
      var url = waUrl(null, [
        "Nombre: " + data.nombre,
        "Correo: " + data.correo,
        "País: " + data.pais,
        "WhatsApp: " + data.whatsapp,
        "Experiencia técnica: " + experiencia
      ].join("\n"));
      // La ventana se abre ya (dentro del clic) para que el navegador no la bloquee; se le pone la URL al terminar
      var win = null;
      try { win = window.open("", "_blank"); } catch (x) {}

      var done = false;
      function finish(saved) {
        if (done) return; done = true; clearTimeout(timer);
        if (saved) track("Lead", { method: "form", experiencia: data.experiencia, pais: data.pais, cta: ctaLoc }); // lead real: el webhook lo recibió
        else track("LeadFormError", { reason: cfg.leadWebhookUrl ? "webhook" : "sin_webhook" });
        store("lp_lead", { nombre: data.nombre, correo: data.correo, pais: data.pais, whatsapp: data.whatsapp, experiencia: data.experiencia });
        track("Contact", { method: "whatsapp", cta: ctaLoc });
        if (win && !win.closed) win.location.href = url; else location.href = url;
        submit.disabled = false; submit.textContent = "Continuar a WhatsApp";
        if (!saved && cfg.leadWebhookUrl) {
          err.textContent = "El mensaje de WhatsApp está preparado, pero no pudimos confirmar el registro de tus datos. Puedes volver a intentarlo.";
        } else {
          ultimoEnvio = null;
          form.reset(); close();
        }
      }
      var timer = setTimeout(function () { finish(false); }, 3000);
      if (!cfg.leadWebhookUrl) {
        if (isLocal) console.warn("[lead] leadWebhookUrl vacío: los datos no se guardan en ningún lado");
        finish(false); return;
      }
      try {
        // leadWebhookSimple = true envía el JSON como text/plain (sin preflight CORS): necesario para Google Apps Script
        fetch(cfg.leadWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": cfg.leadWebhookSimple ? "text/plain;charset=UTF-8" : "application/json" },
          body: JSON.stringify(payload), keepalive: true, mode: "cors"
        }).then(function (r) {
          if (!r.ok) return false;
          if (cfg.leadWebhookUrl === "/api/academy-contactos") return r.json().then(function (datos) { return datos && datos.ok === true; }, function () { return false; });
          return true;
        }).then(finish, function () { finish(false); });
      } catch (x) { finish(false); }
    });
  }

  /* ---------------- Arranque ---------------- */
  function init() {
    renderStatic();
    tick();
    setInterval(tick, 1000);
    refreshLinks();
    bindCtas();
    initSticky();
    initObservers();
    initVSL();
    initLead();
    initTracking();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
