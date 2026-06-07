import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { galleryApi } from '../services/api';
import type { GalleryImage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    galleryApi.getAll().then(setImages).catch(() => undefined);
  }, []);

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  return (
    <section id="photos" className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-sky-100 text-sky-700 rounded-full px-4 py-1 text-sm font-medium mb-4">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Real Results from Real Calgary Homes
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Every room cleaned to the highest standard — consistently, every visit.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-200 aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <img
                  src={`${API_BASE}${img.url}`}
                  alt={img.caption ?? 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{img.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 mb-10">
            <ImageOff className="w-12 h-12 mb-3 text-slate-300" />
            <p className="text-sm">Photos coming soon. Check back shortly.</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to="/booking"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Request Free Estimate
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-4xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${API_BASE}${images[lightbox].url}`}
              alt={images[lightbox].caption ?? 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {images[lightbox].caption && (
              <p className="text-white/70 text-sm text-center mt-3">{images[lightbox].caption}</p>
            )}
            <p className="text-white/40 text-xs text-center mt-1">{lightbox + 1} / {images.length}</p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
