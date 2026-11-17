"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { Compass, ArrowRight } from "lucide-react";
import { Fireflies } from "./Fireflies";

/**
 * Escena de inicio. La imagen del jardín se conserva intacta y se le añaden
 * capas vivas: brillo del portal, luna, faroles, lotos, niebla, reflejos en el
 * agua y luciérnagas. "Comenzar el viaje" atraviesa la puerta.
 *
 * Las coordenadas (en %) corresponden a la composición de la imagen original.
 */
const PORTAL = { x: 67.9, y: 47 };

const FIREFLY_COLORS = ["255, 214, 130", "255, 236, 180", "214, 180, 255"];
const FIREFLY_BAND: [number, number] = [0.2, 1];

export function Hero() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const zoom = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    router.prefetch("/jardin");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // La entrada (zoom suave y aparición del texto) es CSS: el contenido siempre termina visible.
    const ctx = gsap.context(() => {}, root);

    // Parallax suave con el puntero (solo en dispositivos con ratón).
    let cleanup = () => {};
    if (!reduce && window.matchMedia("(pointer: fine)").matches && parallax.current) {
      const xTo = gsap.quickTo(parallax.current, "x", { duration: 1.6, ease: "power3.out" });
      const yTo = gsap.quickTo(parallax.current, "y", { duration: 1.6, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -22);
        yTo((e.clientY / window.innerHeight - 0.5) * -12);
      };
      window.addEventListener("pointermove", onMove);
      cleanup = () => window.removeEventListener("pointermove", onMove);
    }
    return () => {
      ctx.revert();
      cleanup();
      // La navegación es compartida con el resto de páginas: la devolvemos a su estado.
      gsap.killTweensOf(".nav");
      gsap.set(".nav", { clearProps: "opacity,transform" });
    };
  }, [router]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      router.push("/jardin");
      return;
    }
    const tl = gsap.timeline({ onComplete: () => router.push("/jardin") });
    tl.to(".hero__copy, .nav", { opacity: 0, y: -10, duration: 0.5, ease: "power2.in" }, 0)
      .to(zoom.current, { scale: 4.2, duration: 2, ease: "power3.in", transformOrigin: `${PORTAL.x}% ${PORTAL.y}%` }, 0.1)
      .to(flash.current, { opacity: 1, duration: 0.9, ease: "power2.in" }, 1.25);
  };

  return (
    <div className="hero" ref={root}>
      <div className="hero__stage">
        <div className="hero__parallax" ref={parallax}>
          <div className="hero__zoom" ref={zoom} style={{ transformOrigin: `${PORTAL.x}% ${PORTAL.y}%` }}>
            <Image src="/images/jardin.webp" alt="Jardín nocturno con una puerta monumental iluminada, luna creciente, faroles, lotos sobre el agua y un gato negro ante el portal" fill priority sizes="180vw" className="hero__img" />
            <span className="glow glow--portal" />
            <span className="glow glow--tree" />
            <span className="glow glow--moon" />
            <span className="glow glow--lantern" style={{ left: "48.4%", top: "66%" }} />
            <span className="glow glow--lantern" style={{ left: "89.2%", top: "60.6%", animationDelay: "-1.7s" }} />
            <span className="glow glow--lotus" style={{ left: "35.9%", top: "79.5%" }} />
            <span className="glow glow--lotus" style={{ left: "88%", top: "85%", animationDelay: "-2.4s" }} />
            <span className="hero__water" />
            <span className="hero__fog hero__fog--a" />
            <span className="hero__fog hero__fog--b" />
            <span className="hero__rays" />
          </div>
        </div>
      </div>

      <Fireflies count={60} className="hero__fireflies" colors={FIREFLY_COLORS} band={FIREFLY_BAND} />
      <div className="hero__vignette" />

      <section className="hero__copy">
        <div className="ornament hero__reveal" aria-hidden><span /><i>✦</i><span /></div>
        <h1 className="hero__title hero__reveal">
          Un Jardín de <br />Universos Compartidos
        </h1>
        <p className="hero__lead hero__reveal">
          Conocimiento, creación, ciencia, espiritualidad y vida, <br className="hide-sm" />
          conectados en un mismo lugar.
        </p>
        <div className="ornament ornament--short hero__reveal" aria-hidden><span /><i>✦</i><span /></div>
        <button className="cta hero__reveal" onClick={enter} disabled={leaving}>
          <Compass size={22} strokeWidth={1.4} className="cta__compass" />
          Comenzar el viaje
          <ArrowRight size={20} strokeWidth={1.4} className="cta__arrow" />
        </button>
      </section>

      <div className="hero__flash" ref={flash} />
    </div>
  );
}
