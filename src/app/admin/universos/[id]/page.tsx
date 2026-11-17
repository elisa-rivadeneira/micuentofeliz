import { notFound } from "next/navigation";
import { getUniverseById } from "@/lib/db";
import { UniverseForm } from "@/components/admin/UniverseForm";

export const dynamic = "force-dynamic";

export default async function EditarUniverso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const universe = await getUniverseById(id);
  if (!universe) notFound();
  return <UniverseForm key={universe.id} universe={universe} nextOrder={universe.order} />;
}
