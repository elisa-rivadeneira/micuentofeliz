import type { ContentType, DoorStyle, Evidence, ReadStatus } from "./types";

export const TYPE_LABELS: Record<ContentType, { singular: string; plural: string }> = {
  historia: { singular: "Historia", plural: "Historias" },
  reflexion: { singular: "Reflexión", plural: "Reflexiones" },
  articulo: { singular: "Artículo", plural: "Artículos" },
  poema: { singular: "Poema", plural: "Poemas" },
  cancion: { singular: "Canción", plural: "Canciones" },
  imagen: { singular: "Imagen", plural: "Imágenes" },
  audio: { singular: "Audio", plural: "Audios" },
  video: { singular: "Video", plural: "Videos" },
  enlace: { singular: "Enlace", plural: "Enlaces" },
  libro: { singular: "Libro / referencia", plural: "Libros y referencias" },
  proyecto: { singular: "Proyecto", plural: "Proyectos" },
  idea: { singular: "Idea", plural: "Ideas" },
  podcast: { singular: "Podcast", plural: "Podcasts" },
  estudio: { singular: "Estudio", plural: "Estudios" },
  apunte: { singular: "Apunte", plural: "Apuntes" },
  receta: { singular: "Receta", plural: "Recetas" },
};

export const EVIDENCE_LABELS: Record<Evidence, string> = {
  respaldado: "Respaldado por estudios",
  prometedor: "Prometedor",
  opinion: "Opinión / polémico",
};

export const STATUS_LABELS: Record<ReadStatus, string> = {
  "por-ver": "Por ver",
  viendo: "Viendo",
  visto: "Visto",
};

export const DOOR_STYLE_LABELS: Record<DoorStyle, string> = {
  ojival: "Ojival",
  "medio-punto": "Medio punto",
  herradura: "Herradura",
  lobulado: "Lobulado",
  cerradura: "Cerradura",
};
