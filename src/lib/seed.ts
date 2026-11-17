import type { Database, Entry, GardenId, HubConfig, Universe } from "./types";
import nutricion from "./seed-nutricion.json";

/**
 * Contenido semilla: los nueve universos iniciales y algunas piezas de ejemplo
 * que muestran cómo se teje el conocimiento. Todo se puede editar o borrar
 * desde el área privada (/admin).
 */

const T0 = Date.parse("2026-11-01T20:00:00.000Z");
const at = (i: number) => new Date(T0 + i * 3600_000 * 7).toISOString();

type U = Omit<Universe, "gardenId" | "createdAt" | "updatedAt">;

const UNIVERSES: U[] = [
  {
    id: "u_sabiduria", slug: "sabiduria-y-espiritualidad", name: "Sabiduría y espiritualidad",
    tagline: "El silencio que guarda las respuestas",
    description: "Tradiciones, maestros, prácticas y preguntas que no caben en una sola vida. Un templo de luz violeta donde lo invisible tiene lugar.",
    color: "#b58cff", glow: "#e6d2ff", symbol: "loto", doorStyle: "lobulado", order: 1,
  },
  {
    id: "u_historias", slug: "historias-y-literatura", name: "Historias y literatura",
    tagline: "Cuentos que encienden faroles",
    description: "Cuentos, relatos, personajes y mundos. Lo que leo, lo que escribo y lo que alguien me contó una noche.",
    color: "#f0b75e", glow: "#ffe1a8", symbol: "libro", doorStyle: "medio-punto", order: 2,
  },
  {
    id: "u_poesia", slug: "poesia-y-musica", name: "Poesía y música",
    tagline: "Donde el aliento se vuelve canto",
    description: "Versos, canciones, ritmos y sonidos. La palabra que respira y la música que dice lo que no se puede decir.",
    color: "#ff7fbf", glow: "#ffd0e8", symbol: "musica", doorStyle: "herradura", order: 3,
  },
  {
    id: "u_ciencia", slug: "ciencia-y-descubrimientos", name: "Ciencia y descubrimientos",
    tagline: "Preguntar al universo con paciencia",
    description: "Física, biología, cosmos y la maravilla de entender cómo funcionan las cosas.",
    color: "#5ec8ff", glow: "#c8ecff", symbol: "atomo", doorStyle: "medio-punto", order: 4,
  },
  {
    id: "u_tecnologia", slug: "tecnologia-e-inteligencia-artificial", name: "Tecnología e inteligencia artificial",
    tagline: "Herramientas que piensan con nosotros",
    description: "Código, máquinas, inteligencia artificial y las nuevas formas de crear y conocer.",
    color: "#56e3c4", glow: "#c6fff0", symbol: "chip", doorStyle: "cerradura", order: 5,
  },
  {
    id: "u_naturaleza", slug: "naturaleza-y-vida", name: "Naturaleza y vida",
    tagline: "Raíces, estaciones y criaturas",
    description: "Bosques, animales, ciclos y la vida que se abre paso. El jardín que nos enseña a habitar.",
    color: "#7fd67a", glow: "#d6ffcf", symbol: "hoja", doorStyle: "ojival", order: 6,
  },
  {
    id: "u_nutricion", slug: "bienestar", name: "Bienestar y estilo de vida",
    tagline: "Cuerpo, mente y hábitos que nos sostienen",
    description: "Nutrición, movimiento, descanso y calma: hábitos para vivir más y mejor. Empezamos por la nutrición.",
    color: "#a6e04f", glow: "#effcc4", symbol: "fruta", doorStyle: "medio-punto", order: 7,
    hub: nutricion.hub as HubConfig,
  },
  {
    id: "u_arte", slug: "arte-y-creatividad", name: "Arte y creatividad",
    tagline: "El color de lo que aún no existe",
    description: "Pintura, imagen, diseño y todo gesto creativo. Mis obras y las de quienes me inspiran.",
    color: "#ff9a5c", glow: "#ffd9bf", symbol: "paleta", doorStyle: "lobulado", order: 8,
  },
  {
    id: "u_ideas", slug: "ideas-y-proyectos", name: "Ideas y proyectos",
    tagline: "Semillas esperando su estación",
    description: "Lo que estoy construyendo, lo que sueño construir y las chispas que todavía no tienen forma.",
    color: "#ffd84d", glow: "#fff2b8", symbol: "bombilla", doorStyle: "ojival", order: 9,
  },
  {
    id: "u_biblioteca", slug: "mi-biblioteca-de-inspiraciones", name: "Mi biblioteca de inspiraciones",
    tagline: "Los libros, voces y lugares que me formaron",
    description: "Libros, autores, enlaces, películas y referencias que vuelvo a visitar.",
    color: "#9aa8ff", glow: "#dde2ff", symbol: "biblioteca", doorStyle: "herradura", order: 10,
  },
];

