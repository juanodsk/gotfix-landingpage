import React from "react";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import {
  FaMobileAlt,
  FaBatteryHalf,
  FaChargingStation,
  FaLaptop,
  FaBroom,
  FaRedo,
  FaWhatsapp,
} from "react-icons/fa";

const reviews = [
  {
    nombre: "Luis Alfredo Lozano Lozano",
    mensaje:
      "Me gusto el servicio, aunque la pantalla de mi celular estaba dañada, primero intentaron arreglarla (que funcionó) antes de venderme una nueva. Y la potencializacion de mi IMac funcionó muy bien, se nota el cambio en la velocidad y fluidez del equipo. Quedo como si estuviera estrenando. Totalmente Recomendados.",
    rating: 5,
  },
  {
    nombre: "Jefferon David Cantillo",
    mensaje:
      "Excelente servicio, recomiendo los trabajos realizados en la tienda y recomiendo mucho la atención antes, durante y finalizado el servicio, además te escriben luego para verificar que todo está muy bien con el equipo, quedo muy agradecido con la atención!! 🤗🤗",
    rating: 5,
  },
  {
    nombre: "MARIA PAULA MORA CHILA",
    mensaje:
      "Excelente experiencia con esta empresa! Su servicio técnico para equipos Apple es verdaderamente excepcional.Rápidos, eficientes y profesionales. Súper recomendados.",
    rating: 5,
  },
  {
    nombre: "Andres Galeano",
    mensaje:
      "Prestan un grandioso servicio, el personal es muy amable a la hora de atención, sus costos son accesibles y lo más importante, los equipos quedan muy bien reparados. Los recomiendo.",
    rating: 5,
  },
  {
    nombre: "jennifer andrea ramirez salazar",
    mensaje: "Excelente servicio , rápido y muy eficiente, muy recomendado",
    rating: 5,
  },
];

const GoogleReviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  return (
    <section className="relative py-16 bg-[#00162b] text-white">
      <div className="absolute inset-0  blur-sm" />
      <div className="relative z-10 container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-10 text-center">
          Lo que dicen nuestros clientes
        </h2>

        <Slider {...settings} className="max-w-3xl mx-auto">
          {reviews.map((review, index) => (
            <div key={index} className="px-4 ">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {review.nombre}
                  </h3>
                  <div className="flex text-yellow-400">
                    {Array(review.rating)
                      .fill()
                      .map((_, i) => (
                        <FaStar key={i} />
                      ))}
                  </div>
                </div>
                <p className="text-white/90 text-md">{review.mensaje}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default GoogleReviews;
