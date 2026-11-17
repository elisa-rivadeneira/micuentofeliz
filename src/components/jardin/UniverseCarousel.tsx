"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect en el navegador (mide antes de pintar); useEffect en el servidor.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Universe } from "@/lib/types";
import { hexToRgb } from "@/lib/util";
import { HoloCard } from "./HoloCard";

interface Layout {
  cardW: number;
  /** Proporción ancho/alto de la tarjeta. */
  ratio: number;
  /** Desplazamiento horizontal por posición (en múltiplos del ancho de tarjeta). */
  steps: number[];
  visible: number;
}

/** Escritorio: 5 tarjetas + asomo de las siguientes. Tablet: 3. Móvil: 1 + vecinas. */
function layoutFor(w: number, h: number): Layout {
  // La altura disponible también limita el tamaño (encabezado + barra inferior).
  // Tarjetas solo con ilustración y título: más anchas y tan grandes como permita la pantalla.
  const byHeight = Math.max(240, (h - (h < 860 ? 400 : 450)) * 0.92);
  if (w >= 1100) return { cardW: Math.round(Math.min(400, byHeight, Math.max(280, w * 0.24))), ratio: 0.92, steps: [0, 0.95, 1.72, 2.5], visible: 3 };
  if (w >= 700) return { cardW: Math.round(Math.min(360, byHeight, w * 0.4)), ratio: 0.9, steps: [0, 0.98, 1.75], visible: 2 };
  return { cardW: Math.round(Math.min(280, w * 0.7, Math.max(220, (h - 460) * 0.78))), ratio: 0.78, steps: [0, 0.92, 1.7], visible: 2 };
}

const SCALE = [1, 0.8, 0.66, 0.56];
const ROTATE = [0, 24, 32, 36];
const OPACITY = [1, 0.95, 0.78, 0.4];
const STORE = "mcf:jardin-activo";

interface Props {
  universes: Universe[];
  counts: Record<string, number>;
  active: number;
  onActiveChange: (i: number) => void;
}

export function UniverseCarousel({ universes, counts, active, onActiveChange }: Props) {
  const router = useRouter();
  const n = universes.length;
  const [layout, setLayout] = useState<Layout>({ cardW: 360, ratio: 0.92, steps: [0, 0.95, 1.72, 2.5], visible: 3 });
  const [ready, setReady] = useState(false);
  const [drag, setDrag] = useState(0);
  const [leaving, setLeaving] = useState<Universe | null>(null);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const moved = useRef(false);
  const wheel = useRef({ acc: 0, lock: 0 });

  useIsoLayoutEffect(() => {
    const onResize = () => setLayout(layoutFor(window.innerWidth, window.innerHeight));
    onResize();
    setReady(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = useCallback((i: number) => {
    const next = ((i % n) + n) % n;
    onActiveChange(next);
    try { sessionStorage.setItem(STORE, String(next)); } catch {}
  }, [n, onActiveChange]);

  const enter = useCallback((u: Universe) => {
    if (leaving) return;
    setLeaving(u);
    router.prefetch(`/universo/${u.slug}`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => router.push(`/universo/${u.slug}`), reduce ? 0 : 650);
  }, [leaving, router]);

  // Teclado: flechas, Inicio/Fin, Enter para entrar.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(n - 1); }
    else if (e.key === "Enter" && e.target === e.currentTarget) { e.preventDefault(); enter(universes[active]); }
  };

  // Arrastre táctil / con ratón.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    moved.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (!moved.current && Math.abs(dx) > (e.pointerType === "mouse" ? 24 : 14) && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      moved.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (moved.current) setDrag(dx);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s || !moved.current) return;
    const dx = e.clientX - s.x;
    const per = layout.cardW * layout.steps[1];
    const stepsMoved = Math.max(-3, Math.min(3, Math.round(-dx / per) || (Math.abs(dx) > 50 ? -Math.sign(dx) : 0)));
    setDrag(0);
    if (stepsMoved) go(active + stepsMoved);
  };
  // Evita que un arrastre termine "haciendo click" en una tarjeta.
  const onClickCapture = (e: React.MouseEvent) => {
    if (moved.current) { e.stopPropagation(); e.preventDefault(); moved.current = false; }
  };

  // Rueda / trackpad horizontal.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const now = Date.now();
    if (now < wheel.current.lock) return;
    wheel.current.acc += e.deltaX;
    if (Math.abs(wheel.current.acc) > 60) {
      go(active + Math.sign(wheel.current.acc));
      wheel.current = { acc: 0, lock: now + 380 };
    }
  };

  const dragShift = drag * 0.85;
  const current = universes[active];

  return (
    <section className={`carousel ${ready ? "is-ready" : ""}`} aria-roledescription="carrusel" aria-label="Universos del jardín" style={{ ["--cw" as string]: `${layout.cardW}px`, ["--ar" as string]: layout.ratio }}>
      <div
        className="carousel__stage"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onWheel={onWheel}
        aria-describedby="carousel-help"
      >
        {universes.map((u, i) => {
          let off = i - active;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const a = Math.abs(off);
          const hidden = a > layout.visible;
          const k = Math.min(a, 3);
          const sign = Math.sign(off);
          const x = sign * layout.cardW * (layout.steps[Math.min(a, layout.steps.length - 1)] + (a > layout.steps.length - 1 ? 0.5 : 0)) + dragShift;
          return (
            <motion.div
              key={u.id}
              className="carousel__slot"
              initial={false}
              animate={{
                x,
                scale: SCALE[k],
                rotateY: -sign * ROTATE[k],
                opacity: hidden ? 0 : OPACITY[k],
                zIndex: 10 - a,
              }}
              transition={drag ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
              style={{ pointerEvents: hidden ? "none" : "auto" }}
              aria-hidden={hidden}
            >
              <HoloCard
                universe={u}
                index={i}
                total={n}
                count={counts[u.id] ?? 0}
                active={i === active}
                onSelect={() => go(i)}
                onEnter={() => enter(u)}
              />
            </motion.div>
          );
        })}
        <div className="carousel__pool" aria-hidden>
          <span /><span /><span />
        </div>
      </div>

      <button className="carousel__arrow carousel__arrow--prev" onClick={() => go(active - 1)} aria-label="Universo anterior">
        <ChevronLeft size={22} strokeWidth={1.6} />
      </button>
      <button className="carousel__arrow carousel__arrow--next" onClick={() => go(active + 1)} aria-label="Universo siguiente">
        <ChevronRight size={22} strokeWidth={1.6} />
      </button>

      <div className="carousel__dots" role="tablist" aria-label="Elegir universo">
        {universes.map((u, i) => (
          <button
            key={u.id}
            role="tab"
            aria-selected={i === active}
            aria-label={u.name}
            className={`carousel__dot ${i === active ? "is-on" : ""}`}
            style={{ ["--c" as string]: hexToRgb(u.color) }}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <p id="carousel-help" className="sr-only">Usa las flechas izquierda y derecha para recorrer los universos y Enter para entrar.</p>
      <p className="sr-only" aria-live="polite">{current ? `${current.name}, universo ${active + 1} de ${n}` : ""}</p>

      {leaving && (
        <motion.div
          className="carousel__portal"
          style={{ ["--c" as string]: hexToRgb(leaving.color), ["--g" as string]: hexToRgb(leaving.glow) }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 3 }}
          transition={{ duration: 0.7, ease: [0.6, 0, 0.4, 1] }}
          aria-hidden
        />
      )}
    </section>
  );
}

export const ACTIVE_STORE_KEY = STORE;
