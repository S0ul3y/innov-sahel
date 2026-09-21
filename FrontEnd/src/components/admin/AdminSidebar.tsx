import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Newspaper,
  Globe,
  LogOut,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  X,
  Crown,
  Layers,
  Star,
} from 'lucide-react';
import { isSuperAdmin, isPlatformAdmin, isPorteur, getRoleLabel, getRoleBadgeColor } from '../../models/auth.model';

export type AdminTabId =
  | 'dashboard'
  | 'admins'
  | 'porteurs'
  | 'contributions'
  | 'publications'
  | 'mon-initiative';

interface AdminSidebarProps {
  currentTab: AdminTabId;
  onSelectTab: (tab: AdminTabId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const {
    activeUser,
    logout,
    setActiveTab,
    contributions,
    comments,
  } = useApp();

  const reportedCommentsCount = comments.filter(c => c.reported).length;
  const newContributionsCount = contributions.filter(c => c.internalStatus === 'nouveau').length;

  const isSuper = isSuperAdmin(activeUser as any);
  const isPlatform = isPlatformAdmin(activeUser as any);
  const isPorteurUser = isPorteur(activeUser as any);

  // Onglets visibles selon le rôle
  const allNavItems = [
    {
      id: 'dashboard' as AdminTabId,
      label: 'Dashboard',
      description: isPorteurUser ? 'Stats de mon initiative' : 'Indicateurs & Statistiques',
      icon: LayoutDashboard,
      badge: null,
      visibleFor: ['super_admin', 'admin', 'porteur'],
    },
    {
      id: 'admins' as AdminTabId,
      label: 'Admins Platform',
      description: 'Gérer les administrateurs',
      icon: Crown,
      badge: null,
      visibleFor: ['super_admin'],
    },
    {
      id: 'porteurs' as AdminTabId,
      label: "Porteur d'initiatives",
      description: 'Gestion, incubation & comptes',
      icon: Users,
      badge: null,
      visibleFor: ['super_admin', 'admin'],
    },
    {
      id: 'contributions' as AdminTabId,
      label: 'Contributions citoyennes',
      description: 'Signalements & Idées reçues',
      icon: MessageSquare,
      badge: newContributionsCount > 0 ? `${newContributionsCount} nvx` : null,
      badgeColor: 'bg-red-500 text-white',
      visibleFor: ['super_admin', 'admin'],
    },
    {
      id: 'publications' as AdminTabId,
      label: 'Publications',
      description: 'Actualités, Mairies & Modération',
      icon: Newspaper,
      badge: reportedCommentsCount > 0 ? `${reportedCommentsCount} sign.` : null,
      badgeColor: 'bg-amber-400 text-[#062326]',
      visibleFor: ['super_admin', 'admin'],
    },
    {
      id: 'mon-initiative' as AdminTabId,
      label: 'Mon Initiative',
      description: 'Gérer mon projet & commentaires',
      icon: Star,
      badge: null,
      visibleFor: ['porteur'],
    },
  ];

  const userRole = (activeUser as any)?.role || 'porteur';
  const navItems = allNavItems.filter(item => item.visibleFor.includes(userRole));

  const roleLabel = getRoleLabel(activeUser as any);
  const roleBadgeColor = getRoleBadgeColor(activeUser as any);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#062326] text-white border-r border-[#0E3A3E] select-none overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain">
      {/* Top section: Brand Logo & Title */}
      <div className="p-6 border-b border-[#0E3A3E] flex items-center justify-between sticky top-0 bg-[#062326] z-10 flex-shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#062326] shadow-lg shadow-emerald-900/30">
            <Sparkles className="w-5 h-5 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-wide text-white">INNOVSAHEL</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-teal-300/70 font-medium">
              District de Bamako • 6 Communes
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-teal-300 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation list */}
      <div className="p-4 space-y-6 flex-shrink-0">
        <div>
          <span className="px-3 text-[10px] font-black uppercase tracking-widest text-teal-400/60 block mb-2">
            Menu Principal
          </span>
          <nav className="space-y-1.5" aria-label="Navigation administration">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left font-bold transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-[#062326] shadow-lg shadow-emerald-950/40 font-black'
                      : 'text-teal-100/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#062326]/20 text-[#062326]'
                        : 'bg-white/5 text-teal-300 group-hover:bg-white/10 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm block leading-tight">{item.label}</span>
                      <span className={`text-[10px] font-medium block leading-tight ${
                        isActive ? 'text-[#062326]/80' : 'text-teal-400/50'
                      }`}>
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {(item as any).badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${(item as any).badgeColor || 'bg-emerald-400 text-[#062326]'}`}>
                      {(item as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Platform Action */}
        <div className="pt-2 border-t border-[#0E3A3E]">
          <span className="px-3 text-[10px] font-black uppercase tracking-widest text-teal-400/60 block mb-2">
            Accès Public
          </span>
          <button
            id="admin-go-to-platform"
            onClick={() => setActiveTab('accueil')}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#092D30] hover:bg-[#0C3B3F] text-emerald-300 hover:text-emerald-200 border border-emerald-500/20 transition-all text-xs font-bold cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="block leading-tight text-white">Aller sur la plateforme</span>
                <span className="text-[10px] text-teal-300/70 block leading-tight">Espace citoyen Bamako</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom section: Profil Admin & Logout */}
      <div className="p-4 border-t border-[#0E3A3E] space-y-3 bg-[#041A1C] flex-shrink-0 mt-auto">
        {/* Carte profil */}
        <div className="p-3 rounded-2xl bg-[#092B2E] border border-teal-500/15 flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs ${
              isSuper ? 'bg-gradient-to-tr from-yellow-500 to-amber-400 text-[#062326]' :
              isPlatform ? 'bg-gradient-to-tr from-emerald-600 to-teal-400' :
              'bg-gradient-to-tr from-blue-600 to-cyan-400'
            }`}>
              {activeUser?.name?.charAt(0) || 'A'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#041A1C]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-extrabold text-xs text-white truncate block">
              {activeUser?.name || 'Administrateur'}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleBadgeColor}`}>
              {isSuper ? '👑 Super Admin' : isPlatform ? '🛡 Admin Platform' : '⭐ Porteur'}
            </span>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <button
          id="admin-logout-button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/20 font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
