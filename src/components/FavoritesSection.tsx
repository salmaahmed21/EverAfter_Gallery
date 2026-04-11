"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";
import { FAVORITES_UPDATE_EVENT, readFavorites } from "@/lib/favorites";
import { GalleryTile } from "./gallery/GalleryTile";

export function FavoritesSection({ allItems }: { allItems: GalleryItem[] }) {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const on = () => setTick((n) => n + 1);
    window.addEventListener(FAVORITES_UPDATE_EVENT, on);
    return () => window.removeEventListener(FAVORITES_UPDATE_EVENT, on);
  }, []);

  const favorites = useMemo(() => {
    if (!mounted) return [];
    const set = new Set(readFavorites());
    return allItems.filter((i) => set.has(i.src));
  }, [allItems, tick, mounted]);

  return (
    <section className="mx-auto mb-32 max-w-screen-2xl px-8" id="favorites">
      <div className="mb-12 flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
        <h2 className="font-notoSerif text-on-surface text-2xl italic">Favorites</h2>
        <div className="h-[1px] w-12 bg-outline-variant/20"></div>
      </div>
      {favorites.length === 0 ? (
        <p className="font-manrope text-on-surface-variant max-w-md text-sm leading-relaxed">
          Tap the heart on any gallery photo to save it here. Favorites stay on this device only.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((item, idx) => (
            <GalleryTile
              key={item.src}
              item={item}
              sizes="(max-width:768px) 50vw, 25vw"
              priority={idx < 4}
              className="aspect-[3/4]"
            />
          ))}
        </div>
      )}
    </section>
  );
}
