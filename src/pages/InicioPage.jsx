import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx"; // Asegúrate que esté creado
import TypeWritter from "../plugins/TypeWritter.jsx"; // Tu animación
import { motion } from "framer-motion";
import {
  FaUserCog,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
  FaLock,
  FaWhatsapp,
  FaBoxOpen,
  FaTools,
  FaSmile,
} from "react-icons/fa";

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
      texto: "Equipo experto y preparado",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary" />,
      texto: "Procesos técnicos seguros y certificados",
    },
    {
      icon: <FaLightbulb className="text-4xl text-primary" />,
      texto: "Soluciones modernas e innovadoras",
    },
    {
      icon: <FaHandshake className="text-4xl text-primary" />,
      texto: "Servicio honesto y transparente",
    },
    {
      icon: <FaLock className="text-4xl text-primary" />,
      texto: "Cuidamos la integridad de tu equipo",
    },
  ];
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-[65px] font-bold mb-4">
            Somos{" "}
            <span className="text-[#0087fa]">
              <TypeWritter text="Got" />
            </span>
            <span className="text-[#00162b]">
              <TypeWritter text="Fix" speed={300} />
            </span>
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Más de <strong>4000 reparaciones</strong> en iPhone, iPad y MacBook.
            Servicio técnico confiable, innovador y seguro.
          </p>
          <button className="bg-[#0087fa] text-white cursor-pointer transition delay-10 px-6 py-3 rounded font-semibold hover:bg-blue-600">
            Cotiza tu reparación
          </button>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 mb-15">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-center mb-12 text-gray-800"
          >
            ¿Por qué elegir <span className="text-primary">GotFix</span>?
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
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Nuestros servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
            <div className="bg-white rounded shadow p-6">
              📱 Reparación de pantalla
            </div>
            <div className="bg-white rounded shadow p-6">
              🔋 Cambio de batería
            </div>
            <div className="bg-white rounded shadow p-6">
              🔌 Reparación de puertos
            </div>
            <div className="bg-white rounded shadow p-6">
              💻 Diagnóstico de MacBook
            </div>
            <div className="bg-white rounded shadow p-6">
              🧽 Mantenimiento preventivo
            </div>
            <div className="bg-white rounded shadow p-6">
              🛠 Restauración de sistema
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-20 bg-white">
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
          </motion.div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <blockquote className="bg-white p-6 rounded shadow">
              “GotFix me salvó. Repararon mi iPhone en solo 2 horas. Excelente
              atención.”
              <footer className="mt-2 text-sm text-gray-500">
                – Ana Rodríguez
              </footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded shadow">
              “Trabajo serio, rápido y con garantía. Muy recomendado.”
              <footer className="mt-2 text-sm text-gray-500">
                – Jorge Ramírez
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Galería de trabajos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Nuestro trabajo
          </h2>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-[#00162b] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tu dispositivo necesita ayuda?
          </h2>
          <p className="text-lg mb-6">
            No esperes más. Confía en los expertos Apple.
          </p>
          <button className="bg-[#0087fa] px-6 py-3 cursor-pointer transition delay-10 rounded font-semibold hover:bg-blue-600">
            Agenda tu reparación ahora
          </button>
        </div>
      </section>

      {/* Contacto */}
      <footer className="bg-gray-900 text-white py-8">
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
