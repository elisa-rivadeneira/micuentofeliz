import type { Metadata } from "next";
import { getSnapshot } from "@/lib/db";
import { Explorer } from "@/components/Explorer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Explorar" };

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function ExplorarPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined)) ?? "";
  const { universes, entries } = await getSnapshot();
  return (
    <main className="explore">
      <div className="explore__sky" aria-hidden />
      <div className="wrap">
        <header className="page-head page-enter">
          <div className="ornament" aria-hidden><span /><i>✦</i><span /></div>
          <h1 className="display">Explorar la biblioteca</h1>
          <p className="lead">Todas las piezas del jardín. Busca, filtra o sigue una etiqueta.</p>
        </header>
        <Explorer
          entries={entries}
          universes={universes}
          initial={{ q: one("q"), tag: one("etiqueta"), type: one("tipo"), universe: one("universo"), focus: one("buscar") === "1" }}
        />
      </div>
    </main>
  );
}
