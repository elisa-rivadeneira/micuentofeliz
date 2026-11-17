"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Search, Menu, X, Compass, Network, Sprout, Feather, Bell } from "lucide-react";
import { Lotus } from "./Lotus";

const LINKS = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/explorar", label: "Explorar", Icon: Compass },
  { href: "/jardin", label: "Jardines", Icon: Sprout },
  { href: "/conexiones", label: "Conexiones", Icon: Network },
  { href: "/admin", label: "Crear", Icon: Feather },
];

interface Novedad { id: string; slug: string; title: string; updatedAt: string; isNew: boolean }

const SEEN_KEY = "mcf:novedades-vistas";

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/jardin") return path.startsWith("/jardin") || path.startsWith("/universo") || path.startsWith("/mundo");
  return path.startsWith(href);
}

/** Campana: novedades del propio jardín (piezas creadas o editadas recientemente). */
function Notifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Novedad[]>([]);
  const [seen, setSeen] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setSeen(localStorage.getItem(SEEN_KEY) ?? ""); } catch {}
    fetch("/api/novedades").then((r) => (r.ok ? r.json() : [])).then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  const unread = items.some((i) => i.updatedAt > seen);
  const toggle = () => {
    setOpen((o) => !o);
    if (items[0]) {
      try { localStorage.setItem(SEEN_KEY, items[0].updatedAt); } catch {}
      setSeen(items[0].updatedAt);
    }
  };

  return (
    <div className="notif" ref={ref}>
      <button className="nav__icon" onClick={toggle} aria-label="Novedades del jardín" aria-expanded={open}>
        <Bell size={20} strokeWidth={1.6} />
        {unread && <span className="notif__dot" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="notif__panel" initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            <p className="notif__title">Novedades de tu jardín</p>
            {items.length === 0 && <p className="notif__empty">Aún no hay movimiento.</p>}
            <ul>
              {items.map((i) => (
                <li key={i.id}>
                  <Link href={`/contenido/${i.slug}`} onClick={() => setOpen(false)}>
                    <span>{i.title}</span>
                    <small>{i.isNew ? "Sembrada" : "Actualizada"} · {new Date(i.updatedAt).toLocaleDateString("es", { day: "numeric", month: "short" })}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteNav() {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glass = path === "/jardin";
  return (
    <header className={`nav ${scrolled || path !== "/" ? "nav--solid" : ""} ${glass ? "nav--glass" : ""} ${path.startsWith("/admin") ? "nav--admin" : ""}`}>
      <Link href="/" className="nav__brand" aria-label="Mi Cuento Feliz, inicio">
        <Lotus size={46} className="nav__lotus" />
        <span>
          <span className="nav__title">Mi Cuento Feliz</span>
          <span className="nav__subtitle">Un Universo de Historias Compartidas</span>
        </span>
      </Link>

      <nav className={`nav__links ${open ? "is-open" : ""}`} aria-label="Principal">
        {LINKS.map(({ href, label, Icon }) => {
          const active = isActive(path, href);
          return (
            <Link key={href} href={href} className={`nav__link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
              {active && <Icon size={18} strokeWidth={1.6} aria-hidden />}
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="nav__actions">
        <Link href="/explorar?buscar=1" className="nav__icon" aria-label="Buscar">
          <Search size={20} strokeWidth={1.6} />
        </Link>
        <Notifications />
        <Link href="/admin" className="nav__avatar" aria-label="Mi área privada" title="Mi área privada">
          <span />
        </Link>
        <button className="nav__icon nav__burger" onClick={() => setOpen((o) => !o)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
