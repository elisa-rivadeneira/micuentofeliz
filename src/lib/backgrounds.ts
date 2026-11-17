import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/** Devuelve /images/<nombre>.<ext> si existe en public/images (webp, jpg, jpeg o png). */
export function findImage(name: string): string | undefined {
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    if (existsSync(path.join(process.cwd(), "public", "images", `${name}.${ext}`))) return `/images/${name}.${ext}`;
  }
  return undefined;
}
