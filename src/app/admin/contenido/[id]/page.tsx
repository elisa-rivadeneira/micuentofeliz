import { notFound } from "next/navigation";
import { getSnapshot } from "@/lib/db";
import { EntryForm } from "@/components/admin/EntryForm";

export const dynamic = "force-dynamic";

export default async function EditarContenido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { universes, entries } = await getSnapshot(true);
  const entry = entries.find((e) => e.id === id);
  if (!entry) notFound();
  return <EntryForm key={entry.id} entry={entry} universes={universes} entries={entries} />;
}
