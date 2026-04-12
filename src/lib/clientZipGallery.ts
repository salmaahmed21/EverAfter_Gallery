/**
 * Builds A+N.zip in the browser (Vercel serverless has a ~300MB function limit;
 * zipping hundreds of photos server-side pulled all of `public/gallery` into the bundle).
 */

type ManifestItem = { src: string; alt: string };

const BATCH = 4;

export async function downloadAllGalleryZip(options?: {
  onProgress?: (done: number, total: number) => void;
}): Promise<void> {
  const res = await fetch("/api/gallery/manifest");
  if (!res.ok) throw new Error("Could not load gallery list.");
  const data = (await res.json()) as { items?: ManifestItem[] };
  const items = Array.isArray(data.items) ? data.items : [];
  const local = items.filter((i) => i.src.startsWith("/"));
  if (local.length === 0) {
    throw new Error("No gallery files to zip (manifest is empty).");
  }

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const folder = zip.folder("A+N");
  if (!folder) throw new Error("Could not create zip folder.");

  const origin = window.location.origin;
  let done = 0;

  for (let i = 0; i < local.length; i += BATCH) {
    const chunk = local.slice(i, i + BATCH);
    await Promise.all(
      chunk.map(async (item) => {
        const url = item.src.startsWith("http") ? item.src : `${origin}${item.src}`;
        const r = await fetch(url);
        if (!r.ok) return;
        const blob = await r.blob();
        const rawName = item.src.split("/").pop()?.split("?")[0] || "photo.jpg";
        const name = decodeURIComponent(rawName);
        folder.file(name, blob);
        done++;
        options?.onProgress?.(done, local.length);
      }),
    );
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "A+N.zip";
  a.click();
  URL.revokeObjectURL(a.href);
}
