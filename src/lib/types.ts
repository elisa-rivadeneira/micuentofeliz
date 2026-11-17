/**
 * Modelo de datos de Mi Cuento Feliz.
 *
 * Todo registro pertenece a un "jardín" (gardenId). En la Fase 1 solo existe
 * el jardín personal, pero este campo deja la puerta abierta a que, en el
 * futuro, otras personas tengan sus propios jardines (El Mundo Compartido).
 */

export type GardenId = string;

export const CONTENT_TYPES = [
  "historia",
  "reflexion",
  "articulo",
  "poema",
  "cancion",
  "imagen",
  "audio",
  "video",
  "enlace",
  "libro",
  "proyecto",
  "idea",
  "podcast",
  "estudio",
  "apunte",
  "receta",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const DOOR_STYLES = ["ojival", "medio-punto", "herradura", "lobulado", "cerradura"] as const;
export type DoorStyle = (typeof DOOR_STYLES)[number];

export interface Universe {
  id: string;
  gardenId: GardenId;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Color principal de la puerta (hex). */
  color: string;
  /** Color de brillo / acento (hex). */
  glow: string;
  /** Nombre del símbolo (ver lib/symbols). */
  symbol: string;
  doorStyle: DoorStyle;
  order: number;
  hidden?: boolean;
  /** Si existe, el universo se muestra como centro de aprendizaje (ver lib/sections). */
  hub?: HubConfig;
  createdAt: string;
  updatedAt: string;
}

export type MediaKind = "imagen" | "audio" | "video" | "enlace";

export interface MediaItem {
  id: string;
  kind: MediaKind;
  url: string;
  caption?: string;
}

export interface Entry {
  id: string;
  gardenId: GardenId;
  slug: string;
  title: string;
  type: ContentType;
  /** Frase breve que aparece en tarjetas. */
  summary: string;
  /** Cuerpo en Markdown sencillo. */
  body: string;
  universeIds: string[];
  tags: string[];
  /** Referencias explícitas a otros contenidos (se tratan como bidireccionales). */
  relatedIds: string[];
  cover?: string;
  media: MediaItem[];
  author?: string;
  source?: string;
  externalUrl?: string;
  featured?: boolean;
  /** Seguimiento (videoteca y demás secciones). */
  evidence?: Evidence;
  status?: ReadStatus;
  /** Valoración personal 0–5. */
  rating?: number;
  /** Duración legible, p. ej. "1:23:42" o "52 min". */
  duration?: string;
  saved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const EVIDENCE_LEVELS = ["respaldado", "prometedor", "opinion"] as const;
export type Evidence = (typeof EVIDENCE_LEVELS)[number];

export const READ_STATUSES = ["por-ver", "viendo", "visto"] as const;
export type ReadStatus = (typeof READ_STATUSES)[number];

export const SECTION_KEYS = ["videoteca", "biblioteca", "recetas"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export interface HubConfig {
  /** Título del centro, p. ej. "Nutrición". */
  title?: string;
  /** Palabra destacada en color, p. ej. "Saludable". */
  highlight?: string;
  subtitle?: string;
  /** Pasos del recorrido, p. ej. Aprender → Entender → Decidir → Practicar. */
  journey?: string[];
  sections: SectionKey[];
}

export type EntryPatch = Partial<Pick<Entry, "status" | "saved" | "rating" | "evidence">>;

export interface Database {
  version: number;
  gardens: { id: GardenId; name: string; ownerName: string; createdAt: string }[];
  universes: Universe[];
  entries: Entry[];
}

export type UniverseInput = Omit<Universe, "id" | "gardenId" | "createdAt" | "updatedAt"> & { id?: string };
export type EntryInput = Omit<Entry, "id" | "gardenId" | "createdAt" | "updatedAt"> & { id?: string };
