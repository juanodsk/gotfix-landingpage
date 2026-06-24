import { useEffect } from "react";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  defaultSeoImage,
  gotfixBusinessSchema,
} from "../data/seo";

const setMeta = (attribute, value, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const setStructuredData = (schema) => {
  const id = "gotfix-jsonld";
  let element = document.getElementById(id);

  if (!schema) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(schema);
};

function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = defaultSeoImage,
  schema = gotfixBusinessSchema,
}) {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteUrl(image);

    document.documentElement.lang = "es-CO";
    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "GotFix");
    setMeta("property", "og:locale", "es_CO");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "GotFix");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", imageUrl);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
    setCanonical(canonicalUrl);
    setStructuredData(schema);
  }, [description, image, path, schema, title]);

  return null;
}

export default SEO;
