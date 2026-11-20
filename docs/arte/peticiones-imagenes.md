# Peticiones de imágenes

Lista de imágenes que quedarían mejor pintadas por un modelo de imagen que compuestas a mano. Cada petición dice qué archivo entregar, a qué tamaño, qué debe verse y qué hay que tocar para que el juego la use. Las de la sección «Listas para soltar» no necesitan cambios de código; las de «Necesitan integración» sí, y están en la [hoja de ruta](../08-hoja-de-ruta.md).

Normas comunes: personajes y objetos originales, sin marcas, logotipos ni texto dentro de la imagen; ninguna persona real. Entregar en WebP. Los fondos, opacos; los objetos sueltos, con fondo transparente y sin sombra proyectada en el suelo (la pone el juego).

## Listas para soltar

### 1. Iconos de habilidad de Mate Arena (19)

- **Dónde:** `mate/assets/abilities/<nombre>.webp`, uno por icono, con los mismos nombres que los `.svg` actuales.
- **Tamaño:** 192 × 192 px, fondo transparente fuera del círculo.
- **Para activarlos:** cambiar `ART_FORMAT` a `'webp'` en `mate/abilities.js`.
- **Estilo:** pixel art de 48 × 48 ampliado ×4 sin suavizado, igual que los retratos de `mate/assets/roster/`. Medallón circular que llena el lienzo, con degradado del color indicado, brillo arriba a la izquierda y contorno azul noche `#17233b`. El motivo en crema `#fff6da` con contorno `#17233b`; la pelota, amarilla `#ffd36b`. Debe leerse a 46 px: un solo motivo grande, sin detalle fino. Los `.svg` actuales sirven de referencia de composición.

| Archivo | Habilidad | Motivo | Color del medallón |
|---|---|---|---|
| `fire` | Lanzar | Pelota volando hacia arriba a la derecha con tres estelas | Ámbar |
| `pass` | Pasar | Pelota que describe un arco con flecha hacia un compañero | Azul cielo |
| `catch` | Atrapar | Mano abierta bajo una pelota que llega | Turquesa |
| `dash` | Esquivar | Dos galones hacia la derecha con líneas de velocidad | Naranja tostado |
| `special` | Tiro imparable | Pelota envuelta en una llama de cometa | Magenta |
| `gaze` | Mirada intensa | Ojo grande con destellos encima | Violeta |
| `pase-expres` | Vega · Pase exprés | Doble flecha de avance rápido empujando una pelota | Celeste |
| `iman` | Kai · Imán | Imán de herradura atrayendo una pelota | Rojo coral |
| `lectura` | Lúa · Lectura de juego | Pizarra táctica con una X, un círculo y una flecha punteada | Verde |
| `zancada` | Neo · Zancada | Rayo | Amarillo |
| `tirachinas` | Ada · Tirachinas | Tirachinas con una pelota en la goma | Marrón anaranjado |
| `guante` | Max · Guante largo | Mano abierta dentro de un círculo de puntos que marca su alcance | Azul |
| `cometa` | Nora · Paso de cometa | Cometa de rombo con su cola | Añil |
| `finta` | Leo · Segunda finta | Flecha circular de recarga con dos galones dentro | Naranja |
| `manos` | Iris · Manos listas | Dos manos abiertas con una estrella encima | Verde agua |
| `avance` | Bruno · Avance firme | Escudo con una pelota en el centro | Lila |
| `contraataque` | Sol · Contraataque | Flecha que da media vuelta, con una estrella | Rojo frambuesa |
| `relevo` | Teo · Relevo | Testigo de relevos en diagonal con líneas de velocidad | Dorado |
| `salida` | Inés · Salida veloz | Candado abierto con líneas de velocidad | Verde hoja |

### 2. Cuarto de materiales ordenado

