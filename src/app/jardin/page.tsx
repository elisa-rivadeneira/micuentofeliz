import type { Metadata } from "next";
import { getSnapshot } from "@/lib/db";
import { findImage } from "@/lib/backgrounds";
import { GardenExperience } from "@/components/jardin/GardenExperience";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Jardines" };

export default async function JardinPage() {
  const { universes, entries } = await getSnapshot();
  const counts: Record<string, number> = {};
  for (const u of universes) counts[u.id] = entries.filter((e) => e.universeIds.includes(u.id)).length;
  const withImages = universes.map((u) => ({ ...u, image: u.image || findImage(`universos/${u.slug}`) }));
  return <GardenExperience universes={withImages} counts={counts} background={findImage("jardines-fondo")} />;
}
