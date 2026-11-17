"use client";

import { useRef, useState } from "react";
import { Check, Copy, Sparkles, Code2 } from "lucide-react";

/** Bloque de código o prompt con botón "Copiar". */
export function CodeBlock({ children, lang }: { children: React.ReactNode; lang?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const isPrompt = lang === "prompt";

  const copy = async () => {
    const text = ref.current?.innerText.replace(/\n$/, "") ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Respaldo para navegadores sin permiso de portapapeles.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`codeblock ${isPrompt ? "codeblock--prompt" : ""}`}>
      <div className="codeblock__bar">
        <span className="codeblock__lang">
          {isPrompt ? <Sparkles size={14} /> : <Code2 size={14} />} {isPrompt ? "Prompt" : lang || "Código"}
        </span>
        <button type="button" className="codeblock__copy" onClick={copy} aria-label="Copiar al portapapeles">
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
