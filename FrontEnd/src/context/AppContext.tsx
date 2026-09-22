import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Commune, 
  Initiative, 
  Publication, 
  Comment, 
  CitizenContribution, 
  UserAccount, 
  UserRole, 
  TabType, 
  ContributionStatus,
  LoginCredentials,
  AuthUser,
  DashboardStats
} from '../models';
import { 
  AuthController,
  CommunesController,
  InitiativesController,
  PublicationsController,
  CommentsController,
  ContributionsController,
  UsersController,
  DashboardController
} from '../controllers';
import { generateSecurePassword } from '../utils/password.utils';
import { useLocation, useNavigate } from 'react-router-dom';
// Les données statiques communes (fixes, pas de CRUD) sont conservées uniquement pour les communes
import { INITIAL_COMMUNES } from '../data/mockData';

export const tabToPath = (tab: TabType): string => {
  switch (tab) {
    case 'accueil':
      return '/accueil';
    case 'ma_commune':
      return '/ma-commune';
    case 'initiatives':
      return '/initiatives';
    case 'actualites':
      return '/actualites';
    case 'mon_espace':
      return '/mon-espace';
    case 'a_propos':
      return '/a-propos';
    case 'connexion':
      return '/connexion';
    default:
      return '/accueil';
  }
};

export const pathToTab = (pathname: string): TabType => {
  if (pathname.startsWith('/connexion')) return 'connexion';
  if (pathname.startsWith('/ma-commune')) return 'ma_commune';
  if (pathname.startsWith('/initiatives')) return 'initiatives';
  if (pathname.startsWith('/actualites') || pathname.startsWith('/publications')) return 'actualites';
  if (pathname.startsWith('/mon-espace') || pathname.startsWith('/admin')) return 'mon_espace';
  if (pathname.startsWith('/a-propos')) return 'a_propos';
  return 'accueil';
};

interface ConfirmationData {
  title: string;
  message: string;
  type: 'idea' | 'problem' | 'publication';
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedCommuneId: string;
  setSelectedCommuneId: (id: string) => void;
  selectedCommune: Commune;
  communes: Commune[];
  initiatives: Initiative[];
  publications: Publication[];
  comments: Comment[];
  contributions: CitizenContribution[];
  users: UserAccount[];
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  activeUser: UserAccount;
  activeModal: 'idea' | 'problem' | 'publish' | null;
  setActiveModal: (modal: 'idea' | 'problem' | 'publish' | null) => void;
  selectedInitiative: Initiative | null;
  setSelectedInitiative: (init: Initiative | null) => void;
  selectedPublication: Publication | null;
  setSelectedPublication: (pub: Publication | null) => void;
  confirmationData: ConfirmationData | null;
  setConfirmationData: (data: ConfirmationData | null) => void;
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (val: boolean) => void;
  
  // Dashboard & Realtime State
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (role: 'admin' | 'porteur', user?: UserAccount) => void;
  loginWithApi: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  addContribution: (data: Omit<CitizenContribution, 'id' | 'createdAt' | 'internalStatus'>) => Promise<void>;
  updateContributionStatus: (id: string, status: ContributionStatus, notes?: string) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  addPublication: (pub: Omit<Publication, 'id' | 'viewsCount'>) => Promise<void>;
  updatePublication: (id: string, partial: Partial<Publication>) => Promise<void>;
  deletePublication: (id: string) => Promise<void>;
  addComment: (comment: Omit<Comment, 'id' | 'date' | 'reported'>) => Promise<void>;
  reportComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  updateInitiative: (id: string, partial: Partial<Initiative>) => Promise<void>;
  createUserAccount: (account: Omit<UserAccount, 'id'> & { temporaryPassword?: string }) => Promise<void>;
  updateUserAccount: (id: string, partial: Partial<UserAccount>) => Promise<void>;
  deleteUserAccount: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  openInitiativeById: (id: string) => void;
  openPublicationById: (id: string) => void;
  refreshData: () => Promise<void>;
  // Chargement des commentaires à la demande (vue détail)
  loadCommentsForPublication: (publicationId: string) => Promise<void>;
  loadCommentsForInitiative: (initiativeId: string) => Promise<void>;
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation & state synchronisé avec l'URL
  const activeTab: TabType = pathToTab(location.pathname);

