import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContributionStatus } from '../../types';
import { 
  User, 
  ShieldCheck, 
  PlusCircle, 
  Eye, 
  MessageSquare, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertTriangle, 
  Lightbulb, 
  Trash2, 
  Lock, 
  TrendingUp, 
  Users, 
  Flag,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  LogOut
} from 'lucide-react';
import { LoginView } from './LoginView';
import { getPublicationCover, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';

export const DashboardView: React.FC = () => {
  const { 
    currentUserRole, 
    setCurrentUserRole, 
    activeUser, 
    logout,
    setActiveModal, 
    publications, 
    initiatives, 
    comments, 
    contributions, 
    updateContributionStatus, 
    deletePublication, 
    deleteComment, 
    users, 
    createUserAccount, 
    toggleUserStatus, 
    communes,
    openPublicationById
  } = useApp();

  // Admin filter states
  const [contribTypeFilter, setContribTypeFilter] = useState<'all' | 'idee' | 'signalement'>('all');
  const [contribStatusFilter, setContribStatusFilter] = useState<string>('all');
  const [contribCommuneFilter, setContribCommuneFilter] = useState<string>('all');
  const [selectedContributionId, setSelectedContributionId] = useState<string | null>(null);
  const [internalNoteText, setInternalNoteText] = useState<string>('');

  // Admin account creation state
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPhone, setNewUserPhone] = useState<string>('');
  const [newUserCommune, setNewUserCommune] = useState<string>('c1');
  const [newUserInitiative, setNewUserInitiative] = useState<string>('');
  const [accountSuccessMsg, setAccountSuccessMsg] = useState<string>('');

  // Porteur's own items
  const myPublications = publications.filter(p => p.authorRole === 'porteur');
  const myInitiative = initiatives.find(i => i.communeId === activeUser.communeId) || initiatives[0];
  const myTotalViews = myPublications.reduce((acc, curr) => acc + curr.viewsCount, 0);
  const myCommentsCount = comments.filter(c => myPublications.some(p => p.id === c.publicationId) || c.initiativeId === myInitiative?.id).length;

  // Filtered contributions for Admin
  const filteredContributions = contributions.filter(c => {
    const matchesType = contribTypeFilter === 'all' || c.type === contribTypeFilter;
    const matchesStatus = contribStatusFilter === 'all' || c.internalStatus === contribStatusFilter;
    const matchesCommune = contribCommuneFilter === 'all' || c.communeId === contribCommuneFilter;
    return matchesType && matchesStatus && matchesCommune;
  });

  const activeContribution = contributions.find(c => c.id === selectedContributionId);

  // CSV Export for Municipalities & Donors (Section 6.6.4 & 12.3)
  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Commune', 'Categorie', 'Description', 'Lieu', 'Citoyen_Nom', 'Citoyen_Tel', 'Statut_Interne', 'Notes_Internes', 'Date'];
    const rows = contributions.map(c => {
      const commune = communes.find(cm => cm.id === c.communeId)?.name || c.communeId;
      return [
        c.id,
        c.type,
        `"${commune}"`,
        `"${c.category}"`,
        `"${c.description.replace(/"/g, '""')}"`,
        `"${(c.locationText || '').replace(/"/g, '""')}"`,
        `"${c.citizenName || ''}"`,
        `"${c.citizenPhone || ''}"`,
        c.internalStatus,
        `"${(c.internalNotes || '').replace(/"/g, '""')}"`,
        c.createdAt
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `InnovSahel_Contributions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreatePorteur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    createUserAccount({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+223 70 00 00 00',
      role: 'porteur',
      communeId: newUserCommune,
      initiativeName: newUserInitiative.trim() || 'Initiative accompagnée Lab Citoyen',
      status: 'actif',
      lastLogin: 'Compte créé (attente première connexion)'
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserInitiative('');
    setAccountSuccessMsg('Compte porteur créé ! Mot de passe provisoire généré : Sahel2025!');
    setTimeout(() => setAccountSuccessMsg(''), 6000);
  };

  // If visitor: Return LoginView directly
  if (currentUserRole === 'visitor') {
    return <LoginView />;
  }

  // ROLE 1: PORTEUR D'INITIATIVE DASHBOARD (Section 6.5)
  if (currentUserRole === 'porteur') {
    return (
      <div className="space-y-8 pb-12">
        {/* Welcome & Role Switcher */}
        <section className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Porteur d'initiative
              </span>
              <span className="text-xs text-slate-300">Lab'Citoyen Bamako</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Bienvenue, {activeUser.name} !
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Projet accompagné : <strong>{activeUser.initiativeName || myInitiative?.title}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveModal('publish')}
              className="flex items-center gap-2 bg-[#FADB58] text-[#08233C] font-extrabold px-5 py-3 rounded-2xl hover:bg-[#ebd048] transition-transform active:scale-95 shadow-md text-xs sm:text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#08233C]" />
              <span>Publier une actualité</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-3 rounded-2xl border border-white/20 transition-all text-xs sm:text-sm cursor-pointer"
              title="Quitter le tableau de bord et revenir au mode citoyen"
            >
              <LogOut className="w-4 h-4 text-slate-300" />
              <span>Déconnexion</span>
            </button>
          </div>
        </section>

        {/* 6.5.1 Trois Indicateurs en Gros Caractères */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Mes Publications
            </span>
            <span className="text-4xl font-black text-[#08233C] block mb-1">
              {myPublications.length}
            </span>
            <span className="text-[11px] text-slate-500">
              Mises en ligne immédiatement
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Nombre total de vues
            </span>
            <span className="text-4xl font-black text-[#38B6FF] block mb-1">
              {myTotalViews.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Lectures citoyennes enregistrées
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Commentaires reçus
            </span>
            <span className="text-4xl font-black text-amber-500 block mb-1">
              {myCommentsCount}
            </span>
            <span className="text-[11px] text-slate-500">
              Interactions & soutiens des habitants
            </span>
          </div>
        </section>

        {/* My Initiative Sheet */}
        {myInitiative && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#38B6FF] tracking-wider block">
                  Ma fiche de projet
                </span>
                <h3 className="text-lg font-extrabold text-[#08233C]">
                  {myInitiative.title}
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-center">
                Statut : {myInitiative.status === 'termine' ? 'Terminé' : 'En cours de réalisation'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="font-bold text-slate-700 block mb-1">Solution mise en œuvre :</span>
                <p className="text-slate-600">{myInitiative.solution}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="font-bold text-slate-700 block mb-1">Bénéficiaires directs :</span>
                <p className="text-slate-600">{myInitiative.beneficiaries}</p>
              </div>
            </div>
          </section>
        )}

        {/* 6.5.3 Liste des Publications du Porteur */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#08233C]">
              Mes actualités d'avancement publiées ({myPublications.length})
            </h3>
            <button
              onClick={() => setActiveModal('publish')}
              className="text-xs font-bold text-[#0B3B60] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nouvelle actualité</span>
            </button>
          </div>

          <div className="space-y-3">
            {myPublications.map((pub) => (
              <div
                key={pub.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getPublicationCover(pub)}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PUBLICATION_COVERS[pub.type || 'default'] || DEFAULT_PUBLICATION_COVERS.default;
                    }}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold">{pub.date}</span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{pub.title}</h4>
                    <span className="text-xs text-slate-500">{pub.viewsCount} vues • Format {pub.format}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openPublicationById(pub.id)}
                    className="p-2 bg-white rounded-xl border border-slate-200 text-slate-700 hover:text-[#38B6FF] transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Voir</span>
                  </button>
                  <button
                    onClick={() => deletePublication(pub.id)}
                    className="p-2 bg-white rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 transition-colors text-xs font-bold cursor-pointer"
                    title="Supprimer cette publication"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ROLE 2: ADMIN IMPACT SAHEL DASHBOARD (Section 6.6)
  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <section className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#38B6FF] text-[#08233C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Supervision Générale
            </span>
            <span className="text-xs text-slate-300">Équipe IMPACT SAHEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Tableau de bord Administrateur
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Pilotage des communes, gestion des porteurs et traitement des contributions citoyennes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#FADB58] text-[#08233C] font-extrabold px-4 py-2.5 rounded-2xl hover:bg-[#ebd048] transition-all shadow-md text-xs sm:text-sm cursor-pointer"
            title="Exporter toutes les contributions citoyennes au format tableur"
          >
            <Download className="w-4 h-4" />
            <span>Export Tableur (CSV)</span>
          </button>
          <button
            onClick={() => setActiveModal('publish')}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-4 py-2.5 rounded-2xl border border-white/20 transition-all text-xs sm:text-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#38B6FF]" />
            <span>Publier info Mairie</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white font-bold px-3.5 py-2.5 rounded-2xl border border-rose-400/30 transition-all text-xs sm:text-sm cursor-pointer"
            title="Se déconnecter et revenir en mode citoyen"
          >
            <LogOut className="w-4 h-4 text-rose-300" />
            <span>Déconnexion</span>
          </button>
        </div>
      </section>

      {/* 6.6.1 Indicateurs Clés de la Plateforme */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Visiteurs</span>
          <span className="text-2xl font-black text-[#08233C]">8 420</span>
          <span className="text-[9px] text-emerald-600 font-bold block">+18% ce mois</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Publications</span>
          <span className="text-2xl font-black text-[#38B6FF]">{publications.length}</span>
          <span className="text-[9px] text-slate-400">Total en ligne</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Initiatives</span>
          <span className="text-2xl font-black text-[#08233C]">{initiatives.length}</span>
          <span className="text-[9px] text-slate-400">6 communes</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Porteurs actifs</span>
          <span className="text-2xl font-black text-amber-500">{users.filter(u => u.role === 'porteur').length}</span>
          <span className="text-[9px] text-slate-400">Incubés</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Idées reçues</span>
          <span className="text-2xl font-black text-emerald-600">
            {contributions.filter(c => c.type === 'idee').length}
          </span>
          <span className="text-[9px] text-slate-400">Propositions</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Signalements</span>
          <span className="text-2xl font-black text-red-600">
            {contributions.filter(c => c.type === 'signalement').length}
          </span>
          <span className="text-[9px] text-slate-400">Problèmes</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Commentaires</span>
          <span className="text-2xl font-black text-slate-700">{comments.length}</span>
          <span className="text-[9px] text-amber-600 font-bold">
            {comments.filter(c => c.reported).length} signalés
          </span>
        </div>
      </section>

      {/* 6.6.4 Traitement des Contributions Citoyennes (Boîte de Réception Confidentielle) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Boîte de réception confidentielle
              </span>
              <span className="text-xs text-slate-500 font-semibold">Non visible par le public</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#08233C] mt-1">
              Contributions citoyennes reçues ({filteredContributions.length})
            </h3>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={contribTypeFilter}
              onChange={(e) => setContribTypeFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">Tous types</option>
              <option value="idee">Idées uniquement</option>
              <option value="signalement">Signalements uniquement</option>
            </select>

            <select
              value={contribStatusFilter}
              onChange={(e) => setContribStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">Tous statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="vu">Vu</option>
              <option value="transmis">Transmis à la commune</option>
              <option value="cloture">Clôturé</option>
            </select>

            <select
              value={contribCommuneFilter}
              onChange={(e) => setContribCommuneFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="all">Toutes communes</option>
              {communes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contributions table / list */}
        <div className="space-y-3">
          {filteredContributions.length === 0 ? (
            <p className="p-6 text-center text-slate-400 text-xs">Aucune contribution ne correspond aux filtres.</p>
          ) : (
            filteredContributions.map((contrib) => {
              const commune = communes.find(c => c.id === contrib.communeId);
              const isSelected = selectedContributionId === contrib.id;

              return (
                <div
                  key={contrib.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected ? 'border-[#38B6FF] bg-sky-50/50 shadow-xs' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        contrib.type === 'idee' ? 'bg-[#FADB58] text-[#08233C]' : 'bg-red-500 text-white'
                      }`}>
                        {contrib.type === 'idee' ? '💡 Idée' : '⚠️ Signalement'}
                      </span>
                      <span className="font-bold text-xs text-slate-800">
                        {commune?.name} • {contrib.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(contrib.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        contrib.internalStatus === 'nouveau'
                          ? 'bg-blue-100 text-blue-800'
                          : contrib.internalStatus === 'vu'
                            ? 'bg-amber-100 text-amber-800'
                            : contrib.internalStatus === 'transmis'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Statut : {contrib.internalStatus}
                      </span>
                      <button
                        onClick={() => setSelectedContributionId(isSelected ? null : contrib.id)}
                        className="text-xs font-bold text-[#0B3B60] hover:underline cursor-pointer"
                      >
                        {isSelected ? 'Masquer' : 'Traiter / Détails'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {contrib.description}
                  </p>

                  {/* Expanded Detail Panel */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 bg-white p-4 rounded-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-500 block">Lieu / Repère :</span>
                          <span className="text-slate-800">{contrib.locationText || 'Non spécifié'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500 block">Contact citoyen facultatif :</span>
                          <span className="text-slate-800">
                            {contrib.citizenName || 'Anonyme'} {contrib.citizenPhone ? `(${contrib.citizenPhone})` : ''}
                          </span>
                        </div>
                      </div>

                      {contrib.photoUrl && (
                        <div>
                          <span className="font-bold text-slate-500 block text-xs mb-1">Photo jointe :</span>
                          <img src={contrib.photoUrl} alt="Preuve" className="h-32 rounded-lg object-cover border border-slate-200" />
                        </div>
                      )}

                      {/* Status Change Buttons */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-700 block mb-1.5">
                          Attribuer un statut interne de traitement :
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(['nouveau', 'vu', 'transmis', 'cloture'] as ContributionStatus[]).map(st => (
                            <button
                              key={st}
                              onClick={() => updateContributionStatus(contrib.id, st)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                contrib.internalStatus === st ? 'bg-[#08233C] text-[#FADB58]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {st === 'transmis' ? 'Transmis à la commune' : st.charAt(0).toUpperCase() + st.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Internal Note */}
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-700 block mb-1">
                          Note de suivi interne (pour équipe IMPACT SAHEL) :
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            defaultValue={contrib.internalNotes || ''}
                            onChange={(e) => setInternalNoteText(e.target.value)}
                            placeholder="Ex : Benne municipale dépêchée le 15/02..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
                          />
                          <button
                            onClick={() => updateContributionStatus(contrib.id, contrib.internalStatus, internalNoteText)}
                            className="px-3 py-1.5 bg-[#08233C] text-white rounded-xl text-xs font-bold hover:bg-[#0B3B60] cursor-pointer"
                          >
                            Enregistrer note
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 6.6.2 Gestion des Comptes Porteurs */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#08233C]">
              Gestion des comptes porteurs d'initiatives ({users.filter(u => u.role === 'porteur').length})
            </h3>
            <p className="text-xs text-slate-500">
              Création des accès et réinitialisation des mots de passe.
            </p>
          </div>
        </div>

        {accountSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            {accountSuccessMsg}
          </div>
        )}

        {/* Quick form to create porteur */}
        <form onSubmit={handleCreatePorteur} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-xs font-extrabold text-slate-800 block">
            + Créer un nouveau compte porteur (Jeune ou Femme incubé) :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Nom & Prénom"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
              required
            />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone (+223...)"
              value={newUserPhone}
              onChange={(e) => setNewUserPhone(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
            />
            <select
              value={newUserCommune}
              onChange={(e) => setNewUserCommune(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
            >
              {communes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nom de l'initiative accompagnée"
              value={newUserInitiative}
              onChange={(e) => setNewUserInitiative(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#08233C] text-[#FADB58] font-extrabold text-xs rounded-xl hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              Générer les identifiants
            </button>
          </div>
        </form>

        {/* Existing porteurs list */}
        <div className="divide-y divide-slate-100">
          {users.filter(u => u.role === 'porteur').map(user => (
            <div key={user.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{user.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    user.status === 'actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] block">
                  {user.email} • {user.phone} • {user.initiativeName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {user.status === 'actif' ? 'Suspendre' : 'Réactiver'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.6.5 Modération des Commentaires */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#08233C] flex items-center gap-2">
            <Flag className="w-5 h-5 text-amber-500" />
            Modération des commentaires citoyens ({comments.length})
          </h3>
          <span className="text-xs text-slate-500">
            Contrôle a posteriori
          </span>
        </div>

        <div className="space-y-2">
          {comments.map(c => (
            <div
              key={c.id}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                c.reported ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-slate-900">{c.authorName}</span>
                  <span className="text-[10px] text-slate-400">{c.date}</span>
                  {c.reported && (
                    <span className="bg-amber-200 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                      ⚠️ Signalé par un utilisateur
                    </span>
                  )}
                </div>
                <p className="text-slate-700">{c.message}</p>
              </div>

              <button
                onClick={() => deleteComment(c.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                title="Supprimer ce commentaire"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
