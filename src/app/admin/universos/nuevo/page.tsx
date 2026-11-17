import { getUniverses } from "@/lib/db";
import { UniverseForm } from "@/components/admin/UniverseForm";

export const dynamic = "force-dynamic";

export default async function NuevoUniverso() {
  const all = await getUniverses({ includeHidden: true });
  const next = all.reduce((m, u) => Math.max(m, u.order), 0) + 1;
  return <UniverseForm nextOrder={next} />;
}
