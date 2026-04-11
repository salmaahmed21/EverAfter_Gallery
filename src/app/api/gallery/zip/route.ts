import { PassThrough } from "node:stream";
import { Readable } from "node:stream";
import archiver from "archiver";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export async function GET() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  if (!fs.existsSync(galleryDir)) {
    return new Response(JSON.stringify({ error: "Gallery folder not found." }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const files = fs
    .readdirSync(galleryDir)
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  if (files.length === 0) {
    return new Response(JSON.stringify({ error: "No images in gallery." }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const passThrough = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    passThrough.destroy(err);
  });

  archive.pipe(passThrough);

  for (const f of files) {
    archive.file(path.join(galleryDir, f), { name: f });
  }

  void archive.finalize();

  const webStream = Readable.toWeb(passThrough) as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="A+N.zip"',
    },
  });
}
