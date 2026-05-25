import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const galleryDir = path.join(publicDir, "gallery");
const outFile = path.join(root, "src", "data", "gallery-manifest.json");

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const HERO_GALLERY_FILE = "DSC05200.jpg";
const HERO_PUBLIC_NAMES = ["hero.jpg", "hero.jpeg", "hero.webp", "hero.png"];

function listFiles() {
  if (!fs.existsSync(galleryDir)) return [];
  return fs
    .readdirSync(galleryDir)
    .filter((f) => exts.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

/** Resolved at build time so the Next.js app never uses `fs` on `public/gallery` (avoids bundling gigabytes into serverless). */
function pickHero() {
  const galleryHero = path.join(galleryDir, HERO_GALLERY_FILE);
  if (fs.existsSync(galleryHero)) {
    return { src: `/gallery/${encodeURIComponent(HERO_GALLERY_FILE)}`, alt: "Omar & Habiba" };
  }
  for (const name of HERO_PUBLIC_NAMES) {
    if (fs.existsSync(path.join(publicDir, name))) {
      return { src: `/${name}`, alt: "Omar & Habiba" };
    }
  }
  return null;
}

const files = listFiles();
const items = files.map((f) => ({
  src: `/gallery/${encodeURIComponent(f)}`,
  alt: path.parse(f).name.replace(/[-_]+/g, " ").trim() || "Engagement photo",
}));

const hero = pickHero();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
  outFile,
  JSON.stringify({ items, hero, generatedAt: new Date().toISOString() }, null, 2) + "\n",
  "utf8",
);

console.log(`[gallery:manifest] Wrote ${items.length} image(s) to src/data/gallery-manifest.json`);
