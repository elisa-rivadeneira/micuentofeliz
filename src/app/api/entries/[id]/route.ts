import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteEntry, patchEntry, updateEntry } from "@/lib/db";
import type { EntryInput, EntryPatch } from "@/lib/types";
import { CONTENT_TYPES } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json()) as EntryInput;
  if (!body?.title?.trim()) return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  if (!CONTENT_TYPES.includes(body.type)) return NextResponse.json({ error: "Tipo de contenido no válido" }, { status: 400 });
  const entry = await updateEntry(id, body);
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(entry);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteEntry(id);
  revalidatePath("/", "layout");
  return ok ? NextResponse.json({ ok }) : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

/** Cambios rápidos: estado, guardado, valoración o evidencia. */
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as EntryPatch;
  const allowed: EntryPatch = {};
  for (const k of ["status", "saved", "rating", "evidence"] as const) if (k in body) (allowed as Record<string, unknown>)[k] = body[k];
  const entry = await patchEntry(id, allowed);
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(entry);
}
