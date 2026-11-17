"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

export default function Acceso() {
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const enter = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/acceso", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave }) });
    if (!res.ok) return setError("Esa no es la llave.");
    const back = new URLSearchParams(window.location.search).get("volver");
    window.location.href = back && back.startsWith("/admin") ? back : "/admin";
  };
  return (
    <form onSubmit={enter} className="login page-enter">
      <KeyRound size={34} strokeWidth={1.3} />
      <h1 className="display">La llave del taller</h1>
      <input type="password" autoFocus value={clave} onChange={(e) => setClave(e.target.value)} className="input" placeholder="Contraseña" aria-label="Contraseña" />
      {error && <p className="error">{error}</p>}
      <button className="btn btn--gold">Entrar</button>
    </form>
  );
}
