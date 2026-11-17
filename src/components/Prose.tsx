import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";

/** Cuerpo de un contenido en Markdown. Los poemas y canciones respetan los saltos de línea. */
export function Prose({ body, verse }: { body: string; verse?: boolean }) {
  return (
    <div className={`prose ${verse ? "prose--verse" : ""}`}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {children}
            </a>
          ),
          // Bloques ``` con botón "Copiar"; ```prompt se muestra como prompt listo para usar.
          pre: ({ children }) => {
            const code = isValidElement<{ className?: string }>(children) ? children : null;
            const lang = code?.props.className?.match(/language-([\w-]+)/)?.[1];
            return <CodeBlock lang={lang}>{children}</CodeBlock>;
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" className="prose__img" />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
