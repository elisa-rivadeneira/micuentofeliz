# Mi Cuento Feliz — Fase 1: mi universo personal

Un jardín nocturno de puertas que conducen a mis universos: historias, ideas, conocimientos y creaciones que se entretejen.

> Primero una semilla. Después un jardín. Y algún día, un bosque entero.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:3000
```

Versión optimizada: `npm run build && npm start`.

## Recorrido

| Ruta | Qué es |
|---|---|
| `/` | Portada inmersiva: la imagen del jardín con un portal que respira, faroles, niebla, agua y luciérnagas. "Comenzar el viaje" atraviesa la puerta. |
| `/jardin` | El jardín de las puertas: una puerta por universo, cada una con su color, forma de arco y símbolo. |
| `/universo/[slug]` | Interior de un universo: piezas destacadas, filtro por tipo, hilos (etiquetas) y puertas vecinas. |
| `/contenido/[slug]` | Una pieza: cuerpo en Markdown (los poemas respetan los saltos de línea), multimedia, **Sigue el hilo**, hilos directos y piezas que resuenan. |
| `/explorar` | La biblioteca completa: búsqueda, filtros por tipo, universo y etiqueta. |
| `/conexiones` | El tejido: constelación de todas las piezas. Toca una estrella para ver sus hilos o **traza un camino** entre dos. |
| `/universo/nutricion` | Centro de aprendizaje: recorrido Aprender → Entender → Decidir → Practicar y secciones Videoteca, Biblioteca y Notas, y Recetas. |
| `/universo/[slug]/videoteca` | Videoteca con pestañas (videos, podcasts), búsqueda, orden, vista cuadrícula/lista y filtros por tema, nivel de evidencia, estado y guardados. |
| `/mundo` | El Mundo Compartido: puerta sellada, *en construcción*. |
| `/admin` | El taller privado: crear, editar y eliminar piezas y universos, enlazarlas y subir archivos. |

## Cómo se teje el conocimiento

- **Hilos directos**: en cada pieza eliges con qué otras se relaciona (se tratan como bidireccionales). El formulario sugiere piezas que comparten etiquetas o universos.
- **Etiquetas**: caminos que cruzan universos (`#rumi`, `#tejido`, `#aliento`…).
- **Universos**: una pieza puede vivir en varios a la vez.

Ejemplo sembrado: *Rumi → El canto de la caña → La flauta ney → ¿Qué es la inspiración? → Mi Cuento Feliz*.

## Centros de aprendizaje

Cualquier universo puede convertirse en centro de aprendizaje desde *Crear → Universos → Editar → Experiencia del universo*. Las piezas aparecen solas en su sección según su tipo:

- **Videoteca**: video, podcast, audio (con nivel de evidencia, estado, valoración, duración y guardado).
- **Biblioteca y Notas**: libro, artículo, estudio, enlace y tus notas (apunte, reflexión, idea).
- **Recetas**: receta.

Fondo opcional: `public/images/amanecer-fondo.(webp|jpg|png)`; si no existe se dibuja un amanecer en SVG.

## Datos

> Publicación automática: cada `git push` a `main` despliega en Easypanel (webhook de GitHub).

- Todo se guarda en `data/db.json` (se crea con el contenido semilla la primera vez).
- Los archivos subidos van a `data/uploads/` y se sirven desde `/media/...`.
- Para volver al contenido semilla: `npm run reset-data` (¡borra tu contenido!).
- Haz copia de la carpeta `data/` para respaldar tu jardín.

## Privacidad del taller

Por defecto `/admin` queda abierto, pensado para usarse solo en tu computadora. Si quieres una contraseña, crea `.env.local` con:

```
ADMIN_PASSWORD=tu-clave
```

## Arquitectura (preparada para crecer)

```
src/lib/types.ts      Modelo: Universe, Entry, MediaItem. Todo lleva gardenId.
src/lib/db.ts         Único punto de acceso a datos (JSON local). Sustituible por SQLite/Postgres.
src/lib/gardens.ts    Jardín personal hoy; un jardín por persona mañana.
src/lib/graph.ts      Tejido: enlaces, relacionados, caminos (BFS), etiquetas.
src/lib/seed.ts       Universos y piezas iniciales.
src/app/api/*         API REST local (contenidos, universos, subida de archivos).
src/components/*      Escena de inicio, puertas SVG, luciérnagas, mapa de conexiones, taller.
```

- **Animación**: CSS para la atmósfera, GSAP para el parallax y el cruce del portal, Framer Motion para filtros y paneles. No se usa Three.js: la imagen + capas 2D ya dan la profundidad buscada con mucho menos peso.
- **Accesible y ligero**: respeta `prefers-reduced-motion`; las luciérnagas se pausan fuera de pantalla.
- **Futuro** (no implementado a propósito): usuarios, perfiles, seguidores, mensajería, IA, grafo global. El `gardenId` en cada registro y la capa `db.ts` son las costuras para añadirlos.
