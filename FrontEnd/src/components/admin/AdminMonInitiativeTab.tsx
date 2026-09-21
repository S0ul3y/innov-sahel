import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { InitiativesController } from '../../controllers/initiativesController';
import { CommentsController } from '../../controllers/commentsController';
import { Initiative, CreateInitiativeDto, UpdateInitiativeDto } from '../../models/initiative.model';
import { Comment } from '../../models/comment.model';
import { ImageUpload } from '../shared/ImageUpload';
import { YoutubeEmbed } from '../shared/YoutubeEmbed';
import {
  Sparkles,
  Plus,
  Edit3,
  MessageSquare,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader,
  Send,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Lightbulb,
  Video,
} from 'lucide-react';

export const AdminMonInitiativeTab: React.FC = () => {
  const { activeUser, communes } = useApp();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Selected initiative for comment management & details
  const [activeInitiativeId, setActiveInitiativeId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  // Modal / Form state for Create / Edit
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [formData, setFormData] = useState<CreateInitiativeDto>({
    title: '',
    ownerName: activeUser?.name || '',
    ownerType: 'jeune',
    ownerBio: '',
    communeId: activeUser?.communeId || (communes[0]?.id || 'c1'),
    domain: 'Agroécologie & Maraîchage',
    problem: '',
    solution: '',
    beneficiaries: '',
    status: 'en_cours',
    coverImage: '',
    videoUrl: '',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load initiatives for this porteur
  const loadPorteurInitiatives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await InitiativesController.getAllAdmin();
      setInitiatives(data || []);
      if (data && data.length > 0 && !activeInitiativeId) {
        setActiveInitiativeId(data[0].id);
      }
    } catch (err: any) {
      console.error('Erreur chargement initiatives porteur:', err);
      setError(err?.message || 'Impossible de charger vos initiatives.');
    } finally {
      setLoading(false);
    }
  }, [activeInitiativeId]);

  useEffect(() => {
    loadPorteurInitiatives();
  }, [loadPorteurInitiatives]);

  // Load comments for active initiative
  const loadComments = useCallback(async (initiativeId: string) => {
    try {
      setLoadingComments(true);
      const list = await CommentsController.getByInitiative(initiativeId);
      setCommentsMap(prev => ({ ...prev, [initiativeId]: list || [] }));
    } catch (e) {
      console.error('Erreur chargement commentaires:', e);
    } finally {
      setLoadingComments(false);
    }
  }, []);

  useEffect(() => {
    if (activeInitiativeId) {
      loadComments(activeInitiativeId);
    }
  }, [activeInitiativeId, loadComments]);

  const openCreateModal = () => {
    setEditingInitiative(null);
    setFormData({
      title: '',
      ownerName: activeUser?.name || '',
      ownerType: 'jeune',
      ownerBio: '',
      communeId: activeUser?.communeId || (communes[0]?.id || 'c1'),
      domain: 'Agroécologie & Maraîchage',
      problem: '',
      solution: '',
      beneficiaries: '',
      status: 'en_cours',
      coverImage: '',
      videoUrl: '',
    });
    setIsEditing(true);
  };

  const openEditModal = (init: Initiative) => {
    setEditingInitiative(init);
    setFormData({
      title: init.title,
      ownerName: init.ownerName,
      ownerType: init.ownerType || 'jeune',
      ownerBio: init.ownerBio || '',
      communeId: init.communeId,
      domain: init.domain,
      problem: init.problem,
      solution: init.solution,
      beneficiaries: init.beneficiaries || '',
      status: init.status,
      coverImage: init.coverImage || '',
      videoUrl: init.videoUrl || '',
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.solution || !formData.problem) {
      setError('Veuillez remplir les champs obligatoires (Titre, Problème, Solution).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingInitiative) {
        await InitiativesController.update(editingInitiative.id, formData as UpdateInitiativeDto);
        setSuccessMsg('Initiative mise à jour avec succès !');
      } else {
        await InitiativesController.create(formData);
        setSuccessMsg('Nouvelle initiative créée avec succès !');
      }

      setIsEditing(false);
      await loadPorteurInitiatives();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Erreur sauvegarde initiative:', err);
      setError(err?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (commentId: string) => {
    const text = replyTextMap[commentId]?.trim();
    if (!text) return;

    try {
      setSubmittingReplyId(commentId);
      await CommentsController.reply(commentId, text);
      setReplyTextMap(prev => ({ ...prev, [commentId]: '' }));
      if (activeInitiativeId) {
        await loadComments(activeInitiativeId);
      }
      setSuccessMsg('Votre réponse a été publiée avec succès !');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Erreur réponse commentaire:', err);
      setError(err?.message || 'Impossible d’envoyer la réponse.');
    } finally {
      setSubmittingReplyId(null);
    }
  };

  const activeComments = activeInitiativeId ? commentsMap[activeInitiativeId] || [] : [];
  const activeInit = initiatives.find(i => i.id === activeInitiativeId);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-gradient-to-r from-[#062326] via-[#0B3B3F] to-[#062326] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#0E3A3E] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            ESPACE PORTEUR DE PROJET
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Mon Initiative & Dialogue Citoyen
          </h1>
          <p className="text-teal-200/80 text-sm sm:text-base mt-2 max-w-2xl">
            Gérez directement la fiche de votre projet, enrichissez-la d'images réelles et d'une vidéo YouTube, et échangez en toute proximité avec les citoyens qui commentent vos actions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#062326] font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          Ajouter une initiative
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <Loader className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium">Chargement de votre initiative...</p>
        </div>
      ) : initiatives.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Aucune initiative enregistrée</h3>
          <p className="text-slate-500 text-sm mb-6">
            Vous n'avez pas encore créé votre fiche d'initiative. Créez-la dès maintenant pour la rendre visible aux citoyens et à la mairie.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer mon initiative
          </button>
        </div>
      ) : (
        /* Initiative cards and details */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List of Porteur Initiatives */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Mes initiatives ({initiatives.length})
            </h3>

            <div className="space-y-3">
              {initiatives.map(init => {
                const isSelected = init.id === activeInitiativeId;
                const commune = communes.find(c => c.id === init.communeId);
                return (
                  <div
                    key={init.id}
                    onClick={() => setActiveInitiativeId(init.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {init.domain}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          init.status === 'termine'
                            ? 'bg-emerald-100 text-emerald-800'
                            : init.status === 'en_cours'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {init.status === 'termine' ? 'Terminé' : init.status === 'en_cours' ? 'En cours' : 'Démarré'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 mt-2 line-clamp-2 text-sm sm:text-base">
                      {init.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {commune?.name || 'Commune'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {init.viewsCount || 0} vues
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Initiative details & comments */}
          {activeInit && (
            <div className="lg:col-span-2 space-y-6">
              {/* Initiative Card Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{activeInit.title}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Porteur : <span className="font-semibold text-slate-700">{activeInit.ownerName}</span> ({activeInit.ownerType})
                    </p>
                  </div>
                  <button
                    onClick={() => openEditModal(activeInit)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modifier la fiche
                  </button>
                </div>

                {/* Media preview */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeInit.coverImage ? (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Image de couverture</p>
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={activeInit.coverImage}
                          alt={activeInit.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs">
                      Aucune image de couverture
                    </div>
                  )}

                  {activeInit.videoUrl ? (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Vidéo de présentation</p>
                      <YoutubeEmbed youtubeUrl={activeInit.videoUrl} title={activeInit.title} />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs">
                      Aucune vidéo YouTube associée
                    </div>
                  )}
                </div>

                {/* Problem & Solution */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                    <h5 className="font-bold text-amber-900 text-xs uppercase mb-1">Problème résolu</h5>
                    <p className="text-slate-700 text-xs leading-relaxed">{activeInit.problem}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <h5 className="font-bold text-emerald-900 text-xs uppercase mb-1">Solution mise en œuvre</h5>
                    <p className="text-slate-700 text-xs leading-relaxed">{activeInit.solution}</p>
                  </div>
                </div>
              </div>

              {/* Citizen Comments & Questions Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-600" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Questions & Commentaires des Citoyens
                    </h3>
                    <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                      {activeComments.length}
                    </span>
                  </div>
                </div>

                {loadingComments ? (
                  <div className="py-8 flex justify-center text-slate-400">
                    <Loader className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
                ) : activeComments.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-6">
                    Aucun commentaire citoyen pour l'instant sur cette initiative.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activeComments.map(comment => (
                      <div key={comment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-800 text-xs sm:text-sm">
                            {comment.authorName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('fr-FR') : comment.date}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
                          {comment.message}
                        </p>

                        {/* Existing Reply if any */}
                        {comment.replyText ? (
                          <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 mt-2">
                            <p className="text-[11px] font-bold text-emerald-900 mb-0.5">
                              Votre réponse :
                            </p>
                            <p className="text-xs text-slate-800 leading-relaxed">
                              {comment.replyText}
                            </p>
                          </div>
                        ) : (
                          /* Inline Reply form */
                          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              placeholder="Répondre publiquement à ce citoyen..."
                              value={replyTextMap[comment.id] || ''}
                              onChange={e => setReplyTextMap({ ...replyTextMap, [comment.id]: e.target.value })}
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                              onClick={() => handleSendReply(comment.id)}
                              disabled={submittingReplyId === comment.id || !replyTextMap[comment.id]?.trim()}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex-shrink-0"
                            >
                              {submittingReplyId === comment.id ? (
                                <Loader className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              Répondre
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Edit / Create Initiative */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {editingInitiative ? 'Modifier mon initiative' : 'Créer une nouvelle initiative'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Titre de l'initiative *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex : Récupération des eaux et maraîchage féminin"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Commune *
                  </label>
                  <select
                    value={formData.communeId}
                    onChange={e => setFormData({ ...formData, communeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    {communes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Statut du projet
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="demarre">Démarré (Lancement)</option>
                    <option value="en_cours">En cours (Opérationnel)</option>
                    <option value="termine">Terminé (Pérennisé)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Domaine d'impact
                  </label>
                  <select
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                  >
                    <option value="Agroécologie & Maraîchage">Agroécologie & Maraîchage</option>
                    <option value="Énergie solaire & Électrification">Énergie solaire & Électrification</option>
                    <option value="Gestion des déchets & Recyclage">Gestion des déchets & Recyclage</option>
                    <option value="Artisanat & Transformation locale">Artisanat & Transformation locale</option>
                    <option value="Accès à l'eau potable">Accès à l'eau potable</option>
                    <option value="Autre">Autre innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Bénéficiaires ciblés
                  </label>
                  <input
                    type="text"
                    value={formData.beneficiaries}
                    onChange={e => setFormData({ ...formData, beneficiaries: e.target.value })}
                    placeholder="Ex: 120 femmes maraîchères"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Problème identifié dans la commune *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.problem}
                  onChange={e => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="Expliquez la difficulté locale à laquelle votre projet répond..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Solution et méthode appliquée *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.solution}
                  onChange={e => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="Décrivez précisément votre solution technique ou organisationnelle..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              {/* Upload image couverture */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo de couverture
                </label>
                <ImageUpload
                  value={formData.coverImage}
                  onChange={url => setFormData({ ...formData, coverImage: url })}
                  aspectRatio="16/9"
                />
              </div>

              {/* Vidéo YouTube */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lien vidéo YouTube (facultatif)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                {formData.videoUrl && (
                  <div className="mt-2">
                    <YoutubeEmbed youtubeUrl={formData.videoUrl} title="Aperçu vidéo" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  {editingInitiative ? 'Enregistrer les modifications' : 'Créer l’initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
