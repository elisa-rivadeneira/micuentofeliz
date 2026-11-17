import type { Metadata } from "next";
import { getSnapshot } from "@/lib/db";
import { buildLinks } from "@/lib/graph";
import { ConnectionsMap } from "@/components/ConnectionsMap";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Conexiones" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function ConexionesPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const focus = typeof sp.foco === "string" ? sp.foco : undefined;
  const { universes, entries } = await getSnapshot();
  const links = buildLinks(entries);
  return (
    <main className="connections">
      <div className="explore__sky" aria-hidden />
      <div className="wrap wrap--wide">
        <header className="page-head page-enter">
          <div className="ornament" aria-hidden><span /><i>✦</i><span /></div>
          <h1 className="display">El tejido</h1>
          <p className="lead">Tu conocimiento como constelación. Toca una estrella para ver sus hilos, o traza un camino entre dos.</p>
        </header>
        <ConnectionsMap entries={entries} universes={universes} links={links} focusId={focus} />
      </div>
    </main>
  );
}
