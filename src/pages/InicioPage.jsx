import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import TypeWritter from "../plugins/TypeWritter.jsx"; // <-- Asegúrate de importar bien
import ReactPlayer from "react-player";

const InicioPage = () => {
  useEffect(() => {
    document.title = "GotFix | Inicio";
  }, []);

  return (
    <>
      <Navbar />
      <section>
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4 mt-10">
            <h2 className="text-3xl font-bold mb-4">
              Bienvenido a{" "}
              <span className="text-[#0087fa] ">
                <TypeWritter text="Got" />
              </span>
              <span className="text-[#00162b] ">
                <TypeWritter text="Fix!" speed={350} />
              </span>
            </h2>
            <p className="text-gray-700 mb-6">
              Tu solución integral para servicios de reparación y mantenimiento.
            </p>
            <ul className="list-disc pl-5 text-gray-700 mb-6">
              <li>Reparación de dispositivos Apple</li>
              <li>Mantenimiento Preventivo</li>
              <li>Diagnosticos generales y especificos</li>
            </ul>
            <p className="text-gray-700">
              Para más información, visita nuestra sección de contacto.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              alt="Servicios GotFix"
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default InicioPage;
