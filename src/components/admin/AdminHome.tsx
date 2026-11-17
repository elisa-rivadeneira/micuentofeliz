"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, LogOut } from "lucide-react";
import type { Entry, Universe } from "@/lib/types";
import { TYPE_LABELS } from "@/lib/labels";
import { formatDate } from "@/lib/util";
import { SymbolIcon } from "@/lib/symbols";
import { TypeIcon } from "../TypeIcon";
import { api } from "./api";

export function AdminHome({ universes, entries, hasPassword }: { universes: Universe[]; entries: Entry[]; hasPassword: boolean }) {
  const router = useRouter();
  const [tab, setTab] = useState<"contenidos" | "universos">("contenidos");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? entries.filter((e) => (e.title + " " + e.tags.join(" ")).toLowerCase().includes(n)) : entries;
  }, [entries, q]);

  const links = entries.reduce((s, e) => s + e.relatedIds.length, 0);
  const tags = new Set(entries.flatMap((e) => e.tags)).size;

  const remove = async (kind: "entries" | "universes", id: string, title: string) => {
    const msg = kind === "entries"
      ? `¿Eliminar "${title}"? También se quitarán los hilos que lo conectan.`
      : `¿Eliminar el universo "${title}"? Sus contenidos no se borran, solo dejan de pertenecer a él.`;
    if (!confirm(msg)) return;
    setBusy(id);
    setError("");
    try {
      await api(`/api/${kind}/${id}`, "DELETE");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const logout = async () => {
    await fetch("/api/acceso", { method: "DELETE" });
    router.push("/");
  };

  return (
    <div className="admin-home page-enter">
      <header className="admin__head">
        <div>
          <span className="kicker">Área privada</span>
          <h1 className="display">Mi taller de jardinería</h1>
          <p className="muted">Aquí siembras, podas y entrelazas todo lo que vive en tu jardín.</p>
        </div>
        <div className="admin__actions">
          <Link href="/admin/contenido/nuevo" className="btn btn--gold"><Plus size={16} /> Nuevo contenido</Link>
          <Link href="/admin/universos/nuevo" className="btn btn--ghost"><Plus size={16} /> Nuevo universo</Link>
          {hasPassword && <button className="ghost-link" onClick={logout}><LogOut size={14} /> Salir</button>}
        </div>
      </header>

      <div className="stats">
        <div><strong>{entries.length}</strong><span>piezas</span></div>
        <div><strong>{universes.length}</strong><span>universos</span></div>
        <div><strong>{links}</strong><span>hilos directos</span></div>
        <div><strong>{tags}</strong><span>etiquetas</span></div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="chips" role="tablist">
        <button role="tab" aria-selected={tab === "contenidos"} className={`chip ${tab === "contenidos" ? "is-on" : ""}`} onClick={() => setTab("contenidos")}>Contenidos</button>
        <button role="tab" aria-selected={tab === "universos"} className={`chip ${tab === "universos" ? "is-on" : ""}`} onClick={() => setTab("universos")}>Universos</button>
      </div>

      {tab === "contenidos" ? (
        <>
          <div className="searchbar searchbar--sm">
            <Search size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar por título o etiqueta…" aria-label="Filtrar" />
          </div>
          <ul className="rows">
            {list.map((e) => (
              <li key={e.id} className="row">
                <span className="row__icon"><TypeIcon type={e.type} size={18} /></span>
                <span className="row__main">
                  <Link href={`/admin/contenido/${e.id}`} className="row__title">{e.title}</Link>
                  <span className="row__meta">
                    {TYPE_LABELS[e.type].singular} · {formatDate(e.updatedAt)}
                    {e.universeIds.map((id) => {
                      const u = universes.find((x) => x.id === id);
                      return u ? <span key={id} className="dot" style={{ background: u.color }} title={u.name} /> : null;
                    })}
                    {e.relatedIds.length > 0 && <> · {e.relatedIds.length} hilos</>}
                  </span>
                </span>
                <span className="row__actions">
                  <Link href={`/contenido/${e.slug}`} className="icon-btn" aria-label="Ver"><Eye size={17} /></Link>
                  <Link href={`/admin/contenido/${e.id}`} className="icon-btn" aria-label="Editar"><Pencil size={17} /></Link>
                  <button className="icon-btn icon-btn--danger" aria-label="Eliminar" disabled={busy === e.id} onClick={() => remove("entries", e.id, e.title)}><Trash2 size={17} /></button>
                </span>
              </li>
            ))}
            {!list.length && <li className="empty">No hay contenidos que coincidan.</li>}
          </ul>
        </>
      ) : (
        <ul className="rows">
          {universes.map((u) => (
            <li key={u.id} className="row">
              <span className="row__icon" style={{ color: u.color }}><SymbolIcon name={u.symbol} size={20} /></span>
              <span className="row__main">
                <Link href={`/admin/universos/${u.id}`} className="row__title">{u.name}</Link>
                <span className="row__meta">
                  Orden {u.order} · {entries.filter((e) => e.universeIds.includes(u.id)).length} piezas
                  {u.hidden && <> · <EyeOff size={13} /> oculto</>}
                </span>
              </span>
              <span className="row__actions">
                <Link href={`/universo/${u.slug}`} className="icon-btn" aria-label="Ver"><Eye size={17} /></Link>
                <Link href={`/admin/universos/${u.id}`} className="icon-btn" aria-label="Editar"><Pencil size={17} /></Link>
                <button className="icon-btn icon-btn--danger" aria-label="Eliminar" disabled={busy === u.id} onClick={() => remove("universes", u.id, u.name)}><Trash2 size={17} /></button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
