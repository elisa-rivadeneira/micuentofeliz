import { getSnapshot } from "@/lib/db";
import { EntryForm } from "@/components/admin/EntryForm";
import { CONTENT_TYPES, type ContentType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NuevoContenido({ searchParams }: { searchParams: Promise<{ universo?: string; tipo?: string }> }) {
  const { universo, tipo } = await searchParams;
  const presetType = CONTENT_TYPES.includes(tipo as ContentType) ? (tipo as ContentType) : undefined;
  const { universes, entries } = await getSnapshot(true);
  const preset = universes.find((u) => u.slug === universo)?.id;
  return <EntryForm universes={universes} entries={entries} presetUniverse={preset} presetType={presetType} />;
}
