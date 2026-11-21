# Encargo de imágenes · El Pabellón

> Archivo generado por `scripts/encargo_arte.py` a partir de `arte/estilo.json` y `arte/lotes/*.json`. No lo edites a mano: cambia el lote y vuelve a generarlo.

## Para la IA de imágenes (ChatGPT / Gemini)

Eres el ilustrador de **El Pabellón**, el hub de Educación Física de un colegio de Primaria de Andalucía. Cada actividad vive en un lugar del pabellón del cole, y todo debe parecer el mismo colegio.

### Estilo (igual en todas las imágenes)

Ilustración pintada de cuento, cálida y luminosa, la misma de gimnasio/assets/gym.webp y gimnasio/assets/store.webp: un colegio andaluz al final de la tarde. Línea de contorno fina y marrón, color plano con textura suave de acuarela y gouache, sombras cálidas y definidas, luz dorada que entra por ventanales de la izquierda. Paleta: pared ocre melocotón, zócalo verde azulado, madera miel, suelo de parqué anaranjado, cenefa de azulejo azul y naranja, naranjos tras las ventanas. Personajes de 10 a 12 años con proporciones naturales y chándal o ropa deportiva, como gimnasio/assets/pupil-0.webp; el profe es el de gimnasio/assets/robles-rest.webp. Tono amable y realista, de colegio de verdad: nada de fantasía, robots, islas, neones ni ciencia ficción.

**Excepción.** Sólo para lo que ocurre dentro de un partido de Mate Arena: pixel art de recreativa con contorno azul noche #17233b, como mate/assets/roster/vega.png. Los pedidos que lo usan lo dicen.

### Reglas

1. Sin texto, letras ni números dentro de la imagen: el juego pone los rótulos.
2. Sin personas reales, marcas ni logotipos. Personajes siempre ficticios.
3. Fondos y puertas: opacos, sin personajes salvo que el pedido los nombre.
4. Objetos y personajes: fondo totalmente transparente, sin halo, sin brillo alrededor y sin sombra proyectada en el suelo (la pone el juego).
5. Respeta el tamaño y la proporción de cada pedido. Si generas más grande, mantén la proporción: el script recorta y reduce.
6. Nombra cada archivo exactamente como indica el pedido. Si no, el script no lo reconoce.
7. Un personaje que aparece en varias imágenes lleva siempre la misma cara, ropa y colores: dibuja primero una y úsala de referencia.

### Entrega

Sube cada imagen a `arte/entrega/` con el nombre exacto que indica su pedido, en PNG (también se aceptan JPG y WebP), en una rama tuya `gpt/<lote>`; nunca en `main` ni en la rama de Claude. Añade un archivo `arte/entrega/MANIFIESTO` con una línea por imagen: su SHA-256, dos espacios y el nombre. Toca sólo `arte/entrega/`: la conversión, el recorte y la colocación en el juego los hace `scripts/integrar_arte.py`. Si no puedes escribir en el repositorio, dáselas a Pablo con esos nombres y él las sube.

### Ya aprobadas: úsalas de referencia

Mantén su estilo, luz y acabado: `gimnasio/assets/gym.webp`, `gimnasio/assets/store.webp`, `gimnasio/assets/robles-rest.webp`, `gimnasio/assets/pupil-0.webp`, `gimnasio/assets/prop-cone.webp`, `mate/assets/roster/vega.png`.

## Pendientes: 0

### Lote `01-puertas` · Puertas de los lugares

Lo que se ve por el arco de cada puerta del pabellón. Se usan en la pantalla de puertas en cuanto se integran.

Ya integradas: 8.

Lote completo.

### Lote `02-almacen` · Cuarto de materiales

Mejoras de la aventura Equipment Rescue. El cuarto ordenado sustituye al montaje actual; el resto necesita integración en gimnasio/app.js.

Ya integradas: 4.

Lote completo.

