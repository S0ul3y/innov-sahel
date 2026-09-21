import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    communes, 
    setSelectedCommuneId, 
    currentUserRole
  } = useApp();

  const isConnected = currentUserRole === 'admin' || currentUserRole === 'super_admin' || currentUserRole === 'porteur';

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08233C] text-white border-t border-[#0B3B60] mt-12 pb-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Presentation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FADB58] to-[#e6c433] flex items-center justify-center font-black text-[#08233C] text-lg shadow-sm">
                IS
              </div>
              <div>
                <span className="font-black text-lg tracking-tight text-white block leading-none">
                  InnovSahel
                </span>
                <span className="text-[10px] uppercase font-bold text-[#FADB58] tracking-wider">
                  Lab'Citoyen Bamako
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Plateforme citoyenne inclusive portée par l'ONG IMPACT SAHEL en partenariat avec les 6 mairies du District de Bamako.
            </p>
            <div className="pt-1 text-[11px] text-[#38B6FF] font-medium">
              « S'informer. Participer. Proposer. »
            </div>
          </div>

          {/* Col 2: Accès Rapide Communes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FADB58]">
              Les 6 Communes de Bamako
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
              {communes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCommuneId(c.id);
                    goTo(`/ma-commune/${c.id}`);
                  }}
                  className="text-left py-1 hover:text-[#38B6FF] transition-colors cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Navigation & Rubriques */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FADB58]">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => goTo('/accueil')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => goTo('/ma-commune')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ma Commune &amp; Mairie
                </button>
              </li>
              <li>
                <button
                  onClick={() => goTo('/initiatives')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Initiatives jeunes &amp; femmes
                </button>
              </li>
              <li>
                <button
                  onClick={() => goTo('/actualites')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fil d'actualités
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (currentUserRole === 'admin' || currentUserRole === 'super_admin') {
                      goTo('/admin');
                    } else if (isConnected) {
                      goTo('/mon-espace');
                    } else {
                      goTo('/connexion');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isConnected ? 'Mon Espace (Gestion)' : 'Espace Gestion (Admin / Porteur)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => goTo('/a-propos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  À propos &amp; Partenaires
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Permanence Citoyenne */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FADB58]">
              Permanence &amp; Contact
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Coordination générale InnovSahel et points relais dans les 6 mairies du District de Bamako.
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38B6FF] shrink-0" />
                <span>District de Bamako, Mali</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FADB58] shrink-0" />
                <span>contact@innovsahel.ml</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>+223 20 22 00 00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} InnovSahel • ONG IMPACT SAHEL • Tous droits réservés.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Bamako, Mali</span>
            <span>•</span>
            <button
              onClick={() => goTo('/a-propos')}
              className="hover:underline text-slate-300"
            >
              Protection des données &amp; Charte
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
