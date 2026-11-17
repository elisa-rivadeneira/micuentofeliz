/** Logotipo: loto dorado de líneas finas. */
export function Lotus({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="lotus-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe7b0" />
          <stop offset="1" stopColor="#d9a24e" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#lotus-gold)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M32 10c7 7 9 16 0 30-9-14-7-23 0-30z" />
        <path d="M32 40c-3-11-10-18-20-19 0 11 8 19 20 19z" />
        <path d="M32 40c3-11 10-18 20-19 0 11-8 19-20 19z" />
        <path d="M32 40c-8-4-18-5-25-1 6 6 16 6 25 1z" />
        <path d="M32 40c8-4 18-5 25-1-6 6-16 6-25 1z" />
        <path d="M20 48c8 2 16 2 24 0" />
      </g>
    </svg>
  );
}
