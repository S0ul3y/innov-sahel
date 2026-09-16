import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  X, 
  Upload, 
  Trash2, 
  Droplets, 
  Sun, 
  Construction, 
  ShieldAlert, 
  Building, 
  MoreHorizontal, 
  MapPin,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PROBLEM_CATEGORIES = [
  { id: 'Ordures et insalubrité', label: 'Ordures & Insalubrité', icon: Trash2 },
  { id: 'Eau et assainissement', label: 'Eau & Caniveaux', icon: Droplets },
  { id: 'Éclairage public', label: 'Éclairage public', icon: Sun },
  { id: 'Voirie et routes', label: 'Nids-de-poule & Voirie', icon: Construction },
  { id: 'Sécurité', label: 'Sécurité de quartier', icon: ShieldAlert },
  { id: 'Infrastructures dégradées', label: 'Bâtiments dégradés', icon: Building },
  { id: 'Autre', label: 'Autre problème', icon: MoreHorizontal }
];

export const ProblemModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedCommuneId, communes, addContribution } = useApp();

  const [communeId, setCommuneId] = useState<string>(selectedCommuneId);
  const [category, setCategory] = useState<string>('Ordures et insalubrité');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (activeModal !== 'problem') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Veuillez décrire le problème constaté pour que les services municipaux puissent intervenir.');
      return;
    }

    addContribution({
      type: 'signalement',
      communeId,
      category,
      description: description.trim(),
      photoUrl: photoUrl || undefined,
      locationText: locationText.trim() || undefined,
      gpsCoordinates,
      citizenName: citizenName.trim() || undefined,
      citizenPhone: citizenPhone.trim() || undefined
    });

    setActiveModal(null);
    setDescription('');
    setPhotoUrl('');
    setLocationText('');
    setGpsCoordinates(undefined);
    setCitizenName('');
    setCitizenPhone('');
    setError('');
  };

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoUrl(objectUrl);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationText('Quartier sélectionné par défaut');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setGpsCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationText(`Position GPS relevée (${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°)`);
      },
      () => {
        setIsLocating(false);
        setLocationText('Près du marché principal');
      },
      { timeout: 8000 }
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 sm:p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                  Je signale un problème
                </h3>
                <p className="text-xs font-semibold text-amber-100">
                  Alertez la mairie et IMPACT SAHEL en toute simplicité
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-sm">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            {/* Commune Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                1. Commune où se situe le problème <span className="text-red-500">*</span>
              </label>
              <select
                id="problem-commune-select"
                value={communeId}
                onChange={(e) => setCommuneId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.neighborhoods.slice(0, 3).join(', ')}...)
                  </option>
                ))}
              </select>
            </div>

            {/* Problem Category with pictograms */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                2. Nature du problème <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROBLEM_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-600' : 'text-slate-500'}`} />
                      <span className="text-[11px] leading-tight line-clamp-1">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                3. Décrivez le problème constaté <span className="text-red-500">*</span>
              </label>
              <textarea
                id="problem-description-input"
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Exemple : Caniveau bouché par des sacs plastiques créant de l'eau stagnante et des odeurs devant l'école..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Location (Repère ou GPS) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                4. Lieu précis ou repère
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Quartier, nom de la rue, boutique proche..."
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                  title="Utiliser la position GPS de mon téléphone"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isLocating ? 'Recherche...' : 'GPS'}</span>
                </button>
              </div>
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                5. Photo du problème <span className="text-slate-400 font-normal">(fortement encouragé)</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-amber-200 rounded-xl p-3 bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer text-xs font-medium text-amber-900">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>{photoUrl ? 'Changer la photo' : 'Prendre une photo avec mon téléphone'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSimulatedImageUpload}
                    className="hidden"
                  />
                </label>
                {photoUrl && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                    <img src={photoUrl} alt="Aperçu" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Citizen Contact */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">
                🔒 Vos coordonnées (facultatives, confidentielles pour les agents municipaux) :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Votre prénom (facultatif)"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="tel"
                  placeholder="Téléphone (facultatif)"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                id="submit-problem-button"
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-sm hover:from-amber-600 hover:to-amber-700 transition-all shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Transmettre le signalement</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
