import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  FaMobileAlt,
  FaBatteryHalf,
  FaChargingStation,
  FaLaptop,
  FaBroom,
  FaRedo,
} from "react-icons/fa";

const servicios = [
  {
    icono: <FaMobileAlt className="text-5xl text-white" />,
    titulo: "Reparación de pantalla",
    descripcion:
      "Reemplazo de pantallas dañadas con piezas originales y garantía.",
  },
  {
    icono: <FaBatteryHalf className="text-5xl text-white" />,
    titulo: "Cambio de batería",
    descripcion:
      "Sustitución de baterías degradadas para mejorar el rendimiento.",
  },
  {
    icono: <FaChargingStation className="text-5xl text-white" />,
    titulo: "Reparación de puertos",
    descripcion: "Solución a problemas de carga o conexión USB en tu equipo.",
  },
  {
    icono: <FaLaptop className="text-5xl text-white" />,
    titulo: "Diagnóstico de MacBook",
    descripcion:
      "Evaluación profesional de fallas en tu MacBook sin costo inicial.",
  },
  {
    icono: <FaBroom className="text-5xl text-white" />,
    titulo: "Mantenimiento preventivo",
    descripcion:
      "Limpieza y revisión interna para prolongar la vida útil del dispositivo.",
  },
  {
    icono: <FaRedo className="text-5xl text-white" />,
    titulo: "Restauración de sistema",
    descripcion:
      "Reinstalación y optimización del sistema operativo de tu equipo.",
  },
];

const ServiciosPage = () => {
  useEffect(() => {
    document.title = "GotFix | Servicios";
  }, []);

  return (
    <div className="bg-[#00162b62] backdrop-blur-md min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-[#00162b] to-[#002147]">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white">
          Servicios de reparación
        </h1>
        <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
          En GotFix ofrecemos una amplia gama de servicios técnicos
          especializados para dispositivos Apple. Usamos herramientas
          certificadas y contamos con técnicos altamente capacitados para
          garantizar tu seguridad y la de tu equipo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="relative group bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-8 h-72 flex flex-col items-center justify-center text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/20"
            >
              <div className="mb-4 group-hover:rotate-3 transition-transform duration-300">
                {servicio.icono}
              </div>
              <h3 className="text-xl font-semibold text-white drop-shadow-sm mb-2">
                {servicio.titulo}
              </h3>
              <p className="text-white/80 text-sm px-2">
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServiciosPage;
