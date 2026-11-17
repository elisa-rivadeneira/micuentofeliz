import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createUniverse, getUniverses } from "@/lib/db";
import type { UniverseInput } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getUniverses({ includeHidden: true }));
}

export async function POST(req: Request) {
  const body = (await req.json()) as UniverseInput;
  if (!body?.name?.trim()) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  const u = await createUniverse(body);
  revalidatePath("/", "layout");
  return NextResponse.json(u, { status: 201 });
}
