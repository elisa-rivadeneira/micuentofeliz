"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Universe } from "@/lib/types";
import { hexToRgb } from "@/lib/util";
import { UniverseIllustration } from "./UniverseIllustration";

interface Props {
  universe: Universe;
  index: number;
  total: number;
  count: number;
  active: boolean;
  onSelect: () => void;
  onEnter: () => void;
}

/** Tarjeta holográfica de un universo (HTML real: cristal, borde luminoso, ilustración, título y botón). */
export function HoloCard({ universe: u, index, total, count, active, onSelect, onEnter }: Props) {
  const inner = useRef<HTMLDivElement>(null);

  // Inclinación 3D y brillo que siguen al puntero (solo tarjeta activa, sin re-render).
  const onMove = (e: React.PointerEvent) => {
    const el = inner.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    if (active) {
      el.style.setProperty("--tx", `${((py - 0.5) * -8).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${((px - 0.5) * 10).toFixed(2)}deg`);
    }
  };
  const onLeave = () => {
    inner.current?.style.setProperty("--tx", "0deg");
    inner.current?.style.setProperty("--ty", "0deg");
  };

  return (
    <div
      ref={inner}
      className={`holo ${active ? "is-active" : ""}`}
      style={{ ["--c" as string]: hexToRgb(u.color), ["--g" as string]: hexToRgb(u.glow) }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => (active ? onEnter() : onSelect())}
      role="group"
      aria-roledescription="universo"
      aria-label={`${index + 1} de ${total}: ${u.name}`}
    >
      <span className="holo__border" aria-hidden />
      <span className="holo__sheen" aria-hidden />
      <div className="holo__top">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{count} {count === 1 ? "pieza" : "piezas"}</span>
      </div>
      <div className="holo__art">
        <UniverseIllustration symbol={u.symbol} color={u.color} glow={u.glow} />
      </div>
      <h2 className="holo__title">{u.name}</h2>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div className="holo__more" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.35, delay: 0.1 }}>
            {u.tagline && <p className="holo__tagline">{u.tagline}</p>}
            <button
              type="button"
              className="holo__cta"
              onClick={(e) => { e.stopPropagation(); onEnter(); }}
            >
              Entrar al jardín <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="holo__reflection" aria-hidden />
    </div>
  );
}
