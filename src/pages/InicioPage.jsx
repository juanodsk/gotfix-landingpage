import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import NuestroTrabajo from "../components/NuestroTrabajoSection.jsx";
import { motion } from "framer-motion";
import {
  FaUserCog,
  FaLock,
  FaWhatsapp,
  FaBoxOpen,
  FaTools,
  FaSmile,
  FaCheck,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { PiCertificateFill } from "react-icons/pi";
import ricardo1 from "../assets/IMG_4655.jpeg";
import ricardo2 from "../assets/IMG_0852.jpg";
import heroReparacion from "../assets/IMG_4657.jpeg";
import garantiaGotfix from "../assets/garantia_gotfix_final.png";

import Dispositivos from "../components/Dispositivos.jsx";
import Reseñas from "../components/Reseñas.jsx";
import Carrousel from "../components/Carrousel.jsx";
import Footer from "../components/Footer.jsx";

const MotionDiv = motion.div;

const LandingPage = () => {
  useEffect(() => {
    document.title = "GotFix | Servicio Técnico Apple";
  }, []);
  const pasos = [
    {
      icono: <FaWhatsapp className="text-4xl text-primary mb-4" />,
      titulo: "Paso 1",
      descripcion: "Nos contactas por WhatsApp ó te acercas al punto físico.",
    },
    {
      icono: <FaBoxOpen className="text-4xl text-primary mb-4" />,
      titulo: "Paso 2",
      descripcion: "Recibimos tu equipo y coordinamos la entrega.",
    },
    {
      icono: <FaTools className="text-4xl text-primary mb-4" />,
      titulo: "Paso 3",
      descripcion: "Diagnósticamos y reparamos tu dispositivo.",
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
      texto:
        "Llevamos más de 7 años en el mercado y más de 5.000 dispositivos apple reparados",
    },
    {
      icon: <FaUserCog className="text-4xl text-primary" />,
      texto: "Técnicos especializados en la marca Apple",
    },
    {
      icon: <FaCheck className="text-4xl text-primary" />,
      texto: "Garantía de 6 meses en la reparación de tu equipo",
    },
    {
      icon: <PiCertificateFill className="text-4xl text-primary" />,
      texto: "Repuestos originales y de alta calidad",
    },
  ];
  return (
    <>
      <Navbar />

      {/* Hero */}
      {/* <Carrousel /> */}
      <section className="relative min-h-[520px] overflow-hidden bg-[#00162b] text-white md:min-h-[620px]">
        <div className="absolute inset-0 z-0 bg-[#00162b]">
          <div className="absolute inset-y-0 left-0 w-[46%] bg-[radial-gradient(circle_at_28%_38%,rgba(0,135,250,0.34),transparent_30%),linear-gradient(135deg,#002c57_0%,#00162b_58%,#000b16_100%)]" />
          <div className="absolute inset-y-0 left-0 w-[42%] bg-[#00162b]/35 blur-3xl" />
          <div
            className="absolute inset-y-0 left-[28%] w-[44%] bg-cover opacity-90"
            style={{
              backgroundImage: `url(${heroReparacion})`,
              backgroundPosition: "center 38%",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.68) 16%, #000 34%, #000 66%, rgba(0,0,0,0.68) 84%, transparent 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.68) 16%, #000 34%, #000 66%, rgba(0,0,0,0.68) 84%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[42%] bg-cover opacity-95"
            style={{
              backgroundImage: `url(${ricardo2})`,
              backgroundPosition: "right 32%",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.68) 16%, #000 34%, #000 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.68) 16%, #000 34%, #000 100%)",
            }}
          />
          <div className="absolute inset-y-0 left-[30%] w-[14%] bg-[#00162b]/20 blur-3xl" />
          <div className="absolute inset-y-0 left-[61%] w-[14%] bg-[#00162b]/20 blur-3xl" />
        </div>
        <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(0,12,25,0.68)_0%,rgba(0,22,43,0.46)_38%,rgba(0,22,43,0.28)_72%,rgba(0,8,16,0.34)_100%)]" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-[#00162b]/50" />

        <div className="relative z-10 container mx-auto flex min-h-[520px] max-w-[1120px] items-center px-6 py-12 md:min-h-[620px] md:py-16">
          <MotionDiv
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mx-auto max-w-[340px] text-center md:mx-0 md:max-w-xl md:text-left"
          >
            <h1 className="text-[2.15rem] font-extrabold leading-[1.12] text-white sm:text-4xl md:text-5xl md:leading-tight">
              Reparamos tu equipo Apple como si fuera nuestro.
            </h1>

            <a
              href="https://wa.link/7jzopx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacta un especialista por WhatsApp"
              className="mt-7 inline-flex items-center rounded bg-[#25d366] px-6 py-3 font-semibold text-white transition hover:bg-[#25d365b2]"
            >
              <FaWhatsapp className="mb-[2px] mr-2 text-[22px]" />
              Contactar un especialista
            </a>
          </MotionDiv>
        </div>
      </section>
      <section className="py-10  ">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:text-4xl text-2xl font-bold text-center mb-12 text-gray-800"
          >
            ¿Por qué elegir <span className="text-primary">GOTFIX</span>?
          </motion.h2>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center">
            {beneficios.map((beneficio, index) => {
              const isLastItem =
                index === beneficios.length - 1 && beneficios.length % 4 === 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-300 ${
                    isLastItem ? "lg:col-span-1 lg:col-start-2" : ""
                  }`}
                >
                  <div className="mb-4">{beneficio.icon}</div>
                  <p className="text-gray-700 xl:text-lg sm:text-md font-medium">
                    {beneficio.texto}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="relative mt-12 overflow-hidden rounded-3xl bg-[#00162b] px-6 py-8 text-white shadow-2xl sm:px-10 md:py-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(0,135,250,0.35),transparent_34%),linear-gradient(135deg,rgba(0,44,87,0.95),rgba(0,12,25,0.98))]" />
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />

            <div className="relative z-10 grid items-center gap-7 md:grid-cols-[auto_1fr]">
              <motion.img
                src={garantiaGotfix}
                alt="Garantía GotFix de 6 meses"
                initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: -4, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                viewport={{ once: true }}
                className="mx-auto w-36 drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] sm:w-44 md:w-48"
              />

              <div className="text-center md:text-left">
                <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-white/90 backdrop-blur">
                  Reparaciones respaldadas
                </span>
                <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                  Tu equipo queda cubierto con garantía GotFix de 6 meses.
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  Reparamos con técnicos especializados, repuestos de alta
                  calidad y un respaldo claro para que salgas tranquilo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>{" "}
        <Dispositivos />
      </section>

      <section className=" mb-15 bg-gradient-to-b from-white to-gray-50 ">
        <div className="container mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ">
          {/* Columna izquierda: texto */}
          <div>
            <h2 className="xl:text-4xl text-2xl font-extrabold mb-6 text-gray-800 text-center">
              ¿Nuestra misión?
            </h2>
            <p className="text-gray-700 text-lg mb-4 text-justify">
              Brindar soluciones confiables, rápidas y especializadas, mediante
              un equipo capacitado, procesos estandarizados y una experiencia de
              atención única, generando confianza y fidelización en nuestros
              clientes.
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
            <h2 className="xl:text-4xl text-2xl font-bold text-center mb-10">
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
                  <h3 className="xl:text-xl text-2xl font-semibold mb-2">
                    {paso.titulo}
                  </h3>
                  <p className="text-base">{paso.descripcion}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center ">
              <a
                href="https://wa.link/7jzopx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="bg-[#25d366] text-white cursor-pointer transition delay-10 px-6 py-3 rounded font-semibold hover:bg-[#25d365af] z-50 inline-flex items-center"
              >
                <FaWhatsapp className="mb-[2px] mr-2 text-[22px]" />
                Cotiza tu reparación.
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Reseñas />

      {/* Contacto */}
      <Footer />
    </>
  );
};

export default LandingPage;
