"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Star, User, Play, Eye, Clock, CheckCircle2, CircleCheck, CircleAlert, CircleHelp } from "lucide-react";
import type { Entry, ReadStatus } from "@/lib/types";
import { TYPE_LABELS, EVIDENCE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { youtubeThumb, TRACKABLE_TYPES } from "@/lib/sections";
import { TypeIcon } from "../TypeIcon";
import { ShopButtons } from "../ShopButtons";
import { hasShopLinks, type ShopConfig } from "@/lib/shop";

const COVER_PALETTES = [
  ["#f5efe2", "#2e5d34"], ["#fdf6e9", "#7a3b1d"], ["#eef3f7", "#1f3b5c"], ["#fff8ec", "#8b2f3a"],
  ["#f1f7ec", "#2f6b2a"], ["#f7f0fb", "#5b2d82"], ["#fff3e3", "#a3501a"],
];

function hash(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** Miniatura: portada propia, miniatura de YouTube o una portada generada según el tipo. */
export function Thumb({ entry: e }: { entry: Entry }) {
  const src = e.cover || youtubeThumb(e);
  const isPlayable = e.type === "video" || e.type === "podcast" || e.type === "audio";
  const [bg, fg] = COVER_PALETTES[hash(e.title) % COVER_PALETTES.length];

  return (
    <span className={`thumb thumb--${e.type}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" />
      ) : e.type === "libro" ? (
        <span className="thumb__book" style={{ background: bg, color: fg }}>
          <span className="thumb__book-title">{e.title}</span>
          <span className="thumb__book-rule" style={{ background: fg }} />
          {e.author && <span className="thumb__book-author">{e.author}</span>}
        </span>
      ) : (
        <span className="thumb__gen">
          <TypeIcon type={e.type} size={34} />
        </span>
      )}
      {isPlayable && <span className="thumb__play"><Play size={18} fill="currentColor" /></span>}
      {e.duration && <span className="thumb__dur">{e.duration}</span>}
    </span>
  );
}

const EVIDENCE_ICON = { respaldado: CircleCheck, prometedor: CircleAlert, opinion: CircleHelp };
const EVIDENCE_SHORT = { respaldado: "Respaldado", prometedor: "Prometedor", opinion: "Opinión" };
const STATUS_ICON: Record<ReadStatus, typeof Eye> = { "por-ver": Clock, viendo: Eye, visto: CheckCircle2 };
const NEXT_STATUS: Record<ReadStatus, ReadStatus> = { "por-ver": "viendo", viendo: "visto", visto: "por-ver" };

async function patch(id: string, body: object) {
  const r = await fetch(`/api/entries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("No se pudo guardar");
}

/** Tarjeta de videoteca: miniatura, tipo, título, autor, evidencia, valoración, guardado y estado. */
export function LibraryCard({ entry, list, onChange, shop }: { entry: Entry; list?: boolean; onChange?: (e: Entry) => void; shop?: ShopConfig }) {
  const [e, setE] = useState(entry);
  const status: ReadStatus = e.status ?? "por-ver";
  const StatusIcon = STATUS_ICON[status];
  const EvIcon = e.evidence ? EVIDENCE_ICON[e.evidence] : null;

  const update = async (changes: Partial<Entry>) => {
    const prev = e;
    const next = { ...e, ...changes };
    setE(next);
    onChange?.(next);
    try {
      await patch(e.id, changes);
    } catch {
      setE(prev);
      onChange?.(prev);
    }
  };

  return (
    <article className={`lcard ${list ? "lcard--list" : ""}`}>
      <Link href={`/contenido/${e.slug}`} className="lcard__link" aria-label={e.title} />
      <Thumb entry={e} />
      <div className="lcard__body">
        <span className="lcard__type"><TypeIcon type={e.type} size={13} /> {TYPE_LABELS[e.type]?.singular}</span>
        <h3 className="lcard__title">{e.title}</h3>
        {e.author && <span className="lcard__author"><User size={13} /> {e.author}</span>}
        {list && e.summary && <p className="lcard__summary">{e.summary}</p>}
        {EvIcon && e.evidence && (
          <span className={`evb evb--${e.evidence}`} title={EVIDENCE_LABELS[e.evidence]}><EvIcon size={13} /> {EVIDENCE_SHORT[e.evidence]}</span>
        )}
        <div className="lcard__foot">
          {TRACKABLE_TYPES.includes(e.type) ? (
          <button
            type="button"
            className={`stb stb--${status}`}
            onClick={() => update({ status: NEXT_STATUS[status] })}
            title="Cambiar estado"
            aria-label={`Estado: ${STATUS_LABELS[status]}. Cambiar`}
          >
            <StatusIcon size={13} /> {STATUS_LABELS[status]}
          </button>
          ) : <span />}
          {e.rating ? (
            <span className="lcard__rating" aria-label={`Valoración ${e.rating} de 5`}><Star size={15} fill="currentColor" /> {e.rating.toFixed(1)}</span>
          ) : null}
        </div>
        {shop && hasShopLinks(e) && <ShopButtons entry={e} shop={shop} compact />}
      </div>
      <button
        type="button"
        className={`lcard__save ${e.saved ? "is-on" : ""}`}
        onClick={() => update({ saved: !e.saved })}
        aria-pressed={Boolean(e.saved)}
        aria-label={e.saved ? "Quitar de guardados" : "Guardar"}
      >
        <Bookmark size={18} fill={e.saved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
