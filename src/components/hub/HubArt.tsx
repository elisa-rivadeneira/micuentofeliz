import type { SectionKey } from "@/lib/types";

/** Ilustraciones de las tres secciones (SVG con volumen y luz). */

function LibraryArt() {
  return (
    <svg viewBox="0 0 320 190" className="hub-art" aria-hidden>
      <defs>
        <radialGradient id="ha-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbe6" /><stop offset="0.4" stopColor="#ffe9a8" stopOpacity="0.8" /><stop offset="1" stopColor="#ffd27a" stopOpacity="0" /></radialGradient>
        <linearGradient id="ha-page" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#efe2c8" /></linearGradient>
        <linearGradient id="ha-cover" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7b4fd0" /><stop offset="1" stopColor="#a978ef" /></linearGradient>
      </defs>
      <ellipse cx="160" cy="176" rx="130" ry="10" fill="#6b4cc4" opacity="0.18" />
      {/* libros de pie */}
      {[
        [196, 46, 22, 112, "#c4553a"], [220, 56, 20, 102, "#6b7fc9"], [242, 40, 24, 118, "#e1a84a"], [268, 60, 18, 98, "#7a5bbf"], [288, 70, 18, 88, "#4f9a7a"],
      ].map(([x, y, w, h, c], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height={h as number} rx="3" fill={c as string} />
          <rect x={(x as number) + 3} y={(y as number) + 3} width="4" height={(h as number) - 6} rx="2" fill="#fff" opacity="0.25" />
          <rect x={(x as number) + 2} y={(y as number) + 16} width={(w as number) - 4} height="3" fill="#fff" opacity="0.4" />
        </g>
      ))}
      {/* libro abierto con luz */}
      <circle cx="140" cy="120" r="70" fill="url(#ha-glow)" className="hub-art__pulse" />
      <path d="M140 132 C112 118 74 118 44 128 L44 168 C74 160 112 160 140 172 Z" fill="url(#ha-cover)" />
      <path d="M140 132 C168 118 206 118 236 128 L236 168 C206 160 168 160 140 172 Z" fill="url(#ha-cover)" />
      <path d="M140 126 C114 110 80 110 52 118 L52 160 C80 152 114 152 140 166 Z" fill="url(#ha-page)" />
      <path d="M140 126 C166 110 200 110 228 118 L228 160 C200 152 166 152 140 166 Z" fill="url(#ha-page)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} stroke="#cdb995" strokeWidth="1" opacity="0.7">
          <path d={`M64 ${128 + i * 7} C88 ${123 + i * 7} 112 ${124 + i * 7} 132 ${131 + i * 7}`} fill="none" />
          <path d={`M216 ${128 + i * 7} C192 ${123 + i * 7} 168 ${124 + i * 7} 148 ${131 + i * 7}`} fill="none" />
        </g>
      ))}
      <path d="M78 140 C86 132 96 132 104 138" stroke="#4caf50" strokeWidth="2" fill="none" />
      <ellipse cx="140" cy="128" rx="26" ry="10" fill="#fffbe6" opacity="0.9" className="hub-art__pulse" />
      {/* hojas */}
      <path d="M40 120 C30 96 44 78 66 74 C68 98 58 114 40 120Z" fill="#6cc46a" />
      <path d="M40 120 C48 104 56 90 66 74" stroke="#3f8f45" strokeWidth="1.4" fill="none" />
      <path d="M250 150 C266 132 288 132 300 142 C290 160 268 162 250 150Z" fill="#82d17c" />
      {[[100, 70], [176, 64], [140, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#fff" className="hub-art__twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </svg>
  );
}

function NotesArt() {
  return (
    <svg viewBox="0 0 320 190" className="hub-art" aria-hidden>
      <defs>
        <linearGradient id="na-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf6" /><stop offset="1" stopColor="#f1ead8" /></linearGradient>
        <linearGradient id="na-pen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a2a22" /><stop offset="0.5" stopColor="#6a4a3a" /><stop offset="1" stopColor="#3a2a22" /></linearGradient>
      </defs>
      <ellipse cx="160" cy="176" rx="120" ry="10" fill="#2f8a52" opacity="0.15" />
      {/* hojas detrás */}
      <path d="M70 70 C52 50 60 26 84 22 C92 46 84 62 70 70Z" fill="#7fcf7a" />
      <path d="M262 80 C284 64 304 72 306 92 C284 100 270 94 262 80Z" fill="#6cc46a" />
      <path d="M58 150 C38 150 26 132 34 116 C54 120 62 134 58 150Z" fill="#8fdc84" />
      {/* cuaderno */}
      <g transform="rotate(-8 160 110)">
        <rect x="82" y="40" width="160" height="128" rx="8" fill="#e9dcc0" />
        <rect x="78" y="36" width="160" height="128" rx="8" fill="url(#na-paper)" stroke="#e3d6b8" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="98" y1={62 + i * 13} x2="222" y2={62 + i * 13} stroke="#d8ccb0" strokeWidth="1" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <circle cx="80" cy={48 + i * 13} r="4.5" fill="none" stroke="#c48a3a" strokeWidth="2" />
          </g>
        ))}
        {/* boceto de hojas */}
        <g stroke="#3f9a4a" strokeWidth="2" fill="none" strokeLinecap="round" className="hub-art__draw">
          <path d="M120 140 C140 120 166 104 200 92" />
          <path d="M140 124 C134 104 148 88 166 86 C168 104 158 118 140 124Z" fill="#9ee09466" />
          <path d="M168 108 C172 88 192 80 206 86 C200 104 186 112 168 108Z" fill="#9ee09466" />
          <path d="M150 112 C156 100 160 94 166 86" />
          <path d="M178 104 C186 96 194 90 206 86" />
        </g>
      </g>
      {/* pluma */}
      <g transform="rotate(38 250 100)" className="hub-art__pen">
        <rect x="236" y="20" width="12" height="120" rx="6" fill="url(#na-pen)" />
        <rect x="236" y="34" width="12" height="6" fill="#d6a84a" />
        <path d="M236 140 L248 140 L242 160 Z" fill="#d6a84a" />
        <path d="M241 150 L243 150 L242 160 Z" fill="#3a2a22" />
      </g>
    </svg>
  );
}

