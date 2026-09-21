import React, { useState } from 'react';
import { Youtube, ExternalLink } from 'lucide-react';

interface YoutubeEmbedProps {
  youtubeId?: string;
  youtubeUrl?: string;
  title?: string;
  className?: string;
}

/**
 * Extrait l'ID YouTube depuis une URL (watch?v=, youtu.be/, embed/).
 */
export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  );
  return match ? match[1] : null;
};

/**
 * Composant d'intégration YouTube responsive (16:9).
 * Accepte soit un youtubeId soit une youtubeUrl.
 */
export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({
  youtubeId,
  youtubeUrl,
  title = 'Vidéo YouTube',
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const videoId = youtubeId || (youtubeUrl ? extractYoutubeId(youtubeUrl) : null);

  if (!videoId) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">
        <Youtube className="w-4 h-4 flex-shrink-0" />
        <span>Lien YouTube invalide ou non reconnu.</span>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-lg ${className}`}>
      <div className="relative" style={{ paddingTop: '56.25%' }}>
        {!showPlayer ? (
          // Thumbnail cliquable (chargement différé de l'iframe)
          <div
            className="absolute inset-0 cursor-pointer group"
            onClick={() => setShowPlayer(true)}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback thumbnail
                (e.target as HTMLImageElement).src =
                  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            {/* Bouton Play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white fill-current ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Titre et lien externe */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm font-semibold truncate">{title}</p>
            </div>
          </div>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
      {/* Lien YouTube externe */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <span className="text-xs text-gray-400 font-medium">YouTube</span>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          Ouvrir <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default YoutubeEmbed;
