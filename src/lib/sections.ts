import type { ContentType, Entry, SectionKey } from "./types";

/**
 * Secciones de un centro de aprendizaje (p. ej. Nutrición).
 * Una pieza aparece en una sección si vive en ese universo y su tipo
 * pertenece a la sección. No hace falta clasificar nada a mano.
 */

export interface SectionTab {
  key: string;
  label: string;
  types: ContentType[];
}

export interface SectionDef {
  key: SectionKey;
  label: string;
  description: string;
  /** Texto del encabezado dentro de la sección. */
  lead: string;
  types: ContentType[];
  tabs: SectionTab[];
  /** Filtros de seguimiento (evidencia y estado). */
  tracking: boolean;
  /** Tipo propuesto al añadir contenido desde la sección. */
  defaultType: ContentType;
  tone: "violeta" | "menta" | "durazno";
}

export const SECTIONS: Record<SectionKey, SectionDef> = {
  videoteca: {
    key: "videoteca",
    label: "Videoteca",
    description: "Videos, charlas, documentales y podcasts organizados por temas.",
    lead: "Videos, charlas, documentales y podcasts",
    types: ["video", "podcast", "audio"],
    tabs: [
      { key: "todo", label: "Todo", types: [] },
      { key: "videos", label: "Videos", types: ["video"] },
      { key: "podcasts", label: "Podcasts", types: ["podcast", "audio"] },
    ],
    tracking: true,
    defaultType: "video",
    tone: "violeta",
  },
  biblioteca: {
    key: "biblioteca",
    label: "Biblioteca y Notas",
    description: "Libros, artículos y estudios, junto a mis propias notas y conclusiones.",
    lead: "Libros, artículos, estudios y mis propias notas",
    types: ["libro", "articulo", "estudio", "enlace", "apunte", "reflexion", "idea"],
    tabs: [
      { key: "todo", label: "Todo", types: [] },
      { key: "libros", label: "Libros", types: ["libro"] },
      { key: "articulos", label: "Artículos", types: ["articulo", "enlace"] },
      { key: "estudios", label: "Estudios", types: ["estudio"] },
      { key: "notas", label: "Mis notas", types: ["apunte", "reflexion", "idea"] },
    ],
    tracking: true,
    defaultType: "libro",
    tone: "menta",
  },
  recetas: {
    key: "recetas",
    label: "Recetas",
    description: "Recetario saludable basado en mis principios nutricionales.",
    lead: "Recetario saludable basado en mis principios",
    types: ["receta"],
    tabs: [{ key: "todo", label: "Todas", types: [] }],
    tracking: false,
    defaultType: "receta",
    tone: "durazno",
  },
};

/** Nombres antiguos de secciones (para enlaces y datos guardados antes del cambio). */
export const SECTION_ALIASES: Record<string, SectionKey> = { apuntes: "biblioteca" };

/** Tipos con seguimiento de lectura/visionado (las notas y recetas no lo tienen). */
export const TRACKABLE_TYPES: ContentType[] = ["video", "podcast", "audio", "libro", "articulo", "estudio", "enlace"];

export function inSection(e: Entry, universeId: string, section: SectionDef): boolean {
  return e.universeIds.includes(universeId) && section.types.includes(e.type);
}

/** Sección a la que pertenece una pieza dentro de un universo con centro de aprendizaje. */
export function sectionOf(e: Entry, keys: SectionKey[]): SectionDef | undefined {
  return keys.map((k) => SECTIONS[k]).find((s) => s.types.includes(e.type));
}

/** Miniatura de YouTube si la pieza enlaza un video de YouTube. */
export function youtubeThumb(e: Entry): string | undefined {
  const urls = [e.externalUrl, ...e.media.map((m) => m.url)].filter(Boolean) as string[];
  for (const u of urls) {
    const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
    if (m) return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`;
  }
  return undefined;
}
