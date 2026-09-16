import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  CheckCircle2, 
  Sparkles,
  Award,
  Globe
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#08233C] via-[#0B3B60] to-[#08233C] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <span className="bg-[#FADB58] text-[#08233C] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Initiative Citoyenne & Inclusive
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            À propos d'InnovSahel & du Lab'Citoyen
          </h1>
          <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-medium">
            Une passerelle numérique conçue pour renforcer la participation citoyenne, la transparence locale et l'autonomisation des jeunes et des femmes à Bamako.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#08233C] text-[#FADB58] flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-[#08233C]">
            Rapprocher le citoyen de sa commune
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rendre lisibles les services municipaux, les contacts des mairies et permettre aux résidents des 6 communes de faire entendre directement leurs besoins et suggestions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#38B6FF] text-[#08233C] flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-[#08233C]">
            Valoriser les initiatives des jeunes & des femmes
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Donner une vitrine numérique de premier ordre aux projets écologiques, artisanaux, sociaux et technologiques incubés par le projet Lab'Citoyen.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-[#08233C]">
            Accessibilité & sobriété numérique
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Plateforme pensée pour le contexte sahélien : ultra-légère, mode bas débit pour les réseaux lents, compatible smartphones d'entrée de gamme, et sans inscription obligatoire.
          </p>
        </div>
      </section>

      {/* Le Porteur de projet : IMPACT SAHEL */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#08233C] text-[#FADB58] flex items-center justify-center font-black text-xl">
            IS
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#08233C]">
              Organisation Porteuse : ONG IMPACT SAHEL
            </h2>
            <span className="text-xs text-[#38B6FF] font-bold">
              Coordination générale du projet Lab'Citoyen Bamako
            </span>
          </div>
        </div>

        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
          L'ONG <strong>IMPACT SAHEL</strong> œuvre pour le renforcement du pouvoir d'agir des communautés locales au Mali et dans la bande sahélienne. À travers le projet <em>Lab'Citoyen Bamako</em>, elle assure :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>L'identification et l'accompagnement technique des jeunes et femmes porteurs de projets à fort impact social.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Le dialogue permanent avec les 6 équipes municipales du District de Bamako pour la prise en compte des contributions.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>La formation au numérique, la mise à disposition de kits de communication et la maintenance de la plateforme InnovSahel.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>La restitution périodique sous forme de rapports de synthèse remis aux maires et aux partenaires financiers.</span>
          </div>
        </div>
      </section>

      {/* Partenaires institutionnels & Bailleurs */}
      <section className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-6">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Partenaires institutionnels & Bailleurs de fonds
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="font-extrabold text-sm text-[#08233C]">Mairies I à VI</span>
            <span className="text-[10px] text-slate-500">District de Bamako</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="font-extrabold text-sm text-[#08233C]">Coopération Internationale</span>
            <span className="text-[10px] text-slate-500">Appui au développement local</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="font-extrabold text-sm text-[#08233C]">Collectifs Féminins</span>
            <span className="text-[10px] text-slate-500">Réseau des femmes actives</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="font-extrabold text-sm text-[#08233C]">Conseil National Jeunesse</span>
            <span className="text-[10px] text-slate-500">Antennes communales</span>
          </div>
        </div>
      </section>

      {/* Charte & Protection des Données (Section 12) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-[#08233C]">
            Protection des données personnelles & Charte citoyenne
          </h3>
        </div>
        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            • <strong>Anonymat et liberté :</strong> La consultation de la plateforme, la soumission d'idées, le signalement de problèmes et le dépôt de commentaires ne nécessitent aucune création de compte. Vous restez maître de vos informations.
          </p>
          <p>
            • <strong>Confidentialité stricte :</strong> Les coordonnées éventuellement transmises (téléphone, nom) lors d'un signalement ne sont jamais publiées sur le site. Elles sont exclusivement accessibles à l'équipe de modération IMPACT SAHEL et aux services techniques municipaux pour les nécessités de traitement.
          </p>
          <p>
            • <strong>Respect et bienveillance :</strong> Les commentaires injurieux, diffamatoires ou contraires à la cohésion sociale sont systématiquement modérés.
          </p>
        </div>
      </section>

      {/* Contact IMPACT SAHEL */}
      <section className="bg-[#08233C] text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-xl space-y-4">
          <h3 className="text-lg font-extrabold text-[#FADB58]">
            Contacter l'équipe du projet InnovSahel
          </h3>
          <p className="text-xs text-slate-300">
            Une question sur la plateforme, un partenariat à proposer ou un besoin d'assistance ?
          </p>
          <div className="space-y-2 text-xs text-slate-200 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#38B6FF]" />
              <span>Siège IMPACT SAHEL : Badalabougou, Rue 14, Porte 25, Bamako, Mali</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#38B6FF]" />
              <span>+223 20 22 45 80 / +223 76 12 34 56</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#38B6FF]" />
              <span>contact@impactsahel.org / contact@innovsahel.ml</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
