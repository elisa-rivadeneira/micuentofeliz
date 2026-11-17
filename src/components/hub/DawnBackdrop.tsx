/**
 * Amanecer violeta: el fondo de los centros de aprendizaje.
 * Cielo lavanda-durazno, sol naciente, montañas en capas, niebla y ramas en
 * flor. Si existe public/images/amanecer-fondo.(webp|jpg|png) se usa esa
 * imagen en lugar del paisaje dibujado.
 */

const BLOSSOMS_L: [number, number, number, string][] = [
  [40, 30, 34, "#d9a6ff"], [96, 18, 26, "#f1c4ff"], [150, 46, 30, "#c58cf5"], [70, 78, 24, "#e9b3ff"],
  [200, 20, 22, "#f6d2ff"], [250, 52, 18, "#d7a0fa"], [128, 96, 18, "#ffd6f0"], [20, 120, 26, "#c993f5"],
  [300, 16, 14, "#f0c6ff"], [180, 90, 14, "#ffe6a3"],
];
const BLOSSOMS_R: [number, number, number, string][] = [
  [1560, 40, 30, "#ffe08a"], [1510, 80, 22, "#ffd36b"], [1590, 120, 26, "#f6c3ff"], [1470, 30, 18, "#ffeaa8"],
  [1540, 160, 18, "#d9a6ff"], [1420, 70, 14, "#ffe4a0"],
];

