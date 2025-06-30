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
    nombre: "Camila R.",
    mensaje:
      "Excelente servicio. Repararon mi iPhone en el mismo día. ¡Súper recomendado!",
    rating: 5,
  },
  {
    nombre: "Andrés M.",
    mensaje:
      "Muy profesionales. Me explicaron todo el proceso con claridad y confianza.",
    rating: 5,
  },
  {
    nombre: "Laura G.",
    mensaje:
      "Rápido, seguro y confiable. GotFix es mi lugar de confianza para reparaciones Apple.",
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
