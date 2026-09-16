import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccount } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Building2, 
  Sparkles, 
  Phone, 
  Mail, 
  ExternalLink,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const AdminPorteursTab: React.FC = () => {
  const { 
    users, 
    communes, 
    createUserAccount, 
    updateUserAccount, 
    deleteUserAccount, 
    toggleUserStatus,
    initiatives,
    openInitiativeById
  } = useApp();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [communeFilter, setCommuneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'suspendu'>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New porteur form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCommuneId, setNewCommuneId] = useState(communes[0]?.id || 'c1');
  const [newInitiativeName, setNewInitiativeName] = useState('');

  // Edit porteur form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCommuneId, setEditCommuneId] = useState('');
  const [editInitiativeName, setEditInitiativeName] = useState('');

  // Porteurs list
  const porteurUsers = users.filter(u => u.role === 'porteur');

  const filteredPorteurs = porteurUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.initiativeName && user.initiativeName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCommune = communeFilter === 'all' || user.communeId === communeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesCommune && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    createUserAccount({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '+223 70 00 00 00',
      role: 'porteur',
      communeId: newCommuneId,
      initiativeName: newInitiativeName.trim() || 'Initiative Locale Lab’Citoyen',
      status: 'actif',
      lastLogin: 'Jamais connecté'
    });

    setSuccessBanner(`Le compte porteur pour "${newName}" a été créé avec succès. Des identifiants provisoires ont été générés.`);
    setIsCreateModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewInitiativeName('');

    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleStartEdit = (user: UserAccount) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditCommuneId(user.communeId || 'c1');
    setEditInitiativeName(user.initiativeName || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUserAccount(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      phone: editPhone.trim(),
      communeId: editCommuneId,
      initiativeName: editInitiativeName.trim()
    });

    setSuccessBanner(`Les informations de "${editName}" ont été mises à jour.`);
    setEditingUser(null);
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    deleteUserAccount(userToDelete.id);
    setSuccessBanner(`Le compte de "${userToDelete.name}" a été définitivement supprimé.`);
    setUserToDelete(null);
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
              Lab'Citoyen • Incubateur
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {porteurUsers.length} Porteurs enregistrés
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Porteurs d'Initiatives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Ajout, modification, suspension de compte et suivi des jeunes et femmes porteurs de projets dans les 6 communes.
          </p>
        </div>

        <button
          id="admin-create-porteur-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#062326] hover:bg-[#093539] text-emerald-300 font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 flex-shrink-0"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>+ Ajouter un porteur d'initiative</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, e-mail ou initiative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">Toutes les communes</option>
              {communes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Comptes Actifs</option>
              <option value="suspendu">Comptes Suspendus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Porteurs Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPorteurs.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-600">Aucun porteur d'initiative trouvé.</p>
            <button
              onClick={() => { setSearchTerm(''); setCommuneFilter('all'); setStatusFilter('all'); }}
              className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredPorteurs.map(porteur => {
            const commune = communes.find(c => c.id === porteur.communeId);
            const associatedInitiative = initiatives.find(i => 
              i.ownerName.toLowerCase().includes(porteur.name.toLowerCase()) || 
              (porteur.initiativeName && i.title.toLowerCase().includes(porteur.initiativeName.toLowerCase()))
            );

            const isSuspended = porteur.status === 'suspendu';

            return (
              <div
                key={porteur.id}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                  isSuspended ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#062326] to-[#0E494E] text-emerald-300 font-black text-base flex items-center justify-center shadow-xs">
                        {porteur.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                            {porteur.name}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isSuspended 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {porteur.status}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 block mt-0.5">
                          {commune?.name || 'Commune non spécifiée'}
                        </span>
                      </div>
                    </div>

                    {/* Quick status toggle button */}
                    <button
                      onClick={() => toggleUserStatus(porteur.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                        isSuspended
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-200 hover:border-amber-300'
                      }`}
                      title={isSuspended ? "Réactiver l'accès" : "Suspendre l'accès"}
                    >
                      {isSuspended ? '✓ Réactiver' : '⏸ Suspendre'}
                    </button>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-xs mb-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{porteur.email}</span>
                    </div>
                    {porteur.phone && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{porteur.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Initiative information */}
                  <div className="mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Initiative accompagnée :
                    </span>
                    <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-xs font-bold text-emerald-950 truncate">
                          {porteur.initiativeName || 'Projet en cours de labellisation'}
                        </span>
                      </div>
                      {associatedInitiative && (
                        <button
                          onClick={() => openInitiativeById(associatedInitiative.id)}
                          className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                          <span>Voir fiche</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Dernière connexion : {porteur.lastLogin || 'Récent'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Modifier */}
                    <button
                      onClick={() => handleStartEdit(porteur)}
                      className="p-2 rounded-xl text-slate-600 hover:text-[#062326] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Modifier les détails"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Supprimer */}
                    <button
                      onClick={() => setUserToDelete(porteur)}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Supprimer ce compte porteur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal 1: Create Porteur */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#062326] text-emerald-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Ajouter un porteur d'initiative
                  </h3>
                  <span className="text-xs text-slate-500">
                    Incubateur Lab'Citoyen Bamako
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nom complet & Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Oumar Traoré"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Adresse e-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="oumar.traore@projet.ml"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Téléphone WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+223 76 00 00 00"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Commune de rattachement
                </label>
                <select
                  value={newCommuneId}
                  onChange={(e) => setNewCommuneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
                >
                  {communes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.district})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Intitulé de l'initiative
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sanuya Énergie : Briquettes Solaires"
                  value={newInitiativeName}
                  onChange={(e) => setNewInitiativeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062326] text-emerald-300 font-black hover:bg-[#09363B] transition-all cursor-pointer shadow-md"
                >
                  Enregistrer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Porteur */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Modifier le porteur
                  </h3>
                  <span className="text-xs text-slate-500">{editingUser.name}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Commune</label>
                <select
                  value={editCommuneId}
                  onChange={(e) => setEditCommuneId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold cursor-pointer"
                >
                  {communes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Initiative</label>
                <input
                  type="text"
                  value={editInitiativeName}
                  onChange={(e) => setEditInitiativeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062326] text-emerald-300 font-black hover:bg-[#09363B] transition-all cursor-pointer shadow-md"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Supprimer ce compte porteur ?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer le compte de <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email}) ? Cette action est irréversible.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2.5">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all cursor-pointer shadow-md"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
