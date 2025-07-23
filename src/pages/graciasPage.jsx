import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import collage from "../assets/squeeze/collage.png";

const GraciasPage = () => {
  return (
    <main className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0"
        style={{ backgroundImage: `url(${collage})` }}
      ></div>

      {/* Degradado oscuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/80 z-10"></div>

      {/* Contenido centrado con tarjeta */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-6 py-16">
        <section className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold mb-6 text-[#ffbd59]"
          >
            ¡Gracias por registrarte!
          </motion.h1>

          <p className="text-lg text-gray-300 mb-8">
            Estás a un paso de transformar tu futuro como técnico especializado
            en Apple. Únete al grupo exclusivo para contenido avanzado y
            asesoría directa.
          </p>

          <motion.a
            href="https://chat.whatsapp.com/GXTKiMWrGqi2KVbJewy0jg?mode=ac_t"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-[#25d366] hover:bg-[#25d365a2] text-[#1a1a1a] font-semibold py-3 px-6 rounded-full shadow-lg transition-all mb-4"
          >
            <FaArrowRight />
            Unirme al grupo de WhatsApp
          </motion.a>

          <footer className="mt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} GotFix · Todos los derechos reservados
          </footer>
        </section>
      </div>
    </main>
  );
};

export default GraciasPage;
