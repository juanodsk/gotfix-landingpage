import React from "react";
import macLogo from "../assets/Dispositivos/1.png";
import imacLogo from "../assets/Dispositivos/2.png";
import ipadLogo from "../assets/Dispositivos/3.png";
import iphoneLogo from "../assets/Dispositivos/4.png";

const Dispositivos = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">
          Servicio técnico especializado
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-end justify-items-center">
          {/* MacBook */}
          <div className="flex flex-col items-center transition-transform duration-300 hover:scale-125">
            <img src={macLogo} alt="MacBook" className="h-25 mb-2" />
            <span className="text-lg font-semibold mt-2">MacBook</span>
          </div>
          {/* iPad */}
          <div className="flex flex-col items-center transition-transform duration-300 hover:scale-125">
            <img src={ipadLogo} alt="iPad" className="h-25 mb-2" />
            <span className="text-lg font-semibold mt-2">iPad</span>
          </div>
          {/* iPhone */}
          <div className="flex flex-col items-center transition-transform duration-300 hover:scale-125">
            <img src={iphoneLogo} alt="iPhone" className="h-25 mb-2" />
            <span className="text-lg font-semibold mt-2">iPhone</span>
          </div>
          {/* iMac */}
          <div className="flex flex-col items-center transition-transform duration-300 hover:scale-125">
            <img src={imacLogo} alt="iMac" className="h-25 mb-2" />
            <span className="text-lg font-semibold mt-2">iMac</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dispositivos;
