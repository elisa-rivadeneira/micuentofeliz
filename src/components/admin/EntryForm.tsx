"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Upload, X, Link2, Sparkles, Eye, Save, Star } from "lucide-react";
import type { ContentType, Entry, EntryInput, MediaItem, MediaKind, Universe } from "@/lib/types";
import { CONTENT_TYPES, EVIDENCE_LEVELS, READ_STATUSES } from "@/lib/types";
import type { Evidence, ReadStatus } from "@/lib/types";
import { TYPE_LABELS, EVIDENCE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { normalizeTag, newId } from "@/lib/util";
import { SymbolIcon } from "@/lib/symbols";
import { Prose } from "../Prose";
import { TypeIcon } from "../TypeIcon";
import { api, uploadFile } from "./api";

interface Props {
  entry?: Entry;
  universes: Universe[];
  entries: Entry[];
  presetUniverse?: string;
  presetType?: ContentType;
}

const EMPTY: EntryInput = {
  slug: "", title: "", type: "reflexion", summary: "", body: "", universeIds: [], tags: [], relatedIds: [],
  media: [], cover: "", author: "", source: "", externalUrl: "", featured: false,
};

export function EntryForm({ entry, universes, entries, presetUniverse, presetType }: Props) {
  const router = useRouter();
  const [f, setF] = useState<EntryInput>(() =>
    entry ? { ...EMPTY, ...entry } : { ...EMPTY, type: presetType ?? EMPTY.type, universeIds: presetUniverse ? [presetUniverse] : [] },
  );
  const [tagDraft, setTagDraft] = useState("");
  const [relQuery, setRelQuery] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const set = <K extends keyof EntryInput>(k: K, v: EntryInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const others = entries.filter((e) => e.id !== entry?.id);
  const allTags = useMemo(() => [...new Set(entries.flatMap((e) => e.tags))].sort(), [entries]);
  const backlinks = entry ? others.filter((e) => e.relatedIds.includes(entry.id) && !f.relatedIds.includes(e.id)) : [];

  const addTags = (raw: string) => {
    const t = raw.split(",").map(normalizeTag).filter(Boolean);
    if (t.length) set("tags", [...new Set([...f.tags, ...t])]);
    setTagDraft("");
  };

  // Sugerencias de hilos: piezas que comparten etiquetas o universos y aún no están enlazadas.
  const suggestions = useMemo(() => {
    return others
      .filter((e) => !f.relatedIds.includes(e.id))
      .map((e) => ({
        e,
        s: e.tags.filter((t) => f.tags.includes(t)).length * 2 + e.universeIds.filter((u) => f.universeIds.includes(u)).length,
      }))
      .filter((x) => x.s > 1)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map((x) => x.e);
  }, [others, f.relatedIds, f.tags, f.universeIds]);

  const relMatches = relQuery.trim()
    ? others.filter((e) => !f.relatedIds.includes(e.id) && e.title.toLowerCase().includes(relQuery.trim().toLowerCase())).slice(0, 8)
    : [];

  const setMedia = (id: string, patch: Partial<MediaItem>) => set("media", f.media.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const doUpload = async (file: File, target: "cover" | string) => {
    setUploading(target);
    setError("");
    try {
      const r = await uploadFile(file);
      if (target === "cover") set("cover", r.url);
      else setMedia(target, { url: r.url, kind: r.kind, caption: f.media.find((m) => m.id === target)?.caption || r.name });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setError("");
    try {
      const pendingTags = tagDraft.trim() ? [...f.tags, ...tagDraft.split(",").map(normalizeTag)] : f.tags;
      const payload = { ...f, tags: pendingTags };
      const saved = entry
        ? await api<Entry>(`/api/entries/${entry.id}`, "PUT", payload)
        : await api<Entry>("/api/entries", "POST", payload);
      router.push(`/contenido/${saved.slug}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!entry || !confirm(`¿Eliminar "${entry.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api(`/api/entries/${entry.id}`, "DELETE");
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const titleOf = (id: string) => entries.find((e) => e.id === id)?.title ?? id;

  return (
    <form className="form page-enter" onSubmit={save}>
      <div className="form__top">
        <Link href="/admin" className="back"><ArrowLeft size={16} /> Taller</Link>
        <h1 className="display form__title">{entry ? "Editar pieza" : "Sembrar una pieza nueva"}</h1>
      </div>

      <div className="form__grid">
        <div className="form__main">
          <label className="field">
            <span>Título</span>
            <input required value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="El canto de la caña" className="input input--big" />
          </label>

          <fieldset className="field">
            <legend>Tipo</legend>
            <div className="chips chips--wrap">
              {CONTENT_TYPES.map((t) => (
                <button type="button" key={t} className={`chip ${f.type === t ? "is-on" : ""}`} onClick={() => set("type", t as ContentType)}>
                  <TypeIcon type={t} size={14} /> {TYPE_LABELS[t].singular}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Resumen <small>(aparece en las tarjetas)</small></span>
            <textarea rows={2} value={f.summary} onChange={(e) => set("summary", e.target.value)} className="input" />
          </label>

          <div className="field">
            <div className="field__row">
              <span>Cuerpo <small>(Markdown: **negrita**, *cursiva*, ## título, &gt; cita, - lista)</small></span>
              <button type="button" className="ghost-link" onClick={() => setPreview((p) => !p)}><Eye size={14} /> {preview ? "Editar" : "Vista previa"}</button>
            </div>
            {preview ? (
              <div className="preview"><Prose body={f.body || "*Nada todavía…*"} verse={f.type === "poema" || f.type === "cancion"} /></div>
            ) : (
              <textarea rows={16} value={f.body} onChange={(e) => set("body", e.target.value)} className="input input--mono" />
            )}
          </div>

          <div className="field">
            <span>Imágenes, audios, videos y enlaces</span>
            <ul className="media-list">
              {f.media.map((m) => (
                <li key={m.id} className="media-row">
                  <select value={m.kind} onChange={(e) => setMedia(m.id, { kind: e.target.value as MediaKind })} className="select select--sm">
                    <option value="imagen">Imagen</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="enlace">Enlace</option>
                  </select>
                  <input value={m.url} onChange={(e) => setMedia(m.id, { url: e.target.value })} placeholder="URL o sube un archivo" className="input" />
                  <input value={m.caption ?? ""} onChange={(e) => setMedia(m.id, { caption: e.target.value })} placeholder="Pie / título" className="input" />
                  {m.kind !== "enlace" && (
                    <label className="icon-btn" title="Subir archivo">
                      {uploading === m.id ? <Sparkles size={17} className="spin" /> : <Upload size={17} />}
                      <input type="file" hidden accept="image/*,audio/*,video/*" onChange={(e) => e.target.files?.[0] && doUpload(e.target.files[0], m.id)} />
                    </label>
                  )}
                  <button type="button" className="icon-btn icon-btn--danger" onClick={() => set("media", f.media.filter((x) => x.id !== m.id))} aria-label="Quitar"><Trash2 size={17} /></button>
                </li>
              ))}
            </ul>
            <div className="chips">
              {(["imagen", "audio", "video", "enlace"] as MediaKind[]).map((k) => (
                <button type="button" key={k} className="chip" onClick={() => set("media", [...f.media, { id: newId("m_"), kind: k, url: "", caption: "" }])}>
                  <Plus size={14} /> {k[0].toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="form__side">
          <fieldset className="field panel">
            <legend>Universos</legend>
            <div className="checks">
              {universes.map((u) => (
                <label key={u.id} className="check">
                  <input type="checkbox" checked={f.universeIds.includes(u.id)} onChange={(e) => set("universeIds", e.target.checked ? [...f.universeIds, u.id] : f.universeIds.filter((x) => x !== u.id))} />
                  <span style={{ color: u.color }}><SymbolIcon name={u.symbol} size={16} /></span> {u.name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field panel">
            <span>Etiquetas</span>
            <div className="tags">
              {f.tags.map((t) => (
                <span key={t} className="tag is-on">#{t}
                  <button type="button" onClick={() => set("tags", f.tags.filter((x) => x !== t))} aria-label={`Quitar ${t}`}><X size={12} /></button>
                </span>
              ))}
            </div>
            <input
              value={tagDraft}
              list="all-tags"
              onChange={(e) => (e.target.value.endsWith(",") ? addTags(e.target.value) : setTagDraft(e.target.value))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTags(tagDraft); } }}
              onBlur={() => tagDraft && addTags(tagDraft)}
              placeholder="Escribe y pulsa Enter"
              className="input"
            />
            <datalist id="all-tags">{allTags.map((t) => <option key={t} value={t} />)}</datalist>
          </div>

          <div className="field panel">
            <span><Link2 size={14} /> Hilos con otras piezas</span>
            <div className="tags">
              {f.relatedIds.map((id) => (
                <span key={id} className="tag is-on">{titleOf(id)}
                  <button type="button" onClick={() => set("relatedIds", f.relatedIds.filter((x) => x !== id))} aria-label="Quitar hilo"><X size={12} /></button>
                </span>
              ))}
            </div>
            <input value={relQuery} onChange={(e) => setRelQuery(e.target.value)} placeholder="Buscar pieza para enlazar…" className="input" />
            {relMatches.length > 0 && (
              <ul className="picker">
                {relMatches.map((e) => (
                  <li key={e.id}><button type="button" onClick={() => { set("relatedIds", [...f.relatedIds, e.id]); setRelQuery(""); }}><TypeIcon type={e.type} size={14} /> {e.title}</button></li>
                ))}
              </ul>
            )}
            {suggestions.length > 0 && (
              <>
                <small className="muted"><Sparkles size={12} /> Podrían conectarse:</small>
                <div className="tags">
                  {suggestions.map((e) => (
                    <button type="button" key={e.id} className="tag" onClick={() => set("relatedIds", [...f.relatedIds, e.id])}><Plus size={12} /> {e.title}</button>
                  ))}
                </div>
              </>
            )}
            {backlinks.length > 0 && (
              <small className="muted">También te enlazan: {backlinks.map((b) => b.title).join(", ")}</small>
            )}
          </div>

          <div className="field panel">
            <span>Portada</span>
            {f.cover && (
              <div className="cover-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.cover} alt="" />
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => set("cover", "")} aria-label="Quitar portada"><X size={16} /></button>
              </div>
            )}
            <div className="field__row">
              <input value={f.cover ?? ""} onChange={(e) => set("cover", e.target.value)} placeholder="URL de imagen" className="input" />
              <label className="icon-btn" title="Subir imagen">
                {uploading === "cover" ? <Sparkles size={17} className="spin" /> : <Upload size={17} />}
                <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && doUpload(e.target.files[0], "cover")} />
              </label>
            </div>
          </div>

          <div className="field panel">
            <span>Seguimiento <small>(videoteca y biblioteca)</small></span>
            <label className="field"><span>Nivel de evidencia</span>
              <select value={f.evidence ?? ""} onChange={(e) => set("evidence", (e.target.value || undefined) as Evidence | undefined)} className="select">
                <option value="">Sin indicar</option>
                {EVIDENCE_LEVELS.map((lv) => <option key={lv} value={lv}>{EVIDENCE_LABELS[lv]}</option>)}
              </select>
            </label>
            <label className="field"><span>Estado</span>
              <select value={f.status ?? ""} onChange={(e) => set("status", (e.target.value || undefined) as ReadStatus | undefined)} className="select">
                <option value="">Sin indicar (por ver)</option>
                {READ_STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
              </select>
            </label>
            <div className="field"><span>Valoración</span>
              <div className="stars" role="radiogroup" aria-label="Valoración">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} role="radio" aria-checked={Math.round(f.rating ?? 0) === n} aria-label={`${n} de 5`} className={`star ${(f.rating ?? 0) >= n ? "is-on" : ""}`} onClick={() => set("rating", f.rating === n ? undefined : n)}>
                    <Star size={20} fill={(f.rating ?? 0) >= n ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <label className="field"><span>Duración</span><input value={f.duration ?? ""} onChange={(e) => set("duration", e.target.value)} placeholder="1:23:42 o 52 min" className="input" /></label>
            <label className="check"><input type="checkbox" checked={Boolean(f.saved)} onChange={(e) => set("saved", e.target.checked)} /> Guardado</label>
          </div>

          <div className="field panel">
            <label className="field"><span>Autor/a</span><input value={f.author ?? ""} onChange={(e) => set("author", e.target.value)} className="input" /></label>
            <label className="field"><span>Fuente</span><input value={f.source ?? ""} onChange={(e) => set("source", e.target.value)} className="input" /></label>
            <label className="field"><span>Enlace externo</span><input type="url" value={f.externalUrl ?? ""} onChange={(e) => set("externalUrl", e.target.value)} placeholder="https://…" className="input" /></label>
            <label className="field"><span>Dirección (slug)</span><input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="se genera desde el título" className="input" /></label>
            <label className="check"><input type="checkbox" checked={Boolean(f.featured)} onChange={(e) => set("featured", e.target.checked)} /> Destacar en su universo</label>
          </div>
        </aside>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="form__bar">
        {entry && <button type="button" className="btn btn--danger" onClick={remove}><Trash2 size={16} /> Eliminar</button>}
        <span className="spacer" />
        <Link href="/admin" className="btn btn--ghost">Cancelar</Link>
        <button type="submit" className="btn btn--gold" disabled={saving}><Save size={16} /> {saving ? "Guardando…" : "Guardar"}</button>
      </div>
    </form>
  );
}
