# Peticiones de imágenes

Lista de imágenes que quedarían mejor pintadas por un modelo de imagen que compuestas a mano. Cada petición dice qué archivo entregar, a qué tamaño, qué debe verse y qué hay que tocar para que el juego la use. Las de la sección «Listas para soltar» no necesitan cambios de código; las de «Necesitan integración» sí, y están en el [plan](../08-hoja-de-ruta.md). Toda imagen nueva sigue la estética del gimnasio pintado, salvo lo que ocurre dentro de un partido de Mate Arena, que es pixel art.

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

### 6. Puertas de los lugares

- **Dónde:** `assets/door-<lugar>.webp`, 480 × 640 px, opacas. Cada imagen se ve recortada en forma de arco, así que el motivo va centrado y algo bajo.
- **Estilo:** el de `gimnasio/assets/gym.webp`: colegio andaluz, luz cálida de tarde, pared ocre, zócalo verde azulado, madera. Sin personas ni texto.
- **Integración:** ninguna si se respeta el nombre del archivo; el lugar se abre cambiando su estado en `hub.js`.

| Archivo | Lugar | Qué debe verse |
|---|---|---|
| `door-mate` | La Pista | Pista polideportiva exterior del cole con las líneas de un campo de balón prisionero y una pelota amarilla en el centro. Sustituye al recorte en pixel art |
| `door-tatami` | El Tatami | Sala luminosa con esterillas de yoga de colores en el suelo de madera y un espejo al fondo |
| `door-pizarra` | La Pizarra | La pizarra verde del gimnasio de frente, con una jugada dibujada con tiza y el borrador en la repisa |
| `door-aula` | El Aula | Aula con las mesas apartadas y un tablero grande de juego desplegado en el suelo |
| `door-grada` | La Grada | Grada de madera de pabellón vista desde la pista, con un marcador apagado arriba |
| `door-vestuario` | El Vestuario | Fila de taquillas verdes con un banco de madera delante |
| `door-despacho` | El Despacho | Mesa de profe con silbato, carpeta y un tablón de corcho detrás |

### 7. Posturas de yoga para El Tatami

- **Dónde:** `tatami/assets/pose-<postura>.webp`, una hoja por postura de 1536 × 640 px con tres dibujos de 512 × 640 en fila, fondo transparente.
- **Los tres dibujos:** preparación, a medio camino y postura completa. La salida se anima recorriéndolos al revés, así que no hace falta dibujarla.
- **Personaje:** siempre la misma alumna del gimnasio, Lúa (`gimnasio/assets/pupil-2.webp`), con la misma ropa, sobre una esterilla turquesa. Los pies o el punto de apoyo en el mismo sitio en los tres dibujos, para que la animación no salte. Mismo estilo de ilustración pintada que los personajes del gimnasio.
- **Cuidado:** posturas correctas y seguras para Primaria: rodilla alineada sobre el tobillo, espalda larga, sin forzar el cuello.
- **Integración pendiente:** el lugar entero; es la fase C del plan.

| Archivo | Español | Inglés |
|---|---|---|
| `pose-montana` | La montaña | Mountain |
| `pose-arbol` | El árbol | Tree |
| `pose-silla` | La silla | Chair |
| `pose-guerrero-1` | El guerrero I | Warrior I |
| `pose-guerrero-2` | El guerrero II | Warrior II |
| `pose-triangulo` | El triángulo | Triangle |
| `pose-gato` | El gato | Cat |
| `pose-vaca` | La vaca | Cow |
| `pose-perro` | El perro boca abajo | Downward dog |
| `pose-cobra` | La cobra | Cobra |
| `pose-mariposa` | La mariposa | Butterfly |
| `pose-nino` | La postura del niño | Child's pose |

### 8. Sala del tatami

- **Dónde:** `tatami/assets/room.webp`, 1536 × 1024 px, mismo punto de vista y proporción que `gimnasio/assets/gym.webp`.
- **Qué pedir:** sala de expresión del mismo colegio: suelo de madera clara, espejo grande en la pared del fondo, ventanal a la izquierda con naranjos, esterillas enrolladas en un estante. El centro del suelo, despejado: ahí se coloca la figura que hace la postura.

### 9. Tablero de la oca

- **Dónde:** `aula/assets/board.webp`, 1536 × 1024 px.
- **Qué pedir:** tablero de juego en espiral de 30 casillas pintado sobre el suelo de madera de un aula, visto desde arriba. Casillas grandes, numerables por código, en los seis colores de la ruleta (teja, verde azulado, ocre, coral, verde y azul), sin números ni texto. Salida abajo a la izquierda y meta en el centro.
- **Integración pendiente:** la fase D del plan.
