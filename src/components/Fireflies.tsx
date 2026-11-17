"use client";

import { useEffect, useRef } from "react";

interface Props {
  count?: number;
  /** Colores en formato "r, g, b". */
  colors?: string[];
  className?: string;
  /** Zona vertical donde nacen (0 = arriba, 1 = abajo). */
  band?: [number, number];
}

/** Luciérnagas en canvas: ligeras, con parpadeo suave y deriva orgánica. */
export function Fireflies({ count = 46, colors = ["255, 214, 130", "255, 236, 180", "214, 180, 255"], className, band = [0.25, 1] }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const n = w < 640 ? Math.round(count * 0.55) : count;
    const flies = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: h * (band[0] + Math.random() * (band[1] - band[0])),
      r: 0.8 + Math.random() * 1.8,
      a: Math.random() * Math.PI * 2,
      s: 0.12 + Math.random() * 0.35,
      p: Math.random() * Math.PI * 2,
      ps: 0.008 + Math.random() * 0.025,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flies) {
        if (!reduce) {
          f.a += (Math.random() - 0.5) * 0.18;
          f.x += Math.cos(f.a) * f.s;
          f.y += Math.sin(f.a) * f.s * 0.7 - 0.04;
          f.p += f.ps;
          if (f.x < -10) f.x = w + 10;
          if (f.x > w + 10) f.x = -10;
          if (f.y < h * band[0] - 40) f.y = h * band[1];
          if (f.y > h + 10) f.y = h * band[0];
        }
        const glow = 0.25 + 0.75 * Math.pow((Math.sin(f.p) + 1) / 2, 2);
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
        g.addColorStop(0, `rgba(${f.c}, ${0.95 * glow})`);
        g.addColorStop(0.25, `rgba(${f.c}, ${0.35 * glow})`);
        g.addColorStop(1, `rgba(${f.c}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && visible && !reduce) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, [count, colors, band]);

  return <canvas ref={ref} className={`fireflies ${className ?? ""}`} aria-hidden />;
}
