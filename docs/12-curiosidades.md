# El Pasillo y las curiosidades

24 de noviembre de 2026. Cómo se recorre El Pabellón de lado y qué se descubre por el camino. Acompaña a la [hoja de ruta](08-hoja-de-ruta.md); lo que se anota está en [registro y notas](10-registro-y-notas.md) y las imágenes pedidas, en el lote `16-pasillo` del [encargo](../arte/ENCARGO.md).

## La idea

Hasta ahora el alumno entraba, elegía una puerta y ya está: el hub era un menú. Ahora es un **pasillo** que se recorre hacia los lados, y entre puerta y puerta cuelgan **cuadros**. Cada cuadro es una curiosidad: algo que no sabías sobre el cuerpo, la salud, los deportes, los juegos o su historia, contado en dos idiomas, y un movimiento corto para probarlo allí mismo.

Dos sentidos de «horizontal», los dos buscados:

1. **Se anda de lado.** El pasillo es más ancho que la pantalla. Se recorre arrastrando, con la rueda, con las flechas o con los dos botones redondos, y el personaje del alumno camina hasta lo que se toca.
2. **Atraviesa los lugares.** Las curiosidades no pertenecen a una actividad ni dan puntos. Son anchura, no nivel: no se «sube» nada, se va sabiendo más. Con el tiempo cada lugar tendrá las suyas y unas llevarán a otras.

## Cómo es una curiosidad

Una línea de `CURIOSIDADES` en [`curiosidades.js`](../curiosidades.js):

| Campo | Qué es |
|---|---|
| `id`, `tema` | Identificador y uno de los cinco temas: el cuerpo, salud, deportes, juegos, historia |
| `titulo`, `texto` | La curiosidad en español: un titular y dos o tres frases |
| `en` | Una frase en inglés británico que dice lo esencial; se puede escuchar |
| `prueba` | **Pruébalo**: un movimiento de menos de medio minuto, en el sitio, que tiene que ver con lo contado |
| `sentada` | La variante sentada, siempre a la vista |
| `segundos` | Opcional: pone un reloj de cuenta atrás |
| `fuente` | Quién lo afirma y la dirección donde se comprobó. La ficha enseña el nombre; sin fuente no entra |
| `arte` | Dibujo ya pintado de otro lugar que se usa mientras no llega su cuadro del lote `16-pasillo` |

Reglas para escribir una nueva:

- **Tiene que ser verdad y poder comprobarse.** Datos redondos y prudentes («más de 400 km/h», «entre 270 y 300», «unos 2.800 años»), sin récords que caducan ni cifras dudosas que circulan por internet. Si no se puede comprobar en una fuente seria, no entra.
- **Tiene que poder moverse.** Sin un «Pruébalo» relacionado y su variante sentada no es una curiosidad del pabellón: es un dato.
- **Sin riesgo.** Movimientos en el sitio, sin material, sin contacto obligatorio y sin apnea ni giros de cuello forzados. Los equilibrios con ojos cerrados, cerca de la mesa.
- **Sin personas reales en imagen** y sin marcas ni emblemas registrados (por eso no hay aros olímpicos). En el texto sí caben nombres históricos.
- **Inglés con función:** el vocabulario que hace falta para la actividad (partes del cuerpo, nombres de deportes y juegos), no una traducción de adorno.

Hoy hay 18, repartidas en los cinco temas. Hay una prueba que comprueba que todas tienen los dos idiomas, movimiento, variante sentada y dibujo.

## Cómo se descubren

- **En el pasillo.** Hay un cuadro antes de cada puerta y uno al final. Un cuadro sin descubrir lleva una etiqueta «?»; al tocarlo, el personaje camina hasta él y se abre la ficha. «¡Hecho! Al álbum» lo guarda y la etiqueta pasa a «✓».
- **Cambian cada lunes.** `delPasillo()` cuelga esta semana un tramo del banco y la siguiente el tramo de después, así que en tres semanas pasa el banco entero y cada lunes hay algo nuevo sin que nadie tenga que hacer nada. No hay servidor: se calcula con la fecha.
- **La curiosidad de hoy.** Tocar al profe Robles, que espera al principio del pasillo, abre el cuadro que corresponde al día. Pensado para empezar la sesión en la pantalla digital: dos minutos, toda la clase a la vez.
- **El álbum.** El botón «Curiosidades» y la puerta de El Vestuario enseñan lo descubierto, por temas, y lo que falta. El del alumno es suyo; el de la pantalla digital es el de la clase. Se guarda en el navegador (`pabellon-curiosidades`), aparte del registro.
- **Qué queda anotado.** `record('pasillo', 'curiosidades', 'descubre', {id, tema})`. Es evidencia, no nota: descubrir un cuadro no es superar un criterio. El despacho muestra cuántas lleva cada jugador.

