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
import { 
  INITIAL_COMMUNES, 
  INITIAL_INITIATIVES, 
  INITIAL_PUBLICATIONS, 
  INITIAL_COMMENTS, 
  INITIAL_CONTRIBUTIONS, 
  INITIAL_USERS 
} from '../data/mockData';
import { generateSecurePassword } from '../utils/password.utils';

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
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & state
  const [activeTab, setActiveTab] = useState<TabType>('accueil');
  const [selectedCommuneId, setSelectedCommuneIdState] = useState<string>(() => {
    return localStorage.getItem('innovsahel_commune') || 'c1';
  });

  const setSelectedCommuneId = (id: string) => {
    setSelectedCommuneIdState(id);
    localStorage.setItem('innovsahel_commune', id);
  };

  // Content state (initialisé avec mockData pour résilience, mis à jour par l'API)
  const [communes, setCommunes] = useState<Commune[]>(INITIAL_COMMUNES);
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIAL_INITIATIVES);
  const [publications, setPublications] = useState<Publication[]>(INITIAL_PUBLICATIONS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [contributions, setContributions] = useState<CitizenContribution[]>(INITIAL_CONTRIBUTIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
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

  // Charger les données initiales depuis le Backend NestJS
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Communes
      try {
        const fetchedCommunes = await CommunesController.getAll();
        if (fetchedCommunes && fetchedCommunes.length > 0) {
          setCommunes(fetchedCommunes);
        }
      } catch (e) {
        console.warn('API Communes non joignable, fallback local utilisé', e);
      }

      // 2. Publications
      try {
        const fetchedPubs = await PublicationsController.getAll();
        if (fetchedPubs && fetchedPubs.length > 0) {
          setPublications(fetchedPubs);
        }
      } catch (e) {
        console.warn('API Publications non joignable', e);
      }

      // 3. Initiatives
      try {
        const fetchedInits = await InitiativesController.getAll();
        if (fetchedInits && fetchedInits.length > 0) {
          setInitiatives(fetchedInits);
        }
      } catch (e) {
        console.warn('API Initiatives non joignable', e);
      }

      // 4. Si l'utilisateur est authentifié en tant qu'admin
      const token = localStorage.getItem('innovsahel_token');
      if (token) {
        try {
          const me = await AuthController.getMe();
          if (me) {
            setAuthUser(me);
            setCurrentUserRole(me.role);
            setCurrentUserId(me.id);

            if (me.role === 'admin' || me.role === 'super_admin') {
              // Charger les contributions citoyennes réelles depuis MySQL
              const fetchedContribs = await ContributionsController.getAll();
              if (fetchedContribs) setContributions(fetchedContribs);

              // Charger les comptes utilisateurs
              const fetchedUsers = await UsersController.getAll();
              if (fetchedUsers) setUsers(fetchedUsers);

              // Charger les stats dashboard
              const stats = await DashboardController.getStats();
              if (stats) setDashboardStats(stats);
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
        ? (users.find(u => u.id === currentUserId) || (currentUserRole === 'admin' ? users[0] : users[1]))
        : (currentUserRole === 'admin' 
            ? users[0] 
            : currentUserRole === 'porteur' 
              ? users[1] 
              : { id: 'anon', name: 'Visiteur Citoyen', email: '', phone: '', role: 'porteur', status: 'actif' }));

  // Connexion avec authentification API réelle
  const loginWithApi = async (credentials: LoginCredentials) => {
    const res = await AuthController.login(credentials);
    if (res && res.user) {
      setAuthUser(res.user);
      setCurrentUserRole(res.user.role);
      setCurrentUserId(res.user.id);
      setActiveTab('mon_espace');
      
      // Recharger les données complètes pour l'espace d'administration
      if (res.user.role === 'admin' || res.user.role === 'super_admin') {
        try {
          const [fetchedContribs, fetchedUsers, stats] = await Promise.all([
            ContributionsController.getAll(),
            UsersController.getAll(),
            DashboardController.getStats()
          ]);
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

  // Login de compatibilité
  const login = (role: 'admin' | 'porteur', user?: UserAccount) => {
    setCurrentUserRole(role);
    if (user) {
      setCurrentUserId(user.id);
    } else if (role === 'admin') {
      setCurrentUserId(users[0]?.id || 'u-admin');
    } else {
      setCurrentUserId(users[1]?.id || 'u-porteur-1');
    }
    setActiveTab('mon_espace');
  };

  const logout = () => {
    AuthController.logout();
    setAuthUser(null);
    setCurrentUserRole('visitor');
    setCurrentUserId(null);
    setActiveTab('accueil');
  };

  // ─── Actions avec persistance MySQL ───────────────────────────

  // Soumission d'idée ou signalement citoyen (PUBLIC)
  const addContribution = async (data: Omit<CitizenContribution, 'id' | 'createdAt' | 'internalStatus'>) => {
    try {
      // 1. Appel API vers le Backend NestJS -> MySQL
      const created = await ContributionsController.create({
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

      // 2. Mise à jour de l'état réactif
      setContributions(prev => [created, ...prev]);
    } catch (e) {
      console.warn('API non disponible, sauvegarde locale de secours', e);
      const fallback: CitizenContribution = {
        ...data,
        id: `cont-${Date.now()}`,
        createdAt: new Date().toISOString(),
        internalStatus: 'nouveau',
        internalNotes: ''
      };
      setContributions(prev => [fallback, ...prev]);
    }

    // Modal de confirmation bienveillante
    setConfirmationData({
      title: data.type === 'idee' ? 'Merci pour votre idée !' : 'Signalement bien enregistré !',
      message: 'Votre message a bien été reçu et enregistré en base de données. Il est transmis confidentiellement à l’équipe IMPACT SAHEL et aux responsables communaux pour examen.',
      type: data.type === 'idee' ? 'idea' : 'problem'
    });
  };

  // Mise à jour de statut par l'admin
  const updateContributionStatus = async (id: string, status: ContributionStatus, notes?: string) => {
    try {
      await ContributionsController.updateStatus(id, { status, notes });
    } catch (e) {
      console.warn('Erreur API updateContributionStatus:', e);
    }

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
    try {
      await ContributionsController.delete(id);
    } catch (e) {
      console.warn('Erreur API deleteContribution:', e);
    }
    setContributions(prev => prev.filter(c => c.id !== id));
  };

  // Publications
  const addPublication = async (pub: Omit<Publication, 'id' | 'viewsCount'>) => {
    try {
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
        publicationStatus: pub.status || 'published',
        date: pub.date,
      });
      setPublications(prev => [created, ...prev]);
    } catch (e) {
      console.warn('Erreur API addPublication, fallback local:', e);
      const fallback: Publication = {
        ...pub,
        id: `pub-${Date.now()}`,
        viewsCount: 1
      };
      setPublications(prev => [fallback, ...prev]);
    }

    setConfirmationData({
      title: 'Publication en ligne !',
      message: 'Votre actualité a été enregistrée avec succès. Elle est visible sur l’espace Ma Commune et dans le fil des Actualités.',
      type: 'publication'
    });
  };

  const updatePublication = async (id: string, partial: Partial<Publication>) => {
    try {
      await PublicationsController.update(id, partial as any);
    } catch (e) {
      console.warn('Erreur API updatePublication:', e);
    }
    setPublications(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
  };

  const deletePublication = async (id: string) => {
    try {
      await PublicationsController.delete(id);
    } catch (e) {
      console.warn('Erreur API deletePublication:', e);
    }
    setPublications(prev => prev.filter(p => p.id !== id));
  };

  // Commentaires
  const addComment = async (commentData: Omit<Comment, 'id' | 'date' | 'reported'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    
    try {
      const created = await CommentsController.create({
        publicationId: commentData.publicationId,
        initiativeId: commentData.initiativeId,
        authorName: commentData.authorName,
        authorRole: commentData.authorRole,
        message: commentData.message,
      });
      setComments(prev => [...prev, { ...created, date: formattedDate }]);
    } catch (e) {
      console.warn('Erreur API addComment, fallback local:', e);
      const newComment: Comment = {
        ...commentData,
        id: `comm-${Date.now()}`,
        date: formattedDate,
        reported: false
      };
      setComments(prev => [...prev, newComment]);
    }
  };

  const reportComment = async (id: string) => {
    try {
      await CommentsController.report(id);
    } catch (e) {
      console.warn('Erreur API reportComment:', e);
    }
    setComments(prev => prev.map(c => c.id === id ? { ...c, reported: true } : c));
  };

  const deleteComment = async (id: string) => {
    try {
      await CommentsController.delete(id);
    } catch (e) {
      console.warn('Erreur API deleteComment:', e);
    }
    setComments(prev => prev.filter(c => c.id !== id));
  };

  // Initiatives
  const updateInitiative = async (id: string, partial: Partial<Initiative>) => {
    try {
      await InitiativesController.update(id, partial as any);
    } catch (e) {
      console.warn('Erreur API updateInitiative:', e);
    }
    setInitiatives(prev => prev.map(init => init.id === id ? { ...init, ...partial } : init));
  };

  // Utilisateurs porteurs
  const createUserAccount = async (account: Omit<UserAccount, 'id'> & { temporaryPassword?: string }) => {
    const tempPassword = account.temporaryPassword || generateSecurePassword();
    try {
      const created = await UsersController.create({
        name: account.name,
        email: account.email,
        phone: account.phone,
        communeId: account.communeId,
        initiativeName: account.initiativeName,
        temporaryPassword: tempPassword,
      });
      setUsers(prev => [...prev, created]);
    } catch (e) {
      console.warn('Erreur API createUserAccount, fallback local:', e);
      const newUser: UserAccount = {
        ...account,
        id: `u-${Date.now()}`
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const updateUserAccount = async (id: string, partial: Partial<UserAccount>) => {
    try {
      await UsersController.update(id, partial as any);
    } catch (e) {
      console.warn('Erreur API updateUserAccount:', e);
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...partial } : u));
  };

  const deleteUserAccount = async (id: string) => {
    try {
      await UsersController.delete(id);
    } catch (e) {
      console.warn('Erreur API deleteUserAccount:', e);
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newStatus: 'actif' | 'suspendu' = user.status === 'actif' ? 'suspendu' : 'actif';

    try {
      await UsersController.updateStatus(id, newStatus);
    } catch (e) {
      console.warn('Erreur API toggleUserStatus:', e);
    }

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openPublicationById = (id: string) => {
    const pub = publications.find(p => p.id === id);
    if (pub) {
      setSelectedPublication(pub);
      setSelectedInitiative(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
