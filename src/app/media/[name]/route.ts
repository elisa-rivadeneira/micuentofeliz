import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/db";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif",
  ".avif": "image/avif", ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".m4a": "audio/mp4", ".aac": "audio/aac", ".flac": "audio/flac",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
};

/** Sirve los archivos subidos, con soporte de rangos para audio y video. */
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const safe = path.basename(decodeURIComponent(name));
  const file = path.join(UPLOADS_DIR, safe);
  let stat;
  try {
    stat = await fs.stat(file);
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
  const type = TYPES[path.extname(safe).toLowerCase()] ?? "application/octet-stream";
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };
  if (type === "image/svg+xml") headers["Content-Security-Policy"] = "script-src 'none'; sandbox";

  const range = req.headers.get("range");
  const m = range?.match(/bytes=(\d*)-(\d*)/);
  if (m) {
    const start = m[1] ? parseInt(m[1], 10) : 0;
    const end = m[2] ? Math.min(parseInt(m[2], 10), stat.size - 1) : stat.size - 1;
    if (start >= stat.size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${stat.size}` } });
    const fh = await fs.open(file, "r");
    const buf = Buffer.alloc(end - start + 1);
    await fh.read(buf, 0, buf.length, start);
    await fh.close();
    return new Response(buf, { status: 206, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": String(buf.length) } });
  }
  const data = await fs.readFile(file);
  return new Response(data, { headers: { ...headers, "Content-Length": String(stat.size) } });
}