## El pasillo por dentro

- La sala (pared ocre, cenefa, zócalo y parqué) es la clase `.sala` de `comun/base.css`, medida en centésimas del alto de la pantalla para que conserve sus proporciones en cualquier pantalla. El Tatami y el despacho usan la misma con la línea del suelo más baja.
- Puertas, cuadros y personajes van en una fila sobre la línea del suelo. La lista de puertas de cada forma de entrar está en `MAPS` de `hub.js`.
- `sideways()` de `comun/lugar.js` hace que cualquier fila se mueva de lado con rueda y botones. La usan el pasillo y la fila de posturas de El Tatami.
- En la pantalla digital no camina nadie: se toca y se abre. Con «reducir movimiento» activado, tampoco.
- Al volver de un lugar, el personaje está junto a la puerta por la que entró.

## Lo que sigue: más descubrimiento horizontal

Ideas ordenadas de más cercana a más lejana. Ninguna está empezada; se eligen con Pablo.

| Idea | Qué añade | Qué hace falta |
|---|---|---|
| **1. Cuadros dentro de cada lugar** | Dos o tres objetos tocables en cada escena (el espejo del tatami, la canasta del gimnasio, la copa de la pista, los cuadros del aula, el marcador de la grada) con curiosidades de ese lugar | Llevar la ficha de curiosidad a `comun/`, un campo `lugar` en el banco y la posición de cada objeto en su escena. Unas 3 curiosidades nuevas por lugar |
| **2. Unas llevan a otras** | La ficha del yoga ofrece «Ver el árbol en El Tatami»; la del balón prisionero, «Ir a La Pista»; una letra del rosco enseña el cuadro que la explica | Un campo `enlace` y que El Tatami abra una postura por dirección (`#postura=tree`) |
| **3. Rutas de la semana** | Tres cuadros unidos por un hilo («Así funciona tu corazón»). Completarla pone un sello en el álbum. Sin puntos ni clasificación | Tabla de rutas y sellos; un sello pintado por tema |
| **4. El profe elige el tema** | En el despacho, colgar esta semana los cuadros de un tema, a juego con la unidad que se está dando, en vez de la rotación automática | Ajuste en el despacho, guardado en el navegador de la pantalla |
| **5. El rosco repasa lo descubierto** | Tres letras del rosco salen de curiosidades que la clase ya tiene en el álbum | Una definición corta por curiosidad en el banco de La Pizarra |
| **6. Más cosas que cuadros** | El pasillo gana objetos de verdad: la fuente (hidratación), el tablón (reto de la semana), el plano del cole (El Circuito), el botiquín, la vitrina de trofeos de la clase | Imágenes propias; cada objeto es la puerta pequeña de un lugar de la reserva |
| **7. Tramos temáticos** | El pasillo crece por alas: la del cuerpo, la de los deportes, la de los juegos de Andalucía. Al fondo se ven las puertas que están por abrir | Más curiosidades (objetivo: 40) y el tramo pintado del lote `16-pasillo` |
| **8. Curiosidades de casa** | Juegos populares andaluces, el flamenco como actividad física, deportes que se practican en la comarca | Documentarse bien; decidir con Pablo qué es de aquí |
| **9. Con otras áreas** | Cuadros que tocan Matemáticas (medir 42,195 km, contar pulsaciones), Conocimiento del Medio (huesos, músculos) e Inglés. Posible puente con La Lupa | Hablarlo en `intercambio/` antes de tocar nada |

Lo que **no** se va a hacer: puntos, monedas, rachas diarias ni clasificaciones por curiosidades. El premio es saberlo y haberlo probado.
