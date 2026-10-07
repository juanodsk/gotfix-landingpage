import { Link } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { LuMapPin, LuPhone } from "react-icons/lu";

function Footer() {
  return (
    <footer className="bg-[#00162b] py-8 text-white">
      <div className="container mx-auto space-y-2 px-4 text-center">
        <p className="flex items-center justify-center gap-2">
          <LuMapPin aria-hidden="true" />
          <span>Neiva, Huila — Atención de lunes a sábado</span>
        </p>
        <a
          href="tel:+573125042689"
          className="flex items-center justify-center gap-2 hover:text-[#0087fa]"
        >
          <LuPhone aria-hidden="true" />
          <span>(+57) 312 504 2689</span>
        </a>

        <nav
          aria-label="Enlaces legales"
          className="flex flex-wrap justify-center gap-x-5 gap-y-1 pt-2 text-[15px]"
        >
          <Link to="/condiciones" className="hover:text-[#0087fa]">
            Condiciones
          </Link>
          <Link to="/pqrs" className="hover:text-[#0087fa]">
            PQRS
          </Link>
          <Link
            to="/politica-de-privacidad"
            className="hover:text-[#0087fa]"
          >
            Política de privacidad
          </Link>
        </nav>

        <p className="pt-2">Síguenos en nuestras redes sociales</p>
        <div className="flex justify-center">
          <a
            href="https://www.facebook.com/Gotfixco/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook className="mx-2 text-[22px] text-white transition-transform duration-300 hover:scale-125 hover:text-[#0087fa]" />
          </a>
          <a
            href="https://wa.link/7jzopx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="mx-2 text-[22px] text-white transition-transform duration-300 hover:scale-125 hover:text-[#0087fa]" />
          </a>
          <a
            href="https://www.instagram.com/gotfix_co?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="mx-2 text-[22px] text-white transition-transform duration-300 hover:scale-125 hover:text-[#0087fa]" />
          </a>
        </div>

        <hr className="mx-auto my-4 w-1/2 border-white/20" />
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} GotFix. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
