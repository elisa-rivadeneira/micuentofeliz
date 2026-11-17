import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Pencil, Network, Star, Bookmark } from "lucide-react";
import { getEntryBySlug, getSnapshot } from "@/lib/db";
import { relatedTo } from "@/lib/graph";
import { TYPE_LABELS, EVIDENCE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { sectionOf } from "@/lib/sections";
import { formatDate, hexToRgb } from "@/lib/util";
import type { Entry } from "@/lib/types";
import { Prose } from "@/components/Prose";
import { MediaView } from "@/components/MediaView";
import { EntryCard } from "@/components/EntryCard";
import { TypeIcon } from "@/components/TypeIcon";
import { SymbolIcon } from "@/lib/symbols";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const e = await getEntryBySlug((await params).slug);
  return { title: e?.title ?? "Contenido", description: e?.summary };
}

/** Sigue el hilo de referencias directas desde una pieza, sin repetir, hasta 6 pasos. */
function followThread(start: Entry, all: Entry[]): Entry[] {
  const byId = new Map(all.map((e) => [e.id, e]));
  const neighbors = (e: Entry) => {
    const set = new Set(e.relatedIds);
    all.forEach((o) => o.relatedIds.includes(e.id) && set.add(o.id));
    return [...set].map((id) => byId.get(id)).filter(Boolean) as Entry[];
  };
  const path = [start];
  const seen = new Set([start.id]);
  let cur = start;
  while (path.length < 6) {
    // Preferimos seguir "hacia delante": referencias que la pieza actual declara.
    const forward = cur.relatedIds.map((id) => byId.get(id)).filter((e): e is Entry => !!e && !seen.has(e.id));
    const next = forward[forward.length - 1] ?? neighbors(cur).find((e) => !seen.has(e.id));
    if (!next) break;
    path.push(next);
    seen.add(next.id);
    cur = next;
  }
  return path;
}

export default async function ContenidoPage({ params }: Params) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);
  if (!entry) notFound();
  const { universes, entries } = await getSnapshot(true);

  const own = universes.filter((u) => entry.universeIds.includes(u.id));
  // Si vive en un centro de aprendizaje, el regreso lleva a su sección (p. ej. Biblioteca).
  const hubU = own.find((u) => u.hub && sectionOf(entry, u.hub.sections));
  const main = hubU ?? own[0];
  const backSection = hubU?.hub ? sectionOf(entry, hubU.hub.sections) : undefined;
  const direct = entries.filter((e) => e.id !== entry.id && (entry.relatedIds.includes(e.id) || e.relatedIds.includes(entry.id)));
  const directIds = new Set(direct.map((e) => e.id));
  const related = relatedTo(entry, entries, universes, 10).filter((r) => !directIds.has(r.entry.id)).slice(0, 6);
  const thread = followThread(entry, entries);
  const verse = entry.type === "poema" || entry.type === "cancion";
  const colorOf = (e: Entry) => universes.find((u) => e.universeIds.includes(u.id))?.color ?? "#c9a7ff";

  return (
    <main className="entry" style={{ ["--u" as string]: hexToRgb(main?.color ?? "#c9a7ff") }}>
      <div className="entry__sky" aria-hidden />
      <div className="wrap wrap--narrow">
        <div className="entry__top">
          {main && backSection ? (
            <Link href={`/universo/${main.slug}/${backSection.key}`} className="back"><ArrowLeft size={16} /> {backSection.label} · {main.hub?.title || main.name}</Link>
          ) : main ? (
            <Link href={`/universo/${main.slug}`} className="back"><ArrowLeft size={16} /> {main.name}</Link>
          ) : (
            <Link href="/explorar" className="back"><ArrowLeft size={16} /> Explorar</Link>
          )}
          <Link href={`/admin/contenido/${entry.id}`} className="ghost-link"><Pencil size={14} /> Editar</Link>
        </div>

        <article className="page-enter">
          <header className="entry__head">
            <span className="kicker"><TypeIcon type={entry.type} size={15} /> {TYPE_LABELS[entry.type].singular}</span>
            <h1 className="display entry__title">{entry.title}</h1>
            {entry.summary && <p className="lead">{entry.summary}</p>}
            <div className="entry__meta">
              {entry.author && <span>{entry.author}</span>}
              {entry.source && <span>{entry.source}</span>}
              <span>{formatDate(entry.createdAt)}</span>
              {entry.duration && <span>{entry.duration}</span>}
            </div>
            {(entry.evidence || entry.status || entry.rating || entry.saved) && (
              <div className="entry__track">
                {entry.evidence && <span className={`track track--${entry.evidence}`}>{EVIDENCE_LABELS[entry.evidence]}</span>}
                {entry.status && <span className="track">{STATUS_LABELS[entry.status]}</span>}
                {entry.rating ? <span className="track track--rating"><Star size={13} fill="currentColor" /> {entry.rating.toFixed(1)}</span> : null}
                {entry.saved && <span className="track"><Bookmark size={13} fill="currentColor" /> Guardado</span>}
              </div>
            )}
            <div className="entry__universes">
              {own.map((u) => (
                <Link key={u.id} href={`/universo/${u.slug}`} className="neighbor neighbor--sm" style={{ ["--c" as string]: hexToRgb(u.color) }}>
                  <SymbolIcon name={u.symbol} size={16} /> <span>{u.name}</span>
                </Link>
              ))}
            </div>
          </header>

          {entry.cover && (
            <figure className="entry__cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.cover} alt="" />
            </figure>
          )}

          {entry.body && <Prose body={entry.body} verse={verse} />}
          <MediaView items={entry.media} />

          {entry.externalUrl && (
            <a href={entry.externalUrl} target="_blank" rel="noreferrer" className="btn btn--gold entry__external">
              <ExternalLink size={16} /> Visitar enlace
            </a>
          )}

          {entry.tags.length > 0 && (
            <div className="tags entry__tags">
              {entry.tags.map((t) => (
                <Link key={t} href={`/explorar?etiqueta=${encodeURIComponent(t)}`} className="tag">#{t}</Link>
              ))}
            </div>
          )}
        </article>

        {thread.length > 1 && (
          <section className="section thread">
            <h2 className="section__title">Sigue el hilo</h2>
            <ol className="thread__path">
              {thread.map((e, i) => (
                <li key={e.id} style={{ ["--c" as string]: hexToRgb(colorOf(e)) }}>
                  {i === 0 ? (
                    <span className="thread__node is-here">{e.title}</span>
                  ) : (
                    <Link href={`/contenido/${e.slug}`} className="thread__node">{e.title}</Link>
                  )}
                </li>
              ))}
            </ol>
            <Link href={`/conexiones?foco=${entry.id}`} className="ghost-link"><Network size={14} /> Ver en el mapa de conexiones</Link>
          </section>
        )}

        {direct.length > 0 && (
          <section className="section">
            <h2 className="section__title">Hilos directos</h2>
            <div className="grid grid--compact">
              {direct.map((e) => <EntryCard key={e.id} entry={e} universes={universes} />)}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="section">
            <h2 className="section__title">También resuena con</h2>
            <div className="grid grid--compact">
              {related.map((r) => <EntryCard key={r.entry.id} entry={r.entry} universes={universes} reasons={r.reasons} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
