# El Pabellón · hub de Educación Física

Un colegio que se juega: cada actividad de Educación Física vive en un lugar del pabellón. Para el aula, la pantalla digital o el ordenador de cada alumno.

**Tres formas de entrar.** El alumno pulsa «Entrar a jugar», elige curso, grupo, número de lista y personaje, y ve unas pocas puertas. La pantalla digital abre las actividades para toda la clase, como la ruleta de retos. El profe entra con una clave a su despacho, donde están el registro y la lista completa de lugares.

**Una estética.** Todo sale del gimnasio pintado y su profe Robles. Las actividades de la primera etapa con islas y robot quedan apartadas en el despacho hasta sustituirlas. El [plan](docs/08-hoja-de-ruta.md) dice qué lugares hay, cuáles vienen y en qué orden.

**Registro.** Lo que se juega se anota por clase y número de lista, sin nombres, en el navegador. El envío a una hoja privada del profe está preparado y apagado. [Registro y notas](docs/10-registro-y-notas.md).

**Privacidad:** el repositorio es público y sólo contiene recursos genéricos y personajes ficticios. No incorporar datos reales de alumnos. [Política y comprobaciones de publicación](PRIVACY.md).

**Estado:** abiertos El Gimnasio (aventura *Equipment Rescue*), La Pista (Mate Arena, con entrenamiento y salas online), Las Espalderas (ruleta de retos), El Aula (oca cooperativa y bingo en movimiento), La Pizarra (rosco de EF), El Tatami (yoga) y La Grada (partidos de mate en directo). Varias pantallas usan figuras provisionales mientras llegan las imágenes de [arte/ENCARGO.md](arte/ENCARGO.md). El envío de notas a la hoja del profe está programado pero sin probar con Google real. No hay seguimiento del movimiento con cámara.

**Presentación inmersiva:** el escenario ocupa toda la ventana; diálogos y controles se integran sobre la escena. Misión, mochila y ajustes se abren desde el menú del juego.

**Primera aventura implementada:** [Equipment Rescue](gimnasio/), gimnasio y almacén con cinco fases, objetos manipulables, instrucciones bilingües y progreso local. El material guardado forma parte del propio fondo: cada objeto revela su parte de la imagen del cuarto ordenado. Mate Arena conserva su ruta.

**Dossier de diseño:** [El Gimnasio, aventura gráfica bilingüe para EF de 5.º–6.º en Andalucía](docs/hub-ef/README.md). Incluye investigación, dirección artística, arquitectura y el guion de la primera misión del almacén. La primera misión ya está implementada; los demás espacios del dossier siguen planificados.

## Actividades de la primera etapa

Misión Refugio, Pulso Lab y Liga Relámpago, con su mapa de islas, no siguen la estética del gimnasio. Ya no aparecen para el alumnado ni en la pantalla digital; el profe puede abrirlas desde su despacho mientras se construyen sus sustitutos. Su banco de 24 retos alimenta la ruleta.

## Mate Arena · videojuego online

Trece personajes de pixel art, cada uno con una habilidad definitiva propia que se recarga con el tiempo (un cometa que nadie atrapa, un tiro teledirigido, un gigante, una red, pies quietos…), y una plaza por personaje en cada equipo, movimiento libre en cada campo, lanzamientos, pases, esquivas, recepción al vuelo, cárceles y rescates. Entrenamiento contra IA o salas por código para hasta 26 jugadores (13 contra 13). Reglas del mate escolar con dos variantes de recepción configurables.

La partida ocupa toda la pantalla. Las habilidades se muestran en círculos con su imagen, la tecla debajo y el tiempo de recarga, con la definitiva en un círculo dorado más grande; en tableta y móvil se juega con una palanca y los círculos, sin teclas. Cada jugada suma puntos y al acabar se muestra la tabla de todos los jugadores.

