import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';

export const InitiativesView: React.FC = () => {
  const { initiatives, communes, openInitiativeById, currentUserRole, setActiveModal } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommuneFilter, setSelectedCommuneFilter] = useState<string>('all');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  // Extract unique domains
  const allDomains = Array.from(new Set(initiatives.map(i => i.domain)));

  const filteredInitiatives = initiatives.filter(init => {
    const matchesSearch = init.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.solution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCommune = selectedCommuneFilter === 'all' || init.communeId === selectedCommuneFilter;
    const matchesDomain = selectedDomainFilter === 'all' || init.domain === selectedDomainFilter;

    return matchesSearch && matchesCommune && matchesDomain;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Vitrine Lab'Citoyen
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Nos Initiatives Citoyennes
          </h1>
          <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-medium">
            Découvrez et soutenez les projets concrets portés par les jeunes et les femmes dans les six communes du District de Bamako.
          </p>

          {currentUserRole === 'porteur' && (
            <div className="mt-4">
              <button
                onClick={() => setActiveModal('publish')}
                className="inline-flex items-center gap-2 bg-[#FADB58] text-[#08233C] font-bold px-4 py-2 rounded-xl text-xs sm:text-sm hover:bg-[#ebd048] transition-colors cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier une actualité d'avancement</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6.3.1 Filtres simples et visuels + Recherche par mot-clé */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une initiative, un mot-clé ou un porteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
            />
          </div>

          {/* Filter by Commune */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Commune :</span>
            <select
              value={selectedCommuneFilter}
              onChange={(e) => setSelectedCommuneFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] cursor-pointer"
            >
              <option value="all">Toutes les communes</option>
              {communes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Domain */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Domaine :</span>
            <select
              value={selectedDomainFilter}
              onChange={(e) => setSelectedDomainFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] cursor-pointer"
            >
              <option value="all">Tous les domaines</option>
              {allDomains.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick domain badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filtre rapide :</span>
          <button
            onClick={() => setSelectedDomainFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedDomainFilter === 'all' ? 'bg-[#08233C] text-[#FADB58]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous
          </button>
          {allDomains.map((domain, i) => (
            <button
              key={i}
              onClick={() => setSelectedDomainFilter(domain)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedDomainFilter === domain ? 'bg-[#08233C] text-[#FADB58]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Initiative Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>{filteredInitiatives.length} initiative(s) trouvée(s)</span>
          <span>Cliquer sur une carte pour voir les détails et commenter</span>
        </div>

        {filteredInitiatives.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <p className="text-base font-bold text-slate-700 mb-1">Aucune initiative ne correspond à vos critères.</p>
            <p className="text-xs">Essayez d'élargir votre recherche ou de réinitialiser les filtres.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCommuneFilter('all');
                setSelectedDomainFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-[#08233C] text-white rounded-xl text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInitiatives.map((init) => {
              const commune = communes.find(c => c.id === init.communeId);
              return (
                <div
                  key={init.id}
                  onClick={() => openInitiativeById(init.id)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#38B6FF] transition-all cursor-pointer flex flex-col group"
                >
                  {/* Cover */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={init.coverImage}
                      alt={init.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {init.domain}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-[#08233C]/85 text-white backdrop-blur-xs text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FADB58]" />
                      {commune?.name}
                    </span>
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      init.status === 'termine' ? 'bg-emerald-600 text-white' : init.status === 'en_cours' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {init.status === 'termine' ? 'Terminé' : init.status === 'en_cours' ? 'En cours' : 'Démarré'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-[#08233C] group-hover:text-[#38B6FF] transition-colors line-clamp-2 mb-2">
                        {init.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {init.problem}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">
                          Porté par <strong>{init.ownerName}</strong>
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                          {init.ownerType === 'femme' ? 'Femme' : init.ownerType === 'jeune' ? 'Jeune' : 'Collectif'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#0B3B60] font-bold pt-1">
                        <span>Voir la fiche détaillée & commentaires</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
