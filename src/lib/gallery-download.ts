import type { GalleryItem } from "@/lib/gallery";

export async function downloadGalleryImage(item: GalleryItem) {
  const url = item.src.startsWith("http") ? item.src : `${typeof window !== "undefined" ? window.location.origin : ""}${item.src}`;
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
