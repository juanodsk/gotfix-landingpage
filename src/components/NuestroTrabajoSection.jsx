import React, { useState } from "react";

const videos = [
  {
    titulo: "Reparación de pantalla",
    url: "https://www.instagram.com/reel/DLbAQnHMF_t/embed",
  },
  {
    titulo: "¿Sin señal de Simcard?",
    url: "https://www.instagram.com/reel/CwYcPE4uiMJ/embed",
  },
  {
    titulo: "Limpieza interna y mantenimiento",
    url: "https://www.instagram.com/reel/CzABCDE1234/embed",
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
        <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md">
          {videos[indiceActual].titulo}
        </h2>

        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/10">
          <iframe
            key={videos[indiceActual].url}
            src={videos[indiceActual].url}
            className="w-full h-[650px] rounded-xl border-none overflow-hidden"
            allowtransparency="true"
            allow="encrypted-media"
            title={videos[indiceActual].titulo}
          />
        </div>

        {/* Botones de navegación */}
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
    </section>
  );
};

export default VideoCarrusel;
