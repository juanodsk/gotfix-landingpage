// Interpreta el enlace de video de un tema (YouTube, Vimeo o archivo .mp4).
// Devuelve null si el enlace está vacío o no se reconoce, para mostrar "Video próximamente".
export function interpretarVideo(enlace) {
  const url = (enlace ?? '').trim();
  if (!url) return null;

  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) {
    return {
      tipo: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0&modestbranding=1&playsinline=1`,
      vertical: url.includes('/shorts/'),
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
  if (vimeo) {
    const hash = vimeo[2] ? `&h=${vimeo[2]}` : '';
    return { tipo: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}?dnt=1${hash}`, vertical: false };
  }

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    return { tipo: 'archivo', src: url, vertical: null }; // el formato se detecta al cargar el video
  }

  return null;
}
