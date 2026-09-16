import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Newspaper, 
  MapPin, 
  User, 
  Calendar, 
  Share2, 
  Images, 
  Video, 
  Eye, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';

export const NewsView: React.FC = () => {
  const { 
    publications, 
    communes, 
    openPublicationById, 
    currentUserRole, 
    setActiveModal 
  } = useApp();

  const [communeFilter, setCommuneFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'commune_news' | 'initiative_update'>('all');

  const filteredNews = publications.filter(pub => {
    const matchesCommune = communeFilter === 'all' || pub.communeId === communeFilter;
    const matchesType = typeFilter === 'all' || pub.type === typeFilter;
    return matchesCommune && matchesType;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Fil d'actualité citoyen
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Actualités & Événements à Bamako
          </h1>
          <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-medium">
            Toutes les nouvelles en direct : annonces officielles des six mairies et avancées sur le terrain des initiatives du Lab'Citoyen.
          </p>

          {(currentUserRole === 'admin' || currentUserRole === 'porteur') && (
            <div className="mt-4">
              <button
                onClick={() => setActiveModal('publish')}
                className="inline-flex items-center gap-2 bg-[#FADB58] text-[#08233C] font-bold px-4 py-2 rounded-xl text-xs sm:text-sm hover:bg-[#ebd048] transition-colors cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier une nouvelle</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6.4 Filtres simples : Commune et Type */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Type selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'all' ? 'bg-[#08233C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes les actualités
          </button>
          <button
            onClick={() => setTypeFilter('commune_news')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'commune_news' ? 'bg-[#08233C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mairies & IMPACT SAHEL
          </button>
          <button
            onClick={() => setTypeFilter('initiative_update')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              typeFilter === 'initiative_update' ? 'bg-[#08233C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Avancement des initiatives
          </button>
        </div>

        {/* Commune dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Commune :</span>
          <select
            value={communeFilter}
            onChange={(e) => setCommuneFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] cursor-pointer"
          >
            <option value="all">Toutes les communes</option>
            {communes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* News Stream List */}
      <section className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
            Aucune actualité ne correspond à ces critères de filtrage.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNews.map((pub) => {
              const commune = communes.find(c => c.id === pub.communeId);
              return (
                <article
                  key={pub.id}
                  onClick={() => openPublicationById(pub.id)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#38B6FF] transition-all cursor-pointer flex flex-col group"
                >
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={pub.coverImage}
                      alt={pub.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-xs ${
                        pub.type === 'commune_news' ? 'bg-[#08233C] text-white' : 'bg-[#FADB58] text-[#08233C]'
                      }`}>
                        {pub.type === 'commune_news' ? 'Actualité Mairie' : 'Projet citoyen'}
                      </span>

                      <span className="bg-black/60 text-white backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                        {pub.format === 'video' ? (
                          <>
                            <Video className="w-3 h-3 text-red-400" />
                            <span>Vidéo</span>
                          </>
                        ) : (
                          <>
                            <Images className="w-3 h-3 text-[#38B6FF]" />
                            <span>Carrousel</span>
                          </>
                        )}
                      </span>
                    </div>

                    <span className="absolute bottom-3 left-3 bg-[#08233C]/80 text-white backdrop-blur-xs text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FADB58]" />
                      {commune?.name}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
                        <span>{pub.date}</span>
                        <span>•</span>
                        <span>Par {pub.authorName}</span>
                      </div>

                      <h2 className="font-extrabold text-base sm:text-lg text-[#08233C] group-hover:text-[#38B6FF] transition-colors leading-snug mb-2 line-clamp-2">
                        {pub.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {pub.metaDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B3B60]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{pub.viewsCount} lectures</span>
                      </span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Consulter l'article <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
