import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Eye, 
  Share2, 
  MessageSquare, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertTriangle,
  Building2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  User
} from 'lucide-react';
import { motion } from 'motion/react';

export const PublicationDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    selectedPublication: contextPublication, 
    setSelectedPublication, 
    publications,
    communes, 
    setSelectedCommuneId, 
    setActiveTab, 
    comments, 
    addComment,
    currentUserRole 
  } = useApp();

  const selectedPublication = (contextPublication && (!id || contextPublication.id === id))
    ? contextPublication
    : publications.find(p => p.id === id) || contextPublication;

  const [activeSlide, setActiveSlide] = useState(0);
  const [commentName, setCommentName] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPublication]);

  if (!selectedPublication) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs my-8 space-y-4">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-800">Actualité introuvable</h2>
        <p className="text-xs text-slate-500">L'actualité demandée n'existe pas ou a été déplacée.</p>
        <button
          onClick={() => navigate('/actualites')}
          className="px-4 py-2 bg-[#08233C] text-white rounded-xl text-xs font-bold hover:bg-[#0B3B60] transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voir toutes les actualités</span>
        </button>
      </div>
    );
  }

  const commune = communes.find(c => c.id === selectedPublication.communeId);
  const pubComments = comments.filter(c => c.publicationId === selectedPublication.id);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;

    addComment({
      publicationId: selectedPublication.id,
      authorName: commentName.trim() || 'Citoyen engagé',
      authorRole: currentUserRole === 'admin' ? 'admin' : currentUserRole === 'porteur' ? 'porteur' : 'citoyen',
      message: commentMessage.trim()
    });

    setCommentMessage('');
    setCommentName('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`À lire sur InnovSahel Bamako : « ${selectedPublication.title} »`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const slides = selectedPublication.carouselImages && selectedPublication.carouselImages.length > 0
    ? selectedPublication.carouselImages
    : [{ url: selectedPublication.coverImage, caption: selectedPublication.title }];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-back-to-news"
          onClick={() => {
            setSelectedPublication(null);
            navigate('/actualites');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#08233C] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux actualités</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Partager sur WhatsApp"
          >
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleShareFacebook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            title="Partager sur Facebook"
          >
            <span>Facebook</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Lien copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Article Header Metadata */}
        <header className="p-6 sm:p-8 pb-4 sm:pb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
              selectedPublication.type === 'commune_news'
                ? 'bg-[#08233C] text-[#FADB58]'
                : 'bg-[#38B6FF]/20 text-[#0B3B60]'
            }`}>
              {selectedPublication.type === 'commune_news' ? '🏛️ Actualité Mairie Officielle' : '🚀 Avancement d’initiative'}
            </span>

            {commune && (
              <button
                onClick={() => {
                  setSelectedCommuneId(selectedPublication.communeId);
                  setSelectedPublication(null);
                  navigate('/ma-commune/' + selectedPublication.communeId);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-[#08233C] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#38B6FF]" />
                <span>{commune.name}</span>
              </button>
            )}

            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {selectedPublication.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#08233C] leading-tight">
            {selectedPublication.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Publié par :</span>
              <span className="font-bold text-[#08233C] bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {selectedPublication.author}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-slate-400" />
                {selectedPublication.viewsCount} consultations
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                {pubComments.length} commentaires
              </span>
            </div>
          </div>
        </header>

        {/* Media Player or Carousel Hero */}
        <div className="relative w-full bg-slate-900 border-y border-slate-200">
          {selectedPublication.format === 'video' && selectedPublication.youtubeId ? (
            <div className="aspect-video w-full max-h-[550px]">
              <iframe
                src={`https://www.youtube.com/embed/${selectedPublication.youtubeId}?autoplay=1`}
                title={selectedPublication.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative">
              <div className="relative h-72 sm:h-96 md:h-[480px] w-full overflow-hidden">
                <img
                  src={slides[activeSlide]?.url}
                  alt={slides[activeSlide]?.caption || selectedPublication.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {slides[activeSlide]?.caption && (
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium bg-black/60 backdrop-blur-xs p-3 rounded-xl max-w-2xl">
                    {slides[activeSlide]?.caption}
                  </div>
                )}
              </div>

              {/* Slider Navigation controls */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md backdrop-blur-xs transition-colors cursor-pointer"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          activeSlide === i ? 'w-6 bg-[#FADB58]' : 'bg-white/60'
                        }`}
                        aria-label={`Aller à la diapositive ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Audio Embed if available */}
        {selectedPublication.format === 'audio' && (
          <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-amber-900 text-sm">Écouter la déclaration en bambara</h4>
              <p className="text-xs text-amber-700">Enregistrement audio certifié par les services municipaux</p>
            </div>
            <audio controls className="h-9">
              <source src={selectedPublication.audioUrl || '#'} type="audio/mpeg" />
              Votre navigateur ne prend pas en charge l'élément audio.
            </audio>
          </div>
        )}

        {/* Article Body Content */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed space-y-4 font-normal">
            {selectedPublication.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Social Share & Return footer banner */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => {
                setSelectedPublication(null);
                navigate('/actualites');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08233C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Revenir à la liste des actualités</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Partager :</span>
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
              >
                WhatsApp
              </button>
              <button
                onClick={handleShareFacebook}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Facebook
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Citizen Discussion & Comments Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#38B6FF]/15 text-[#0B3B60] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#08233C]">
                Commentaires & réactions des citoyens ({pubComments.length})
              </h2>
              <p className="text-xs text-slate-500">
                Espace citoyen modéré conformément à la charte d'engagement
              </p>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="pub-comment-author" className="block text-xs font-bold text-slate-600 mb-1">
                Votre nom ou pseudonyme :
              </label>
              <input
                id="pub-comment-author"
                type="text"
                placeholder="Ex: Fatoumata K., Habitant Commune IV"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#08233C] focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Votre statut actuel :
              </label>
              <div className="px-3 py-2 bg-slate-200/70 border border-slate-300 rounded-xl text-xs font-bold text-slate-700">
                {currentUserRole === 'admin' ? '🛡️ Administrateur IMPACT SAHEL' : currentUserRole === 'porteur' ? '👩🏾 Porteur d’initiative' : '👤 Citoyen'}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="pub-comment-text" className="block text-xs font-bold text-slate-600 mb-1">
              Votre commentaire ou question :
            </label>
            <textarea
              id="pub-comment-text"
              rows={3}
              placeholder="Partagez votre avis, vos questions ou vos encouragements..."
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium text-[#08233C] focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Les propos haineux ou diffamatoires sont systématiquement modérés.
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08233C] text-white font-extrabold text-xs hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#FADB58]" />
              <span>Publier</span>
            </button>
          </div>

          {commentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Votre commentaire a été publié avec succès ! Merci de votre participation.</span>
            </div>
          )}
        </form>

        {/* Comments List */}
        <div className="space-y-3">
          {pubComments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucun commentaire pour le moment. Soyez le premier à réagir !
            </div>
          ) : (
            pubComments.map((comm) => (
              <div
                key={comm.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-[#08233C]">
                      {comm.authorName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      comm.authorRole === 'admin'
                        ? 'bg-amber-100 text-amber-800'
                        : comm.authorRole === 'porteur'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {comm.authorRole === 'admin' ? 'Équipe IMPACT SAHEL' : comm.authorRole === 'porteur' ? 'Porteur d’initiative' : 'Citoyen'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{comm.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {comm.message}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
