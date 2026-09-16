import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Lightbulb, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  TrendingUp, 
  Users, 
  CheckCircle2,
  Calendar,
  MessageSquare,
  ChevronRight,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { 
    communes, 
    selectedCommuneId, 
    setSelectedCommuneId, 
    setActiveTab, 
    setActiveModal, 
    initiatives, 
    publications, 
    contributions, 
    openInitiativeById, 
    openPublicationById 
  } = useApp();

  // Featured items
  const featuredInitiatives = initiatives.slice(0, 3);
  const recentNews = publications.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* 6.1 Hero Header with Brand Slogan */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08233C] via-[#0B3B60] to-[#08233C] text-white p-6 sm:p-10 shadow-lg border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38B6FF]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FADB58]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FADB58] mb-4">
            <span>IMPACT SAHEL</span>
            <span className="text-white/40">•</span>
            <span className="text-white">Projet Lab'Citoyen Bamako</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-3">
            La voix des citoyens et l'énergie des jeunes et des femmes au cœur de Bamako.
          </h1>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed mb-6 max-w-2xl">
            InnovSahel vous rapproche de votre mairie, valorise les projets portés par la jeunesse et les femmes, et vous permet d’agir directement pour votre quartier.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-propose-idea"
              onClick={() => setActiveModal('idea')}
              className="flex items-center gap-2 bg-[#FADB58] text-[#08233C] font-extrabold px-5 py-3 rounded-2xl shadow-md hover:bg-[#ebd048] transition-transform active:scale-95 cursor-pointer text-xs sm:text-sm"
            >
              <Lightbulb className="w-4 h-4 text-[#08233C]" />
              <span>Je propose une idée</span>
            </button>

            <button
              id="hero-report-problem"
              onClick={() => setActiveModal('problem')}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-5 py-3 rounded-2xl border border-white/25 backdrop-blur-xs transition-transform active:scale-95 cursor-pointer text-xs sm:text-sm"
            >
              <AlertTriangle className="w-4 h-4 text-[#FADB58]" />
              <span>Je signale un problème</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6.1 Sélecteur de Commune Dominant (Grands boutons tactiles) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#08233C] flex items-center gap-2">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#38B6FF]" />
              Choisissez votre commune
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Accédez directement aux informations, à la mairie et aux projets de votre lieu de vie.
            </p>
          </div>
          <span className="text-xs font-bold text-[#0B3B60] bg-[#38B6FF]/15 px-3 py-1 rounded-full self-start sm:self-center">
            District de Bamako (6 communes)
          </span>
        </div>

        {/* 6 Grands boutons tactiles pour les 6 Communes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {communes.map((commune) => {
            const isSelected = selectedCommuneId === commune.id;
            return (
              <motion.button
                key={commune.id}
                id={`home-commune-card-${commune.id}`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedCommuneId(commune.id);
                  setActiveTab('ma_commune');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[125px] shadow-xs cursor-pointer ${
                  isSelected
                    ? 'border-[#08233C] bg-gradient-to-b from-[#FADB58]/35 to-[#FADB58]/15 text-[#08233C] shadow-md ring-2 ring-[#08233C]/20'
                    : 'border-slate-200 bg-white hover:border-[#38B6FF] hover:bg-sky-50/40 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-7 h-7 rounded-xl bg-[#08233C] text-white flex items-center justify-center font-extrabold text-xs">
                      {commune.name.replace('Commune ', 'C')}
                    </span>
                    {isSelected && (
                      <span className="bg-[#08233C] text-[#FADB58] text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base leading-snug text-[#08233C]">
                    {commune.name}
                  </h3>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-2 leading-tight">
                    {commune.neighborhoods.slice(0, 3).join(', ')}...
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#0B3B60]">
                      Accéder →
                    </span>
                    <a
                      href={commune.whatsappChannelUrl || 'https://whatsapp.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-[10px] font-black transition-colors"
                      title={`Chaîne WhatsApp de la ${commune.name}`}
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 6.1 Trois Boutons d'Action Principaux (Grands & Visuels) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Action 1 : Je propose une idée */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-[#FADB58] to-[#f7cb20] rounded-3xl p-6 text-[#08233C] shadow-md flex flex-col justify-between border border-[#e5ba15]"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#08233C] text-[#FADB58] flex items-center justify-center mb-4 shadow-sm">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold leading-tight mb-1">
              Je propose une idée
            </h3>
            <p className="text-xs font-semibold text-[#08233C]/80 leading-relaxed mb-4">
              Partagez vos suggestions pour améliorer le quotidien de votre quartier, sans créer de compte.
            </p>
          </div>
          <button
            id="action-propose-idea"
            onClick={() => setActiveModal('idea')}
            className="w-full py-3 px-4 bg-[#08233C] text-[#FADB58] hover:bg-[#0B3B60] rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Déposer une proposition</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Action 2 : Je signale un problème */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between border border-amber-600"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold leading-tight mb-1">
              Je signale un problème
            </h3>
            <p className="text-xs font-medium text-amber-100 leading-relaxed mb-4">
              Caniveau bouché, éclairage défaillant, insalubrité : alertez directement les services municipaux.
            </p>
          </div>
          <button
            id="action-report-problem"
            onClick={() => setActiveModal('problem')}
            className="w-full py-3 px-4 bg-white text-amber-900 hover:bg-amber-50 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <span>Faire un signalement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Action 3 : Je découvre les initiatives */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-gradient-to-br from-[#38B6FF] to-[#1294dc] rounded-3xl p-6 text-[#08233C] shadow-md flex flex-col justify-between border border-[#1b9fe9]"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#08233C] text-[#38B6FF] flex items-center justify-center mb-4 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold leading-tight mb-1 text-[#08233C]">
              Je découvre les initiatives
            </h3>
            <p className="text-xs font-semibold text-[#08233C]/80 leading-relaxed mb-4">
              Explorez les projets concrets portés par les jeunes et les femmes du projet Lab'Citoyen.
            </p>
          </div>
          <button
            id="action-discover-initiatives"
            onClick={() => setActiveTab('initiatives')}
            className="w-full py-3 px-4 bg-[#08233C] text-white hover:bg-[#0B3B60] rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Voir toutes les initiatives</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* 6.1 Chiffres Clés de la Plateforme */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-6 text-center">
          Impact en temps réel sur le District de Bamako
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="block text-3xl sm:text-4xl font-extrabold text-[#08233C] mb-1">
              6
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Communes couvertes
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="block text-3xl sm:text-4xl font-extrabold text-[#38B6FF] mb-1">
              {initiatives.length}+
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Initiatives accompagnées
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="block text-3xl sm:text-4xl font-extrabold text-[#FADB58] text-stroke mb-1">
              {contributions.length + 138}
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Contributions citoyennes reçues
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-600 mb-1">
              92%
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Taux de transmission mairie
            </span>
          </div>
        </div>
      </section>

      {/* 6.1 Initiatives Mises en Avant */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#08233C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FADB58]" />
              Initiatives des jeunes & des femmes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Des projets concrets qui changent la vie dans les quartiers de Bamako.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('initiatives')}
            className="text-xs sm:text-sm font-bold text-[#0B3B60] hover:text-[#38B6FF] flex items-center gap-1 cursor-pointer"
          >
            <span>Tout voir</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredInitiatives.map((init) => {
            const commune = communes.find(c => c.id === init.communeId);
            return (
              <div
                key={init.id}
                onClick={() => openInitiativeById(init.id)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={init.coverImage}
                    alt={init.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {init.domain}
                  </span>
                  <span className="absolute bottom-3 left-3 bg-[#08233C]/80 text-white backdrop-blur-xs text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FADB58]" />
                    {commune?.name}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#08233C] group-hover:text-[#38B6FF] transition-colors line-clamp-2 mb-2">
                      {init.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {init.solution}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Par <strong>{init.ownerName}</strong>
                    </span>
                    <span className="text-[#0B3B60] font-bold flex items-center gap-0.5">
                      En savoir plus <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6.1 Dernières Actualités */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#08233C] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#38B6FF]" />
              Dernières actualités de la plateforme
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Annonces des mairies et comptes-rendus des porteurs de projets.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('actualites')}
            className="text-xs sm:text-sm font-bold text-[#0B3B60] hover:text-[#38B6FF] flex items-center gap-1 cursor-pointer"
          >
            <span>Fil d'actualités</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentNews.map((news) => {
            const commune = communes.find(c => c.id === news.communeId);
            return (
              <div
                key={news.id}
                onClick={() => openPublicationById(news.id)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={news.coverImage}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-[#08233C]/85 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded">
                    {commune?.name}
                  </span>
                  {news.format === 'video' && (
                    <span className="absolute bottom-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      ▶ Vidéo
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      {news.date}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#08233C] group-hover:text-[#38B6FF] transition-colors line-clamp-2 mb-1.5">
                      {news.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {news.metaDescription}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 text-[11px] font-bold text-[#0B3B60] flex items-center gap-1">
                    Lire la publication <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