type E = Omit<Entry, "gardenId" | "createdAt" | "updatedAt" | "media"> & { media?: Entry["media"] };

const ENTRIES: E[] = [
  {
    id: "e_rumi", slug: "rumi", title: "Rumi", type: "libro",
    summary: "Poeta y místico persa del siglo XIII. Su Masnavi empieza con una flauta de caña que llora.",
    author: "Yalal ad-Din Muhammad Rumi", source: "Masnavi (s. XIII)",
    body: `Rumi nació en 1207 en Balj y vivió la mayor parte de su vida en Konya. Su encuentro con el derviche **Shams de Tabriz** transformó a un erudito en poeta.

Su obra mayor, el *Masnavi*, tiene más de veinticinco mil versos. Empieza con una imagen sencilla y enorme: una flauta hecha de caña que canta porque la arrancaron del cañaveral.

> Todo lo que buscas te está buscando.

**Por qué está en mi jardín:** porque me enseñó que la nostalgia también es una brújula.`,
    universeIds: ["u_sabiduria", "u_biblioteca"],
    tags: ["rumi", "sufismo", "mística", "inspiración"],
    relatedIds: ["e_canto_cana"],
    featured: true,
  },
  {
    id: "e_canto_cana", slug: "el-canto-de-la-cana", title: "El canto de la caña", type: "poema",
    summary: "Los primeros versos del Masnavi, en una versión libre: la flauta que canta su separación.",
    author: "Rumi (versión libre)",
    body: `Escucha a la caña, cómo cuenta su historia,
cómo se lamenta de la separación:

*Desde que me arrancaron del cañaveral,
mi queja hace llorar a hombres y mujeres.*

*Busco un pecho desgarrado por la ausencia
para contarle el dolor del deseo.*

*Quien queda lejos de su origen
busca el día de volver a unirse.*

---

La flauta suena porque está vacía y porque recuerda. Es una imagen del alma, pero también de la música: el aliento atraviesa un hueco y se vuelve canto.`,
    universeIds: ["u_poesia", "u_sabiduria"],
    tags: ["rumi", "ney", "música", "nostalgia", "aliento"],
    relatedIds: ["e_rumi", "e_ney"],
    featured: true,
  },
  {
    id: "e_ney", slug: "la-flauta-ney", title: "La flauta ney: aliento que se vuelve música", type: "cancion",
    summary: "Una caña con siete agujeros y una tradición de mil años. Notas sobre su sonido.",
    body: `El **ney** es una flauta de caña de la tradición persa, turca y árabe. No tiene boquilla: el sonido nace del borde y del aliento del intérprete, por eso suena tan cercano a una voz.

En las ceremonias de los derviches giróvagos el ney abre el *sema*, y muchos músicos dicen que se toca "con el corazón más que con los pulmones".

**Para escuchar:** busca grabaciones de *ney taksim* (improvisaciones). Puedes adjuntar aquí audios o videos tuyos desde el área privada.`,
    universeIds: ["u_poesia"],
    tags: ["música", "ney", "aliento", "inspiración"],
    relatedIds: ["e_canto_cana", "e_inspiracion"],
  },
  {
    id: "e_inspiracion", slug: "que-es-la-inspiracion", title: "¿Qué es la inspiración?", type: "reflexion",
    summary: "Inspirar es, literalmente, tomar aire. Tal vez crear sea solo devolverlo con forma.",
    body: `*Inspirar* viene del latín *in-spirare*: soplar dentro. Antes de ser una idea, la inspiración fue aliento.

La caña de Rumi no canta por sí misma: alguien sopla. Me gusta pensar que crear es parecido. Uno se vacía un poco, deja pasar el aire, y algo suena.

Preguntas que quiero seguir:

- ¿Qué me inspira cuando no estoy buscando inspiración?
- ¿Qué tienen en común un poema, una ecuación y un jardín?
- ¿Cómo se ve mi propio cañaveral?`,
    universeIds: ["u_sabiduria", "u_arte"],
    tags: ["inspiración", "creatividad", "aliento"],
    relatedIds: ["e_ney", "e_mi_cuento_feliz"],
  },
  {
    id: "e_mi_cuento_feliz", slug: "mi-cuento-feliz", title: "Mi Cuento Feliz", type: "proyecto",
    summary: "Un jardín de puertas donde mi conocimiento forma un tejido en lugar de una lista.",
    body: `**Primero una semilla. Después un jardín. Y algún día, un bosque entero.**

## Fase 1 — Mi universo personal
Un lugar para reunir historias, ideas, conocimientos y creaciones, y descubrir los hilos que los unen.

## Lo que viene
- Habitarlo y llenarlo de contenido.
- Probar cómo se siente explorar mis propios conocimientos.
- Algún día: *El Mundo Compartido*, donde otras personas tengan sus jardines.`,
    universeIds: ["u_ideas", "u_tecnologia"],
    tags: ["jardín", "tejido", "proyecto", "conocimiento"],
    relatedIds: ["e_inspiracion", "e_zettelkasten", "e_mapa_lecturas"],
    featured: true,
  },
  {
    id: "e_zettelkasten", slug: "zettelkasten-pensar-en-red", title: "Zettelkasten: pensar en red", type: "articulo",
    summary: "El fichero de Niklas Luhmann: 90.000 notas conectadas que conversaban con su autor.",
    author: "Sobre Niklas Luhmann",
    body: `El sociólogo Niklas Luhmann escribió decenas de libros con ayuda de un fichero de notas — el *Zettelkasten* — en el que cada ficha remitía a otras.

La clave no era guardar, sino **conectar**: una nota nueva se colocaba junto a aquella con la que dialogaba, y se anotaban referencias cruzadas.

Ideas que tomo para mi jardín:

1. Una idea por pieza.
2. Cada pieza enlaza con al menos otra.
3. Las etiquetas son caminos, no cajones.`,
    universeIds: ["u_tecnologia", "u_biblioteca", "u_ideas"],
    tags: ["conocimiento", "tejido", "notas", "red"],
    relatedIds: ["e_mi_cuento_feliz", "e_micorrizas"],
  },
  {
    id: "e_micorrizas", slug: "la-red-micorricica", title: "La red micorrícica: el internet del bosque", type: "articulo",
    summary: "Bajo tierra, hongos y raíces forman una red por la que los árboles intercambian agua, azúcares y señales.",
    body: `Las **micorrizas** son asociaciones entre hongos y raíces de plantas. Los hilos del hongo (hifas) se extienden por el suelo y conectan árboles entre sí.

Por esa red viajan agua, nutrientes y, según algunas investigaciones, señales químicas. La investigadora **Suzanne Simard** popularizó la idea de los "árboles madre" que sostienen a los más jóvenes; hoy parte de esas conclusiones se discuten, pero la red existe y es asombrosa.

Un bosque no es una colección de árboles: es un tejido.`,
    universeIds: ["u_naturaleza", "u_ciencia"],
    tags: ["red", "árboles", "tejido", "hongos"],
    relatedIds: ["e_zettelkasten", "e_arbol_umbral", "e_redes_neuronales"],
  },
  {
    id: "e_arbol_umbral", slug: "el-arbol-al-otro-lado-de-la-puerta", title: "El árbol al otro lado de la puerta", type: "reflexion",
    summary: "En casi todas las tradiciones hay un árbol en el centro del mundo. En mi jardín está detrás del portal.",
    body: `El árbol del mundo aparece en muchas culturas: Yggdrasil en el norte, el ceiba maya, el árbol de la vida en tantas otras.

Une tres planos: las raíces bajo la tierra, el tronco en el mundo de los vivos, la copa en el cielo.

En la entrada de este jardín, el árbol brilla al otro lado de la puerta. No hay que llegar a él. Basta con saber que está ahí y que cada universo es una rama.`,
    universeIds: ["u_sabiduria", "u_naturaleza", "u_historias"],
    tags: ["árboles", "umbral", "símbolos"],
    relatedIds: ["e_micorrizas", "e_guardiana"],
  },
  {
    id: "e_guardiana", slug: "la-gata-que-custodiaba-la-puerta", title: "La gata que custodiaba la puerta", type: "historia",
    summary: "Un cuento breve: nadie sabía si la gata negra cuidaba la puerta o esperaba a alguien.",
    body: `Cada noche, cuando los faroles se encendían solos, la gata negra subía los escalones y se sentaba frente al portal.

Los visitantes del jardín creían que lo custodiaba. Algunos le pedían permiso para pasar; otros le dejaban pequeñas ofrendas: un hilo de lana, una hoja seca, un poema doblado en cuatro.

Ella nunca impedía el paso. Solo miraba el árbol luminoso, como quien recuerda algo.

Una noche alguien le preguntó qué esperaba. La gata giró la cabeza, parpadeó despacio y volvió a mirar la luz.

*— Que alguien entre con una historia nueva* — dijeron después que había dicho. Pero eso ya es otra historia.`,
    universeIds: ["u_historias"],
    tags: ["cuento", "umbral", "gato", "noche"],
    relatedIds: ["e_arbol_umbral", "e_luna_creciente"],
    featured: true,
  },
  {
    id: "e_luciernagas", slug: "por-que-brillan-las-luciernagas", title: "Por qué brillan las luciérnagas", type: "articulo",
    summary: "Bioluminiscencia: luz fría producida por una reacción química casi perfecta.",
    body: `Las luciérnagas producen luz gracias a la **luciferina**, una molécula que reacciona con oxígeno con ayuda de la enzima **luciferasa**.

Es una de las fuentes de luz más eficientes que se conocen: casi toda la energía se convierte en luz y apenas en calor.

Cada especie tiene su propio patrón de destellos: son mensajes de cortejo. Un jardín de noche está lleno de conversaciones que no entendemos.`,
    universeIds: ["u_ciencia", "u_naturaleza"],
    tags: ["luz", "bioluminiscencia", "noche", "insectos"],
    relatedIds: ["e_luna_creciente"],
  },
  {
    id: "e_redes_neuronales", slug: "redes-neuronales-como-un-jardin", title: "Redes neuronales explicadas como un jardín", type: "articulo",
    summary: "Conexiones que se refuerzan con el uso: una metáfora para entender cómo aprende una IA.",
    body: `Una red neuronal artificial es un conjunto de nodos conectados. Cada conexión tiene un **peso**: un número que dice cuánto importa esa conexión.

Aprender consiste en ajustar esos pesos poco a poco, comparando lo que la red predice con lo que debería predecir.

**La metáfora del jardín:** los senderos que más se recorren se vuelven caminos claros; los que nadie pisa se cubren de hierba. No es exacto, pero ayuda a imaginarlo.`,
    universeIds: ["u_tecnologia", "u_ciencia"],
    tags: ["ia", "red", "aprendizaje", "conocimiento"],
    relatedIds: ["e_micorrizas"],
  },
  {
    id: "e_luna_creciente", slug: "luna-creciente", title: "Luna creciente", type: "poema",
    summary: "Un poema breve sobre la luz que todavía no está completa.",
    body: `No es media luna,
es una luna que empieza.

Una uña de luz
rascando la noche
para ver qué hay detrás.

Yo también estoy creciendo
por el lado que no se ve.`,
    universeIds: ["u_poesia"],
    tags: ["luna", "noche", "luz", "crecer"],
    relatedIds: ["e_guardiana", "e_luciernagas"],
  },
  {
    id: "e_paleta_noche", slug: "paleta-de-la-noche", title: "Paleta de la noche: índigo, violeta y oro", type: "imagen",
    summary: "Estudio de color del jardín: los fríos de la noche y los cálidos de los faroles.",
    cover: "/images/jardin.webp",
    body: `La noche del jardín no es negra: es **índigo** profundo, con **violetas** en las flores y **oro** en cada fuente de luz.

- Índigo: #141a4a
- Azul profundo: #1d2b6b
- Violeta: #8f4fd8
- Oro: #f5c879

El contraste entre fríos y cálidos es lo que hace que la puerta parezca un lugar al que se quiere entrar.`,
    universeIds: ["u_arte"],
    tags: ["color", "noche", "luz", "diseño"],
    relatedIds: ["e_mi_cuento_feliz"],
    media: [{ id: "m_paleta", kind: "imagen", url: "/images/jardin.webp", caption: "El jardín nocturno" }],
  },
  {
    id: "e_gutenberg", slug: "proyecto-gutenberg", title: "Proyecto Gutenberg", type: "enlace",
    summary: "Más de 70.000 libros de dominio público, libres para leer y descargar.",
    externalUrl: "https://www.gutenberg.org",
    body: `Una biblioteca enorme y gratuita de clásicos en dominio público. Ideal para encontrar traducciones antiguas de Rumi, cuentos tradicionales y textos científicos históricos.`,
    universeIds: ["u_biblioteca", "u_historias"],
    tags: ["libros", "dominio público", "biblioteca"],
    relatedIds: ["e_rumi"],
  },
  {
    id: "e_mapa_lecturas", slug: "un-mapa-de-lecturas-que-florece", title: "Un mapa de lecturas que florece", type: "idea",
    summary: "¿Y si cada libro terminado hiciera crecer una flor en el jardín?",
    body: `Idea para más adelante: cada libro o referencia que agrego a la biblioteca podría aparecer como una flor en el jardín. Los que más conexiones tienen, más grandes.

Por ahora queda aquí, como semilla.`,
    universeIds: ["u_ideas", "u_biblioteca"],
    tags: ["jardín", "libros", "idea"],
    relatedIds: ["e_mi_cuento_feliz"],
  },
];

// Biblioteca, apuntes y recetas de ejemplo para Nutrición (compartidos con scripts/).
for (const n of nutricion.entries) {
  ENTRIES.push({ ...(n as unknown as E), universeIds: ["u_nutricion"], relatedIds: (n as { relatedIds?: string[] }).relatedIds ?? [] });
}

export function buildSeed(gardenId: GardenId): Database {
  const now = new Date().toISOString();
  return {
    version: 1,
    gardens: [{ id: gardenId, name: "Mi Cuento Feliz", ownerName: "Yo", createdAt: now }],
    universes: UNIVERSES.map((u, i) => ({ ...u, gardenId, createdAt: at(i), updatedAt: at(i) })),
    entries: ENTRIES.map((e, i) => ({ media: [], ...e, gardenId, createdAt: at(i + 10), updatedAt: at(i + 10) })),
  };
}
