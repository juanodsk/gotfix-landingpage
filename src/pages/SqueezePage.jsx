import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Countdown from "../components/Countdown.jsx";
import axios from "axios";
import flier from "../assets/squeeze/flier.png";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Asegúrate de tener esto importado

const SqueezePage = () => {
  const [form, setForm] = useState({ nombre: "", correo: "" });
  const [fuente, setFuente] = useState("desconocido");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("fuente") || params.get("utm_source") || "organico";
    setFuente(f);

    // Código Meta Pixel
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = "https://connect.facebook.net/en_US/fbevents.js";
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script");

      window.fbq("init", "760147466498011"); // ✅ Tu ID de Pixel
    }

    window.fbq("track", "PageView");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("fuente") || params.get("utm_source") || "organico";
    setFuente(f);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_HOST_URI}/api/registro`, {
        ...form,
        fuente,
      });

      // ✅ Evento de conversión para Meta Pixel
      if (window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "Registro Masterclass",
          source: fuente,
        });
      }

      setForm({ nombre: "", correo: "" });
      navigate("/gracias");
    } catch (err) {
      console.error(err.response || err);
      setError("Algo salió mal, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-sans">
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-white"
        >
          Master Class:
          <br />{" "}
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#fcbc18]">
            De Novato a Experto en iPhone
          </h1>
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Evento online y sin costo · Martes 05 de agosto 2025
        </p>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          7:00 PM Hora Colombia 🇨🇴
        </p>
        <p className="mt-6 max-w-xl text-gray-400">
          Descubre los{" "}
          <span className="text-[#ffbd59] font-semibold">3 secretos</span> para
          construir un negocio rentable como técnico experto en iPhone más
          rápido de lo que te imaginas aunque no tengas experiencia.
        </p>
        <a href="#registro" className="mt-8">
          <button className="bg-[#fcbc18] hover:bg-[#c7a572] transition-colors cursor-pointer delay-10 px-8 py-3 rounded-lg font-semibold">
            Quiero asegurar mi cupo
          </button>
        </a>
      </section>

      <section id="registro" className="bg-[#111111] py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#fcbc18]">
            Paso 1: Regístrate para asegurar tu espacio
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-[#1b1b1b] p-8 rounded-2xl shadow-lg"
          >
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
              className="p-4 rounded-lg bg-[#0d0d0d] border border-[#bebdbd] focus:outline-none focus:border-[#ffbd59]"
            />
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
              className="p-4 rounded-lg bg-[#0d0d0d] border border-[#bebdbd] focus:outline-none focus:border-[#0087fa]"
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              disabled={loading}
              className="bg-[#fcbc18] hover:bg-[#d3af7a] transition-colors cursor-pointer delay-10 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Enviando…" : "¡Quiero asistir al evento!"}
            </button>

            <p className="text-xs text-center text-[#bebdbd] mt-2">
              Al registrarte, aceptas nuestra{" "}
              <Link
                to="/politica-de-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fcbc18] transition-colors"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </form>
        </div>
      </section>

      <section className="py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <img
            src={flier}
            alt="Ricardo – Experto en iPhone"
            className="rounded-2xl shadow-lg"
          />

          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#fcbc18] mb-4">
              Conoce a tu Instructor
            </h3>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                Ricardo Hernández, técnico especializado en dispositivos Apple,
                fundador de GOTFIX y creador de contenido técnico enfocado en
                inspirar y formar a quienes desean crecer en el mundo de la
                reparación profesional.
              </p>
              <p>
                Su camino no comenzó con un taller equipado ni con los recursos
                ideales. Empezó desde cero, con pocas herramientas, muchas
                dudas, pero una decisión clara: hacer las cosas bien, aprender
                con criterio y construir algo propio desde el conocimiento
                técnico.
              </p>
              <p>
                Con más de 4.000 equipos reparados y cientos de fallas complejas
                resueltas, hoy Ricardo se ha convertido en un referente para
                muchos técnicos que están iniciando, demostrando que sí es
                posible vivir de este oficio, crecer profesionalmente y
                convertirse en un técnico confiable y preparado.
              </p>
              <p>
                En esta masterclass gratuita, compartirá su experiencia real,
                sus aprendizajes más valiosos y las claves que le permitieron
                pasar de ser un técnico autodidacta a construir su propio centro
                de servicio especializado.
              </p>
              <p>
                Esta no es una masterclass más… es una guía directa para
                técnicos que están empezando, están en proceso o quieren
                emprender en el mundo del servicio técnico Apple.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="registro" className="bg-[#111111] py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#fcbc18]">
            Paso 1: Regístrate para asegurar tu espacio
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-[#1b1b1b] p-8 rounded-2xl shadow-lg"
          >
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
              className="p-4 rounded-lg bg-[#0d0d0d] border border-[#bebdbd] focus:outline-none focus:border-[#ffbd59]"
            />
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
              className="p-4 rounded-lg bg-[#0d0d0d] border border-[#bebdbd] focus:outline-none focus:border-[#0087fa]"
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              disabled={loading}
              className="bg-[#fcbc18] hover:bg-[#d3af7a] transition-colors cursor-pointer delay-10 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Enviando…" : "¡Quiero asistir al evento!"}
            </button>

            <p className="text-xs text-center text-[#bebdbd] mt-2">
              Al registrarte, aceptas nuestra{" "}
              <Link
                to="/politica-de-privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#fcbc18] transition-colors"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </form>
        </div>
      </section>

      <footer className="py-8 bg-[#111111] text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} GotFix • Todos los derechos reservados
      </footer>
    </main>
  );
};

export default SqueezePage;
