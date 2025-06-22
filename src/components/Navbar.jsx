import React, { useState } from "react";
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
    <nav>
      <div className="bg-[#00162b] container mx-auto px-4 py-2 w-full rounded-xl mt-4">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex-1">
            <img
              src={Logo}
              alt="Logo Gotfix"
              className="w-50 md:w-75 xl:w-75"
            />
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-auto justify-start items-center text-lg">
            <ul className="flex space-x-4">
              <li>
                <a
                  href="/"
                  className="text-white transition delay-10 hover:text-[#0087fa]"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white transition delay-10 hover:text-[#0087fa]"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white transition delay-10 hover:text-[#0087fa]"
                >
                  Contactanos
                </a>
              </li>
            </ul>
          </div>
          {/* Redes sociales */}
          <div className="flex-1 hidden md:flex justify-end mr-5">
            <FaFacebook className="text-white mx-2 cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
            <FaWhatsapp className="text-white mx-2 cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
            <FaInstagram className="text-white mx-2 cursor-pointer text-[22px] transition-transform duration-300 ease-in-out hover:text-[#0087fa] hover:scale-125" />
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
                <a
                  href="/"
                  className="text-white block transition delay-10 hover:text-[#0087fa]"
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white block transition delay-10 hover:text-[#0087fa]"
                  onClick={() => setMenuOpen(false)}
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-white block transition delay-10 hover:text-[#0087fa]"
                  onClick={() => setMenuOpen(false)}
                >
                  Contactanos
                </a>
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
