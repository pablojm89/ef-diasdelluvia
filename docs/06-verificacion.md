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

## No comprobado aún

- Recorrido real en navegador, disposición visual, teclado, lectores de pantalla, audio y almacenamiento de cada navegador. El servicio de preview falló al abrir el puerto del navegador y la herramienta de escritorio devolvió un error de sandbox. No se considera pasada la revisión visual.
- Publicación de GitHub Pages: la consulta a su API devolvió 403, «Resource not accessible by integration». Se entrega workflow manual, sin afirmar que esté desplegado. El repo es privado; hace falta un plan compatible para mantenerlo privado y usar Pages.
- Uso con alumnos, tiempos de clase y adecuación de las variantes al grupo concreto.
- Multijugador remoto, permisos de sala y votos: sólo especificados, no implementados.

Antes del primer pilotaje: abrir en el navegador del centro y verificar Misión completa, una Liga, cambios de variante, sonido opcional y recarga. Después realizar la observación didáctica descrita en la guía.
