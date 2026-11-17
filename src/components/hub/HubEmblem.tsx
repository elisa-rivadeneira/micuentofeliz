import { SymbolIcon } from "@/lib/symbols";

/** Emblema del encabezado: hoja brillante para universos de naturaleza/nutrición; icono en orbe para el resto. */
export function HubEmblem({ symbol }: { symbol: string }) {
  if (["fruta", "hoja", "arbol", "bienestar"].includes(symbol)) {
    return (
      <svg viewBox="0 0 100 100" className="hub__emblem" aria-hidden>
        <defs>
          <linearGradient id="he-leaf" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#1f7a2c" />
            <stop offset="0.55" stopColor="#5cc24a" />
            <stop offset="1" stopColor="#d8f7a0" />
          </linearGradient>
        </defs>
        <path d="M14 90 C10 50 40 14 92 8 C90 56 60 88 14 90Z" fill="url(#he-leaf)" />
        <path d="M14 90 C36 66 62 38 92 8" stroke="#eaffd0" strokeWidth="2.5" fill="none" />
        {[[34, 70, 26, 52], [48, 56, 44, 36], [62, 42, 62, 24], [40, 66, 58, 70], [54, 52, 74, 54]].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} Q${(x1 + x2) / 2 + 3} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke="#eaffd0" strokeOpacity="0.55" strokeWidth="1.3" fill="none" />
        ))}
        <path d="M24 70 C30 46 52 26 80 16" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M14 90 L6 98" stroke="#2f6b2a" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <span className="hub__emblem hub__emblem--orb">
      <SymbolIcon name={symbol} size={40} />
    </span>
  );
}
