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

## Pendientes: 32

### Lote `01-puertas` · Puertas de los lugares

Lo que se ve por el arco de cada puerta del pabellón. Se usan en la pantalla de puertas en cuanto se integran.

| Archivo que entregar | Qué es | Tamaño | Fondo | Qué debe verse |
|---|---|---|---|---|
| `door-mate.png` | La Pista | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Pista polideportiva exterior del cole con las líneas de un campo de balón prisionero y una pelota amarilla en el centro; naranjos y galería con arcos al fondo. |
| `door-tatami.png` | El Tatami | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Sala luminosa con esterillas de yoga de colores sobre el suelo de madera y un espejo grande al fondo. |
| `door-pizarra.png` | La Pizarra | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. La pizarra verde del gimnasio de frente, con una jugada dibujada con tiza (círculos, aspas y flechas) y el borrador en la repisa. |
| `door-aula.png` | El Aula | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Aula con las mesas apartadas contra la pared y un tablero grande de juego de casillas de colores desplegado en el suelo. |
| `door-grada.png` | La Grada | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Grada de madera de pabellón vista desde la pista, con un marcador electrónico apagado arriba. |
| `door-espalderas.png` | Las Espalderas | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Las espalderas de madera del gimnasio de frente, con un banco sueco delante y una ruleta de madera de seis colores apoyada en la pared. |
| `door-vestuario.png` | El Vestuario | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Fila de taquillas verde azulado con un banco de madera delante y una mochila colgada. |
| `door-despacho.png` | El Despacho | 480 × 640 | opaco | Vista a través de una puerta abierta; el motivo principal centrado y algo bajo, porque la imagen se recorta en forma de arco. Mesa de profe con silbato, carpeta y cronómetro, y un tablón de corcho detrás. |

### Lote `02-almacen` · Cuarto de materiales

Mejoras de la aventura Equipment Rescue. El cuarto ordenado sustituye al montaje actual; el resto necesita integración en gimnasio/app.js.

| Archivo que entregar | Qué es | Tamaño | Fondo | Qué debe verse |
|---|---|---|---|---|
| `store-tidy.png` | Cuarto ordenado | 1536 × 1024 | opaco | Edición de gimnasio/assets/store.webp con el mismo encuadre exacto, sin mover ni redibujar muebles, pared, puerta, ventana ni suelo. Sólo se añade el material guardado, con la misma luz y sombras suaves hacia la derecha. Usa el store-tidy.webp actual como plano: en el carro de rejilla, balón de baloncesto, pelota blanda verde y balón de fútbol detrás de la rejilla; un cono naranja encajado en la primera varilla de la balda superior del soporte; en la fila superior de cestas, saquito morado, peto naranja doblado sobre el borde y cuerda turquesa con mangos de madera; aro amarillo apoyado en el primer gancho en U de la pared; raqueta de bádminton colgada del último gancho del perchero; una segunda colchoneta azul apilada sobre la del centro de la tarima. |
| `trolley.png` | Carro del pedido | 420 × 380 | transparente | Carro bajo de gimnasio con cuatro ruedas, de madera clara y metal gris, vacío, visto en tres cuartos como los muebles del cuarto de materiales. |
| `risk-mat.png` | Colchoneta mal colocada | 380 × 260 | transparente | Colchoneta azul de gimnasio mal apoyada, sobresaliendo torcida como si estuviera en lo alto de una estantería y a punto de caer. |
| `risk-cone.png` | Cono volcado | 300 × 260 | transparente | Cono naranja de señalización con dos franjas blancas, volcado de lado en el suelo. |

### Lote `03-iconos-mate` · Iconos de habilidad de Mate Arena

Estilo pixel art (ver estilo_pixel). Cada icono integrado sustituye solo a su versión vectorial.

