import React, { useState } from "react";
import ReactPlayer from "react-player";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// URLs servidas desde Vercel Blob (ya incluyen Accept‑Ranges y funcionan en Safari)
const videos = [
  {
    titulo: "Cristal de pantalla iphone 16 pro max",
    url: "https://res.cloudinary.com/dnfarbnys/video/upload/v1777419510/vid_3_whehkg.mp4",
  },
  {
    titulo: "Aumento de memoria Iphone 16 Pro",
    url: "https://res.cloudinary.com/dnfarbnys/video/upload/v1777419510/vid_4_xlnkoh.mp4",
  },
  {
    titulo: "Reemplazo de pantalla Iphone 15 pro max",
    url: "https://res.cloudinary.com/dnfarbnys/video/upload/v1777419507/vid_1_btp6ub.mp4",
  },
  {
    titulo: "Reemplazo de cristal trasero 16 Pro max",
    url: "https://res.cloudinary.com/dnfarbnys/video/upload/v1777419505/vid_2_ofzqgb.mp4",
  },
  {
    titulo: "Cambio de bateria Iphone 13 Pro max",
    url: "https://res.cloudinary.com/dnfarbnys/video/upload/v1777419499/vid_5_ljinlr.mp4",
  },
];

const FlechaCarrusel = ({ className = "", onClick, direction }) => {
  const isPrev = direction === "prev";
  const isDisabled = className.includes("slick-disabled");

  return (
    <button
      type="button"
      className={`absolute top-1/2 !flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/15 text-base text-white shadow-lg backdrop-blur-md transition z-20 ${
        isDisabled ? "cursor-not-allowed opacity-35" : "hover:bg-white/25"
      } ${
        isPrev
          ? "-left-3 md:-left-6 lg:-left-10"
          : "-right-3 md:-right-6 lg:-right-10"
      }`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={isPrev ? "Video anterior" : "Video siguiente"}
    >
      {isPrev ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  );
};

const VideoCarrusel = () => {
  const [videoActivo, setVideoActivo] = useState(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <FlechaCarrusel direction="prev" />,
    nextArrow: <FlechaCarrusel direction="next" />,
    beforeChange: () => setVideoActivo(null),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="relative py-16 bg-[#00162b] text-white">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#002c57] via-[#00162b] to-black opacity-60 blur-md" />

      <div className="relative z-10 container mx-auto px-8 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 drop-shadow-md">
          Nuestro trabajo
        </h2>

        <div className="max-w-6xl mx-auto px-2 md:px-8">
          <Slider {...settings}>
            {videos.map((video, index) => (
              <div key={video.url} className="px-3">
                <article className="bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/10 h-full">
                  <h3 className="min-h-14 flex items-center justify-center text-sm md:text-base font-semibold mb-3 px-2 leading-snug">
                    {video.titulo}
                  </h3>

                  <div className="relative w-full h-[330px] sm:h-[390px] lg:h-[430px] rounded-lg overflow-hidden bg-black">
                    <ReactPlayer
                      url={video.url}
                      controls
                      width="100%"
                      height="100%"
                      playing={videoActivo === index}
                      onPlay={() => setVideoActivo(index)}
                      onPause={() => setVideoActivo(null)}
                      config={{
                        file: {
                          attributes: { controlsList: "nodownload" },
                        },
                      }}
                      className="absolute top-0 left-0"
                    />
                  </div>
                </article>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};
export default VideoCarrusel;
