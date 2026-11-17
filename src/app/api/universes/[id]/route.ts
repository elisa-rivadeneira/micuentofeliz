import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteUniverse, updateUniverse } from "@/lib/db";
import type { UniverseInput } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json()) as UniverseInput;
  if (!body?.name?.trim()) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  const u = await updateUniverse(id, body);
  if (!u) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(u);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteUniverse(id);
  revalidatePath("/", "layout");
  return ok ? NextResponse.json({ ok }) : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
