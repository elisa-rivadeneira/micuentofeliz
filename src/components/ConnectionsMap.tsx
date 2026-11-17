"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Route, X, ArrowRight } from "lucide-react";
import type { Entry, Universe } from "@/lib/types";
import { type GraphLink, adjacency, findPath } from "@/lib/graph";
import { TYPE_LABELS } from "@/lib/labels";
import { TypeIcon } from "./TypeIcon";

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  entry: Entry;
}

const W = 1000;
const H = 640;

/** Simulación de fuerzas mínima (sin dependencias): repulsión + resortes + gravedad por universo. */
function simulate(entries: Entry[], universes: Universe[], links: GraphLink[]): Node[] {
  const uIndex = new Map(universes.map((u, i) => [u.id, i]));
  const deg = new Map<string, number>();
  links.forEach((l) => {
    deg.set(l.source, (deg.get(l.source) ?? 0) + (l.kind === "referencia" ? 1 : 0.4));
    deg.set(l.target, (deg.get(l.target) ?? 0) + (l.kind === "referencia" ? 1 : 0.4));
  });
  // Cada universo atrae a sus piezas hacia un punto en un gran anillo.
  const anchor = (e: Entry) => {
    const i = uIndex.get(e.universeIds[0] ?? "") ?? 0;
    const a = (i / Math.max(universes.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return { x: W / 2 + Math.cos(a) * W * 0.3, y: H / 2 + Math.sin(a) * H * 0.3 };
  };
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const nodes: Node[] = entries.map((e) => {
    const a = anchor(e);
    const u = universes.find((x) => x.id === e.universeIds[0]);
    return {
      id: e.id, entry: e,
      x: a.x + (rand() - 0.5) * 120, y: a.y + (rand() - 0.5) * 120, vx: 0, vy: 0,
      r: 6 + Math.min(deg.get(e.id) ?? 0, 8) * 1.6,
      color: u?.color ?? "#c9a7ff",
    };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (let it = 0; it < 420; it++) {
    const alpha = 1 - it / 420;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d2 = dx * dx + dy * dy || 0.01;
        const d = Math.sqrt(d2);
        const f = (2600 / d2) * alpha;
        dx /= d; dy /= d;
        a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
    }
    for (const l of links) {
      const a = byId.get(l.source), b = byId.get(l.target);
      if (!a || !b) continue;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const rest = l.kind === "referencia" ? 90 : 150;
      const k = (l.kind === "referencia" ? 0.05 : 0.012) * alpha;
      const f = (d - rest) * k;
      a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
    }
    for (const n of nodes) {
      const a = anchor(n.entry);
      n.vx += (a.x - n.x) * 0.004 * alpha;
      n.vy += (a.y - n.y) * 0.004 * alpha;
      n.vx *= 0.82; n.vy *= 0.82;
      n.x = Math.max(40, Math.min(W - 40, n.x + n.vx));
      n.y = Math.max(40, Math.min(H - 40, n.y + n.vy));
    }
  }
  return nodes;
}

export function ConnectionsMap({ entries, universes, links, focusId }: { entries: Entry[]; universes: Universe[]; links: GraphLink[]; focusId?: string }) {
  const nodes = useMemo(() => simulate(entries, universes, links), [entries, universes, links]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const adj = useMemo(() => adjacency(entries, links), [entries, links]);
  const [showTags, setShowTags] = useState(true);
  const [selected, setSelected] = useState<string | null>(focusId && byId.has(focusId) ? focusId : null);
  const [hover, setHover] = useState<string | null>(null);
  const [pathMode, setPathMode] = useState(false);
  const [pathEnds, setPathEnds] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const path = useMemo(() => (pathEnds.length === 2 ? findPath(pathEnds[0], pathEnds[1], entries, links) : null), [pathEnds, entries, links]);
  const pathEdges = useMemo(() => {
    const s = new Set<string>();
    path?.forEach((id, i) => i && s.add([path[i - 1], id].sort().join("|")));
    return s;
  }, [path]);

  const active = hover ?? selected;
  const lit = useMemo(() => {
    if (path) return new Set(path);
    if (!active) return null;
    return new Set([active, ...(adj.get(active) ?? [])]);
  }, [active, adj, path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setSelected(null), setPathEnds([]), setPathMode(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const clickNode = (id: string) => {
    if (pathMode) {
      setPathEnds((p) => (p.length >= 2 ? [id] : [...p, id].filter((v, i, a) => a.indexOf(v) === i)));
      return;
    }
    setSelected((s) => (s === id ? null : id));
  };

  const sel = selected ? byId.get(selected) : null;
  const visibleLinks = links.filter((l) => showTags || l.kind === "referencia");

  return (
    <div className="cmap">
      <div className="cmap__toolbar">
        <label className="switch">
          <input type="checkbox" checked={showTags} onChange={(e) => setShowTags(e.target.checked)} />
          <span /> Mostrar hilos por etiqueta
        </label>
        <button className={`chip ${pathMode ? "is-on" : ""}`} onClick={() => { setPathMode((m) => !m); setPathEnds([]); setSelected(null); }}>
          <Route size={15} /> {pathMode ? "Trazando camino…" : "Trazar un camino"}
        </button>
        {pathMode && (
          <span className="muted small">
            {pathEnds.length === 0 && "Elige la estrella de partida."}
            {pathEnds.length === 1 && "Ahora elige la de llegada."}
            {pathEnds.length === 2 && !path && "No hay hilos que las unan todavía."}
          </span>
        )}
      </div>

      <div className="cmap__stage">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="cmap__svg" role="img" aria-label="Mapa de conexiones entre contenidos">
          <defs>
            <filter id="star-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g>
            {visibleLinks.map((l) => {
              const a = byId.get(l.source), b = byId.get(l.target);
              if (!a || !b) return null;
              const key = [l.source, l.target].sort().join("|");
              const onPath = pathEdges.has(key);
              const isLit = onPath || (!path && lit && lit.has(l.source) && lit.has(l.target) && (l.source === active || l.target === active));
              const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 18;
              return (
                <path
                  key={key}
                  d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
                  className={`cmap__link cmap__link--${l.kind} ${isLit ? "is-lit" : ""} ${lit && !isLit ? "is-dim" : ""} ${onPath ? "is-path" : ""}`}
                />
              );
            })}
          </g>
          <g>
            {nodes.map((n) => {
              const dim = lit && !lit.has(n.id);
              const isEnd = pathEnds.includes(n.id);
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  className={`cmap__node ${dim ? "is-dim" : ""} ${selected === n.id || isEnd ? "is-sel" : ""}`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => clickNode(n.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={n.entry.title}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && clickNode(n.id)}
                >
                  <circle r={n.r * 2.4} fill={n.color} opacity="0.16" />
                  <circle r={n.r} fill={n.color} filter="url(#star-glow)" />
                  <circle r={n.r * 0.4} fill="#fffaf0" />
                  <text y={n.r + 16} textAnchor="middle" className="cmap__label">{n.entry.title.length > 28 ? n.entry.title.slice(0, 26) + "…" : n.entry.title}</text>
                </g>
              );
            })}
          </g>
        </svg>

        <AnimatePresence>
          {sel && !pathMode && (
            <motion.aside key={sel.id} className="cmap__panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <button className="icon-btn cmap__close" onClick={() => setSelected(null)} aria-label="Cerrar"><X size={18} /></button>
              <span className="kicker"><TypeIcon type={sel.entry.type} size={14} /> {TYPE_LABELS[sel.entry.type].singular}</span>
              <h3>{sel.entry.title}</h3>
              <p>{sel.entry.summary}</p>
              <p className="muted small">{adj.get(sel.id)?.size ?? 0} hilos</p>
              <div className="cmap__neighbors">
                {[...(adj.get(sel.id) ?? [])].map((id) => byId.get(id)).filter(Boolean).map((n) => (
                  <button key={n!.id} className="tag" onClick={() => setSelected(n!.id)}>{n!.entry.title}</button>
                ))}
              </div>
              <Link href={`/contenido/${sel.entry.slug}`} className="btn btn--gold">Abrir <ArrowRight size={16} /></Link>
            </motion.aside>
          )}
          {path && (
            <motion.aside key="path" className="cmap__panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <button className="icon-btn cmap__close" onClick={() => setPathEnds([])} aria-label="Cerrar"><X size={18} /></button>
              <span className="kicker"><Route size={14} /> Camino encontrado</span>
              <ol className="thread__path thread__path--vertical">
                {path.map((id) => {
                  const n = byId.get(id)!;
                  return (
                    <li key={id} style={{ ["--c" as string]: "245, 200, 121" }}>
                      <Link href={`/contenido/${n.entry.slug}`} className="thread__node">{n.entry.title}</Link>
                    </li>
                  );
                })}
              </ol>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <ul className="cmap__legend">
        {universes.map((u) => (
          <li key={u.id}><span className="dot" style={{ background: u.color }} /> {u.name}</li>
        ))}
        <li className="muted"><span className="legend-line" /> referencia directa</li>
        <li className="muted"><span className="legend-line legend-line--dashed" /> etiqueta compartida</li>
      </ul>
    </div>
  );
}
