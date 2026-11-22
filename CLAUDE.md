# El Pabellón · hub de Educación Física (Primaria)

Web estática de Pablo (maestro en Andalucía), servida en GitHub Pages. Idioma: **español** en interfaz, documentación y commits; los comentarios del código están en inglés.

## Qué es

Un colegio que se juega. Cada actividad vive en un **lugar** del pabellón. Tres formas de entrar: alumno, pantalla digital y profe. El plan vigente, con la lista de lugares y su estado, es `docs/08-hoja-de-ruta.md`. Léelo antes de añadir o cambiar un lugar.

## Mapa

| Ruta | Qué hay |
|---|---|
| `index.html`, `hub.js`, `hub.css` | Inicio, puertas, entrada del alumno, despacho del profe y ruleta. La tabla `PLACES` de `hub.js` decide qué puertas existen |
| `comun/base.css`, `comun/lugar.js` | Aspecto y cabecera comunes. Todo lugar los usa |
| `registro.js` | Quién juega (curso, grupo, número o alias de clase, y personaje), qué ha hecho y su envío a la hoja del profe. `record(lugar, actividad, evento, datos)` |
| `notas.js` | Tabla única de qué anotación genera qué nota; lo demás viaja como evidencia |
| `album.js` | El álbum de cromos: catálogo, qué pega cada anotación y guardado por jugador. Diseño en `docs/12-descubrimiento.md` |
| `backend/` | Servidor `aula.gs` (Apps Script + Hojas de Google), común con La Lupa |
| `gimnasio/` | Aventura gráfica Equipment Rescue. Es el modelo de estética |
| `mate/` | Mate Arena: balón prisionero. Simulación en `sim.js`, red en `network.js` |
| `grada/` | Partidos de Mate Arena en directo para la pantalla (espectador) |
| `vestuario/` | Taquilla, álbum y El Neceser (higiene); en la pantalla, Neceser en movimiento |
| `tatami/`, `pizarra/`, `aula/` | Yoga, rosco de EF, y oca cooperativa con bingo. Cada lugar es autocontenido y tiene su lote en `arte/lotes/` |
| `content.js`, `engine.js` | Banco de 24 retos con variante sentada y criterio |
| `patio.html`, `app.js`, `styles.css` | Actividades de la primera etapa, apartadas. No ampliar |
| `arte/` | Encargo de imágenes a la IA ilustradora: lotes, `ENCARGO.md` generado y `entrega/` |
| `intercambio/` | Lo que este repo comparte con el de multiplicopolis: registro, notas y convenciones |
| `tests/` | `npm test` (Node) y `npm run test:browser` (Playwright) |

## Reglas

- **Una estética:** la del gimnasio pintado (`gimnasio/assets/gym.webp`). Pared ocre, zócalo verde azulado, madera, cenefa de azulejo, carteles crema con letra de imprenta, el profe Robles como anfitrión. Usa los colores y piezas de `comun/base.css`. Nada de fantasía, neones ni interfaces de panel de control.
- **Parece un juego y enseña pocas opciones.** Lo que es información para el docente va al despacho, no a la pantalla del alumnado.
- **Movimiento real** siempre que la actividad sea de clase: toda la clase a la vez, con variante sentada visible. Sin eliminaciones ni turnos perdidos.
- **Bilingüe con función:** español e inglés británico donde el inglés haga falta para jugar.
- **Sin build ni dependencias:** HTML, CSS y módulos JavaScript. Rutas relativas (se publica en `/ef-diasdelluvia/`).
- **Alumnado menor de edad:** el repo es público. Nunca nombres, listas ni notas. El jugador es curso, grupo y número de lista; sin campos de texto libre para identificarse. Ver `PRIVACY.md`.
- **Imágenes:** si una pantalla necesita arte que no existe, se pide añadiendo un lote en `arte/lotes/` y regenerando `arte/ENCARGO.md`; mientras llega, el lugar funciona con una figura provisional sobria hecha con el arte existente o con formas simples. No se generan ni se descargan imágenes de terceros.
- Todo lo decidido queda escrito: plan en `docs/08-hoja-de-ruta.md`, datos y notas en `docs/10-registro-y-notas.md`.

## Comprobar

`npm test` y `npm run test:browser`. Antes de dar algo por hecho, ábrelo en un navegador con Playwright (ya instalado) a 1280 × 720 y a 390 × 844 y mira la captura. Servidor local: `python3 -m http.server <puerto>`.
