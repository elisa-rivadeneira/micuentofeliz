import { NextResponse, type NextRequest } from "next/server";
import { adminToken, ADMIN_COOKIE } from "@/lib/auth";

/**
 * Protección mínima del área privada.
 * Si ADMIN_PASSWORD no está definida, todo queda abierto (uso en localhost).
 * Si lo está, /admin y las rutas /api de escritura piden la contraseña una vez.
 */
export async function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname === "/admin/acceso" || pathname === "/api/acceso") return NextResponse.next();
  // Las lecturas públicas de la API (p. ej. novedades) no requieren llave.
  if (pathname.startsWith("/api/") && req.method === "GET") return NextResponse.next();

  const ok = req.cookies.get(ADMIN_COOKIE)?.value === (await adminToken(password));
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/acceso";
  url.searchParams.set("volver", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
