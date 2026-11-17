"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import type { Universe } from "@/lib/types";
import { hexToRgb } from "@/lib/util";
import { SymbolIcon } from "@/lib/symbols";
import { GardenBackdrop } from "./GardenBackdrop";
import { GardenHeader } from "./GardenHeader";
import { UniverseCarousel, ACTIVE_STORE_KEY } from "./UniverseCarousel";
import { GardenDock } from "./GardenDock";
import "./jardin.css";

/** Pantalla Jardines: fondo, encabezado, carrusel holográfico y barra inferior. */
export function GardenExperience({ universes, counts, background }: { universes: Universe[]; counts: Record<string, number>; background?: string }) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Recordar el último universo visitado durante la sesión.
  useEffect(() => {
    try {
      const v = Number(sessionStorage.getItem(ACTIVE_STORE_KEY));
      if (Number.isInteger(v) && v >= 0 && v < universes.length) setActive(v);
    } catch {}
  }, [universes.length]);

  useEffect(() => {
    if (!showAll) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setShowAll(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [showAll]);

  const pick = (i: number) => {
    setActive(i);
    try { sessionStorage.setItem(ACTIVE_STORE_KEY, String(i)); } catch {}
    setShowAll(false);
  };

  return (
    <main className="gx">
      <GardenBackdrop image={background} />
      <div className="gx__content">
        <GardenHeader />
        <div className="gx__main">
        {universes.length ? (
          <UniverseCarousel universes={universes} counts={counts} active={active} onActiveChange={setActive} />
        ) : (
          <p className="gx__empty">Aún no hay universos. <Link href="/admin/universos/nuevo">Crea el primero</Link>.</p>
        )}
        <Link href="/mundo" className="gx__world">
          <Sparkles size={14} /> El Mundo Compartido <span>En construcción</span>
        </Link>
        </div>
        <GardenDock total={universes.length} onShowAll={() => setShowAll(true)} />
      </div>

      <AnimatePresence>
        {showAll && (
          <motion.div className="allg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAll(false)}>
            <motion.div
              className="allg__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Todos los jardines"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="allg__head">
                <h2>Todos los jardines</h2>
                <button className="nav__icon" onClick={() => setShowAll(false)} aria-label="Cerrar" autoFocus><X size={20} /></button>
              </div>
              <ul className="allg__grid">
                {universes.map((u, i) => (
                  <li key={u.id}>
                    <button className={`allg__item ${i === active ? "is-on" : ""}`} style={{ ["--c" as string]: hexToRgb(u.color) }} onClick={() => pick(i)}>
                      <span className="allg__icon"><SymbolIcon name={u.symbol} size={22} /></span>
                      <span className="allg__name">{u.name}</span>
                      <small>{counts[u.id] ?? 0} piezas</small>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
