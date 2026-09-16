import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Send, 
  Flag, 
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InitiativeDetailModal: React.FC = () => {
  const { 
    selectedInitiative, 
    setSelectedInitiative, 
    communes, 
    setSelectedCommuneId, 
    setActiveTab, 
    publications, 
    comments, 
    addComment, 
    reportComment,
    currentUserRole,
    activeUser,
    openPublicationById
  } = useApp();

  const [commentName, setCommentName] = useState<string>('');
  const [commentMessage, setCommentMessage] = useState<string>('');
  const [commentSuccess, setCommentSuccess] = useState<boolean>(false);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);

  if (!selectedInitiative) return null;

  const commune = communes.find(c => c.id === selectedInitiative.communeId);
  const initiativeUpdates = publications.filter(p => p.initiativeId === selectedInitiative.id);
  const initiativeComments = comments.filter(c => c.initiativeId === selectedInitiative.id || initiativeUpdates.some(u => u.id === c.publicationId));

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;

    addComment({
      initiativeId: selectedInitiative.id,
      authorName: commentName.trim() || (currentUserRole !== 'visitor' ? activeUser.name : 'Citoyen de Bamako'),
      authorRole: currentUserRole === 'admin' ? 'admin' : currentUserRole === 'porteur' ? 'porteur' : 'citoyen',
      message: commentMessage.trim()
    });

    setCommentMessage('');
    setCommentName('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Découvrez l'initiative citoyenne « ${selectedInitiative.title} » sur InnovSahel :`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Image banner */}
          <div className="relative h-56 sm:h-72 w-full flex-shrink-0 bg-slate-900">
            <img
              src={selectedInitiative.coverImage}
              alt={selectedInitiative.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08233C] via-black/30 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedInitiative(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on Cover */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-[#FADB58] text-[#08233C] text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedInitiative.domain}
                </span>

                <button
                  onClick={() => {
                    setSelectedCommuneId(selectedInitiative.communeId);
                    setSelectedInitiative(null);
                    setActiveTab('ma_commune');
                  }}
                  className="bg-white/25 hover:bg-white/40 text-white text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FADB58]" />
                  <span>{commune?.name}</span>
                </button>

                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  selectedInitiative.status === 'termine'
                    ? 'bg-emerald-500/90 text-white'
                    : selectedInitiative.status === 'en_cours'
                      ? 'bg-amber-400 text-[#08233C]'
                      : 'bg-blue-400 text-[#08233C]'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    {selectedInitiative.status === 'termine' ? 'Projet Terminé' : selectedInitiative.status === 'en_cours' ? 'Projet en cours' : 'Projet Démarré'}
                  </span>
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold leading-tight drop-shadow-sm">
                {selectedInitiative.title}
              </h2>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 text-sm">
            {/* Owner Bio Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {selectedInitiative.ownerAvatar ? (
                <img
                  src={selectedInitiative.ownerAvatar}
                  alt={selectedInitiative.ownerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#38B6FF] shadow-xs flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#08233C] text-[#FADB58] flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {selectedInitiative.ownerName.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base">
                    {selectedInitiative.ownerName}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#38B6FF]/20 text-[#0B3B60] px-2 py-0.5 rounded-md">
                    {selectedInitiative.ownerType === 'femme' ? 'Porteuse d’initiative' : selectedInitiative.ownerType === 'jeune' ? 'Jeune porteur' : 'Collectif citoyen'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedInitiative.ownerBio}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Démarrage : {selectedInitiative.startDate}
                  </span>
                  <span>•</span>
                  <span>{selectedInitiative.viewsCount} consultations</span>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleShareWhatsApp}
                  className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Partager sur WhatsApp"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
                <button
                  onClick={handleShareFacebook}
                  className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Partager sur Facebook"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">Facebook</span>
                </button>
              </div>
            </div>

            {/* Problem & Solution (Section 6.3.2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block mb-1">
                  ⚠️ Problème identifié dans le quartier
                </span>
                <p className="text-slate-800 text-sm leading-relaxed">
                  {selectedInitiative.problem}
                </p>
              </div>

              <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900 block mb-1">
                  💡 Solution apportée par le porteur
                </span>
                <p className="text-slate-800 text-sm leading-relaxed">
                  {selectedInitiative.solution}
                </p>
              </div>
            </div>

            {/* Beneficiaries banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FADB58] text-[#08233C] flex items-center justify-center flex-shrink-0 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Bénéficiaires directs du projet :</span>
                <span className="text-sm font-medium text-slate-900">{selectedInitiative.beneficiaries}</span>
              </div>
            </div>

            {/* Gallery (Section 6.3.2) */}
            {selectedInitiative.gallery.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-base text-[#08233C]">
                  Galerie photos de l'initiative
                </h4>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative h-64 sm:h-80">
                  <img
                    src={selectedInitiative.gallery[activeGalleryIdx]?.url}
                    alt={selectedInitiative.gallery[activeGalleryIdx]?.caption || ''}
                    className="w-full h-full object-cover"
                  />
                  {selectedInitiative.gallery[activeGalleryIdx]?.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white p-3 text-xs">
                      {selectedInitiative.gallery[activeGalleryIdx]?.caption}
                    </div>
                  )}

                  {selectedInitiative.gallery.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveGalleryIdx(prev => (prev === 0 ? selectedInitiative.gallery.length - 1 : prev - 1))}
                        className="absolute top-1/2 left-3 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveGalleryIdx(prev => (prev === selectedInitiative.gallery.length - 1 ? 0 : prev + 1))}
                        className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedInitiative.gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedInitiative.gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveGalleryIdx(i)}
                        className={`h-16 w-24 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                          activeGalleryIdx === i ? 'border-[#38B6FF] scale-98 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Updates published by owner */}
            {initiativeUpdates.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-base text-[#08233C]">
                  Journal des actualités d'avancement ({initiativeUpdates.length})
                </h4>
                <div className="space-y-3">
                  {initiativeUpdates.map((update) => (
                    <div
                      key={update.id}
                      onClick={() => {
                        setSelectedInitiative(null);
                        openPublicationById(update.id);
                      }}
                      className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img src={update.coverImage} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div>
                          <span className="text-[11px] text-slate-500 font-semibold">{update.date}</span>
                          <h5 className="font-bold text-slate-900 text-sm line-clamp-1">{update.title}</h5>
                          <p className="text-xs text-slate-600 line-clamp-1">{update.metaDescription}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section (Section 7.2) */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-[#08233C] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#38B6FF]" />
                  Commentaires citoyens ({initiativeComments.length})
                </h4>
                <span className="text-xs text-slate-500">
                  Ouvert à tous sans compte
                </span>
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleSendComment} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                {commentSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                    Votre commentaire a été publié immédiatement. Merci de votre soutien !
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Votre prénom ou pseudonyme"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                  />
                  <span className="text-[11px] text-slate-500 self-center hidden sm:inline">
                    Aucune inscription requise
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Écrivez un mot d'encouragement, un conseil ou une question pour ce projet..."
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38B6FF] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#08233C] text-white hover:bg-[#0B3B60] font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer le commentaire</span>
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-3 pt-2">
                {initiativeComments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                      c.authorRole === 'porteur'
                        ? 'bg-[#FADB58]/15 border-[#FADB58]/50 pl-4 border-l-4'
                        : c.authorRole === 'admin'
                          ? 'bg-[#38B6FF]/15 border-[#38B6FF]/50 pl-4 border-l-4'
                          : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.authorName}</span>
                        {c.authorRole === 'porteur' && (
                          <span className="bg-[#08233C] text-[#FADB58] text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            Porteur du projet
                          </span>
                        )}
                        {c.authorRole === 'admin' && (
                          <span className="bg-[#0B3B60] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                            IMPACT SAHEL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-slate-700">{c.message}</p>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => reportComment(c.id)}
                        className={`text-[10px] flex items-center gap-1 transition-colors cursor-pointer ${
                          c.reported ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        <span>{c.reported ? 'Signalé à l’administrateur' : 'Signaler'}</span>
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
