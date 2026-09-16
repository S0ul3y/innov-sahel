import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Info
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, setActiveTab, users } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Veuillez saisir votre adresse email professionnelle.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();

      // Check for admin
      if (cleanEmail.includes('admin') || cleanEmail === 'admin@impactsahel.org') {
        const adminUser = users.find(u => u.role === 'admin') || users[0];
        login('admin', adminUser);
        return;
      }

      // Check for porteur
      const porteurUser = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'porteur');
      if (porteurUser) {
        login('porteur', porteurUser);
        return;
      }

      if (cleanEmail.includes('porteur') || cleanEmail.includes('diallo') || cleanEmail.includes('coulibaly')) {
        const porteurDefault = users.find(u => u.role === 'porteur') || users[1];
        login('porteur', porteurDefault);
        return;
      }

      // Default fallback if password supplied: offer helpful error
      setErrorMsg('Identifiants non reconnus. Vous pouvez utiliser les boutons d’accès direct ci-dessous ou saisir un des comptes de démonstration indiqués.');
    }, 400);
  };

  return (
    <div className="py-6 sm:py-10 max-w-2xl mx-auto space-y-8">
      {/* Back to Citizen mode button */}
      <div className="flex items-center justify-between">
        <button
          id="login-back-to-home"
          onClick={() => setActiveTab('accueil')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#08233C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#38B6FF]" />
          Retour à l'espace Citoyen
        </button>

        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Plateforme InnovSahel • District de Bamako
        </span>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#08233C] to-[#0B3B60] text-[#FADB58] mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#08233C] tracking-tight">
              Espace Gestion & Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
              Connexion sécurisée réservée à l'équipe <strong>IMPACT SAHEL</strong> et aux <strong>Porteurs d'initiatives</strong>.
            </p>
          </div>
        </div>

        {/* Public Citizen Note */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
          <Info className="w-4 h-4 text-[#38B6FF] shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-[#08233C]">Vous êtes un citoyen de Bamako ?</strong>
            <p className="text-slate-600 mt-0.5">
              Aucun compte ni mot de passe n'est requis pour consulter les actualités, découvrir les initiatives de votre commune, soumettre une idée ou signaler un problème.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse Email ou Identifiant
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: admin@impactsahel.org"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => alert("Pour la démonstration, utilisez l'un des boutons d'accès direct ci-dessous ou le mot de passe 'admin123'.")}
                className="text-[11px] font-semibold text-[#0B3B60] hover:text-[#38B6FF] transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#38B6FF] focus:ring-2 focus:ring-[#38B6FF]/20 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#08233C] hover:bg-[#0B3B60] text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4 text-[#FADB58]" />
              </>
            )}
          </button>
        </form>

        {/* Temporary Direct Access Section as explicitly requested by user */}
        <div className="pt-6 border-t border-dashed border-amber-300/80 space-y-4">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Accès directs de démonstration
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Ces deux boutons permettent d'accéder directement aux tableaux de bord sans saisir d'identifiants. <em>(À retirer après raccordement de la base de données).</em>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Direct Button 1: Admin IMPACT SAHEL */}
            <button
              id="login-direct-admin-button"
              type="button"
              onClick={() => login('admin')}
              className="group p-4 rounded-2xl bg-gradient-to-br from-[#08233C] to-[#0B3B60] text-white text-left shadow-sm hover:shadow-md transition-all border border-slate-700 hover:border-[#FADB58] cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#FADB58] text-[#08233C] flex items-center justify-center font-bold shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/15 text-slate-200">
                  Supervision
                </span>
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white group-hover:text-[#FADB58] transition-colors leading-tight">
                  Admin IMPACT SAHEL
                </h2>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Tableau de bord : modération des signalements, export CSV, gestion des comptes.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#FADB58]">
                <span>Accéder comme Admin</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Direct Button 2: Porteur d'initiative */}
            <button
              id="login-direct-porteur-button"
              type="button"
              onClick={() => login('porteur')}
              className="group p-4 rounded-2xl bg-slate-50 hover:bg-white text-slate-900 text-left shadow-xs hover:shadow-md transition-all border border-slate-300 hover:border-[#38B6FF] cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#38B6FF] text-[#08233C] flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#0B3B60]">
                  Sanuya Plastique
                </span>
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-[#08233C] group-hover:text-[#0B3B60] transition-colors leading-tight">
                  Porteur d'initiative
                </h2>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Tableau de bord : publication d'actualités, suivi des vues et des avis citoyens.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-[#0B3B60]">
                <span>Accéder comme Porteur</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Credentials guide for testing */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
          <span className="font-bold text-slate-800 block">
            🔑 Comptes de test configurés :
          </span>
          <ul className="space-y-1 text-slate-600">
            <li>
              • <strong>Admin IMPACT SAHEL :</strong> <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800 font-mono">admin@impactsahel.org</code> / mot de passe : n'importe lequel
            </li>
            <li>
              • <strong>Porteur d'initiative :</strong> <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-800 font-mono">fatoumata.diallo@sanuyaplastique.ml</code> / mot de passe : n'importe lequel
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
