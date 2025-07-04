import React from "react";
import { useEffect } from "react";
import Reseñas from "../components/Reseñas.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx"; // Asegúrate que esté creado
import { FaWhatsapp } from "react-icons/fa";
import Local from "../assets/localafuera.JPG"; // Asegúrate de tener una imagen de local o usa un ícono

const ContactanosPage = () => {
  useEffect(() => {
    document.title = "GotFix | Contáctanos";
  }, []);
  return (
    <>
      <Navbar />
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-center mb-4">
              ¿Dónde estamos ubicados?
            </h3>
            <div className="flex justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d512.6669721455606!2d-75.29196736983681!3d2.9368210463434754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3b759b29731d61%3A0x2eef2bcfde0bc115!2zR09URklYwq4!5e0!3m2!1ses-419!2sco!4v1751588792051!5m2!1ses-419!2sco"
                width="100%"
                height="400"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg w-full md:w-[80%]"
              ></iframe>
            </div>
            <h1 className="text-xl font-bold text-center mb-6 mt-5">
              Calle 21 #5bis - 21 edificio Las ceibas, Neiva, Colombia
            </h1>
            <div className="flex justify-center">
              <img
                src={Local}
                alt="Local GotFix"
                className="rounded-xl max-w-100 md:max-w-150 h-auto shadow-xl"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center mb-6 mt-5">
            Contáctanos
          </h2>
          <p className="text-gray-700 text-lg mb-4 text-center">
            Si tienes alguna pregunta o necesitas más información, no dudes en
            ponerte en contacto con nosotros.
          </p>
          <div className="flex justify-center">
            <a
              href="https://wa.link/7jzopx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0087fa] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Contáctanos por WhatsApp{" "}
              <FaWhatsapp className="inline-block mb-[2px] mr-2 text-[22px]" />
            </a>
          </div>
        </div>
        <div className="mt-10">{/* ...iframe como te lo dejé arriba... */}</div>
      </section>
      <Reseñas />
      <Footer />
    </>
  );
};

export default ContactanosPage;
