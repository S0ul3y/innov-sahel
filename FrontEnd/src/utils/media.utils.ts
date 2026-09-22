import { Publication } from '../models/publication.model';

export const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');

/**
 * Normalise n'importe quelle URL de média (relative ou absolue).
 * Transforme '/images/optimized/...' ou '/uploads/...' en URL complète accessible.
 */
export function getMediaUrl(path?: string | null, fallbackUrl?: string): string {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return fallbackUrl || '';
  }
  const clean = path.trim();
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('blob:') ||
    clean.startsWith('data:')
  ) {
    return clean;
  }
  const normalized = clean.startsWith('/') ? clean : `/${clean}`;
  return `${BACKEND_URL}${normalized}`;
}

/**
 * Images par défaut de haute qualité selon le type de publication
 */
export const DEFAULT_PUBLICATION_COVERS: Record<string, string> = {
  commune_news: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
  activity: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
  initiative_update: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800',
  default: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800'
};

/**
 * Obtient l'URL d'image de couverture d'une publication avec résolution intelligente :
 * 1. Image de couverture (uploadée ou lien externe)
 * 2. Première image valide du carrousel
 * 3. Miniature YouTube si c'est un format vidéo
 * 4. Image de secours esthétique thématique
 */
export function getPublicationCover(pub?: Partial<Publication> | null): string {
  if (!pub) return DEFAULT_PUBLICATION_COVERS.default;

  // 1. Cover image explicite
  if (pub.coverImage && typeof pub.coverImage === 'string' && pub.coverImage.trim() !== '') {
    return getMediaUrl(pub.coverImage);
  }

  // 2. Première image du carrousel si disponible
  if (Array.isArray(pub.carouselImages) && pub.carouselImages.length > 0) {
    const first = pub.carouselImages.find(
      (img: any) => img && typeof img === 'object' && typeof img.url === 'string' && img.url.trim() !== ''
    );
    if (first) {
      return getMediaUrl(first.url);
    }
  }

  // 3. Miniature YouTube automatique pour les vidéos
  if (pub.youtubeId && typeof pub.youtubeId === 'string' && pub.youtubeId.trim() !== '') {
    return `https://img.youtube.com/vi/${pub.youtubeId}/hqdefault.jpg`;
  }
  if (pub.youtubeUrl && typeof pub.youtubeUrl === 'string') {
    const match = pub.youtubeUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }

  // 4. Image de secours thématique
  const typeKey = pub.type || 'default';
  return DEFAULT_PUBLICATION_COVERS[typeKey] || DEFAULT_PUBLICATION_COVERS.default;
}

/**
 * Obtient la liste nettoyée des diapositives d'une publication pour le carrousel
 */
export function getPublicationSlides(pub?: Partial<Publication> | null): Array<{ url: string; caption?: string }> {
  if (!pub) return [{ url: DEFAULT_PUBLICATION_COVERS.default, caption: '' }];

  const validSlides: Array<{ url: string; caption?: string }> = [];

  if (Array.isArray(pub.carouselImages)) {
    for (const img of pub.carouselImages) {
      if (img && typeof img === 'object' && typeof img.url === 'string' && img.url.trim() !== '') {
        validSlides.push({
          url: getMediaUrl(img.url),
          caption: img.caption || undefined
        });
      }
    }
  }

  if (validSlides.length > 0) {
    return validSlides;
  }

  // Fallback vers l'image de couverture ou YouTube ou default
  const cover = getPublicationCover(pub);
  return [{ url: cover, caption: pub.title || '' }];
}
