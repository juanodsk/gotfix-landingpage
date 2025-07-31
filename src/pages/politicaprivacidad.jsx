import React from "react";

const PoliticaDePrivacidad = () => {
  return (
    <main className="bg-[#111111] min-h-screen text-[#ececec] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#fcbc18] mb-8 text-center">
          Política de Privacidad
        </h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#fcbc18] mb-2">
            1. Información que recopilamos
          </h2>
          <p className="leading-relaxed text-[#d4d4d4]">
            Cuando completas el formulario de registro, recopilamos tu nombre
            completo y dirección de correo electrónico. Estos datos se recopilan
            con el único propósito de reservar tu cupo y enviarte información
            relacionada con el evento.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#fcbc18] mb-2">
            2. Uso de la información
          </h2>
          <p className="leading-relaxed text-[#d4d4d4]">
            Tu información personal será utilizada exclusivamente por nosotros
            para gestionar tu inscripción, enviarte actualizaciones importantes
            y otros contenidos relacionados con el evento. No compartimos,
            vendemos ni cedemos tus datos a terceros bajo ninguna circunstancia.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#fcbc18] mb-2">
            3. Seguridad de los datos
          </h2>
          <p className="leading-relaxed text-[#d4d4d4]">
            Nos comprometemos a proteger tu información mediante prácticas
            seguras y adecuadas. Tu información se almacena en sistemas
            protegidos y con acceso restringido únicamente al personal
            autorizado.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#fcbc18] mb-2">
            4. Derechos del usuario
          </h2>
          <p className="leading-relaxed text-[#d4d4d4]">
            Tienes derecho a solicitar el acceso, corrección o eliminación de
            tus datos personales en cualquier momento. Puedes hacerlo
            escribiéndonos directamente a nuestro correo de contacto.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#fcbc18] mb-2">
            5. Contacto
          </h2>
          <p className="leading-relaxed text-[#d4d4d4]">
            Si tienes preguntas o inquietudes sobre esta Política de Privacidad,
            puedes contactarnos en cualquier momento al correo{" "}
            <span className="underline text-[#fcbc18]">gotfixco@gmail.com</span>
            .
          </p>
        </section>

        <p className="text-sm text-[#888888] mt-12 text-center">
          Última actualización: {new Date().toLocaleDateString("es-CO")}
        </p>
      </div>
    </main>
  );
};

export default PoliticaDePrivacidad;
