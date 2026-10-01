"use client";

import { useCallback, useEffect, useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (images.length === 0) return null;

  return (
    <>
      <div className={`grid gap-3 ${images.length === 1 ? "" : "grid-cols-2 sm:grid-cols-3"}`}>
        {images.map((src, i) => (
          <button key={src} type="button" onClick={() => setOpen(i)}
            className="group overflow-hidden rounded-xl bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/50"
            aria-label={`Open photo ${i + 1} of ${images.length}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${title} — photo ${i + 1}`} loading="lazy"
              className={`w-full object-cover transition duration-500 group-hover:scale-105 ${images.length === 1 ? "max-h-[520px]" : "aspect-square"}`} />
          </button>
        ))}
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 p-4" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[open]} alt={`${title} — photo ${open + 1}`} className="max-h-[85vh] max-w-full rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-white hover:bg-white/20" aria-label="Close">✕</button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20" aria-label="Previous photo">‹</button>
              <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/20" aria-label="Next photo">›</button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">{open + 1} / {images.length}</p>
            </>
          )}
        </div>
      )}
    </>
  );
}