export function DawnBackdrop({ image }: { image?: string }) {
  return (
    <div className="dawn" aria-hidden>
      {image ? (
        <div className="dawn__img" style={{ backgroundImage: `url(${image})` }} />
      ) : (
        <svg className="dawn__svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="dw-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4b3b9e" />
              <stop offset="0.28" stopColor="#8a6fd6" />
              <stop offset="0.5" stopColor="#d9a6e6" />
              <stop offset="0.62" stopColor="#ffc9c4" />
              <stop offset="0.7" stopColor="#ffdcb0" />
            </linearGradient>
            <radialGradient id="dw-sun" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fffdf2" />
              <stop offset="0.12" stopColor="#fff2c4" />
              <stop offset="0.35" stopColor="#ffd28f" stopOpacity="0.75" />
              <stop offset="1" stopColor="#ffb88a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dw-m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9a8e8" /><stop offset="1" stopColor="#e8c3df" /></linearGradient>
            <linearGradient id="dw-m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9c7ccf" /><stop offset="1" stopColor="#c9a2d8" /></linearGradient>
            <linearGradient id="dw-m3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7357b3" /><stop offset="1" stopColor="#9b7cc4" /></linearGradient>
            <linearGradient id="dw-m4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4e3d8f" /><stop offset="1" stopColor="#3a2d74" /></linearGradient>
            <linearGradient id="dw-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2d74" /><stop offset="1" stopColor="#21194d" /></linearGradient>
            <filter id="dw-blur"><feGaussianBlur stdDeviation="2" /></filter>
            <filter id="dw-blur-lg"><feGaussianBlur stdDeviation="24" /></filter>
          </defs>

          <rect width="1600" height="900" fill="url(#dw-sky)" />
          {/* estrellas que se despiden */}
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={(i * 397) % 1600} cy={(i * 131) % 260} r={i % 5 === 0 ? 1.4 : 0.8} fill="#fff" opacity={0.25 + ((i * 7) % 10) / 30} className={i % 4 === 0 ? "dawn__star" : undefined} />
          ))}
          {/* sol */}
          <g className="dawn__sun">
            <circle cx="1120" cy="470" r="330" fill="url(#dw-sun)" />
            <g className="dawn__rays" opacity="0.35">
              {Array.from({ length: 14 }, (_, i) => (
                <path key={i} d="M1120 470 L1112 60 L1128 60 Z" fill="#fff6d8" transform={`rotate(${i * 25.7} 1120 470)`} />
              ))}
            </g>
            <circle cx="1120" cy="470" r="34" fill="#fffaf0" />
          </g>
          {/* montañas */}
          <path d="M0 520 L140 440 L260 470 L420 380 L560 450 L700 410 L860 470 L1000 400 L1160 360 L1300 420 L1460 380 L1600 430 L1600 900 L0 900Z" fill="url(#dw-m1)" opacity="0.8" />
          <ellipse cx="800" cy="520" rx="900" ry="40" fill="#fff0f4" opacity="0.35" filter="url(#dw-blur-lg)" className="dawn__mist" />
          <path d="M0 560 L120 500 L260 540 L400 470 L520 520 L640 480 L780 540 L940 500 L1060 440 L1180 330 L1260 380 L1360 350 L1480 450 L1600 480 L1600 900 L0 900Z" fill="url(#dw-m2)" />
          <path d="M1180 330 L1206 352 L1220 345 L1240 368 L1226 372 Z" fill="#f2e2ff" opacity="0.6" />
          <ellipse cx="900" cy="575" rx="900" ry="36" fill="#ffe7f0" opacity="0.3" filter="url(#dw-blur-lg)" className="dawn__mist dawn__mist--b" />
          <path d="M0 620 C160 560 300 600 420 570 C560 535 640 600 800 590 C960 580 1040 520 1200 540 C1340 556 1460 520 1600 560 L1600 900 L0 900Z" fill="url(#dw-m3)" />
          <path d="M0 690 C200 650 380 690 560 670 C760 648 900 700 1100 680 C1300 660 1460 690 1600 670 L1600 900 L0 900Z" fill="url(#dw-m4)" />
          <rect y="740" width="1600" height="160" fill="url(#dw-ground)" />
          {/* reflejo de luz en el valle */}
          <ellipse cx="1120" cy="760" rx="260" ry="14" fill="#ffd9a8" opacity="0.25" filter="url(#dw-blur-lg)" className="dawn__shine" />

          {/* ramas en flor */}
          <g className="dawn__branch">
            <path d="M-20 40 C80 60 160 30 260 70 C300 86 330 70 360 60" stroke="#4a2f5e" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M120 50 C140 90 120 120 140 150" stroke="#4a2f5e" strokeWidth="4" fill="none" strokeLinecap="round" />
            {BLOSSOMS_L.map(([x, y, r, c], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={r} fill={c} opacity="0.55" filter="url(#dw-blur)" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r * 0.35} cy={y + Math.sin((a * Math.PI) / 180) * r * 0.35} r={r * 0.28} fill={c} />
                ))}
                <circle cx={x} cy={y} r={r * 0.14} fill="#fff6c8" />
              </g>
            ))}
          </g>
          <g className="dawn__branch dawn__branch--r">
            <path d="M1620 90 C1540 100 1500 70 1420 100" stroke="#5a4030" strokeWidth="6" fill="none" strokeLinecap="round" />
            {BLOSSOMS_R.map(([x, y, r, c], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={r} fill={c} opacity="0.5" filter="url(#dw-blur)" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r * 0.35} cy={y + Math.sin((a * Math.PI) / 180) * r * 0.35} r={r * 0.28} fill={c} />
                ))}
              </g>
            ))}
          </g>
          {/* flores del primer plano */}
          {[[60, 860, 26, "#c27cff"], [130, 880, 18, "#e2a8ff"], [1540, 860, 24, "#b56ef5"], [1480, 885, 16, "#f0b6ff"]].map(([x, y, r, c], i) => (
            <g key={i} className="dawn__flower" style={{ animationDelay: `${i * -1.3}s` }}>
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <ellipse key={a} cx={Number(x)} cy={Number(y) - Number(r) * 0.55} rx={Number(r) * 0.28} ry={Number(r) * 0.6} fill={String(c)} transform={`rotate(${a} ${x} ${y})`} opacity="0.9" />
              ))}
              <circle cx={Number(x)} cy={Number(y)} r={Number(r) * 0.22} fill="#ffe7a8" />
            </g>
          ))}
        </svg>
      )}
      <div className="dawn__veil" />
    </div>
  );
}
