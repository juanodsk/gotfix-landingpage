import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const enlaces = [
  { to: "/", texto: "Inicio", end: true },
  { to: "/servicios", texto: "Servicios" },
  { to: "/condiciones", texto: "Condiciones" },
  { to: "/pqrs", texto: "PQRS" },
  { to: "/contactanos", texto: "Contáctanos" },
];

const redes = [
  {
    href: "https://www.facebook.com/Gotfixco/",
    nombre: "Facebook",
    Icono: FaFacebook,
  },
  {
    href: "https://wa.link/7jzopx",
    nombre: "WhatsApp",
    Icono: FaWhatsapp,
  },
  {
    href: "https://www.instagram.com/gotfix_co?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    nombre: "Instagram",
    Icono: FaInstagram,
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  const claseEnlace = ({ isActive }) =>
    `text-[17px] transition hover:text-[#0087fa] ${
      isActive ? "text-[#0087fa]" : "text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#00162b]/90 shadow-lg backdrop-blur-md">
      <div className="mx-auto flex max-w-[1300px] items-center px-4 py-2">
        <div className="flex-1">
          <NavLink to="/" aria-label="Ir al inicio">
            <img
              src={Logo}
              alt="Logo GotFix"
              className="w-[148px] cursor-pointer transition-transform duration-300 hover:scale-105 md:w-[196px] xl:w-[212px]"
            />
          </NavLink>
        </div>

        <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
          {enlaces.map((enlace) => (
            <li key={enlace.to}>
              <NavLink
                to={enlace.to}
                end={enlace.end}
                className={claseEnlace}
              >
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden flex-1 justify-end lg:flex">
          {redes.map(({ href, nombre, Icono }) => (
            <a
              key={nombre}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={nombre}
            >
              <Icono className="mx-2 text-[22px] text-white transition-transform duration-300 hover:scale-125 hover:text-[#0087fa]" />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((abierto) => !abierto)}
          className="ml-auto flex min-h-11 min-w-11 items-center justify-center text-2xl text-white lg:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menuOpen && (
        <div id="menu-movil" className="px-4 pb-4 lg:hidden">
          <ul className="flex flex-col gap-1 rounded-xl bg-[#00162b] p-3 shadow-xl">
            {enlaces.map((enlace) => (
              <li key={enlace.to}>
                <NavLink
                  to={enlace.to}
                  end={enlace.end}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 transition hover:bg-white/5 hover:text-[#0087fa] ${
                      isActive ? "bg-white/5 text-[#0087fa]" : "text-white"
                    }`
                  }
                >
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
            <li className="flex justify-center gap-5 pt-3">
              {redes.map(({ href, nombre, Icono }) => (
                <a
                  key={nombre}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={nombre}
                  className="flex min-h-11 min-w-11 items-center justify-center text-white transition hover:text-[#0087fa]"
                >
                  <Icono className="text-[22px]" />
                </a>
              ))}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
