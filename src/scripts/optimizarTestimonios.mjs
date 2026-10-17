// Uso: FFMPEG_PATH=/ruta/ffmpeg node src/scripts/optimizarTestimonios.mjs
// Los originales y herramientas temporales quedan fuera de Git, en output/playwright/.
import { readFile, writeFile, mkdir, stat, copyFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const temporary = resolve(root, 'output/playwright/video-optimization');
const output = resolve(root, 'public/ricardo-academy/videos');
const executable = process.env.FFMPEG_PATH || 'ffmpeg';
const context = { window: {} };
vm.runInNewContext(await readFile(join(root, 'public/ricardo-academy/js/config.js'), 'utf8'), context);
const videos = context.window.LANDING_CONFIG.testimonios;
await mkdir(temporary, { recursive: true });
await mkdir(output, { recursive: true });

function run(args) {
  return new Promise((done, fail) => {
    const child = spawn(executable, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { windowsHide: true });
    let errors = '';
    child.stderr.on('data', chunk => { errors = (errors + chunk).slice(-6000); });
    child.on('error', fail);
    child.on('close', code => code === 0 ? done() : fail(new Error(errors || `FFmpeg: ${code}`)));
  });
}

async function publish(file, slug, extension) {
  const hash = createHash('sha256').update(await readFile(file)).digest('hex').slice(0, 12);
  const name = `${slug}-${hash}.${extension}`;
  await copyFile(file, join(output, name));
  return { path: `/ricardo-academy/videos/${name}`, bytes: (await stat(file)).size };
}

const report = [];
for (let i = 0; i < videos.length; i++) {
  const video = videos[i];
  const slug = ['camilo-f', 'juan', 'kevin', 'yan-carlos'][i];
  if (!slug) throw new Error('Definir un nombre de archivo para el nuevo testimonio.');
  const source = video.original || video.video;
  if (!source.startsWith('https://')) throw new Error(`Falta el original de ${video.nombre}.`);
  const original = join(temporary, `${slug}.mov`);
  try { await stat(original); } catch {
    const response = await fetch(source, { signal: AbortSignal.timeout(180000) });
    if (!response.ok) throw new Error(`No se pudo descargar ${video.nombre}: HTTP ${response.status}.`);
    await pipeline(Readable.fromWeb(response.body), createWriteStream(original));
  }
  const mp4 = join(temporary, `${slug}-720p.mp4`);
  const poster = join(temporary, `${slug}-poster.webp`);
  await run(['-i', original, '-map', '0:v:0', '-map', '0:a:0?', '-vf', 'scale=720:-2,fps=30',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '25', '-maxrate', '1400k', '-bufsize', '2800k',
    '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-level', '3.1', '-g', '60', '-threads', '2',
    '-c:a', 'aac', '-b:a', '96k', '-ac', '2', '-movflags', '+faststart', '-map_metadata', '-1', mp4]);
  await run(['-ss', '0.3', '-i', original, '-frames:v', '1', '-vf', 'scale=360:-2',
    '-c:v', 'libwebp', '-quality', '78', '-map_metadata', '-1', poster]);
  const optimized = await publish(mp4, `testimonio-${slug}-720p`, 'mp4');
  const cover = await publish(poster, `testimonio-${slug}-poster`, 'webp');
  const originalBytes = (await stat(original)).size;
  const item = { nombre: video.nombre, originalBytes, video: optimized, poster: cover,
    reductionPercent: Number(((1 - optimized.bytes / originalBytes) * 100).toFixed(2)),
    source: new URL(source).origin + new URL(source).pathname, posterTimeSeconds: 0.3 };
  report.push(item);
  console.log(JSON.stringify(item));
}
await writeFile(join(temporary, 'report.json'), JSON.stringify(report, null, 2) + '\n');