### Lote `03-iconos-mate` · Iconos de habilidad de Mate Arena

Estilo pixel art (ver estilo_pixel). Cada icono integrado sustituye solo a su versión vectorial. Cada personaje tiene ahora una definitiva propia: los seis iconos pendientes son de las definitivas nuevas y se ven en grande, en un círculo dorado. Siguen en uso los de pasar, atrapar, esquivar y lanzar, y siete de los ya pintados (pase exprés, imán, zancada, imparable, contraataque, mirada y salida), que pasan a ser el icono de una definitiva; los otros ocho de talentos antiguos ya no aparecen en el juego.

Ya integradas: 25.

Lote completo.

### Lote `04-pista-mate` · Pista de Mate Arena

Estilo pixel art. Necesita integración en mate/renderer.js (buildBackground).

Ya integradas: 1.

Lote completo.

### Lote `10-tatami` · El Tatami: yoga

Cada postura tiene una hoja de pasos (pasos-<postura>: seis dibujos, del inicio a la postura terminada) y su versión en silla; además, la sala y el profe. Las doce primeras posturas y la vuelta a la calma ya tienen una hoja antigua de tres dibujos (pose-<postura>), que sigue en uso hasta que llegue su hoja de pasos. tatami/figura.js usa cada hoja en cuanto aparece en el índice; mientras tanto dibuja una figura provisional. La puerta de El Tatami ya está pedida en el lote 01-puertas.

Ya integradas: 92.

Lote completo.

### Lote `11-pizarra` · La Pizarra · Rosco de Educación Física

Lugar La Pizarra (pizarra/). Mientras no llegan, la pizarra, las posturas y la tiza están dibujadas con CSS y SVG; cada imagen integrada sustituye sola a su versión provisional gracias al índice pizarra/assets/pintados.js.

Ya integradas: 12.

Lote completo.

### Lote `12-aula` · El Aula: la oca cooperativa y el bingo en movimiento

Lugar El Aula (aula/). El código ya usa cada imagen en cuanto scripts/integrar_arte.py la marca como lista: el índice aula/assets/pintados.js dice cuáles están pintadas. Hasta entonces se dibujan en SVG y CSS.

Ya integradas: 52.

Lote completo.

### Lote `13-grada` · La Grada

Pantalla de clase que proyecta hasta cuatro partidos de Mate Arena. Hoy el marco se dibuja con CSS (madera, pared ocre, zócalo y carteles crema) y el arte común; estas piezas lo sustituyen cuando se integren en grada/grada.css. El partido conserva su pixel art: aquí sólo se pide lo que lo rodea. La puerta del hub ya está pedida en 01-puertas (door-grada).

Ya integradas: 5.

Lote completo.

### Lote `14-gimnasio` · Aventura del gimnasio: interfaz, carro y poses

Remate de Equipment Rescue para que la aventura se lea sin texto de panel. Los iconos y el carro cargado se usan solos en cuanto están en gimnasio/assets/pintados.js (lo escribe scripts/integrar_arte.py); las poses, retratos y el papel del bocadillo necesitan además integración en gimnasio/app.js, robles.js y style.css. El carro vacío está en el lote 02 (trolley): este lote no lo repite.

Ya integradas: 24.

Lote completo.

### Lote `15-pista` · La Pista: menú y vestuario de Mate Arena

Lo que rodea al partido de Mate Arena en la estética común; el partido sigue en pixel art (lotes 03 y 04). Se usan solos en cuanto están en mate/assets/pista/pintados.js: los fondos los pone mate/style.css (clases con-<pedido> en el body), los retratos los usa mate/game.js en la ficha del personaje y los petos y la copa los pone mate/style.css. Mientras no llegan, el menú es pared, papel y carteles con el retrato en pixel art.

Ya integradas: 18.

Lote completo.

## Notas del ilustrador

_Si tienes dudas o propuestas, apúntalas aquí o díselas a Pablo._
