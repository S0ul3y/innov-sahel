import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PublicationFormat } from '../../types';
import { 
  Images, 
  Video, 
  Upload, 
  X, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Check, 
  Eye, 
  RotateCcw,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageUpload, MultiImageUpload } from '../shared/ImageUpload';

export const PublishModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    selectedCommuneId, 
    communes, 
    addPublication, 
    currentUserRole, 
    activeUser 
  } = useApp();

  // Step 1: Format Choice
  const [format, setFormat] = useState<PublicationFormat>('carousel');
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form fields
  const [title, setTitle] = useState<string>('');
  const [metaDescription, setMetaDescription] = useState<string>('');
  const [communeId, setCommuneId] = useState<string>(selectedCommuneId);
  const [coverImage, setCoverImage] = useState<string>(''); // Vide — l'admin charge sa propre image
  const [content, setContent] = useState<string>('');
  
  // Carousel images — vide par défaut, l'admin ajoute ses propres images réelles
  const [carouselImages, setCarouselImages] = useState<Array<{ url: string; caption?: string }>>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newImageCaption, setNewImageCaption] = useState<string>('');

  // Video
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [youtubeId, setYoutubeId] = useState<string>('');
  const [videoError, setVideoError] = useState<string>('');

  const [formError, setFormError] = useState<string>('');

  if (activeModal !== 'publish') return null;

  // Extract YouTube ID on input change
  const handleYoutubeChange = (url: string) => {
    setYoutubeUrl(url);
    setVideoError('');
    if (!url.trim()) {
      setYoutubeId('');
      return;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      setYoutubeId(match[2]);
      // Si pas d'image de couverture, utiliser la miniature YouTube automatiquement
      if (!coverImage || coverImage === '') {
        setCoverImage(`https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`);
      }
    } else {
      setVideoError('Veuillez entrer une adresse YouTube valide (ex: https://www.youtube.com/watch?v=...)');
      setYoutubeId('');
    }
  };

  const handleAddCarouselImage = () => {
    if (!newImageUrl.trim()) return;
    setCarouselImages(prev => [...prev, { url: newImageUrl.trim(), caption: newImageCaption.trim() || undefined }]);
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleRemoveCarouselImage = (index: number) => {
    setCarouselImages(prev => prev.filter((_, i) => i !== index));
  };

  // Rich text formatting simulation: insert markup/tags
  const applyFormat = (tag: string) => {
    if (tag === 'bold') setContent(prev => `${prev}\n**Texte en gras** `);
    else if (tag === 'italic') setContent(prev => `${prev}\n*Texte en italique* `);
    else if (tag === 'h2') setContent(prev => `${prev}\n\n## Titre de section\n`);
    else if (tag === 'h3') setContent(prev => `${prev}\n\n### Sous-titre\n`);
    else if (tag === 'list') setContent(prev => `${prev}\n- Élément de liste à puces\n- Deuxième élément`);
    else if (tag === 'numbered') setContent(prev => `${prev}\n1. Première étape\n2. Deuxième étape`);
    else if (tag === 'quote') setContent(prev => `${prev}\n> « Citation marquante d'un habitant ou du maire »`);
    else if (tag === 'link') setContent(prev => `${prev} [Lien web](https://impactsahel.org) `);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setFormError('Le titre principal est obligatoire.');
      return;
    }
    if (!metaDescription.trim()) {
      setFormError('La méta description (court résumé) est obligatoire.');
      return;
    }
    if (!content.trim()) {
      setFormError('Le contenu textuel de la publication est obligatoire.');
      return;
    }
    if (format === 'video' && !youtubeId) {
      setFormError('Un lien vidéo YouTube valide est obligatoire pour le format Vidéo.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    try {
      await addPublication({
        type: currentUserRole === 'admin' ? 'commune_news' : 'initiative_update',
        format,
        authorName: activeUser.name || 'Porteur Lab Citoyen',
        authorRole: currentUserRole === 'admin' ? 'admin' : 'porteur',
        communeId,
        title: title.trim(),
        metaDescription: metaDescription.trim(),
        coverImage,
        content: content.trim(),
        carouselImages: format === 'carousel' ? carouselImages : undefined,
        youtubeUrl: format === 'video' ? youtubeUrl : undefined,
        youtubeId: format === 'video' ? youtubeId : undefined,
        status,
        date: formattedDate
      });
      setActiveModal(null);
    } catch (err: any) {
      setFormError(err?.message || 'Erreur lors de la publication. Vérifiez votre connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#08233C] p-4 sm:p-5 text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Module de publication
                </span>
                <span className="text-xs text-slate-300">
                  {currentUserRole === 'admin' ? 'Actualité officielle de commune' : 'Avancement de mon initiative'}
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white mt-1">
                Créer une nouvelle publication
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPreview ? 'bg-[#38B6FF] text-[#08233C]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isPreview ? 'Éditer' : 'Aperçu'}</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body with scroll */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-sm space-y-5">
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
                {formError}
              </div>
            )}

            {isPreview ? (
              /* Live Preview rendering */
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#38B6FF] text-[#08233C] px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {format === 'carousel' ? 'Carrousel photos' : 'Vidéo'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {communes.find(c => c.id === communeId)?.name}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#08233C]">
                  {title || 'Titre de la publication'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-medium italic border-l-4 border-[#FADB58] pl-3 py-1">
                  {metaDescription || 'Résumé / Méta description de la publication...'}
                </p>

                {/* Media Preview */}
                {format === 'video' && youtubeId ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <img
                      src={coverImage}
                      alt={title}
                      className="w-full h-56 sm:h-72 object-cover rounded-xl shadow-xs"
                    />
                    {carouselImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {carouselImages.map((img, i) => (
                          <div key={i} className="rounded-lg overflow-hidden border border-slate-200">
                            <img src={img.url} alt={img.caption || ''} className="h-16 w-full object-cover" />
                            {img.caption && <p className="text-[10px] text-slate-500 p-1 truncate">{img.caption}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap text-slate-800 leading-relaxed pt-2">
                  {content || 'Contenu détaillé de la publication...'}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <>
                {/* 7.1.1 Choix du format de publication */}
                <div>
                  <label className="block text-xs font-extrabold text-[#08233C] uppercase tracking-wide mb-2">
                    1. Choix du format de publication <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormat('carousel')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        format === 'carousel'
                          ? 'border-[#08233C] bg-[#FADB58]/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${format === 'carousel' ? 'bg-[#08233C] text-[#FADB58]' : 'bg-slate-200 text-slate-600'}`}>
                        <Images className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs sm:text-sm">Carrousel d'images</span>
                        <span className="text-[11px] text-slate-500">Une ou plusieurs photos défilantes</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormat('video')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        format === 'video'
                          ? 'border-[#08233C] bg-[#38B6FF]/15 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${format === 'video' ? 'bg-[#08233C] text-[#38B6FF]' : 'bg-slate-200 text-slate-600'}`}>
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs sm:text-sm">Format Vidéo</span>
                        <span className="text-[11px] text-slate-500">Intégration fluide YouTube</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Commune concernée */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Commune de rattachement <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={communeId}
                      onChange={(e) => setCommuneId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                    >
                      {communes.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <ImageUpload
                      value={coverImage}
                      onChange={(url) => setCoverImage(url)}
                      label="Image mise en avant (Vignette) *"
                    />
                  </div>
                </div>

                {/* Titre Principal */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Titre principal de la publication <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Exemple : Aménagement d'un espace vert citoyen à Badalabougou"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                  />
                </div>

                {/* Méta description avec compteur de caractères (Section 7.1.2) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-800">
                      Méta description (Résumé de 2 à 3 lignes pour aperçu et partages) <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] font-bold ${metaDescription.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                      {metaDescription.length} / 160 car.
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Bref résumé accrocheur utilisé comme extrait dans les listes et lors des partages sur WhatsApp..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] resize-none"
                  />
                </div>

                {/* Format Spécifique : Carrousel ou Vidéo */}
                {format === 'carousel' ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <MultiImageUpload
                      value={carouselImages}
                      onChange={(imgs) => setCarouselImages(imgs)}
                      label="Images du carrousel (optimisées automatiquement en WebP)"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-[#08233C]">
                      Lien vidéo YouTube <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => handleYoutubeChange(e.target.value)}
                      placeholder="Ex : https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                    />
                    {videoError && (
                      <p className="text-xs text-red-600 font-medium">{videoError}</p>
                    )}
                    {youtubeId && (
                      <div className="mt-2 aspect-video max-w-sm rounded-xl overflow-hidden shadow-xs border border-slate-200">
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title="Aperçu vidéo"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 7.1.4 Éditeur de texte enrichi */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Corps de la publication (Texte enrichi) <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-100 rounded-t-xl border border-b-0 border-slate-300">
                    <button
                      type="button"
                      onClick={() => applyFormat('bold')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 font-bold text-xs cursor-pointer"
                      title="Gras"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('italic')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 italic text-xs cursor-pointer"
                      title="Italique"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('h2')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 text-xs font-bold cursor-pointer"
                      title="Titre H2"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('h3')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 text-xs font-bold cursor-pointer"
                      title="Sous-titre H3"
                    >
                      <Heading3 className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-px h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => applyFormat('list')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 text-xs cursor-pointer"
                      title="Liste à puces"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('numbered')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 text-xs cursor-pointer"
                      title="Liste numérotée"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('quote')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 text-xs cursor-pointer"
                      title="Citation"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('link')}
                      className="p-1.5 rounded hover:bg-white text-slate-700 text-xs cursor-pointer"
                      title="Lien hypertexte"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Rédigez ici le compte-rendu, les avancées, les témoignages ou les annonces citoyennes..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer Actions (Section 7.1.6) */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer comme brouillon'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FADB58] text-[#08233C] font-extrabold text-sm hover:bg-[#ebd048] transition-all shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#08233C]/30 border-t-[#08233C] rounded-full animate-spin" />
                    <span>Publication en cours...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publier maintenant</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
