/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

/** Layout citoyen : Header + contenu animé + Footer + modals */
const CitizenLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeModal } = useApp();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-[#FADB58] selection:text-[#08233C]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <FloatingActionButton />

      {/* Modals citoyens */}
      {activeModal === 'confirmation' && <ConfirmationModal />}
      {activeModal === 'idea' && <IdeaModal />}
      {activeModal === 'problem' && <ProblemModal />}
      {activeModal === 'publish' && <PublishModal />}
    </div>
  );
};

/** Layout admin : pas de Header/Footer citoyen */
const AdminLayout: React.FC = () => {
  const { activeModal } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminDashboardView />

      {/* Modals éventuellement déclenchés depuis l'admin */}
      {activeModal === 'confirmation' && <ConfirmationModal />}
      {activeModal === 'idea' && <IdeaModal />}
      {activeModal === 'problem' && <ProblemModal />}
      {activeModal === 'publish' && <PublishModal />}
    </div>
  );
};

/** Guard : redirige vers /connexion si non authentifié en tant qu'admin */
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUserRole } = useApp();
  if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
    return <Navigate to="/connexion" replace />;
  }
  return <>{children}</>;
};

/** Guard : redirige vers /connexion si non connecté (porteur ou admin) */
const PorteurGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUserRole } = useApp();
  if (currentUserRole === 'visitor') {
    return <Navigate to="/connexion" replace />;
  }
  // Admins ont leur propre espace
  if (currentUserRole === 'admin' || currentUserRole === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirection racine */}
      <Route path="/" element={<Navigate to="/accueil" replace />} />

      {/* Pages citoyennes publiques */}
      <Route path="/accueil" element={<CitizenLayout><HomeView /></CitizenLayout>} />
      <Route path="/connexion" element={<CitizenLayout><LoginView /></CitizenLayout>} />
      <Route path="/a-propos" element={<CitizenLayout><AboutView /></CitizenLayout>} />

      {/* Ma Commune : avec ou sans ID de commune */}
      <Route path="/ma-commune" element={<CitizenLayout><CommuneView /></CitizenLayout>} />
      <Route path="/ma-commune/:id" element={<CitizenLayout><CommuneView /></CitizenLayout>} />

      {/* Initiatives : liste et détail */}
      <Route path="/initiatives" element={<CitizenLayout><InitiativesView /></CitizenLayout>} />
      <Route path="/initiatives/:id" element={<CitizenLayout><InitiativeDetailView /></CitizenLayout>} />

      {/* Actualités : liste et détail */}
      <Route path="/actualites" element={<CitizenLayout><NewsView /></CitizenLayout>} />
      <Route path="/actualites/:id" element={<CitizenLayout><PublicationDetailView /></CitizenLayout>} />
      {/* Alias pour compatibilité */}
      <Route path="/publications/:id" element={<CitizenLayout><PublicationDetailView /></CitizenLayout>} />

      {/* Mon Espace Porteur d'initiative */}
      <Route
        path="/mon-espace"
        element={
          <PorteurGuard>
            <CitizenLayout><DashboardView /></CitizenLayout>
          </PorteurGuard>
        }
      />

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
