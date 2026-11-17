import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Database, Entry, EntryInput, EntryPatch, GardenId, HubConfig, Universe, UniverseInput } from "./types";
import { EVIDENCE_LEVELS, READ_STATUSES, SECTION_KEYS } from "./types";
import { buildSeed } from "./seed";
import { newId, normalizeTag, slugify } from "./util";
import { PERSONAL_GARDEN } from "./gardens";
import { SECTION_ALIASES } from "./sections";

/**
 * Almacenamiento local en un archivo JSON (data/db.json).
 *
 * Es deliberadamente simple: ideal para el prototipo personal en localhost.
 * Toda la app accede a los datos solo a través de las funciones exportadas
 * aquí, de modo que más adelante pueden reemplazarse por una base de datos
 * real (SQLite, Postgres...) sin tocar las páginas ni los componentes.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

let queue: Promise<unknown> = Promise.resolve();

/** Serializa escrituras para no corromper el archivo con peticiones simultáneas. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readDb(): Promise<Database> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return migrate(JSON.parse(raw) as Database);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      const seed = buildSeed(PERSONAL_GARDEN);
      await writeDb(seed);
      return seed;
    }
    throw err;
  }
}

/** Ajustes de datos guardados con versiones anteriores (se persisten en la siguiente escritura). */
function migrate(db: Database): Database {
  for (const u of db.universes) {
    if (u.hub) u.hub.sections = [...new Set(u.hub.sections.map((k) => SECTION_ALIASES[k] ?? k))].filter((k) => SECTION_KEYS.includes(k));
  }
  return db;
}

async function writeDb(db: Database) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const data = JSON.stringify(db, null, 2);
  const tmp = DB_PATH + "." + process.pid + ".tmp";
  await fs.writeFile(tmp, data, "utf8");
  // En Windows, el reemplazo atómico falla (EPERM/EBUSY) si otro programa tiene el
  // archivo abierto un instante (editor, antivirus, indexador). Reintentamos y, si
  // sigue bloqueado, escribimos directamente sobre el archivo.
  for (let i = 0; i < 6; i++) {
    try {
      await fs.rename(tmp, DB_PATH);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code !== "EPERM" && code !== "EBUSY" && code !== "EACCES") throw err;
      await new Promise((r) => setTimeout(r, 40 * (i + 1)));
    }
  }
  await fs.writeFile(DB_PATH, data, "utf8");
  await fs.rm(tmp, { force: true });
}

function uniqueSlug(base: string, taken: Set<string>): string {
  const root = slugify(base);
  let slug = root;
  let i = 2;
  while (taken.has(slug)) slug = `${root}-${i++}`;
  return slug;
}

// ───────────── Lectura ─────────────

export async function getUniverses(opts: { includeHidden?: boolean; gardenId?: GardenId } = {}): Promise<Universe[]> {
  const db = await readDb();
  const g = opts.gardenId ?? PERSONAL_GARDEN;
  return db.universes
    .filter((u) => u.gardenId === g && (opts.includeHidden || !u.hidden))
    .sort((a, b) => a.order - b.order);
}

export async function getUniverseBySlug(slug: string): Promise<Universe | undefined> {
  const db = await readDb();
  return db.universes.find((u) => u.slug === slug && u.gardenId === PERSONAL_GARDEN);
}

/** Universo que antes tenía esta dirección (para redirigir enlaces viejos). */
export async function getUniverseByOldSlug(slug: string): Promise<Universe | undefined> {
  const db = await readDb();
  return db.universes.find((u) => u.gardenId === PERSONAL_GARDEN && u.oldSlugs?.includes(slug));
}

