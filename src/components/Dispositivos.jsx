import React, { useState } from "react";
import macLogo from "../assets/Dispositivos/1.png";
import imacLogo from "../assets/Dispositivos/2.png";
import ipadLogo from "../assets/Dispositivos/3.png";
import iphoneLogo from "../assets/Dispositivos/4.png";

const reparaciones = {
  iPhone: [
    "Cambio de batería",
    "Reemplazo de cristal",
    "Cambio de pantalla",
    "Reemplazo de cámaras",
    "Arreglo placa electrónica",
    "Mantenimiento por humedad",
    "Cambio de backover",
    "Cambio de cristal trasero",
    "Diagnóstico",
  ],
  MacBook: [
    "Cambio de batería",
    "Cambio de pantalla",
    "Corrección de placa electrónica",
    "Reemplazo de teclado",
    "Cambio flex de pantalla",
    "Arreglos de cargadores",
    "Aumento de RAM y almacenamiento",
    "Mantenimiento general y preventivo",
    "Diagnóstico",
  ],
  iPad: [
    "Cambio de batería",
    "Reemplazo de cristal",
    "Cambio de pantalla",
    "Reemplazo de cámaras",
    "Arreglo placa electrónica",
    "Mantenimiento por humedad",
    "Cambio de backover",
    "Cambio de cristal trasero",
    "Diagnóstico",
  ],
  iMac: [
    "Cambio de batería",
    "Cambio de pantalla",
    "Corrección de placa electrónica",
    "Reemplazo de teclado",
    "Cambio flex de pantalla",
    "Arreglos de cargadores",
    "Aumento de RAM y almacenamiento",
    "Mantenimiento general y preventivo",
    "Diagnóstico",
  ],
};

const Modal = ({ dispositivo, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full animate-fade-in">
        <h3 className="text-xl font-bold mb-4 text-center">
          Reparaciones para {dispositivo}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {reparaciones[dispositivo]?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 block mx-auto px-5 py-2 bg-[#0087fa] text-white rounded hover:bg-blue-600 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const Dispositivos = () => {
  const [dispositivoActivo, setDispositivoActivo] = useState(null);

  const dispositivos = [
    { nombre: "iPhone", img: iphoneLogo },
    { nombre: "MacBook", img: macLogo },
    { nombre: "iPad", img: ipadLogo },
    { nombre: "iMac", img: imacLogo },
  ];

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">
          Servicio técnico especializado
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-end justify-items-center">
          {dispositivos.map((dispositivo) => (
            <div
              key={dispositivo.nombre}
              onClick={() => setDispositivoActivo(dispositivo.nombre)}
              className="flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-125 active:scale-95"
            >
              <img
                src={dispositivo.img}
                alt={dispositivo.nombre}
                className="h-24 mb-2"
              />
              <span className="text-lg font-semibold mt-2">
                {dispositivo.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>

      {dispositivoActivo && (
        <Modal
          dispositivo={dispositivoActivo}
          onClose={() => setDispositivoActivo(null)}
        />
      )}
    </section>
  );
};

export default Dispositivos;
