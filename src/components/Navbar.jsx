import React from "react";
import Logo from "../assets/Logo.png"; // Adjust the path as necessary

const Navbar = () => {
  return (
    <nav>
      <div className="bg-[#00162b] container mx-auto px-4 py-2 w-full rounded-xl mt-4">
        <div className="flex  items-center">
          <div className="flex-none">
            <img src={Logo} alt="Logo Gotfix" className="w-75" />
          </div>
          <div
            className="
            flex-auto flex justify-center items-center space-x-4 text-lg "
          >
            <ul className="flex space-x-4 ">
              <li>
                <a
                  href="/"
                  className="text-white  transition delay-10 hover:text-[#0087fa]"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-white  transition delay-10 hover:text-[#0087fa]"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
