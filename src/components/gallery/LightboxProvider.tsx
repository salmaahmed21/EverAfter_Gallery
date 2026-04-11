"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";

type Ctx = { open: (item: GalleryItem) => void };

const LightboxContext = createContext<Ctx | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }
  return ctx;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<GalleryItem | null>(null);

  const open = useCallback((i: GalleryItem) => setItem(i), []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item]);

  useEffect(() => {
    if (item) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {item ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo"
          onClick={() => setItem(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-[110] rounded-sm px-3 py-1 font-manrope text-2xl leading-none text-white hover:bg-white/10"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setItem(null);
            }}
          >
            ×
          </button>
          <div
            className="relative h-[min(90vh,900px)] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
