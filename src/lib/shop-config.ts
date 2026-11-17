import "server-only";
import type { ShopConfig } from "./shop";

/** Configuración de tienda leída del entorno (Easypanel → Entorno). */
export function shopConfig(): ShopConfig {
  const domain = (process.env.AMAZON_DOMAIN || "amazon.com").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  const tag = process.env.AMAZON_TAG?.trim();
  return { amazonDomain: domain || "amazon.com", amazonTag: tag || undefined };
}
