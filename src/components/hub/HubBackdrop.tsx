import { GardenBackdrop } from "../jardin/GardenBackdrop";
import { DawnBackdrop } from "./DawnBackdrop";

/**
 * Fondo de los centros de aprendizaje.
 * Prioridad: imagen propia de amanecer > lago del jardín (con agua viva y un
 * resplandor de amanecer) > amanecer dibujado en SVG.
 */
export function HubBackdrop({ dawn, lake }: { dawn?: string; lake?: string }) {
  if (dawn) return <DawnBackdrop image={dawn} />;
  if (lake) {
    return (
      <>
        <GardenBackdrop image={lake} />
        <div className="hub__sunrise" aria-hidden />
      </>
    );
  }
  return <DawnBackdrop />;
}
