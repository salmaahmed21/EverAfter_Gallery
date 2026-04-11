import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const galleryDir = path.join(root, "public", "gallery");
const outFile = path.join(root, "src", "data", "gallery-manifest.json");

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function listFiles() {
  if (!fs.existsSync(galleryDir)) return [];
  return fs
    .readdirSync(galleryDir)
    .filter((f) => exts.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

const files = listFiles();
const items = files.map((f) => ({
  src: `/gallery/${encodeURIComponent(f)}`,
  alt: path.parse(f).name.replace(/[-_]+/g, " ").trim() || "Engagement photo",
}));

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(
  outFile,
  JSON.stringify({ items, generatedAt: new Date().toISOString() }, null, 2) + "\n",
  "utf8",
);

console.log(`[gallery:manifest] Wrote ${items.length} image(s) to src/data/gallery-manifest.json`);
