import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx"; // Asegúrate que esté creado
import NuestroTrabajo from "../components/NuestroTrabajoSection.jsx"; // Asegúrate que esté creado
import { motion } from "framer-motion";
import {
  FaUserCog,
  FaLock,
  FaWhatsapp,
  FaBoxOpen,
  FaTools,
  FaSmile,
  FaCheck,
} from "react-icons/fa";
import heroBG from "../assets/local2.jpg";
import ricardo1 from "../assets/ricardo1.jpg";
import Dispositivos from "../components/Dispositivos.jsx";
import Reseñas from "../components/Reseñas.jsx"; // Asegúrate que esté creado

const LandingPage = () => {
  useEffect(() => {
    document.title = "GotFix | Servicio Técnico Apple";
  }, []);
  const pasos = [
    {
      icono: <FaWhatsapp className="text-4xl text-primary mb-4" />,
      titulo: "Paso 1",
      descripcion: "Nos contactas por WhatsApp o formulario.",
    },
    {
      icono: <FaBoxOpen className="text-4xl text-primary mb-4" />,
      titulo: "Paso 2",
      descripcion: "Recibimos tu equipo o coordinamos la entrega.",
    },
    {
      icono: <FaTools className="text-4xl text-primary mb-4" />,
      titulo: "Paso 3",
      descripcion: "Diagnóstico y/o reparación profesional.",
    },
    {
      icono: <FaSmile className="text-4xl text-primary mb-4" />,
      titulo: "Paso 4",
      descripcion: "Te devolvemos el dispositivo como nuevo.",
    },
  ];
  const beneficios = [
    {
      icon: <FaTools className="text-4xl text-primary" />,
      texto: "Más de 4000 dispositivos Apple reparados",
    },
    {
      icon: <FaUserCog className="text-4xl text-primary" />,
      texto: "Técnicos especializados en la marca Apple",
    },
    {
      icon: <FaCheck className="text-4xl text-primary" />,
      texto: "Garantía en la reparación de tu equipo",
    },
  ];
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="relative bg-gray-100 py-25 text-center md:py-55 "
        style={{
          backgroundImage: `url(${heroBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative container mx-auto px-4">
          <p className="text-white text-[25px] mb-6 font-bold drop-shadow-lg">
            Somos un centro de reparación para equipos Apple.
          </p>
          <button className="bg-[#0087fa] text-white cursor-pointer transition delay-10 px-6 py-3 rounded font-semibold hover:bg-blue-600 relative z-10">
            Cotiza tu reparación
          </button>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-10  ">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-center mb-12 text-gray-800"
          >
            ¿Por qué elegir <span className="text-primary">GOTFIX</span>?
          </motion.h2>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-300"
              >
                <div className="mb-4">{beneficio.icon}</div>
                <p className="text-gray-700 text-lg font-medium">
                  {beneficio.texto}
                </p>
              </motion.div>
            ))}
          </div>
        </div>{" "}
        <Dispositivos />
      </section>

      <section className=" mb-15 bg-gradient-to-b from-white to-gray-50 ">
        <div className="container mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ">
          {/* Columna izquierda: texto */}
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800">
              ¿Nuestra misión?
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium voluptatibus consequuntur optio, cupiditate consequatur
              fugiat ab expedita, deserunt rem sequi nesciunt, enim commodi
              facilis id delectus!
            </p>
          </div>
          {/* Columna derecha: imagen */}
          <div className="flex justify-center">
            <img
              src={ricardo1}
              alt="Técnico GotFix"
              className="rounded-xl max-w-100 h-auto shadow-xl"
            />
          </div>
        </div>
      </section>

      <NuestroTrabajo />
      {/* Proceso */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#00162b] text-white rounded-2xl p-10 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-center mb-10">
              ¿Cómo reparamos tu equipo?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pasos.map((paso, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group bg-[#011d3a] hover:bg-[#072c4f] rounded-xl p-6 text-center flex flex-col items-center 
                           transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
                >
                  {paso.icono}
                  <h3 className="text-xl font-semibold mb-2">{paso.titulo}</h3>
                  <p className="text-base">{paso.descripcion}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center ">
              <button className="bg-[#0087fa] text-white cursor-pointer transition delay-10 px-6 py-3 rounded font-semibold hover:bg-blue-600 z-50">
                <FaWhatsapp className="inline-block mb-[2px] mr-2 text-[22px]" />
                Cotiza tu reparación
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Reseñas />

      {/* Contacto */}
      <footer className="bg-[#00162b] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>📍 Neiva, Huila — Atención de lunes a sábado</p>
          <p className="mt-2">📞 (+57) 3125042689 | 📩 contacto@gotfix.co</p>
          <p className="mt-2">Síguenos en Instagram y Facebook @gotfixco</p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
