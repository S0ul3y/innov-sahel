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
  Users, 
  Award, 
  Sparkles, 
  HandHeart, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { getMediaUrl, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';

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

  const selectedInitiative = (contextInitiative && (!id || contextInitiative.id === id))
    ? contextInitiative
    : initiatives.find(i => i.id === id) || contextInitiative;

  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [commentName, setCommentName] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedInitiative]);

  // Charger les commentaires depuis la DB à l'ouverture de l'initiative
  useEffect(() => {
    const initId = selectedInitiative?.id || id;
    if (initId) {
      loadCommentsForInitiative(initId);
    }
  }, [selectedInitiative?.id, id, loadCommentsForInitiative]);

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
  const initiativeComments = comments.filter(c => c.initiativeId === selectedInitiative.id);

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
          onClick={() => {
            setSelectedInitiative(null);
            navigate('/initiatives');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#08233C] font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux initiatives</span>
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
                  {selectedInitiative.ownerName.charAt(0)}
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
                  <span>{selectedInitiative.viewsCount} consultations citoyennes</span>
                </div>
              </div>
            </div>

            {/* Quick Action in Card */}
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setActiveModal('idea')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#08233C] text-white font-extrabold text-xs hover:bg-[#0B3B60] transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FADB58]" />
                <span>Soutenir / Rejoindre</span>
              </button>
            </div>
          </div>

          {/* Description & Story */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-[#08233C] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#38B6FF]" />
              Présentation détaillée du projet
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              {selectedInitiative.description}
            </p>
          </div>

          {/* Objectives & Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objectives */}
            <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 space-y-3">
              <h3 className="font-extrabold text-[#0B3B60] text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Objectifs clés du projet
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedInitiative.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Results & Key Metrics */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 space-y-3">
              <h3 className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Impact & résultats concrets obtenus
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedInitiative.results.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Photo Gallery */}
          {selectedInitiative.galleryImages && selectedInitiative.galleryImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-[#08233C] text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#38B6FF]" />
                Galerie photos du terrain ({selectedInitiative.galleryImages.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedInitiative.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(imgUrl)}
                    className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 cursor-pointer group shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
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

          {/* Project Timeline & Milestones */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-[#08233C] text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#38B6FF]" />
              Chronologie & étapes d'avancement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { label: 'Candidature & sélection', date: selectedInitiative.startDate, status: 'done' },
                { label: 'Accompagnement & formation', date: 'Mois +2', status: 'done' },
                { label: 'Déploiement sur le terrain', date: 'En action', status: selectedInitiative.status === 'en_cours' || selectedInitiative.status === 'termine' ? 'done' : 'current' },
                { label: 'Pérennisation & bilan', date: 'Mois +12', status: selectedInitiative.status === 'termine' ? 'done' : 'upcoming' },
              ].map((step, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold ${
                    step.status === 'done'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : step.status === 'current'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Étape {i + 1}</span>
                    {step.status === 'done' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{step.label}</p>
                  <span className="text-[11px] opacity-75">{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Return & Share Bottom Footer */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setSelectedInitiative(null)}
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
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {comm.message}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Lightbox for gallery images if open */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={activePhoto}
              alt="Agrandissement"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 text-xs font-bold"
            >
              Fermer ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
