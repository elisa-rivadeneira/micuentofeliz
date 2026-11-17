"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ContentType, Entry, Universe } from "@/lib/types";
import { TYPE_LABELS } from "@/lib/labels";
import { EntryCard } from "./EntryCard";
import { TypeIcon } from "./TypeIcon";

/** Contenidos de un universo, filtrables por tipo. */
export function UniverseShelf({ entries, universes }: { entries: Entry[]; universes: Universe[] }) {
  const [type, setType] = useState<ContentType | "todo">("todo");
  const types = useMemo(() => [...new Set(entries.map((e) => e.type))], [entries]);
  const shown = type === "todo" ? entries : entries.filter((e) => e.type === type);
  const featured = entries.filter((e) => e.featured);

  if (!entries.length) {
    return (
      <div className="empty">
        <p>Este universo todavía está en silencio.</p>
        <Link href="/admin/contenido/nuevo" className="btn btn--gold">Plantar la primera semilla</Link>
      </div>
    );
  }

  return (
    <section className="section">
      {featured.length > 0 && type === "todo" && (
        <div className="featured">
          {featured.slice(0, 2).map((e) => (
            <Link key={e.id} href={`/contenido/${e.slug}`} className="featured__item">
              <span className="kicker"><TypeIcon type={e.type} size={14} /> {TYPE_LABELS[e.type].singular} destacada</span>
              <span className="featured__title">{e.title}</span>
              <span className="featured__summary">{e.summary}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="chips" role="tablist" aria-label="Filtrar por tipo">
        <button role="tab" aria-selected={type === "todo"} className={`chip ${type === "todo" ? "is-on" : ""}`} onClick={() => setType("todo")}>
          Todo <small>{entries.length}</small>
        </button>
        {types.map((t) => (
          <button key={t} role="tab" aria-selected={type === t} className={`chip ${type === t ? "is-on" : ""}`} onClick={() => setType(t)}>
            <TypeIcon type={t} size={14} /> {TYPE_LABELS[t].plural} <small>{entries.filter((e) => e.type === t).length}</small>
          </button>
        ))}
      </div>

      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((e, i) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.04, 0.4) } }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <EntryCard entry={e} universes={universes} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
