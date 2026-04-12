import { NextResponse } from "next/server";
import manifest from "@/data/gallery-manifest.json";

/** Only reads committed JSON — does not import `gallery.ts` (avoids tracing `public/gallery` into the server bundle). */
type Row = { src: string; alt: string };

function itemsFromManifest(): Row[] {
  const raw = (manifest as { items?: unknown }).items;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const src = "src" in row && typeof row.src === "string" ? row.src.trim() : "";
      const alt = "alt" in row && typeof row.alt === "string" ? row.alt.trim() : "Engagement photo";
      if (!src) return null;
      return { src, alt: alt || "Engagement photo" };
    })
    .filter((x): x is Row => x !== null);
}

export async function GET() {
  return NextResponse.json({ items: itemsFromManifest() });
}
