import ReactMarkdown from "react-markdown";

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
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
