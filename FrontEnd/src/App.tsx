/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
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

import { ErrorBoundary } from './components/shared/ErrorBoundary';

/** Layout citoyen permanent : Header + contenu + Footer + modals */
const CitizenLayout: React.FC = () => {
  const { activeModal, confirmationData } = useApp();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-[#FADB58] selection:text-[#08233C]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <ErrorBoundary key={location.pathname}>
          <div key={location.pathname} className="animate-in fade-in duration-150">
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>

      <Footer />
      <FloatingActionButton />

      {/* Modals citoyens */}
      {(activeModal === 'confirmation' || !!confirmationData) && <ConfirmationModal />}
      {activeModal === 'idea' && <IdeaModal />}
      {activeModal === 'problem' && <ProblemModal />}
      {activeModal === 'publish' && <PublishModal />}
    </div>
  );
};

/** Layout admin : espace administratif isolé */
const AdminLayout: React.FC = () => {
  const { activeModal, confirmationData } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ErrorBoundary fallbackTitle="Une erreur est survenue dans le tableau de bord administrateur">
        <AdminDashboardView />
      </ErrorBoundary>

      {/* Modals éventuellement déclenchés depuis l'admin */}
      {(activeModal === 'confirmation' || !!confirmationData) && <ConfirmationModal />}
      {activeModal === 'idea' && <IdeaModal />}
      {activeModal === 'problem' && <ProblemModal />}
      {activeModal === 'publish' && <PublishModal />}
    </div>
  );
};

/** Guard : redirige vers /connexion si non authentifié (admin, super_admin ou porteur) */
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUserRole } = useApp();
  if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin' && currentUserRole !== 'porteur') {
    return <Navigate to="/connexion" replace />;
  }
  return <>{children}</>;
};

/** Guard : redirige vers /connexion si non connecté */
const PorteurGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUserRole } = useApp();
  if (currentUserRole === 'visitor') {
    return <Navigate to="/connexion" replace />;
  }
  return <Navigate to="/admin" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirection racine */}
      <Route path="/" element={<Navigate to="/accueil" replace />} />

      {/* Pages citoyennes publiques sous le CitizenLayout permanent */}
      <Route element={<CitizenLayout />}>
        <Route path="/accueil" element={<HomeView />} />
        <Route path="/connexion" element={<LoginView />} />
        <Route path="/a-propos" element={<AboutView />} />

        {/* Ma Commune : avec ou sans ID de commune */}
        <Route path="/ma-commune" element={<CommuneView />} />
        <Route path="/ma-commune/:id" element={<CommuneView />} />

        {/* Initiatives : liste et détail */}
        <Route path="/initiatives" element={<InitiativesView />} />
        <Route path="/initiatives/:id" element={<InitiativeDetailView />} />

        {/* Actualités : liste et détail */}
        <Route path="/actualites" element={<NewsView />} />
        <Route path="/actualites/:id" element={<PublicationDetailView />} />
        {/* Alias pour compatibilité */}
        <Route path="/publications/:id" element={<PublicationDetailView />} />

        {/* Mon Espace Porteur d'initiative (redirection vers l'espace admin unifié) */}
        <Route
          path="/mon-espace"
          element={
            <PorteurGuard>
              <Navigate to="/admin" replace />
            </PorteurGuard>
          }
        />
      </Route>

      {/* Espace Admin (isolé, sans layout citoyen) */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      />

      {/* Fallback 404 → accueil */}
      <Route path="*" element={<Navigate to="/accueil" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
