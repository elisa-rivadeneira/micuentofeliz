import type { SectionKey } from "@/lib/types";
import { HubArt } from "./HubArt";

export interface ArtImage {
  src: string;
  /** Imagen recortada con fondo transparente: no necesita difuminar los bordes. */
  cutout: boolean;
}

/** Ilustración de sección: imagen propia (public/images/hub/<seccion>.*) o el dibujo SVG de respaldo. */
export function SectionArt({ section, art }: { section: SectionKey; art?: ArtImage }) {
  // eslint-disable-next-line @next/next/no-img-element
  return art ? <img src={art.src} alt="" className={`hub-img ${art.cutout ? "hub-img--cutout" : ""}`} /> : <HubArt section={section} />;
}
