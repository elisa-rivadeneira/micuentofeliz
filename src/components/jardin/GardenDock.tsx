"use client";

import Link from "next/link";
import { Layers, Network, Sprout } from "lucide-react";

/** Barra flotante de cristal con los tres accesos del jardín. */
export function GardenDock({ total, onShowAll }: { total: number; onShowAll: () => void }) {
  return (
    <nav className="dock" aria-label="Accesos del jardín">
      <button type="button" className="dock__item" onClick={onShowAll}>
        <Layers className="dock__icon dock__icon--violet" size={30} strokeWidth={1.3} />
        <span className="dock__text"><span className="dock__num">{total}</span> <span className="dock__label">Jardines</span></span>
      </button>
      <span className="dock__sep" aria-hidden />
      <Link href="/conexiones" className="dock__item">
        <Network className="dock__icon dock__icon--violet" size={30} strokeWidth={1.3} />
        <span className="dock__label dock__label--2">Conexiones <br />inspiradoras</span>
      </Link>
      <span className="dock__sep" aria-hidden />
      <Link href="/admin" className="dock__item">
        <Sprout className="dock__icon dock__icon--green" size={30} strokeWidth={1.3} />
        <span className="dock__label dock__label--2">Crea tu <br />jardín</span>
      </Link>
    </nav>
  );
}
