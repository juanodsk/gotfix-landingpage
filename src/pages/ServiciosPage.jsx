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
    icono: <FaMobileAlt className="text-4xl text-white" />,
    titulo: "Reparación de pantalla",
    descripcion:
      "Reemplazo de pantallas dañadas con piezas originales y garantía.",
  },
  {
    icono: <FaBatteryHalf className="text-4xl text-white" />,
    titulo: "Cambio de batería",
    descripcion:
      "Sustitución de baterías degradadas para mejorar el rendimiento.",
  },
  {
    icono: <FaChargingStation className="text-4xl text-white" />,
    titulo: "Reparación de puertos",
    descripcion: "Solución a problemas de carga o conexión USB en tu equipo.",
  },
  {
    icono: <FaLaptop className="text-4xl text-white" />,
    titulo: "Diagnóstico de MacBook",
    descripcion:
      "Evaluación profesional de fallas en tu MacBook sin costo inicial.",
  },
  {
    icono: <FaBroom className="text-4xl text-white" />,
    titulo: "Mantenimiento preventivo",
    descripcion:
      "Limpieza y revisión interna para prolongar la vida útil del dispositivo.",
  },
  {
    icono: <FaRedo className="text-4xl text-white" />,
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
    <div className="bg-[#00162b] min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 px-6">
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
              className="relative h-72 w-full overflow-hidden rounded-xl border border-gray-800 p-[1px] backdrop-blur-3xl group"
            >
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-xl bg-gray-950 px-6 py-6 text-center text-sm font-medium text-gray-50 transition-transform duration-150 group-hover:scale-[1.02]">
                <div className="mb-4">{servicio.icono}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {servicio.titulo}
                </h3>
                <p className="text-white/80 text-sm text-bold">
                  {servicio.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServiciosPage;
