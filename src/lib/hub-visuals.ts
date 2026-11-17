import "server-only";
import { openSync, readSync, closeSync } from "node:fs";
import path from "node:path";
import { findImage } from "./backgrounds";
import { SECTION_KEYS } from "./types";
import type { HubVisuals } from "@/components/hub/LearningHub";
import type { ArtImage } from "@/components/hub/SectionArt";

/** ¿La imagen tiene canal alfa? (PNG con color RGBA/gris+alfa, o WebP extendido con bandera de alfa). */
function hasAlpha(publicPath: string): boolean {
  try {
    const fd = openSync(path.join(process.cwd(), "public", publicPath), "r");
    const b = Buffer.alloc(32);
    readSync(fd, b, 0, 32, 0);
    closeSync(fd);
    if (b.toString("ascii", 1, 4) === "PNG") return b[25] === 4 || b[25] === 6;
    if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const chunk = b.toString("ascii", 12, 16);
      if (chunk === "VP8X") return (b[20] & 0x10) !== 0;
      return chunk === "VP8L"; // sin pérdida: puede tener alfa
    }
  } catch {}
  return false;
}

function art(key: string): ArtImage | undefined {
  const src = findImage(`hub/${key}`);
  return src ? { src, cutout: hasAlpha(src) } : undefined;
}

export function hubVisuals(): HubVisuals {
  return {
    dawn: findImage("amanecer-fondo"),
    lake: findImage("jardines-fondo"),
    art: Object.fromEntries(SECTION_KEYS.map((k) => [k, art(k)])),
  };
}
