import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { gotfixBusinessSchema } from "../data/seo";

const WHATSAPP_URL = "https://wa.link/7jzopx";
const servicesDescription =
  "Servicios GotFix para equipos Apple en Neiva: cambio de batería, pantalla, cámaras, mantenimiento por humedad, placa electrónica, teclado, RAM y almacenamiento.";

const servicesSchema = [
  gotfixBusinessSchema,
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://gotfix.co/servicios#servicio-tecnico-apple",
    name: "Servicio técnico Apple en Neiva",
    description: servicesDescription,
    provider: {
      "@id": "https://gotfix.co/#gotfix",
    },
    areaServed: {
      "@type": "City",
      name: "Neiva",
    },
    serviceType: [
      "Cambio de batería",
      "Cambio de pantalla",
      "Reparación de placa electrónica",
      "Mantenimiento por humedad",
      "Diagnóstico de equipos Apple",
    ],
  },
];

const serviceImages = import.meta.glob("../assets/services/*.webp", {
  eager: true,
  import: "default",
});

const images = Object.entries(serviceImages)
  .sort(([a], [b]) => {
    const aNumber = Number(a.match(/(\d+)\.webp$/)?.[1] ?? 0);
    const bNumber = Number(b.match(/(\d+)\.webp$/)?.[1] ?? 0);
    return aNumber - bNumber;
  })
  .map(([, image]) => image);

const getWrappedIndex = (index) => {
  if (index < 0) {
    return images.length - 1;
  }

  if (index >= images.length) {
    return 0;
  }

  return index;
};

const ServiciosPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef(null);

  const previousImage = () => {
    setActiveIndex((current) => getWrappedIndex(current - 1));
  };

  const nextImage = () => {
    setActiveIndex((current) => getWrappedIndex(current + 1));
  };

  const scrollThumbnails = (direction) => {
    if (!thumbsRef.current) {
      return;
    }

    thumbsRef.current.scrollBy({
      left: direction * 260,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const strip = thumbsRef.current;
    const activeThumb = strip?.querySelector(`[data-thumb-index="${activeIndex}"]`);

    if (!strip || !activeThumb) {
      return;
    }

    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.clientWidth;
    const stripWidth = strip.clientWidth;
    const targetLeft = Math.max(0, thumbLeft - stripWidth / 2 + thumbWidth / 2);

    strip.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-[#02111f]">
      <SEO
        title="Servicios GotFix | Reparación Apple en Neiva"
        description={servicesDescription}
        path="/servicios"
        schema={servicesSchema}
      />
      <Navbar />

      <section className="overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(69,146,218,0.2),_transparent_30%),linear-gradient(180deg,#00162b_0%,#02111f_54%,#042141_100%)] px-3 pb-6 pt-16 sm:px-5 sm:pb-8 sm:pt-18">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b223b]/80 px-3 py-4 shadow-[0_18px_52px_rgba(0,0,0,0.2)] sm:px-5 sm:py-5">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0 scale-110 bg-center bg-cover opacity-18 blur-3xl"
                style={{ backgroundImage: `url(${images[activeIndex]})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,22,43,0.35),rgba(2,17,31,0.72))]" />
            </div>

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="mt-1.5 text-xl text-white sm:text-2xl">
                    Nuestros Servicios
                  </h1>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Imagen anterior"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm text-white/90 transition hover:bg-white/14"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Siguiente imagen"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm text-white/90 transition hover:bg-white/14"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              <div className="mx-auto max-w-[560px] space-y-3">
                <div className="relative overflow-hidden rounded-[1.2rem] border border-white/12 bg-white/6 p-1.5 shadow-[0_12px_34px_rgba(0,0,0,0.12)]">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Escribir por WhatsApp sobre este servicio"
                    className="block"
                  >
                    <img
                      key={images[activeIndex]}
                      src={images[activeIndex]}
                      alt={`Servicio GotFix ${activeIndex + 1}`}
                      width="1080"
                      height="1080"
                      fetchPriority="high"
                      className="aspect-square w-full rounded-[0.95rem] object-cover"
                    />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollThumbnails(-1)}
                    aria-label="Ver miniaturas anteriores"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/8 text-xs text-white/90 transition hover:bg-white/14"
                  >
                    <FaChevronLeft />
                  </button>

                  <div
                    ref={thumbsRef}
                    className="services-thumbs-strip flex flex-1 gap-1.5 overflow-x-auto scroll-smooth"
                  >
                    {images.map((image, index) => {
                      const isActive = index === activeIndex;

                      return (
                        <button
                          key={image}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          target="_blank"
                          data-thumb-index={index}
                          aria-label={`Ver imagen ${index + 1}`}
                          className={`group relative w-[72px] shrink-0 overflow-hidden rounded-[0.8rem] border bg-white/6 transition duration-300 sm:w-[82px] ${
                            isActive
                              ? "border-[#7ed0ff]/70 shadow-[0_12px_26px_rgba(16,95,168,0.18)]"
                              : "border-white/10 hover:border-white/25"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Miniatura ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            width="1080"
                            height="1080"
                            className={`aspect-square w-full object-cover transition duration-300 ${
                              isActive
                                ? "scale-100 opacity-100"
                                : "scale-[1.03] opacity-58 group-hover:opacity-85"
                            }`}
                          />
                          <div
                            className={`absolute inset-0 transition duration-300 ${
                              isActive
                                ? "bg-transparent"
                                : "bg-[#031321]/35 group-hover:bg-[#031321]/20"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollThumbnails(1)}
                    aria-label="Ver siguientes miniaturas"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/8 text-xs text-white/90 transition hover:bg-white/14"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1 sm:hidden">
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Imagen anterior"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm text-white/90 transition hover:bg-white/14"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Siguiente imagen"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-sm text-white/90 transition hover:bg-white/14"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiciosPage;
