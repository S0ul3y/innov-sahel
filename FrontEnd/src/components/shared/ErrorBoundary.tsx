import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = '/accueil';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-[#08233C]">
              {this.props.fallbackTitle || "Une interruption d'affichage est survenue"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              La page n'a pas pu se charger correctement. Vous pouvez actualiser la vue ou revenir à la page d'accueil en toute sécurité.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#08233C] text-white rounded-xl text-xs font-bold hover:bg-[#0B3B60] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#FADB58]" />
              <span>Actualiser la page</span>
            </button>

            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#38B6FF]" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
