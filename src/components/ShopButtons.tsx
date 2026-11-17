import { ShoppingCart, Library } from "lucide-react";
import type { Entry } from "@/lib/types";
import { buyLink, borrowLink, type ShopConfig } from "@/lib/shop";

/** Botones "Comprar" (Amazon) y "Préstamo" (archive.org) de un libro. */
export function ShopButtons({ entry, shop, compact }: { entry: Pick<Entry, "title" | "author" | "buyUrl" | "borrowUrl">; shop: ShopConfig; compact?: boolean }) {
  const buy = buyLink(entry, shop);
  const borrow = borrowLink(entry);
  return (
    <div className={`shop ${compact ? "shop--compact" : ""}`}>
      <a
        href={buy.url}
        target="_blank"
        rel={buy.sponsored ? "sponsored noopener noreferrer" : "noopener noreferrer"}
        className="shop__btn shop__btn--buy"
        title={buy.isSearch ? "Buscar este libro en Amazon" : "Comprar en Amazon"}
      >
        <ShoppingCart size={compact ? 14 : 17} /> {compact ? "Comprar" : buy.isSearch ? "Buscar en Amazon" : "Comprar en Amazon"}
      </a>
      <a
        href={borrow.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shop__btn shop__btn--borrow"
        title={borrow.isSearch ? "Buscar este libro en archive.org" : "Pedir prestado en archive.org"}
      >
        <Library size={compact ? 14 : 17} /> {compact ? "Préstamo" : borrow.isSearch ? "Buscar en archive.org" : "Pedir prestado en archive.org"}
      </a>
    </div>
  );
}