- **Dónde:** `gimnasio/assets/store-tidy.webp`, sustituyendo el actual.
- **Tamaño:** 1536 × 1024 px, mismo encuadre exacto que `gimnasio/assets/store.webp`.
- **Para activarlo:** ejecutar `python3 scripts/build-store-states.py --from-tidy`, que recorta de la imagen la parte de cada objeto.
- **Qué pedir:** edición de `store.webp` sin mover ni redibujar muebles, pared, puerta, ventana ni suelo. Sólo se añade el material guardado, con la misma luz cálida que entra por la ventana de la izquierda y sombras suaves hacia la derecha. Usar el `store-tidy.webp` actual como plano de dónde va cada cosa:
  - Carro de balones: balón de baloncesto, pelota blanda verde y balón de fútbol dentro, detrás de la rejilla.
  - Soporte de conos: un cono naranja encajado en la primera varilla de la balda superior.
  - Estantería, fila superior de cestas: saquito morado en la primera, peto naranja doblado sobre el borde de la segunda, cuerda turquesa con mangos de madera colgando de la tercera.
  - Pared: aro amarillo apoyado en el primer gancho en U; raqueta de bádminton colgada del último gancho del perchero.
  - Tarima: una segunda colchoneta azul apilada sobre la del centro.
- **Condición:** cada objeto debe quedar dentro del recuadro que tiene asignado en `BOXES`, al principio de `scripts/build-store-states.py`. Si se pinta más material (por ejemplo cuatro conos), hay que ampliar ese recuadro.

## Necesitan integración

### 3. Pista de Mate Arena

- **Dónde:** `mate/assets/court.webp`, 1200 × 760 px, pixel art.
- **Qué pedir:** pabellón escolar visto desde arriba con ligera perspectiva de recreativa. Parqué claro; campo izquierdo con tinte turquesa y derecho con tinte coral; línea central y círculo central en crema; una franja de cárcel a cada lado. Grada con público al fondo y una banda oscura lisa en los 67 px inferiores para la barra de habilidades. Sin marcador ni texto.
- **Geometría que debe respetar, en píxeles:** campo de juego de x 157 a 1043 y de y 150 a 640; línea central en x 600; círculo central de radio 88 en (600, 394); cárcel izquierda de x 60 a 150 y derecha de x 1050 a 1140; grada entre y 86 y 141; los 86 px superiores libres para el marcador.
- **Integración pendiente:** `ArenaRenderer.buildBackground` en `mate/renderer.js` debe dibujar esta imagen en lugar de trazar la pista.

### 4. Carro del pedido

- **Dónde:** `gimnasio/assets/trolley.webp`, unos 420 × 380 px, fondo transparente.
- **Qué pedir:** carro bajo de gimnasio con ruedas, de madera clara y metal gris, vacío, visto como los muebles del almacén. Mismo estilo de ilustración pintada que `prop-*.webp`.
- **Integración pendiente:** colocarlo en el suelo del almacén durante la fase del pedido y dibujar dentro el material añadido.

### 5. Riesgos de la fase de seguridad

- **Dónde:** `gimnasio/assets/risk-mat.webp` y `gimnasio/assets/risk-cone.webp`, fondo transparente.
- **Qué pedir:** una colchoneta azul mal apoyada, sobresaliendo de lo alto de una estantería y a punto de caer; un cono naranja volcado delante de una puerta.
- **Integración pendiente:** sustituir a los objetos sueltos que se usan ahora en esa fase.

### 6. Portada del hub

- **Dónde:** `assets/hub.webp`, 1920 × 1080 px.
- **Qué pedir:** el colegio andaluz del gimnasio visto desde el patio cubierto en un día de lluvia: charcos, luz cálida saliendo de las ventanas, galería con arcos. Cuatro puertas bien separadas y reconocibles sin texto: gimnasio, cuarto de materiales, pista de mate y aula. Mismo estilo que `gimnasio/assets/gym.webp`. Dejar el tercio superior despejado para el título.
- **Integración pendiente:** la portada de la fase 1 de la hoja de ruta.
