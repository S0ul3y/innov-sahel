import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { UploadsController } from '../../controllers/uploadsController';

interface ImageUploadProps {
  value?: string; // URL actuelle (existante ou uploadée)
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image de couverture',
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSizeMB = 5,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Le fichier dépasse ${maxSizeMB} MB.`);
      return;
    }
    // Aperçu local immédiat
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);
    try {
      const result = await UploadsController.uploadImage(file);
      const finalUrl = UploadsController.getImageUrl(result.url);
      setPreviewUrl(finalUrl);
      onChange(result.url); // Stocke le chemin relatif /uploads/...
    } catch (e: any) {
      setError(e.message || 'Erreur lors du téléversement.');
      setPreviewUrl(value || '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayUrl = previewUrl
    ? (previewUrl.startsWith('http') || previewUrl.startsWith('blob:')
        ? previewUrl
        : UploadsController.getImageUrl(previewUrl))
    : '';

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
        {label}
      </label>

      {displayUrl ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 group">
          <img
            src={displayUrl}
            alt="Aperçu"
            className="w-full h-40 object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
        >
          {isUploading ? (
            <Loader className="w-8 h-8 text-emerald-500 animate-spin" />
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mb-2 transition-colors" />
              <p className="text-xs text-slate-500 font-medium">
                Glisser-déposer ou <span className="text-emerald-600 font-bold">cliquer</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP — max {maxSizeMB} MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

// ─── Version Multi-images (Carrousel) ────────────────────────────────────────
interface MultiImageUploadProps {
  value?: Array<{ url: string; caption?: string }>;
  onChange: (images: Array<{ url: string; caption?: string }>) => void;
  label?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  label = 'Images du carrousel',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError(null);
    setIsUploading(true);
    try {
      const results = await UploadsController.uploadImages(Array.from(files));
      const newImages = results.map((r) => ({ url: r.url, caption: '' }));
      onChange([...value, ...newImages]);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du téléversement.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    onChange(value.map((img, i) => (i === index ? { ...img, caption } : img)));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
        {label}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((img, i) => (
          <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-200">
            <img
              src={UploadsController.getImageUrl(img.url)}
              alt={img.caption || `Image ${i + 1}`}
              className="w-full h-24 object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
            <input
              type="text"
              value={img.caption || ''}
              onChange={(e) => updateCaption(i, e.target.value)}
              placeholder="Légende..."
              className="w-full text-[10px] px-2 py-1 bg-slate-50 border-t border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all disabled:opacity-50"
        >
          {isUploading ? (
            <Loader className="w-6 h-6 text-emerald-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-[10px] text-slate-500 mt-1">Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
