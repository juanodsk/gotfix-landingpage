import heroImage from "../assets/IMG_0852.jpg";

import { FaWhatsapp } from "react-icons/fa";

const imageFadeMask =
  "linear-gradient(90deg, transparent 0%, transparent 52%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0.62) 76%, #000 92%, #000 100%)";

function Carrousel() {
  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-[#00162b] text-white md:min-h-[620px]">
      <div className="absolute inset-0 z-0 bg-[#00162b]">
        <div className="absolute inset-y-0 left-0 w-[60%] bg-[radial-gradient(circle_at_28%_38%,rgba(0,135,250,0.34),transparent_30%),linear-gradient(135deg,#002c57_0%,#00162b_58%,#000b16_100%)]" />
        <div
          className="absolute inset-0 bg-[length:68%_auto] bg-no-repeat opacity-90 brightness-[0.68] saturate-[0.9] sm:bg-[length:58%_auto] md:bg-[length:48%_auto]"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: "right 32%",
            WebkitMaskImage: imageFadeMask,
            maskImage: imageFadeMask,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#00162b_0%,#00162b_50%,rgba(0,22,43,0.98)_58%,rgba(0,22,43,0.82)_68%,rgba(0,22,43,0.42)_80%,transparent_94%)]" />
        <div className="absolute inset-y-0 left-0 w-[48%] bg-[#00162b]/35 blur-3xl" />
        <div className="absolute inset-y-0 left-[48%] w-[18%] bg-[#00162b]/20 blur-3xl" />
      </div>

      <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,12,25,0.72)_0%,rgba(0,22,43,0.56)_36%,rgba(0,22,43,0.2)_66%,rgba(0,8,16,0.18)_100%)]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-[#00162b]/50" />

      <div className="container relative z-20 mx-auto max-w-[1120px] px-6 py-12 text-center md:py-16 md:text-left">
        <h1 className="mx-auto max-w-[340px] text-[2.15rem] font-extrabold leading-[1.12] drop-shadow-lg sm:text-4xl md:mx-0 md:max-w-xl md:text-5xl md:leading-tight">
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
      </div>
    </section>
  );
}

export default Carrousel;
