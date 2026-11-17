"use client";

import { useId } from "react";
import { SymbolIcon } from "@/lib/symbols";

/**
 * Ilustraciones holográficas de cada universo (SVG con volumen: degradados,
 * brillos y sombras). Se eligen por el símbolo del universo, así que un
 * universo nuevo con uno de estos símbolos hereda su ilustración; el resto usa
 * un orbe con el icono.
 */

interface P { c: string; g: string; id: (s: string) => string }

function Defs({ c, g, id }: P) {
  return (
    <defs>
      <radialGradient id={id("aura")} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={g} stopOpacity="0.55" />
        <stop offset="0.45" stopColor={c} stopOpacity="0.22" />
        <stop offset="1" stopColor={c} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={id("main")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.35" stopColor={g} />
        <stop offset="1" stopColor={c} />
      </linearGradient>
      <linearGradient id={id("deep")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={c} />
        <stop offset="1" stopColor="#1a1250" />
      </linearGradient>
      <radialGradient id={id("core")} cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fffbea" />
        <stop offset="0.4" stopColor="#ffe3a3" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ffb85c" stopOpacity="0" />
      </radialGradient>
      <filter id={id("soft")} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.2" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
  );
}

/** Emisor holográfico: disco de luz y haz ascendente que unifica todas las ilustraciones. */
function Emitter({ c, g, id }: P) {
  return (
    <g className="ill-emitter">
      <path d="M62 176 L80 120 L120 120 L138 176 Z" fill={c} opacity="0.08" />
      <ellipse cx="100" cy="176" rx="46" ry="8" fill="none" stroke={g} strokeOpacity="0.55" strokeWidth="1" />
      <ellipse cx="100" cy="176" rx="30" ry="5" fill="none" stroke={g} strokeOpacity="0.35" strokeWidth="1" />
      <ellipse cx="100" cy="176" rx="18" ry="3" fill={g} opacity="0.5" filter={`url(#${id("soft")})`} />
    </g>
  );
}

function Lotus(p: P) {
  const { c, g, id } = p;
  const petal = "M100 128 C86 108 86 82 100 58 C114 82 114 108 100 128Z";
  return (
    <g className="ill-float">
      <ellipse cx="100" cy="130" rx="54" ry="9" fill={c} opacity="0.35" filter={`url(#${id("soft")})`} />
      {[-62, -40, 40, 62].map((a) => (
        <path key={a} d={petal} transform={`rotate(${a} 100 128)`} fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.5" strokeWidth="0.8" />
      ))}
      {[-24, 24].map((a) => (
        <path key={a} d={petal} transform={`rotate(${a} 100 128) scale(1 1.04)`} fill={`url(#${id("main")})`} opacity="0.85" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.6" />
      ))}
      <path d={petal} fill={`url(#${id("main")})`} stroke="#fff" strokeOpacity="0.7" strokeWidth="0.7" />
      <path d="M100 124 C96 104 96 86 100 70" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
      <circle cx="100" cy="116" r="14" fill={`url(#${id("core")})`} className="ill-pulse" />
    </g>
  );
}

function BookTree(p: P) {
  const { c, g, id } = p;
  return (
    <g>
      <g className="ill-float">
        {/* copa del árbol de luz */}
        <g filter={`url(#${id("glow")})`}>
          {[[100, 62, 22], [80, 72, 16], [120, 72, 16], [88, 54, 13], [113, 54, 13], [70, 84, 10], [130, 84, 10]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i === 0 ? `url(#${id("main")})` : g} opacity={i === 0 ? 0.9 : 0.55} />
          ))}
        </g>
        <path d="M100 128 C98 112 96 100 100 80 M100 104 C92 96 86 90 80 80 M100 98 C108 90 114 86 122 78" stroke="#fff4d6" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {[[76, 46], [126, 44], [60, 70], [142, 66], [100, 34]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.6" fill="#fff" className="ill-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </g>
      {/* libro abierto */}
      <path d="M100 134 C84 126 62 125 42 130 L42 150 C62 145 84 146 100 154 Z" fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.6" strokeWidth="0.8" />
      <path d="M100 134 C116 126 138 125 158 130 L158 150 C138 145 116 146 100 154 Z" fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.6" strokeWidth="0.8" />
      <path d="M100 130 C84 120 62 119 46 124 L46 144 C62 139 84 140 100 150 Z" fill="#fdf6e6" opacity="0.95" />
      <path d="M100 130 C116 120 138 119 154 124 L154 144 C138 139 116 140 100 150 Z" fill="#f3e6cc" opacity="0.95" />
      {[0, 1, 2].map((i) => (
        <g key={i} stroke="#c9b48a" strokeOpacity="0.6" strokeWidth="0.6">
          <path d={`M56 ${130 + i * 5} C70 ${127 + i * 5} 84 ${128 + i * 5} 94 ${133 + i * 5}`} fill="none" />
          <path d={`M144 ${130 + i * 5} C130 ${127 + i * 5} 116 ${128 + i * 5} 106 ${133 + i * 5}`} fill="none" />
        </g>
      ))}
      <ellipse cx="100" cy="132" rx="16" ry="6" fill={`url(#${id("core")})`} />
    </g>
  );
}

function Music(p: P) {
  const { c, g, id } = p;
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M30 ${112 + i * 8} C60 ${96 + i * 8} 80 ${128 + i * 8} 110 ${110 + i * 8} S160 ${100 + i * 8} 172 ${108 + i * 8}`} fill="none" stroke={g} strokeOpacity={0.5 - i * 0.12} strokeWidth="1" className="ill-wave" style={{ animationDelay: `${i * -0.8}s` }} />
      ))}
      <g className="ill-float" filter={`url(#${id("glow")})`}>
        <path d="M86 58 L134 46 L134 108" stroke={`url(#${id("main")})`} strokeWidth="5" fill="none" strokeLinejoin="round" />
        <path d="M86 58 L86 122" stroke={`url(#${id("main")})`} strokeWidth="5" fill="none" />
        <path d="M86 58 L134 46 L134 58 L86 70 Z" fill={`url(#${id("main")})`} />
        <ellipse cx="74" cy="124" rx="15" ry="11" transform="rotate(-22 74 124)" fill={`url(#${id("deep")})`} stroke="#fff" strokeOpacity="0.6" />
        <ellipse cx="122" cy="110" rx="15" ry="11" transform="rotate(-22 122 110)" fill={`url(#${id("deep")})`} stroke="#fff" strokeOpacity="0.6" />
        <ellipse cx="70" cy="120" rx="5" ry="2.5" transform="rotate(-22 70 120)" fill="#fff" opacity="0.7" />
        <ellipse cx="118" cy="106" rx="5" ry="2.5" transform="rotate(-22 118 106)" fill="#fff" opacity="0.7" />
      </g>
      <circle cx="148" cy="72" r="2" fill="#fff" className="ill-twinkle" />
      <circle cx="54" cy="86" r="1.6" fill={g} className="ill-twinkle" style={{ animationDelay: "1s" }} />
      <circle cx="100" cy="88" r="10" fill={c} opacity="0.25" filter={`url(#${id("soft")})`} />
    </g>
  );
}

function Planet(p: P) {
  const { c, g, id } = p;
  return (
    <g>
      <radialGradient id={id("sphere")} cx="38%" cy="32%" r="70%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.25" stopColor={g} />
        <stop offset="0.7" stopColor={c} />
        <stop offset="1" stopColor="#120b40" />
      </radialGradient>
      <g transform="translate(100 98) rotate(-18)">
        <ellipse rx="70" ry="20" fill="none" stroke={g} strokeOpacity="0.25" strokeWidth="1" />
        <g transform="scale(1 0.29)"><g className="ill-orbit"><circle cx="70" cy="0" r="9" fill="#fff" /></g></g>
        <path d="M-58 0 A58 15 0 0 1 58 0" fill="none" stroke={`url(#${id("main")})`} strokeWidth="5" opacity="0.55" />
      </g>
      <circle cx="100" cy="98" r="34" fill={`url(#${id("sphere")})`} />
      <path d="M72 92 C86 86 112 88 130 96" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" fill="none" />
      <path d="M70 104 C88 100 114 102 132 110" stroke={c} strokeOpacity="0.5" strokeWidth="2" fill="none" />
      <g transform="translate(100 98) rotate(-18)">
        <path d="M-58 0 A58 15 0 0 0 58 0" fill="none" stroke={`url(#${id("main")})`} strokeWidth="5" filter={`url(#${id("glow")})`} />
      </g>
      <g transform="translate(100 98) rotate(28) scale(1 0.42)">
        <ellipse rx="84" ry="84" fill="none" stroke={g} strokeOpacity="0.3" strokeDasharray="2 6" />
        <g className="ill-orbit ill-orbit--slow"><circle cx="84" cy="0" r="5" fill={g} /></g>
      </g>
      <circle cx="88" cy="84" r="8" fill="#fff" opacity="0.35" filter={`url(#${id("soft")})`} />
    </g>
  );
}

function Geometry(p: P) {
  const { c, g, id } = p;
  const R = 46;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [100 + Math.cos(a) * R, 98 + Math.sin(a) * R];
  });
  const inner = pts.map(([x, y]) => [100 + (x - 100) * 0.5, 98 + (y - 98) * 0.5]);
  return (
    <g>
      <g className="ill-spin">
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={c} fillOpacity="0.08" stroke={g} strokeWidth="1.2" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={inner[(i + 1) % 6][0]} y2={inner[(i + 1) % 6][1]} stroke={g} strokeOpacity="0.5" />
            <line x1={x} y1={y} x2={inner[i][0]} y2={inner[i][1]} stroke={g} strokeOpacity="0.5" />
          </g>
        ))}
        <polygon points={inner.map((p) => p.join(",")).join(" ")} fill={`url(#${id("deep")})`} fillOpacity="0.6" stroke="#fff" strokeOpacity="0.7" />
        {[...pts, ...inner].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i < 6 ? 3 : 2} fill={i < 6 ? g : "#fff"} filter={`url(#${id("glow")})`} />
        ))}
      </g>
      <circle cx="100" cy="98" r="12" fill={`url(#${id("main")})`} className="ill-pulse" filter={`url(#${id("glow")})`} />
      <g stroke={g} strokeOpacity="0.4" strokeWidth="1" fill="none">
        <path d="M38 60 h14 v10" /><path d="M162 60 h-14 v10" /><path d="M38 140 h14 v-10" /><path d="M162 140 h-14 v-10" />
      </g>
    </g>
  );
}

