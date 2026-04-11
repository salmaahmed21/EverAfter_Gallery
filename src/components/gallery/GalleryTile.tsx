"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";
import { FAVORITES_UPDATE_EVENT, notifyFavoritesChanged, readFavorites, toggleFavorite } from "@/lib/favorites";
import { useLightbox } from "./LightboxProvider";

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 5v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function HeartIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

async function downloadImage(item: GalleryItem) {
  const url = item.src.startsWith("http") ? item.src : `${window.location.origin}${item.src}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const name = item.src.split("/").pop()?.split("?")[0] || "photo.jpg";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = decodeURIComponent(name);
  a.click();
  URL.revokeObjectURL(a.href);
}

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
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
        <button
          type="button"
          className="pointer-events-auto rounded-full bg-black/45 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          aria-label="Download image"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await downloadImage(item);
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
