import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Novedades del jardín personal: las piezas tocadas más recientemente. */
export async function GET() {
  const { entries } = await getSnapshot();
  const recent = [...entries]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)
    .map((e) => ({ id: e.id, slug: e.slug, title: e.title, type: e.type, updatedAt: e.updatedAt, isNew: e.createdAt === e.updatedAt }));
  return NextResponse.json(recent);
}
