"use client";

import { useRef } from "react";
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

/**
 * Tarjeta holográfica de un universo: solo ilustración y título.
 * Un solo clic en cualquier tarjeta abre su universo (las flechas, los puntos y el arrastre la mueven).
 */
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
      onClick={() => onEnter()}
      onKeyDown={(e) => {
        if (active && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          e.stopPropagation();
          onEnter();
        }
      }}
      role="link"
      tabIndex={active ? 0 : -1}
      aria-roledescription="universo"
      aria-label={`${u.name}, universo ${index + 1} de ${total}, ${count} ${count === 1 ? "pieza" : "piezas"}. Entrar`}
      title={`Entrar a ${u.name}`}
    >
      <span className="holo__border" aria-hidden />
      <span className="holo__sheen" aria-hidden />
      <div className="holo__art">
        {u.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.image} alt="" className="holo__img" draggable={false} />
        ) : (
          <UniverseIllustration symbol={u.symbol} color={u.color} glow={u.glow} />
        )}
      </div>
      <h2 className="holo__title">{u.name}</h2>
      <span className="holo__reflection" aria-hidden />
    </div>
  );
}
