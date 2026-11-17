"use client";

import { useRef, useState } from "react";
import {
  Bold, Italic, Heading2, List, ListOrdered, Quote, Link2, Code, SquareCode, Sparkles, ImagePlus, Minus,
  Columns2, PenLine, Eye, Loader2,
} from "lucide-react";
import { Prose } from "../Prose";
import { uploadFile } from "./api";

type Mode = "escribir" | "dividido" | "vista";

interface Props {
  value: string;
  onChange: (v: string) => void;
  verse?: boolean;
}

/**
 * Editor del cuerpo: guarda Markdown, pero se usa con botones.
 * Imágenes: botón, pegar (Ctrl+V) o arrastrar; se suben y se insertan donde está el cursor.
 */
export function MarkdownEditor({ value, onChange, verse }: Props) {
  const ta = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<Mode>("dividido");
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  /** Reemplaza la selección y deja el cursor/selección donde corresponde. */
  const replace = (fn: (sel: string) => { text: string; selStart?: number; selEnd?: number }) => {
    const el = ta.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const sel = value.slice(a, b);
    const r = fn(sel);
    const next = value.slice(0, a) + r.text + value.slice(b);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + (r.selStart ?? r.text.length), a + (r.selEnd ?? r.selStart ?? r.text.length));
    });
  };

  const wrap = (before: string, after: string, placeholder: string) =>
    replace((sel) => {
      const inner = sel || placeholder;
      return { text: before + inner + after, selStart: before.length, selEnd: before.length + inner.length };
    });

  /** Aplica un prefijo a cada línea seleccionada (listas, citas, títulos). */
  const prefixLines = (prefix: (i: number) => string, placeholder: string) =>
    replace((sel) => {
      const lines = (sel || placeholder).split("\n");
      const text = lines.map((l, i) => prefix(i) + l.replace(/^(#{1,6} |> |- |\d+\. )/, "")).join("\n");
      return { text, selStart: 0, selEnd: text.length };
    });

  /** Inserta un bloque en líneas propias. */
  const block = (open: string, close: string, placeholder: string) =>
    replace((sel) => {
      const el = ta.current!;
      const before = value.slice(0, el.selectionStart);
      const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
      const inner = sel || placeholder;
      const text = `${lead}${open}\n${inner}\n${close}\n`;
      const start = lead.length + open.length + 1;
      return { text, selStart: start, selEnd: start + inner.length };
    });

  const insertImages = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setError("");
    setUploading((n) => n + imgs.length);
    for (const file of imgs) {
      try {
        const r = await uploadFile(file);
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "imagen";
        replace(() => ({ text: `\n![${alt}](${r.url})\n` }));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); wrap("**", "**", "texto"); }
    else if (mod && e.key.toLowerCase() === "i") { e.preventDefault(); wrap("*", "*", "texto"); }
    else if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); wrap("[", "](https://)", "enlace"); }
    else if (e.key === "Tab") {
      // Tab escribe sangría (útil en código); Shift+Tab sale del editor.
      if (e.shiftKey) return;
      e.preventDefault();
      replace(() => ({ text: "  " }));
    }
  };

  const tools: { icon: typeof Bold; label: string; run: () => void; sep?: boolean }[] = [
    { icon: Bold, label: "Negrita (Ctrl+B)", run: () => wrap("**", "**", "texto") },
    { icon: Italic, label: "Cursiva (Ctrl+I)", run: () => wrap("*", "*", "texto") },
    { icon: Heading2, label: "Título", run: () => prefixLines(() => "## ", "Título") },
    { icon: List, label: "Lista", run: () => prefixLines(() => "- ", "elemento"), sep: true },
    { icon: ListOrdered, label: "Lista numerada", run: () => prefixLines((i) => `${i + 1}. `, "paso") },
    { icon: Quote, label: "Cita", run: () => prefixLines(() => "> ", "cita") },
    { icon: Link2, label: "Enlace (Ctrl+K)", run: () => wrap("[", "](https://)", "enlace") },
    { icon: Minus, label: "Separador", run: () => replace(() => ({ text: "\n\n---\n\n" })) },
    { icon: Code, label: "Código en línea", run: () => wrap("`", "`", "código"), sep: true },
    { icon: SquareCode, label: "Bloque de código", run: () => block("```", "```", "tu código aquí") },
  ];

  return (
    <div className={`mde mde--${mode} ${dragOver ? "is-drag" : ""}`}>
      <div className="mde__bar" role="toolbar" aria-label="Formato">
        {tools.map(({ icon: Icon, label, run, sep }) => (
          <span key={label} className="mde__toolwrap">
            {sep && <span className="mde__sep" aria-hidden />}
            <button type="button" className="mde__tool" onClick={run} title={label} aria-label={label}>
              <Icon size={17} />
            </button>
          </span>
        ))}
        <button type="button" className="mde__tool mde__tool--prompt" onClick={() => block("```prompt", "```", "Escribe aquí tu prompt…")} title="Bloque de prompt (con botón Copiar)">
          <Sparkles size={16} /> Prompt
        </button>
        <label className="mde__tool mde__tool--img" title="Insertar imagen (también puedes pegarla o arrastrarla)">
          {uploading ? <Loader2 size={16} className="spin" /> : <ImagePlus size={16} />} Imagen
          <input type="file" hidden multiple accept="image/*" onChange={(e) => { insertImages([...(e.target.files ?? [])]); e.target.value = ""; }} />
        </label>
        <span className="mde__spacer" />
        <div className="mde__modes" role="group" aria-label="Vista">
          <button type="button" className={mode === "escribir" ? "is-on" : ""} onClick={() => setMode("escribir")} title="Solo escribir"><PenLine size={15} /></button>
          <button type="button" className={mode === "dividido" ? "is-on" : ""} onClick={() => setMode("dividido")} title="Escribir y ver"><Columns2 size={15} /></button>
          <button type="button" className={mode === "vista" ? "is-on" : ""} onClick={() => setMode("vista")} title="Vista previa"><Eye size={15} /></button>
        </div>
      </div>

      <div className="mde__panes">
        {mode !== "vista" && (
          <textarea
            ref={ta}
            className="mde__text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={(e) => {
              const files = [...e.clipboardData.files];
              if (files.some((f) => f.type.startsWith("image/"))) { e.preventDefault(); insertImages(files); }
            }}
            onDragOver={(e) => { if ([...e.dataTransfer.items].some((i) => i.kind === "file")) { e.preventDefault(); setDragOver(true); } }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              setDragOver(false);
              const files = [...e.dataTransfer.files];
              if (files.length) { e.preventDefault(); insertImages(files); }
            }}
            placeholder={"Escribe aquí…\n\nUsa los botones de arriba para dar formato, insertar imágenes o un bloque de prompt listo para copiar."}
            spellCheck
          />
        )}
        {mode !== "escribir" && (
          <div className="mde__preview">
            <Prose body={value || "*La vista previa aparecerá aquí.*"} verse={verse} />
          </div>
        )}
      </div>
      {uploading > 0 && <p className="mde__note">Subiendo {uploading} {uploading === 1 ? "imagen" : "imágenes"}…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
