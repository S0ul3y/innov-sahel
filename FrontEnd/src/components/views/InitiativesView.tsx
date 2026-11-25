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
  PlusCircle,
  Award,
  Layers
} from 'lucide-react';
import { getMediaUrl, DEFAULT_PUBLICATION_COVERS } from '../../utils/media.utils';
import { Initiative } from '../../models/initiative.model';

export const InitiativesView: React.FC = () => {
  const { initiatives, publications, communes, openInitiativeById, currentUserRole, setActiveModal } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommuneFilter, setSelectedCommuneFilter] = useState<string>('all');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  // ─── 1. Identification des Initiatives Impact Sahel (publiées par les admins) ──
  const adminInitiativePubs = publications.filter(
    p => p.type === 'initiative_update' && (p.authorRole === 'admin' || !p.authorRole)
  );

  const linkedInitiativeIds = new Set(
    adminInitiativePubs.map(p => p.initiativeId).filter(Boolean)
  );
  const adminPubTitles = new Set(
    adminInitiativePubs.map(p => p.title.toLowerCase().trim())
  );

  const isImpactSahel = (init: Initiative) => {
    return (
      linkedInitiativeIds.has(init.id) ||
      adminPubTitles.has(init.title.toLowerCase().trim()) ||
      init.domain === 'Impact Sahel' ||
      init.ownerName?.toLowerCase().includes('impact sahel')
    );
  };

  // Initiatives de la BDD appartenant à Impact Sahel
  const impactSahelFromDb = initiatives.filter(init => isImpactSahel(init));

  // Publications d'initiative d'admin qui n'ont pas encore d'entrée distincte dans la table initiatives
  const virtualImpactSahel: Initiative[] = adminInitiativePubs
    .filter(pub => !initiatives.some(i => i.id === pub.initiativeId || i.title.toLowerCase().trim() === pub.title.toLowerCase().trim()))
    .map(pub => ({
      id: pub.id,
      title: pub.title,
      ownerUserId: pub.authorUserId,
      ownerName: pub.authorName || 'Impact Sahel',
      ownerType: 'collectif' as const,
      ownerBio: 'Initiative territoriale publiée et portée par Impact Sahel',
      communeId: pub.communeId,
      domain: 'Impact Sahel',
      problem: pub.metaDescription || pub.title,
      solution: pub.content || pub.metaDescription || pub.title,
      beneficiaries: 'Citoyens du District de Bamako',
      startDate: pub.date || '',
      status: 'en_cours' as const,
      coverImage: pub.coverImage || '',
      gallery: Array.isArray(pub.carouselImages) ? (pub.carouselImages as any) : [],
      viewsCount: pub.viewsCount || 0,
      videoUrl: pub.youtubeUrl,
      isVisible: true,
      createdAt: typeof pub.createdAt === 'string' ? pub.createdAt : new Date().toISOString(),
    }));

  const allImpactSahel = [...impactSahelFromDb, ...virtualImpactSahel];
  // Dédoublonnage
  const uniqueImpactSahel = allImpactSahel.filter(
    (item, idx, self) => idx === self.findIndex(t => t.id === item.id || t.title.toLowerCase().trim() === item.title.toLowerCase().trim())
  );

  // ─── 2. Initiatives Citoyennes (jeunes, femmes, collectifs locaux) ─────────────
  const citizenInitiatives = initiatives.filter(init => !isImpactSahel(init));

  // Extract unique domains (en excluant 'Impact Sahel' qui a sa section dédiée)
  const allDomains = Array.from(new Set(citizenInitiatives.map(i => i.domain))).filter(Boolean);

  // ─── 3. Application des filtres de recherche ──────────────────────────────────
  const filterPredicate = (init: Initiative) => {
    const matchesSearch = 
      init.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.solution.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCommune = selectedCommuneFilter === 'all' || init.communeId === selectedCommuneFilter;
    const matchesDomain = selectedDomainFilter === 'all' || init.domain === selectedDomainFilter;

    return matchesSearch && matchesCommune && matchesDomain;
  };

  const filteredImpactSahel = uniqueImpactSahel.filter(init => {
    // Les initiatives Impact Sahel répondent à la recherche et au filtre commune
    const matchesSearch = 
      !searchQuery.trim() ||
      init.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      init.solution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCommune = selectedCommuneFilter === 'all' || init.communeId === selectedCommuneFilter;
    return matchesSearch && matchesCommune;
  }).sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));

  const filteredCitizenInitiatives = citizenInitiatives.filter(filterPredicate)
    .sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));

  return (
    <div className="space-y-10 pb-12">
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
            Découvrez et soutenez les projets concrets portés par Impact Sahel, les jeunes et les femmes dans les six communes du District de Bamako.
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

      {/* ─── SECTION 1 : INITIATIVES IMPACT SAHEL (TOUT EN HAUT EN PREMIER) ────── */}
      <section className="space-y-5">
        <div className="bg-gradient-to-r from-[#08233C]/5 via-[#38B6FF]/10 to-[#FADB58]/10 p-5 sm:p-6 rounded-3xl border-2 border-[#38B6FF]/30 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#08233C] text-[#FADB58] shadow-sm">
                <Sparkles className="w-6 h-6 text-[#FADB58]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-[#08233C] tracking-tight">
                    Initiatives Impact Sahel
                  </h2>
                  <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    ⭐ Priorité Impact
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Projets phares publiés et pilotés par l'équipe Impact Sahel pour le District de Bamako
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#08233C] bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-center shrink-0">
              {filteredImpactSahel.length} projet(s) en avant
            </span>
          </div>
        </div>

        {filteredImpactSahel.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
            <p className="text-sm font-bold text-slate-700">Aucune initiative Impact Sahel trouvée pour ces filtres.</p>
            <p className="text-xs text-slate-400 mt-1">Réinitialisez les filtres pour découvrir les projets phares.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImpactSahel.map((init) => {
              const commune = communes.find(c => c.id === init.communeId);
              return (
                <div
                  key={init.id}
                  onClick={() => openInitiativeById(init.id)}
                  className="bg-white rounded-3xl border-2 border-[#38B6FF]/40 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#08233C] transition-all cursor-pointer flex flex-col group relative ring-2 ring-[#38B6FF]/10"
                >
                  {/* Badge Exclusif Impact Sahel */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08233C] text-[#FADB58] text-[10px] font-black uppercase tracking-wider shadow-md border border-[#FADB58]/50">
                    <Sparkles className="w-3.5 h-3.5 text-[#FADB58] fill-current" />
                    <span>Impact Sahel</span>
                  </div>

                  {/* Cover */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={getMediaUrl(init.coverImage, DEFAULT_PUBLICATION_COVERS.initiative_update)}
                      alt={init.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PUBLICATION_COVERS.initiative_update;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#08233C]/90 text-white backdrop-blur-xs text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FADB58]" />
                      {commune?.name || 'District de Bamako'}
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm bg-emerald-600 text-white">
                      {init.status === 'termine' ? 'Terminé' : init.status === 'demarre' ? 'Démarré' : 'En cours'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-extrabold text-base text-[#08233C] group-hover:text-[#38B6FF] transition-colors line-clamp-2 mb-1.5">
                        {init.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {init.problem}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">
                          Piloté par <strong className="text-[#08233C]">{init.ownerName}</strong>
                        </span>
                        <span className="text-[10px] bg-[#08233C]/10 text-[#08233C] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Officiel
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#38B6FF] font-bold pt-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Consulter la fiche détaillée & actualités</span>
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

      {/* ─── FILTRES ET RECHERCHE ──────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-4 h-4 text-[#08233C]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Explorer l'ensemble des initiatives
          </h3>
        </div>

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
        {allDomains.length > 0 && (
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
        )}
      </section>

      {/* ─── SECTION 2 : INITIATIVES CITOYENNES DU DISTRICT ────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#08233C]">Initiatives Citoyennes du District</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
              {filteredCitizenInitiatives.length} projet(s)
            </span>
          </div>
          <span className="hidden sm:inline">Cliquer sur une carte pour voir les détails et commenter</span>
        </div>

        {filteredCitizenInitiatives.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            <p className="text-base font-bold text-slate-700 mb-1">Aucune initiative citoyenne ne correspond à vos critères.</p>
            <p className="text-xs">Essayez d'élargir votre recherche ou de réinitialiser les filtres.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCommuneFilter('all');
                setSelectedDomainFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-[#08233C] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#0B3B60]"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitizenInitiatives.map((init) => {
              const commune = communes.find(c => c.id === init.communeId);
              return (
                <div
                  key={init.id}
                  onClick={() => openInitiativeById(init.id)}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-[#38B6FF] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group relative"
                >
                  {/* Cover */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={getMediaUrl(init.coverImage, DEFAULT_PUBLICATION_COVERS.initiative_update)}
                      alt={init.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PUBLICATION_COVERS.initiative_update;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {init.domain}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-[#08233C]/85 text-white backdrop-blur-xs text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FADB58]" />
                      {commune?.name || 'Bamako'}
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
