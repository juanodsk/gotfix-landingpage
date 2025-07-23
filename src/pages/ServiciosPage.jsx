import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  FaMobileAlt,
  FaBatteryHalf,
  FaChargingStation,
  FaLaptop,
  FaBroom,
  FaRedo,
  FaWhatsapp,
} from "react-icons/fa";
import Footer from "../components/Footer"; // Asegúrate que esté creado

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
    titulo: "Reparación de Placa eléctronica",
    descripcion: "Solución a problemas de placa electronica en tu equipo.",
  },
  {
    icono: <FaLaptop className="text-5xl text-white" />,
    titulo: "Diagnóstico de dispositivos",
    descripcion: "Evaluación profesional de fallas en tus dispositivos.",
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
    <div className="bg-[#4592da] backdrop-blur-3xl min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-[#00162bf3] to-[#002147]">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white">
          Servicios de reparación
        </h1>
        <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
          En <span className="font-bold">GotFix</span> ofrecemos una amplia gama
          de servicios técnicos especializados para dispositivos Apple. Usamos
          herramientas certificadas y contamos con técnicos altamente
          capacitados para garantizar tu seguridad y la de tu equipo.
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
        <div className="mt-12 text-center">
          <a
            href="https://wa.link/7jzopx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="bg-[#25d366] hover:bg-[#25d365b2] text-white cursor-pointer transition delay-10 px-6 py-3 rounded font-semibold  z-50 inline-flex items-center"
          >
            <FaWhatsapp className="mb-[2px] mr-2 text-[22px]" />
            Cotiza tu reparación
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServiciosPage;
