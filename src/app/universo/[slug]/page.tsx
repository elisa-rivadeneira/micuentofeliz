import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getSnapshot, getUniverseByOldSlug, getUniverseBySlug } from "@/lib/db";
import { redirect } from "next/navigation";
import { tagCounts } from "@/lib/graph";
import { hexToRgb } from "@/lib/util";
import { Door } from "@/components/Door";
import { Fireflies } from "@/components/Fireflies";
import { UniverseShelf } from "@/components/UniverseShelf";
import { SymbolIcon } from "@/lib/symbols";
import { LearningHub, hubTitle } from "@/components/hub/LearningHub";
import { hubVisuals } from "@/lib/hub-visuals";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const u = await getUniverseBySlug((await params).slug);
  return { title: u ? (u.hub ? hubTitle(u) : u.name) : "Universo" };
}

export default async function UniversoPage({ params }: Params) {
  const { slug } = await params;
  const universe = await getUniverseBySlug(slug);
  if (!universe) {
    const moved = await getUniverseByOldSlug(slug);
    if (moved) redirect(`/universo/${moved.slug}`);
    notFound();
  }
  const { universes, entries } = await getSnapshot();
  if (universe.hub) return <LearningHub universe={universe} entries={entries} visuals={hubVisuals()} />;
  const inside = entries.filter((e) => e.universeIds.includes(universe.id));
  const tags = tagCounts(inside).slice(0, 18);

  // Puertas vecinas: universos que comparten piezas con este.
  const neighbors = universes
    .filter((u) => u.id !== universe.id)
    .map((u) => ({ u, n: inside.filter((e) => e.universeIds.includes(u.id)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);

  const rgb = hexToRgb(universe.color);
  const glowRgb = hexToRgb(universe.glow);

  return (
    <main className="universe" style={{ ["--u" as string]: rgb, ["--ug" as string]: glowRgb }}>
      <div className="universe__sky" aria-hidden>
        <div className="universe__bg" />
        <div className="universe__tint" />
      </div>
      <Fireflies count={36} colors={[glowRgb, rgb, "255, 236, 180"]} band={[0, 1]} className="universe__fireflies" />
      <div className="threshold-flash" aria-hidden />

      <div className="wrap">
        <Link href="/jardin" className="back">
          <ArrowLeft size={16} /> Volver al jardín
        </Link>

        <header className="universe__head page-enter">
          <Door color={universe.color} glow={universe.glow} symbol={universe.symbol} style={universe.doorStyle} open className="universe__door" />
          <div className="universe__intro">
            <span className="kicker">
              <SymbolIcon name={universe.symbol} size={16} /> Universo
            </span>
            <h1 className="display universe__name">{universe.name}</h1>
            {universe.tagline && <p className="universe__tagline">{universe.tagline}</p>}
            {universe.description && <p className="lead">{universe.description}</p>}
            <p className="muted small">
              {inside.length} {inside.length === 1 ? "pieza" : "piezas"} · {tags.length} hilos
            </p>
          </div>
        </header>

        <UniverseShelf entries={inside} universes={universes} />

        {tags.length > 0 && (
          <section className="section">
            <h2 className="section__title">Hilos que atraviesan este universo</h2>
            <div className="tags">
              {tags.map(([t, n]) => (
                <Link key={t} href={`/explorar?etiqueta=${encodeURIComponent(t)}`} className="tag">
                  #{t} <small>{n}</small>
                </Link>
              ))}
            </div>
          </section>
        )}

        {neighbors.length > 0 && (
          <section className="section">
            <h2 className="section__title">Puertas vecinas</h2>
            <p className="muted small">Universos que comparten piezas con este.</p>
            <div className="neighbors">
              {neighbors.map(({ u, n }) => (
                <Link key={u.id} href={`/universo/${u.slug}`} className="neighbor" style={{ ["--c" as string]: hexToRgb(u.color) }}>
                  <SymbolIcon name={u.symbol} size={20} />
                  <span>{u.name}</span>
                  <small>{n} en común</small>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