function RecipeArt() {
  return (
    <svg viewBox="0 0 320 190" className="hub-art" aria-hidden>
      <defs>
        <linearGradient id="ra-bowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e8e2dc" /></linearGradient>
        <radialGradient id="ra-quinoa" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#d9b88a" /><stop offset="1" stopColor="#a8825a" /></radialGradient>
        <linearGradient id="ra-avo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9f5a8" /><stop offset="0.6" stopColor="#b6d86a" /><stop offset="1" stopColor="#4c7a2a" /></linearGradient>
      </defs>
      <ellipse cx="160" cy="174" rx="110" ry="10" fill="#c46a2a" opacity="0.15" />
      {/* hojas de albahaca */}
      <path d="M58 90 C40 70 48 46 70 44 C78 68 72 82 58 90Z" fill="#5fb85a" />
      <path d="M270 80 C290 62 310 70 312 88 C292 98 278 94 270 80Z" fill="#6cc46a" />
      <path d="M250 50 C262 32 284 32 292 44 C280 58 262 60 250 50Z" fill="#7fd07a" />
      {/* contenido del bowl */}
      <ellipse cx="160" cy="104" rx="98" ry="30" fill="url(#ra-quinoa)" />
      {Array.from({ length: 60 }, (_, i) => (
        <circle key={i} cx={80 + ((i * 37) % 150)} cy={92 + ((i * 13) % 26)} r="2" fill={i % 3 ? "#f3dfb8" : "#7a4a3a"} opacity="0.9" />
      ))}
      {/* tomates */}
      {[[118, 102], [134, 112], [104, 114], [150, 100]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="10" fill="#e5412e" /><circle cx={x - 3} cy={y - 3} r="3" fill="#fff" opacity="0.5" /></g>
      ))}
      {/* aguacate */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${182 + i * 12} 82 C${200 + i * 12} 84 ${210 + i * 12} 100 ${204 + i * 12} 116 C${196 + i * 12} 110 ${186 + i * 12} 98 ${182 + i * 12} 82Z`} fill="url(#ra-avo)" stroke="#3e6a24" strokeWidth="1.2" />
      ))}
      <path d="M96 96 C104 88 112 86 120 88" stroke="#5fb85a" strokeWidth="5" strokeLinecap="round" />
      {/* bowl */}
      <path d="M58 104 C62 150 104 170 160 170 C216 170 258 150 262 104 Z" fill="url(#ra-bowl)" />
      <ellipse cx="160" cy="104" rx="102" ry="10" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M78 122 C96 150 130 160 160 160" stroke="#fff" strokeWidth="4" opacity="0.7" fill="none" strokeLinecap="round" />
      {/* vapor */}
      {[130, 160, 190].map((x, i) => (
        <path key={x} d={`M${x} 70 C${x - 8} 58 ${x + 8} 50 ${x} 38`} stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" className="hub-art__steam" style={{ animationDelay: `${i * 0.6}s` }} />
      ))}
    </svg>
  );
}

export function HubArt({ section }: { section: SectionKey }) {
  if (section === "videoteca") return <LibraryArt />;
  if (section === "biblioteca") return <NotesArt />;
  return <RecipeArt />;
}
