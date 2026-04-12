"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";
import { downloadGalleryImage } from "@/lib/gallery-download";
import { FAVORITES_UPDATE_EVENT, notifyFavoritesChanged, readFavorites, toggleFavorite } from "@/lib/favorites";
import { DownloadIcon, HeartIcon } from "./GalleryIcons";

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
  const [fav, setFav] = useState(false);

  const open = useCallback((i: GalleryItem) => setItem(i), []);

  useEffect(() => {
    if (!item) return;
    setFav(readFavorites().includes(item.src));
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const sync = () => setFav(readFavorites().includes(item.src));
    window.addEventListener(FAVORITES_UPDATE_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_UPDATE_EVENT, sync);
  }, [item]);

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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/92 p-4"
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
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[min(75vh,820px)] w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                className="rounded-full bg-white/15 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                aria-label="Download image"
                onClick={async () => {
                  try {
                    await downloadGalleryImage(item);
                  } catch {
                    /* ignore */
                  }
                }}
              >
                <DownloadIcon className="size-6" />
              </button>
              <button
                type="button"
                className={`rounded-full bg-white/15 p-3 backdrop-blur-sm transition-colors hover:bg-white/25 ${fav ? "text-red-300" : "text-white"}`}
                aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={fav}
                onClick={() => {
                  const now = toggleFavorite(item.src);
                  setFav(now);
                  notifyFavoritesChanged();
                }}
              >
                <HeartIcon className="size-6" filled={fav} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
