import React from "react";
import Logo from "../assets/Logo.png"; // Adjust the path as necessary

const Navbar = () => {
  return (
    <nav>
      <div className="bg-[#00162b] container mx-auto px-4 py-2 w-full">
        <div className="flex justify-between items-center">
          <img src={Logo} alt="" />
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-800">
                Inicio
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-600 hover:text-gray-800">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-gray-800">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
