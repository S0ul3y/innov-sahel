import React, { useState } from 'react';
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
  Share2,
  Calendar,
  Layers,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { ImageUpload } from '../shared/ImageUpload';
import { YoutubeEmbed } from '../shared/YoutubeEmbed';
import { getPublicationCover, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';

export const AdminPublicationsTab: React.FC = () => {
  const { 
    publications, 
    communes, 
    comments, 
    addPublication, 
    updatePublication, 
    deletePublication, 
    deleteComment,
    activeUser 
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

  // Create form state
  const [newType, setNewType] = useState<PublicationType>('commune_news');
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCommuneId, setNewCommuneId] = useState(communes[0]?.id || 'c1');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Edit form state
  const [editType, setEditType] = useState<PublicationType>('commune_news');
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCommuneId, setEditCommuneId] = useState('c1');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

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
      await addPublication({
        title: newTitle.trim(),
        metaDescription: newSummary.trim(),
        content: newContent.trim() || newSummary.trim(),
        communeId: newCommuneId,
        authorName: newType === 'commune_news' ? `Mairie de la ${communeObj?.name || 'Commune'}` : activeUser.name,
        authorRole: 'admin',
        type: newType,
        format: newVideoUrl.trim() ? 'video' : 'carousel',
        status: 'published',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        coverImage: finalCover,
        youtubeUrl: newVideoUrl.trim() || undefined,
        youtubeId: extractedYtId,
        carouselImages: newImageUrl.trim() ? [{ url: newImageUrl.trim(), caption: newTitle.trim() }] : undefined
      });

      setSuccessBanner(`La publication "${newTitle}" a été créée et mise en ligne.`);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewSummary('');
      setNewContent('');
      setNewVideoUrl('');
      setNewImageUrl('');
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
  };

  const [editError, setEditError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPublication) return;
    setEditError('');
    setIsEditing(true);

    try {
      await updatePublication(editingPublication.id, {
        title: editTitle.trim(),
        metaDescription: editSummary.trim(),
        content: editContent.trim(),
        communeId: editCommuneId,
        type: editType,
        format: editVideoUrl.trim() ? 'video' : 'carousel',
        coverImage: editImageUrl.trim() || editingPublication.coverImage,
        youtubeUrl: editVideoUrl.trim() || undefined,
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

  const getTypeLabel = (type: PublicationType) => {
    switch(type) {
      case 'commune_news':
        return { label: 'Au nom de la Mairie', icon: Building2, color: 'bg-emerald-100 text-emerald-800' };
      case 'activity':
        return { label: 'Activité', icon: Activity, color: 'bg-purple-100 text-purple-800' };
      case 'initiative_update':
        return { label: 'Initiative', icon: Sparkles, color: 'bg-amber-100 text-amber-800' };
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
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900">
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
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#062326] font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Nouvelle Publication</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
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
                ? 'bg-[#062326] text-emerald-300 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({publications.length})
          </button>

          <button
            onClick={() => setTypeFilter('commune_news')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              typeFilter === 'commune_news'
                ? 'bg-emerald-600 text-white shadow-sm'
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
                ? 'bg-amber-500 text-white shadow-sm'
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-auto"
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
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
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
                        ? 'bg-amber-400 hover:bg-amber-500 text-[#062326] shadow-sm animate-pulse'
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
                      className="p-2 text-slate-600 hover:text-[#062326] hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
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

      {/* Modal 1: Create Publication */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-[#062326] flex items-center justify-center font-bold">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Nouvelle Publication
                  </h3>
                  <span className="text-xs text-slate-500">
                    Diffusion officielle sur le portail InnovSahel
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Type de publication */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Type de publication <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('commune_news')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newType === 'commune_news'
                        ? 'bg-[#062326] text-emerald-300 border-[#062326] shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    🏛️ Au nom de la Mairie
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewType('activity')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newType === 'activity'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    ⚡ Activité
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewType('initiative_update')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      newType === 'initiative_update'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚀 Initiative
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Commune concernée <span className="text-red-500">*</span>
                </label>
                <select
                  value={newCommuneId}
                  onChange={(e) => setNewCommuneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {communes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Titre de la publication <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lancement des travaux de curage et salubrité citoyenne..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Résumé / Accroche (Chapeau) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Bref résumé en 2-3 phrases affiché dans les cartes..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Contenu détaillé
                </label>
                <textarea
                  rows={4}
                  placeholder="Corps complet du communiqué, détails des activités, dates clés..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Image de couverture
                  </label>
                  <ImageUpload
                    value={newImageUrl}
                    onChange={(url) => setNewImageUrl(url)}
                    aspectRatio="16/9"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Lien Vidéo YouTube (optionnel)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  />
                  {newVideoUrl && (
                    <div className="mt-2">
                      <YoutubeEmbed youtubeUrl={newVideoUrl} title="Aperçu vidéo YouTube" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#062326] font-black transition-all cursor-pointer shadow-md"
                >
                  Publier dès maintenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Publication */}
      {editingPublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Modifier la publication
                  </h3>
                  <span className="text-xs text-slate-500">Mise à jour directe du contenu</span>
                </div>
              </div>
              <button
                onClick={() => setEditingPublication(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Type de publication</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditType('commune_news')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      editType === 'commune_news'
                        ? 'bg-[#062326] text-emerald-300 border-[#062326]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🏛️ Mairie
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('activity')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      editType === 'activity'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ⚡ Activité
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditType('initiative_update')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                      editType === 'initiative_update'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚀 Initiative
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Commune</label>
                <select
                  value={editCommuneId}
                  onChange={(e) => setEditCommuneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {communes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Résumé</label>
                <textarea
                  rows={2}
                  required
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Contenu détaillé</label>
                <textarea
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Image de couverture
                  </label>
                  <ImageUpload
                    value={editImageUrl}
                    onChange={(url) => setEditImageUrl(url)}
                    aspectRatio="16/9"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Lien Vidéo YouTube (optionnel)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={editVideoUrl}
                    onChange={(e) => setEditVideoUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  />
                  {editVideoUrl && (
                    <div className="mt-2">
                      <YoutubeEmbed youtubeUrl={editVideoUrl} title="Aperçu vidéo YouTube" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPublication(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062326] text-emerald-300 font-black hover:bg-[#093539] transition-all cursor-pointer shadow-md"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Moderation des Commentaires Citoyens */}
      {moderationPublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#062326] flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Modération des Commentaires
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
                {moderationPublication.summary}
              </p>
            </div>

            {/* Comments list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">
                  Commentaires déposés par les citoyens ({activePublicationComments.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Supprimez tout contenu injurieux, diffamatoire ou non conforme.
                </span>
              </div>

              {activePublicationComments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  Aucun commentaire citoyen n'a encore été déposé sur cette publication.
                </div>
              ) : (
                activePublicationComments.map(c => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      c.reported 
                        ? 'bg-red-50/70 border-red-200 ring-1 ring-red-300' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.date}</span>
                        {c.reported && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-red-600 text-white uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Signalé par un citoyen</span>
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        "{c.text}"
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        deleteComment(c.id);
                        setSuccessBanner(`Le commentaire de ${c.author} a été supprimé.`);
                        setTimeout(() => setSuccessBanner(null), 3000);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModerationPublication(null)}
                className="px-5 py-2.5 rounded-xl bg-[#062326] text-emerald-300 font-black text-xs hover:bg-[#093539] transition-colors cursor-pointer"
              >
                Fermer la modération
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
