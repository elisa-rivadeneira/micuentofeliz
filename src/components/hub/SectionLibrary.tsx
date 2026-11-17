"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, ChevronRight, ChevronDown, Plus, Search, LayoutGrid, List, Layers, PlayCircle, BookOpen, Headphones,
  FileText, FlaskConical, Sprout, ShieldCheck, Loader, RotateCcw, SlidersHorizontal, X, Bookmark,
  Notebook, Lightbulb, MessageCircleHeart, ChefHat, Clapperboard,
} from "lucide-react";
import type { Entry, Evidence, ReadStatus, SectionKey } from "@/lib/types";
import { EVIDENCE_LEVELS, READ_STATUSES } from "@/lib/types";
import { EVIDENCE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { SECTIONS, TRACKABLE_TYPES } from "@/lib/sections";
import { SectionArt, type ArtImage } from "./SectionArt";
import { LibraryCard } from "./LibraryCard";
import { AFFILIATE_NOTICE, hasShopLinks, type ShopConfig } from "@/lib/shop";

const TAB_ICONS: Record<string, typeof Layers> = {
  todo: Layers, videos: PlayCircle, libros: BookOpen, podcasts: Headphones, articulos: FileText, estudios: FlaskConical,
  notas: Notebook, apuntes: Notebook, reflexiones: MessageCircleHeart, ideas: Lightbulb,
};
const VIEW_KEY = "mcf:seccion-vista";

interface Props {
  universe: { slug: string; name: string; id: string };
  hubTitle: string;
  sectionKey: SectionKey;
  entries: Entry[];
  initialTab?: string;
  art?: ArtImage;
  shop: ShopConfig;
}

function Group({ title, icon: Icon, children, defaultOpen = true }: { title: string; icon: typeof Layers; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fgroup">
      <button type="button" className="fgroup__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Icon size={16} /> <span>{title}</span>
        <ChevronDown size={16} className={`fgroup__chev ${open ? "is-open" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="fgroup__body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SectionLibrary({ universe: u, hubTitle, sectionKey, entries: initial, initialTab, art, shop }: Props) {
  const section = SECTIONS[sectionKey];
  const [entries, setEntries] = useState(initial);
  const [tab, setTab] = useState(section.tabs.some((t) => t.key === initialTab) ? initialTab! : "todo");
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<"recientes" | "valorados" | "titulo">("recientes");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [topics, setTopics] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [statuses, setStatuses] = useState<ReadStatus[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    try { const v = localStorage.getItem(VIEW_KEY); if (v === "list" || v === "grid") setView(v); } catch {}
  }, []);
  const changeView = (v: "grid" | "list") => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch {}
  };

  const tabDef = section.tabs.find((t) => t.key === tab) ?? section.tabs[0];
  const inTab = useMemo(() => (tabDef.types.length ? entries.filter((e) => tabDef.types.includes(e.type)) : entries), [entries, tabDef]);

  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // Las notas propias no tienen estado de lectura.
  const statusOf = (e: Entry): ReadStatus | undefined => (TRACKABLE_TYPES.includes(e.type) ? e.status ?? "por-ver" : undefined);

  const results = useMemo(() => {
    const nq = norm(q.trim());
    let list = inTab.filter((e) => {
      if (topics.length && !topics.some((t) => e.tags.includes(t))) return false;
      if (evidence.length && (!e.evidence || !evidence.includes(e.evidence))) return false;
      if (statuses.length && !statuses.includes(statusOf(e) as ReadStatus)) return false;
      if (onlySaved && !e.saved) return false;
      if (nq) return nq.split(/\s+/).every((w) => norm([e.title, e.author ?? "", e.summary, e.tags.join(" ")].join(" ")).includes(w));
      return true;
    });
    if (order === "valorados") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (order === "titulo") list = [...list].sort((a, b) => a.title.localeCompare(b.title, "es"));
    else list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inTab, q, order, topics, evidence, statuses, onlySaved]);

  const topicCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of inTab) for (const t of e.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [inTab]);

  const toggle = <T,>(list: T[], set: (v: T[]) => void, v: T) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const activeFilters = topics.length + evidence.length + statuses.length + (onlySaved ? 1 : 0);
  const clear = () => { setTopics([]); setEvidence([]); setStatuses([]); setOnlySaved(false); setQ(""); };
  const onCardChange = (next: Entry) => setEntries((list) => list.map((e) => (e.id === next.id ? next : e)));
  const addHref = `/admin/contenido/nuevo?universo=${u.slug}&tipo=${tabDef.types[0] ?? section.defaultType}`;
  const SectionIcon = sectionKey === "recetas" ? ChefHat : sectionKey === "biblioteca" ? BookOpen : Clapperboard;

  const filters = (
    <>
      <p className="lfilters__title">Filtrar por</p>
      {topicCounts.length > 0 && (
        <Group title="Tema" icon={Sprout} defaultOpen={false}>
          {(showAllTopics ? topicCounts : topicCounts.slice(0, 8)).map(([t, n]) => (
            <label key={t} className="fcheck">
              <input type="checkbox" checked={topics.includes(t)} onChange={() => toggle(topics, setTopics, t)} />
              <span>{t}</span> <small>({n})</small>
            </label>
          ))}
          {topicCounts.length > 8 && (
            <button type="button" className="fmore" onClick={() => setShowAllTopics((s) => !s)}>{showAllTopics ? "Ver menos" : `Ver ${topicCounts.length - 8} más`}</button>
          )}
        </Group>
      )}
      {section.tracking && (
        <>
          <Group title="Nivel de evidencia" icon={ShieldCheck}>
            {EVIDENCE_LEVELS.map((lv) => (
              <label key={lv} className="fcheck">
                <input type="checkbox" checked={evidence.includes(lv)} onChange={() => toggle(evidence, setEvidence, lv)} />
                <span>{EVIDENCE_LABELS[lv]}</span> <small>({inTab.filter((e) => e.evidence === lv).length})</small>
              </label>
            ))}
          </Group>
          <Group title="Estado" icon={Loader}>
            {READ_STATUSES.map((st) => (
              <label key={st} className="fcheck">
                <input type="checkbox" checked={statuses.includes(st)} onChange={() => toggle(statuses, setStatuses, st)} />
                <span>{STATUS_LABELS[st]}</span> <small>({inTab.filter((e) => statusOf(e) === st).length})</small>
              </label>
            ))}
          </Group>
        </>
      )}
      <label className="fcheck fcheck--solo">
        <input type="checkbox" checked={onlySaved} onChange={(e) => setOnlySaved(e.target.checked)} />
        <Bookmark size={14} /> <span>Solo guardados</span> <small>({inTab.filter((e) => e.saved).length})</small>
      </label>
      <button type="button" className="fclear" onClick={clear} disabled={!activeFilters && !q}>
        <RotateCcw size={15} /> Limpiar filtros
      </button>
    </>
  );

  return (
    <div className="lib">
      <nav className="crumbs" aria-label="Ruta">
        <Link href="/jardin"><Home size={14} /> Jardines</Link>
        <ChevronRight size={14} aria-hidden />
        <Link href={`/universo/${u.slug}`}>{hubTitle}</Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page">{section.label}</span>
      </nav>

      <header className="lib__head">
        <span className="lib__art"><SectionArt section={sectionKey} art={art} /></span>
        <div className="lib__intro">
          <h1 className="lib__title">{section.label}</h1>
          <p className="lib__lead">{section.lead}<br />{hubTitle && <>para aprender sobre {hubTitle.toLowerCase()}.</>}</p>
        </div>
        <Link href={addHref} className="lib__add"><Plus size={18} /> Añadir contenido</Link>
      </header>

      {section.tabs.length > 1 && (
        <div className="ltabs" role="tablist" aria-label="Tipo de contenido">
          {section.tabs.map((t) => {
            const Icon = TAB_ICONS[t.key] ?? SectionIcon;
            const n = t.types.length ? entries.filter((e) => t.types.includes(e.type)).length : entries.length;
            return (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={`ltab ${tab === t.key ? "is-on" : ""}`} onClick={() => setTab(t.key)}>
                <Icon size={18} strokeWidth={1.6} /> {t.label} <small>{n}</small>
              </button>
            );
          })}
        </div>
      )}

      <div className="lib__layout">
        <aside className={`lfilters ${filtersOpen ? "is-open" : ""}`} aria-label="Filtros">
          <button type="button" className="lfilters__close icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros"><X size={18} /></button>
          {filters}
        </aside>

        <section className="lib__main">
          <div className="ltools">
            <div className="lsearch">
              <Search size={18} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscar en ${section.label.toLowerCase()}…`} aria-label="Buscar" />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Borrar búsqueda"><X size={16} /></button>}
            </div>
            <button type="button" className="lfilters-btn" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal size={16} /> Filtros {activeFilters > 0 && <b>{activeFilters}</b>}
            </button>
            <label className="lorder">
              <span>Ordenar:</span>
              <select value={order} onChange={(e) => setOrder(e.target.value as typeof order)}>
                <option value="recientes">Más recientes</option>
                <option value="valorados">Mejor valorados</option>
                <option value="titulo">Título (A-Z)</option>
              </select>
              <ChevronDown size={15} aria-hidden />
            </label>
            <div className="lview" role="group" aria-label="Vista">
              <button type="button" className={view === "grid" ? "is-on" : ""} onClick={() => changeView("grid")} aria-label="Cuadrícula" aria-pressed={view === "grid"}><LayoutGrid size={18} /></button>
              <button type="button" className={view === "list" ? "is-on" : ""} onClick={() => changeView("list")} aria-label="Lista" aria-pressed={view === "list"}><List size={18} /></button>
            </div>
          </div>

          <p className="lcount" aria-live="polite">{results.length} {results.length === 1 ? "resultado" : "resultados"}</p>

          {results.length === 0 ? (
            <div className="lempty">
              <p>{entries.length ? "Nada coincide con estos filtros." : `Tu ${section.label.toLowerCase()} está esperando su primera pieza.`}</p>
              {entries.length ? (
                <button type="button" className="fclear" onClick={clear}><RotateCcw size={15} /> Limpiar filtros</button>
              ) : (
                <Link href={addHref} className="lib__add"><Plus size={18} /> Añadir contenido</Link>
              )}
            </div>
          ) : (
            <motion.div layout className={view === "grid" ? "lib-grid" : "lib-list"}>
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((e) => (
                  <motion.div key={e.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}>
                    <LibraryCard entry={e} list={view === "list"} onChange={onCardChange} shop={shop} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>
      {shop.amazonTag && results.some((e) => hasShopLinks(e)) && <p className="affiliate-note">{AFFILIATE_NOTICE}</p>}
      {filtersOpen && <div className="lfilters__scrim" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
}
