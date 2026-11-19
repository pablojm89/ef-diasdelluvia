# Patio Interior · EF en días de lluvia

Una propuesta de coordinación, ritmo, expresión y cooperación para 5.º y 6.º de Primaria.

**Estado: investigación y diseño de producto + prototipo funcional local.** Tres experiencias desde un único dispositivo. Las salas online y las votaciones entre tablets están diseñadas, pero todavía no implementadas. No hay seguimiento del movimiento con cámara.

## Abrir el prototipo

Sirve la raíz con `python -m http.server 8000` y abre `http://localhost:8000`. No requiere instalación ni claves. Rutas relativas compatibles con GitHub Pages en `/ef-diasdelluvia/`.

- **Misión Refugio:** seis retos, temporizador, alternativas sentadas y avance cooperativo o individual.
- **Pulso Lab:** secuencia de cuatro movimientos, metrónomo opcional y fases de creación, ensayo y muestra.
- **Liga Relámpago:** rondas para 2–6 equipos y puntuación manual validada por el docente en pantalla común.
- Biblioteca de 24 retos originales, filtros y guía rápida.

El progreso se guarda en el navegador si permite almacenamiento local. En Liga los resultados se introducen en el mismo dispositivo: no hay sincronización entre ordenadores.

## Documentación

1. [Investigación: fuentes, comparación y decisiones](docs/01-investigacion.md).
2. [Concepto de producto y seis juegos](docs/02-propuesta.md).
3. [Sesiones, inclusión y observación](docs/03-guia-docente.md).
4. [Arquitectura y contrato del multijugador](docs/04-arquitectura.md).
5. [Plan y criterios de aceptación](docs/05-plan.md).

## Comprobar y publicar

`npm test` ejecuta pruebas del banco y las reglas mediante Node. `node --check app.js` valida sintaxis. No hay dependencias de producción ni compilación.

El workflow de Pages se ejecuta manualmente. Primero activar **Settings → Pages → Source: GitHub Actions**. El repositorio es privado: Pages requiere un plan compatible. No se cambia su visibilidad automáticamente. [Documentación de GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Textos, interfaz e ilustraciones SVG creados para el proyecto. Las fuentes son referencias, no contenidos redistribuidos. No se incluyen vídeos, música ni marcas de Just Dance o Genially. Licencia de redistribución todavía por decidir.
