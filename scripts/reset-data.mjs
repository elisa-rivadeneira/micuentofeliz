// Borra la base de datos local para que se regenere con el contenido semilla.
import { rmSync, existsSync } from "node:fs";
const p = new URL("../data/db.json", import.meta.url);
if (existsSync(p)) { rmSync(p); console.log("data/db.json eliminado. Se regenerará al iniciar."); }
else console.log("No había base de datos local.");
