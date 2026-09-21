import React, { useState, useEffect } from 'react';
import { Crown, Plus, ToggleLeft, ToggleRight, User, Mail, Phone, Lock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { UsersController, CreateAdminDto } from '../../controllers/usersController';
import { UserAccount } from '../../models/user.model';

export const AdminAdminsTab: React.FC = () => {
  const [admins, setAdmins] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<CreateAdminDto>({
    name: '',
    email: '',
    phone: '',
    temporaryPassword: '',
  });

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await UsersController.getAdmins();
      setAdmins(data);
    } catch (e: any) {
      setErrorMsg('Impossible de charger les administrateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrorMsg(null);
    try {
      const newAdmin = await UsersController.createAdmin(form);
      setAdmins(prev => [newAdmin, ...prev]);
      setSuccessMsg(`✅ Compte admin créé pour ${newAdmin.name}. Mot de passe temporaire transmis.`);
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', temporaryPassword: '' });
    } catch (e: any) {
      setErrorMsg(e.message || 'Erreur lors de la création.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggle = async (admin: UserAccount) => {
    try {
      const updated = await UsersController.toggleStatus(admin.id);
      setAdmins(prev => prev.map(a => a.id === admin.id ? updated : a));
      setSuccessMsg(`Compte de ${admin.name} ${updated.status === 'actif' ? 'activé' : 'suspendu'}.`);
    } catch (e: any) {
      setErrorMsg(e.message || 'Erreur lors du changement de statut.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Crown className="w-7 h-7 text-yellow-500" />
            Administrateurs Platform
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez les comptes administrateurs qui gèrent la plateforme InnovSahel.
            Seul le Super Administrateur peut créer ou suspendre ces comptes.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-400 text-white rounded-xl font-bold text-sm hover:from-yellow-600 hover:to-amber-500 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nouvel Admin
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{successMsg}</p>
          <button onClick={() => setSuccessMsg(null)} className="ml-auto text-emerald-400 hover:text-emerald-600 cursor-pointer">×</button>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer">×</button>
        </div>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-yellow-500" />
            Créer un Admin Platform
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                Nom complet *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Prénom Nom"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="admin@impactsahel.org"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+223 70 12 34 56"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">
                Mot de passe temporaire *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.temporaryPassword}
                  onChange={e => setForm(f => ({ ...f, temporaryPassword: e.target.value }))}
                  required
                  minLength={6}
                  placeholder="Admin@123!"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">L'admin devra le changer à sa première connexion.</p>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-amber-400 text-white hover:from-yellow-600 hover:to-amber-500 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isCreating && <Loader className="w-4 h-4 animate-spin" />}
                Créer l'admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des admins */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-800">
            Admins Platform ({admins.length})
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Crown className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">Aucun administrateur platform créé.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {admins.map(admin => (
              <div key={admin.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{admin.name}</p>
                    <p className="text-xs text-slate-500">{admin.email}</p>
                    {admin.phone && <p className="text-xs text-slate-400">{admin.phone}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    admin.status === 'actif'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {admin.status === 'actif' ? '● Actif' : '● Suspendu'}
                  </span>
                  <button
                    onClick={() => handleToggle(admin)}
                    title={admin.status === 'actif' ? 'Désactiver' : 'Activer'}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      admin.status === 'actif'
                        ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                        : 'text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {admin.status === 'actif' ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-700 font-medium">
          <strong>⚠ Important :</strong> Un admin suspendu ne peut plus se connecter à la plateforme.
          Seul le Super Administrateur peut réactiver son compte.
        </p>
      </div>
    </div>
  );
};
