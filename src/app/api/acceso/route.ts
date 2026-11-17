import { NextResponse } from "next/server";
import { adminToken, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  const { clave } = (await req.json().catch(() => ({}))) as { clave?: string };
  if (!password) return NextResponse.json({ ok: true });
  if (clave !== password) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await adminToken(password), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
