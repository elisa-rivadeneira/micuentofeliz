import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSnapshot, getUniverseByOldSlug, getUniverseBySlug } from "@/lib/db";
import { SECTIONS, SECTION_ALIASES, inSection } from "@/lib/sections";
import type { SectionKey } from "@/lib/types";
import { hubVisuals } from "@/lib/hub-visuals";
import { shopConfig } from "@/lib/shop-config";
import { HubBackdrop } from "@/components/hub/HubBackdrop";
import { SectionLibrary } from "@/components/hub/SectionLibrary";
import { hubTitle } from "@/components/hub/LearningHub";
import "@/components/hub/hub.css";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string; seccion: string }>; searchParams: Promise<{ tab?: string }> };

async function load(slug: string, seccion: string) {
  const universe = await getUniverseBySlug(slug);
  if (!universe?.hub || !universe.hub.sections.includes(seccion as SectionKey)) return null;
  return { universe, section: SECTIONS[seccion as SectionKey] };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, seccion } = await params;
  const r = await load(slug, seccion);
  return { title: r ? `${r.section.label} · ${hubTitle(r.universe)}` : "Sección" };
}

export default async function SeccionPage({ params, searchParams }: Params) {
  const { slug, seccion } = await params;
  const { tab } = await searchParams;
  if (SECTION_ALIASES[seccion]) redirect(`/universo/${slug}/${SECTION_ALIASES[seccion]}`);
  if (!(await getUniverseBySlug(slug))) {
    const moved = await getUniverseByOldSlug(slug);
    if (moved) redirect(`/universo/${moved.slug}/${seccion}`);
  }
  const r = await load(slug, seccion);
  if (!r) notFound();
  const { universe, section } = r;
  const { entries } = await getSnapshot();
  const items = entries.filter((e) => inSection(e, universe.id, section));
  const visuals = hubVisuals();
  return (
    <main className="hub hub--section">
      <HubBackdrop dawn={visuals.dawn} lake={visuals.lake} />
      <div className="hub__wrap hub__wrap--wide">
        <SectionLibrary
          universe={{ slug: universe.slug, name: universe.name, id: universe.id }}
          hubTitle={hubTitle(universe)}
          sectionKey={section.key}
          entries={items}
          initialTab={tab}
          art={visuals.art[section.key]}
          shop={shopConfig()}
        />
      </div>
    </main>
  );
}
