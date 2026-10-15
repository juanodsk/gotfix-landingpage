import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// La landing entregada se conserva como documento independiente, sin estilos React.
function ricardoAcademyLanding() {
  const mount = (server) => {
    server.middlewares.use((req, _res, next) => {
      const [pathname, query] = (req.url || "").split("?");
      if (pathname === "/cursos" || pathname.startsWith("/cursos/")) {
        _res.writeHead(308, { Location: req.url.replace("/cursos", "/ricardo-academy") });
        _res.end();
        return;
      }
      if (pathname === "/ricardo-academy" || pathname === "/ricardo-academy/") {
        req.url = `/ricardo-academy/index.html${query !== undefined ? `?${query}` : ""}`;
      }
      next();
    });
  };

  return {
    name: "ricardo-academy-landing",
    configureServer: mount,
    configurePreviewServer: mount,
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [ricardoAcademyLanding(), react(), tailwindcss()],
});
