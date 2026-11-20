# Arte del colegio

Los escenarios, los alumnos ficticios, los materiales y las poses del profe son ilustraciones generadas para esta aventura. El modelo de Robles procede del avatar deportivo de La Lupa indicado por el docente.

- `gym.webp` y `store.webp` son vistas independientes en proporción 3:2. Los carteles y destinos utilizan coordenadas del mismo plano que la ilustración.
- Cada personaje tiene un retrato de cuerpo entero para el reposo (`pupil-0.webp` a `pupil-7.webp`) y ocho dibujos de marcha en dos filas de cuatro (`walk-0.webp` a `walk-7.webp`). La distancia recorrida determina el fotograma y la profundidad determina la escala.
- `robles-rest.webp`, `robles-whistle.webp`, `robles-talk.webp` y `robles-point.webp` comparten un anclaje en los pies. Se alternan durante la espera y la conversación.
- `teacher-robles.webp` proporciona el retrato del diálogo. Los diez archivos `prop-*.webp` representan los objetos manipulables del almacén.
- `store-tidy.webp` es el mismo cuarto con todo el material guardado y `set-*.webp` son las partes de esa imagen que cambia cada objeto. El juego muestra el cuarto vacío y va revelando una parte por objeto guardado. Se generan con `python3 scripts/build-store-states.py`; no se editan a mano. `../store-layout.js` indica dónde va cada parte.
- El carro del pedido aún no está pintado (`trolley.webp`, lote `02-almacen`). Mientras tanto `../trolley.js` lo dibuja con formas sencillas en la paleta del cuarto; cuando llegue, se cambia `PAINTED` a `true` en ese archivo y las unidades se colocan sobre la imagen.
- `pintados.js` lo escribe `scripts/integrar_arte.py` con las imágenes ya entregadas del lote `14-gimnasio`. Los iconos `icon-*.webp` y el carro cargado `trolley-loaded.webp` sustituyen solos a su dibujo provisional en cuanto aparecen en esa lista.