function Leaf(p: P) {
  const { c, g, id } = p;
  return (
    <g className="ill-sway">
      <linearGradient id={id("leaf")} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#0f4a2a" />
        <stop offset="0.5" stopColor={c} />
        <stop offset="1" stopColor="#eaffd6" />
      </linearGradient>
      <path d="M52 150 C52 96 92 52 156 44 C150 104 116 146 52 150Z" fill={`url(#${id("leaf")})`} stroke="#eaffd6" strokeOpacity="0.5" />
      <path d="M52 150 C82 120 114 84 156 44" stroke="#f2ffe8" strokeOpacity="0.8" strokeWidth="1.6" fill="none" />
      {[[70, 128, 64, 104], [84, 114, 80, 88], [98, 100, 98, 74], [112, 86, 116, 64], [80, 128, 104, 132], [96, 112, 122, 116], [112, 96, 136, 96]].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} Q${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke="#eaffd6" strokeOpacity="0.35" fill="none" />
      ))}
      <path d="M58 140 C70 100 100 70 140 56" stroke="#fff" strokeOpacity="0.25" strokeWidth="6" fill="none" strokeLinecap="round" filter={`url(#${id("soft")})`} />
      {/* gotas de rocío */}
      {[[96, 92, 6], [122, 78, 4], [76, 120, 3.5]].map(([x, y, r], i) => (
        <g key={i} className="ill-pulse" style={{ animationDelay: `${i * 0.7}s` }}>
          <circle cx={x} cy={y} r={r} fill={g} opacity="0.35" />
          <circle cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="0.8" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

function Butterfly(p: P) {
  const { c, g, id } = p;
  return (
    <g className="ill-float">
      <linearGradient id={id("wing")} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff0d8" />
        <stop offset="0.4" stopColor={g} />
        <stop offset="1" stopColor={c} />
      </linearGradient>
      <g className="ill-flap ill-flap--l">
        <path d="M98 96 C80 60 50 46 34 58 C24 78 48 100 98 102Z" fill={`url(#${id("wing")})`} stroke="#fff" strokeOpacity="0.7" />
        <path d="M98 104 C70 106 50 120 56 138 C70 150 90 132 98 110Z" fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.8" />
        <path d="M94 98 C76 76 56 64 42 64" stroke="#fff" strokeOpacity="0.4" fill="none" />
      </g>
      <g className="ill-flap ill-flap--r">
        <path d="M102 96 C120 60 150 46 166 58 C176 78 152 100 102 102Z" fill={`url(#${id("wing")})`} stroke="#fff" strokeOpacity="0.7" />
        <path d="M102 104 C130 106 150 120 144 138 C130 150 110 132 102 110Z" fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.8" />
        <path d="M106 98 C124 76 144 64 158 64" stroke="#fff" strokeOpacity="0.4" fill="none" />
      </g>
      <ellipse cx="100" cy="104" rx="3.5" ry="20" fill="#2a1a40" stroke={g} strokeOpacity="0.8" />
      <path d="M99 86 C94 74 90 68 84 64 M101 86 C106 74 110 68 116 64" stroke={g} strokeWidth="1" fill="none" />
      <circle cx="84" cy="64" r="2" fill={g} /><circle cx="116" cy="64" r="2" fill={g} />
      {[[60, 80], [140, 80], [70, 130], [132, 132]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#fff" opacity="0.8" className="ill-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
    </g>
  );
}

function Sprout(p: P) {
  const { c, g, id } = p;
  return (
    <g>
      <ellipse cx="100" cy="146" rx="50" ry="10" fill={c} opacity="0.3" filter={`url(#${id("soft")})`} />
      <ellipse cx="100" cy="142" rx="18" ry="11" fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.6" />
      <ellipse cx="95" cy="138" rx="6" ry="3" fill="#fff" opacity="0.35" />
      <g className="ill-grow">
        <path d="M100 136 C98 116 104 98 100 78" stroke="#c9ffcf" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 104 C84 98 72 86 70 70 C88 70 100 84 100 104Z" fill={`url(#${id("main")})`} stroke="#fff" strokeOpacity="0.5" />
        <path d="M101 96 C116 88 128 74 130 58 C112 60 100 76 101 96Z" fill={`url(#${id("main")})`} stroke="#fff" strokeOpacity="0.5" />
        <circle cx="100" cy="74" r="12" fill={`url(#${id("core")})`} className="ill-pulse" />
        <circle cx="100" cy="74" r="3" fill="#fff" />
      </g>
      {[[66, 56], [138, 98], [76, 112], [128, 42]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={g} className="ill-rise" style={{ animationDelay: `${i * -1.2}s` }} />
      ))}
    </g>
  );
}

function Library(p: P) {
  const { c, g, id } = p;
  const stars = [[52, 44], [78, 30], [104, 48], [130, 28], [152, 52], [118, 70]];
  return (
    <g>
      <g className="ill-twinkle-group">
        <polyline points={stars.map((s) => s.join(",")).join(" ")} fill="none" stroke={g} strokeOpacity="0.5" strokeWidth="0.8" />
        <line x1="104" y1="48" x2="118" y2="70" stroke={g} strokeOpacity="0.5" strokeWidth="0.8" />
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 2.4 : 1.8} fill="#fff" filter={`url(#${id("glow")})`} className="ill-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
        ))}
      </g>
      <g className="ill-float">
        {[
          { x: 60, w: 18, h: 66, col: c, rot: 0 },
          { x: 80, w: 16, h: 76, col: g, rot: 0 },
          { x: 98, w: 20, h: 70, col: c, rot: 0 },
          { x: 122, w: 16, h: 60, col: g, rot: 12 },
        ].map((b, i) => (
          <g key={i} transform={`rotate(${b.rot} ${b.x + b.w / 2} 150)`}>
            <rect x={b.x} y={150 - b.h} width={b.w} height={b.h} rx="2.5" fill={`url(#${id("deep")})`} stroke={b.col} strokeOpacity="0.8" />
            <rect x={b.x + 2} y={150 - b.h + 2} width="3" height={b.h - 4} rx="1.5" fill="#fff" opacity="0.25" />
            <line x1={b.x + 3} y1={150 - b.h + 12} x2={b.x + b.w - 3} y2={150 - b.h + 12} stroke={b.col} strokeOpacity="0.8" />
            <line x1={b.x + 3} y1={150 - 14} x2={b.x + b.w - 3} y2={150 - 14} stroke={b.col} strokeOpacity="0.8" />
            <circle cx={b.x + b.w / 2} cy={150 - b.h / 2} r="2.2" fill="#ffe7b0" opacity="0.9" />
          </g>
        ))}
        <rect x="52" y="150" width="96" height="5" rx="2" fill={g} opacity="0.55" />
      </g>
    </g>
  );
}

