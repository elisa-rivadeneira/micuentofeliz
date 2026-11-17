import Link from "next/link";
import { ArrowRight, BookOpen, Search, Layers, Sprout, ChevronRight, Home, Notebook, ChefHat, Clapperboard } from "lucide-react";
import type { Entry, SectionKey, Universe } from "@/lib/types";
import { SECTIONS, inSection } from "@/lib/sections";
import { HubBackdrop } from "./HubBackdrop";
import { SectionArt, type ArtImage } from "./SectionArt";
import { HubEmblem } from "./HubEmblem";
import { LibraryCard } from "./LibraryCard";
import { shopConfig } from "@/lib/shop-config";
import "./hub.css";

const STEP_ICONS = [BookOpen, Search, Layers, Sprout];
const STEP_TONES = ["violeta", "verde", "naranja", "verde"];
/** A qué sección lleva cada paso del recorrido (por nombre). */
const STEP_TARGET: Record<string, SectionKey> = { aprender: "videoteca", entender: "biblioteca", decidir: "biblioteca", practicar: "recetas" };
const SECTION_ICONS: Record<SectionKey, typeof BookOpen> = { videoteca: Clapperboard, biblioteca: BookOpen, recetas: ChefHat };

export function hubTitle(u: Universe) {
  return [u.hub?.title || u.name, u.hub?.highlight].filter(Boolean).join(" ");
}

export interface HubVisuals {
  dawn?: string;
  lake?: string;
  /** Ilustraciones por sección (public/images/hub/<seccion>.webp). */
  art: Partial<Record<SectionKey, ArtImage>>;
}

export function LearningHub({ universe: u, entries, visuals }: { universe: Universe; entries: Entry[]; visuals: HubVisuals }) {
  const hub = u.hub!;
  const sections = hub.sections.map((k) => SECTIONS[k]);
  const counts = Object.fromEntries(sections.map((s) => [s.key, entries.filter((e) => inSection(e, u.id, s)).length]));
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Continuar: lo que estás viendo; si no hay, lo último añadido a la videoteca.
  const lib = hub.sections.includes("videoteca") ? entries.filter((e) => inSection(e, u.id, SECTIONS.videoteca)) : [];
  const watching = lib.filter((e) => e.status === "viendo");
  const shelf = (watching.length ? watching : lib).slice(0, 3);

  return (
    <main className={`hub ${visuals.lake && !visuals.dawn ? "hub--glass" : ""}`}>
      <HubBackdrop dawn={visuals.dawn} lake={visuals.lake} />
      <div className="hub__wrap">
        <nav className="crumbs" aria-label="Ruta">
          <Link href="/jardin"><Home size={14} /> Jardines</Link>
          <ChevronRight size={14} aria-hidden />
          <span aria-current="page">{hubTitle(u)}</span>
        </nav>

        <header className="hub__head">
          <HubEmblem symbol={u.symbol} />
          <div>
            <h1 className="hub__title">
              {hub.title || u.name} {hub.highlight && <span>{hub.highlight}</span>}
            </h1>
            <p className="hub__subtitle">{hub.subtitle || u.description}</p>
          </div>
        </header>

        {hub.journey && hub.journey.length > 0 && (
          <ol className="journey" aria-label="Recorrido">
            {hub.journey.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              const target = STEP_TARGET[norm(step)];
              const href = target && hub.sections.includes(target) ? `/universo/${u.slug}/${target}` : undefined;
              const inner = (
                <>
                  <Icon className={`journey__icon journey__icon--${STEP_TONES[i % STEP_TONES.length]}`} size={30} strokeWidth={1.6} />
                  <span>{step}</span>
                </>
              );
              return (
                <li key={step + i} className="journey__step">
                  {href ? <Link href={href}>{inner}</Link> : <span className="journey__static">{inner}</span>}
                  {i < hub.journey!.length - 1 && <ChevronRight className="journey__sep" size={22} strokeWidth={2} aria-hidden />}
                </li>
              );
            })}
          </ol>
        )}

        <div className="hub__sections">
          {sections.map((s, i) => {
            const Icon = SECTION_ICONS[s.key];
            return (
              <Link key={s.key} href={`/universo/${u.slug}/${s.key}`} className={`hcard hcard--${s.tone}`} style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                <span className="hcard__art"><SectionArt section={s.key} art={visuals.art[s.key]} /></span>
                <span className="hcard__title"><Icon size={28} strokeWidth={1.6} /> {s.label}</span>
                <span className="hcard__desc">{s.description}</span>
                <span className="hcard__count" title={`${counts[s.key]} piezas`}>{counts[s.key]}</span>
                <span className="hcard__go" aria-hidden><ArrowRight size={22} strokeWidth={2} /></span>
              </Link>
            );
          })}
        </div>

        {shelf.length > 0 && (
          <section className="hub__shelf">
            <div className="hub__shelf-head">
              <h2>{watching.length ? "Continúa donde lo dejaste" : "Lo último en tu videoteca"}</h2>
              <Link href={`/universo/${u.slug}/videoteca`} className="hub__more">Ver videoteca <ArrowRight size={15} /></Link>
            </div>
            <div className="lib-grid">
              {shelf.map((e) => <LibraryCard key={e.id} entry={e} shop={shopConfig()} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
