import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ImageOff, ZoomIn, ZoomOut } from 'lucide-react';
import { galleryApi } from '../services/api';
import type { GalleryImage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface Props {
  homeOnly?: boolean;
}

export default function Gallery({ homeOnly = false }: Props) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    galleryApi.getAll(homeOnly ? { home: true } : undefined)
      .then(setImages)
      .catch(() => undefined);
  }, [homeOnly]);

  const openLightbox = (idx: number) => { setLightbox(idx); setZoom(1); };
  const closeLightbox = () => { setLightbox(null); setZoom(1); };

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    setZoom(1);
  }, [images.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % images.length));
    setZoom(1);
  }, [images.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, z + 0.5));
      if (e.key === '-') setZoom((z) => Math.max(1, z - 0.5));
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
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-slate-200 aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <img
                  src={`${API_BASE}${img.url}`}
                  alt={img.caption ?? 'Gallery image'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
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
        <div className="flex justify-center gap-4">
          {homeOnly && images.length > 0 && (
            <Link
              to="/gallery"
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              View All Photos
            </Link>
          )}
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
          onClick={closeLightbox}
        >
          {/* Top bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 rounded-full px-4 py-2">
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.5)); }}
              disabled={zoom <= 1}
              className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom out (−)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white/60 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(3, z + 0.5)); }}
              disabled={zoom >= 3}
              className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom in (+)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
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
            className="max-w-4xl max-h-[85vh] mx-16 overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: zoom > 1 ? 'move' : 'default' }}
          >
            <img
              src={`${API_BASE}${images[lightbox].url}`}
              alt={images[lightbox].caption ?? 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              draggable={false}
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
