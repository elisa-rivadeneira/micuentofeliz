"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import type { Universe, UniverseInput, DoorStyle, HubConfig, SectionKey } from "@/lib/types";
import { DOOR_STYLES, SECTION_KEYS } from "@/lib/types";
import { SECTIONS } from "@/lib/sections";
import { DOOR_STYLE_LABELS } from "@/lib/labels";
import { SYMBOLS, SymbolIcon } from "@/lib/symbols";
import { Door } from "../Door";
import { api } from "./api";

const EMPTY: UniverseInput = {
  slug: "", name: "", tagline: "", description: "", color: "#b58cff", glow: "#f5d79a", symbol: "destellos", doorStyle: "ojival", order: 99, hidden: false,
};

export function UniverseForm({ universe, nextOrder }: { universe?: Universe; nextOrder: number }) {
  const router = useRouter();
  const [f, setF] = useState<UniverseInput>(() => (universe ? { ...EMPTY, ...universe } : { ...EMPTY, order: nextOrder }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof UniverseInput>(k: K, v: UniverseInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const setHub = (patch: Partial<HubConfig>) => setF((p) => ({ ...p, hub: { sections: [], ...p.hub, ...patch } }));
  const [journeyDraft, setJourneyDraft] = useState(() => (universe?.hub?.journey ?? []).join(", "));

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = universe
        ? await api<Universe>(`/api/universes/${universe.id}`, "PUT", f)
        : await api<Universe>("/api/universes", "POST", f);
      router.push(`/universo/${saved.slug}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!universe || !confirm(`¿Eliminar el universo "${universe.name}"? Sus contenidos se conservan.`)) return;
    try {
      await api(`/api/universes/${universe.id}`, "DELETE");
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <form className="form page-enter" onSubmit={save}>
      <div className="form__top">
        <Link href="/admin" className="back"><ArrowLeft size={16} /> Taller</Link>
        <h1 className="display form__title">{universe ? "Editar universo" : "Abrir un universo nuevo"}</h1>
      </div>

      <div className="form__grid">
        <div className="form__main">
          <label className="field"><span>Nombre</span><input required value={f.name} onChange={(e) => set("name", e.target.value)} className="input input--big" /></label>
          <label className="field"><span>Lema</span><input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Una frase que se lea bajo la puerta" className="input" /></label>
          <label className="field"><span>Descripción</span><textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} className="input" /></label>

          <div className="field__row field__row--wrap">
            <label className="field"><span>Color de la puerta</span><input type="color" value={f.color} onChange={(e) => set("color", e.target.value)} className="color" /></label>
            <label className="field"><span>Color de la luz</span><input type="color" value={f.glow} onChange={(e) => set("glow", e.target.value)} className="color" /></label>
            <label className="field"><span>Orden</span><input type="number" value={f.order} onChange={(e) => set("order", Number(e.target.value))} className="input input--num" /></label>
            <label className="field"><span>Dirección (slug)</span><input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="automática" className="input" /></label>
          </div>

          <fieldset className="field">
            <legend>Forma del arco</legend>
            <div className="chips chips--wrap">
              {DOOR_STYLES.map((s) => (
                <button type="button" key={s} className={`chip ${f.doorStyle === s ? "is-on" : ""}`} onClick={() => set("doorStyle", s as DoorStyle)}>{DOOR_STYLE_LABELS[s]}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>Símbolo</legend>
            <div className="symbol-grid">
              {Object.entries(SYMBOLS).map(([key, { label }]) => (
                <button type="button" key={key} title={label} aria-label={label} className={`symbol-btn ${f.symbol === key ? "is-on" : ""}`} onClick={() => set("symbol", key)}>
                  <SymbolIcon name={key} size={22} />
                </button>
              ))}
            </div>
          </fieldset>

          <label className="check"><input type="checkbox" checked={Boolean(f.hidden)} onChange={(e) => set("hidden", e.target.checked)} /> Ocultar del jardín (borrador)</label>

          <fieldset className="field panel">
            <legend>Experiencia del universo</legend>
            <label className="check">
              <input
                type="checkbox"
                checked={Boolean(f.hub)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setJourneyDraft("Aprender, Entender, Decidir, Practicar");
                    set("hub", { title: f.name, sections: ["videoteca", "biblioteca"], journey: ["Aprender", "Entender", "Decidir", "Practicar"] });
                  } else set("hub", undefined);
                }}
              />
              Centro de aprendizaje (videoteca, biblioteca y notas, recetas; con filtros y seguimiento)
            </label>
            {f.hub && (
              <>
                <div className="field__row field__row--wrap">
                  <label className="field"><span>Título</span><input value={f.hub.title ?? ""} onChange={(e) => setHub({ title: e.target.value })} className="input" placeholder={f.name} /></label>
                  <label className="field"><span>Palabra destacada</span><input value={f.hub.highlight ?? ""} onChange={(e) => setHub({ highlight: e.target.value })} className="input" placeholder="Saludable" /></label>
                </div>
                <label className="field"><span>Subtítulo</span><textarea rows={2} value={f.hub.subtitle ?? ""} onChange={(e) => setHub({ subtitle: e.target.value })} className="input" /></label>
                <label className="field"><span>Recorrido <small>(separado por comas)</small></span>
                  <input value={journeyDraft} onChange={(e) => { setJourneyDraft(e.target.value); setHub({ journey: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }); }} className="input" placeholder="Aprender, Entender, Decidir, Practicar" />
                </label>
                <div className="field"><span>Secciones</span>
                  <div className="checks">
                    {SECTION_KEYS.map((k) => (
                      <label key={k} className="check">
                        <input type="checkbox" checked={f.hub!.sections.includes(k)} onChange={(e) => setHub({ sections: e.target.checked ? [...f.hub!.sections, k] : f.hub!.sections.filter((x: SectionKey) => x !== k) })} />
                        {SECTIONS[k].label} <small className="muted">— {SECTIONS[k].description}</small>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </fieldset>
        </div>

        <aside className="form__side">
          <div className="panel door-preview">
            <Door color={f.color} glow={f.glow} symbol={f.symbol} style={f.doorStyle} />
            <strong>{f.name || "Nuevo universo"}</strong>
            <span className="muted small">{f.tagline}</span>
          </div>
        </aside>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="form__bar">
        {universe && <button type="button" className="btn btn--danger" onClick={remove}><Trash2 size={16} /> Eliminar</button>}
        <span className="spacer" />
        <Link href="/admin" className="btn btn--ghost">Cancelar</Link>
        <button type="submit" className="btn btn--gold" disabled={saving}><Save size={16} /> {saving ? "Guardando…" : "Guardar"}</button>
      </div>
    </form>
  );
}
