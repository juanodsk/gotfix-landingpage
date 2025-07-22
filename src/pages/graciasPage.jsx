import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const GraciasPage = () => {
  return (
    <main className="min-h-screen bg-[#e5f7ed] flex flex-col items-center justify-center px-6 text-center text-[#075E54] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold mb-4">
          ¡Gracias por registrarte! 🎉
        </h1>
        <p className="text-lg text-[#333333] mb-6">
          Hemos recibido tus datos correctamente. Únete a nuestro grupo de
          WhatsApp para estar al tanto de todo antes del evento.
        </p>

        <a
          href="https://chat.whatsapp.com/GXTKiMWrGqi2KVbJewy0jg?mode=ac_t"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <FaWhatsapp className="text-2xl" />
          Unirme al grupo de WhatsApp
        </a>
      </motion.div>

      <footer className="mt-10 text-sm text-[#555]">
        © {new Date().getFullYear()} GotFix · Todos los derechos reservados
      </footer>
    </main>
  );
};

export default GraciasPage;
