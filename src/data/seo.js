export const SITE_URL = "https://gotfix.co";

export const DEFAULT_TITLE = "GotFix | Servicio técnico Apple en Neiva";

export const DEFAULT_DESCRIPTION =
  "Servicio técnico Apple en Neiva para iPhone, MacBook, iPad e iMac. Reparaciones especializadas, repuestos de calidad y garantía GotFix de 6 meses.";

export const defaultSeoImage = "/gotfix-og.jpg";

export const absoluteUrl = (path = "/") => {
  if (path.startsWith("http")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const gotfixBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#gotfix`,
  name: "GOTFIX - Servicio técnico Apple Neiva",
  alternateName: "GotFix",
  url: SITE_URL,
  image: absoluteUrl(defaultSeoImage),
  logo: absoluteUrl("/favicon.png"),
  description: DEFAULT_DESCRIPTION,
  telephone: "+57 312 504 2689",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle 21 #5bis - 21 edificio Las Ceibas",
    addressLocality: "Neiva",
    addressRegion: "Huila",
    addressCountry: "CO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 2.9368210463434754,
    longitude: -75.29196736983681,
  },
  areaServed: {
    "@type": "City",
    name: "Neiva",
  },
  sameAs: [
    "https://www.facebook.com/Gotfixco/",
    "https://www.instagram.com/gotfix_co",
  ],
};
