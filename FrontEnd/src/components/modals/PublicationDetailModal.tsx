import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  User, 
  Calendar, 
  Share2, 
  Send, 
  Flag, 
  MessageSquare,
  Images,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { YoutubeEmbed } from '../shared/YoutubeEmbed';
import { UploadsController } from '../../controllers/uploadsController';
import { getPublicationSlides, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';

export const PublicationDetailModal: React.FC = () => {
  const { 
    selectedPublication, 
    setSelectedPublication, 
    communes, 
    setSelectedCommuneId, 
    setActiveTab, 
    comments, 
    addComment, 
    reportComment,
    currentUserRole,
    activeUser 
  } = useApp();

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [commentName, setCommentName] = useState<string>('');
  const [commentMessage, setCommentMessage] = useState<string>('');
  const [commentSuccess, setCommentSuccess] = useState<boolean>(false);

  if (!selectedPublication) return null;

  const commune = communes.find(c => c.id === selectedPublication.communeId);
  const publicationComments = comments.filter(c => c.publicationId === selectedPublication.id);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;

    addComment({
      publicationId: selectedPublication.id,
      authorName: commentName.trim() || (currentUserRole !== 'visitor' ? activeUser.name : 'Visiteur citoyen'),
      authorRole: currentUserRole === 'admin' ? 'admin' : currentUserRole === 'porteur' ? 'porteur' : 'citoyen',
      message: commentMessage.trim()
    });

    setCommentMessage('');
    setCommentName('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`À lire sur InnovSahel : « ${selectedPublication.title} »`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const slides = getPublicationSlides(selectedPublication);

  const hasVideo = !!(selectedPublication.youtubeUrl || selectedPublication.youtubeId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar with badges & close */}
          <div className="bg-[#08233C] p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                {selectedPublication.type === 'commune_news' ? 'Actualité Mairie' : 'Avancement d’initiative'}
              </span>
              <button
                onClick={() => {
                  setSelectedCommuneId(selectedPublication.communeId);
                  setSelectedPublication(null);
                  setActiveTab('ma_commune');
                }}
                className="text-xs text-[#38B6FF] hover:underline flex items-center gap-1 font-semibold"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{commune?.name}</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedPublication(null)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Header: Video or Carousel Slider */}
          <div className="relative w-full bg-slate-900 flex-shrink-0">
            {hasVideo ? (
              <div className="w-full">
                <YoutubeEmbed
                  youtubeId={selectedPublication.youtubeId}
                  youtubeUrl={selectedPublication.youtubeUrl}
                  title={selectedPublication.title}
                />
              </div>
            ) : slides.length > 0 ? (
              <div className="relative h-60 sm:h-80 w-full overflow-hidden">
                <img
                  src={slides[activeSlide]?.url}
                  alt={slides[activeSlide]?.caption || ''}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PUBLICATION_COVERS[selectedPublication.type || 'default'] || DEFAULT_PUBLICATION_COVERS.default;
                  }}
                  className="w-full h-full object-cover"
                />
                {slides[activeSlide]?.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white p-3 text-xs">
                    {slides[activeSlide]?.caption}
                  </div>
                )}

                {slides.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                      className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
                      className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {activeSlide + 1} / {slides.length}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>

          {/* Article Content & Metadata */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5 text-sm">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#38B6FF]" />
                  Publié par <strong>{selectedPublication.authorName}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {selectedPublication.date}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#08233C] leading-tight">
                {selectedPublication.title}
              </h2>

              <p className="text-sm font-semibold text-slate-600 italic mt-2 border-l-4 border-[#FADB58] pl-3 py-1 bg-slate-50 rounded-r-lg">
                {selectedPublication.metaDescription}
              </p>
            </div>

            {/* Social Share Strip */}
            <div className="flex items-center justify-between border-y border-slate-200 py-2.5">
              <span className="text-xs font-bold text-slate-600">Partager avec vos voisins :</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleShareFacebook}
                  className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Body text */}
            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed space-y-3 font-normal">
              {selectedPublication.content}
            </div>

            {/* Comments Space (Section 7.2) */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-[#08233C] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#38B6FF]" />
                  Réactions et commentaires ({publicationComments.length})
                </h4>
              </div>

              {/* Form */}
              <form onSubmit={handleSendComment} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
                {commentSuccess && (
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                    Votre commentaire est en ligne !
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Votre nom ou pseudonyme"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full sm:w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                />
                <textarea
                  rows={2}
                  placeholder="Écrivez votre message..."
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38B6FF] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08233C] text-white hover:bg-[#0B3B60] font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Commenter</span>
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="space-y-2.5 pt-1">
                {publicationComments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                      c.authorRole === 'admin'
                        ? 'bg-[#38B6FF]/15 border-[#38B6FF]/50 pl-4 border-l-4'
                        : c.authorRole === 'porteur'
                          ? 'bg-[#FADB58]/15 border-[#FADB58]/50 pl-4 border-l-4'
                          : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.authorName}</span>
                        {c.authorRole === 'admin' && (
                          <span className="bg-[#0B3B60] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            IMPACT SAHEL
                          </span>
                        )}
                        {c.authorRole === 'porteur' && (
                          <span className="bg-[#08233C] text-[#FADB58] text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            Porteur
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-slate-700">{c.message}</p>
                    <div className="mt-1 flex justify-end">
                      <button
                        onClick={() => reportComment(c.id)}
                        className={`text-[10px] flex items-center gap-1 cursor-pointer ${
                          c.reported ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        <span>{c.reported ? 'Signalé' : 'Signaler'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
