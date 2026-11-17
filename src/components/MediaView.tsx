import type { MediaItem } from "@/lib/types";
import { ExternalLink } from "lucide-react";

function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

export function MediaView({ items }: { items: MediaItem[] }) {
  if (!items.length) return null;
  return (
    <div className="media">
      {items.map((m) => (
        <figure key={m.id} className={`media__item media__item--${m.kind}`}>
          {m.kind === "imagen" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.url} alt={m.caption ?? ""} loading="lazy" />
          )}
          {m.kind === "audio" && <audio controls preload="none" src={m.url} />}
          {m.kind === "video" &&
            (youtubeEmbed(m.url) ? (
              <iframe src={youtubeEmbed(m.url)!} title={m.caption ?? "Video"} allow="encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
            ) : (
              <video controls preload="metadata" src={m.url} />
            ))}
          {m.kind === "enlace" && (
            <a href={m.url} target="_blank" rel="noreferrer" className="media__link">
              <ExternalLink size={16} /> {m.caption || m.url}
            </a>
          )}
          {m.caption && m.kind !== "enlace" && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
