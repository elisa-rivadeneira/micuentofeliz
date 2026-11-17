import { getSnapshot } from "@/lib/db";
import { AdminHome } from "@/components/admin/AdminHome";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { universes, entries } = await getSnapshot(true);
  return <AdminHome universes={universes} entries={entries} hasPassword={Boolean(process.env.ADMIN_PASSWORD)} />;
}
