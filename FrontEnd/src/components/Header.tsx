import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';
import { 
  Home, 
  Building2, 
  Sparkles, 
  Newspaper, 
  User, 
  Info, 
  ShieldCheck, 
  LogIn,
  LogOut,
  Menu,
  X,
  PlusCircle,
  AlertTriangle,
  Lightbulb,
  ChevronRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedCommuneId, 
    setSelectedCommuneId, 
    communes,
    currentUserRole,
    activeUser,
    logout,
    textSize,
    setTextSize,
    setActiveModal
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Base navigation items: Accueil, Ma Commune, Nos Initiatives, Actualités, À propos
  const baseNavItems: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'accueil', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { id: 'ma_commune', label: 'Ma Commune', icon: <Building2 className="w-4 h-4" /> },
    { id: 'initiatives', label: 'Nos Initiatives', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'actualites', label: 'Actualités', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'a_propos', label: 'À propos', icon: <Info className="w-4 h-4" /> },
  ];

  // If connected as Admin or Porteur, add "Mon Espace"
  const isConnected = currentUserRole === 'admin' || currentUserRole === 'porteur';
  const navItems = isConnected
    ? [
        ...baseNavItems,
        { 
          id: 'mon_espace' as TabType, 
          label: 'Mon Espace', 
          icon: currentUserRole === 'admin' ? <ShieldCheck className="w-4 h-4 text-[#FADB58]" /> : <User className="w-4 h-4 text-[#38B6FF]" /> 
        }
      ]
    : baseNavItems;

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Brand Bar */}
      <div className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#FADB58] text-[#08233C] px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide">
              IMPACT SAHEL
            </span>
            <span className="hidden sm:inline text-slate-200">
              Projet Lab'Citoyen • District de Bamako
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-[#FADB58] font-medium hidden md:inline">
              « S'informer. Participer. Proposer. »
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Accessibility: Text Size Toggles */}
            <div className="flex items-center bg-white/10 rounded-md p-0.5 border border-white/15" title="Agrandir ou réduire la taille du texte">
              <button 
                id="text-size-normal-btn"
                onClick={() => setTextSize(textSize === 'xlarge' ? 'large' : 'normal')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${textSize === 'normal' ? 'bg-white/20 text-white' : 'text-slate-300 hover:text-white'}`}
                title="Taille normale"
                aria-label="Taille de texte normale"
              >
                A
              </button>
              <button 
                id="text-size-large-btn"
                onClick={() => setTextSize('large')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${textSize === 'large' ? 'bg-[#FADB58] text-[#08233C]' : 'text-slate-300 hover:text-white'}`}
                title="Grand texte"
                aria-label="Grand texte"
              >
                A+
              </button>
              <button 
                id="text-size-xlarge-btn"
                onClick={() => setTextSize('xlarge')} 
                className={`px-1.5 py-0.5 rounded text-[12px] font-extrabold transition-colors cursor-pointer ${textSize === 'xlarge' ? 'bg-[#FADB58] text-[#08233C]' : 'text-slate-300 hover:text-white'}`}
                title="Très grand texte"
                aria-label="Très grand texte"
              >
                A++
              </button>
            </div>

            {/* If connected: display user status in top bar (Desktop) */}
            {isConnected ? (
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-md px-2 py-0.5 border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-200 font-semibold truncate max-w-[140px]">
                  {currentUserRole === 'admin' ? '🛡️ Admin IMPACT SAHEL' : `👩🏾 ${activeUser.name || 'Porteur'}`}
                </span>
                <button
                  id="top-logout-btn"
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-[#FADB58] hover:underline ml-1 cursor-pointer"
                  title="Déconnexion"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <span className="hidden sm:inline text-[11px] text-slate-300 font-medium">
                Plateforme ouverte • Accès citoyen libre
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo & Name */}
          <button 
            id="brand-logo-button"
            onClick={() => handleNavClick('accueil')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#38B6FF] via-[#0B3B60] to-[#08233C] p-0.5 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#08233C] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute -right-2 -bottom-2 w-6 h-6 rounded-full bg-[#FADB58]/30 blur-xs" />
                <span className="font-extrabold text-white text-lg tracking-wider">
                  IS
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#08233C]">
                  Innov<span className="text-[#38B6FF]">Sahel</span>
                </span>
                <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  Bamako
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
                Plateforme citoyenne & initiatives jeunes & femmes
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (Large Screens) - Fluid and responsive without overflow */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#38B6FF]/15 text-[#0B3B60] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-[#08233C] hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-[#0B3B60]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Authentication Button: Login or Logout */}
            <div className="ml-1 xl:ml-2 pl-2 border-l border-slate-200 flex items-center">
              {isConnected ? (
                <button
                  id="desktop-logout-button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors whitespace-nowrap cursor-pointer"
                  title="Quitter l'espace gestion et revenir en mode citoyen"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              ) : (
                <button
                  id="desktop-login-button"
                  onClick={() => handleNavClick('connexion')}
                  className={`flex items-center gap-1.5 px-3 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all shadow-xs whitespace-nowrap cursor-pointer ${
                    activeTab === 'connexion'
                      ? 'bg-[#08233C] text-white'
                      : 'bg-[#08233C] hover:bg-[#0B3B60] text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FADB58]" />
                  <span>Connexion</span>
                </button>
              )}
            </div>
          </nav>

          {/* Right Action Icons on Small Screens (Hamburger Menu Button) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Compact Login/Logout status button on mobile */}
            {isConnected ? (
              <button
                id="mobile-header-espace-badge"
                onClick={() => handleNavClick('mon_espace')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#38B6FF]/15 text-[#08233C] text-xs font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B3B60]" />
                <span className="hidden sm:inline">Mon Espace</span>
              </button>
            ) : (
              <button
                id="mobile-header-login-btn"
                onClick={() => handleNavClick('connexion')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#08233C] text-white text-xs font-bold shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FADB58]" />
                <span>Connexion</span>
              </button>
            )}

            {/* Hamburger Toggle Button */}
            <button
              id="mobile-hamburger-button"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#08233C] focus:outline-none transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#08233C]" />
              ) : (
                <Menu className="w-6 h-6 text-[#08233C]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Mobile Menu Sidebar Drawer taking the full height of the page */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Darkened Backdrop overlay to close when clicking outside */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Full-Height Sidebar Drawer */}
          <div 
            id="mobile-hamburger-drawer"
            className="relative w-full max-w-sm sm:max-w-md bg-white h-screen max-h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
          >
            {/* Sidebar Top Header with Brand and Close Button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/80 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#08233C] flex items-center justify-center text-[#FADB58] font-black text-base shadow-xs">
                  IS
                </div>
                <div>
                  <span className="font-extrabold text-[#08233C] text-sm block leading-none">
                    INNOVSAHEL
                  </span>
                  <span className="text-[10px] text-[#38B6FF] font-bold tracking-wider uppercase">
                    District de Bamako
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#08233C] transition-colors cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5 text-[#08233C]" />
              </button>
            </div>

            {/* Sidebar Body with Vertical Scrolling taking all remaining height */}
            <div 
              className="flex-1 overflow-y-auto px-5 py-5 space-y-4 overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Quick Commune Selector in Hamburger */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label htmlFor="mobile-commune-select" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-4 h-4 text-[#38B6FF]" />
                  Territoire communal actif :
                </label>
                <select
                  id="mobile-commune-select"
                  value={selectedCommuneId}
                  onChange={(e) => setSelectedCommuneId(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-sm font-bold text-[#08233C] p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38B6FF]/30 cursor-pointer"
                >
                  {communes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.neighborhoods.slice(0, 3).join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Nav Links */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                  Navigation principale
                </span>

                {/* All regular items */}
                {baseNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-menu-item-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#38B6FF]/15 text-[#0B3B60] font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white text-[#0B3B60]' : 'text-slate-400'}`}>
                          {item.icon}
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}

                {/* Only show "Mon Espace" in hamburger if connected */}
                {isConnected && (
                  <button
                    id="mobile-menu-item-mon_espace"
                    onClick={() => handleNavClick('mon_espace')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                      activeTab === 'mon_espace'
                        ? 'bg-[#08233C] text-[#FADB58]'
                        : 'bg-blue-50 text-[#08233C] hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white/20 text-[#FADB58]">
                        {currentUserRole === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <span>Mon Espace ({currentUserRole === 'admin' ? 'Admin' : 'Porteur'})</span>
                        <p className="text-[11px] opacity-80 font-normal">Tableau de bord de gestion</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Citizen Actions */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-2">
                  Actions citoyennes
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="mobile-menu-btn-idea"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveModal('idea');
                    }}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Proposer idée</span>
                  </button>

                  <button
                    id="mobile-menu-btn-problem"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setActiveModal('problem');
                    }}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Signaler souci</span>
                  </button>
                </div>
              </div>

              {/* Authentication Footer in Drawer */}
              <div className="pt-3 border-t border-slate-200 pb-6">
                {isConnected ? (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#08233C] truncate">
                        {activeUser.name || 'Utilisateur'}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {currentUserRole === 'admin' ? '🛡️ Administrateur IMPACT SAHEL' : '👩🏾 Porteur d’initiative'}
                      </p>
                    </div>
                    <button
                      id="mobile-drawer-logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                ) : (
                  <button
                    id="mobile-drawer-login-btn"
                    onClick={() => handleNavClick('connexion')}
                    className="w-full py-3 px-4 rounded-xl bg-[#08233C] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-[#0B3B60] transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-[#FADB58]" />
                    <span>Connexion Espace Gestion</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
