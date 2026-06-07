import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ImageOff, ZoomIn } from 'lucide-react';
import { galleryApi } from '../services/api';
import type { GalleryImage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

interface Props {
  homeOnly?: boolean;
}

export default function Gallery({ homeOnly = false }: Props) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    galleryApi.getAll(homeOnly ? { home: true } : undefined)
      .then(setImages)
      .catch(() => undefined);
  }, [homeOnly]);

  const resetZoom = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };

  const openLightbox = (idx: number) => { setLightbox(idx); resetZoom(); };
  const closeLightbox = () => { setLightbox(null); resetZoom(); };

  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    resetZoom();
  }, [images.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % images.length));
    resetZoom();
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  // Attach non-passive wheel listener so preventDefault actually works
  useEffect(() => {
    const el = imageContainerRef.current;
    if (!el || lightbox === null) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => {
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta));
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [lightbox]);

  // Double-click to toggle zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => {
      if (z > 1) { setOffset({ x: 0, y: 0 }); return 1; }
      return 2;
    });
  };

  // Drag-to-pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const handleMouseUp = () => { dragging.current = false; };

  return (
    <section id="photos" className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
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
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-7 h-7" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image container */}
          <div
            ref={imageContainerRef}
            className="relative mx-16 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            <img
              src={`${API_BASE}${images[lightbox].url}`}
              alt={images[lightbox].caption ?? 'Gallery image'}
              draggable={false}
              className="max-w-[80vw] max-h-[82vh] object-contain rounded-lg select-none"
              style={{
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                transition: dragging.current ? 'none' : 'transform 0.15s ease',
              }}
            />

            {/* Zoom badge — visible only when zoomed */}
            {zoom > 1 && (
              <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
                {Math.round(zoom * 100)}%
              </span>
            )}

            {/* Hint — visible only at 1x */}
            {zoom === 1 && (
              <span className="absolute bottom-3 right-3 bg-black/40 text-white/60 text-xs px-2 py-1 rounded-full pointer-events-none">
                scroll or double-click to zoom
              </span>
            )}
          </div>

          {/* Caption + counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            {images[lightbox].caption && (
              <p className="text-white/70 text-sm mb-1">{images[lightbox].caption}</p>
            )}
            <p className="text-white/40 text-xs">{lightbox + 1} / {images.length}</p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-10"
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
