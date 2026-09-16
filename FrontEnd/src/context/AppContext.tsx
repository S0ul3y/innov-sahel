import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Commune, 
  Initiative, 
  Publication, 
  Comment, 
  CitizenContribution, 
  UserAccount, 
  UserRole, 
  TabType, 
  ContributionStatus 
} from '../types';
import { 
  INITIAL_COMMUNES, 
  INITIAL_INITIATIVES, 
  INITIAL_PUBLICATIONS, 
  INITIAL_COMMENTS, 
  INITIAL_CONTRIBUTIONS, 
  INITIAL_USERS 
} from '../data/mockData';

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
  
  // Actions
  login: (role: 'admin' | 'porteur', user?: UserAccount) => void;
  logout: () => void;
  addContribution: (data: Omit<CitizenContribution, 'id' | 'createdAt' | 'internalStatus'>) => void;
  updateContributionStatus: (id: string, status: ContributionStatus, notes?: string) => void;
  deleteContribution: (id: string) => void;
  addPublication: (pub: Omit<Publication, 'id' | 'viewsCount'>) => void;
  updatePublication: (id: string, partial: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date' | 'reported'>) => void;
  reportComment: (id: string) => void;
  deleteComment: (id: string) => void;
  updateInitiative: (id: string, partial: Partial<Initiative>) => void;
  createUserAccount: (account: Omit<UserAccount, 'id'>) => void;
  updateUserAccount: (id: string, partial: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  openInitiativeById: (id: string) => void;
  openPublicationById: (id: string) => void;
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

  // Content state
  const [communes] = useState<Commune[]>(INITIAL_COMMUNES);
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIAL_INITIATIVES);
  const [publications, setPublications] = useState<Publication[]>(INITIAL_PUBLICATIONS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [contributions, setContributions] = useState<CitizenContribution[]>(INITIAL_CONTRIBUTIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);

  // User role state (visitor / citoyen by default)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('visitor');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Accessibility text size & low bandwidth
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);

  // Modals & detail views
  const [activeModal, setActiveModal] = useState<'idea' | 'problem' | 'publish' | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

  const selectedCommune = communes.find(c => c.id === selectedCommuneId) || communes[0];

  const activeUser = currentUserId
    ? (users.find(u => u.id === currentUserId) || (currentUserRole === 'admin' ? users[0] : users[1]))
    : (currentUserRole === 'admin' 
        ? users[0] 
        : currentUserRole === 'porteur' 
          ? users[1] 
          : { id: 'anon', name: 'Visiteur Citoyen', email: '', phone: '', role: 'porteur' as const, status: 'actif' as const });

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
    setCurrentUserRole('visitor');
    setCurrentUserId(null);
    setActiveTab('accueil');
  };

  // Sync text size to root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-large', 'text-size-xlarge');
    if (textSize === 'large') root.classList.add('text-size-large');
    if (textSize === 'xlarge') root.classList.add('text-size-xlarge');
  }, [textSize]);

  // Action implementations
  const addContribution = (data: Omit<CitizenContribution, 'id' | 'createdAt' | 'internalStatus'>) => {
    const newContrib: CitizenContribution = {
      ...data,
      id: `cont-${Date.now()}`,
      createdAt: new Date().toISOString(),
      internalStatus: 'nouveau',
      internalNotes: ''
    };
    setContributions(prev => [newContrib, ...prev]);

    // Show visual confirmation modal (Section 7.5: warm reassurance, no false promise)
    setConfirmationData({
      title: data.type === 'idee' ? 'Merci pour votre idée !' : 'Signalement bien enregistré !',
      message: 'Votre message a bien été reçu. Il est transmis confidentiellement à l’équipe IMPACT SAHEL et aux responsables de votre commune pour examen. Votre engagement contribue à améliorer notre cadre de vie à Bamako.',
      type: data.type === 'idee' ? 'idea' : 'problem'
    });
  };

  const updateContributionStatus = (id: string, status: ContributionStatus, notes?: string) => {
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

  const deleteContribution = (id: string) => {
    setContributions(prev => prev.filter(c => c.id !== id));
  };

  const addPublication = (pub: Omit<Publication, 'id' | 'viewsCount'>) => {
    const newPub: Publication = {
      ...pub,
      id: `pub-${Date.now()}`,
      viewsCount: 1
    };
    setPublications(prev => [newPub, ...prev]);
    setConfirmationData({
      title: 'Publication en ligne !',
      message: 'Votre actualité a été publiée avec succès. Elle est dès maintenant visible sur l’espace Ma Commune et dans le fil des Actualités d’InnovSahel.',
      type: 'publication'
    });
  };

  const updatePublication = (id: string, partial: Partial<Publication>) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
  };

  const deletePublication = (id: string) => {
    setPublications(prev => prev.filter(p => p.id !== id));
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'date' | 'reported'>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    
    const newComment: Comment = {
      ...commentData,
      id: `comm-${Date.now()}`,
      date: formattedDate,
      reported: false
    };
    setComments(prev => [...prev, newComment]);
  };

  const reportComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, reported: true } : c));
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const updateInitiative = (id: string, partial: Partial<Initiative>) => {
    setInitiatives(prev => prev.map(init => init.id === id ? { ...init, ...partial } : init));
  };

  const createUserAccount = (account: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...account,
      id: `u-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserAccount = (id: string, partial: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...partial } : u));
  };

  const deleteUserAccount = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'actif' ? 'suspendu' : 'actif' } : u));
  };

  const openInitiativeById = (id: string) => {
    const found = initiatives.find(i => i.id === id);
    if (found) {
      setSelectedInitiative(found);
    }
  };

  const openPublicationById = (id: string) => {
    const found = publications.find(p => p.id === id);
    if (found) {
      setSelectedPublication(found);
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
        login,
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
        currentUserId,
        setCurrentUserId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