| Archivo que entregar | Qué es | Tamaño | Fondo | Qué debe verse |
|---|---|---|---|---|
| `icono-fire.png` | Lanzar | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/fire.svg. Motivo: pelota volando hacia arriba a la derecha con tres estelas. Color del medallón: ámbar. Pixel art. |
| `icono-pass.png` | Pasar | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/pass.svg. Motivo: pelota que describe un arco con flecha hacia un compañero. Color del medallón: azul cielo. Pixel art. |
| `icono-catch.png` | Atrapar | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/catch.svg. Motivo: mano abierta bajo una pelota que llega. Color del medallón: turquesa. Pixel art. |
| `icono-dash.png` | Esquivar | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/dash.svg. Motivo: dos galones hacia la derecha con líneas de velocidad. Color del medallón: naranja tostado. Pixel art. |
| `icono-special.png` | Tiro imparable | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/special.svg. Motivo: pelota envuelta en una llama de cometa. Color del medallón: magenta. Pixel art. |
| `icono-gaze.png` | Mirada intensa | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/gaze.svg. Motivo: ojo grande con destellos encima. Color del medallón: violeta. Pixel art. |
| `icono-pase-expres.png` | Vega · Pase exprés | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/pase-expres.svg. Motivo: doble flecha de avance rápido empujando una pelota. Color del medallón: celeste. Pixel art. |
| `icono-iman.png` | Kai · Imán | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/iman.svg. Motivo: imán de herradura atrayendo una pelota. Color del medallón: rojo coral. Pixel art. |
| `icono-lectura.png` | Lúa · Lectura de juego | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/lectura.svg. Motivo: pizarra táctica con un aspa, un círculo y una flecha punteada. Color del medallón: verde. Pixel art. |
| `icono-zancada.png` | Neo · Zancada | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/zancada.svg. Motivo: rayo. Color del medallón: amarillo. Pixel art. |
| `icono-tirachinas.png` | Ada · Tirachinas | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/tirachinas.svg. Motivo: tirachinas con una pelota en la goma. Color del medallón: marrón anaranjado. Pixel art. |
| `icono-guante.png` | Max · Guante largo | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/guante.svg. Motivo: mano abierta dentro de un círculo de puntos que marca su alcance. Color del medallón: azul. Pixel art. |
| `icono-cometa.png` | Nora · Paso de cometa | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/cometa.svg. Motivo: cometa de rombo con su cola. Color del medallón: añil. Pixel art. |
| `icono-finta.png` | Leo · Segunda finta | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/finta.svg. Motivo: flecha circular de recarga con dos galones dentro. Color del medallón: naranja. Pixel art. |
| `icono-manos.png` | Iris · Manos listas | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/manos.svg. Motivo: dos manos abiertas con una estrella encima. Color del medallón: verde agua. Pixel art. |
| `icono-avance.png` | Bruno · Avance firme | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/avance.svg. Motivo: escudo con una pelota en el centro. Color del medallón: lila. Pixel art. |
| `icono-contraataque.png` | Sol · Contraataque | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/contraataque.svg. Motivo: flecha que da media vuelta, con una estrella. Color del medallón: rojo frambuesa. Pixel art. |
| `icono-relevo.png` | Teo · Relevo | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/relevo.svg. Motivo: testigo de relevos en diagonal con líneas de velocidad. Color del medallón: dorado. Pixel art. |
| `icono-salida.png` | Inés · Salida veloz | 192 × 192 | transparente | Medallón circular que llena el lienzo, pixel art de 48×48 ampliado ×4 sin suavizado. Degradado del color indicado con brillo arriba a la izquierda y contorno azul noche #17233b; motivo en crema #fff6da con contorno #17233b; la pelota, amarilla #ffd36b. Un solo motivo grande, legible a 46 px. Referencia de composición: mate/assets/abilities/salida.svg. Motivo: candado abierto con líneas de velocidad. Color del medallón: verde hoja. Pixel art. |

### Lote `04-pista-mate` · Pista de Mate Arena

Estilo pixel art. Necesita integración en mate/renderer.js (buildBackground).

| Archivo que entregar | Qué es | Tamaño | Fondo | Qué debe verse |
|---|---|---|---|---|
| `court.png` | Pista del partido | 1200 × 760 | opaco | Pabellón escolar visto desde arriba con ligera perspectiva de recreativa. Parqué claro; campo izquierdo con tinte turquesa y derecho con tinte coral; línea central y círculo central en crema; una franja de cárcel a cada lado. Grada con público al fondo. Geometría en píxeles: campo de juego de x 157 a 1043 y de y 150 a 640; línea central en x 600; círculo central de radio 88 en (600, 394); cárcel izquierda de x 60 a 150 y derecha de x 1050 a 1140; grada entre y 86 y 141; los 86 px superiores libres para el marcador y una banda oscura lisa en los 67 px inferiores. Pixel art. |

## Notas del ilustrador

_Si tienes dudas o propuestas, apúntalas aquí o díselas a Pablo._
