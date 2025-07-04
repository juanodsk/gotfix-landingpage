import React from "react";
import {
  FaUserCog,
  FaLock,
  FaWhatsapp,
  FaBoxOpen,
  FaTools,
  FaSmile,
  FaCheck,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#00162b] text-white py-8">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p>📍 Neiva, Huila — Atención de lunes a sábado</p>
        <p>📞 (+57) 3125042689 | 📩 contacto@gotfix.co</p>
        <p>Síguenos en nuestras redes sociales</p>
        <div className="flex-1 hidden md:flex justify-center mr-5">
          <a
            href="https://www.facebook.com/Gotfixco/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook className="text-white mx-2 cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
          </a>

          <a
            href="https://wa.link/7jzopx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="text-white mx-2 cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
          </a>

          <a
            href="https://www.instagram.com/gotfix_co?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="text-white mx-2 cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
          </a>
        </div>

        <hr className="my-4 border-white/20 w-1/2 mx-auto" />
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} GotFix. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
