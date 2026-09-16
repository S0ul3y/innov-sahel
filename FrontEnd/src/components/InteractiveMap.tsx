import React, { useState } from 'react';
import { Commune } from '../types';
import { MapPin, Navigation, Compass, Layers, Phone, Clock, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  commune: Commune;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ commune }) => {
  const [useFallbackMap, setUseFallbackMap] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(1);

  // External GPS navigation URL (Google Maps or OpenStreetMap)
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${commune.coordinates.lat},${commune.coordinates.lng}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Map Header Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#38B6FF]/20 text-[#0B3B60]">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-[#08233C]">
              Localisation & Mairie • {commune.name}
            </h4>
            <p className="text-[11px] text-slate-500">
              Coordonnées GPS : {commune.coordinates.lat.toFixed(4)}° N, {commune.coordinates.lng.toFixed(4)}° O
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Fallback switch (Exigence 6.2.3 & 9.2: Faible bande passante) */}
          <button
            onClick={() => setUseFallbackMap(!useFallbackMap)}
            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#0B3B60] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Basculer entre la vue interactive et le plan statique faible débit"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{useFallbackMap ? 'Afficher carte interactive' : 'Mode faible débit (statique)'}</span>
          </button>

          {/* Navigation Button */}
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FADB58] text-[#08233C] hover:bg-[#ebd048] flex items-center gap-1.5 transition-colors shadow-xs"
            title="Ouvrir l'itinéraire sur votre téléphone"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>Itinéraire vers la Mairie</span>
          </a>
        </div>
      </div>

      {/* Map Canvas / Display Area */}
      <div className="relative h-64 sm:h-80 w-full bg-[#E2E8F0] overflow-hidden select-none">
        {useFallbackMap ? (
          /* Static lightweight fallback map as demanded in 6.2.3 */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#38B6FF]/20 flex items-center justify-center text-[#0B3B60] mb-3">
              <MapPin className="w-8 h-8 text-[#0B3B60]" />
            </div>
            <h5 className="font-bold text-slate-800 text-base mb-1">
              Plan simplifié (Économie de données)
            </h5>
            <p className="text-xs text-slate-600 max-w-md mb-4">
              Mairie de la {commune.name} située à {commune.townHallAddress}. Ce mode statique garantit un affichage instantané même en connexion 3G ou Edge.
            </p>
            <a
              href={navUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0B3B60] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:bg-[#08233C]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir l'application GPS de votre téléphone
            </a>
          </div>
        ) : (
          /* Interactive Bamako District Map with Niger River & Communes */
          <div className="w-full h-full relative flex items-center justify-center bg-[#F1F5F9]">
            {/* Background Map Grid & Rivers */}
            <svg 
              className="w-full h-full object-cover" 
              viewBox="0 0 800 500" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: `scale(${mapZoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
            >
              {/* Ground districts shapes */}
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0B3B60" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Background terrain */}
              <rect width="800" height="500" fill="#EAEFF5" />

              {/* District of Bamako border contour */}
              <path
                d="M 120,90 Q 240,40 450,70 T 720,120 Q 760,250 710,380 T 480,460 Q 260,470 120,400 T 80,240 Z"
                fill="#F8FAFC"
                stroke="#CBD5E1"
                strokeWidth="2"
              />

              {/* Fleuve Niger (Winding river through Bamako) */}
              <path
                d="M 80,310 C 200,320 280,350 400,290 C 520,230 620,220 740,240"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="38"
                strokeLinecap="round"
              />
              <text x="560" y="246" fill="#0B3B60" fontSize="13" fontWeight="bold" opacity="0.7">
                Fleuve Niger
              </text>

              {/* Rive Gauche: Commune I, II, III, IV */}
              {/* Commune IV */}
              <path
                d="M 140,160 L 260,150 L 290,290 L 140,290 Z"
                fill={commune.id === 'c4' ? '#FADB58' : '#FFFFFF'}
                fillOpacity={commune.id === 'c4' ? 0.75 : 0.6}
                stroke={commune.id === 'c4' ? '#08233C' : '#94A3B8'}
                strokeWidth={commune.id === 'c4' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="180" y="220" fontSize="13" fontWeight="700" fill="#08233C">Commune IV</text>

              {/* Commune III */}
              <path
                d="M 260,150 L 370,140 L 370,270 L 290,290 Z"
                fill={commune.id === 'c3' ? '#FADB58' : '#FFFFFF'}
                fillOpacity={commune.id === 'c3' ? 0.75 : 0.6}
                stroke={commune.id === 'c3' ? '#08233C' : '#94A3B8'}
                strokeWidth={commune.id === 'c3' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="285" y="210" fontSize="13" fontWeight="700" fill="#08233C">Commune III</text>

              {/* Commune II */}
              <path
                d="M 370,140 L 480,130 L 460,250 L 370,270 Z"
                fill={commune.id === 'c2' ? '#FADB58' : '#FFFFFF'}
                fillOpacity={commune.id === 'c2' ? 0.75 : 0.6}
                stroke={commune.id === 'c2' ? '#08233C' : '#94A3B8'}
                strokeWidth={commune.id === 'c2' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="390" y="200" fontSize="13" fontWeight="700" fill="#08233C">Commune II</text>

              {/* Commune I */}
              <path
                d="M 480,130 L 680,150 L 640,230 L 460,250 Z"
                fill={commune.id === 'c1' ? '#FADB58' : '#FFFFFF'}
                fillOpacity={commune.id === 'c1' ? 0.75 : 0.6}
                stroke={commune.id === 'c1' ? '#08233C' : '#94A3B8'}
                strokeWidth={commune.id === 'c1' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="530" y="190" fontSize="13" fontWeight="700" fill="#08233C">Commune I</text>

              {/* Rive Droite: Commune V, VI */}
              {/* Commune V */}
              <path
                d="M 220,330 L 440,320 L 420,440 L 220,430 Z"
                fill={commune.id === 'c5' ? '#FADB58' : '#FFFFFF'}
                fillOpacity={commune.id === 'c5' ? 0.75 : 0.6}
                stroke={commune.id === 'c5' ? '#08233C' : '#94A3B8'}
                strokeWidth={commune.id === 'c5' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="300" y="380" fontSize="13" fontWeight="700" fill="#08233C">Commune V</text>

              {/* Commune VI */}
              <path
                d="M 440,320 L 700,260 L 680,450 L 420,440 Z"
                fill={commune.id === 'c6' ? '#FADB58' : '#FFFFFF'}
                fillOpacity={commune.id === 'c6' ? 0.75 : 0.6}
                stroke={commune.id === 'c6' ? '#08233C' : '#94A3B8'}
                strokeWidth={commune.id === 'c6' ? '3' : '1.5'}
                className="transition-all"
              />
              <text x="520" y="370" fontSize="13" fontWeight="700" fill="#08233C">Commune VI</text>

              {/* Bridges (Ponts de Bamako) */}
              <line x1="360" y1="270" x2="330" y2="330" stroke="#08233C" strokeWidth="4" strokeDasharray="2,2" />
              <text x="310" y="295" fontSize="10" fill="#475569" fontWeight="bold">Pont des Martyrs</text>

              <line x1="410" y1="260" x2="380" y2="320" stroke="#08233C" strokeWidth="4" strokeDasharray="2,2" />
              <text x="415" y="285" fontSize="10" fill="#475569" fontWeight="bold">Pont Roi Fahd</text>

              <line x1="470" y1="250" x2="450" y2="320" stroke="#08233C" strokeWidth="4" strokeDasharray="2,2" />
              <text x="475" y="310" fontSize="10" fill="#475569" fontWeight="bold">3e Pont</text>

              {/* Town Hall Pin (Mairie Marker) */}
              {commune.id === 'c1' && (
                <g transform="translate(560, 180)">
                  <circle r="18" fill="#FADB58" opacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#08233C" />
                  <circle r="6" fill="#FADB58" />
                  <rect x="-60" y="-38" width="120" height="24" rx="6" fill="#08233C" />
                  <text x="0" y="-22" fill="#FADB58" fontSize="11" fontWeight="bold" textAnchor="middle">Mairie C1</text>
                </g>
              )}
              {commune.id === 'c2' && (
                <g transform="translate(420, 190)">
                  <circle r="18" fill="#FADB58" opacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#08233C" />
                  <circle r="6" fill="#FADB58" />
                  <rect x="-60" y="-38" width="120" height="24" rx="6" fill="#08233C" />
                  <text x="0" y="-22" fill="#FADB58" fontSize="11" fontWeight="bold" textAnchor="middle">Mairie C2</text>
                </g>
              )}
              {commune.id === 'c3' && (
                <g transform="translate(320, 200)">
                  <circle r="18" fill="#FADB58" opacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#08233C" />
                  <circle r="6" fill="#FADB58" />
                  <rect x="-60" y="-38" width="120" height="24" rx="6" fill="#08233C" />
                  <text x="0" y="-22" fill="#FADB58" fontSize="11" fontWeight="bold" textAnchor="middle">Mairie C3</text>
                </g>
              )}
              {commune.id === 'c4' && (
                <g transform="translate(200, 210)">
                  <circle r="18" fill="#FADB58" opacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#08233C" />
                  <circle r="6" fill="#FADB58" />
                  <rect x="-60" y="-38" width="120" height="24" rx="6" fill="#08233C" />
                  <text x="0" y="-22" fill="#FADB58" fontSize="11" fontWeight="bold" textAnchor="middle">Mairie C4</text>
                </g>
              )}
              {commune.id === 'c5' && (
                <g transform="translate(330, 360)">
                  <circle r="18" fill="#FADB58" opacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#08233C" />
                  <circle r="6" fill="#FADB58" />
                  <rect x="-60" y="-38" width="120" height="24" rx="6" fill="#08233C" />
                  <text x="0" y="-22" fill="#FADB58" fontSize="11" fontWeight="bold" textAnchor="middle">Mairie C5</text>
                </g>
              )}
              {commune.id === 'c6' && (
                <g transform="translate(540, 350)">
                  <circle r="18" fill="#FADB58" opacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#08233C" />
                  <circle r="6" fill="#FADB58" />
                  <rect x="-60" y="-38" width="120" height="24" rx="6" fill="#08233C" />
                  <text x="0" y="-22" fill="#FADB58" fontSize="11" fontWeight="bold" textAnchor="middle">Mairie C6</text>
                </g>
              )}
            </svg>

            {/* Map zoom controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-1 shadow-xs">
              <button
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded text-sm cursor-pointer"
                title="Zoomer"
              >
                +
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded text-sm cursor-pointer"
                title="Dézoomer"
              >
                -
              </button>
            </div>

            {/* Float badge indicator */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FADB58] border border-[#08233C]" />
              <span className="text-xs font-bold text-[#08233C]">
                Hôtel de Ville / Mairie centrale de la {commune.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Practical Town Hall details bar */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#38B6FF] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700 block">Adresse de la mairie :</span>
            <span className="text-slate-600">{commune.townHallAddress}</span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="w-4 h-4 text-[#38B6FF] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700 block">Téléphone direct :</span>
            <a href={`tel:${commune.townHallPhone.replace(/\s+/g, '')}`} className="text-[#0B3B60] font-bold hover:underline">
              {commune.townHallPhone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-[#38B6FF] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-700 block">Horaires de réception :</span>
            <span className="text-slate-600">{commune.openingHours}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
