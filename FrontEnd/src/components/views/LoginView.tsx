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
  ArrowLeft,
  Info
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginWithApi, login, setActiveTab } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Veuillez saisir votre adresse email.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setIsLoading(true);

    try {
      // Appel API réel vers le Backend NestJS / MySQL
      await loginWithApi({ email: email.trim(), password });
    } catch (err: any) {
      console.warn('Échec connexion API:', err);
      // Si l'API renvoie un message (ex: mot de passe incorrect)
      const message = err?.message || 'Identifiants invalides ou serveur indisponible.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setErrorMsg('');
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
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
              Connexion sécurisée pour l'équipe <strong>IMPACT SAHEL</strong> et les porteurs d'initiatives <strong>Lab'Citoyen</strong>.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Échec de la connexion</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-800" htmlFor="login-email">
              Adresse email professionnelle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="moussa.cisse@impactsahel.org"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold text-slate-800" htmlFor="login-password">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                8 caractères minimum
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-5 h-5" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#08233C] hover:bg-[#0B3B60] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Vérification des identifiants...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4 text-[#FADB58]" />
              </>
            )}
          </button>
        </form>

        {/* Comptes officiels configurés dans MySQL */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Info className="w-4 h-4 text-[#38B6FF]" />
            <span>Comptes configurés dans la base de données :</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Compte 1: Moussa Cissé — Super Admin */}
            <button
              type="button"
              onClick={() => handleQuickFill('moussa.cisse@impactsahel.org', 'Admin1_TempPass2025!')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#38B6FF] bg-slate-50 hover:bg-white text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#08233C] group-hover:text-[#38B6FF]">
                  Moussa Cissé
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  👑 Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">moussa.cisse@impactsahel.org</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Cliquez pour pré-remplir</span>
            </button>

            {/* Compte 2: Aminata Traoré — Admin Platform */}
            <button
              type="button"
              onClick={() => handleQuickFill('aminata.traore@impactsahel.org', 'Admin2_TempPass2025!')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#38B6FF] bg-slate-50 hover:bg-white text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#08233C] group-hover:text-[#38B6FF]">
                  Aminata Traoré
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  🛡 Admin Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">aminata.traore@impactsahel.org</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Cliquez pour pré-remplir</span>
            </button>

            {/* Compte 3: Fatoumata Diallo — Porteur */}
            <button
              type="button"
              onClick={() => handleQuickFill('fatoumata.diallo@labcitoyen.org', 'Porteur1_TempPass2025!')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white text-left transition-all group cursor-pointer sm:col-span-1"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#08233C] group-hover:text-blue-600">
                  Fatoumata Diallo
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  ⭐ Porteur
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">fatoumata.diallo@labcitoyen.org</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Jardins Partagés de Hamdallaye</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