function Orb({ c, g, id, symbol }: P & { symbol: string }) {
  return (
    <g className="ill-float">
      <circle cx="100" cy="98" r="40" fill={`url(#${id("deep")})`} stroke={g} strokeOpacity="0.7" />
      <circle cx="86" cy="82" r="12" fill="#fff" opacity="0.25" filter={`url(#${id("soft")})`} />
      <foreignObject x="76" y="74" width="48" height="48">
        <div style={{ color: "#fff", display: "grid", placeItems: "center", width: 48, height: 48 }}>
          <SymbolIcon name={symbol} size={40} />
        </div>
      </foreignObject>
      <circle cx="100" cy="98" r="52" fill="none" stroke={c} strokeOpacity="0.4" strokeDasharray="3 7" className="ill-spin" />
    </g>
  );
}

function Fruit(p: P) {
  const { c, g, id } = p;
  // Fruta translúcida (holográfica) con semillas de luz, hoja y una gota de rocío.
  const body = "M100 66 C86 54 56 58 50 88 C44 120 66 156 88 158 C94 158 96 154 100 154 C104 154 106 158 112 158 C134 156 156 120 150 88 C144 58 114 54 100 66Z";
  return (
    <g className="ill-float">
      <radialGradient id={id("fruit")} cx="38%" cy="34%" r="75%">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="0.3" stopColor={g} stopOpacity="0.85" />
        <stop offset="0.75" stopColor={c} stopOpacity="0.75" />
        <stop offset="1" stopColor="#1d4a1a" stopOpacity="0.9" />
      </radialGradient>
      <ellipse cx="100" cy="160" rx="44" ry="7" fill={c} opacity="0.35" filter={`url(#${id("soft")})`} />
      <path d={body} fill={`url(#${id("fruit")})`} stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />
      {/* corte interior: anillo y semillas luminosas */}
      <ellipse cx="100" cy="112" rx="26" ry="30" fill="none" stroke="#fff" strokeOpacity="0.35" strokeDasharray="2 4" />
      {[[100, 96], [88, 108], [112, 108], [92, 124], [108, 124]].map(([x, y], i) => (
        <g key={i} className="ill-pulse" style={{ animationDelay: `${i * 0.35}s` }}>
          <ellipse cx={x} cy={y} rx="3.4" ry="5" fill={`url(#${id("core")})`} />
          <ellipse cx={x} cy={y} rx="1.4" ry="2.4" fill="#fff8e0" />
        </g>
      ))}
      {/* brillo especular */}
      <path d="M66 86 C70 72 82 66 92 68" stroke="#fff" strokeOpacity="0.75" strokeWidth="4" fill="none" strokeLinecap="round" filter={`url(#${id("soft")})`} />
      <path d="M68 88 C72 76 82 70 90 71" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* tallo y hoja */}
      <path d="M100 68 C100 58 103 50 108 44" stroke="#5b3b1e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="ill-sway-leaf">
        <path d="M106 50 C116 34 138 32 148 40 C140 54 120 60 106 50Z" fill={`url(#${id("main")})`} stroke="#fff" strokeOpacity="0.6" />
        <path d="M108 49 C120 44 132 41 146 40" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" fill="none" />
      </g>
      {/* gota */}
      <g className="ill-pulse" style={{ animationDelay: "0.8s" }}>
        <path d="M136 112 C136 104 140 98 142 94 C144 98 148 104 148 112 C148 116 145 119 142 119 C139 119 136 116 136 112Z" fill={g} opacity="0.45" stroke="#fff" strokeOpacity="0.8" strokeWidth="0.8" />
        <circle cx="140" cy="108" r="1.6" fill="#fff" />
      </g>
      {[[58, 60], [150, 72], [62, 140]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#fff" className="ill-twinkle" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </g>
  );
}

const BY_SYMBOL: Record<string, (p: P) => React.JSX.Element> = {
  loto: Lotus,
  libro: BookTree,
  musica: Music,
  atomo: Planet,
  telescopio: Planet,
  chip: Geometry,
  hoja: Leaf,
  fruta: Fruit,
  arbol: Leaf,
  paleta: Butterfly,
  bombilla: Sprout,
  biblioteca: Library,
};

export function UniverseIllustration({ symbol, color, glow }: { symbol: string; color: string; glow: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const props: P = { c: color, g: glow, id };
  const Art = BY_SYMBOL[symbol];
  return (
    <svg viewBox="0 0 200 190" className="ill" aria-hidden>
      <Defs {...props} />
      <circle cx="100" cy="96" r="78" fill={`url(#${id("aura")})`} className="ill-aura" />
      <Emitter {...props} />
      {Art ? <Art {...props} /> : <Orb {...props} symbol={symbol} />}
    </svg>
  );
}
