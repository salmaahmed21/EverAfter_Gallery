import fs from "fs";
import path from "path";
import manifest from "@/data/gallery-manifest.json";

const HERO_FILES = ["hero.jpg", "hero.jpeg", "hero.webp", "hero.png"] as const;

export type GalleryItem = { src: string; alt: string };

const FALLBACK_ITEMS: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    alt: "Couple during an outdoor celebration",
  },
  {
    src: "https://images.unsplash.com/photo-1522673603600-3d4f1d686efb?w=1200&q=80",
    alt: "Engagement ring and hands",
  },
  {
    src: "https://images.unsplash.com/photo-1529636799528-921382494ebb?w=1200&q=80",
    alt: "Couple laughing together",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1800&q=80",
    alt: "Wide scenic celebration moment",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    alt: "Wedding and engagement details",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    alt: "Soft romantic portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1522673603600-3d4f1d686efb?w=1200&q=80",
    alt: "Quiet candid moment",
  },
  {
    src: "https://images.unsplash.com/photo-1529636799528-921382494ebb?w=1600&q=80",
    alt: "Dancing and joy",
  },
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    alt: "Tablescape and gathering",
  },
  {
    src: "https://images.unsplash.com/photo-1520854221050-0f4caff449f6?w=1200&q=80",
    alt: "Golden hour portrait",
  },
  {
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&q=80",
    alt: "Floral and celebration details",
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1800&q=80",
    alt: "Evening lights and atmosphere",
  },
];

function normalizeItems(raw: unknown): GalleryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const src = "src" in row && typeof row.src === "string" ? row.src.trim() : "";
      const alt = "alt" in row && typeof row.alt === "string" ? row.alt.trim() : "Engagement photo";
      if (!src) return null;
      return { src, alt: alt || "Engagement photo" };
    })
    .filter((x): x is GalleryItem => x !== null);
}

export function getGalleryItems(): GalleryItem[] {
  const fromFile = normalizeItems((manifest as { items?: unknown }).items);
  if (fromFile.length > 0) return fromFile;
  return FALLBACK_ITEMS;
}

/**
 * Hero image order:
 * 1. `public/gallery/0.jpg` (your chosen cover)
 * 2. `public/hero.{jpg,jpeg,webp,png}`
 * 3. First image from the gallery manifest / fallbacks
 */
export function getHeroBackground(): GalleryItem {
  const pub = path.join(process.cwd(), "public");
  const galleryZero = path.join(pub, "gallery", "DSC05200.jpg");
  if (fs.existsSync(galleryZero)) {
    return { src: "/gallery/DSC05200.jpg", alt: "Nouran & Ali" };
  }
  for (const name of HERO_FILES) {
    if (fs.existsSync(path.join(pub, name))) {
      return { src: `/${name}`, alt: "Nouran & Ali" };
    }
  }
  return getGalleryItems()[0]!;
}

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

function itemFromGalleryFile(name: string): GalleryItem | null {
  const full = path.join(GALLERY_DIR, name);
  if (!fs.existsSync(full)) return null;
  return { src: `/gallery/${encodeURIComponent(name)}`, alt: path.parse(name).name };
}

/** Our Day: manifest order for slots 1–2; 3rd slot is `DSC05582.jpg` when present. */
export function getCeremonyItems(items: GalleryItem[]): GalleryItem[] {
  const third = itemFromGalleryFile("DSC05582.jpg") ?? items[2];
  const out = [items[0], items[1], third].filter((x): x is GalleryItem => Boolean(x));
  return out;
}

/** “Art of the Little Things” horizontal strip — fixed files when present. */
export function getEditorialStripItems(items: GalleryItem[]): GalleryItem[] {
  const names = ["DSC05106.jpg", "DSC05314.jpg", "DSC04626.jpg"];
  const forced = names.map((n) => itemFromGalleryFile(n)).filter((x): x is GalleryItem => x !== null);
  if (forced.length === 3) return forced;
  return items.slice(3, 6);
}

/** More memories: full manifest minus anything already shown in Our Day or editorial strip (no duplicates). */
export function getMoreMemoriesItems(items: GalleryItem[], ceremony: GalleryItem[], editorial: GalleryItem[]): GalleryItem[] {
  const used = new Set([...ceremony, ...editorial].map((i) => i.src));
  return items.filter((i) => !used.has(i.src));
}
