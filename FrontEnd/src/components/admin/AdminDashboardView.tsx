import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar, AdminTabId } from './AdminSidebar';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminPorteursTab } from './AdminPorteursTab';
import { AdminContributionsTab } from './AdminContributionsTab';
import { AdminPublicationsTab } from './AdminPublicationsTab';
import { Menu, Sparkles, Globe, LogOut } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AdminTabId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { activeUser, setActiveTab, logout } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased text-slate-800">
      {/* Sidebar Component (Desktop persistent + Mobile drawer) */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Top App Bar (Only visible on small screens to open sidebar) */}
        <header className="lg:hidden bg-[#062326] text-white px-4 py-3 border-b border-[#0E3A3E] flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-teal-300 hover:text-white cursor-pointer"
              aria-label="Ouvrir le menu d'administration"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-[#062326] flex items-center justify-center font-black text-xs">
                IS
              </div>
              <span className="font-black text-sm text-white tracking-wide">INNOVSAHEL</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">
                ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('accueil')}
              className="px-2.5 py-1 rounded-lg bg-white/10 text-teal-200 text-xs font-bold hover:bg-white/20 transition-colors flex items-center gap-1 cursor-pointer"
              title="Aller sur l'espace citoyen"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plateforme</span>
            </button>

            <button
              onClick={logout}
              className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardTab onNavigateTab={(tab) => setCurrentTab(tab)} />
          )}
          {currentTab === 'porteurs' && (
            <AdminPorteursTab />
          )}
          {currentTab === 'contributions' && (
            <AdminContributionsTab />
          )}
          {currentTab === 'publications' && (
            <AdminPublicationsTab />
          )}
        </main>
      </div>
    </div>
  );
};
