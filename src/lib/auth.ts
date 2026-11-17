export const ADMIN_COOKIE = "mcf_admin";

/** Token derivado de la contraseña (no se guarda la contraseña en la cookie). */
export async function adminToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`mi-cuento-feliz::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
