import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import SEO from "../SEO";
import { gotfixBusinessSchema } from "../../data/seo";

const condicionesDescription =
  "Consulta los términos, condiciones, garantías y requisitos del servicio técnico de GotFix, y firma tu aceptación en línea.";

const pqrsDescription =
  "Radica peticiones, quejas, reclamos y solicitudes de garantía relacionadas con los servicios de GotFix.";

export default function CentroCondicionesLayout() {
  const { pathname } = useLocation();
  const esPqrs = pathname === "/pqrs";
  const title = esPqrs
    ? "PQRS | GotFix"
    : "Términos y condiciones | GotFix";
  const description = esPqrs ? pqrsDescription : condicionesDescription;

  return (
    <>
      <SEO
        title={title}
        description={description}
        path={pathname}
        schema={[
          gotfixBusinessSchema,
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            url: `https://gotfix.co${pathname}`,
            name: title,
            description,
          },
        ]}
      />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
