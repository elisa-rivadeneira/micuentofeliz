import { Lotus } from "@/components/Lotus";

/** Se muestra al instante mientras se abre una pantalla del taller. */
export default function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <Lotus size={56} className="loading__lotus" />
      <p>Abriendo el jardín…</p>
    </div>
  );
}
