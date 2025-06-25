import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx"; // Asegúrate que esté creado
import TypeWritter from "../plugins/TypeWritter.jsx"; // Tu animación

const LandingPage = () => {
  useEffect(() => {
    document.title = "GotFix | Servicio Técnico Apple";
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-[65px] font-bold mb-4">
            Somos{" "}
            <span className="text-[#0087fa]">
              <TypeWritter text="Got" />
            </span>
            <span className="text-[#00162b]">
              <TypeWritter text="Fix" speed={300} />
            </span>
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Más de <strong>4000 reparaciones</strong> en iPhone, iPad y MacBook.
            Servicio técnico confiable, innovador y seguro.
          </p>
          <button className="bg-[#0087fa] text-white px-6 py-3 rounded font-semibold hover:bg-blue-600">
            Agenda tu reparación
          </button>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            ¿Por qué elegir GotFix?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 text-lg">
            <li>🔧 Más de 4000 dispositivos Apple reparados</li>
            <li>👨‍🔬 Equipo experto y preparado</li>
            <li>✅ Procesos técnicos seguros y certificados</li>
            <li>🧠 Soluciones modernas e innovadoras</li>
            <li>🤝 Servicio honesto y transparente</li>
            <li>🔐 Cuidamos la integridad de tu equipo</li>
          </ul>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Nuestros servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
            <div className="bg-white rounded shadow p-6">
              📱 Reparación de pantalla
            </div>
            <div className="bg-white rounded shadow p-6">
              🔋 Cambio de batería
            </div>
            <div className="bg-white rounded shadow p-6">
              🔌 Reparación de puertos
            </div>
            <div className="bg-white rounded shadow p-6">
              💻 Diagnóstico de MacBook
            </div>
            <div className="bg-white rounded shadow p-6">
              🧽 Mantenimiento preventivo
            </div>
            <div className="bg-white rounded shadow p-6">
              🛠 Restauración de sistema
            </div>
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            ¿Cómo funciona?
          </h2>
          <ol className="list-decimal pl-6 text-gray-700 text-lg space-y-3">
            <li>Nos contactas por WhatsApp o formulario</li>
            <li>Recibimos tu equipo o coordinamos la entrega</li>
            <li>Diagnóstico y reparación profesional</li>
            <li>Te devolvemos el dispositivo como nuevo</li>
          </ol>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            <blockquote className="bg-white p-6 rounded shadow">
              “GotFix me salvó. Repararon mi iPhone en solo 2 horas. Excelente
              atención.”
              <footer className="mt-2 text-sm text-gray-500">
                – Ana Rodríguez
              </footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded shadow">
              “Trabajo serio, rápido y con garantía. Muy recomendado.”
              <footer className="mt-2 text-sm text-gray-500">
                – Jorge Ramírez
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Galería de trabajos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Nuestro trabajo
          </h2>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-[#00162b] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tu dispositivo necesita ayuda?
          </h2>
          <p className="text-lg mb-6">
            No esperes más. Confía en los expertos Apple.
          </p>
          <button className="bg-[#0087fa] px-6 py-3 rounded font-semibold hover:bg-blue-600">
            Agenda tu reparación ahora
          </button>
        </div>
      </section>

      {/* Contacto */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>📍 Neiva, Huila — Atención de lunes a sábado</p>
          <p className="mt-2">📞 +57 300 000 0000 | 📩 contacto@gotfix.co</p>
          <p className="mt-2">Síguenos en Instagram y Facebook @gotfix</p>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
