import manifest from "@/data/gallery-manifest.json";

export type GalleryItem = { src: string; alt: string };

type ManifestShape = {
  items?: unknown;
  hero?: { src?: string; alt?: string } | null;
};

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
  const fromFile = normalizeItems((manifest as ManifestShape).items);
  if (fromFile.length > 0) return fromFile;
  return FALLBACK_ITEMS;
}

function itemByFileName(items: GalleryItem[], filename: string): GalleryItem | null {
  const target = `/gallery/${encodeURIComponent(filename)}`;
  return items.find((i) => i.src === target) ?? null;
}

/**
 * Hero is chosen at `npm run gallery:manifest` / prebuild and stored in the manifest
 * (`hero` field) so we never call `fs` on `public/gallery` at runtime (Vercel would
 * trace the whole folder into the server bundle).
 *
 * Order matches the generator: `DSC05200.jpg` in gallery, then `public/hero.*`, else first item.
 */
export function getHeroBackground(): GalleryItem {
  const raw = (manifest as ManifestShape).hero;
  if (raw && typeof raw === "object" && typeof raw.src === "string" && raw.src.trim()) {
    const alt = typeof raw.alt === "string" && raw.alt.trim() ? raw.alt.trim() : "Nouran & Ali";
    return { src: raw.src.trim(), alt };
  }
  return getGalleryItems()[0]!;
}

/** Our Day: 1st slot `2.jpg` when in manifest; 2nd from manifest order; 3rd `DSC05582.jpg` when listed. */
export function getCeremonyItems(items: GalleryItem[]): GalleryItem[] {
  const first = itemByFileName(items, "2.jpg") ?? items[0];
  const second = items[1];
  const third = itemByFileName(items, "DSC05582.jpg") ?? items[2];
  const out = [first, second, third].filter((x): x is GalleryItem => Boolean(x));
  return out;
}

/** “Art of the Little Things” horizontal strip — fixed files when all are in the manifest. */
export function getEditorialStripItems(items: GalleryItem[]): GalleryItem[] {
  const names = ["DSC05106.jpg", "DSC05314.jpg", "DSC04626.jpg"];
  const forced = names.map((n) => itemByFileName(items, n)).filter((x): x is GalleryItem => x !== null);
  if (forced.length === 3) return forced;
  return items.slice(3, 6);
}

/** More memories: full manifest minus anything already shown in Our Day or editorial strip (no duplicates). */
export function getMoreMemoriesItems(items: GalleryItem[], ceremony: GalleryItem[], editorial: GalleryItem[]): GalleryItem[] {
  const used = new Set([...ceremony, ...editorial].map((i) => i.src));
  return items.filter((i) => !used.has(i.src));
}
