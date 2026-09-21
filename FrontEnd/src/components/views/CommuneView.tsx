import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../InteractiveMap';
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Filter,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const CommuneView: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { 
    selectedCommune, 
    setSelectedCommuneId, 
    communes, 
    initiatives, 
    publications, 
    openInitiativeById, 
    openPublicationById,
    setActiveModal 
  } = useApp();

  const [newsFilter, setNewsFilter] = useState<'all' | 'mairie' | 'initiatives'>('all');

  // Synchroniser la commune sélectionnée si l'URL contient un ID de commune (ex: /ma-commune/c2)
  useEffect(() => {
    if (id && communes.some(c => c.id === id)) {
      setSelectedCommuneId(id);
    }
  }, [id, communes, setSelectedCommuneId]);

  const handleSelectCommune = (communeId: string) => {
    setSelectedCommuneId(communeId);
    navigate(`/ma-commune/${communeId}`);
  };

  // Filter commune data
  const communeInitiatives = initiatives.filter(i => i.communeId === selectedCommune.id);
  const communeNews = publications.filter(p => p.communeId === selectedCommune.id);
  
  const filteredNews = communeNews.filter(p => {
    if (newsFilter === 'mairie') return p.type === 'commune_news';
    if (newsFilter === 'initiatives') return p.type === 'initiative_update';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* En-tête Captivant : Sélecteur Visuel & Interactif des 6 Communes de Bamako */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08233C] via-[#0B3B60] to-[#08233C] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        {/* Glow decorative orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38B6FF]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#FADB58]/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top header line */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-[#FADB58] mb-2 backdrop-blur-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>Territoire Municipal • District de Bamako</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ma Commune : <span className="text-[#38B6FF]">{selectedCommune.name}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl leading-relaxed">
                Explorez les services municipaux, les contacts officiels de la mairie, les actualités et les initiatives de jeunes et de femmes accompagnées sur votre territoire.
              </p>
            </div>

            {/* Quick interactive Dropdown & Citizen actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex items-center gap-2">
                <span className="text-xs text-slate-200 font-semibold pl-2 hidden sm:inline">Changer :</span>
                <select
                  id="commune-view-select"
                  value={selectedCommune.id}
                  onChange={(e) => handleSelectCommune(e.target.value)}
                  className="bg-[#08233C] text-white font-extrabold text-xs sm:text-sm px-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FADB58] cursor-pointer shadow-inner"
                  aria-label="Sélectionner une autre commune"
                >
                  {communes.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#08233C] text-white">
                      {c.name} ({c.neighborhoods.slice(0, 2).join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <a
                id="commune-whatsapp-channel-btn"
                href={selectedCommune.whatsappChannelUrl || 'https://whatsapp.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                title={`Rejoindre la chaîne WhatsApp officielle de la ${selectedCommune.name}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chaîne WhatsApp {selectedCommune.name}</span>
                <ExternalLink className="w-3 h-3 text-white/80" />
              </a>

              <button
                onClick={() => setActiveModal('idea')}
                className="flex items-center gap-1.5 bg-[#FADB58] text-[#08233C] text-xs font-black px-4 py-2.5 rounded-xl hover:bg-[#ebd048] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Idée pour ma commune</span>
              </button>
            </div>
          </div>

          {/* Captivating 6 Communes Cards Selector */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-[#FADB58] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                Sélection rapide des 6 Communes de Bamako :
              </span>
              <span className="text-[11px] text-slate-300 hidden sm:inline">
                Cliquez pour basculer instantanément
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {communes.map((c) => {
                const isSelected = c.id === selectedCommune.id;
                // Roman numeral extraction
                const romanNumeral = c.id.replace('c', '').toUpperCase();
                return (
                  <button
                    key={c.id}
                    id={`commune-pill-${c.id}`}
                    onClick={() => handleSelectCommune(c.id)}
                    className={`relative p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-white text-[#08233C] shadow-lg scale-102 ring-3 ring-[#FADB58]'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xs'
                    }`}
                  >
                    {/* Top row: badge & check */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        isSelected 
                          ? 'bg-[#08233C] text-[#FADB58]' 
                          : 'bg-white/20 text-white group-hover:bg-white/30'
                      }`}>
                        {romanNumeral}
                      </span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-white/60" />
                      )}
                    </div>

                    {/* Commune Name */}
                    <span className={`font-black text-sm block leading-tight ${isSelected ? 'text-[#08233C]' : 'text-white'}`}>
                      {c.name}
                    </span>

                    {/* Key neighborhoods preview */}
                    <span className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                      {c.neighborhoods.slice(0, 2).join(', ')}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Commune Key Highlights Banner Bar */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#FADB58]">Quartiers rattachés :</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedCommune.neighborhoods.map((q, idx) => (
                  <span
                    key={idx}
                    className="bg-white/15 hover:bg-white/25 text-white text-[11px] px-2.5 py-0.5 rounded-lg font-medium transition-colors"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#38B6FF]" />
                Pop. : {selectedCommune.population}
              </span>
              <span>•</span>
              <span className="text-[#FADB58] font-bold">
                Maire : {selectedCommune.mayor.split('(')[0].trim()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6.2.2 Fiche d'identité de la Commune */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-[#08233C] mb-2">
              Présentation de la commune
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {selectedCommune.description}
            </p>
          </div>

          {/* Maire et équipe municipale */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#08233C] text-[#FADB58] flex items-center justify-center font-bold flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Maire en fonction :</span>
                <span className="text-base font-extrabold text-[#08233C]">{selectedCommune.mayor}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 pl-13">
              {selectedCommune.mayorTeam}
            </p>
          </div>

          {/* Services administratifs disponibles */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#38B6FF]" />
              Principaux services administratifs de la mairie
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedCommune.services.map((service, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fiche Contact & Chiffres */}
        <div className="space-y-4">
          <div className="bg-[#08233C] text-white rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-base font-extrabold text-[#FADB58] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Repères territoriaux
            </h3>

            <div className="space-y-3 text-xs border-y border-white/15 py-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Population estimée :</span>
                <span className="font-bold text-white">{selectedCommune.population}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Superficie :</span>
                <span className="font-bold text-white">{selectedCommune.superficie}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">District :</span>
                <span className="font-bold text-white">{selectedCommune.district}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#38B6FF] flex-shrink-0 mt-0.5" />
                <span>{selectedCommune.townHallAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38B6FF] flex-shrink-0" />
                <a href={`tel:${selectedCommune.townHallPhone.replace(/\s+/g, '')}`} className="font-bold text-[#FADB58] hover:underline">
                  {selectedCommune.townHallPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38B6FF] flex-shrink-0" />
                <a href={`mailto:${selectedCommune.townHallEmail}`} className="text-slate-200 hover:underline truncate">
                  {selectedCommune.townHallEmail}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#38B6FF] flex-shrink-0 mt-0.5" />
                <span>{selectedCommune.openingHours}</span>
              </div>

              {/* Canal WhatsApp direct */}
              <div className="pt-2 border-t border-white/15">
                <a
                  href={selectedCommune.whatsappChannelUrl || 'https://whatsapp.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Canal WhatsApp Officiel</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick citizen callouts */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-bold text-amber-900 block">
              Une remarque sur la {selectedCommune.name} ?
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveModal('idea')}
                className="w-full py-2.5 px-3 bg-[#FADB58] text-[#08233C] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Proposer une idée pour {selectedCommune.name}</span>
              </button>
              <button
                onClick={() => setActiveModal('problem')}
                className="w-full py-2.5 px-3 bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Signaler un problème dans ma rue</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6.2.3 Carte Interactive de Localisation */}
      <section className="space-y-2">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#08233C] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#38B6FF]" />
          Plan et localisation de la mairie
        </h3>
        <InteractiveMap commune={selectedCommune} />
      </section>

      {/* 6.2.4 Actualités de la commune avec filtre */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#08233C] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#38B6FF]" />
              Actualités dans la {selectedCommune.name} ({filteredNews.length})
            </h3>
            <p className="text-xs text-slate-500">
              Publications officielles de la mairie et avancées des initiatives locales.
            </p>
          </div>

          {/* Filter tabs: Toutes / Mairie / Initiatives */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
            <button
              onClick={() => setNewsFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                newsFilter === 'all' ? 'bg-[#08233C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setNewsFilter('mairie')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                newsFilter === 'mairie' ? 'bg-[#08233C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mairie
            </button>
            <button
              onClick={() => setNewsFilter('initiatives')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                newsFilter === 'initiatives' ? 'bg-[#08233C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Initiatives
            </button>
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
            Aucune publication actuellement pour ce filtre dans la {selectedCommune.name}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((news) => (
              <div
                key={news.id}
                onClick={() => openPublicationById(news.id)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row group"
              >
                <img
                  src={news.coverImage}
                  alt={news.title}
                  className="w-full sm:w-44 h-40 sm:h-auto object-cover group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        news.type === 'commune_news' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {news.type === 'commune_news' ? 'Mairie' : 'Projet citoyen'}
                      </span>
                      <span>{news.date}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#08233C] group-hover:text-[#38B6FF] transition-colors line-clamp-2 mb-1">
                      {news.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {news.metaDescription}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#0B3B60] mt-3 flex items-center gap-1">
                    Lire la suite <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6.2.5 Initiatives dans la commune */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#08233C] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FADB58]" />
            Initiatives incubées en {selectedCommune.name} ({communeInitiatives.length})
          </h3>
          <p className="text-xs text-slate-500">
            Projets portés par des jeunes et des femmes réalisés sur le territoire de cette commune.
          </p>
        </div>

        {communeInitiatives.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
            Aucune fiche d'initiative n'est encore enregistrée pour la {selectedCommune.name}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communeInitiatives.map((init) => (
              <div
                key={init.id}
                onClick={() => openInitiativeById(init.id)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={init.coverImage}
                    alt={init.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {init.domain}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#08233C] group-hover:text-[#38B6FF] transition-colors line-clamp-2 mb-1.5">
                      {init.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {init.solution}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">Porteur : {init.ownerName}</span>
                    <span className="text-[#0B3B60] font-bold">Consulter</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6.2.6 Participation citoyenne intégrée en bas de fiche */}
      <section className="bg-gradient-to-br from-[#08233C] to-[#0B3B60] text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Espace Citoyen Direct • {selectedCommune.name}
          </span>
          <h3 className="text-xl sm:text-3xl font-black">
            Votre commune vous écoute
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Vous avez repéré un dysfonctionnement ou vous avez une idée innovante pour améliorer la vie des résidents de la {selectedCommune.name} ? Partagez-la sans formalité.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveModal('idea')}
              className="bg-[#FADB58] text-[#08233C] font-extrabold px-6 py-3 rounded-2xl hover:bg-[#ebd048] transition-transform active:scale-95 shadow-md text-xs sm:text-sm cursor-pointer flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Proposer une idée pour {selectedCommune.name}</span>
            </button>
            <button
              onClick={() => setActiveModal('problem')}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3 rounded-2xl border border-white/20 transition-transform active:scale-95 text-xs sm:text-sm cursor-pointer flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-[#FADB58]" />
              <span>Signaler un problème local</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
