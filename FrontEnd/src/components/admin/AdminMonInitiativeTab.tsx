import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { InitiativesController } from '../../controllers/initiativesController';
import { CommentsController } from '../../controllers/commentsController';
import { AuthController } from '../../controllers/authController';
import { Initiative, CreateInitiativeDto, UpdateInitiativeDto } from '../../models/initiative.model';
import { Comment } from '../../models/comment.model';
import { ImageUpload } from '../shared/ImageUpload';
import { YoutubeEmbed } from '../shared/YoutubeEmbed';
import { RichTextEditor } from '../shared/RichTextEditor';
import {
  Sparkles,
  Plus,
  Edit3,
  MessageSquare,
  Eye,
  EyeOff,
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
  Pin,
  User,
  KeyRound,
  Lock,
  Shield,
  FileText,
  Newspaper,
  Target,
  Check,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Save,
} from 'lucide-react';

export const AdminMonInitiativeTab: React.FC = () => {
  const { activeUser, communes, setActiveModal } = useApp();
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
    startDate: '',
    communeId: activeUser?.communeId || (communes[0]?.id || 'c1'),
    domain: 'Agroécologie & Maraîchage',
    problem: '',
    solution: '',
    description: '',
    beneficiaries: '',
    status: 'en_cours',
    coverImage: '',
    videoUrl: '',
    isPinned: false,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPw, setShowCurrentPw] = useState<boolean>(false);
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [showConfirmPw, setShowConfirmPw] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      startDate: new Date().toISOString().split('T')[0],
      communeId: activeUser?.communeId || (communes[0]?.id || 'c1'),
      domain: 'Agroécologie & Maraîchage',
      problem: '',
      solution: '',
      description: '',
      beneficiaries: '',
      status: 'en_cours',
      coverImage: '',
      videoUrl: '',
      isPinned: false,
    });
    setIsEditing(true);
  };

  const openEditModal = (init: Initiative) => {
    setEditingInitiative(init);
    setFormData({
      title: init.title,
      ownerName: init.ownerName || activeUser?.name || '',
      ownerType: init.ownerType || 'jeune',
      ownerBio: init.ownerBio || '',
      startDate: init.startDate || '',
      communeId: init.communeId,
      domain: init.domain,
      problem: init.problem,
      solution: init.solution,
      description: init.description || '',
      beneficiaries: init.beneficiaries || '',
      status: init.status,
      coverImage: init.coverImage || '',
      videoUrl: init.videoUrl || '',
      isPinned: init.isPinned || false,
    });
    setIsEditing(true);
  };

  const isPorteur = activeUser?.role === 'porteur';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.solution?.trim() || !formData.problem?.trim() || !formData.ownerName?.trim()) {
      setError('Veuillez remplir les champs obligatoires (Titre, Porteur, Problème, Solution).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingInitiative) {
        await InitiativesController.update(editingInitiative.id, formData as UpdateInitiativeDto);
        setSuccessMsg('Initiative mise à jour avec succès !');
      } else {
        if (isPorteur) {
          setError("En tant que porteur d'initiative, vous ne pouvez pas créer de nouvelle initiative. Seul un administrateur peut vous attribuer une initiative.");
          return;
        }
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

  // Password change submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Veuillez remplir tous les champs du mot de passe.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Le nouveau mot de passe et sa confirmation ne sont pas identiques.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
      return;
    }

    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(newPassword)) {
      setPasswordMsg({ type: 'error', text: 'Le mot de passe doit comporter au moins 1 lettre majuscule et 1 chiffre.' });
      return;
    }

    try {
      setChangingPassword(true);
      await AuthController.changePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Votre mot de passe a été modifié avec succès !' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 5000);
    } catch (err: any) {
      const errText = err?.response?.data?.message || err?.message || 'Erreur lors du changement de mot de passe.';
      setPasswordMsg({
        type: 'error',
        text: errText === 'Mot de passe actuel incorrect.' ? 'L’ancien mot de passe saisi est incorrect.' : errText,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const activeComments = activeInitiativeId ? commentsMap[activeInitiativeId] || [] : [];
  const activeInit = initiatives.find(i => i.id === activeInitiativeId);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#0B3B60]/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38B6FF]/20 text-[#38B6FF] text-xs font-bold mb-3 border border-[#38B6FF]/30">
            <Sparkles className="w-3.5 h-3.5" />
            ESPACE PORTEUR DE PROJET
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Mon Initiative & Dialogue Citoyen
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Renseignez et mettez à jour votre projet (porteur, diagnostic, solution, description avancée, bénéficiaires), publiez vos actualités d'avancement et échangez avec les citoyens.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setActiveModal('publish')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#38B6FF] hover:bg-[#209ee8] text-[#08233C] font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Newspaper className="w-4 h-4" />
            Publier une actualité
          </button>

          {!isPorteur && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FADB58] hover:bg-[#E8C31A] text-[#08233C] font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter une initiative
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#EFF8FF] border border-[#38B6FF]/40 text-[#08233C] text-sm flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#38B6FF] flex-shrink-0" />
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
          <Loader className="w-8 h-8 animate-spin text-[#38B6FF]" />
          <p className="text-sm font-medium">Chargement de votre initiative...</p>
        </div>
      ) : initiatives.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF8FF] text-[#38B6FF] flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {isPorteur ? 'Aucune initiative associée' : 'Aucune initiative enregistrée'}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {isPorteur
              ? "Aucune initiative ne vous a encore été attribuée. Un administrateur doit d'abord créer et associer votre initiative à votre compte porteur."
              : "Vous n'avez pas encore créé votre fiche d'initiative. Créez-la dès maintenant pour la rendre visible aux citoyens et à la mairie."}
          </p>
          {!isPorteur && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#38B6FF] hover:bg-[#0B3B60] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Créer mon initiative
            </button>
          )}
        </div>
      ) : (
        /* Initiative cards and details */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List of Porteur Initiatives */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {isPorteur ? 'Mon initiative' : `Mes initiatives (${initiatives.length})`}
              </h3>
              {!isPorteur && (
                <button
                  onClick={openCreateModal}
                  className="text-xs text-[#38B6FF] hover:text-[#0B3B60] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouveau
                </button>
              )}
            </div>

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
                        ? 'bg-[#EFF8FF] border-[#38B6FF] shadow-sm ring-2 ring-[#38B6FF]/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {init.domain}
                        </span>
                        {init.isPinned && (
                          <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#08233C] text-[#FADB58]">
                            <Pin className="w-2.5 h-2.5 fill-current rotate-45 text-[#FADB58]" />
                            <span>Épinglée</span>
                          </span>
                        )}
                      </div>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-slate-900">{activeInit.title}</h2>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#38B6FF]" />
                        <span className="font-bold text-slate-800">{activeInit.ownerName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold uppercase">
                          {activeInit.ownerType === 'femme' ? 'Porteuse' : activeInit.ownerType === 'jeune' ? 'Jeune' : 'Collectif'}
                        </span>
                      </span>
                      {activeInit.startDate && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Lancé le : {activeInit.startDate}
                        </span>
                      )}
                    </div>
                    {activeInit.ownerBio && (
                      <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-150">
                        "{activeInit.ownerBio}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                    <button
                      onClick={() => openEditModal(activeInit)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-slate-600" />
                      Modifier
                    </button>
                    <button
                      onClick={() => setActiveModal('publish')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#38B6FF]/15 hover:bg-[#38B6FF]/25 text-[#0B3B60] font-bold text-xs transition-colors cursor-pointer border border-[#38B6FF]/30"
                    >
                      <Newspaper className="w-4 h-4 text-[#38B6FF]" />
                      Publier
                    </button>
                  </div>
                </div>

                {/* Media preview */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeInit.coverImage ? (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Image mise en avant</p>
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
                      Aucune image mise en avant
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

                {/* Beneficiaries banner */}
                {activeInit.beneficiaries && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FADB58] text-[#08233C] flex items-center justify-center flex-shrink-0 font-bold">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Bénéficiaires directs du projet :
                      </span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{activeInit.beneficiaries}</p>
                    </div>
                  </div>
                )}

                {/* Problem & Solution */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                    <h5 className="font-bold text-amber-900 text-xs uppercase mb-1">Problème identifié</h5>
                    <p className="text-slate-700 text-xs leading-relaxed">{activeInit.problem}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#EFF8FF] border border-[#38B6FF]/30">
                    <h5 className="font-bold text-[#0B3B60] text-xs uppercase mb-1">Solution apportée</h5>
                    <p className="text-slate-700 text-xs leading-relaxed">{activeInit.solution}</p>
                  </div>
                </div>

                {/* Advanced Description preview if present */}
                {activeInit.description && (
                  <div className="mt-5 p-5 rounded-2xl bg-white border border-slate-200">
                    <h5 className="font-bold text-[#08233C] text-xs uppercase mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#38B6FF]" />
                      Description détaillée du projet
                    </h5>
                    <div
                      className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: activeInit.description }}
                    />
                  </div>
                )}
              </div>

              {/* Citizen Comments & Questions Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#38B6FF]" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Questions & Commentaires des Citoyens
                    </h3>
                    <span className="text-xs bg-[#EFF8FF] text-[#0B3B60] font-bold px-2 py-0.5 rounded-full border border-[#38B6FF]/30">
                      {activeComments.length}
                    </span>
                  </div>
                </div>

                {loadingComments ? (
                  <div className="py-8 flex justify-center text-slate-400">
                    <Loader className="w-6 h-6 animate-spin text-[#38B6FF]" />
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
                          <div className="p-3 rounded-lg bg-[#EFF8FF] border border-[#38B6FF]/40 mt-2">
                            <p className="text-[11px] font-bold text-[#0B3B60] mb-0.5">
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
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50"
                            />
                            <button
                              onClick={() => handleSendReply(comment.id)}
                              disabled={submittingReplyId === comment.id || !replyTextMap[comment.id]?.trim()}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#38B6FF] hover:bg-[#0B3B60] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex-shrink-0"
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

      {/* Security & Password Change Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-[#EFF8FF] text-[#0B3B60] flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#38B6FF]" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Sécurité du compte & Changement de mot de passe
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez votre mot de passe d'accès à l'espace porteur en renseignant l'ancien et le nouveau mot de passe.
            </p>
          </div>
        </div>

        {passwordMsg && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Ancien mot de passe *
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 car., 1 maj., 1 chiffre"
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Confirmer le nouveau mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le nouveau mot de passe"
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#08233C] hover:bg-[#0B3B60] text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {changingPassword ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 text-[#FADB58]" />
              )}
              Valider le changement de mot de passe
            </button>
          </div>
        </form>
      </div>

      {/* Modal Edit / Create Initiative — Grande taille et design moderne & coloré */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] p-5 sm:p-7 text-white flex-shrink-0 flex items-center justify-between border-b border-[#0B3B60]">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38B6FF]/20 text-[#38B6FF] text-[11px] font-black border border-[#38B6FF]/30 tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#FADB58]" />
                  <span>Espace Porteur • Fiche Initiative</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {editingInitiative ? 'Modifier mon initiative' : 'Créer une initiative'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Renseignez et mettez à jour votre projet : porteur, diagnostic, solution, description détaillée et médias.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex-shrink-0 ml-4"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-slate-50/60">
              {/* 1. Titre & Porteur Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#38B6FF]/15 text-[#0B3B60] flex items-center justify-center font-bold">
                    <User className="w-4 h-4 text-[#38B6FF]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#08233C] uppercase tracking-wide">
                      1. Identité du projet & Porteur
                    </h4>
                    <p className="text-[11px] text-slate-500">Titre officiel, nom du porteur, catégorie et date de lancement</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Titre de l'initiative *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex : Récupération des eaux et maraîchage féminin à Sabalibougou"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 focus:border-[#38B6FF] text-sm sm:text-base font-bold text-slate-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Porteur / Porteuse du projet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Nom complet ou association"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Profil / Catégorie du porteur
                    </label>
                    <select
                      value={formData.ownerType}
                      onChange={e => setFormData({ ...formData, ownerType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm bg-white font-medium"
                    >
                      <option value="jeune">🧑🏾 Jeune porteur d'initiative</option>
                      <option value="femme">👩🏾 Porteuse d'initiative (Femme)</option>
                      <option value="collectif">👥 Collectif citoyen / Association</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Date de lancement
                    </label>
                    <input
                      type="text"
                      value={formData.startDate || ''}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      placeholder="Ex : 15 Janvier 2026"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Biographie / Présentation succincte du porteur
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ownerBio || ''}
                    onChange={e => setFormData({ ...formData, ownerBio: e.target.value })}
                    placeholder="Présentez votre parcours, votre structure ou la motivation citoyenne derrière ce projet..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-xs sm:text-sm bg-white leading-relaxed"
                  />
                </div>
              </div>

              {/* 2. Périmètre, Commune & Bénéficiaires */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-[#FADB58]/20 text-[#08233C] flex items-center justify-center font-bold">
                    <Target className="w-4 h-4 text-[#08233C]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#08233C] uppercase tracking-wide">
                      2. Localisation, Domaine & Bénéficiaires
                    </h4>
                    <p className="text-[11px] text-slate-500">Commune de déploiement, thématique d'impact et bénéficiaires visés</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Commune de rattachement *
                    </label>
                    <select
                      value={formData.communeId}
                      onChange={e => setFormData({ ...formData, communeId: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm bg-white font-medium"
                    >
                      {communes.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Domaine d'impact
                    </label>
                    <select
                      value={formData.domain}
                      onChange={e => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm bg-white font-medium"
                    >
                      <option value="Agroécologie & Maraîchage">🌱 Agroécologie & Maraîchage</option>
                      <option value="Énergie solaire & Électrification">☀️ Énergie solaire & Électrification</option>
                      <option value="Gestion des déchets & Recyclage">♻️ Gestion des déchets & Recyclage</option>
                      <option value="Artisanat & Transformation locale">🧵 Artisanat & Transformation locale</option>
                      <option value="Accès à l'eau potable">💧 Accès à l'eau potable</option>
                      <option value="Autre">✨ Autre innovation territoriale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Statut d'avancement
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-sm bg-white font-medium"
                    >
                      <option value="demarre">🚀 Projet Démarré (Lancement)</option>
                      <option value="en_cours">⚡ En cours (En plein déploiement)</option>
                      <option value="termine">✅ Projet Finalisé (Pérennisé)</option>
                    </select>
                  </div>
                </div>

                {/* Bénéficiaires directs du projet */}
                <div className="p-4 rounded-xl bg-[#EFF8FF] border border-[#38B6FF]/30 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#0B3B60]" />
                    <label className="block text-xs font-bold text-[#0B3B60] uppercase">
                      Bénéficiaires directs du projet
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.beneficiaries || ''}
                    onChange={e => setFormData({ ...formData, beneficiaries: e.target.value })}
                    placeholder="Ex : 120 femmes maraîchères de la coopérative et plus de 450 ménages du quartier"
                    className="w-full px-3.5 py-2.5 border border-[#38B6FF]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF] text-xs sm:text-sm bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    Indiquez le public cible ou le nombre d'habitants directement impactés par votre action.
                  </p>
                </div>
              </div>

              {/* 3. Diagnostic & Solution (2 colonnes colorées) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Problème identifié (Ambre chaud) */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Problème identifié dans le quartier *</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80">
                    Quel est le constat, le dysfonctionnement ou le manque précis constaté sur le terrain ?
                  </p>
                  <textarea
                    rows={3}
                    required
                    value={formData.problem}
                    onChange={e => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Décrivez clairement la difficulté locale à laquelle votre projet répond..."
                    className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs sm:text-sm bg-white leading-relaxed"
                  />
                </div>

                {/* Solution apportée (Bleu ciel Impact) */}
                <div className="p-5 rounded-2xl bg-[#EFF8FF] border border-[#38B6FF]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#0B3B60] font-extrabold text-xs uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-[#38B6FF] flex-shrink-0" />
                    <span>Solution citoyenne apportée par le porteur *</span>
                  </div>
                  <p className="text-[11px] text-[#0B3B60]/80">
                    Quelle est votre solution concrète, technique, écologique ou sociale déployée ?
                  </p>
                  <textarea
                    rows={3}
                    required
                    value={formData.solution}
                    onChange={e => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Décrivez précisément votre solution et comment elle répond au problème..."
                    className="w-full px-3.5 py-2.5 border border-[#38B6FF]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-xs sm:text-sm bg-white leading-relaxed"
                  />
                </div>
              </div>

              {/* 4. Description détaillée du projet (Éditeur riche) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#08233C] uppercase tracking-wide">
                        3. Description détaillée du projet (Éditeur avancé)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Mise en forme riche : titres, listes à puces, paragraphes et liens web
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#38B6FF]/50 focus-within:border-[#38B6FF]">
                  <RichTextEditor
                    value={formData.description || ''}
                    onChange={val => setFormData({ ...formData, description: val })}
                    placeholder="Rédigez ici le détail complet de votre projet, les résultats attendus, le mode de fonctionnement et les prochaines étapes..."
                    minHeight="240px"
                  />
                </div>
              </div>

              {/* 5. Médias & Visuels */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#08233C] uppercase tracking-wide">
                      4. Visuels & Vidéo de présentation
                    </h4>
                    <p className="text-[11px] text-slate-500">Image mise en avant (16/9) hébergée sur le cloud et vidéo YouTube</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Upload Image de couverture */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Image mise en avant (Format 16/9)
                    </label>
                    <ImageUpload
                      value={formData.coverImage}
                      onChange={url => setFormData({ ...formData, coverImage: url })}
                      aspectRatio="16/9"
                    />
                  </div>

                  {/* Vidéo YouTube */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Lien vidéo YouTube (facultatif)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl || ''}
                      onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/50 text-xs sm:text-sm bg-white"
                    />
                    {formData.videoUrl ? (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                        <YoutubeEmbed youtubeUrl={formData.videoUrl} title="Aperçu vidéo du projet" />
                      </div>
                    ) : (
                      <div className="aspect-video rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs">
                        <Video className="w-6 h-6 text-slate-300 mb-1" />
                        <span>Collez un lien YouTube pour prévisualiser la vidéo ici</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Fixed Footer Actions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs sticky bottom-0">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Les modifications seront directement mises à jour sur la plateforme.</span>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#38B6FF] to-[#0B3B60] hover:from-[#209ee8] hover:to-[#08233C] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Check className="w-4 h-4 text-[#FADB58]" />
                    )}
                    <span>{editingInitiative ? 'Enregistrer les modifications' : 'Créer l’initiative'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
