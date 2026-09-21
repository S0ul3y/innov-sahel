import React, { useState, useEffect } from 'react';
import {
  Crown,
  Plus,
  ToggleLeft,
  ToggleRight,
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Send,
  Key,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UsersController, CreateAdminDto } from '../../controllers/usersController';
import { UserAccount } from '../../models/user.model';
import { generateSecurePassword } from '../../utils/password.utils';

export const AdminAdminsTab: React.FC = () => {
  const [admins, setAdmins] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);

  // ─── Success Recap Modal ──────────────────────────────────────────────────────
  const [createdAdminSuccessModal, setCreatedAdminSuccessModal] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);
  const [modalCopied, setModalCopied] = useState(false);

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

  const handleOpenForm = () => {
    if (!showForm) {
      setForm({
        name: '',
        email: '',
        phone: '',
        temporaryPassword: generateSecurePassword(),
      });
      setShowPassword(true);
    }
    setShowForm(!showForm);
  };

  const handleRegeneratePassword = () => {
    setForm(f => ({ ...f, temporaryPassword: generateSecurePassword() }));
  };

  const handleCopyPassword = () => {
    if (!form.temporaryPassword) return;
    navigator.clipboard.writeText(form.temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrorMsg(null);
    try {
      const newAdmin = await UsersController.createAdmin({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone?.trim() || undefined,
        temporaryPassword: form.temporaryPassword.trim(),
      });
      setAdmins(prev => [newAdmin, ...prev]);
      setCreatedAdminSuccessModal({
        name: newAdmin.name,
        email: form.email.trim().toLowerCase(),
        password: form.temporaryPassword.trim(),
      });
      setSuccessMsg(
        `✅ Compte administrateur enregistré en base de données pour ${newAdmin.name}. Les identifiants ont été envoyés par email.`
      );
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
      setAdmins(prev => prev.map(a => (a.id === admin.id ? updated : a)));
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
          onClick={handleOpenForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-400 text-white rounded-xl font-bold text-sm hover:from-yellow-600 hover:to-amber-500 transition-all shadow-md cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Fermer le formulaire' : 'Nouvel Admin'}
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{successMsg}</p>
          <button onClick={() => setSuccessMsg(null)} className="ml-auto text-emerald-400 hover:text-emerald-600 cursor-pointer text-lg font-bold">×</button>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer text-lg font-bold">×</button>
        </div>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-yellow-500" />
              Créer un Admin Platform
            </h2>
            <span className="text-xs bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Mot de passe auto-généré
            </span>
          </div>

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
                  placeholder="admin@innovsahel.ml"
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
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Mot de passe par défaut *
                  </label>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Proposé & modifiable
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRegeneratePassword}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                    title="Générer un autre mot de passe"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regénérer</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                    title="Copier le mot de passe"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.temporaryPassword}
                  onChange={e => setForm(f => ({ ...f, temporaryPassword: e.target.value }))}
                  required
                  minLength={6}
                  placeholder="Génération en cours..."
                  className="w-full pl-9 pr-10 py-2.5 border border-amber-300 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-amber-50/30 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Composition Checklist */}
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-600 font-medium">
                <span className="text-slate-400 font-bold">Composition :</span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Lettres (A-Z, a-z)
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Chiffres (0-9)
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Symboles spéciaux (!@#$)
                </span>
                <span className="text-slate-400 italic">| Modifiable</span>
              </div>

              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                <Send className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <span>Ce mot de passe sera enregistré en base de données et envoyé par email à l'administrateur.</span>
              </p>
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
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-500 to-amber-400 text-white hover:from-yellow-600 hover:to-amber-500 disabled:opacity-50 cursor-pointer flex items-center gap-2 shadow-md"
              >
                {isCreating && <Loader className="w-4 h-4 animate-spin" />}
                Créer l'admin & Envoyer identifiants
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

      {/* Success Modal Recap for Admin Creation */}
      {createdAdminSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-200 text-left space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                <Crown className="w-7 h-7 text-yellow-600" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Enregistrement Base de Données
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Compte Admin créé avec succès !
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  L'administrateur a été enregistré dans la base de données et ses identifiants ont été envoyés par email.
                </p>
              </div>
            </div>

            {/* Recap Card */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                <span className="text-slate-500 font-bold">Nom complet :</span>
                <span className="font-extrabold text-slate-900">{createdAdminSuccessModal.name}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                <span className="text-slate-500 font-bold">Email de connexion :</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                  {createdAdminSuccessModal.email}
                </span>
              </div>

              <div className="border-b border-slate-200 pb-2.5">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-slate-500 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    Mot de passe temporaire :
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(createdAdminSuccessModal.password);
                      setModalCopied(true);
                      setTimeout(() => setModalCopied(false), 2500);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {modalCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier mot de passe</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 bg-amber-50/60 border border-amber-300 rounded-xl font-mono text-sm text-amber-950 font-bold text-center tracking-wider">
                  {createdAdminSuccessModal.password}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-bold">Rôle :</span>
                <span className="font-bold text-slate-800">Administrateur Platform</span>
              </div>
            </div>

            {/* Explanatory note */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-[11px] text-blue-900 leading-relaxed">
              <Send className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p>
                Un email de bienvenue contenant ces accès et le lien de connexion a été transmis à l'administrateur. Il pourra se connecter immédiatement à son espace.
              </p>
            </div>

            {/* Footer Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCreatedAdminSuccessModal(null)}
                className="w-full py-3 bg-[#062326] hover:bg-[#093539] text-white rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer text-center"
              >
                Compris & Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
