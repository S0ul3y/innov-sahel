import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lightbulb, 
  X, 
  Upload, 
  Users, 
  Sparkles, 
  Trees, 
  GraduationCap, 
  HeartPulse, 
  Route, 
  Sun, 
  Palette, 
  MoreHorizontal,
  Check,
  Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadsController } from '../../controllers/uploadsController';

const CATEGORIES = [
  { id: 'Jeunesse', label: 'Jeunesse & Emploi', icon: Users },
  { id: 'Femmes', label: 'Femmes & Égalité', icon: Sparkles },
  { id: 'Environnement et assainissement', label: 'Environnement & Déchets', icon: Trees },
  { id: 'Éducation', label: 'Éducation & Écoles', icon: GraduationCap },
  { id: 'Santé', label: 'Santé & Hygiène', icon: HeartPulse },
  { id: 'Infrastructures et voirie', label: 'Voirie & Routes', icon: Route },
  { id: 'Éclairage public', label: 'Éclairage public', icon: Sun },
  { id: 'Activités culturelles et sportives', label: 'Culture & Sport', icon: Palette },
  { id: 'Autre', label: 'Autre idée', icon: MoreHorizontal }
];

export const IdeaModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedCommuneId, communes, addContribution } = useApp();

  const [communeId, setCommuneId] = useState<string>(selectedCommuneId);
  const [category, setCategory] = useState<string>('Jeunesse');
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (activeModal !== 'idea') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Veuillez décrire votre proposition d’idée avant d’envoyer.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addContribution({
        type: 'idee',
        communeId,
        category,
        description: description.trim(),
        photoUrl: photos[0] || undefined,
        photos: photos,
        citizenName: citizenName.trim() || undefined,
        citizenPhone: citizenPhone.trim() || undefined
      });

      setActiveModal(null);
      setDescription('');
      setPhotos([]);
      setCitizenName('');
      setCitizenPhone('');
      setError('');
    } catch (err: any) {
      console.error('Erreur soumission idée:', err);
      setError(err?.message || 'Une erreur est survenue lors de l\'envoi de votre idée. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploadingPhoto) return;
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setError('');

    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      setError('Vous avez déjà atteint la limite maximale de 5 photos.');
      return;
    }

    const filesToUpload = Array.from(fileList).slice(0, remainingSlots);
    setIsUploadingPhoto(true);

    try {
      const results = await UploadsController.uploadPublicImages(filesToUpload);
      const newUrls = results.map(r => r.url).filter(Boolean);
      setPhotos(prev => [...prev, ...newUrls].slice(0, 5));
    } catch (err: any) {
      console.warn('Erreur upload photos citoyennes:', err);
      setError(err?.message || "Impossible d'enregistrer les photos sélectionnées. Vous pouvez soumettre sans photo.");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
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
          <div className="bg-gradient-to-r from-[#FADB58] to-[#f5cb25] p-5 sm:p-6 text-[#08233C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#08233C] text-[#FADB58] flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                  Je propose une idée
                </h3>
                <p className="text-xs font-semibold opacity-90">
                  Participez à l'amélioration de votre commune
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-full bg-[#08233C]/10 hover:bg-[#08233C]/20 transition-colors cursor-pointer"
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
                1. Commune concernée <span className="text-amber-700">*</span>
              </label>
              <select
                id="idea-commune-select"
                value={communeId}
                onChange={(e) => setCommuneId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF]"
              >
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.neighborhoods.slice(0, 3).join(', ')}...)
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selection with visual pictograms */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                2. Catégorie de votre idée <span className="text-amber-700">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#08233C] bg-[#FADB58]/30 text-[#08233C] font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#08233C]' : 'text-slate-500'}`} />
                      <span className="text-[11px] leading-tight line-clamp-1">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Idea Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                3. Décrivez votre idée <span className="text-amber-700">*</span>
              </label>
              <textarea
                id="idea-description-input"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Exemple : Installer des bacs de tri des déchets devant le marché de Korofina et impliquer les jeunes du quartier le dimanche..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#38B6FF] resize-none"
              />
            </div>

            {/* Photos Attachment (Facultatif - Max 5 photos) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  4. Ajouter des photos (facultatif)
                </label>
                <span className={`text-[11px] font-bold ${photos.length >= 5 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {photos.length}/5 photo{photos.length > 1 ? 's' : ''} {photos.length >= 5 ? '(max atteint)' : ''}
                </span>
              </div>

              {photos.length < 5 && (
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-medium text-slate-600 mb-2">
                  {isUploadingPhoto ? (
                    <Loader className="w-4 h-4 text-amber-600 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-slate-500" />
                  )}
                  <span>
                    {isUploadingPhoto
                      ? 'Téléversement en cours...'
                      : `Choisir ou prendre des photos (max 5) - Reste ${5 - photos.length}`}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={isUploadingPhoto}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Grille des photos téléversées (jusqu'à 5) */}
              {photos.length > 0 && (
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs">
                      <img 
                        src={url.startsWith('http') ? url : UploadsController.getImageUrl(url)} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer transition-transform hover:scale-110"
                        title="Supprimer cette photo"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/60 text-white rounded text-[9px] font-bold">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Citizen Contact */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <p className="text-[11px] text-slate-500 font-medium">
                🔒 Données facultatives (gardées confidentielles par IMPACT SAHEL pour suivi interne) :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Votre prénom (facultatif)"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
                />
                <input
                  type="tel"
                  placeholder="Téléphone (facultatif)"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#38B6FF]"
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
                id="submit-idea-button"
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FADB58] text-[#08233C] font-extrabold text-sm hover:bg-[#ebd048] transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-[#08233C]" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Envoyer mon idée</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
