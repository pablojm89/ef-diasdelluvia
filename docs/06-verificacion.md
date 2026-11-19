# Verificación de esta entrega

19 de noviembre de 2026. Entorno Node 24.22.1, Python disponible. Proyecto estático sin dependencias de producción.

## Comprobado

- Pruebas con `node --test`: integridad de los 24 retos, variantes, filtro individual, seis hitos sin requerir pareja en modo individual, validación de rúbrica, rechazo de registros duplicados, empates y liga completa de seis equipos y seis rondas tras serializar su estado.
- Análisis de sintaxis de `app.js`, `engine.js`, `content.js` y el lanzador de desarrollo.
- Lectura y validación XML de las dos ilustraciones SVG.
- Comprobación de referencias locales de HTML y enlaces relativos de la documentación.
- Revisión de que el registro de un equipo no reinicia el temporizador activo de Liga.
- Rutas de recursos relativas, sin dependencias remotas obligatorias.
- `git diff --check` antes de guardar la entrega.
- Rediseño visual: prueba automatizada en Chromium del mapa, misión completa, pausa de reloj, persistencia al recargar, escenario y pulso activo, Liga de seis rondas y filtros. Sin errores de JavaScript.
- Capturas en 1440 px, 1024 px, 768 px, 390 px y 320 px. Comprobado que no hay desbordamiento horizontal en las pantallas de mundo, misión, baile y arena. Revisión visual de capturas de escritorio, móvil y tablet.
- El workflow de Pages incluye las imágenes WebP del escenario y de Chispa.

## No comprobado aún

- Escritorio compartido: la herramienta continúa bloqueada por un error de sandbox. La comprobación automatizada se realizó con el Chromium instalado, aislando las peticiones a los archivos locales del proyecto.
- Auditoría completa con teclado y lector de pantalla, reproducción audible y compatibilidad en navegadores del centro. El guardado y los recorridos se probaron en Chromium, no en todos los navegadores.
- Publicación de GitHub Pages: la consulta a su API devolvió 403, «Resource not accessible by integration». Se entrega workflow manual, sin afirmar que esté desplegado. El repo es privado; hace falta un plan compatible para mantenerlo privado y usar Pages.
- Uso con alumnos, tiempos de clase y adecuación de las variantes al grupo concreto.
- Las salas y votos de las experiencias físicas siguen especificados y pendientes. El multijugador de Mate Arena ya está implementado y tiene pruebas propias; véase [su documentación](07-mate-arena.md).

Antes del primer pilotaje: abrir en el navegador del centro y verificar Misión completa, una Liga, cambios de variante, sonido opcional y recarga. Después realizar la observación didáctica descrita en la guía.

## Mate Arena

El videojuego se verifica por separado con `tests/mate.test.js` y `tests/mate-browser.cjs`. Las pruebas de navegador usan contextos independientes y el servicio externo WSS real. Se ha comprobado una sala de doce clientes, movimiento remoto, pausa del anfitrión, reconexión con la misma plaza y lanzamientos compartidos. Las capturas de su menú y pista se revisaron también en móvil, tablet y portátil. Los resultados completos y límites de infraestructura se documentan en [Mate Arena](07-mate-arena.md).
