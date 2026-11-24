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

## Pendientes: 31

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

### Lote `16-pasillo` · El Pasillo: el tramo de pared y los cuadros de las curiosidades

El pasillo que une las puertas se recorre hacia los lados. Hoy se construye con piezas comunes (pared, cenefa, zócalo y parqué de comun/base.css) y cada curiosidad cuelga en un marco de madera con un dibujo prestado de otro lugar. Con este lote el pasillo pasa a estar pintado y cada cuadro tiene su propia ilustración. Se usan solos en cuanto están en assets/pasillo/pintados.js: hub.js cambia el dibujo prestado por el cuadro pintado y hub.css el fondo provisional por el tramo. Los textos de cada curiosidad están en curiosidades.js; el criterio, en docs/12-curiosidades.md.

| Archivo que entregar | Qué es | Tamaño | Fondo | Qué debe verse |
|---|---|---|---|---|
| `pasillo-tramo.png` | Un tramo del pasillo, que se repite | 1536 × 1024 | opaco | Un tramo de pasillo del mismo colegio que gimnasio/assets/gym.webp, visto completamente de frente, sin perspectiva ni puntos de fuga, porque la imagen se repite una al lado de otra para formar un pasillo largo: el borde izquierdo y el derecho deben casar exactamente. De arriba abajo: pared ocre melocotón lisa hasta el 53 % del alto, con una mancha suave de luz dorada en diagonal como la que entra por un ventanal; cenefa de azulejo azul y naranja del 53 % al 56 %; zócalo verde azulado del 56 % al 73 %; rodapié de madera miel del 73 % al 74 %; y parqué anaranjado del 74 % hasta abajo, con las tablas en horizontal. Sin puertas, ventanas, muebles, personajes ni texto: las puertas, los cuadros y los personajes los pone el juego encima. |
| `cuadro-corazon.png` | Cuadro: Tu corazón es un músculo | 600 × 720 | opaco | Una alumna recién llegada de correr, con una mano en el pecho y la otra tomándose el pulso en la muñeca, sonriente y algo sofocada. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-huesos.png` | Cuadro: Naces con más huesos de los que tendrás | 600 × 720 | opaco | Una lámina escolar de anatomía colgada en la pared con un esqueleto humano sencillo y amable de cuerpo entero, y un alumno al lado señalándose el codo. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-equilibrio.png` | Cuadro: El equilibrio está en el oído | 600 × 720 | opaco | Un alumno a la pata coja con los brazos abiertos y los ojos cerrados, concentrado, junto a su pupitre. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-musculos.png` | Cuadro: Los músculos trabajan por parejas | 600 × 720 | opaco | Una alumna doblando el brazo y tocándose el bíceps con la otra mano, con gesto de sorpresa divertida. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-agua.png` | Cuadro: Más de la mitad de tu cuerpo es agua | 600 × 720 | opaco | Un alumno bebiendo de una cantimplora metálica lisa tras el ejercicio, con una toalla al hombro. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-dormir.png` | Cuadro: Dormir también es entrenar | 600 × 720 | opaco | Una alumna dormida plácidamente en su cama, con las zapatillas de deporte y un balón a los pies de la cama y la luna en la ventana. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-sesenta.png` | Cuadro: Sesenta minutos al día | 600 × 720 | opaco | Tres alumnos moviéndose cada uno a su manera en el patio: una salta a la comba, otro baila y otra camina con la mochila. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-calentar.png` | Cuadro: Calentar es calentar de verdad | 600 × 720 | opaco | Un grupo de cuatro alumnos haciendo círculos de brazos en el gimnasio, en fila, siguiendo al profe Robles de espaldas. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-baloncesto.png` | Cuadro: El baloncesto nació con cestas de melocotones | 600 × 720 | opaco | Una cesta de mimbre de fruta clavada en lo alto de una barandilla de madera de un gimnasio antiguo, con un balón de cuero marrón entrando en ella. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-maraton.png` | Cuadro: 42 kilómetros y 195 metros | 600 × 720 | opaco | Una corredora y un corredor de fondo, de edad adulta, corriendo por una carretera entre olivos al amanecer, vistos de lado. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-olimpia.png` | Cuadro: Los primeros Juegos tenían una sola carrera | 600 × 720 | opaco | Un estadio de la antigua Grecia: una pista recta de tierra entre laderas de hierba, columnas de piedra al fondo y una corona de olivo en primer plano. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-yoga.png` | Cuadro: Yoga quiere decir unión | 600 × 720 | opaco | Una alumna en la postura del árbol sobre una esterilla turquesa, con un árbol de verdad detrás de la ventana en la misma forma. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-balon.png` | Cuadro: El balón clásico tiene 32 piezas | 600 × 720 | opaco | Un balón de fútbol clásico de hexágonos blancos y pentágonos negros en primer plano sobre el parqué, con un televisor antiguo apagado al fondo. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-volante.png` | Cuadro: Lo más rápido que sale de una raqueta | 600 × 720 | opaco | Un volante de bádminton de plumas en pleno vuelo, con líneas de velocidad, y una raqueta que acaba de golpearlo. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-comba.png` | Cuadro: Saltar a la comba es un deporte | 600 × 720 | opaco | Dos alumnas dando a una comba larga y un alumno saltando en el centro, con los pies en el aire. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-goalball.png` | Cuadro: Un deporte que se juega con el oído | 600 × 720 | opaco | Tres jugadores de goalball con antifaz opaco, tumbados de lado sobre el parqué para parar un balón azul con cascabeles. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-rayuela.png` | Cuadro: La rayuela se juega en medio mundo | 600 × 720 | opaco | Una rayuela pintada con tiza de colores en el suelo del patio, sin números, y una alumna saltando a la pata coja sobre ella. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-mate.png` | Cuadro: El mate tiene muchos nombres | 600 × 720 | opaco | Un partido de mate (balón prisionero) en el patio: un alumno esquiva agachándose una pelota blanda de espuma mientras otro la lanza desde el campo contrario. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo del colegio, sin marco dibujado, sin texto ni números. |
| `cuadro-bolos.png` | Cuadro: En Jaén los bolos salen volando | 600 × 720 | opaco | Una bolera de montaña entre pinos: un jugador de espaldas acaba de lanzar una bola de madera a ras de suelo y un bolo de madera sale volando por el aire. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-pinfuvote.png` | Cuadro: Un deporte inventado en Dos Hermanas | 600 × 720 | opaco | Tres alumnos a un lado de una red baja en el patio del cole: una golpea un balón con la rodilla, otro se prepara para darle con el pie y otra con la mano. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-huelva.png` | Cuadro: El club de fútbol más antiguo es de Huelva | 600 × 720 | opaco | Un partido de fútbol de finales del siglo XIX en un campo de tierra junto a una ría: jugadores con camisa de manga larga, pantalón por la rodilla y gorra, y un balón de cuero marrón con costuras. Sin escudos ni rótulos. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-flamenco.png` | Cuadro: El flamenco es Patrimonio de la Humanidad | 600 × 720 | opaco | Un corro de cuatro alumnos en el patio: dos dan palmas, una marca el compás con los pies y otro toca una guitarra española sentado en una silla de enea. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-senderos.png` | Cuadro: Blanco y rojo: vas por buen camino | 600 × 720 | opaco | Un sendero de sierra entre encinas con una roca en primer plano que lleva pintadas dos rayas horizontales, una blanca y otra roja; al fondo, dos alumnos con mochila y gorra caminando. Sólo las dos rayas, sin letras ni logotipos. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-sol.png` | Cuadro: El sol tiene nota: el índice UV | 600 × 720 | opaco | Una alumna en el patio a mediodía, bajo la sombra de un naranjo, poniéndose crema en la nariz, con gorra y gafas de sol, y una cantimplora lisa en el banco. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-agujetas.png` | Cuadro: ¿Mito o verdad? Las agujetas | 600 × 720 | opaco | Un alumno bajando las escaleras del cole con cara de «ay» divertida, agarrado a la barandilla y tocándose un muslo, al día siguiente de hacer deporte. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-flato.png` | Cuadro: Nadie sabe del todo qué es el flato | 600 × 720 | opaco | Una alumna que ha parado de correr en la pista, con una mano en el costado y respirando hondo, mientras al fondo siguen corriendo dos compañeros. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-voleysentado.png` | Cuadro: Aquí está prohibido levantarse | 600 × 720 | opaco | Cuatro jugadores sentados en el parqué a los dos lados de una red baja; una jugadora, sentada, golpea el balón por encima de la red con los brazos estirados. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-voy.png` | Cuadro: «¡Voy!», la palabra obligatoria | 600 × 720 | opaco | Dos jugadores de fútbol con antifaz opaco disputando un balón en una pista con vallas laterales bajas; uno tiene la boca abierta, avisando, y el balón lleva unas ondas de sonido dibujadas. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-zurdos.png` | Cuadro: Una de cada diez personas es zurda | 600 × 720 | opaco | Dos alumnos sentados en el mismo pupitre escribiendo, uno con la mano derecha y otra con la izquierda, con los codos chocando y riéndose. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |
| `cuadro-soccer.png` | Cuadro: «Soccer» es una palabra inglesa | 600 × 720 | opaco | Estudiantes de un colegio inglés del siglo XIX jugando al fútbol en un prado delante de un edificio de piedra, con jerséis de rayas y un balón de cuero marrón. Sin letras ni escudos. Es un cuadro que se cuelga enmarcado en la pared del pasillo: composición vertical, motivo centrado y grande, fondo sencillo, sin marco dibujado, sin texto ni números. |

## Notas del ilustrador

_Si tienes dudas o propuestas, apúntalas aquí o díselas a Pablo._
