import Link from "next/link";
import type { Entry, Universe } from "@/lib/types";
import { TYPE_LABELS } from "@/lib/labels";
import { TypeIcon } from "./TypeIcon";
import { hexToRgb } from "@/lib/util";

export function EntryCard({ entry, universes, reasons }: { entry: Entry; universes: Universe[]; reasons?: string[] }) {
  const own = universes.filter((u) => entry.universeIds.includes(u.id));
  const color = own[0]?.color ?? "#c9a7ff";
  return (
    <Link href={`/contenido/${entry.slug}`} className="card" style={{ ["--c" as string]: hexToRgb(color) }}>
      {entry.cover && (
        <span className="card__cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.cover} alt="" loading="lazy" />
        </span>
      )}
      <span className="card__type">
        <TypeIcon type={entry.type} size={15} /> {TYPE_LABELS[entry.type]?.singular}
      </span>
      <span className="card__title">{entry.title}</span>
      {entry.summary && <span className="card__summary">{entry.summary}</span>}
      <span className="card__foot">
        {reasons?.length ? (
          <span className="card__reasons">{reasons.slice(0, 3).join(" · ")}</span>
        ) : (
          own.map((u) => (
            <span key={u.id} className="dot" style={{ background: u.color }} title={u.name} />
          ))
        )}
      </span>
    </Link>
  );
}
