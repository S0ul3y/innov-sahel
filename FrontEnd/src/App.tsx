/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Footer } from './components/Footer';

// Views
import { HomeView } from './components/views/HomeView';
import { CommuneView } from './components/views/CommuneView';
import { InitiativesView } from './components/views/InitiativesView';
import { NewsView } from './components/views/NewsView';
import { DashboardView } from './components/views/DashboardView';
import { AboutView } from './components/views/AboutView';
import { LoginView } from './components/views/LoginView';
import { PublicationDetailView } from './components/views/PublicationDetailView';
import { InitiativeDetailView } from './components/views/InitiativeDetailView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';

// Citizen Interactive Modals
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { IdeaModal } from './components/modals/IdeaModal';
import { ProblemModal } from './components/modals/ProblemModal';
import { PublishModal } from './components/modals/PublishModal';

import { motion, AnimatePresence } from 'motion/react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    activeModal, 
    selectedInitiative, 
    selectedPublication,
    currentUserRole
  } = useApp();

  // ISOLATION ESPACE ADMIN:
  // "Sur l'espace admin, on ne verra rien de ce qui concerne la plateforme comme les pages d'accueil et autre sur la navbar et tout autre sur l'espace citoyen."
  if (currentUserRole === 'admin' && activeTab === 'mon_espace' && !selectedPublication && !selectedInitiative) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AdminDashboardView />

        {/* Action Modals if triggered from admin actions */}
        {activeModal === 'confirmation' && <ConfirmationModal />}
        {activeModal === 'idea' && <IdeaModal />}
        {activeModal === 'problem' && <ProblemModal />}
        {activeModal === 'publish' && <PublishModal />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-[#FADB58] selection:text-[#08233C]">
      {/* Persistent Header with Responsive Navbar and Scrollable Hamburger Menu */}
      <Header />

      {/* Main Content Area - Full-Page Detail Views or Tab Navigation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {selectedPublication ? (
          <PublicationDetailView />
        ) : selectedInitiative ? (
          <InitiativeDetailView />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'accueil' && <HomeView />}
              {activeTab === 'ma_commune' && <CommuneView />}
              {activeTab === 'initiatives' && <InitiativesView />}
              {activeTab === 'actualites' && <NewsView />}
              {activeTab === 'mon_espace' && <DashboardView />}
              {activeTab === 'a_propos' && <AboutView />}
              {activeTab === 'connexion' && <LoginView />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Floating Action Button (Mobile & Desktop) */}
      <FloatingActionButton />

      {/* Citizen Action Modals (Forms only, detail views are now full-page) */}
      {activeModal === 'confirmation' && <ConfirmationModal />}
      {activeModal === 'idea' && <IdeaModal />}
      {activeModal === 'problem' && <ProblemModal />}
      {activeModal === 'publish' && <PublishModal />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
