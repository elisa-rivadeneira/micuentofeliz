export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "sin-titulo";
}

export function newId(prefix = ""): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${rnd}`;
}

export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, " ");
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

/** Convierte "#rrggbb" a "r, g, b" para usar en rgba(var(--x), a). */
export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.padEnd(6, "0");
  const n = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return "201, 167, 255";
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
