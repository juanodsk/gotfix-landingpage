// scripts/uploadAll.js
import "dotenv/config"; // ← carga .env.local automáticamente
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("❌  Falta BLOB_READ_WRITE_TOKEN en variables de entorno");
  process.exit(1);
}

const videosDir = path.join(process.cwd(), "public", "videos");

const subirVideos = async () => {
  const archivos = fs.readdirSync(videosDir).filter((f) => f.endsWith(".mp4"));
  if (!archivos.length) {
    console.log("No se encontraron videos .mp4 en public/videos");
    return;
  }

  for (const archivo of archivos) {
    const ruta = path.join(videosDir, archivo);
    const buffer = fs.readFileSync(ruta);

    console.log(`⏫  Subiendo ${archivo}…`);
    try {
      const { url } = await put(archivo, buffer, { access: "public", token });
      console.log(`✅  URL: ${url}\n`);
    } catch (err) {
      console.error(`❌  Error al subir ${archivo}:`, err.message);
      console.log("🧪 Token detectado:", process.env.BLOB_READ_WRITE_TOKEN);
    }
  }
};

subirVideos();