export async function getEntries(gardenId: GardenId = PERSONAL_GARDEN): Promise<Entry[]> {
  const db = await readDb();
  return db.entries
    .filter((e) => e.gardenId === gardenId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEntryBySlug(slug: string): Promise<Entry | undefined> {
  const db = await readDb();
  return db.entries.find((e) => e.slug === slug && e.gardenId === PERSONAL_GARDEN);
}

export async function getEntryById(id: string): Promise<Entry | undefined> {
  const db = await readDb();
  return db.entries.find((e) => e.id === id);
}

export async function getUniverseById(id: string): Promise<Universe | undefined> {
  const db = await readDb();
  return db.universes.find((u) => u.id === id);
}

/** Todo el jardín personal de una vez (universos ordenados + contenidos recientes primero). */
export async function getSnapshot(includeHidden = false) {
  const db = await readDb();
  return {
    universes: db.universes
      .filter((u) => u.gardenId === PERSONAL_GARDEN && (includeHidden || !u.hidden))
      .sort((a, b) => a.order - b.order),
    entries: db.entries
      .filter((e) => e.gardenId === PERSONAL_GARDEN)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

// ───────────── Escritura ─────────────

function cleanEntry(input: EntryInput, db: Database, existing?: Entry) {
  const validUniverse = new Set(db.universes.map((u) => u.id));
  const validEntry = new Set(db.entries.map((e) => e.id));
  const takenSlugs = new Set(db.entries.filter((e) => e.id !== existing?.id).map((e) => e.slug));
  return {
    slug: uniqueSlug(input.slug?.trim() || input.title, takenSlugs),
    title: input.title?.trim() || "Sin título",
    type: input.type,
    summary: input.summary?.trim() ?? "",
    body: input.body ?? "",
    universeIds: [...new Set(input.universeIds ?? [])].filter((id) => validUniverse.has(id)),
    tags: [...new Set((input.tags ?? []).map(normalizeTag).filter(Boolean))],
    relatedIds: [...new Set(input.relatedIds ?? [])].filter((id) => validEntry.has(id) && id !== existing?.id),
    cover: input.cover || undefined,
    media: (input.media ?? []).filter((m) => m.url).map((m) => ({ ...m, id: m.id || newId("m_") })),
    author: input.author?.trim() || undefined,
    source: input.source?.trim() || undefined,
    externalUrl: input.externalUrl?.trim() || undefined,
    buyUrl: cleanUrl(input.buyUrl),
    borrowUrl: cleanUrl(input.borrowUrl),
    featured: Boolean(input.featured),
    ...cleanTracking(input),
  };
}

function cleanUrl(raw?: string): string | undefined {
  const v = raw?.trim();
  if (!v) return undefined;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

function cleanTracking(input: EntryPatch & { duration?: string }) {
  const rating = Number(input.rating);
  return {
    evidence: EVIDENCE_LEVELS.includes(input.evidence as never) ? input.evidence : undefined,
    status: READ_STATUSES.includes(input.status as never) ? input.status : undefined,
    rating: Number.isFinite(rating) && rating > 0 ? Math.min(5, Math.round(rating * 10) / 10) : undefined,
    duration: input.duration?.trim() || undefined,
    saved: input.saved ? true : undefined,
  };
}

function cleanHub(hub: HubConfig | undefined): HubConfig | undefined {
  if (!hub) return undefined;
  const sections = [...new Set((hub.sections ?? []).map((k) => SECTION_ALIASES[k] ?? k))].filter((k) => SECTION_KEYS.includes(k));
  if (!sections.length) return undefined;
  return {
    title: hub.title?.trim() || undefined,
    highlight: hub.highlight?.trim() || undefined,
    subtitle: hub.subtitle?.trim() || undefined,
    journey: (hub.journey ?? []).map((j) => j.trim()).filter(Boolean).slice(0, 6),
    sections,
  };
}

/** Cambios rápidos desde la videoteca (estado, guardado, valoración, evidencia). */
export function patchEntry(id: string, patch: EntryPatch): Promise<Entry | undefined> {
  return withLock(async () => {
    const db = await readDb();
    const e = db.entries.find((x) => x.id === id);
    if (!e) return undefined;
    const merged = cleanTracking({ evidence: e.evidence, status: e.status, rating: e.rating, saved: e.saved, duration: e.duration, ...patch });
    Object.assign(e, merged, { updatedAt: new Date().toISOString() });
    await writeDb(db);
    return e;
  });
}

export function createEntry(input: EntryInput): Promise<Entry> {
  return withLock(async () => {
    const db = await readDb();
    const now = new Date().toISOString();
    const entry: Entry = { id: newId("e_"), gardenId: PERSONAL_GARDEN, createdAt: now, updatedAt: now, ...cleanEntry(input, db) };
    db.entries.push(entry);
    await writeDb(db);
    return entry;
  });
}

export function updateEntry(id: string, input: EntryInput): Promise<Entry | undefined> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.entries.findIndex((e) => e.id === id);
    if (idx < 0) return undefined;
    const prev = db.entries[idx];
    const next: Entry = { ...prev, ...cleanEntry(input, db, prev), updatedAt: new Date().toISOString() };
    db.entries[idx] = next;
    await writeDb(db);
    return next;
  });
}

export function deleteEntry(id: string): Promise<boolean> {
  return withLock(async () => {
    const db = await readDb();
    const before = db.entries.length;
    db.entries = db.entries.filter((e) => e.id !== id);
    db.entries.forEach((e) => (e.relatedIds = e.relatedIds.filter((r) => r !== id)));
    await writeDb(db);
    return db.entries.length < before;
  });
}

function cleanUniverse(input: UniverseInput, db: Database, existing?: Universe) {
  const taken = new Set(db.universes.filter((u) => u.id !== existing?.id).map((u) => u.slug));
  return {
    slug: uniqueSlug(input.slug?.trim() || input.name, taken),
    name: input.name?.trim() || "Universo sin nombre",
    tagline: input.tagline?.trim() ?? "",
    description: input.description ?? "",
    color: input.color || "#c9a7ff",
    glow: input.glow || input.color || "#f5d79a",
    symbol: input.symbol || "destellos",
    doorStyle: input.doorStyle || "ojival",
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : db.universes.length + 1,
    hidden: Boolean(input.hidden),
    image: input.image?.trim() || undefined,
    hub: cleanHub(input.hub),
  };
}

export function createUniverse(input: UniverseInput): Promise<Universe> {
  return withLock(async () => {
    const db = await readDb();
    const now = new Date().toISOString();
    const u: Universe = { id: newId("u_"), gardenId: PERSONAL_GARDEN, createdAt: now, updatedAt: now, ...cleanUniverse(input, db) };
    db.universes.push(u);
    await writeDb(db);
    return u;
  });
}

export function updateUniverse(id: string, input: UniverseInput): Promise<Universe | undefined> {
  return withLock(async () => {
    const db = await readDb();
    const idx = db.universes.findIndex((u) => u.id === id);
    if (idx < 0) return undefined;
    const prev = db.universes[idx];
    const next: Universe = { ...prev, ...cleanUniverse(input, db, prev), updatedAt: new Date().toISOString() };
    // Si cambia la dirección, recordamos la anterior para que los enlaces viejos sigan funcionando.
    const old = new Set([...(prev.oldSlugs ?? []), ...(prev.slug !== next.slug ? [prev.slug] : [])]);
    old.delete(next.slug);
    next.oldSlugs = old.size ? [...old] : undefined;
    db.universes[idx] = next;
    await writeDb(db);
    return next;
  });
}

export function deleteUniverse(id: string): Promise<boolean> {
  return withLock(async () => {
    const db = await readDb();
    const before = db.universes.length;
    db.universes = db.universes.filter((u) => u.id !== id);
    db.entries.forEach((e) => (e.universeIds = e.universeIds.filter((u) => u !== id)));
    await writeDb(db);
    return db.universes.length < before;
  });
}
