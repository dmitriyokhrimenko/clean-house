import { useState, useEffect, useRef } from 'react';
import { Trash2, ChevronUp, ChevronDown, Upload, Pencil, Check, X, ImageOff } from 'lucide-react';
import { galleryApi, uploadApi } from '../../services/api';
import type { GalleryImage } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    galleryApi.getAll()
      .then(setImages)
      .catch(() => setError('Failed to load gallery.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls = await uploadApi.uploadFiles(Array.from(files));
      for (const url of urls) {
        await galleryApi.create({ url });
      }
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await galleryApi.delete(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      setError('Failed to delete image.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= images.length) return;

    const updated = [...images];
    const aOrder = updated[index].sortOrder;
    const bOrder = updated[swapIndex].sortOrder;

    // Swap in local state immediately for responsive feel
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    updated[index] = { ...updated[index], sortOrder: aOrder };
    updated[swapIndex] = { ...updated[swapIndex], sortOrder: bOrder };
    setImages(updated);

    try {
      await Promise.all([
        galleryApi.update(updated[index].id, { sortOrder: aOrder }),
        galleryApi.update(updated[swapIndex].id, { sortOrder: bOrder }),
      ]);
    } catch {
      setError('Failed to reorder. Reloading...');
      load();
    }
  };

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setEditCaption(img.caption ?? '');
  };

  const saveCaption = async (id: string) => {
    try {
      const updated = await galleryApi.update(id, { caption: editCaption.trim() || null });
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
    } catch {
      setError('Failed to save caption.');
    } finally {
      setEditingId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
          <p className="text-slate-500 text-sm mt-1">
            {images.length} image{images.length !== 1 ? 's' : ''} — drag to reorder or use arrows
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading…' : 'Upload Images'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
          <ImageOff className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-medium text-slate-500">No images yet</p>
          <p className="text-sm mt-1">Click "Upload Images" to add your first photo</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={`${API_BASE}${img.url}`}
                  alt={img.caption ?? 'Gallery image'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption + controls */}
              <div className="p-3 flex flex-col gap-2">
                {editingId === img.id ? (
                  <div className="flex gap-1.5">
                    <input
                      autoFocus
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') void saveCaption(img.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      placeholder="Add caption…"
                      className="flex-1 min-w-0 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button onClick={() => void saveCaption(img.id)} className="text-emerald-600 hover:text-emerald-700">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(img)}
                    className="flex items-center gap-1.5 text-left text-xs text-slate-400 hover:text-slate-700 transition-colors group/caption"
                  >
                    <Pencil className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{img.caption || 'Add caption…'}</span>
                  </button>
                )}

                <div className="flex items-center justify-between">
                  {/* Reorder */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => void handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move left"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => void handleMove(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move right"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => void handleDelete(img.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
