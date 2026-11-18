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
  Sparkles,
  Loader2,
  ShieldCheck,
  CornerDownRight,
  Reply,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { getPublicationSlides, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';
import { ArticleContent } from '../shared/ArticleContent';
import { PublicationsController } from '../../controllers/publicationsController';
import { Publication } from '../../models/publication.model';

export const PublicationDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { 
    selectedPublication: contextPublication, 
    setSelectedPublication, 
    publications,
    communes, 
    setSelectedCommuneId, 
    comments, 
    addComment,
    replyComment,
    loadCommentsForPublication,
    currentUserRole,
    activeUser
  } = useApp();

  const [fetchedPublication, setFetchedPublication] = useState<Publication | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Formulaire de commentaire principal
  const [commentName, setCommentName] = useState(
    currentUserRole === 'admin' ? (activeUser?.name || 'Administrateur IMPACT SAHEL') : ''
  );
  const [commentMessage, setCommentMessage] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Réponse spécifique à un commentaire particulier
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccessId, setReplySuccessId] = useState<string | null>(null);

  // Détermination de la publication à afficher
  const selectedPublication: Publication | null =
    (contextPublication && (!id || contextPublication.id === id))
      ? contextPublication
      : (id ? publications.find(p => p.id === id) : null) || fetchedPublication || null;

  // Récupération de secours depuis l'API si la publication n'est pas encore dans le contexte
  useEffect(() => {
    if (!id) return;
    const existsInList = publications.find(p => p.id === id);
    if (!existsInList && !contextPublication) {
      let isMounted = true;
      setIsLoading(true);
      PublicationsController.getById(id)
        .then((data) => {
          if (isMounted && data) {
            setFetchedPublication(data);
            setSelectedPublication(data);
          }
        })
        .catch((err) => {
          console.warn('Impossible de charger la publication par ID:', err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [id, publications, contextPublication, setSelectedPublication]);

  // Réinitialiser le slide et scroller en haut quand la publication change
  useEffect(() => {
    setActiveSlide(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPublication?.id]);

  // Pré-remplir le nom si le rôle d'administrateur change
  useEffect(() => {
    if (currentUserRole === 'admin' && !commentName) {
      setCommentName(activeUser?.name || 'Administrateur IMPACT SAHEL');
    }
  }, [currentUserRole, activeUser, commentName]);

  // Charger les commentaires depuis la DB à l'ouverture de la publication
  useEffect(() => {
    const pubId = selectedPublication?.id || id;
    if (pubId) {
      loadCommentsForPublication(pubId);
    }
  }, [selectedPublication?.id, id, loadCommentsForPublication]);

  const handleBack = () => {
    setSelectedPublication(null);
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/actualites');
    }
  };

  if (isLoading && !selectedPublication) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs my-8 space-y-4">
        <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Chargement de l'actualité...</h2>
        <p className="text-xs text-slate-500">Veuillez patienter pendant la récupération des détails.</p>
      </div>
    );
  }

  if (!selectedPublication) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs my-8 space-y-4">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-800">Actualité introuvable</h2>
        <p className="text-xs text-slate-500">L'actualité demandée n'existe pas ou a été déplacée.</p>
        <button
          onClick={() => navigate('/actualites')}
          className="px-4 py-2 bg-[#08233C] text-white rounded-xl text-xs font-bold hover:bg-[#0B3B60] transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voir toutes les actualités</span>
        </button>
      </div>
    );
  }

  const commune = communes.find(c => c.id === selectedPublication.communeId);
  const pubComments = Array.isArray(comments)
    ? comments.filter(c => c && c.publicationId === selectedPublication.id)
    : [];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;
    setCommentError('');

    try {
      const authorRoleToUse = currentUserRole === 'admin' ? 'admin' : currentUserRole === 'porteur' ? 'porteur' : 'citoyen';
      const defaultName = currentUserRole === 'admin' ? (activeUser?.name || 'Administrateur IMPACT SAHEL') : 'Citoyen engagé';

      await addComment({
        publicationId: selectedPublication.id,
        authorName: commentName.trim() || defaultName,
        authorRole: authorRoleToUse,
        message: commentMessage.trim()
      });

      setCommentMessage('');
      if (currentUserRole !== 'admin') {
        setCommentName('');
      }
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3500);
    } catch (err: any) {
      setCommentError(err?.message || 'Erreur lors de l\'envoi du commentaire. Vérifiez votre connexion.');
    }
  };

  // Répondre spécifiquement à un commentaire citoyen
  const handleSendReply = async (commentId: string) => {
    if (!replyMessage.trim()) return;
    setReplyError('');
    setIsSubmittingReply(true);

    try {
      const adminName = activeUser?.name || 'Équipe municipale & IMPACT SAHEL';
      await replyComment(commentId, replyMessage.trim(), adminName);
      
      setReplyMessage('');
      setReplyingToId(null);
      setReplySuccessId(commentId);
      setTimeout(() => setReplySuccessId(null), 3500);
    } catch (err: any) {
      setReplyError(err?.message || 'Impossible d\'enregistrer votre réponse.');
    } finally {
      setIsSubmittingReply(false);
    }
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

  const slides = getPublicationSlides(selectedPublication);
  const safeActiveSlide = Math.min(activeSlide, Math.max(0, slides.length - 1));
  const currentSlide = slides[safeActiveSlide] || slides[0] || { url: DEFAULT_PUBLICATION_COVERS.default, caption: '' };

  const authorDisplayName =
    selectedPublication.authorName ||
    (selectedPublication as any).author ||
    (selectedPublication.type === 'commune_news' ? 'Mairie de Bamako' : 'Équipe IMPACT SAHEL');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-back-to-news"
          onClick={handleBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#08233C] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
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
                : selectedPublication.type === 'activity'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-[#38B6FF]/20 text-[#0B3B60]'
            }`}>
              {selectedPublication.type === 'commune_news'
                ? '🏛️ Actualité Mairie Officielle'
                : selectedPublication.type === 'activity'
                  ? '🎯 Activité Municipale / Citoyenne'
                  : '🚀 Avancement d’initiative'}
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
              {selectedPublication.date || 'Récemment'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#08233C] leading-tight">
            {selectedPublication.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Publié par :</span>
              <span className="font-bold text-[#08233C] bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {authorDisplayName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-slate-400" />
                {selectedPublication.viewsCount || 0} consultations
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
                  src={currentSlide?.url}
                  alt={currentSlide?.caption || selectedPublication.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      DEFAULT_PUBLICATION_COVERS[selectedPublication.type || 'default'] || DEFAULT_PUBLICATION_COVERS.default;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {currentSlide?.caption && (
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium bg-black/60 backdrop-blur-xs p-3 rounded-xl max-w-2xl">
                    {currentSlide.caption}
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
                          safeActiveSlide === i ? 'w-6 bg-[#FADB58]' : 'bg-white/60'
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

        {/* Article Body Content */}
        <div className="p-6 sm:p-10 space-y-6">
          <ArticleContent content={selectedPublication.content} />

          {/* Social Share & Return footer banner */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08233C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Revenir aux actualités</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Partager :</span>
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                WhatsApp
              </button>
              <button
                onClick={handleShareFacebook}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
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
                Commentaires & échanges avec la Mairie ({pubComments.length})
              </h2>
              <p className="text-xs text-slate-500">
                Espace citoyen transparent : vos messages sont lus et répondus par l'équipe municipale.
              </p>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="pub-comment-author" className="block text-xs font-bold text-slate-600 mb-1">
                Votre nom ou statut :
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
                Profil d'intervention :
              </label>
              <div className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                currentUserRole === 'admin'
                  ? 'bg-[#08233C] text-[#FADB58] border-[#08233C]'
                  : currentUserRole === 'porteur'
                    ? 'bg-blue-100 text-blue-900 border-blue-200'
                    : 'bg-slate-200/70 border-slate-300 text-slate-700'
              }`}>
                {currentUserRole === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#38B6FF]" />
                    <span>🛡️ Réponse officielle Administrateur / Mairie</span>
                  </>
                ) : currentUserRole === 'porteur' ? (
                  <>
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>👩🏾 Porteur d’initiative</span>
                  </>
                ) : (
                  <span>👤 Citoyen de Bamako</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="pub-comment-text" className="block text-xs font-bold text-slate-600 mb-1">
              {currentUserRole === 'admin' ? 'Votre message ou réponse officielle :' : 'Votre question, avis ou proposition :'}
            </label>
            <textarea
              id="pub-comment-text"
              rows={3}
              placeholder={
                currentUserRole === 'admin'
                  ? "Rédigez une réponse officielle de la Mairie ou de l'équipe IMPACT SAHEL à l'attention des citoyens..."
                  : "Partagez votre avis, vos questions aux services municipaux ou vos encouragements..."
              }
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium text-[#08233C] focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              {currentUserRole === 'admin'
                ? "Ce message apparaîtra avec le badge officiel de la Mairie."
                : "Les services municipaux sont notifiés de vos contributions."}
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08233C] text-white font-extrabold text-xs hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#FADB58]" />
              <span>{currentUserRole === 'admin' ? 'Publier la réponse officielle' : 'Publier mon commentaire'}</span>
            </button>
          </div>

          {commentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Votre commentaire a été publié avec succès et est visible de tous.</span>
            </div>
          )}
          {commentError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>{commentError}</span>
            </div>
          )}
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {pubComments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucun commentaire pour le moment. Soyez le premier à poser une question ou réagir !
            </div>
          ) : (
            pubComments.map((comm) => {
              const isAdmin = comm.authorRole === 'admin';
              const isReplyingThis = replyingToId === comm.id;
              const hasReply = !!comm.replyText;

              return (
                <div
                  key={comm.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all space-y-3 ${
                    isAdmin
                      ? 'bg-gradient-to-r from-sky-50/80 via-white to-sky-50/40 border-2 border-[#38B6FF] shadow-xs'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  {/* Comment Author Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-xs text-[#08233C]">
                        {comm.authorName}
                      </span>

                      {/* Rôle & Badge Officiel */}
                      {isAdmin ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#08233C] text-[#FADB58] flex items-center gap-1 shadow-2xs border border-[#38B6FF]/30">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#38B6FF]" />
                          <span>Réponse officielle de la Mairie / IMPACT SAHEL</span>
                        </span>
                      ) : comm.authorRole === 'porteur' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          Porteur d’initiative
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                          Citoyen
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{comm.date}</span>
                  </div>

                  {/* Comment Message Body */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {comm.message}
                  </p>

                  {/* Réponse Officielle imbriquée (si existante) */}
                  {hasReply && (
                    <div className="mt-3 ml-2 sm:ml-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#EFF8FF] to-white border-2 border-[#38B6FF]/40 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#08233C]">
                          <ShieldCheck className="w-4 h-4 text-[#38B6FF] flex-shrink-0" />
                          <span>Réponse officielle : {comm.replyAuthorName || "Équipe municipale"}</span>
                        </div>
                        {comm.replyDate && (
                          <span className="text-[10px] text-slate-500 font-semibold">{comm.replyDate}</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium pl-1">
                        {comm.replyText}
                      </p>
                    </div>
                  )}

                  {/* Message de succès après réponse */}
                  {replySuccessId === comm.id && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Votre réponse officielle a été transmise et est désormais visible sous ce commentaire !</span>
                    </div>
                  )}

                  {/* Barre d'action : bouton Répondre */}
                  <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
                      {hasReply ? "✓ Ce citoyen a reçu une réponse officielle." : "Ce commentaire attend une réaction."}
                    </span>

                    <button
                      onClick={() => {
                        setReplyingToId(isReplyingThis ? null : comm.id);
                        setReplyMessage('');
                        setReplyError('');
                      }}
                      className="inline-flex items-center gap-1 text-[#08233C] hover:text-[#38B6FF] font-bold transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-slate-100"
                    >
                      <Reply className="w-3.5 h-3.5 text-[#38B6FF]" />
                      <span>{isReplyingThis ? 'Fermer' : 'Répondre à ce citoyen'}</span>
                    </button>
                  </div>

                  {/* Formulaire de réponse en ligne */}
                  {isReplyingThis && (
                    <div className="mt-3 ml-2 sm:ml-5 p-4 bg-white rounded-2xl border-2 border-[#38B6FF] shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center gap-2 text-xs font-black text-[#08233C]">
                        <CornerDownRight className="w-4 h-4 text-[#38B6FF]" />
                        <span>
                          {currentUserRole === 'admin'
                            ? `Répondre officiellement à ${comm.authorName} au nom de la Mairie :`
                            : `Répondre à ${comm.authorName} :`}
                        </span>
                      </div>

                      <textarea
                        rows={2}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={
                          currentUserRole === 'admin'
                            ? "Rédigez la réponse officielle de la Mairie / IMPACT SAHEL pour apporter une solution ou clarification..."
                            : "Votre réponse à ce citoyen..."
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-[#08233C] focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
                        autoFocus
                      />

                      {replyError && (
                        <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
                          {replyError}
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => { setReplyingToId(null); setReplyMessage(''); }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendReply(comm.id)}
                          disabled={!replyMessage.trim() || isSubmittingReply}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#08233C] text-white text-xs font-extrabold hover:bg-[#0B3B60] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingReply ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FADB58]" />
                          ) : (
                            <Send className="w-3.5 h-3.5 text-[#FADB58]" />
                          )}
                          <span>Envoyer la réponse</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
