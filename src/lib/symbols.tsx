import {
  BookOpen, Feather, Music, Atom, Cpu, Leaf, Palette, Lightbulb, Library, Sparkles,
  Moon, Sun, Star, Flower2, Compass, Telescope, Globe2, Heart, Eye, Infinity as InfinityIcon,
  Mountain, Waves, TreePine, Gem, Key, Apple, type LucideIcon,
} from "lucide-react";

export const SYMBOLS: Record<string, { label: string; Icon: LucideIcon }> = {
  loto: { label: "Loto", Icon: Flower2 },
  libro: { label: "Libro", Icon: BookOpen },
  pluma: { label: "Pluma", Icon: Feather },
  musica: { label: "Música", Icon: Music },
  atomo: { label: "Átomo", Icon: Atom },
  telescopio: { label: "Telescopio", Icon: Telescope },
  chip: { label: "Chip", Icon: Cpu },
  hoja: { label: "Hoja", Icon: Leaf },
  fruta: { label: "Fruta", Icon: Apple },
  arbol: { label: "Árbol", Icon: TreePine },
  paleta: { label: "Paleta", Icon: Palette },
  bombilla: { label: "Bombilla", Icon: Lightbulb },
  biblioteca: { label: "Biblioteca", Icon: Library },
  destellos: { label: "Destellos", Icon: Sparkles },
  luna: { label: "Luna", Icon: Moon },
  sol: { label: "Sol", Icon: Sun },
  estrella: { label: "Estrella", Icon: Star },
  brujula: { label: "Brújula", Icon: Compass },
  mundo: { label: "Mundo", Icon: Globe2 },
  corazon: { label: "Corazón", Icon: Heart },
  ojo: { label: "Ojo", Icon: Eye },
  infinito: { label: "Infinito", Icon: InfinityIcon },
  montana: { label: "Montaña", Icon: Mountain },
  olas: { label: "Olas", Icon: Waves },
  gema: { label: "Gema", Icon: Gem },
  llave: { label: "Llave", Icon: Key },
};

export function SymbolIcon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const entry = SYMBOLS[name] ?? SYMBOLS.destellos;
  const { Icon } = entry;
  return <Icon size={size} className={className} strokeWidth={1.4} aria-hidden />;
}
