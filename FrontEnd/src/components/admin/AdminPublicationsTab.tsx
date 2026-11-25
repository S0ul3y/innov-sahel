import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Publication, PublicationType, Comment } from '../../types';
import { 
  Newspaper, 
  PlusCircle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Building2, 
  Sparkles, 
  Activity, 
  Eye, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck,
  Share2,
  Calendar,
  Layers,
  Video,
  Image as ImageIcon,
  Send,
  Reply,
  CornerDownRight,
  Loader2
} from 'lucide-react';
import { ImageUpload } from '../shared/ImageUpload';
import { YoutubeEmbed } from '../shared/YoutubeEmbed';
import { RichTextEditor } from '../shared/RichTextEditor';
import { getPublicationCover, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';

export const AdminPublicationsTab: React.FC = () => {
  const { 
    publications, 
    communes, 
    comments, 
    initiatives,
    addPublication, 
    updatePublication, 
    deletePublication, 
    createInitiative,
    updateInitiative,
    togglePinInitiative,
    deleteComment,
    replyComment,
    loadCommentsForPublication,
    addComment,
    activeUser,
    currentUserRole
  } = useApp();

  // Filter states
  const [typeFilter, setTypeFilter] = useState<'all' | PublicationType>('all');
  const [communeFilter, setCommuneFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);
  const [moderationPublication, setModerationPublication] = useState<Publication | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Admin reply states
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [adminReplyMessage, setAdminReplyMessage] = useState('');
  const [isSubmittingAdminReply, setIsSubmittingAdminReply] = useState(false);
  const [adminReplyError, setAdminReplyError] = useState('');
  const [adminReplySuccessId, setAdminReplySuccessId] = useState<string | null>(null);
  // New comment from admin
  const [adminNewComment, setAdminNewComment] = useState('');
  const [isSubmittingAdminComment, setIsSubmittingAdminComment] = useState(false);

  // Create form state
  const [newType, setNewType] = useState<PublicationType>('commune_news');
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCommuneId, setNewCommuneId] = useState(communes[0]?.id || 'c1');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newInitiativeId, setNewInitiativeId] = useState('');

  // Edit form state
  const [editType, setEditType] = useState<PublicationType>('commune_news');
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCommuneId, setEditCommuneId] = useState('c1');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editInitiativeId, setEditInitiativeId] = useState('');

  // Filtered publications
  const filteredPublications = publications.filter(pub => {
    const matchesType = typeFilter === 'all' || pub.type === typeFilter;
    const matchesCommune = communeFilter === 'all' || pub.communeId === communeFilter;
    const matchesSearch = 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.metaDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.authorName || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesCommune && matchesSearch;
  });

  const [createError, setCreateError] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;
    setCreateError('');
    setIsCreating(true);

    const communeObj = communes.find(c => c.id === newCommuneId);
    let finalCover = newImageUrl.trim() || undefined;
    let extractedYtId: string | undefined = undefined;
    if (newVideoUrl.trim()) {
      const match = newVideoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (match && match[1]) {
        extractedYtId = match[1];
        if (!finalCover) {
          finalCover = `https://img.youtube.com/vi/${extractedYtId}/hqdefault.jpg`;
        }
      }
    }

    try {
      // Pour initiative_update : lier à une initiative existante si sélectionnée, sans auto-création
      const resolvedInitiativeId: string | undefined = newInitiativeId || undefined;

      await addPublication({
        title: newTitle.trim(),
        metaDescription: newSummary.trim(),
        content: newContent.trim() || newSummary.trim(),
        communeId: newCommuneId,
        authorName: newType === 'commune_news' ? `Mairie de la ${communeObj?.name || 'Commune'}` : 'Impact Sahel',
        authorRole: 'admin',
        type: newType,
        format: newVideoUrl.trim() ? 'video' : 'carousel',
        status: 'published',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        coverImage: finalCover,
        youtubeUrl: newVideoUrl.trim() || undefined,
        youtubeId: extractedYtId,
        initiativeId: resolvedInitiativeId,
        carouselImages: newImageUrl.trim() ? [{ url: newImageUrl.trim(), caption: newTitle.trim() }] : undefined
      });

      setSuccessBanner(`La publication "${newTitle}" a été créée et mise en ligne${newType === 'initiative_update' ? ' (Visible dans "Initiatives Impact Sahel")' : ''}.`);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewSummary('');
      setNewContent('');
      setNewVideoUrl('');
      setNewImageUrl('');
      setNewInitiativeId('');
      setTimeout(() => setSuccessBanner(null), 3500);
    } catch (err: any) {
      setCreateError(err?.message || 'Erreur lors de la création. Vérifiez votre connexion.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (pub: Publication) => {
    setEditingPublication(pub);
    setEditType(pub.type);
    setEditTitle(pub.title);
    setEditSummary(pub.metaDescription || '');
    setEditContent(pub.content || pub.metaDescription || '');
    setEditCommuneId(pub.communeId);
    setEditImageUrl(pub.coverImage || '');
    setEditVideoUrl(pub.youtubeUrl || '');
    setEditInitiativeId(pub.initiativeId || '');
  };

  const [editError, setEditError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPublication) return;
    setEditError('');
    setIsEditing(true);

    try {
      let resolvedInitiativeId: string | undefined = editInitiativeId || editingPublication.initiativeId;

      if (editType === 'initiative_update') {
        const linkedInit = initiatives.find(i => (resolvedInitiativeId && i.id === resolvedInitiativeId) || i.title.toLowerCase() === editTitle.trim().toLowerCase());
        if (linkedInit) {
          resolvedInitiativeId = linkedInit.id;
        }
      }

      await updatePublication(editingPublication.id, {
        title: editTitle.trim(),
        metaDescription: editSummary.trim(),
        content: editContent.trim(),
        communeId: editCommuneId,
        type: editType,
        format: editVideoUrl.trim() ? 'video' : 'carousel',
        coverImage: editImageUrl.trim() || editingPublication.coverImage,
        youtubeUrl: editVideoUrl.trim() || undefined,
        initiativeId: resolvedInitiativeId,
        carouselImages: editImageUrl.trim() ? [{ url: editImageUrl.trim(), caption: editTitle.trim() }] : editingPublication.carouselImages
      });

      setSuccessBanner(`La publication "${editTitle}" a été modifiée avec succès.`);
      setEditingPublication(null);
      setTimeout(() => setSuccessBanner(null), 3500);
    } catch (err: any) {
      setEditError(err?.message || 'Erreur lors de la modification.');
    } finally {
      setIsEditing(false);
    }
  };

  const confirmDelete = async () => {
    if (!publicationToDelete) return;
    try {
      await deletePublication(publicationToDelete.id);
      setSuccessBanner('La publication a été supprimée.');
      setPublicationToDelete(null);
      setTimeout(() => setSuccessBanner(null), 3500);
    } catch (err: any) {
      setSuccessBanner('');
      console.error('Erreur suppression:', err);
    }
  };

  // Get comments associated with the publication being moderated
  const activePublicationComments = moderationPublication 
    ? comments.filter(c => c.publicationId === moderationPublication.id)
    : [];

  // Charger les commentaires depuis l'API quand on ouvre la modération
  useEffect(() => {
    if (moderationPublication) {
      loadCommentsForPublication(moderationPublication.id);
      // Reset reply states
      setReplyingToCommentId(null);
      setAdminReplyMessage('');
      setAdminReplyError('');
      setAdminReplySuccessId(null);
      setAdminNewComment('');
    }
  }, [moderationPublication?.id]);

  // Réponse officielle admin à un commentaire citoyen
  const handleAdminReply = async (commentId: string) => {
    if (!adminReplyMessage.trim()) return;
    setIsSubmittingAdminReply(true);
    setAdminReplyError('');
    try {
      const adminName = activeUser?.name || 'Équipe municipale IMPACT SAHEL';
      await replyComment(commentId, adminReplyMessage.trim(), adminName);
      setAdminReplyMessage('');
      setReplyingToCommentId(null);
      setAdminReplySuccessId(commentId);
      setSuccessBanner('Votre réponse officielle a été transmise avec succès !');
      setTimeout(() => { setAdminReplySuccessId(null); setSuccessBanner(null); }, 4000);
    } catch (err: any) {
      setAdminReplyError(err?.message || "Impossible d'enregistrer la réponse.");
    } finally {
      setIsSubmittingAdminReply(false);
    }
  };

  // Poster un commentaire général en tant qu'admin
  const handleAdminPostComment = async () => {
    if (!adminNewComment.trim() || !moderationPublication) return;
    setIsSubmittingAdminComment(true);
    try {
      await addComment({
        publicationId: moderationPublication.id,
        authorName: activeUser?.name || 'Équipe municipale',
        authorRole: 'admin',
        message: adminNewComment.trim(),
      });
      setAdminNewComment('');
      setSuccessBanner('Votre commentaire officiel a été publié.');
      setTimeout(() => setSuccessBanner(null), 3500);
    } catch (err: any) {
      setAdminReplyError(err?.message || "Impossible de poster le commentaire.");
    } finally {
      setIsSubmittingAdminComment(false);
    }
  };

  const getTypeLabel = (type: PublicationType) => {
    switch(type) {
      case 'commune_news':
        return { label: 'Au nom de la Mairie', icon: Building2, color: 'bg-[#38B6FF]/15 text-[#0B3B60]' };
      case 'activity':
        return { label: 'Activité', icon: Activity, color: 'bg-purple-100 text-purple-800' };
      case 'initiative_update':
        return { label: 'Initiative', icon: Sparkles, color: 'bg-[#FADB58]/20 text-[#08233C]' };
      default:
        return { label: 'Actualité', icon: Newspaper, color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#38B6FF]/15 text-[#0B3B60]">
              Espace Rédaction & Modération
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {publications.length} Publications actives
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestion des Publications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Création et tri par type (Activité, Initiative, Mairie), édition, suppression et modération des commentaires citoyens.
          </p>
        </div>

        <button
          id="admin-create-publication-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FADB58] hover:bg-[#E8C31A] text-[#08233C] font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Nouvelle Publication</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 bg-[#EFF8FF] border border-[#38B6FF]/40 rounded-2xl text-xs font-bold text-[#08233C] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38B6FF]" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-[#0B3B60] hover:text-[#08233C] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sorting / Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Type selector tabs as explicitly requested */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#08233C] text-[#38B6FF] shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({publications.length})
          </button>

          <button
            onClick={() => setTypeFilter('commune_news')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              typeFilter === 'commune_news'
                ? 'bg-[#38B6FF] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Au nom de la Mairie ({publications.filter(p => p.type === 'commune_news').length})</span>
          </button>

          <button
            onClick={() => setTypeFilter('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              typeFilter === 'activity'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Activités ({publications.filter(p => p.type === 'activity').length})</span>
          </button>

          <button
            onClick={() => setTypeFilter('initiative_update')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              typeFilter === 'initiative_update'
                ? 'bg-[#FADB58] text-[#08233C] shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initiatives ({publications.filter(p => p.type === 'initiative_update').length})</span>
          </button>
        </div>

        {/* Search & Commune selector */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou mots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 w-full sm:w-auto"
            >
              <option value="all">Toutes les communes</option>
              {communes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPublications.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
            <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-600">Aucune publication trouvée dans cette catégorie.</p>
            <button
              onClick={() => { setTypeFilter('all'); setCommuneFilter('all'); setSearchTerm(''); }}
              className="text-xs font-bold text-[#38B6FF] hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredPublications.map(pub => {
            const commune = communes.find(c => c.id === pub.communeId);
            const pubComments = comments.filter(c => c.publicationId === pub.id);
            const reportedComments = pubComments.filter(c => c.reported);
            const typeInfo = getTypeLabel(pub.type);
            const Icon = typeInfo.icon;

            return (
              <div
                key={pub.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Media cover preview */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={getPublicationCover(pub)}
                      alt={pub.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PUBLICATION_COVERS[pub.type || 'default'] || DEFAULT_PUBLICATION_COVERS.default;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${typeInfo.color}`}>
                        <Icon className="w-3 h-3" />
                        <span>{typeInfo.label}</span>
                      </span>
                    </div>

                    {/* Badge Impact Sahel pour les publications d'initiative */}
                    {pub.type === 'initiative_update' && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#08233C]/95 text-[#FADB58] text-[10px] font-black uppercase tracking-wider shadow-md border border-[#FADB58]/50 backdrop-blur-xs">
                        <Sparkles className="w-3 h-3 text-[#FADB58]" />
                        <span>Impact Sahel</span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span>{commune?.name}</span>
                      <span className="text-[11px] opacity-90">{pub.date}</span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-2">
                      {pub.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {pub.metaDescription}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Auteur : <strong className="text-slate-700">{pub.authorName}</strong></span>
                      <span>👁️ {pub.viewsCount || 0} vues</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Bouton Modération des commentaires */}
                  <button
                    onClick={() => setModerationPublication(pub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      reportedComments.length > 0
                        ? 'bg-amber-400 hover:bg-amber-500 text-[#08233C] shadow-sm animate-pulse'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                    title="Inspecter et modérer les commentaires citoyens"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>
                      {pubComments.length} Commentaires
                      {reportedComments.length > 0 ? ` (${reportedComments.length} signalés !)` : ''}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Modifier */}
                    <button
                      onClick={() => handleStartEdit(pub)}
                      className="p-2 text-slate-600 hover:text-[#08233C] hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      title="Modifier la publication"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Supprimer */}
                    <button
                      onClick={() => setPublicationToDelete(pub)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Supprimer la publication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Create Publication (Plein écran Studio) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Header Plein Écran */}
          <div className="bg-[#08233C] text-white px-4 sm:px-8 py-4 border-b border-[#0B3B60] flex items-center justify-between gap-4 flex-shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#38B6FF]/20 border border-[#38B6FF]/40 text-[#38B6FF] flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Nouvelle Publication
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    newType === 'commune_news'
                      ? 'bg-[#38B6FF]/20 text-[#38B6FF] border border-[#38B6FF]/30'
                      : newType === 'activity'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-[#FADB58]/20 text-[#FADB58] border border-[#FADB58]/30'
                  }`}>
                    {newType === 'commune_news' ? '🏛️ Au nom de la Mairie' : newType === 'activity' ? '⚡ Activité' : '🚀 Initiative'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 hidden sm:block">
                  Éditeur complet de diffusion officielle sur le portail InnovSahel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={(e) => handleCreateSubmit(e as any)}
                disabled={isCreating}
                className="px-5 py-2.5 rounded-xl bg-[#FADB58] hover:bg-[#E8C31A] text-[#08233C] font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 disabled:opacity-60"
              >
                {isCreating ? 'Publication en cours...' : 'Publier dès maintenant'}
              </button>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer ml-1"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Corps Scrollable Plein Écran */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {createError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center justify-between">
                  <span>{createError}</span>
                  <button onClick={() => setCreateError('')} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Colonne Principale : Contenu & Rédaction (8 colonnes) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Sélecteur de type avec grandes cartes */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                      1. Type de publication <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewType('commune_news')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          newType === 'commune_news'
                            ? 'bg-[#08233C] text-white border-[#08233C] shadow-md ring-2 ring-[#38B6FF]/40'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className={`w-5 h-5 ${newType === 'commune_news' ? 'text-[#38B6FF]' : 'text-slate-500'}`} />
                          <span className="font-extrabold text-sm">Au nom de la Mairie</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${newType === 'commune_news' ? 'text-slate-300' : 'text-slate-500'}`}>
                          Communiqué officiel, arrêtés municipaux, informations institutionnelles.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewType('activity')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          newType === 'activity'
                            ? 'bg-purple-700 text-white border-purple-700 shadow-md ring-2 ring-purple-400/40'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className={`w-5 h-5 ${newType === 'activity' ? 'text-purple-200' : 'text-slate-500'}`} />
                          <span className="font-extrabold text-sm">Activité</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${newType === 'activity' ? 'text-purple-100' : 'text-slate-500'}`}>
                          Journées citoyennes, chantiers participatifs, événements de salubrité.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNewType('initiative_update')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          newType === 'initiative_update'
                            ? 'bg-[#0B3B60] text-white border-[#0B3B60] shadow-md ring-2 ring-[#FADB58]/50'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className={`w-5 h-5 ${newType === 'initiative_update' ? 'text-[#FADB58]' : 'text-slate-500'}`} />
                          <span className="font-extrabold text-sm">Initiative</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${newType === 'initiative_update' ? 'text-slate-200' : 'text-slate-500'}`}>
                          Avancement d'un projet incubé, innovation verte, succès de terrain.
                        </p>
                      </button>
                    </div>

                    {/* Lorsque l'admin sélectionne "Initiative", information sur la section Impact Sahel */}
                    {newType === 'initiative_update' && (currentUserRole === 'admin' || currentUserRole === 'super_admin') && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#08233C]/5 border border-[#38B6FF]/30 shadow-xs space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-[#08233C] text-[#FADB58]">
                            <Sparkles className="w-4 h-4 text-[#FADB58]" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#08233C] uppercase tracking-wide flex items-center gap-1.5">
                              Section mise en avant : Initiatives Impact Sahel
                            </span>
                            <p className="text-[11px] text-slate-600">
                              Cette initiative apparaîtra en tête de la page Initiatives dans la section exclusive <strong className="text-[#08233C]">« Initiatives Impact Sahel »</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Dropdown d'association d'initiative */}
                        <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
                            <span>Associer à une initiative existante :</span>
                          </label>
                          <select
                            value={newInitiativeId}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewInitiativeId(val);
                              if (val) {
                                const selectedInit = initiatives.find(i => i.id === val);
                                if (selectedInit) {
                                  if (!newTitle) setNewTitle(selectedInit.title);
                                  if (!newCommuneId && selectedInit.communeId) setNewCommuneId(selectedInit.communeId);
                                }
                              }
                            }}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] cursor-pointer"
                          >
                            <option value="">-- Créer une nouvelle initiative Impact Sahel ou lier selon le titre --</option>
                            {initiatives.map(init => (
                              <option key={init.id} value={init.id}>
                                {init.title} ({communes.find(c => c.id === init.communeId)?.name || 'District'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Titre & Résumé */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                        2. Titre de l'article <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Lancement des travaux de curage et salubrité citoyenne..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 focus:bg-white transition-all placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                        3. Résumé / Accroche (Chapeau) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Bref résumé en 2 à 3 phrases percutantes affiché sur les cartes et aperçus..."
                        value={newSummary}
                        onChange={(e) => setNewSummary(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 focus:bg-white transition-all placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Éditeur Tiptap : Contenu détaillé */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span>4. Contenu détaillé de l'article</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EFF8FF] text-[#0B3B60] border border-[#38B6FF]/30">
                          Éditeur Tiptap
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Mise en forme libre : titres, gras, listes, citations, liens
                      </span>
                    </div>

                    <RichTextEditor
                      value={newContent}
                      onChange={setNewContent}
                      placeholder="Rédigez ici le corps complet de votre article : détaillez les faits, les déclarations officielles, les étapes clés..."
                      minHeight="380px"
                    />
                  </div>
                </div>

                {/* Colonne Latérale : Paramètres & Médias (4 colonnes) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Paramètres de diffusion */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#38B6FF]" />
                      Paramètres de publication
                    </h3>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Commune de rattachement <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newCommuneId}
                        onChange={(e) => setNewCommuneId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 cursor-pointer"
                      >
                        {communes.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.district})</option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <span className="font-extrabold text-slate-800 block text-[11px] uppercase tracking-wider">
                        Signature de publication :
                      </span>
                      <p className="font-semibold text-[#0B3B60]">
                        {newType === 'commune_news'
                          ? `Mairie de la ${communes.find(c => c.id === newCommuneId)?.name || 'Commune'}`
                          : activeUser.name}
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        Rôle : Administrateur Platform
                      </span>
                    </div>
                  </div>

                  {/* Image de couverture */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#38B6FF]" />
                      Image de couverture
                    </h3>

                    <ImageUpload
                      value={newImageUrl}
                      onChange={(url) => setNewImageUrl(url)}
                      aspectRatio="16/9"
                    />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Format recommandé : 16:9 paysage. Elle sera affichée en tête de l'article et dans le fil d'actualité.
                    </p>
                  </div>

                  {/* Vidéo YouTube */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-500" />
                      Vidéo YouTube (optionnel)
                    </h3>

                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 font-mono text-xs"
                    />

                    {newVideoUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-200">
                        <YoutubeEmbed youtubeUrl={newVideoUrl} title="Aperçu vidéo YouTube" />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Plein Écran */}
          <div className="bg-white px-4 sm:px-8 py-3.5 border-t border-slate-200 flex items-center justify-between gap-4 flex-shrink-0 shadow-xs">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              InnovSahel • District de Bamako
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={(e) => handleCreateSubmit(e as any)}
                disabled={isCreating}
                className="px-6 py-2.5 rounded-xl bg-[#38B6FF] hover:bg-[#0B3B60] text-white font-black text-xs transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-60"
              >
                {isCreating ? 'Enregistrement...' : 'Publier dès maintenant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Publication (Plein écran Studio) */}
      {editingPublication && (
        <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Header Plein Écran */}
          <div className="bg-[#08233C] text-white px-4 sm:px-8 py-4 border-b border-[#0B3B60] flex items-center justify-between gap-4 flex-shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#38B6FF]/20 border border-[#38B6FF]/40 text-[#38B6FF] flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Modifier la publication
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    editType === 'commune_news'
                      ? 'bg-[#38B6FF]/20 text-[#38B6FF] border border-[#38B6FF]/30'
                      : editType === 'activity'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-[#FADB58]/20 text-[#FADB58] border border-[#FADB58]/30'
                  }`}>
                    {editType === 'commune_news' ? '🏛️ Mairie' : editType === 'activity' ? '⚡ Activité' : '🚀 Initiative'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 hidden sm:block">
                  Mise à jour directe du contenu et de la mise en page
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditingPublication(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={(e) => handleEditSubmit(e as any)}
                disabled={isEditing}
                className="px-5 py-2.5 rounded-xl bg-[#38B6FF] hover:bg-[#0B3B60] text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2 disabled:opacity-60"
              >
                {isEditing ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
              <button
                onClick={() => setEditingPublication(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer ml-1"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Corps Scrollable Plein Écran */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {editError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center justify-between">
                  <span>{editError}</span>
                  <button onClick={() => setEditError('')} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Colonne Principale (8 colonnes) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Type */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                      Type de publication
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditType('commune_news')}
                        className={`p-3.5 rounded-2xl border text-left font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          editType === 'commune_news'
                            ? 'bg-[#08233C] text-[#38B6FF] border-[#08233C] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>🏛️ Au nom de la Mairie</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditType('activity')}
                        className={`p-3.5 rounded-2xl border text-left font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          editType === 'activity'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                        <span>⚡ Activité</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditType('initiative_update')}
                        className={`p-3.5 rounded-2xl border text-left font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          editType === 'initiative_update'
                            ? 'bg-[#FADB58] text-[#08233C] border-[#FADB58] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>🚀 Initiative</span>
                      </button>
                    </div>

                    {/* Lorsque l'admin sélectionne "Initiative", information sur la section Impact Sahel */}
                    {editType === 'initiative_update' && (currentUserRole === 'admin' || currentUserRole === 'super_admin') && (
                      <div className="mt-3 p-4 rounded-2xl bg-[#08233C]/5 border border-[#38B6FF]/30 shadow-xs space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-[#08233C] text-[#FADB58]">
                            <Sparkles className="w-4 h-4 text-[#FADB58]" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#08233C] uppercase tracking-wide flex items-center gap-1.5">
                              Section mise en avant : Initiatives Impact Sahel
                            </span>
                            <p className="text-[11px] text-slate-600">
                              Cette initiative est présentée tout en haut de la page Initiatives dans la section réservée <strong className="text-[#08233C]">« Initiatives Impact Sahel »</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Dropdown d'association d'initiative */}
                        <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
                            <span>Associer à l'initiative :</span>
                          </label>
                          <select
                            value={editInitiativeId}
                            onChange={(e) => setEditInitiativeId(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] cursor-pointer"
                          >
                            <option value="">-- Conserver l'association actuelle ou automatique --</option>
                            {initiatives.map(init => (
                              <option key={init.id} value={init.id}>
                                {init.title} ({communes.find(c => c.id === init.communeId)?.name || 'District'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Titre & Résumé */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                        Titre de l'article <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                        Résumé / Accroche (Chapeau) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Éditeur Tiptap : Contenu détaillé */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span>Contenu détaillé de l'article</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EFF8FF] text-[#0B3B60] border border-[#38B6FF]/30">
                          Éditeur Tiptap
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Formatage de texte riche
                      </span>
                    </div>

                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                      placeholder="Mettez à jour le contenu de votre publication..."
                      minHeight="380px"
                    />
                  </div>
                </div>

                {/* Colonne Latérale (4 colonnes) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Commune */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#38B6FF]" />
                      Commune concernée
                    </h3>
                    <select
                      value={editCommuneId}
                      onChange={(e) => setEditCommuneId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 cursor-pointer"
                    >
                      {communes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image de couverture */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#38B6FF]" />
                      Image de couverture
                    </h3>
                    <ImageUpload
                      value={editImageUrl}
                      onChange={(url) => setEditImageUrl(url)}
                      aspectRatio="16/9"
                    />
                  </div>

                  {/* Vidéo YouTube */}
                  <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-500" />
                      Lien Vidéo YouTube (optionnel)
                    </h3>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={editVideoUrl}
                      onChange={(e) => setEditVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 font-mono text-xs"
                    />
                    {editVideoUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-200">
                        <YoutubeEmbed youtubeUrl={editVideoUrl} title="Aperçu vidéo YouTube" />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer Plein Écran */}
          <div className="bg-white px-4 sm:px-8 py-3.5 border-t border-slate-200 flex items-center justify-between gap-4 flex-shrink-0 shadow-xs">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              InnovSahel • District de Bamako
            </span>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => setEditingPublication(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={(e) => handleEditSubmit(e as any)}
                disabled={isEditing}
                className="px-6 py-2.5 rounded-xl bg-[#08233C] text-[#38B6FF] font-black text-xs hover:bg-[#0B3B60] transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-60"
              >
                {isEditing ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Moderation & Réponses Officielles aux Commentaires */}
      {moderationPublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FADB58] text-[#08233C] flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Commentaires & Réponses Officielles
                  </h3>
                  <span className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md block">
                    {moderationPublication.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModerationPublication(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Publication header recall */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs mb-6 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800">
                  {moderationPublication.title}
                </span>
                <span className="text-[10px] text-slate-500">
                  {moderationPublication.date}
                </span>
              </div>
              <p className="text-slate-600 line-clamp-2">
                {moderationPublication.metaDescription}
              </p>
            </div>

            {/* Formulaire pour poster un commentaire admin général */}
            <div className="mb-6 p-4 bg-[#EFF8FF] rounded-2xl border border-[#38B6FF]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#38B6FF]" />
                <span className="font-black text-[#0B3B60]">Poster un commentaire officiel</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38B6FF]/15 text-[#0B3B60] font-bold">Admin</span>
              </div>
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  placeholder="Rédigez un commentaire officiel visible par tous les citoyens..."
                  value={adminNewComment}
                  onChange={(e) => setAdminNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#38B6FF]/30 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 resize-none"
                />
                <button
                  onClick={handleAdminPostComment}
                  disabled={isSubmittingAdminComment || !adminNewComment.trim()}
                  className="px-4 py-2 rounded-xl bg-[#38B6FF] hover:bg-[#0B3B60] text-white font-black text-xs transition-all cursor-pointer self-end flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingAdminComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Publier</span>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {adminReplyError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center justify-between">
                <span>{adminReplyError}</span>
                <button onClick={() => setAdminReplyError('')} className="text-red-500 hover:text-red-700 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">
                  Tous les commentaires ({activePublicationComments.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Modérez, répondez ou supprimez les commentaires.
                </span>
              </div>

              {activePublicationComments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  Aucun commentaire n'a encore été déposé sur cette publication.
                </div>
              ) : (
                activePublicationComments.map(c => {
                  const isAdmin = c.authorRole === 'admin' || c.authorRole === 'porteur';
                  return (
                    <div
                      key={c.id}
                      className={`rounded-2xl border transition-all text-xs overflow-hidden ${
                        c.reported 
                          ? 'bg-red-50/70 border-red-200 ring-1 ring-red-300'
                          : isAdmin
                          ? 'bg-[#EFF8FF] border-[#38B6FF]/30'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="p-4 space-y-2">
                        {/* Comment header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate-900">{c.authorName}</span>
                            <span className="text-[10px] text-slate-400">{c.date}</span>
                            {isAdmin && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#38B6FF]/15 text-[#0B3B60] uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Réponse officielle</span>
                              </span>
                            )}
                            {c.reported && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-600 text-white uppercase tracking-wider flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>Signalé</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {/* Bouton répondre (seulement pour les commentaires citoyens) */}
                            {!isAdmin && !c.replyText && (
                              <button
                                onClick={() => {
                                  setReplyingToCommentId(replyingToCommentId === c.id ? null : c.id);
                                  setAdminReplyMessage('');
                                  setAdminReplyError('');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#38B6FF]/10 hover:bg-[#38B6FF]/20 text-[#0B3B60] font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                                title="Répondre officiellement à ce citoyen"
                              >
                                <Reply className="w-3 h-3" />
                                <span>Répondre</span>
                              </button>
                            )}
                            {/* Bouton supprimer */}
                            <button
                              onClick={() => {
                                deleteComment(c.id);
                                setSuccessBanner(`Le commentaire de ${c.authorName} a été supprimé.`);
                                setTimeout(() => setSuccessBanner(null), 3000);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>

                        {/* Comment body */}
                        <p className="text-slate-700 leading-relaxed font-medium">
                          "{c.message}"
                        </p>

                        {/* Existing official reply (already saved) */}
                        {c.replyText && (
                          <div className="mt-2 ml-4 p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-3 h-3 text-teal-600" />
                              <ShieldCheck className="w-3 h-3 text-teal-600" />
                              <span className="font-black text-teal-800 text-[10px]">
                                {c.replyAuthorName || 'Équipe municipale'}
                              </span>
                              {c.replyDate && (
                                <span className="text-[9px] text-teal-500">{c.replyDate}</span>
                              )}
                            </div>
                            <p className="text-teal-800 text-xs leading-relaxed font-medium">
                              {c.replyText}
                            </p>
                          </div>
                        )}

                        {/* Reply success indicator */}
                        {adminReplySuccessId === c.id && (
                          <div className="mt-2 ml-4 p-2 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-[10px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Réponse officielle enregistrée avec succès !</span>
                          </div>
                        )}

                        {/* Inline reply form */}
                        {replyingToCommentId === c.id && (
                          <div className="mt-2 ml-4 p-3 bg-[#EFF8FF] border border-[#38B6FF]/30 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-[10px]">
                              <CornerDownRight className="w-3 h-3 text-[#38B6FF]" />
                              <span className="font-black text-[#0B3B60]">
                                Répondre à {c.authorName} en tant que {activeUser?.name || 'Admin'}
                              </span>
                            </div>
                            <textarea
                              rows={2}
                              autoFocus
                              placeholder={`Répondez officiellement au commentaire de ${c.authorName}...`}
                              value={adminReplyMessage}
                              onChange={(e) => setAdminReplyMessage(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#38B6FF]/30 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 resize-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setReplyingToCommentId(null); setAdminReplyMessage(''); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleAdminReply(c.id)}
                                disabled={isSubmittingAdminReply || !adminReplyMessage.trim()}
                                className="px-4 py-1.5 rounded-lg bg-[#38B6FF] hover:bg-[#0B3B60] text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {isSubmittingAdminReply ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3" />
                                )}
                                <span>Envoyer la réponse</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModerationPublication(null)}
                className="px-5 py-2.5 rounded-xl bg-[#08233C] text-[#38B6FF] font-black text-xs hover:bg-[#0B3B60] transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Publication Confirmation */}
      {publicationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Supprimer cette publication ?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer <strong className="text-slate-900">"{publicationToDelete.title}"</strong> ? Elle ne sera plus visible sur la plateforme publique.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setPublicationToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
