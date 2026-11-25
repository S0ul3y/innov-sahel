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
  CheckCircle2,
  Check,
  Clock,
  Award,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Image as ImageIcon,
  Loader2,
  FileText,
  Reply,
  Video
} from 'lucide-react';
import { getMediaUrl, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';
import { InitiativesController } from '../../controllers/initiativesController';
import { Initiative } from '../../models/initiative.model';
import { YoutubeEmbed } from '../shared/YoutubeEmbed';

export const InitiativeDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedInitiative: contextInitiative,
    setSelectedInitiative,
    initiatives,
    communes,
    setSelectedCommuneId,
    setActiveTab,
    comments,
    addComment,
    loadCommentsForInitiative,
    currentUserRole,
    setActiveModal
  } = useApp();

  const [fetchedInitiative, setFetchedInitiative] = useState<Initiative | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Détermination de l'initiative à afficher
  const selectedInitiative: Initiative | null =
    (contextInitiative && (!id || contextInitiative.id === id))
      ? contextInitiative
      : (id ? initiatives.find(i => i.id === id) : null) || fetchedInitiative || null;

  // Récupération de secours depuis l'API si l'initiative n'est pas encore chargée dans le contexte
  useEffect(() => {
    if (!id) return;
    const existsInList = initiatives.find(i => i.id === id);
    if (!existsInList && !contextInitiative) {
      let isMounted = true;
      setIsLoading(true);
      InitiativesController.getById(id)
        .then((data) => {
          if (isMounted && data) {
            setFetchedInitiative(data);
            setSelectedInitiative(data);
          }
        })
        .catch((err) => {
          console.warn('Impossible de charger l\'initiative par ID:', err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [id, initiatives, contextInitiative, setSelectedInitiative]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedInitiative?.id]);

  // Charger les commentaires depuis la DB à l'ouverture de l'initiative
  useEffect(() => {
    const initId = selectedInitiative?.id || id;
    if (initId) {
      loadCommentsForInitiative(initId);
    }
  }, [selectedInitiative?.id, id, loadCommentsForInitiative]);

  const handleBack = () => {
    setSelectedInitiative(null);
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/initiatives');
    }
  };

  if (isLoading && !selectedInitiative) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-24 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs my-8 space-y-4">
        <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Chargement de l'initiative...</h2>
        <p className="text-xs text-slate-500">Veuillez patienter pendant la récupération des détails.</p>
      </div>
    );
  }

  if (!selectedInitiative) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs my-8 space-y-4">
        <Sparkles className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-extrabold text-slate-800">Initiative introuvable</h2>
        <p className="text-xs text-slate-500">L'initiative demandée n'existe pas ou a été déplacée.</p>
        <button
          onClick={() => navigate('/initiatives')}
          className="px-5 py-2.5 bg-[#08233C] text-white text-xs font-bold rounded-xl hover:bg-[#0B3B60] transition-colors cursor-pointer"
        >
          Retourner aux initiatives
        </button>
      </div>
    );
  }

  const commune = communes.find(c => c.id === selectedInitiative.communeId);
  const initiativeComments = Array.isArray(comments)
    ? comments.filter(c => c && c.initiativeId === selectedInitiative.id)
    : [];

  // Normalisation des photos de la galerie (objets { url, caption } ou strings)
  const rawGallery = selectedInitiative.gallery || (selectedInitiative as any).galleryImages || [];
  const galleryItems: Array<{ url: string; caption?: string }> = Array.isArray(rawGallery)
    ? (rawGallery
        .map((item: any) => {
          if (!item) return null;
          if (typeof item === 'string') return { url: getMediaUrl(item), caption: '' };
          if (typeof item === 'object' && item.url) return { url: getMediaUrl(item.url), caption: item.caption || '' };
          return null;
        })
        .filter(Boolean) as Array<{ url: string; caption?: string }>)
    : [];

  // Sécurisation des objectifs et résultats optionnels
  const rawObjectives = (selectedInitiative as any).objectives;
  const objectivesList: string[] = Array.isArray(rawObjectives) ? rawObjectives.filter(Boolean) : [];

  const rawResults = (selectedInitiative as any).results;
  const resultsList: string[] = Array.isArray(rawResults) ? rawResults.filter(Boolean) : [];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentMessage.trim()) return;
    setCommentError('');

    try {
      await addComment({
        initiativeId: selectedInitiative.id,
        authorName: commentName.trim() || 'Citoyen supporter',
        authorRole: currentUserRole === 'admin' ? 'admin' : currentUserRole === 'porteur' ? 'porteur' : 'citoyen',
        message: commentMessage.trim()
      });

      setCommentMessage('');
      setCommentName('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err: any) {
      setCommentError(err?.message || 'Erreur lors de l\'envoi. Vérifiez votre connexion.');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Découvrez cette initiative citoyenne sur InnovSahel : « ${selectedInitiative.title} »`);
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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-back-to-initiatives"
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

      {/* Main Initiative Card */}
      <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Full-width Cover banner */}
        <div className="relative h-64 sm:h-96 md:h-[420px] w-full bg-slate-900">
          <img
            src={getMediaUrl(selectedInitiative.coverImage, DEFAULT_PUBLICATION_COVERS.initiative_update)}
            alt={selectedInitiative.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PUBLICATION_COVERS.initiative_update;
            }}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08233C] via-[#08233C]/40 to-transparent" />

          {/* Badges and Title on Banner */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#FADB58] text-[#08233C] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {selectedInitiative.domain}
              </span>

              {commune && (
                <button
                  onClick={() => {
                    setSelectedCommuneId(selectedInitiative.communeId);
                    setSelectedInitiative(null);
                    setActiveTab('ma_commune');
                  }}
                  className="bg-white/20 hover:bg-white/35 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FADB58]" />
                  <span>{commune.name}</span>
                </button>
              )}

              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md ${
                selectedInitiative.status === 'termine'
                  ? 'bg-emerald-500 text-white'
                  : selectedInitiative.status === 'en_cours'
                    ? 'bg-amber-400 text-[#08233C]'
                    : 'bg-blue-400 text-[#08233C]'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {selectedInitiative.status === 'termine' ? 'Projet Finalisé' : selectedInitiative.status === 'en_cours' ? 'Projet en plein déploiement' : 'Projet Démarré'}
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight drop-shadow-md">
              {selectedInitiative.title}
            </h1>
          </div>
        </div>

        {/* Initiative Content & Details */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Owner Profile Card */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {selectedInitiative.ownerAvatar ? (
                <img
                  src={selectedInitiative.ownerAvatar}
                  alt={selectedInitiative.ownerName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#38B6FF] shadow-xs flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#08233C] text-[#FADB58] flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {selectedInitiative.ownerName ? selectedInitiative.ownerName.charAt(0) : 'P'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-slate-900 text-lg">
                    {selectedInitiative.ownerName}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#38B6FF]/20 text-[#0B3B60] px-2.5 py-0.5 rounded-md">
                    {selectedInitiative.ownerType === 'femme' ? 'Porteuse d’initiative' : selectedInitiative.ownerType === 'jeune' ? 'Jeune porteur' : 'Collectif citoyen'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">
                  {selectedInitiative.ownerBio}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Lancé en {selectedInitiative.startDate}
                  </span>
                  <span>•</span>
                  <span>{selectedInitiative.viewsCount || 0} consultations citoyennes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Problem & Solution Grid (Structure officielle §6.3.2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problème identifié */}
            <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200/80 space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Problème identifié dans le quartier
              </span>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                {selectedInitiative.problem || "Aucune description du problème fournie."}
              </p>
            </div>

            {/* Solution citoyenne */}
            <div className="bg-sky-50/70 rounded-2xl p-6 border border-sky-200/80 space-y-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#38B6FF]" />
                Solution apportée par le porteur
              </span>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                {selectedInitiative.solution || "Aucune description de la solution fournie."}
              </p>
            </div>
          </div>

          {/* Bénéficiaires directs du projet */}
          {selectedInitiative.beneficiaries && (
            <div className="bg-[#EFF8FF] rounded-2xl p-5 border border-[#38B6FF]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#08233C] text-[#FADB58] flex items-center justify-center flex-shrink-0 font-bold">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0B3B60] block uppercase tracking-wider">
                  Bénéficiaires directs du projet :
                </span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {selectedInitiative.beneficiaries}
                </p>
              </div>
            </div>
          )}

          {/* Objectifs & Résultats (si fournis) */}
          {(objectivesList.length > 0 || resultsList.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {objectivesList.length > 0 && (
                <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 space-y-3">
                  <h3 className="font-extrabold text-[#0B3B60] text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Objectifs clés du projet
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {objectivesList.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resultsList.length > 0 && (
                <div className="bg-[#EFF8FF] rounded-2xl p-5 border border-[#38B6FF]/30 space-y-3">
                  <h3 className="font-extrabold text-[#0B3B60] text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#38B6FF]" />
                    Impact & résultats concrets obtenus
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {resultsList.map((res, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#38B6FF] mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Photo Gallery */}
          {galleryItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-[#08233C] text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#38B6FF]" />
                Galerie photos du terrain ({galleryItems.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(item.url)}
                    className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 cursor-pointer group shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={item.url}
                      alt={item.caption || `Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1 rounded-full">
                        Agrandir
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description détaillée du projet */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-[#08233C] text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#38B6FF]" />
              Description détaillée du projet
            </h3>
            {selectedInitiative.description ? (
              <div
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedInitiative.description }}
              />
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-300 text-slate-600 text-sm leading-relaxed">
                {selectedInitiative.solution || selectedInitiative.problem || "Aucune description détaillée n'a encore été renseignée pour cette initiative."}
              </div>
            )}
          </div>

          {/* Vidéo de présentation si renseignée */}
          {selectedInitiative.videoUrl && (
            <div className="space-y-3 pt-2">
              <h3 className="font-extrabold text-[#08233C] text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-[#38B6FF]" />
                Vidéo de présentation du projet
              </h3>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-w-2xl bg-slate-900">
                <YoutubeEmbed youtubeUrl={selectedInitiative.videoUrl} title={selectedInitiative.title} />
              </div>
            </div>
          )}

          {/* Return & Share Bottom Footer */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#08233C] text-white font-extrabold text-xs sm:text-sm hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Revenir à la liste des initiatives</span>
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

      {/* Citizen Feedback & Comments Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#38B6FF]/15 text-[#0B3B60] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#08233C]">
                Soutiens & commentaires citoyens ({initiativeComments.length})
              </h2>
              <p className="text-xs text-slate-500">
                Encouragez l'équipe porteuse de cette initiative locale
              </p>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="init-comment-author" className="block text-xs font-bold text-slate-600 mb-1">
                Votre nom ou collectif :
              </label>
              <input
                id="init-comment-author"
                type="text"
                placeholder="Ex: Ibrahima D., Association des Jeunes"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#08233C] focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Votre profil :
              </label>
              <div className="px-3 py-2 bg-slate-200/70 border border-slate-300 rounded-xl text-xs font-bold text-slate-700">
                {currentUserRole === 'admin' ? '🛡️ Administrateur IMPACT SAHEL' : currentUserRole === 'porteur' ? '👩🏾 Porteur d’initiative' : '👤 Citoyen supporter'}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="init-comment-text" className="block text-xs font-bold text-slate-600 mb-1">
              Votre message d'encouragement ou proposition de partenariat :
            </label>
            <textarea
              id="init-comment-text"
              rows={3}
              placeholder="Félicitations pour cette initiative ! Comment pouvons-nous participer ou vous soutenir ?"
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-medium text-[#08233C] focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Votre message sera transmis au porteur du projet.
            </span>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08233C] text-white font-extrabold text-xs hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#FADB58]" />
              <span>Envoyer le mot de soutien</span>
            </button>
          </div>

          {commentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Merci pour votre soutien chaleureux ! Il a été publié avec succès.</span>
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
        <div className="space-y-3">
          {initiativeComments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucun mot de soutien pour l'instant. Soyez le premier à encourager cette initiative !
            </div>
          ) : (
            initiativeComments.map((comm) => (
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
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {comm.message}
                </p>

                {/* Réponse du porteur d'initiative / administration */}
                {comm.replyText && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#EFF8FF] border border-[#38B6FF]/40 text-xs sm:text-sm shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5 font-bold text-[#0B3B60]">
                      <div className="flex items-center gap-1.5">
                        <Reply className="w-4 h-4 text-[#38B6FF] rotate-180 flex-shrink-0" />
                        <span>Réponse du porteur ({comm.replyAuthorName || selectedInitiative.ownerName}) :</span>
                      </div>
                      {comm.replyDate && (
                        <span className="text-[10px] text-slate-400 font-normal">{comm.replyDate}</span>
                      )}
                    </div>
                    <p className="text-slate-800 leading-relaxed pl-5 font-normal">
                      {comm.replyText}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal Agrandissement Photo */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={activePhoto}
              alt="Agrandissement"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 text-xs font-bold cursor-pointer"
            >
              Fermer ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
