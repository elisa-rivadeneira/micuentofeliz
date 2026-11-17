import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Door } from "@/components/Door";
import { Fireflies } from "@/components/Fireflies";

export const metadata: Metadata = { title: "El Mundo Compartido" };

/**
 * El Mundo Compartido — en construcción.
 *
 * Aquí vivirá, en el futuro, la expansión hacia otros jardines. En esta fase
 * es solo un umbral: no hay registro, perfiles ni funciones sociales.
 */
export default function MundoPage() {
  return (
    <main className="world">
      <div className="world__aurora" aria-hidden>
        <span /><span /><span />
      </div>
      <div className="world__stars" aria-hidden />
      <Fireflies count={50} colors={["200, 220, 255", "230, 240, 255", "180, 200, 255"]} band={[0, 1]} />

      <div className="wrap wrap--narrow world__inner">
        <Link href="/jardin" className="back"><ArrowLeft size={16} /> Volver al jardín</Link>

        <div className="world__door page-enter">
          <Door color="#7d8cff" glow="#e4f0ff" symbol="mundo" style="ojival" sealed />
          <div className="world__seed" aria-hidden>
            <span />
          </div>
        </div>

        <div className="world__copy page-enter">
          <span className="badge badge--soon">En construcción</span>
          <h1 className="display">El Mundo Compartido</h1>
          <p className="lead">
            Más allá de esta puerta crecerá un bosque de jardines: lugares donde otras personas podrán sembrar sus propias historias
            y tender hilos hacia las nuestras.
          </p>
          <p className="world__verse">
            Primero una semilla.<br />
            Después un jardín.<br />
            Y algún día, un bosque entero.
          </p>
          <p className="muted">La puerta aún está sellada con hilos de luz. Vuelve pronto: la estamos cultivando.</p>
          <Link href="/jardin" className="btn btn--ghost">Seguir explorando mi jardín</Link>
        </div>
      </div>
    </main>
  );
}
