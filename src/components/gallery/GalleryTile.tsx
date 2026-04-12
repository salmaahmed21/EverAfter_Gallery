"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";
import { downloadGalleryImage } from "@/lib/gallery-download";
import { FAVORITES_UPDATE_EVENT, notifyFavoritesChanged, readFavorites, toggleFavorite } from "@/lib/favorites";
import { DownloadIcon, HeartIcon } from "./GalleryIcons";
import { useLightbox } from "./LightboxProvider";

type Props = {
  item: GalleryItem;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function GalleryTile({ item, sizes, priority = false, className = "" }: Props) {
  const { open } = useLightbox();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(readFavorites().includes(item.src));
  }, [item.src]);

  useEffect(() => {
    const sync = () => setFav(readFavorites().includes(item.src));
    window.addEventListener(FAVORITES_UPDATE_EVENT, sync);
    return () => window.removeEventListener(FAVORITES_UPDATE_EVENT, sync);
  }, [item.src]);

  return (
    <div
      className={`gallery-item group relative cursor-pointer overflow-hidden bg-surface-container ${className}`}
      onClick={() => open(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(item);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.alt} larger`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-[800ms] ease-in-out group-hover:scale-105"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
        aria-hidden
      />
      <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between p-3 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
        <button
          type="button"
          className="pointer-events-auto rounded-full bg-black/45 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          aria-label="Download image"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await downloadGalleryImage(item);
            } catch {
              /* ignore */
            }
          }}
        >
          <DownloadIcon className="size-5" />
        </button>
        <button
          type="button"
          className={`pointer-events-auto rounded-full bg-black/45 p-2.5 backdrop-blur-sm transition-colors hover:bg-black/60 ${fav ? "text-red-200" : "text-white"}`}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            const now = toggleFavorite(item.src);
            setFav(now);
            notifyFavoritesChanged();
          }}
        >
          <HeartIcon className="size-5" filled={fav} />
        </button>
      </div>
    </div>
  );
}
