import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEntry, getEntries } from "@/lib/db";
import type { EntryInput } from "@/lib/types";
import { CONTENT_TYPES } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getEntries());
}

export async function POST(req: Request) {
  const body = (await req.json()) as EntryInput;
  if (!body?.title?.trim()) return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
  if (!CONTENT_TYPES.includes(body.type)) return NextResponse.json({ error: "Tipo de contenido no válido" }, { status: 400 });
  const entry = await createEntry(body);
  revalidatePath("/", "layout");
  return NextResponse.json(entry, { status: 201 });
}