  const setActiveTab = (tab: TabType) => {
    setSelectedInitiative(null);
    setSelectedPublication(null);
    navigate(tabToPath(tab));
  };

  const [selectedCommuneId, setSelectedCommuneIdState] = useState<string>(() => {
    return localStorage.getItem('innovsahel_commune') || 'c1';
  });

  const setSelectedCommuneId = (id: string) => {
    setSelectedCommuneIdState(id);
    localStorage.setItem('innovsahel_commune', id);
  };

  // ─── État du contenu — vide par défaut, chargé depuis la DB ───────────────
  const [communes, setCommunes] = useState<Commune[]>(INITIAL_COMMUNES); // Communes fixes
  const [initiatives, setInitiatives] = useState<Initiative[]>([]); // Depuis DB
  const [publications, setPublications] = useState<Publication[]>([]); // Depuis DB
  const [comments, setComments] = useState<Comment[]>([]);            // Depuis DB (à la demande)
  const [contributions, setContributions] = useState<CitizenContribution[]>([]); // Depuis DB (admin)
  const [users, setUsers] = useState<UserAccount[]>([]);              // Depuis DB (admin)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User role state
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('visitor');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Accessibility text size & low bandwidth
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);

  // Modals & detail views
  const [activeModal, setActiveModal] = useState<'idea' | 'problem' | 'publish' | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

  // Synchronisation des vues de détail selon l'URL
  useEffect(() => {
    if (!location.pathname.startsWith('/initiatives/')) {
      setSelectedInitiative(null);
    }
    if (!location.pathname.startsWith('/actualites/') && !location.pathname.startsWith('/publications/')) {
      setSelectedPublication(null);
    }
  }, [location.pathname]);

  // ─── Chargement des commentaires à la demande (vues détail) ──────────────
  const loadCommentsForPublication = useCallback(async (publicationId: string) => {
    try {
      const fetched = await CommentsController.getByPublication(publicationId);
      if (fetched) {
        // Ajouter/remplacer les commentaires de cette publication dans l'état
        setComments(prev => {
          const without = prev.filter(c => c.publicationId !== publicationId);
          return [...without, ...fetched];
        });
      }
    } catch (e) {
      console.warn('Erreur chargement commentaires publication:', e);
    }
  }, []);

  const loadCommentsForInitiative = useCallback(async (initiativeId: string) => {
    try {
      const fetched = await CommentsController.getByInitiative(initiativeId);
      if (fetched) {
        // Ajouter/remplacer les commentaires de cette initiative dans l'état
        setComments(prev => {
          const without = prev.filter(c => c.initiativeId !== initiativeId);
          return [...without, ...fetched];
        });
      }
    } catch (e) {
      console.warn('Erreur chargement commentaires initiative:', e);
    }
  }, []);

  // ─── Chargement initial depuis le Backend NestJS ──────────────────────────
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Communes (fallback local car données fixes)
      try {
        const fetchedCommunes = await CommunesController.getAll();
        if (fetchedCommunes && fetchedCommunes.length > 0) {
          setCommunes(fetchedCommunes);
        }
      } catch (e) {
        console.warn('API Communes non joignable, fallback local utilisé', e);
      }

      // 2. Publications publiées (PUBLIC — pas de fallback local)
      try {
        const fetchedPubs = await PublicationsController.getAll();
        setPublications(fetchedPubs || []);
      } catch (e) {
        console.warn('API Publications non joignable, liste vide affichée', e);
        setPublications([]);
      }

      // 3. Initiatives (PUBLIC — pas de fallback local)
      try {
        const fetchedInits = await InitiativesController.getAll();
        setInitiatives(fetchedInits || []);
      } catch (e) {
        console.warn('API Initiatives non joignable, liste vide affichée', e);
        setInitiatives([]);
      }

      // 4. Si l'utilisateur est authentifié
      const token = localStorage.getItem('innovsahel_token');
      if (token) {
        try {
          const me = await AuthController.getMe();
          if (me) {
            setAuthUser(me);
            setCurrentUserRole(me.role);
            setCurrentUserId(me.id);

            if (me.role === 'admin' || me.role === 'super_admin') {
              // Admin : charger toutes les publications y compris brouillons
              try {
                const adminPubs = await PublicationsController.getAllAdmin();
                if (adminPubs) setPublications(adminPubs);
              } catch (e) {
                console.warn('Erreur chargement publications admin:', e);
              }

              // Charger les contributions citoyennes réelles depuis MySQL
              try {
                const fetchedContribs = await ContributionsController.getAll();
                if (fetchedContribs) setContributions(fetchedContribs);
              } catch (e) {
                console.warn('Erreur chargement contributions:', e);
              }

              // Charger les comptes utilisateurs
              try {
                const fetchedUsers = await UsersController.getAll();
                if (fetchedUsers) setUsers(fetchedUsers);
              } catch (e) {
                console.warn('Erreur chargement utilisateurs:', e);
              }

              // Charger les stats dashboard
              try {
                const stats = await DashboardController.getStats();
                if (stats) setDashboardStats(stats);
              } catch (e) {
                console.warn('Erreur chargement stats dashboard:', e);
              }
            } else if (me.role === 'porteur') {
              try {
                const [adminInits, stats] = await Promise.all([
                  InitiativesController.getAllAdmin(),
                  DashboardController.getStats(),
                ]);
                if (adminInits && adminInits.length > 0) {
                  setInitiatives(adminInits);
                }
                if (stats) setDashboardStats(stats);
              } catch (e) {
                console.warn('Erreur chargement données porteur:', e);
              }
            }
          }
        } catch {
          // Token expiré ou invalide
          AuthController.logout();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync text size to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-large', 'text-size-xlarge');
    if (textSize === 'large') root.classList.add('text-size-large');
    if (textSize === 'xlarge') root.classList.add('text-size-xlarge');
  }, [textSize]);

  const selectedCommune = communes.find(c => c.id === selectedCommuneId) || communes[0];

  const activeUser: UserAccount = authUser 
    ? {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        phone: authUser.phone || '',
        role: authUser.role,
        adminLevel: authUser.adminLevel,
        communeId: authUser.communeId,
        initiativeName: authUser.initiativeName,
        status: authUser.status,
      }
    : (currentUserId
        ? (users.find(u => u.id === currentUserId) || { id: 'anon', name: 'Visiteur Citoyen', email: '', phone: '', role: 'porteur' as UserRole, status: 'actif' as const })
        : (currentUserRole === 'admin' 
            ? (users[0] || { id: 'anon', name: 'Admin', email: '', phone: '', role: 'admin' as UserRole, status: 'actif' as const })
            : currentUserRole === 'porteur' 
              ? (users.find(u => u.role === 'porteur') || { id: 'anon', name: 'Porteur', email: '', phone: '', role: 'porteur' as UserRole, status: 'actif' as const })
              : { id: 'anon', name: 'Visiteur Citoyen', email: '', phone: '', role: 'porteur' as UserRole, status: 'actif' as const }));

  // ─── Connexion avec authentification API réelle ───────────────────────────
  const loginWithApi = async (credentials: LoginCredentials) => {
    const res = await AuthController.login(credentials);
    if (res && res.user) {
      setAuthUser(res.user);
      setCurrentUserRole(res.user.role);
      setCurrentUserId(res.user.id);
      
      if (res.user.role === 'admin' || res.user.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/mon-espace');
      }
      
      // Recharger les données complètes depuis la DB
      if (res.user.role === 'admin' || res.user.role === 'super_admin') {
        try {
          const [adminPubs, fetchedContribs, fetchedUsers, stats] = await Promise.all([
            PublicationsController.getAllAdmin(),
            ContributionsController.getAll(),
            UsersController.getAll(),
            DashboardController.getStats()
          ]);
          if (adminPubs) setPublications(adminPubs);
          if (fetchedContribs) setContributions(fetchedContribs);
          if (fetchedUsers) setUsers(fetchedUsers);
          if (stats) setDashboardStats(stats);
        } catch (e) {
          console.error('Erreur chargement données admin après login:', e);
        }
      } else if (res.user.role === 'porteur') {
        try {
          const [adminInits, stats] = await Promise.all([
            InitiativesController.getAllAdmin(),
            DashboardController.getStats(),
          ]);
          if (adminInits && adminInits.length > 0) {
            setInitiatives(adminInits);
          }
          if (stats) setDashboardStats(stats);
        } catch (e) {
          console.error('Erreur chargement données porteur après login:', e);
        }
      }
    }
  };

  // Login de compatibilité (sans API — à supprimer si plus utilisé)
  const login = (role: 'admin' | 'porteur', user?: UserAccount) => {
    setCurrentUserRole(role);
    if (user) {
      setCurrentUserId(user.id);
    } else if (role === 'admin') {
      setCurrentUserId(users[0]?.id || 'u-admin');
    } else {
      setCurrentUserId(users[1]?.id || 'u-porteur-1');
    }
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/mon-espace');
    }
  };

  const logout = () => {
    AuthController.logout();
    setAuthUser(null);
    setCurrentUserRole('visitor');
    setCurrentUserId(null);
    setSelectedInitiative(null);
    setSelectedPublication(null);
    setContributions([]);
    setUsers([]);
    setDashboardStats(null);
    navigate('/accueil');
  };

  // ─── Actions avec persistance DB — AUCUN fallback local ──────────────────

  // Soumission d'idée ou signalement citoyen (PUBLIC)
  const addContribution = async (data: Omit<CitizenContribution, 'id' | 'createdAt' | 'internalStatus'>) => {
    // Appel API vers le Backend NestJS -> MySQL
    // Si l'API échoue, l'erreur est propagée — pas de faux local
    await ContributionsController.create({
      type: data.type,
      communeId: data.communeId,
      category: data.category,
      description: data.description,
      photoUrl: data.photoUrl,
      locationText: data.locationText,
      gpsCoordinates: data.gpsCoordinates,
      citizenName: data.citizenName,
      citizenPhone: data.citizenPhone,
    });

    // Modal de confirmation bienveillante
    setConfirmationData({
      title: data.type === 'idee' ? 'Merci pour votre idée !' : 'Signalement bien enregistré !',
      message: "Votre message a bien été reçu et enregistré en base de données. Il est transmis confidentiellement à l'équipe IMPACT SAHEL et aux responsables communaux pour examen.",
      type: data.type === 'idee' ? 'idea' : 'problem'
    });
  };

  // Mise à jour de statut par l'admin
  const updateContributionStatus = async (id: string, status: ContributionStatus, notes?: string) => {
    await ContributionsController.updateStatus(id, { status, notes });
    setContributions(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          internalStatus: status,
          internalNotes: notes !== undefined ? notes : c.internalNotes
        };
      }
      return c;
    }));
  };

  const deleteContribution = async (id: string) => {
    await ContributionsController.delete(id);
    setContributions(prev => prev.filter(c => c.id !== id));
  };

  // ─── Publications — Persistance DB uniquement ──────────────────────────────
  const addPublication = async (pub: Omit<Publication, 'id' | 'viewsCount'>) => {
    // Appel API — pas de fallback local. Si l'API échoue, l'erreur remonte au composant.
    const created = await PublicationsController.create({
      type: pub.type,
      format: pub.format,
      communeId: pub.communeId,
      initiativeId: pub.initiativeId,
      title: pub.title,
      metaDescription: pub.metaDescription,
      coverImage: pub.coverImage,
      content: pub.content,
      carouselImages: pub.carouselImages,
      youtubeUrl: pub.youtubeUrl,
      youtubeId: pub.youtubeId,
      publicationStatus: (pub as any).publicationStatus || pub.status || 'published',
      date: pub.date,
    });
    setPublications(prev => [created, ...prev]);

    setConfirmationData({
      title: 'Publication en ligne !',
      message: "Votre actualité a été enregistrée avec succès en base de données. Elle est visible sur l'espace Ma Commune et dans le fil des Actualités.",
      type: 'publication'
    });
  };

  const updatePublication = async (id: string, partial: Partial<Publication>) => {
    const updated = await PublicationsController.update(id, partial as any);
    setPublications(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePublication = async (id: string) => {
    await PublicationsController.delete(id);
    setPublications(prev => prev.filter(p => p.id !== id));
  };

  // ─── Commentaires — Persistance DB uniquement ─────────────────────────────
  const addComment = async (commentData: Omit<Comment, 'id' | 'date' | 'reported'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Appel API — pas de fallback local. Si l'API échoue, l'erreur remonte.
    const created = await CommentsController.create({
      publicationId: commentData.publicationId,
      initiativeId: commentData.initiativeId,
      authorName: commentData.authorName,
      authorRole: commentData.authorRole,
      message: commentData.message,
    });
    setComments(prev => [...prev, { ...created, date: formattedDate }]);
  };

  const reportComment = async (id: string) => {
    await CommentsController.report(id);
    setComments(prev => prev.map(c => c.id === id ? { ...c, reported: true } : c));
  };

  const deleteComment = async (id: string) => {
    await CommentsController.delete(id);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  // ─── Initiatives ──────────────────────────────────────────────────────────
  const updateInitiative = async (id: string, partial: Partial<Initiative>) => {
    await InitiativesController.update(id, partial as any);
    setInitiatives(prev => prev.map(init => init.id === id ? { ...init, ...partial } : init));
  };

  // ─── Utilisateurs porteurs ────────────────────────────────────────────────
  const createUserAccount = async (account: Omit<UserAccount, 'id'> & { temporaryPassword?: string }) => {
    const tempPassword = account.temporaryPassword || generateSecurePassword();
    const created = await UsersController.create({
      name: account.name,
      email: account.email,
      phone: account.phone,
      communeId: account.communeId,
      initiativeName: account.initiativeName,
      temporaryPassword: tempPassword,
    });
    setUsers(prev => [...prev, created]);
  };

  const updateUserAccount = async (id: string, partial: Partial<UserAccount>) => {
    await UsersController.update(id, partial as any);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...partial } : u));
  };

  const deleteUserAccount = async (id: string) => {
    await UsersController.delete(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newStatus: 'actif' | 'suspendu' = user.status === 'actif' ? 'suspendu' : 'actif';
    await UsersController.updateStatus(id, newStatus);
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const openInitiativeById = (id: string) => {
    const init = initiatives.find(i => i.id === id);
    if (init) {
      setSelectedInitiative(init);
      setSelectedPublication(null);
    }
    navigate(`/initiatives/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPublicationById = (id: string) => {
    const pub = publications.find(p => p.id === id);
    if (pub) {
      setSelectedPublication(pub);
      setSelectedInitiative(null);
    }
    navigate(`/actualites/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCommuneId,
        setSelectedCommuneId,
        selectedCommune,
        communes,
        initiatives,
        publications,
        comments,
        contributions,
        users,
        currentUserRole,
        setCurrentUserRole,
        activeUser,
        activeModal,
        setActiveModal,
        selectedInitiative,
        setSelectedInitiative,
        selectedPublication,
        setSelectedPublication,
        confirmationData,
        setConfirmationData,
        textSize,
        setTextSize,
        lowBandwidthMode,
        setLowBandwidthMode,
        dashboardStats,
        isLoading,
        error,
        
        login,
        loginWithApi,
        logout,
        addContribution,
        updateContributionStatus,
        deleteContribution,
        addPublication,
        updatePublication,
        deletePublication,
        addComment,
        reportComment,
        deleteComment,
        updateInitiative,
        createUserAccount,
        updateUserAccount,
        deleteUserAccount,
        toggleUserStatus,
        openInitiativeById,
        openPublicationById,
        refreshData,
        loadCommentsForPublication,
        loadCommentsForInitiative,
        currentUserId,
        setCurrentUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
