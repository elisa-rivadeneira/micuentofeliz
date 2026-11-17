import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/db";
import { newId, slugify } from "@/lib/util";

const ALLOWED: Record<string, "imagen" | "audio" | "video"> = {
  ".jpg": "imagen", ".jpeg": "imagen", ".png": "imagen", ".webp": "imagen", ".gif": "imagen", ".avif": "imagen", ".svg": "imagen",
  ".mp3": "audio", ".wav": "audio", ".ogg": "audio", ".m4a": "audio", ".aac": "audio", ".flac": "audio",
  ".mp4": "video", ".webm": "video", ".mov": "video",
};
const MAX = 200 * 1024 * 1024;

/** Guarda archivos en data/uploads y los sirve desde /media/<nombre>. */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  const kind = ALLOWED[ext];
  if (!kind) return NextResponse.json({ error: `Formato no admitido (${ext || "sin extensión"})` }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "El archivo supera 200 MB" }, { status: 400 });

  const base = slugify(path.basename(file.name, ext)).slice(0, 50);
  const name = `${base}-${newId().slice(-6)}${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/media/${name}`, kind, name: file.name });
}
