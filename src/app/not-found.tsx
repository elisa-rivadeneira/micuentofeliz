import Link from "next/link";

export default function NotFound() {
  return (
    <main className="explore">
      <div className="explore__sky" aria-hidden />
      <div className="wrap wrap--narrow page-head" style={{ paddingTop: "28vh", textAlign: "center" }}>
        <h1 className="display">Este sendero se perdió en la niebla</h1>
        <p className="lead">La página que buscas no existe, o quizás todavía no ha florecido.</p>
        <p><Link href="/jardin" className="btn btn--gold">Volver al jardín</Link></p>
      </div>
    </main>
  );
}
