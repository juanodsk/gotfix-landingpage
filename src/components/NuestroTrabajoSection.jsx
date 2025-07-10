import React, { useState } from "react";
import Vid1 from "../assets/videos/vid1.mp4";
import Vid2 from "../assets/videos/vid2.MOV";
import Vid3 from "../assets/videos/vid3.mp4";
import Vid4 from "../assets/videos/vid4.mp4";
import Vid5 from "../assets/videos/vid5.mp4";
import Vid6 from "../assets/videos/vid6.mp4";

const videos = [
  {
    titulo: "Señales que indican que tu iPhone tiene problemas de placa",
    url: Vid1,
  },
  {
    titulo: "Reemplazo de Cristal de Pantalla IPhone 15 Pro Max",
    url: Vid2,
  },
  {
    titulo: " Aumento de Memoria IPhone 11",
    url: Vid3,
  },
  {
    titulo: "Reemplazo de mica táctil y batería ",
    url: Vid4,
  },
  {
    titulo: "iPhone 13 cambio de batería y cristal trasero",
    url: Vid5,
  },
  {
    titulo: "Servicio Cargador MacBook",
    url: Vid6,
  },
];

const VideoCarrusel = () => {
  const [indiceActual, setIndiceActual] = useState(0);

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % videos.length);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  return (
    <section className="relative py-16 bg-[#00162b] text-white">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#002c57] via-[#00162b] to-black opacity-60 blur-md" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10">
          <h2 className="text-3xl md:text-3xl font-bold mb-6 drop-shadow-md">
            {videos[indiceActual].titulo}
          </h2>
          <video
            key={videos[indiceActual].url}
            src={videos[indiceActual].url}
            controls
            className="w-full h-[400px] md:h-[600px] rounded-xl"
          >
            Tu navegador no soporta el video...
          </video>
          <div className="mt-6 flex justify-center gap-6">
            <button
              onClick={anterior}
              className="px-4 py-2 cursor-pointer bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition"
            >
              ◀ Anterior
            </button>
            <button
              onClick={siguiente}
              className="px-4 py-2 cursor-pointer bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition"
            >
              Siguiente ▶
            </button>
          </div>
        </div>

        {/* Botones de navegación */}
      </div>
    </section>
  );
};

export default VideoCarrusel;
