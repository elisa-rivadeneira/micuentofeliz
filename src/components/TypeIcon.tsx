import {
  BookOpen, MessageCircleHeart, Newspaper, Feather, Music, Image as ImageIcon, AudioLines, Clapperboard,
  Link2, Library, Hammer, Lightbulb, Headphones, FlaskConical, NotebookPen, ChefHat, type LucideIcon,
} from "lucide-react";
import type { ContentType } from "@/lib/types";

const ICONS: Record<ContentType, LucideIcon> = {
  historia: BookOpen,
  reflexion: MessageCircleHeart,
  articulo: Newspaper,
  poema: Feather,
  cancion: Music,
  imagen: ImageIcon,
  audio: AudioLines,
  video: Clapperboard,
  enlace: Link2,
  libro: Library,
  proyecto: Hammer,
  idea: Lightbulb,
  podcast: Headphones,
  estudio: FlaskConical,
  apunte: NotebookPen,
  receta: ChefHat,
};

export function TypeIcon({ type, size = 16 }: { type: ContentType; size?: number }) {
  const Icon = ICONS[type] ?? Lightbulb;
  return <Icon size={size} strokeWidth={1.5} aria-hidden />;
}
