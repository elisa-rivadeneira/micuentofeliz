import { Lotus } from "../Lotus";

export function GardenHeader() {
  return (
    <header className="gh">
      <p className="gh__kicker"><span aria-hidden />El jardín de las puertas<span aria-hidden /></p>
      <h1 className="gh__title">Explora nuestros universos</h1>
      <p className="gh__desc">Historias, saberes, naturaleza, arte y mucho más, conectados en un solo jardín.</p>
      <div className="gh__ornament" aria-hidden>
        <span />
        <Lotus size={30} />
        <span />
      </div>
    </header>
  );
}
