import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Download, 
  ExternalLink, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  FileText, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle2, 
  ArrowUpRight,
  Building2,
  Calendar,
  Share2,
  MessageCircle,
  HelpCircle,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AdminTabId } from './AdminSidebar';
import { isPorteur } from '../../models/auth.model';

interface AdminDashboardTabProps {
  onNavigateTab: (tab: AdminTabId) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({ onNavigateTab }) => {
  const { 
    publications, 
    initiatives, 
    users, 
    contributions, 
    comments, 
    communes,
    setActiveTab,
    activeUser
  } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Exact metrics as requested
  const visitorsCount = "8 420";
  const visitorsTrend = "+18% ce mois";
  const publicationsCount = publications.length;
  const initiativesCount = initiatives.length;
  const porteursCount = users.filter(u => u.role === 'porteur').length;
  const ideasCount = contributions.filter(c => c.type === 'idee').length;
  const problemsCount = contributions.filter(c => c.type === 'signalement').length;
  const totalCommentsCount = comments.length;
  const reportedCommentsCount = comments.filter(c => c.reported).length;

  // Export CSV functionality
  const handleExportCSV = () => {
    const rows = [
      ['Rapport Tableau de Bord INNOVSAHEL - District de Bamako'],
      ['Date d’export', new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR')],
      ['Exporté par', activeUser.name + ' (' + activeUser.email + ')'],
      [],
      ['INDICATEURS CLÉS'],
      ['Métrique', 'Valeur', 'Détail'],
      ['Visiteurs', visitorsCount, visitorsTrend],
      ['Publications', publicationsCount, 'Total en ligne'],
      ['Initiatives', initiativesCount, '6 communes couvertes'],
      ['Porteurs actifs', porteursCount, 'Incubés Lab’Citoyen'],
      ['Idées reçues', ideasCount, 'Propositions citoyennes'],
      ['Signalements', problemsCount, 'Problèmes signalés'],
      ['Commentaires citoyens', totalCommentsCount, `${reportedCommentsCount} nécessitant modération`],
      [],
      ['COMMUNES DU DISTRICT DE BAMAKO'],
      ['ID', 'Commune', 'Maire', 'Population', 'Chaîne WhatsApp'],
      ...communes.map(c => [c.id.toUpperCase(), c.name, c.mayor, c.population, c.whatsappChannelUrl || 'Non défini']),
      [],
      ['DERNIÈRES CONTRIBUTIONS CITOYENNES'],
      ['Type', 'Commune', 'Catégorie', 'Statut Interne', 'Date', 'Description'],
      ...contributions.map(c => [
        c.type === 'idee' ? 'Idée' : 'Signalement',
        communes.find(comm => comm.id === c.communeId)?.name || c.communeId,
        c.category,
        c.internalStatus,
        new Date(c.createdAt).toLocaleDateString('fr-FR'),
        `"${c.description.replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + rows.map(e => e.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `innovsahel-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // ─── Vue exclusive pour le Porteur d'Initiative ───────────────────────────
  if (isPorteur(activeUser as any)) {
    const myInitiatives = initiatives.filter(i =>
      i.ownerUserId === activeUser.id ||
      (activeUser.initiativeName && i.title.toLowerCase().includes(activeUser.initiativeName.toLowerCase()))
    );
    const myInitiativeIds = myInitiatives.map(i => i.id);
    const myComments = comments.filter(c => c.initiativeId && myInitiativeIds.includes(c.initiativeId));
    const totalViews = myInitiatives.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
    const answeredCommentsCount = myComments.filter(c => !!c.replyText).length;
    const unansweredCommentsCount = myComments.length - answeredCommentsCount;

    return (
      <div className="space-y-6 pb-12">
        {/* Porteur Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black tracking-wider uppercase text-emerald-800">
                Espace Porteur de Projet • Statistiques Personnelles
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tableau de Bord — Mon Projet
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Bienvenue, {activeUser.name} ! Suivez l'impact direct et la visibilité citoyenne de vos initiatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('accueil')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <span>Voir sur la plateforme</span>
            </button>
            <button
              onClick={() => onNavigateTab('mon-initiative')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#062326] font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gérer mon initiative</span>
            </button>
          </div>
        </div>

        {/* 4 Porteur Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Initiatives gérées</span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{myInitiatives.length}</p>
            <p className="text-xs text-slate-400 mt-1">Fiches rattachées à votre compte</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Vues Citoyennes</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{totalViews}</p>
            <p className="text-xs text-slate-400 mt-1">Consultations cumulées</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Commentaires reçus</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{myComments.length}</p>
            <p className="text-xs text-slate-400 mt-1">{unansweredCommentsCount} sans réponse</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Réponses apportées</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{answeredCommentsCount}</p>
            <p className="text-xs text-slate-400 mt-1">Dialogue actif avec les citoyens</p>
          </div>
        </div>

        {/* Porteur Initiatives & Dialogue Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mes projets */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Mes fiches d'initiative ({myInitiatives.length})
              </h3>
              <button
                onClick={() => onNavigateTab('mon-initiative')}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Ouvrir la gestion →
              </button>
            </div>

            {myInitiatives.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Aucune initiative enregistrée pour le moment.
              </div>
            ) : (
              <div className="space-y-3">
                {myInitiatives.map(init => {
                  const comm = communes.find(c => c.id === init.communeId);
                  const initComments = comments.filter(c => c.initiativeId === init.id);
                  return (
                    <div key={init.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{init.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>{comm?.name}</span>
                          <span>•</span>
                          <span>{init.viewsCount || 0} vues</span>
                          <span>•</span>
                          <span>{initComments.length} avis</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        init.status === 'termine' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {init.status === 'termine' ? 'Terminé' : 'En cours'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dernières questions des citoyens */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                Dernières réactions citoyennes
              </h3>
              <button
                onClick={() => onNavigateTab('mon-initiative')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                Répondre aux questions →
              </button>
            </div>

            {myComments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Aucune question ou commentaire citoyen pour l'instant.
              </div>
            ) : (
              <div className="space-y-3">
                {myComments.slice(0, 3).map(comment => (
                  <div key={comment.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{comment.authorName}</span>
                      <span className="text-[10px] text-slate-400">{comment.date}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{comment.message}</p>
                    {comment.replyText ? (
                      <span className="inline-block mt-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        ✓ Répondu
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                        ⏳ En attente de réponse
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Vue standard Administrateur (Global Platform) ────────────────────────
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black tracking-wider uppercase text-emerald-800">
              Supervision Générale • Temps Réel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            District de Bamako • Suivi des 6 communes, initiatives incubées et contributions citoyennes.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bouton Export Tableur (CSV) */}
          <button
            id="admin-export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs transition-all cursor-pointer hover:border-slate-400 active:scale-95"
            title="Exporter toutes les données du dashboard au format CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Tableur (CSV)</span>
          </button>

          {/* Bouton Aller sur la plateforme */}
          <button
            id="admin-header-goto-platform-btn"
            onClick={() => setActiveTab('accueil')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#062326] hover:bg-[#0A363A] text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-teal-300" />
            <span>Aller sur la plateforme</span>
          </button>

          {/* Quick Publish shortcut */}
          <button
            onClick={() => onNavigateTab('publications')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#062326] font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Publication</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fichier tableur (CSV) généré et téléchargé avec succès !</span>
          </div>
          <span className="text-[10px] text-emerald-700">Encodage UTF-8 (Excel / LibreOffice)</span>
        </div>
      )}

      {/* Row 1: Key Metrics Grid (Visiteurs, Publications, Initiatives, Porteurs, Idées, Signalements, Commentaires) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Metric 1: Visiteurs */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Visiteurs
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
              {visitorsCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>{visitorsTrend}</span>
          </div>
        </div>

        {/* Metric 2: Publications */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Publications
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-600 tracking-tight block">
              {publicationsCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            Total en ligne
          </div>
        </div>

        {/* Metric 3: Initiatives */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Initiatives
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#062326] tracking-tight block">
              {initiativesCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            6 communes
          </div>
        </div>

        {/* Metric 4: Porteurs actifs */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Porteurs actifs
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight block">
              {porteursCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-amber-700 font-bold">
            Incubés
          </div>
        </div>

        {/* Metric 5: Idées reçues */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Idées reçues
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight block">
              {ideasCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            Propositions
          </div>
        </div>

        {/* Metric 6: Signalements */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-red-300 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Signalements
            </span>
            <span className="text-2xl sm:text-3xl font-black text-red-500 tracking-tight block">
              {problemsCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-red-600 font-bold">
            Problèmes
          </div>
        </div>

        {/* Metric 7: Commentaires */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-400 transition-colors">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
              Commentaires
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight block">
              {totalCommentsCount}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Citoyens</span>
            {reportedCommentsCount > 0 && (
              <span className="text-amber-600 font-bold">{reportedCommentsCount} sign.</span>
            )}
          </div>
        </div>
      </section>

      {/* Row 2: Visual Graphic Cards echoing the uploaded reference image */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Circular Gauge Level (like "Waste Processing Level 72%") */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Indice de Résolution
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Taux de Traitement Citoyen
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                Optimal
              </span>
            </div>

            {/* Circular Gauge Presentation */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={402}
                  strokeDashoffset={402 * (1 - 0.78)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900">78%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Traité
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              78% des signalements d’insalubrité ou d’engorgement ont été pris en charge ou transmis aux mairies compétentes.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Délai moyen</span>
              <span className="font-extrabold text-slate-800">48 Heures</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Satisfaction</span>
              <span className="font-extrabold text-emerald-600">4.8 / 5</span>
            </div>
          </div>
        </div>

        {/* Card 2: Filières d'Impact & Initiatives (like "Renewable Energy 86%") */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Économie Circulaire
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Répartition des Initiatives
                </h3>
              </div>
              <button 
                onClick={() => onNavigateTab('porteurs')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1"
              >
                <span>Détails</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Recyclage & Pavés Plastiques</span>
                  <span className="text-emerald-600">34%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Maraîchage Fluvial & Bio</span>
                  <span className="text-teal-600">28%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Pompage Solaire & Énergie Propre</span>
                  <span className="text-amber-500">20%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">Éco-artisanat & Poterie Bogolan</span>
                  <span className="text-slate-600">18%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>6 Projets modèles incubés</span>
            <span className="font-bold text-slate-800">100% à Bamako</span>
          </div>
        </div>

        {/* Card 3: WhatsApp Community Widget (exact match to "Let's join our community" from the image) */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-[#062326] via-[#092B2E] to-[#041A1C] text-white border border-teal-500/20 shadow-lg relative overflow-hidden flex flex-col justify-between">
          {/* Decorative subtle ambient lights */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-400/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Réseau Municipal Officiel</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                Chaînes WhatsApp des 6 Communes
              </h3>
              <p className="text-xs text-teal-200/80 mt-1 leading-relaxed">
                Chaque commune de Bamako dispose d'un canal WhatsApp dédié pour diffuser alertes, communiqués et initiatives.
              </p>
            </div>

            {/* Communes WhatsApp Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {communes.map(c => (
                <a
                  key={c.id}
                  href={c.whatsappChannelUrl || 'https://whatsapp.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-xl bg-white/10 hover:bg-emerald-500 text-white hover:text-[#062326] border border-white/10 hover:border-emerald-400 transition-all font-bold text-xs group cursor-pointer"
                  title={`Rejoindre la chaîne WhatsApp de la ${c.name}`}
                >
                  <span className="truncate">{c.name}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-300 group-hover:text-[#062326] flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-teal-500/20 flex items-center justify-between text-[11px] text-teal-300/80">
            <span>6/6 Chaînes actives</span>
            <span className="font-bold text-emerald-400">Diffusion vérifiée</span>
          </div>
        </div>
      </section>

      {/* Row 3: Quick Action Sections (Pending contributions to review + Moderation reminder) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Veille Rapide
              </span>
              <span className="text-xs text-slate-500 font-semibold">Dernières contributions citoyennes</span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-1">
              Signalements et Idées en attente ({contributions.length})
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('contributions')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ouvrir l’onglet Contributions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contributions.slice(0, 4).map(contrib => {
            const commune = communes.find(c => c.id === contrib.communeId);
            return (
              <div
                key={contrib.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        contrib.type === 'idee' ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-700'
                      }`}>
                        {contrib.type === 'idee' ? '💡 Idée' : '⚠️ Signalement'}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{commune?.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(contrib.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {contrib.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-500">
                    Statut : <span className="text-slate-800">{contrib.internalStatus}</span>
                  </span>
                  <button
                    onClick={() => onNavigateTab('contributions')}
                    className="text-[11px] font-extrabold text-teal-700 hover:underline cursor-pointer"
                  >
                    Traiter →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
