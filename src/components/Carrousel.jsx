import React, { useState, useEffect } from "react";
import img1 from "../assets/Carrousel/img1.jpg";
import img2 from "../assets/Carrousel/img2.jpg";
import img3 from "../assets/Carrousel/img3.jpg"; // Asegúrate de tener varias imágenes

const images = [img1, img2, img3];

function Carrousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer); // Limpieza del intervalo
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <section className="relative h-[500px] text-center flex items-center justify-center overflow-hidden">
      {/* Imágenes de fondo */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-0" : "opacity-0 z-0"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center ",
          }}
        ></div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 z-10"></div>

      {/* Contenido */}
      <div className="relative z-20 text-white px-4">
        <p className="text-[25px] mb-6 font-bold drop-shadow-lg">
          Somos un centro de reparación para equipos Apple.
        </p>
        <button className="bg-[#0087fa] text-white px-6 py-3 rounded font-semibold hover:bg-blue-600">
          Cotiza tu reparación
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default Carrousel;
