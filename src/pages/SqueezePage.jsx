import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Countdown from "../components/Countdown.jsx";
import axios from "axios";

const SqueezePage = () => {
  const [form, setForm] = useState({ nombre: "", correo: "" });
  const [fuente, setFuente] = useState("desconocido");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ----- Detectar ?fuente= o ?utm_source= al montar ----- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f = params.get("fuente") || params.get("utm_source") || "organico";
    setFuente(f);
  }, []);

  /* ----- Actualizar campos ----- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----- Enviar formulario ----- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("https://formulario-gotfix.onrender.com/api/registro", {
        ...form,
        fuente,
      });
      setSubmitted(true);
      setForm({ nombre: "", correo: "" });
    } catch (err) {
      console.error(err.response || err);
      setError("Algo salió mal, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col font-sans ">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-[#0087fa]"
        >
          Master Class:
          <br /> De Novato a Experto en iPhone
        </motion.h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Evento online y sin costo · Martes 23 de julio 2025
        </p>
        <Countdown />

        <p className="mt-6 max-w-xl text-gray-400">
          Descubre los{" "}
          <span className="text-[#0087fa] font-semibold">3 secretos</span> para
          construir un negocio rentable como técnico experto en iPhone más
          rápido de lo que te imaginas aunque no tengas experiencia.
        </p>
        <a href="#registro" className="mt-8">
          <button className="bg-[#0087fa] hover:bg-[#006ed1] transition-colors cursor-pointer delay-10 px-8 py-3 rounded-lg font-semibold">
            Quiero asegurar mi cupo
          </button>
        </a>
      </section>

      {/* Paso 1 – Registro */}
      <section id="registro" className="bg-[#111111] py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#0087fa]">
            Paso 1: Regístrate para asegurar tu espacio
          </h2>

          {submitted ? (
            <div className="text-center text-xl text-green-400">
              ¡Gracias! Revisa tu correo para confirmar tu asistencia.
            </div>
          ) : (
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
                className="p-4 rounded-lg bg-[#0d0d0d] border border-[#333] focus:outline-none focus:border-[#0087fa]"
              />
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
                className="p-4 rounded-lg bg-[#0d0d0d] border border-[#333] focus:outline-none focus:border-[#0087fa]"
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                disabled={loading}
                className="bg-[#0087fa] hover:bg-[#006ed1] transition-colors cursor-pointer delay-10 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Enviando…" : "¡Quiero asistir al evento!"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Speaker */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://via.placeholder.com/400x400.png?text=Ricardo"
            alt="Ricardo – Experto en iPhone"
            className="rounded-2xl shadow-lg"
          />

          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#0087fa] mb-4">
              Conoce a tu Instructor
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Ricardo es líder en la industria de reparación de dispositivos
              Apple con más de 4 000 reparaciones exitosas. Ha ayudado a decenas
              de técnicos a montar su propio negocio rentable, combinando{" "}
              <strong className="text-white">
                innovación, confianza y seguridad
              </strong>
              . En esta master class compartirá su método probado para pasar de
              cero a experto en tiempo récord.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#111111] text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} GotFix • Todos los derechos reservados
      </footer>
    </main>
  );
};

export default SqueezePage;
