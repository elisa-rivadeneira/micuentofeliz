"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { ContentType, Entry, Universe } from "@/lib/types";
import { CONTENT_TYPES } from "@/lib/types";
import { TYPE_LABELS } from "@/lib/labels";
import { tagCounts } from "@/lib/graph";
import { EntryCard } from "./EntryCard";
import { TypeIcon } from "./TypeIcon";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

interface Props {
  entries: Entry[];
  universes: Universe[];
  initial: { q: string; tag: string; type: string; universe: string; focus: boolean };
}

export function Explorer({ entries, universes, initial }: Props) {
  const [q, setQ] = useState(initial.q);
  const [tag, setTag] = useState(initial.tag);
  const [type, setType] = useState(initial.type);
  const [universe, setUniverse] = useState(initial.universe);
  const [order, setOrder] = useState<"recientes" | "conectadas" | "alfabetico">("recientes");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial.focus) input.current?.focus();
  }, [initial.focus]);

  // Mantener la URL en sincronía para poder compartir/volver a una vista.
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (tag) p.set("etiqueta", tag);
    if (type) p.set("tipo", type);
    if (universe) p.set("universo", universe);
    const s = p.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [q, tag, type, universe]);

  const degree = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of entries) {
      m.set(e.id, (m.get(e.id) ?? 0) + e.relatedIds.length);
      for (const r of e.relatedIds) m.set(r, (m.get(r) ?? 0) + 1);
    }
    return m;
  }, [entries]);

  const results = useMemo(() => {
    const nq = norm(q.trim());
    const universeId = universes.find((u) => u.slug === universe)?.id;
    let list = entries.filter((e) => {
      if (type && e.type !== type) return false;
      if (tag && !e.tags.includes(tag)) return false;
      if (universeId && !e.universeIds.includes(universeId)) return false;
      if (nq) {
        const hay = norm([e.title, e.summary, e.body, e.author ?? "", e.tags.join(" ")].join(" "));
        return nq.split(/\s+/).every((w) => hay.includes(w));
      }
      return true;
    });
    if (order === "alfabetico") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "es"));
    if (order === "conectadas") list = [...list].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0));
    return list;
  }, [entries, universes, q, tag, type, universe, order, degree]);

  const tags = useMemo(() => tagCounts(entries), [entries]);
  const typesPresent = CONTENT_TYPES.filter((t) => entries.some((e) => e.type === t));
  const anyFilter = q || tag || type || universe;

  return (
    <div className="explorer">
      <div className="searchbar">
        <Search size={20} strokeWidth={1.5} />
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar historias, ideas, poemas, autores…" aria-label="Buscar" />
        {q && (
          <button onClick={() => setQ("")} aria-label="Borrar búsqueda" className="icon-btn"><X size={18} /></button>
        )}
      </div>

      <div className="filters">
        <select value={universe} onChange={(e) => setUniverse(e.target.value)} aria-label="Universo" className="select">
          <option value="">Todos los universos</option>
          {universes.map((u) => <option key={u.id} value={u.slug}>{u.name}</option>)}
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value as typeof order)} aria-label="Orden" className="select">
          <option value="recientes">Más recientes</option>
          <option value="conectadas">Más conectadas</option>
          <option value="alfabetico">Alfabético</option>
        </select>
        {anyFilter && (
          <button className="ghost-link" onClick={() => { setQ(""); setTag(""); setType(""); setUniverse(""); }}>
            <X size={14} /> Limpiar filtros
          </button>
        )}
      </div>

      <div className="chips">
        <button className={`chip ${!type ? "is-on" : ""}`} onClick={() => setType("")}>Todos los tipos</button>
        {typesPresent.map((t) => (
          <button key={t} className={`chip ${type === t ? "is-on" : ""}`} onClick={() => setType(type === t ? "" : (t as ContentType))}>
            <TypeIcon type={t} size={14} /> {TYPE_LABELS[t].plural}
          </button>
        ))}
      </div>

      <div className="tags tags--cloud">
        {tags.slice(0, 40).map(([t, n]) => (
          <button key={t} className={`tag ${tag === t ? "is-on" : ""}`} onClick={() => setTag(tag === t ? "" : t)}>
            #{t} <small>{n}</small>
          </button>
        ))}
      </div>

      <p className="muted small results-count">
        {results.length} {results.length === 1 ? "pieza encontrada" : "piezas encontradas"}
        {tag && <> con el hilo <strong>#{tag}</strong></>}
      </p>

      {results.length === 0 ? (
        <div className="empty"><p>Nada florece con esa búsqueda todavía.</p></div>
      ) : (
        <motion.div layout className="grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((e) => (
              <motion.div key={e.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
                <EntryCard entry={e} universes={universes} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
