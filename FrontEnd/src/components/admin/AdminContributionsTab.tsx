import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenContribution, ContributionStatus } from '../../types';
import { 
  MessageSquare, 
  AlertTriangle, 
  Lightbulb, 
  Search, 
  Filter, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Building2, 
  Trash2, 
  Eye, 
  Send, 
  Check, 
  X, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const AdminContributionsTab: React.FC = () => {
  const { 
    contributions, 
    communes, 
    updateContributionStatus, 
    deleteContribution 
  } = useApp();

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'signalement' | 'idee'>('all');
  const [communeFilter, setCommuneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected item for detail / note editing
  const [selectedContributionId, setSelectedContributionId] = useState<string | null>(null);
  const [internalNoteText, setInternalNoteText] = useState<{ [id: string]: string }>({});
  const [successNoteId, setSuccessNoteId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CitizenContribution | null>(null);

  const signalementsCount = contributions.filter(c => c.type === 'signalement').length;
  const ideesCount = contributions.filter(c => c.type === 'idee').length;

  const filteredContributions = contributions.filter(c => {
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesCommune = communeFilter === 'all' || c.communeId === communeFilter;
    const matchesStatus = statusFilter === 'all' || c.internalStatus === statusFilter;
    const matchesSearch = 
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.citizenName && c.citizenName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.locationText && c.locationText.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesCommune && matchesStatus && matchesSearch;
  });

  const handleSaveNote = (contribId: string) => {
    const note = internalNoteText[contribId];
    const item = contributions.find(c => c.id === contribId);
    if (!item) return;

    updateContributionStatus(contribId, item.internalStatus, note);
    setSuccessNoteId(contribId);
    setTimeout(() => setSuccessNoteId(null), 2500);
  };

  const handleStatusChange = (contribId: string, newStatus: ContributionStatus) => {
    const item = contributions.find(c => c.id === contribId);
    updateContributionStatus(contribId, newStatus, item?.internalNotes);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    deleteContribution(itemToDelete.id);
    if (selectedContributionId === itemToDelete.id) {
      setSelectedContributionId(null);
    }
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
              Boîte de Réception Sécurisée
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Confidentiel • Usage interne Mairies & Lab'Citoyen
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Contributions Citoyennes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Traitement direct des signalements de problèmes urbains et examen des propositions d'idées citoyennes.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-black flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{signalementsCount} Signalements</span>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{ideesCount} Idées</span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Pills */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {/* Type selector tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-[#062326] text-emerald-300 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({contributions.length})
          </button>
          <button
            onClick={() => setTypeFilter('signalement')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              typeFilter === 'signalement'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Signalements (Problèmes) ({signalementsCount})</span>
          </button>
          <button
            onClick={() => setTypeFilter('idee')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              typeFilter === 'idee'
                ? 'bg-amber-400 text-[#062326] shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Idées citoyennes ({ideesCount})</span>
          </button>
        </div>

        {/* Search and Dropdown filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par mot-clé, lieu, citoyen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Toutes les communes</option>
              {communes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="vu">Vu / En analyse</option>
              <option value="transmis">Transmis à la mairie</option>
              <option value="cloture">Clôturé / Traité</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contributions List */}
      <div className="space-y-4">
        {filteredContributions.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-600">
              Aucune contribution ne correspond aux critères sélectionnés.
            </p>
            <button
              onClick={() => { setTypeFilter('all'); setCommuneFilter('all'); setStatusFilter('all'); setSearchTerm(''); }}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          filteredContributions.map(contrib => {
            const commune = communes.find(c => c.id === contrib.communeId);
            const isExpanded = selectedContributionId === contrib.id;
            const currentNote = internalNoteText[contrib.id] !== undefined 
              ? internalNoteText[contrib.id] 
              : (contrib.internalNotes || '');

            const isProblem = contrib.type === 'signalement';

            const statusColors: Record<ContributionStatus, string> = {
              nouveau: 'bg-blue-100 text-blue-800 border-blue-200',
              vu: 'bg-amber-100 text-amber-800 border-amber-200',
              transmis: 'bg-purple-100 text-purple-800 border-purple-200',
              cloture: 'bg-emerald-100 text-emerald-800 border-emerald-200'
            };

            return (
              <div
                key={contrib.id}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs overflow-hidden ${
                  isExpanded ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header bar of card */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                        isProblem ? 'bg-red-500 text-white' : 'bg-amber-400 text-[#062326]'
                      }`}>
                        {isProblem ? <AlertTriangle className="w-3 h-3" /> : <Lightbulb className="w-3 h-3" />}
                        <span>{isProblem ? 'Signalement' : 'Idée'}</span>
                      </span>

                      <span className="font-extrabold text-xs text-slate-800">
                        {commune?.name} • {contrib.category}
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(contrib.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Current Status Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border uppercase tracking-wider ${statusColors[contrib.internalStatus]}`}>
                        {contrib.internalStatus === 'transmis' ? 'Transmis mairie' : contrib.internalStatus}
                      </span>

                      <button
                        onClick={() => setSelectedContributionId(isExpanded ? null : contrib.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Masquer' : 'Traiter / Détails'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <button
                        onClick={() => setItemToDelete(contrib)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Supprimer cette contribution"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contribution Message */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {contrib.description}
                  </p>

                  {/* Summary row if not expanded */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    {contrib.locationText && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{contrib.locationText}</span>
                      </span>
                    )}
                    {contrib.citizenName && (
                      <span className="flex items-center gap-1">
                        <span>Auteur :</span>
                        <strong className="text-slate-700">{contrib.citizenName}</strong>
                      </span>
                    )}
                    {contrib.photoUrl && (
                      <span className="text-emerald-600 font-bold">
                        📷 1 Photo jointe
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Detailed Action Panel */}
                {isExpanded && (
                  <div className="bg-slate-50/80 p-5 sm:p-6 border-t border-slate-200 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Location & Citoyen info */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                          Informations de Contact & Localisation
                        </span>
                        <div>
                          <span className="font-bold text-slate-500 block">Lieu / Repère :</span>
                          <span className="text-slate-800 font-medium">{contrib.locationText || 'Non spécifié'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-500 block">Citoyen :</span>
                          <span className="text-slate-800 font-medium">
                            {contrib.citizenName || 'Anonyme'} {contrib.citizenPhone ? `(${contrib.citizenPhone})` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Right: Photo */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                          Photo / Preuve jointe
                        </span>
                        {contrib.photoUrl ? (
                          <div className="relative group">
                            <img
                              src={contrib.photoUrl}
                              alt="Photo du problème"
                              className="h-32 w-full object-cover rounded-xl border border-slate-200"
                            />
                            <a
                              href={contrib.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-black"
                            >
                              <span>Agrandir</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-xs italic pt-2">Aucune photo jointe par le citoyen.</p>
                        )}
                      </div>
                    </div>

                    {/* Change Status Fast Buttons */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-xs font-black text-slate-800 block">
                        Attribuer un statut interne de traitement municipal :
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(['nouveau', 'vu', 'transmis', 'cloture'] as ContributionStatus[]).map(st => {
                          const isCurrent = contrib.internalStatus === st;
                          return (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(contrib.id, st)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                                isCurrent
                                  ? 'bg-[#062326] text-emerald-300 border-[#062326] shadow-sm'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {st === 'nouveau' && '1. Nouveau'}
                              {st === 'vu' && '2. En analyse (Vu)'}
                              {st === 'transmis' && '3. Transmis à la mairie'}
                              {st === 'cloture' && '4. Clôturé / Résolu'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Internal Notes Editor */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-xs font-black text-slate-800 block">
                        Note de suivi interne (Équipe IMPACT SAHEL / Mairie) :
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Ex: Signalement transmis à M. Keita du service voirie le 14/02..."
                          value={currentNote}
                          onChange={(e) => setInternalNoteText({ ...internalNoteText, [contrib.id]: e.target.value })}
                          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        />
                        <button
                          onClick={() => handleSaveNote(contrib.id)}
                          className="px-4 py-2 bg-[#062326] hover:bg-[#0A363A] text-emerald-300 rounded-xl text-xs font-black transition-colors cursor-pointer flex-shrink-0"
                        >
                          {successNoteId === contrib.id ? '✓ Note Enregistrée' : 'Enregistrer note'}
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

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Supprimer cette contribution ?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Êtes-vous certain de vouloir retirer définitivement cette contribution citoyenne ? Cette opération ne peut être annulée.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setItemToDelete(null)}
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
