import type { ContentType, Entry } from "./types";

/**
 * Enlaces para conseguir un libro: comprarlo (Amazon) o pedirlo prestado
 * (archive.org). Si la pieza no tiene un enlace propio, se ofrece una búsqueda
 * con el título y el autor.
 *
 * Afiliados: si se define AMAZON_TAG (programa Amazon Afiliados), se añade
 * automáticamente ?tag=... a todos los enlaces de Amazon.
 */

export interface ShopConfig {
  /** Tienda de Amazon, p. ej. "amazon.com", "amazon.es", "amazon.com.mx". */
  amazonDomain: string;
  /** Etiqueta de afiliado de Amazon Afiliados (opcional). */
  amazonTag?: string;
}

export interface ShopLink {
  url: string;
  /** true si es una búsqueda (la pieza aún no tiene enlace propio). */
  isSearch: boolean;
  /** true si el enlace lleva etiqueta de afiliado (rel="sponsored"). */
  sponsored: boolean;
}

/** Tipos para los que se muestran los botones de comprar / pedir prestado. */
export const BOOK_TYPES: ContentType[] = ["libro"];

export const AFFILIATE_NOTICE = "Como afiliada de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.";

function isAmazon(url: URL) {
  return /(^|\.)amazon\./i.test(url.hostname) || /(^|\.)amzn\./i.test(url.hostname);
}

/** Añade (o reemplaza) la etiqueta de afiliado en un enlace de Amazon. */
export function withAffiliateTag(raw: string, tag?: string): string {
  if (!tag) return raw;
  try {
    const u = new URL(raw);
    // Los enlaces cortos amzn.to ya llevan la etiqueta de quien los generó: no se tocan.
    if (!isAmazon(u) || /(^|\.)amzn\./i.test(u.hostname)) return raw;
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return raw;
  }
}

function query(e: Pick<Entry, "title" | "author">) {
  return [e.title, e.author].filter(Boolean).join(" ");
}

export function buyLink(e: Pick<Entry, "title" | "author" | "buyUrl">, cfg: ShopConfig): ShopLink {
  const base = e.buyUrl || `https://www.${cfg.amazonDomain}/s?k=${encodeURIComponent(query(e))}&i=stripbooks`;
  let amazon = false;
  try { amazon = isAmazon(new URL(base)); } catch {}
  return { url: withAffiliateTag(base, cfg.amazonTag), isSearch: !e.buyUrl, sponsored: amazon && Boolean(cfg.amazonTag) };
}

export function borrowLink(e: Pick<Entry, "title" | "author" | "borrowUrl">): ShopLink {
  return {
    url: e.borrowUrl || `https://archive.org/search?query=${encodeURIComponent(query(e))}`,
    isSearch: !e.borrowUrl,
    sponsored: false,
  };
}

export function hasShopLinks(e: Pick<Entry, "type" | "buyUrl" | "borrowUrl">): boolean {
  return BOOK_TYPES.includes(e.type) || Boolean(e.buyUrl || e.borrowUrl);
}

/** Enlaces de búsqueda para el formulario (ayudan a encontrar el enlace exacto). */
export function searchUrls(e: Pick<Entry, "title" | "author">, amazonDomain = "amazon.com") {
  const q = encodeURIComponent(query(e));
  return {
    amazon: `https://www.${amazonDomain}/s?k=${q}&i=stripbooks`,
    archive: `https://archive.org/search?query=${q}`,
    openLibrary: `https://openlibrary.org/search?q=${q}`,
  };
}
