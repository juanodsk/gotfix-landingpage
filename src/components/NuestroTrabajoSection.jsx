import React, { useState } from "react";
import ReactPlayer from "react-player";

// NOTA:
// Los archivos mp4 están ahora en la carpeta `public/videos/`.
// No hace falta importarlos; basta con apuntar a la ruta absoluta
// que será resolvida por el servidor estático (Vite/React).
// Ej.: /videos/vid1.mp4 👉 public/videos/vid1.mp4

const videos = [
  {
    titulo: "Cristal de Pantalla IPhone 15 Pro Max",
    url: "/videos/vid1.mp4",
  },
  {
    titulo: "iPhone 13 batería y cristal trasero",
    url: "/videos/vid2.mp4",
  },
  {
    titulo: "iPhone SE reemplazo de cristal trasero y pantalla",
    url: "/videos/vid3.mp4",
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

          {/* Player responsivo 16:9 */}
          <div className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden">
            <ReactPlayer
              key={videos[indiceActual].url}
              url={videos[indiceActual].url}
              controls
              width="100%"
              height="100%"
              playing={false}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload", // evita descarga directa en algunos navegadores
                  },
                },
              }}
              className="absolute top-0 left-0 rounded-xl"
            />
          </div>

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
      </div>
    </section>
  );
};

export default VideoCarrusel;
