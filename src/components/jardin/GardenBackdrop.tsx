"use client";

import { useEffect, useRef, useState } from "react";
import { Fireflies } from "../Fireflies";
import { LivingWater } from "./LivingWater";
import "./jardin.css";

/**
 * Paisaje de fondo de Jardines.
 *
 * Imagen: public/images/jardines-fondo.(webp|jpg|png). Encima, capas vivas
 * ubicadas en % sobre la composición de la imagen (1672×941): halo de la luna,
 * cascadas que corren, reflejo de la luna en el lago, ondas, niebla, faroles,
 * lotos, pabellón iluminado, pétalos que caen y algunas luciérnagas.
 */
const PETALS = [
  { left: "8%", delay: "0s", dur: "17s", size: 9 },
  { left: "19%", delay: "-6s", dur: "21s", size: 7 },
  { left: "28%", delay: "-11s", dur: "19s", size: 8 },
  { left: "36%", delay: "-3s", dur: "24s", size: 6 },
  { left: "14%", delay: "-15s", dur: "23s", size: 7 },
];

const FLY_COLORS = ["255, 214, 150", "214, 180, 255", "190, 210, 255"];
const FLY_BAND: [number, number] = [0.35, 1];

export function GardenBackdrop({ image }: { image?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState(false);

  // Parallax muy leve con el puntero (solo ratón, sin movimiento reducido).
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -14;
      ty = (e.clientY / window.innerHeight - 0.5) * -8;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(1.03)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={`gb ${image ? "" : "gb--noimg"} ${gl ? "gb--gl" : ""}`} aria-hidden>
      <div className="gb__frame">
        <div className="gb__stage" ref={stage}>
          <div className="gb__img" style={image ? { backgroundImage: `url(${image})` } : undefined} />
          {image && <LivingWater src={image} onReady={setGl} />}
          <span className="gb__moon" />
          <span className="gb__fall" style={{ left: "10.5%", top: "35.5%", width: "15.5%", height: "19%" }} />
          <span className="gb__fall" style={{ left: "85.6%", top: "36.5%", width: "5.6%", height: "19.5%", animationDelay: "-1.3s" }} />
          <span className="gb__mist" style={{ left: "13%", top: "50%", width: "16%" }} />
          <span className="gb__mist" style={{ left: "84%", top: "52%", width: "9%" }} />
          <span className="gb__lake" />
          <span className="gb__moonpath" />
          <span className="gb__ripple" style={{ left: "50%", top: "77%" }} />
          <span className="gb__ripple" style={{ left: "50%", top: "77%", animationDelay: "-3s" }} />
          <span className="gb__lamp" style={{ left: "16.1%", top: "24.5%" }} />
          <span className="gb__lamp" style={{ left: "7.8%", top: "35%", animationDelay: "-1.1s" }} />
          <span className="gb__lamp gb__lamp--sm" style={{ left: "11.1%", top: "28%", animationDelay: "-2.2s" }} />
          <span className="gb__lamp gb__lamp--pavilion" style={{ left: "93.4%", top: "27%" }} />
          <span className="gb__lotus" style={{ left: "9.2%", top: "78.5%" }} />
          <span className="gb__lotus" style={{ left: "91.6%", top: "85%", animationDelay: "-2.5s" }} />
          <span className="gb__fog gb__fog--a" />
          <span className="gb__fog gb__fog--b" />
          {PETALS.map((p, i) => (
            <span key={i} className="gb__petal" style={{ left: p.left, width: p.size, height: p.size * 0.7, animationDelay: p.delay, animationDuration: p.dur }} />
          ))}
        </div>
      </div>
      <Fireflies count={18} colors={FLY_COLORS} band={FLY_BAND} className="gb__flies" />
      <div className="gb__shade" />
    </div>
  );
}
