import type { Entry, Universe } from "./types";

/**
 * El tejido: relaciones entre contenidos.
 *
 * Tres tipos de hilo, de más fuerte a más tenue:
 *  - referencia: enlace explícito que tú creas (bidireccional)
 *  - etiqueta: comparten una o más etiquetas
 *  - universo: viven en el mismo universo
 */

export type LinkKind = "referencia" | "etiqueta";

export interface GraphLink {
  source: string;
  target: string;
  kind: LinkKind;
  weight: number;
  tags?: string[];
}

export function buildLinks(entries: Entry[]): GraphLink[] {
  const ids = new Set(entries.map((e) => e.id));
  const map = new Map<string, GraphLink>();
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

  for (const e of entries) {
    for (const r of e.relatedIds) {
      if (!ids.has(r) || r === e.id) continue;
      map.set(key(e.id, r), { source: e.id, target: r, kind: "referencia", weight: 3 });
    }
  }
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      const k = key(a.id, b.id);
      if (map.has(k)) continue;
      const shared = a.tags.filter((t) => b.tags.includes(t));
      if (shared.length) map.set(k, { source: a.id, target: b.id, kind: "etiqueta", weight: shared.length, tags: shared });
    }
  }
  return [...map.values()];
}

export interface RelatedResult {
  entry: Entry;
  score: number;
  reasons: string[];
}

/** Contenidos relacionados con uno dado, con el motivo de cada hilo. */
export function relatedTo(entry: Entry, all: Entry[], universes: Universe[], limit = 8): RelatedResult[] {
  const uName = new Map(universes.map((u) => [u.id, u.name]));
  const results: RelatedResult[] = [];
  for (const other of all) {
    if (other.id === entry.id) continue;
    let score = 0;
    const reasons: string[] = [];
    if (entry.relatedIds.includes(other.id) || other.relatedIds.includes(entry.id)) {
      score += 10;
      reasons.push("hilo directo");
    }
    const sharedTags = entry.tags.filter((t) => other.tags.includes(t));
    if (sharedTags.length) {
      score += sharedTags.length * 2;
      reasons.push(...sharedTags.map((t) => `#${t}`));
    }
    const sharedU = entry.universeIds.filter((u) => other.universeIds.includes(u));
    if (sharedU.length) {
      score += sharedU.length;
      if (!reasons.length) reasons.push(...sharedU.map((u) => uName.get(u) ?? ""));
    }
    if (score > 0) results.push({ entry: other, score, reasons });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function adjacency(entries: Entry[], links: GraphLink[]) {
  const adj = new Map<string, Set<string>>(entries.map((e) => [e.id, new Set()]));
  for (const l of links) {
    adj.get(l.source)?.add(l.target);
    adj.get(l.target)?.add(l.source);
  }
  return adj;
}

/** Camino más corto entre dos contenidos (BFS, prefiere referencias directas). */
export function findPath(from: string, to: string, entries: Entry[], links: GraphLink[]): string[] | null {
  if (from === to) return [from];
  const strong = links.filter((l) => l.kind === "referencia");
  for (const set of [strong, links]) {
    const adj = adjacency(entries, set);
    const prev = new Map<string, string>();
    const seen = new Set([from]);
    const q = [from];
    while (q.length) {
      const cur = q.shift()!;
      for (const n of adj.get(cur) ?? []) {
        if (seen.has(n)) continue;
        seen.add(n);
        prev.set(n, cur);
        if (n === to) {
          const path = [to];
          let p = to;
          while (prev.has(p)) {
            p = prev.get(p)!;
            path.unshift(p);
          }
          return path;
        }
        q.push(n);
      }
    }
  }
  return null;
}

/** Recuento de etiquetas, de más usada a menos. */
export function tagCounts(entries: Entry[]): [string, number][] {
  const m = new Map<string, number>();
  for (const e of entries) for (const t of e.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
