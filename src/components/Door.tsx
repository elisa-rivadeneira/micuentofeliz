"use client";

import { useId } from "react";
import type { DoorStyle } from "@/lib/types";
import { SymbolIcon } from "@/lib/symbols";

/** Contornos de arco por estilo (viewBox 200×300, base en y=290). */
const ARCHES: Record<DoorStyle, string> = {
  "medio-punto": "M30 290 V125 A70 70 0 0 1 170 125 V290 Z",
  ojival: "M30 290 V135 Q30 62 100 22 Q170 62 170 135 V290 Z",
  herradura: "M38 290 V150 A72 72 0 1 1 162 150 V290 Z",
  lobulado: "M30 290 V132 A22 22 0 0 1 46 98 A28 28 0 0 1 74 58 A30 30 0 0 1 126 58 A28 28 0 0 1 154 98 A22 22 0 0 1 170 132 V290 Z",
  cerradura: "M58 290 L70 168 A52 52 0 1 1 130 168 L142 290 Z",
};

interface DoorProps {
  color: string;
  glow: string;
  symbol: string;
  style: DoorStyle;
  /** Abierta permanentemente (p. ej. dentro del universo). */
  open?: boolean;
  /** Puerta especial cerrada con sello (El Mundo Compartido). */
  sealed?: boolean;
  className?: string;
}

export function Door({ color, glow, symbol, style, open, sealed, className }: DoorProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const arch = ARCHES[style] ?? ARCHES.ojival;
  const id = (s: string) => `${s}-${uid}`;

  return (
    <div className={`door ${open ? "door--open" : ""} ${sealed ? "door--sealed" : ""} ${className ?? ""}`} style={{ ["--door-color" as string]: color, ["--door-glow" as string]: glow }}>
      <svg viewBox="0 0 200 300" className="door__svg" aria-hidden>
        <defs>
          <radialGradient id={id("light")} cx="50%" cy="62%" r="65%">
            <stop offset="0" stopColor="#fff8e6" />
            <stop offset="0.25" stopColor={glow} />
            <stop offset="0.7" stopColor={color} stopOpacity="0.85" />
            <stop offset="1" stopColor="#120c33" />
          </radialGradient>
          <linearGradient id={id("leaf")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a2350" />
            <stop offset="0.5" stopColor="#171236" />
            <stop offset="1" stopColor="#0d0a24" />
          </linearGradient>
          <linearGradient id={id("tint")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={color} stopOpacity="0.75" />
            <stop offset="0.55" stopColor={color} stopOpacity="0.3" />
            <stop offset="1" stopColor={color} stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id={id("stone")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efe2c6" />
            <stop offset="1" stopColor="#9c8f7a" />
          </linearGradient>
          <pattern id={id("lattice")} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 8h16M8 0v16" stroke={glow} strokeOpacity="0.55" strokeWidth="1.1" />
            <circle cx="8" cy="8" r="1.8" fill="none" stroke={glow} strokeOpacity="0.7" strokeWidth="0.8" />
          </pattern>
          <clipPath id={id("clip")}>
            <path d={arch} />
          </clipPath>
          <filter id={id("blur")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* halo exterior */}
        <path d={arch} fill={color} opacity="0.55" filter={`url(#${id("blur")})`} className="door__halo" />

        {/* interior luminoso */}
        <g clipPath={`url(#${id("clip")})`}>
          <rect x="0" y="0" width="200" height="300" fill={`url(#${id("light")})`} />
          {/* árbol / horizonte del otro lado */}
          <g className="door__beyond" opacity="0.9">
            <ellipse cx="100" cy="292" rx="90" ry="22" fill={glow} opacity="0.45" />
            <path d="M100 290 C98 250 97 230 100 205 C103 230 102 250 100 290Z" fill="#fff4d6" opacity="0.65" />
            <circle cx="100" cy="190" r="34" fill="#fffaf0" opacity="0.35" />
            <circle cx="82" cy="200" r="22" fill="#fffaf0" opacity="0.25" />
            <circle cx="120" cy="198" r="24" fill="#fffaf0" opacity="0.25" />
          </g>
          {/* hojas de la puerta */}
          <g className="door__leaf door__leaf--l">
            <rect x="0" y="0" width="100" height="300" fill={`url(#${id("leaf")})`} />
            <rect x="0" y="0" width="100" height="300" fill={`url(#${id("tint")})`} />
            <rect x="0" y="0" width="100" height="300" fill={`url(#${id("lattice")})`} opacity="0.75" />
            <line x1="99" y1="0" x2="99" y2="300" stroke={glow} strokeOpacity="0.8" strokeWidth="1.5" />
            <circle cx="90" cy="215" r="3" fill={glow} />
          </g>
          <g className="door__leaf door__leaf--r">
            <rect x="100" y="0" width="100" height="300" fill={`url(#${id("leaf")})`} />
            <rect x="100" y="0" width="100" height="300" fill={`url(#${id("tint")})`} />
            <rect x="100" y="0" width="100" height="300" fill={`url(#${id("lattice")})`} opacity="0.75" />
            <line x1="101" y1="0" x2="101" y2="300" stroke={glow} strokeOpacity="0.8" strokeWidth="1.5" />
            <circle cx="110" cy="215" r="3" fill={glow} />
          </g>
          <rect x="97" y="0" width="6" height="300" fill={glow} opacity="0.9" filter={`url(#${id("blur")})`} className="door__crack" />
        </g>

        {/* marco de piedra con filete dorado */}
        <path d={arch} fill="none" stroke={`url(#${id("stone")})`} strokeWidth="13" strokeLinejoin="round" />
        <path d={arch} fill="none" stroke={glow} strokeOpacity="0.9" strokeWidth="1.6" strokeLinejoin="round" />
        <path d={arch} fill="none" stroke="#3b3160" strokeOpacity="0.5" strokeWidth="1" transform="translate(0 0)" strokeDasharray="2 6" />

        {/* escalón */}
        <rect x="14" y="286" width="172" height="10" rx="2" fill={`url(#${id("stone")})`} opacity="0.9" />

        {sealed && (
          <g className="door__seal">
            <path d="M40 150 C80 175 120 175 160 150" stroke="#cfd6ff" strokeOpacity="0.7" strokeWidth="2" fill="none" strokeDasharray="5 4" />
            <path d="M40 200 C80 225 120 225 160 200" stroke="#cfd6ff" strokeOpacity="0.55" strokeWidth="2" fill="none" strokeDasharray="5 4" />
          </g>
        )}
      </svg>

      <span className="door__symbol">
        <SymbolIcon name={symbol} size={26} />
      </span>
    </div>
  );
}
