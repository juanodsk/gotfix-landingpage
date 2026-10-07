import { useState } from 'react';
import { LuPlay } from 'react-icons/lu';
import { interpretarVideo } from '../../utils/video';

// Video explicativo de un tema: vertical (9:16) u horizontal (16:9).
// Sin video, o si el archivo no carga, muestra un espacio "Video próximamente".
export default function VideoTema({ enlace, formato, titulo }) {
  const video = interpretarVideo(enlace);
  const [verticalDetectado, setVerticalDetectado] = useState(null);
  const [fallo, setFallo] = useState(false);

  const vertical = formato ? formato === 'vertical' : (video?.vertical ?? verticalDetectado ?? false);
  const marco = vertical ? 'mx-auto aspect-[9/16] w-full max-w-[340px]' : 'aspect-video w-full';

  if (!video || fallo) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#0087fa]/50 text-[#0087fa]">
          <LuPlay className="ml-0.5 h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-[14px] tracking-wide text-gray-500">Video próximamente</p>
      </div>
    );
  }

  return (
    <div className={`${marco} overflow-hidden rounded-2xl bg-black shadow-lg shadow-black/30`}>
      {video.tipo === 'iframe' ? (
        <iframe
          src={video.src}
          title={`Video: ${titulo}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video
          src={video.src}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
          aria-label={`Video: ${titulo}`}
          onLoadedMetadata={(e) => setVerticalDetectado(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
          onError={() => setFallo(true)}
        />
      )}
    </div>
  );
}
