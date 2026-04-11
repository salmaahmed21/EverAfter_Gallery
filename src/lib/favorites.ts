export const FAVORITES_STORAGE_KEY = "ever-after-gallery-favorites";
export const FAVORITES_UPDATE_EVENT = "ever-after-favorites";

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

/** Returns new favorite state (true = now favorited). */
export function toggleFavorite(src: string): boolean {
  const cur = readFavorites();
  const has = cur.includes(src);
  const next = has ? cur.filter((s) => s !== src) : [...cur, src];
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
  return !has;
}

export function notifyFavoritesChanged() {
  window.dispatchEvent(new Event(FAVORITES_UPDATE_EVENT));
}
