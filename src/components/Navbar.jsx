import React, { useState } from "react";
import { Link } from "react-router-dom"; // Asegúrate de tener esto importado
import Logo from "../assets/Logo.png";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#00162b]/90 backdrop-blur-md shadow-lg">
      <div className="bg-[#00162b] w-full">
        <div className="max-w-[1300px] mx-auto px-4 flex items-center py-4">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/">
              <img
                src={Logo}
                alt="Logo Gotfix"
                className="w-50 md:w-75 xl:w-75 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-amber-100"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-auto justify-center items-center text-lg">
            <ul className="flex space-x-10">
              <li>
                <Link
                  to="/"
                  className="text-white text-[18px] transition delay-10 hover:text-[#0087fa]"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/servicios"
                  className="text-white text-[18px] transition delay-10 hover:text-[#0087fa]"
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/contactanos"
                  className="text-white text-[18px] transition delay-10 hover:text-[#0087fa]"
                >
                  Contáctanos
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="flex-1 hidden md:flex justify-end mr-5">
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

          {/* Hamburguesa */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl focus:outline-none"
              aria-label="Abrir menú"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden mt-2">
            <ul className="flex flex-col space-y-2 bg-[#00162b] rounded-lg p-4">
              <li>
                <Link
                  to="/"
                  className="text-white block transition delay-10 hover:text-[#0087fa]"
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/servicios"
                  className="text-white block transition delay-10 hover:text-[#0087fa]"
                  onClick={() => setMenuOpen(false)}
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  to="/contactanos"
                  className="text-white block transition delay-10 hover:text-[#0087fa]"
                  onClick={() => setMenuOpen(false)}
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  to="/formulario"
                  className="text-white text-[18px] transition delay-10 hover:text-[#0087fa]"
                >
                  Formulario
                </Link>
              </li>
              <li className="flex space-x-4 pt-2 justify-center">
                <FaFacebook className="text-white cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
                <FaWhatsapp className="text-white cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
                <FaInstagram className="text-white cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