Abre **`/mate/`**, pulsa **Crear sala online** y comparte la invitación. Tus compañeros eligen personaje, entran con el código y marcan **Estoy listo**. El anfitrión inicia el partido y mantiene la pestaña abierta. Las plazas libres se completan con IA. El juego intenta WebRTC y ofrece relevo WSS. Los servicios públicos por defecto permiten probarlo sin configurar cuentas; para uso habitual se puede conectar un servicio propio del centro. [Reglas, arquitectura, pruebas y límites](docs/07-mate-arena.md).

![Mate Arena: balón prisionero arcade](docs/images/mate-arena.webp)

## Abrir la aplicación

Ejecuta `npm run dev` y abre `http://localhost:3000`; el videojuego está en `http://localhost:3000/mate/`. También se puede servir la raíz con cualquier servidor estático. No requiere instalación ni claves. Rutas relativas compatibles con GitHub Pages en `/ef-diasdelluvia/`.

La aventura del gimnasio guarda su progreso en el navegador. Mate Arena sincroniza su propia partida entre los ordenadores de la sala; no guarda un historial de alumnos.

## Documentación

1. [Investigación: fuentes, comparación y decisiones](docs/01-investigacion.md).
2. [Concepto de producto y seis juegos](docs/02-propuesta.md).
3. [Sesiones, inclusión y observación](docs/03-guia-docente.md).
4. [Arquitectura y contrato del multijugador](docs/04-arquitectura.md).
5. [Plan y criterios de aceptación](docs/05-plan.md).
6. [Mate Arena: juego, online y verificación](docs/07-mate-arena.md).
7. [Plan del hub: lugares, formas de entrar y orden de trabajo](docs/08-hoja-de-ruta.md).
8. [Qué actividades digitales de EF para lluvia existen y cuáles rehacer](docs/09-investigacion-dias-de-lluvia.md).
9. [Encargo de imágenes para la IA ilustradora](arte/ENCARGO.md), generado desde `arte/lotes/`; las entregas van a `arte/entrega/` y las coloca `python3 scripts/integrar_arte.py`.
10. [Registro y notas](docs/10-registro-y-notas.md).

## Comprobar y publicar

`npm test` ejecuta pruebas del banco y las reglas mediante Node. `npm run test:browser` ejecuta el recorrido completo y genera capturas en `artifacts/`; requiere Playwright disponible en el entorno y Chromium instalado (ruta opcional `CHROMIUM_PATH`). El runner sirve los archivos en memoria, sin servidor público. `node --check app.js` valida sintaxis. No hay compilación. `python3 scripts/build-store-states.py` vuelve a generar el cuarto de materiales ordenado y `python3 scripts/build-hub-art.py` las imágenes de la portada; ambos requieren Pillow. Mate incluye una copia local de PeerJS 1.5.5 con su licencia MIT; el renderizado y el motor de juego son propios. `npm run test:mate` realiza las pruebas online reales y requiere internet, Playwright y Chromium. `MATE_CLIENTS=12 MATE_FULL_MATCH=0 npm run test:mate` prueba una sala de doce clientes.

La web está publicada en [El Pabellón](https://pablojm89.github.io/ef-diasdelluvia/) y [Mate Arena](https://pablojm89.github.io/ef-diasdelluvia/mate/). El 20 de noviembre de 2026 el propietario hizo público el repositorio y activó Pages desde `main` y la raíz. El workflow comprueba contenido y pruebas; si se elige **GitHub Actions** como origen de Pages, también despliega un paquete limitado a la aplicación. Con publicación desde rama, el control de CI no bloquea la publicación automática. [Documentación de GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Textos e interfaz creados para el proyecto. Escenario y personaje generados con IA para esta dirección artística y optimizados en WebP; también se conservan las ilustraciones SVG iniciales. Las fuentes son referencias, no contenidos redistribuidos. No se incluyen vídeos, música ni marcas de Just Dance o Genially. Licencia de redistribución todavía por decidir.
