# El Álbum del Pabellón: descubrir, coleccionar y desbloquear

22 de noviembre de 2026. Documento de diseño, **pendiente de que Pablo lo apruebe**. No hay nada programado. Acompaña al [plan del hub](08-hoja-de-ruta.md) y a [registro y notas](10-registro-y-notas.md); las imágenes que necesita están pedidas en los lotes 16 a 20 del [encargo de imágenes](../arte/ENCARGO.md).

## 1. La idea en una página

Robles le da a cada jugador un **álbum de cromos**. Casi todos los huecos están vacíos: se ve la silueta de lo que falta y, debajo, una nota a lápiz del profe que dice dónde buscar. Jugar llena el álbum, y algunos cromos abren lugares y juegos nuevos.

- **Todo es un cromo.** Los lugares, los juegos, el material, lo que va en el neceser, los movimientos del calentamiento, los gestos de juego limpio y los objetos que Robles va perdiendo por el pabellón.
- **El álbum es el listado.** Un cromo de lugar o de juego ya pegado es un botón: se toca y se entra. Uno sin pegar es una silueta con su pista.
- **Nada es al azar.** No hay sobres ni cromos repetidos. Cada cromo se consigue con una acción concreta y siempre la misma, y la pista dice cuál.
- **Las normas van antes que el videojuego.** Para jugar en el ordenador a un juego de Educación Física, primero se aprenden las normas del juego de verdad, el que se hace en la pista, con láminas pintadas. Robles entrega entonces **el peto** de ese juego.
- **La clase tiene su propio álbum:** un **mural de azulejos** en la pantalla digital que se completa entre todos.

Por qué un álbum: es un objeto de colegio real, lo conocen todos, ya trae la silueta del cromo que falta y no necesita explicación. Se guarda en la taquilla, así que da contenido a El Vestuario, que en la hoja de ruta era sólo un botón.

## 2. El álbum

### 2.1 Qué se colecciona

| Página | Cromos | Cómo se consiguen | Arte |
|---|---|---|---|
| **Lugares y juegos** | Uno por lugar y por juego (hoy 7 lugares; con este plan, unos 16) | Entrando por primera vez, o cumpliendo lo que abre ese lugar (apartado 3) | Las puertas `assets/door-*.webp` que ya existen |
| **El material** | 10 ahora (cono, aro, cuerda, raqueta, peto, colchoneta, saquito, y los tres balones); 6 más adelante | Guardando cada objeto en *Equipment Rescue*. El dorso del cromo («así sí, así no») se completa en *Cada cosa, a lo suyo* | Los `gimnasio/assets/prop-*.webp` que ya existen |
| **El neceser** | 14 | Metiendo bien cada objeto en *El Neceser* | Lote 17 |
| **El pabellón seguro** | 6: la puerta despejada y la colchoneta en su sitio (de *Equipment Rescue*), la señal de suelo mojado, la fregona, el felpudo y el banco de las botellas | *Equipment Rescue* y *Ni una gota* | `risk-*.webp` y lote 19 |
| **En marcha** | 8 movimientos del calentamiento | Usando cada uno en un calentamiento bien montado | Lote 20 |
| **Los petos** | Uno por juego real cuyas normas se saben (mate, pelota sentada, pichi…) | *La charla del banquillo* | Lote 18 |
| **Juego limpio y equipo** | 8 gestos: reconocer que te han dado, ayudar a levantarse, pasar a quien no ha tirado, aceptar la decisión, animar al que falla, parar si alguien se cae, saludar al acabar, recoger entre todos | *Tarjeta verde* y *Todos a una* | Se pedirá con esos juegos |
| **Los despistes de Robles** | 8 objetos que Robles ha perdido: gorra, cronómetro, carpeta, gafas de sol, llaves, bocadillo, taza y bomba de inflar | Encontrándolos escondidos en las escenas pintadas | Lote 16 |

En total, unos 75 cromos cuando todo exista. **El álbum sólo enseña páginas y huecos de cosas que ya se pueden conseguir**: no hay siluetas de juegos sin programar.

### 2.2 Cómo se ve

- **Dónde está.** Un botón con el álbum junto a la cara del jugador en el mapa de puertas, y dentro de El Vestuario. Se abre a pantalla completa como un libro: doble página a 1280 × 720, una página con pestañas laterales a 390 × 844.
- **Cromo pegado.** La imagen a color con su nombre en español y en inglés. Al tocarlo se da la vuelta: el dorso cuenta en dos líneas para qué sirve. Si es un lugar o un juego, el dorso tiene un solo botón grande, «Entrar».
- **Hueco vacío.** La silueta en gris del objeto real (la misma imagen, oscurecida con CSS) o, si enseñarla estropea la sorpresa, un interrogante. Debajo, la pista a lápiz.
- **Hueco con candado.** Un lugar que el profe tiene cerrado para esa clase. Dice «Tu profe abrirá esta puerta», sin más.
- **Sellos.** Cada cromo de juego tiene tres círculos para los sellos de maestría (apartado 6).
- **Cuenta.** En cada página, «7 de 14» escrito a lápiz. No hay porcentaje global ni barra de progreso: es un álbum, no un panel.

### 2.3 Las pistas: intriga honesta

Una pista dice **dónde** y **qué clase de cosa hay que hacer**, nunca engaña y nunca depende de la suerte ni de la fecha.

| Hueco | Pista de Robles |
|---|---|
| Cromo del aro | «Está en el cuarto de material. Se cuelga, no se pisa.» |
| La Fuente | «Cuando sepas preparar tu neceser, te enseño dónde se bebe.» |
| El peto del mate | «Siéntate conmigo en el banquillo y miramos las láminas.» |
| El cronómetro perdido | «Lo usé para medir un equilibrio. Donde las esterillas.» |
| Sello de la naranja de El Neceser | «Prepárale la bolsa a otro. Cada día necesita una cosa.» |

Prohibido en las pistas: «muy pronto», «sólo hoy», «casi lo tienes», cuentas atrás y cualquier cosa que no se pueda conseguir ya.

### 2.4 Robles y el corcho

El vestuario pintado (`mate/assets/pista/vestuario.webp`) ya tiene un tablón de corcho. Ahí Robles deja como mucho **tres notas**:

1. **La pista de la semana:** destaca uno de los huecos vacíos del jugador. El cromo estaba disponible antes y lo seguirá estando después; la nota sólo orienta.
2. **El reto del corcho:** una propuesta para volver a un juego ya abierto (apartado 6).
3. **Lo último que has pegado.**

La primera vez que el alumno entra, Robles le entrega el álbum con un cromo ya puesto: el de su personaje.

### 2.5 Los despistes de Robles

Ocho objetos pequeños escondidos en las escenas: uno en el gimnasio, dos en el cuarto de material, uno en el vestuario, uno en La Pizarra, uno en El Tatami, uno en La Fuente y uno en la pared de las puertas. Están siempre en el mismo sitio y a la vista de quien mira con atención (medio tapados por un banco, en una balda). Tocarlo lo pega en el álbum y Robles da las gracias. No dan nada más que el cromo y la gracia de buscarlos; el octavo abre el dorso secreto del cromo de Robles.

### 2.6 Cómo encaja con la taquilla

El Vestuario pasa a ser un lugar con puerta (`assets/door-vestuario.webp` ya está pintada). Dentro, tres cosas y nada más: **la taquilla** (lo que hay hoy: personaje, lo hecho, «Recuperar mi progreso», «No soy yo»), **el álbum** y **el banco con el neceser** (el primer juego nuevo). Las «insignias» que la hoja de ruta preveía para la taquilla son los sellos del álbum.

## 3. Árbol de desbloqueos

Tres reglas:

1. **Lo que hoy está abierto sigue abierto.** Gimnasio, Pista, Pizarra y Tatami no se cierran a nadie.
2. **Cadenas cortas y con sentido.** Cada llave se gana con un juego de unos cinco minutos, y lo que abre tiene que ver con lo aprendido.
3. **El profe puede abrir cualquier cosa** a una clase sin que la jueguen (apartado 9). La intriga no puede estorbar a una sesión.

```
Entrar por primera vez ──► El Álbum + El Vestuario
│
├─ EL VESTUARIO
│   El Neceser ──(sello 1)──► La Fuente: Ni una gota
│
├─ EL GIMNASIO
│   Equipment Rescue (ya abierta) ──(completada)──► Cada cosa, a lo suyo
│        └─(sello 1)──► Motores en marcha
│               └─(sello 1)──► secuencia «Vuelta a la calma» en El Tatami
│
├─ LA PISTA
│   El Banquillo (abierto desde el principio)
│     ├─ Charla del mate ──(peto)──► salas de Mate Arena
│     ├─ Charla de la pelota sentada ──(peto)──► su juego de ordenador, cuando exista
│     ├─ Charlas de pichi, pinfuvote, baloncesto… ──(peto)──► ídem
│     └─ con el primer peto ──► Tarjeta verde ──(sello 1)──► Todos a una
│
└─ Seis juegos con su primer sello ──► El Patio Cubierto (reserva de la hoja de ruta)
```

El mapa de puertas sigue enseñando **cuatro puertas como mucho**. El resto de lo abierto se alcanza desde el álbum: por eso el álbum es también el acceso rápido.

### 3.1 Normas primero, luego el ordenador

Regla general para todos los juegos de ordenador que representan un juego de Educación Física:

1. El juego real tiene su **charla en El Banquillo**: las normas con las que se juega en la pista de verdad, contadas con láminas pintadas (apartado 5.5).
2. Quien demuestra que las entiende recibe **el peto** de ese juego: un cromo, y la llave de su versión de ordenador.
3. Lo que se aprende y lo que queda anotado son **las normas del juego físico**, no los controles del videojuego. El videojuego es el premio y un sitio donde volver a ver esas normas en acción.
4. Si la versión de ordenador cambia algo respecto a la pista (en Mate Arena hay «definitivas» y recarga de la esquiva), lo dice una sola tarjeta al final de la charla: «En el ordenador, además…». No se pregunta.

### 3.2 Catálogo de juegos del patrón

| Juego real | Versión de ordenador | Normas | Láminas |
|---|---|---|---|
| **Mate** (balón prisionero) | Mate Arena, en La Pista. Ya existe | La versión común, **a confirmar por Pablo** (5.5) | Pedidas, lote 18 |
| **Pelota sentada** | Por hacer | Las que ha dado Pablo (5.5) | Pedidas, lote 18 |
| **Pichi** (béisbol con los pies) | Por hacer | **A confirmar por Pablo**: tiene variantes locales | Se pedirán cuando estén las normas |
| **Pinfuvote** | Por hacer | **A confirmar por Pablo** | Ídem |
| **Baloncesto** | Por hacer | Las generales, y la versión de clase **a confirmar por Pablo** | Ídem |
| Los que lleguen | — | Misma ficha | Misma plantilla |

Sobre la pelota sentada en el ordenador: sentarse es parte del juego y quien está sentado sigue jugando, porque vuelve si toca a quien pasa cerca. La versión de ordenador tiene que conservarlo: el jugador sentado mantiene el control y una acción propia (tocar), y nunca se queda mirando.

### 3.3 Mate Arena sin quitar el acceso a nadie

Mate Arena ya se juega, así que la regla nueva entra con cuidado:

- **El entrenamiento contra la máquina sigue libre** para todos, siempre.
- **Crear una sala o entrar en una** pide el peto del mate. Quien no lo tiene ve el banquillo con Robles: «Antes de jugar con la clase, repasamos las normas. Son tres minutos».
- **Veteranos.** Quien ya tenga un partido anotado (`pista`, `mate`, `partido`) en ese ordenador o recuperado de la hoja recibe el peto sin charla: «A ti ya te he visto jugar». La charla le sigue esperando en el álbum para ganar sus sellos.
- **El profe decide.** En el despacho, «Normas primero» se puede apagar por juego, y un enlace de sesión (apartado 9) abre las salas a toda una clase.

El coste máximo para quien cambia de ordenador sin hoja conectada es repetir una charla de tres minutos.

## 4. Lugares

| Lugar | Qué hay | Estado | Puerta |
|---|---|---|---|
| **El Vestuario** | Taquilla, álbum, corcho de Robles y *El Neceser* | En la hoja de ruta como botón. Pasa a lugar | Ya pintada. Fondo: el vestuario de Mate |
| **El Banquillo** | Normas de los juegos reales, *Tarjeta verde* y *Todos a una* | Nuevo. Es la antesala de La Pista: se entra desde ella y desde el álbum, sin puerta propia en el mapa | Pedida (lote 18), para el cromo |
| **La Fuente** | *Ni una gota* | Nuevo, pequeño | Pedida (lote 19) |
| **El Gimnasio** | Se le añaden dos misiones: *Cada cosa, a lo suyo* (cuarto de material) y *Motores en marcha* (pista central) | Abierto. Son la «segunda misión» de la fase F | La que tiene |
| El Patio Cubierto | Juegos populares; aquí irían los juegos de ordenador nuevos que no sean de pista | Reserva. Final del árbol | — |
| El Botiquín | *¿Y ahora qué?*: qué hacer ante un golpe, una caída o un mareo (siempre: parar y avisar a un adulto) | Reserva. No entra en este plan | — |
| La Vitrina, El Armario de los candados, El Circuito, La Sala de Espejos | Sin cambios | Reserva | — |

La Vitrina de la reserva («logros de la clase») queda cubierta por el mural de azulejos (apartado 8); se puede retirar de la lista.

## 5. Los juegos nuevos

Convenciones comunes a todos:

- **En el ordenador del alumno**, una aventura corta al modo de *Equipment Rescue*: escena pintada, Robles pide algo, se toca o se arrastra, y un fallo se explica y se repite sin perder nada. De 4 a 6 minutos por nivel.
- **En la pantalla digital**, una versión de clase con **movimiento real**: toda la clase responde a la vez con el cuerpo, la variante sentada está dibujada al lado, nadie queda eliminado y nadie espera turno.
- **Cuatro niveles** por juego: los tres primeros dan un sello cada uno; el cuarto es la **ronda libre**, que no se acaba (apartado 6).
- **Inglés británico** sólo donde hace falta para jugar: nombres de objetos, partes del cuerpo y consignas cortas, con el mismo botón de escuchar que el gimnasio.
- **Anotación.** Cada nivel terminado escribe una línea con `record(lugar, actividad, 'nivel', {nivel, aciertos, intentos, pistas})`. Los datos son números y textos cortos, como exige el registro.
- **Notas.** Ningún juego nuevo da nota hasta que Pablo añada su línea a `notas.js`. Las referencias al currículo son orientativas: se nombran la competencia específica y el sentido del criterio (Real Decreto 157/2022 y su desarrollo andaluz), y **el número exacto del criterio hay que comprobarlo en la Orden antes de usarlo**.

### 5.1 El Neceser · *What's in my wash bag?*

**Lugar:** El Vestuario. **Tema:** higiene personal después de la actividad física.

**Cómo se juega.**
1. Robles, junto al banco: «Después de Educación Física toca asearse. ¿Me ayudas a preparar la bolsa?». Sobre el banco, el neceser abierto y diez objetos barajados.
2. Se toca o se arrastra cada objeto al neceser. Si va, entra y suena su nombre en inglés (*towel*). Si no va, vuelve al banco y Robles dice por qué en una frase («El frasco es de cristal: en un vestuario se rompe y corta»).
3. Con la bolsa hecha, **¿para qué sirve?**: tres objetos y tres momentos (al acabar la clase, antes de salir al patio con sol, al llegar a casa) que hay que emparejar.
4. Una pregunta de cierre del banco y los cromos de lo que se ha metido bien.

**La teoría, en tres carteles:** al movernos sudamos, y el sudor no huele, pero al quedarse en la piel y en la ropa sí; lavarse y cambiarse de camiseta es cuidarse y cuidar a quien se sienta al lado; la toalla, el peine y la botella no se comparten.

**Preguntas (banco de 20, salen 1 o 2).** «¿El desodorante sustituye a lavarse?» «¿Qué haces con la camiseta sudada?» «¿Por qué de bola y no en espray en un vestuario cerrado?» «¿Cuándo te lavas las manos?»

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · La bolsa de hoy | 6 imprescindibles entre 10; los intrusos son evidentes (consola, chucherías) |
| 2 · Depende del día | Una nota en el corcho dice el plan: patio con sol, pabellón un día de lluvia, excursión. 8 entre 14; algunos objetos sólo van ese día (gorra y crema; calcetines de repuesto) y otros van a la mochila, no al neceser. Las consignas llegan en inglés: *Pack the towel* |
| 3 · La rutina | Ordenar los pasos al acabar la clase (quitarse la camiseta sudada, lavarse, secarse, desodorante, camiseta limpia, ropa sudada a su bolsa, beber agua) y los cinco pasos de lavarse las manos |
| 4 · La bolsa de otro (ronda libre) | Tres neceseres ya hechos por Kai, Nora y Leo, cada uno con un fallo que encontrar y arreglar: falta algo, sobra algo, o la toalla mojada de la semana pasada sigue dentro. Banco de 12 casos |

**En la pantalla: Neceser en movimiento.** Sale un objeto grande. Si va en la bolsa, salto con palmada (sentado: brazos arriba); si no, giro con brazos cruzados (sentado: brazos cruzados y torso a un lado). A la cuenta de tres se descubre. Diez objetos, cuatro minutos.

**Inglés:** *wash bag, towel, soap, deodorant, clean T-shirt, comb, water bottle, socks, sun cream, cap, tissues, flip-flops*.

**Anota:** `record('vestuario', 'neceser', 'nivel', …)`. **Evidencia posible:** hábitos de higiene corporal ligados a la práctica (competencia específica 1, vida activa y saludable; saberes del bloque A).

**Da:** los 14 cromos del neceser (6 en el nivel 1, 4 en el 2, 4 en el 3), tres sellos y, con el primero, **La Fuente**.

### 5.2 Ni una gota · *Wet floor!*

**Lugar:** La Fuente, y el gimnasio pintado como escenario. **Tema:** por qué no se bebe en cualquier parte del gimnasio.

**Cómo se juega,** en tres escenas:
1. **Revisa la pista.** El gimnasio antes de empezar. Hay tres cosas mojadas que encontrar: un charco, un reguero de gotas y una botella volcada. Al tocar cada una se elige qué hacer, en orden: poner la señal, avisar al profe, secar. Seguir jugando no es una opción que funcione: si se elige, se ve a un personaje que frena a tiempo y Robles explica por qué.
2. **¿Dónde dejo la botella?** Cuatro botellas y varios sitios: el banco de las botellas, la línea de fondo, encima de las colchonetas, junto a la pantalla y los enchufes. Sólo vale el banco, cerradas.
3. **¿Cuándo bebo?** La línea de una clase (antes, la pausa que marca el profe, al acabar) donde colocar los tragos. Se bebe en la fuente o en el banco, a sorbos, cada uno de su botella.

**La teoría:** el parqué mojado resbala y quien viene corriendo no lo ve; el agua y los enchufes no se juntan; beber sí, en su sitio y en su momento.

**Preguntas:** «¿Por qué no se bebe en mitad de la pista?» «Has derramado agua tú, ¿qué haces?» «¿Avisar de un charco es chivarse?»

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · La pista seca | Lo de arriba, con tres puntos mojados evidentes |
| 2 · Día de lluvia | Se entra del patio: zapatillas mojadas que secar en el felpudo, goteo junto a la puerta, una mochila con la botella abierta al lado de la pantalla. Cinco puntos, menos visibles |
| 3 · Revisión completa | Seis puntos repartidos entre el gimnasio, la puerta y la fuente, con un reloj que cuenta hacia arriba y deja «tu marca»; no hay tiempo límite |
| 4 · ¿Qué harías? (ronda libre) | Casos con matices: un compañero derrama y no dice nada; el charco está en el otro campo; el profe está ocupado; queda un minuto de partido. Banco de 12 |

**En la pantalla: Charco a la vista.** La clase trota en el sitio (sentados: marcha con rodillas). Cuando en la pantalla aparece agua en el suelo, todos se quedan de estatua y señalan; cuando Robles lo seca, se sigue. Seis rondas con cambios de ritmo.

**Inglés:** *Wet floor! · Tell the teacher · bottle · bench · Don't run*.

**Anota:** `record('fuente', 'ni-una-gota', 'nivel', …)`. **Evidencia posible:** reconocer riesgos y actuar con precaución antes, durante y después de la práctica (competencia específica 1; es el mismo sentido que el criterio que ya usa *Equipment Rescue*).

**Da:** cuatro cromos de «El pabellón seguro» y tres sellos.

### 5.3 Cada cosa, a lo suyo · *The right tool*

**Lugar:** el cuarto de material de El Gimnasio. **Tema:** uso correcto del material.

**Cómo se juega.**
1. Robles saca un objeto del carro y propone una acción con un pictograma: botar, chutar, lanzar, saltar por encima, golpear, sentarse encima, arrastrar, colgarse.
2. El alumno lleva la tarjeta a uno de tres carteles: **Así sí**, **Así no** o **Pregunta al profe**.
3. Si es «así no», elige el porqué entre tres dibujos: se estropea, puede hacer daño, o está hecho para otra cosa.
4. Al acertar se escribe el dorso del cromo de ese material.

Ejemplos: el balón de baloncesto se bota y se lanza con las manos, no se chuta (es duro y pesa: daña el pie, a quien le dé y al balón); el aro no se pisa de canto ni se cuelga del cuello; la colchoneta se lleva entre dos y no se arrastra; la cuerda no se ata a nadie; antes de mover la raqueta se mira alrededor; el cono no es un megáfono.

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · Sí o no | Los 10 objetos, cada uno con una acción clara |
| 2 · ¿Y por qué? | Se añade el porqué, cómo se transporta y dónde se guarda (enlaza con *Equipment Rescue*) |
| 3 · Elige el material | Robles describe un juego y un sitio («lanzar a una diana dentro del aula») y hay que escoger con qué: pelota blanda, no balón de baloncesto |
| 4 · ¿Qué harías? (ronda libre) | Casos: un compañero chuta el balón de baloncesto, un aro está rajado, sobran pelotas por el suelo durante el juego. Banco de 14 |

**En la pantalla: Sí, no, depende.** Sale el objeto con su acción. Sí: de pie con brazos en uve. No: sentadilla. Pregunta al profe: equilibrio sobre un pie con la mano levantada. Sentados: brazos arriba, brazos cruzados, mano levantada.

**Inglés:** *bounce, kick, throw, carry, hang up, put away*, y los nombres del material que ya enseña el gimnasio.

**Anota:** `record('gimnasio', 'cada-cosa', 'nivel', …)`. **Evidencia posible:** uso seguro y responsable del material, el mismo criterio que hoy alimenta *Equipment Rescue*. Es la candidata más clara a entrar en `notas.js`.

**Da:** los dorsos de los 10 cromos de material, tres sellos y, con el primero, **Motores en marcha**. Arte: reutiliza los `prop-*.webp`; los ocho pictogramas de acción se hacen con formas simples.

### 5.4 Motores en marcha · *Warm-up time*

**Lugar:** la pista central de El Gimnasio. **Tema:** por qué y cómo se calienta.

**La teoría, en tres carteles con dibujo:** al calentar, el corazón late más deprisa y lleva más oxígeno a los músculos; los músculos y las articulaciones se mueven mejor cuando están calientes; así el cuerpo rinde más y es más difícil hacerse daño. Un calentamiento tiene tres partes: **mover las articulaciones**, **activar** poco a poco y **prepararse para el juego** que toca. Los estiramientos largos se dejan para la vuelta a la calma.

**Cómo se juega.**
1. Los tres carteles, con Vega haciendo cada cosa.
2. **Monta el calentamiento.** Una fila de seis huecos y un mazo de tarjetas de movimiento. Se colocan en orden.
3. **Robles lo prueba.** Vega lo ejecuta tarjeta a tarjeta. Si está bien ordenado, llega al final sonriendo. Si empieza a tope o se salta las articulaciones, Robles para y señala la tarjeta que hay que mover.
4. **Hazlo de verdad.** La pantalla guía el calentamiento montado con cuenta de repeticiones, y el alumno lo hace de pie junto a su silla, o sentado, con la variante dibujada al lado. Usa el mismo guiado que las secuencias de El Tatami.
5. Dos preguntas del banco.

**Preguntas (banco de 20):** «¿Qué va primero?» «¿Calentar es correr a tope?» «Hoy toca saltar a la comba: ¿qué articulación no puede faltar?» «¿Para qué sirve la vuelta a la calma?»

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · En orden | Seis tarjetas dadas; sólo hay que ordenarlas en las tres partes |
| 2 · Con intrusos | Doce tarjetas, tres de ellas intrusas (esprint a tope, estiramiento largo, quedarse sentado mirando) |
| 3 · Calienta para… | El calentamiento se adapta a lo que viene: mate (hombros y muñecas), comba (tobillos), yoga (suave y articular) |
| 4 · ¿Qué le ha faltado? (ronda libre) | Calentamientos de Kai, Ada o Max con un fallo que arreglar, y **crear el de la clase**: se guarda con un código, como las secuencias de yoga, y se puede proyectar |

**En la pantalla: El calentamiento de la clase.** Es el uso más directo: la pantalla guía a todo el grupo cuatro o cinco minutos, con la variante en silla siempre visible. Puede ser uno preparado o el que ha montado un alumno. Sirve para empezar cualquier sesión, llueva o no.

**Inglés:** *ankles, knees, hips, shoulders, wrists, neck; circle, bend, stretch, jog on the spot*.

**Anota:** `record('gimnasio', 'calentamiento', 'nivel' | 'creado' | 'practicado', …)`. **Evidencia posible:** preparación de la práctica motriz y hábitos saludables (competencia específica 1; saberes de los bloques A y B).

**Da:** los 8 cromos de «En marcha», tres sellos y, con el primero, la secuencia «Vuelta a la calma» en El Tatami.

### 5.5 La charla del banquillo · *Rules first*

**Lugar:** El Banquillo. **Tema:** las normas de cada juego **tal como se juega en la pista**, antes de abrir su versión de ordenador.

**Cómo es: mucha imagen y poco texto.** Un caballete con una lámina pintada por norma y, debajo, una sola línea. Las preguntas también son láminas.

1. **Las láminas.** Robles pasa de 8 a 14 láminas. Cada una enseña una norma con una situación de juego. Las que tienen gesto permitido y gesto no permitido se enseñan en pareja, con el mismo encuadre y una marca pintada de «así sí» o «así no» en la esquina.
2. **Colócalos.** La lámina del campo visto desde arriba, y fichas de jugador que arrastrar: dónde va cada equipo, dónde va quien ha sido tocado.
3. **¿Vale o no vale?** Cinco láminas de situación sacadas del banco, sin marca. Con cuatro aciertos de cinco, Robles entrega el peto. Si no, se repasa la lámina fallada y salen otras cinco. No hay límite de intentos.
4. **En el ordenador, además…** Una tarjeta con lo que cambia en el videojuego, sólo si cambia algo.

**Ficha de normas, igual para todos los juegos.** Cada juego rellena estos apartados, y cada apartado es una lámina o una pareja:

| N.º | Apartado | Qué enseña la lámina |
|---|---|---|
| 1 | Campo y colocación | El espacio visto desde arriba, los equipos y las zonas |
| 2 | A qué se juega | El objetivo en una sola acción |
| 3 y 4 | El gesto | Cómo se hace bien y el mismo gesto mal hecho |
| 5 a 9 | Qué pasa si… | Las situaciones clave del juego |
| 10 | Lo dices tú | Reconocer uno mismo la jugada |
| 11 | Si alguien se cae o se hace daño | El juego se para y se avisa |
| 12 | Juega todo el equipo | Que la pelota y los turnos pasen por todos |
| 13 | Al acabar | Saludarse y recoger el material |

Los apartados 10 a 13 son comunes a todos los juegos: respeto al compañero, seguridad y recogida.

**Mate (balón prisionero).** Versión común del juego, la que dibujan las 14 láminas pedidas. **Pablo confirma o corrige cada línea antes de enviar el lote**, porque cada centro tiene sus variantes:

| Lámina | Norma |
|---|---|
| Campo | Dos equipos, cada uno en su campo, separados por la línea central. Detrás de cada campo, la cárcel del equipo contrario |
| Objetivo | Tocar con la pelota a los del otro equipo |
| Así sí / así no | Se tira de hombros para abajo. Nunca a la cabeza |
| Tocado / bote | Si la pelota te da sin botar, estás tocado. Si bota antes, no vale |
| Atrapar | Si la atrapas en el aire, sigues jugando |
| Línea | No se pisa la línea ni se sale del campo |
| Cárcel | Quien está tocado va a la cárcel andando por fuera y con la mano levantada |
| Salvarse | Desde la cárcel, si tocas a un rival, vuelves a tu campo |
| Lo dices tú | Si te dan, lo reconoces tú |
| Caída | Si alguien se cae, el juego se para y se avisa al profe |
| Pasar | La pelota pasa por todo el equipo |
| Final | Al acabar, nos saludamos y recogemos |

**Pelota sentada.** Sólo las normas que ha dado Pablo; las láminas pedidas son cuatro:

| Lámina | Norma |
|---|---|
| Campo | Como el mate, pero sin equipos: cada uno juega por su cuenta |
| Sentado | Si te dan, te sientas en tu sitio |
| Cambio | Si alguien pasa cerca de quien está sentado, este puede tocarlo y se intercambian |
| Pasos | Con la pelota en la mano, tres pasos como máximo |
| Resto de la ficha | **A confirmar por Pablo:** qué pasa si la pelota bota antes, si se puede atrapar, a qué altura se tira y cómo termina |

**Pichi (béisbol con los pies).** Ficha preparada y vacía. **Todas las normas, a confirmar por Pablo:** campo y bases, quién golpea y en qué orden, cómo se consigue una carrera, cómo se elimina y cuándo se cambia de papel.

**Pinfuvote.** Ficha preparada y vacía. **Todas las normas, a confirmar por Pablo:** campo y red, número de toques y de botes, con qué partes del cuerpo se puede golpear, saque y puntuación.

**Baloncesto.** De conocimiento general: dos equipos, se puntúa encestando en la canasta contraria, el balón se juega con las manos y no con los pies, para avanzar con el balón hay que botarlo, y no se empuja ni se agarra. **A confirmar por Pablo** la versión de clase: tamaño de los equipos, cómo se cuentan los pasos y los dobles, si hay pases obligatorios antes de tirar.

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · Las láminas | Lo descrito arriba. Da el peto |
| 2 · Árbitro | Parejas de láminas antes y después: decidir qué pasa a continuación |
| 3 · Con la clase | Situaciones que no son de reglamento sino de convivencia: «dice que no le he dado», «siempre tiran los mismos», «se ha caído y vamos ganando» |
| 4 · Mezcla (ronda libre) | Láminas de todos los juegos cuyo peto se tiene, barajadas |

**En la pantalla: Repaso de normas.** Tres minutos antes de salir a jugar de verdad. La lámina ocupa toda la pantalla; la clase responde con el cuerpo (vale: de pie con brazos en uve; no vale: sentadilla; sentados: brazos arriba o cruzados), y se descubre la respuesta. Es el uso que más acerca el hub a la sesión real.

**Inglés:** poco y de pista: *in, out, catch, throw, pass, stop*.

**Anota:** `record('banquillo', 'normas', 'nivel', {juego, nivel, aciertos, intentos})` y `record('banquillo', 'normas', 'peto', {juego})`. **Evidencia posible:** conocer y respetar las normas y reglas del juego, y actuar con deportividad (competencia específica 3; saberes de los bloques C y D). Es una evidencia de **comprensión**; que se cumplan en la pista sólo lo ve el profe.

**Da:** el peto de cada juego (cromo y llave de su versión de ordenador), tres sellos por juego y, con el primer peto, *Tarjeta verde*.

### 5.6 Tarjeta verde · *Fair play*

**Lugar:** El Banquillo. **Tema:** juego limpio. La tarjeta verde, que en el deporte escolar premia el buen gesto, es aquí la única tarjeta: el juego consiste en **reconocer lo que está bien**, no en señalar a nadie.

**Cómo se juega.**
1. **Caza el gesto.** Una escena de partido con varios alumnos. Se toca a quien merece tarjeta verde: el que ayuda a levantarse, la que reconoce que le han dado, el que pasa a quien no había tirado.
2. **¿Qué harías tú?** Una situación en una viñeta y tres respuestas. Cada una enseña su consecuencia en una segunda viñeta: el juego sigue, o se para y se discute. Robles comenta la elegida sin poner nota a la persona.
3. Una pregunta de cierre.

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · Caza el gesto | Tres gestos por escena, evidentes |
| 2 · ¿Qué harías? | Dilemas claros: te han dado y nadie lo ha visto; un compañero falla y otros se ríen; ganáis y el otro equipo tiene uno menos |
| 3 · Con matices | Las tres respuestas tienen algo bueno. Se elige una y su razón; Robles las comenta todas. Cuenta como participación, no como acierto |
| 4 · Cambia la norma (ronda libre) | Un juego con un problema («siempre tiran los mismos») y tres normas nuevas posibles: elegir la que lo arregla. Banco de 12 |

**En la pantalla: La tarjeta verde de la clase.** El dilema, grande. Cada respuesta es una postura (A: equilibrio; B: brazos en cruz; C: cuclillas; sentados, tres posiciones de brazos). Todos responden a la vez, se mira qué ha salido más y se habla medio minuto. No se anota quién eligió qué.

**Anota:** `record('banquillo', 'tarjeta-verde', 'nivel', …)`. **Evidencia posible:** deportividad, juego limpio y resolución dialogada de conflictos (competencia específica 3; bloque D). Sólo como evidencia de reflexión: el juego limpio se evalúa viéndolo.

**Da:** cuatro cromos de gestos, tres sellos y, con el primero, *Todos a una*. Las escenas y viñetas se pedirán en un lote propio cuando Pablo apruebe los casos.

### 5.7 Todos a una · *Team up*

**Lugar:** El Banquillo. **Tema:** trabajo en equipo.

**Cómo se juega: el reparto.**
1. En la pizarra, un reto cooperativo dibujado con tiza: llevar la colchoneta entre cuatro, cruzar «el río» con tres aros, un relevo de material.
2. Cuatro compañeros con su tarjeta: lo que hoy se le da bien y lo que hoy necesita. Nora vuelve de un esguince y no debe saltar; Leo no suele pedir la pelota; Kai corre mucho y tiende a hacerlo todo.
3. El alumno reparte los papeles arrastrando petos. Condiciones: todos tienen papel, se respeta lo que cada uno necesita y, en la segunda ronda, los papeles cambian.
4. La jugada se ve en la pizarra con círculos y aspas. Robles no mira el tiempo: mira tres cosas, que aparecen como tres vistos de tiza: han participado todos, nadie ha hecho lo que no debía, se han ayudado.

**Niveles.**

| Nivel | Qué cambia |
|---|---|
| 1 · Cuatro y un reto | Una sola ronda |
| 2 · Segunda ronda | Hay que rotar los papeles |
| 3 · Imprevistos | Seis compañeros y algo que pasa a mitad: Ada se enfada, falta uno. Se elige qué decir entre frases ya escritas |
| 4 · Mano a mano (ronda libre) | **Para dos en un ordenador:** uno ve las tarjetas de los compañeros y el otro maneja los petos; a mitad, la pantalla manda cambiar de sitio. Hay que hablar para resolverlo |

**En la pantalla: Todos a una.** Retos cooperativos con una sola cuenta de clase: cien palmadas al pulso entre todos, una ola que recorre el aula, y los cuatro retos de cooperación del banco de `content.js`. O lo consigue la clase entera o se intenta otra vez.

**Anota:** `record('banquillo', 'todos-a-una', 'nivel', {…, pareja})`. **Evidencia posible:** convivencia, habilidades sociales y respeto a la diversidad en la práctica (competencia específica 3; bloque D). Las partidas en pareja no se usan para nota.

**Da:** cuatro cromos de gestos y tres sellos. Usa la pizarra y los petos ya pintados: no necesita arte nuevo para empezar.

## 6. Volver a jugar

Un juego repetido no es el mismo juego:

- **Barajado.** Objetos, casos y preguntas salen de un banco mayor que lo que cabe en una partida, y en otro orden.
- **Niveles que cambian la tarea**, no sólo la cantidad: reconocer, luego decidir según el contexto, luego ordenar o justificar, y por último arreglar lo que ha hecho otro.
- **Ronda libre.** El cuarto nivel no se termina: cada vez da tres casos nuevos hasta agotar el banco, y entonces vuelve a barajar.
- **Maestría con tres sellos de tampón**, los que pone un profe en un cuaderno: la **zapatilla** (nivel 1), el **silbato** (nivel 2) y la **naranja** (nivel 3). Un sello puesto no se pierde.
- **El reto del corcho.** Cada semana Robles propone volver a un juego que el jugador ya tiene abierto, en su ronda libre. Es el mismo para todos y se calcula con el número de semana, sin servidor. Hacerlo pone una chincheta en el corcho del jugador. No da cromos exclusivos y no pasa nada por saltárselo: la semana siguiente hay otro.
- **Sin castigo.** No hay vidas, ni tiempo límite, ni se baja de nivel, ni se pierde nada por fallar o por no venir. Las pistas no restan sellos.

## 7. Límites

- **Sin azar.** No hay sobres, ruletas de premios ni cromos raros. Lo que se consigue depende sólo de lo que se hace.
- **Sin prisa fabricada.** No hay rachas de días seguidos, premios «sólo hoy» ni avisos de que se pierde algo.
- **Sin comparar.** No hay clasificación entre alumnos ni entre clases. El álbum de cada uno sólo lo ven él y el profe. El mural de la clase no dice quién puso cada azulejo.
- **Sin avergonzar.** Los fallos los explica Robles hablando de la acción, no de la persona. Los personajes que se equivocan en los casos son ficticios y nunca es siempre el mismo.
- **Sin nombres ni texto libre.** El álbum no pide nada nuevo: usa el jugador que ya existe. No hay ningún campo donde escribir.
- **Sin intercambio de cromos.** Obligaría a comunicar a unos alumnos con otros y a comparar.
- **Los candados son pedagógicos, no de seguridad.** Un alumno hábil puede saltárselos desde el navegador. No importa: no guardan nada que proteger.

### 7.1 Dónde se guarda

- **En el navegador, por jugador.** Una clave nueva, `pabellon-album`, guarda para cada jugador de ese ordenador qué cromos, sellos y llaves tiene. Hace falta porque el registro del ordenador se queda en 800 anotaciones entre todos y descarta las antiguas: el álbum no puede depender de que sigan ahí.
- **Y en el registro.** Cada cromo, sello o llave es además una anotación (`record('album', 'cromo', 'pegado', {id})`), así que viaja a la hoja del profe cuando está conectada.
- **Lo ya jugado cuenta.** Al estrenar el álbum, lo anotado hasta ese día (misión del gimnasio, partidos de mate, posturas de yoga, roscos) pega sus cromos de golpe. Nadie empieza de cero.
- **Otro ordenador.** Con la hoja conectada, «Recuperar mi progreso» de la taquilla ya trae las anotaciones del jugador, y el álbum se reconstruye con ellas. **Sin hoja, el álbum es de ese ordenador y se acepta perderlo** al cambiar; lo que se pierde es colección, nunca acceso, porque el profe puede abrir lo que haga falta. No se propone un «código de álbum» para llevarlo de un ordenador a otro: sería el primer campo de texto del alumnado.
- **Ordenador compartido.** Como hoy: cada jugador ve sólo su álbum, y «No soy yo» lo cierra.
- Antes de programarlo se actualizan `PRIVACY.md` y el apartado de privacidad de `10-registro-y-notas.md` con la clave nueva.

## 8. Modo pantalla: el mural de la clase

En la pantalla digital no hay jugador, así que no hay álbum. Hay un **mural de azulejos**, como los paneles de cerámica de los colegios andaluces: 24 azulejos en blanco que, uno a uno, van formando una escena pintada.

- **Cada cosa hecha entre todos pone un azulejo:** un calentamiento guiado, un repaso de normas, una ronda de *Charco a la vista*, una oca, una secuencia de yoga. Uno por actividad y sesión.
- **La tarjeta verde de verdad.** Al acabar una sesión, el profe puede dar desde el despacho un azulejo por algo que ha visto en clase, eligiéndolo de una lista fija de gestos (los ocho del álbum). Sin nombres y sin texto.
- **Al completarlo** se ve la escena entera, Robles lo celebra y empieza un mural nuevo con otra pintura. Está pedido el primero (el pabellón); los siguientes se pedirán después.
- **En la pantalla no hay candados.** Todos los modos de clase están abiertos desde el primer día: el profe no puede depender de un desbloqueo para dar su sesión. La intriga de la clase es qué dibujo sale.
- **Qué clase.** El mural es de un curso y grupo, que se elige con dos desplegables al entrar en modo pantalla. Hoy la pantalla anota todo como «pantalla»; esto añade el grupo, sin alumnos.

## 9. El despacho

Lo que el profe controla, en una sección nueva, **Álbum y puertas**:

| Control | Qué hace |
|---|---|
| Estado de cada lugar y juego | **Abierto**, **Se descubre** (sigue el árbol) o **Cerrado** |
| Normas primero | Un interruptor por juego de ordenador |
| Enlace de sesión | Marca qué quiere abierto y obtiene un enlace (o su código QR) que abre eso a quien entre por él, mientras dure la sesión del navegador. Sirve para «hoy toda la clase al Banquillo» |
| Álbumes de este ordenador | Por jugador: cromos por página, sellos por juego y último día. Para el profe, no se proyecta |
| Reiniciar | El álbum de un jugador, todos los de ese ordenador, o el mural |
| Reto del corcho | Automático, o fijar un juego para la semana |
| Dar un azulejo | La tarjeta verde de verdad (apartado 8) |

Límite conocido: como el resto del despacho, estos ajustes son de cada ordenador. El enlace de sesión es la forma de llevar una decisión a toda la clase sin servidor.

## 10. Orden de trabajo

Cada fase se puede entregar y usar sola. Las versiones de pantalla van dentro de la fase de su juego.

| Fase | Qué entrega | Arte |
|---|---|---|
| **1. El álbum y El Neceser** | El Vestuario como lugar con taquilla, álbum y banco. `album.js`: catálogo de cromos y reglas, con sus pruebas. Páginas «Lugares y juegos», «El material» y «El neceser». Lo ya jugado pega sus cromos. *El Neceser*, niveles 1 a 3, y *Neceser en movimiento*. En el despacho, la tabla de álbumes y reiniciar | Lotes 16 (álbum) y 17. Mientras llegan: papel y formas simples, y los `prop-*.webp` para el material |
| **2. Pistas, despistes y mural** | Corcho de Robles, reto de la semana, los ocho objetos escondidos, sellos en los juegos que ya existen y el mural de la pantalla | Lote 16 (despistes) y mural del lote 19 |
| **3. El Banquillo: normas del mate** | Ficha de normas confirmada por Pablo, charla con láminas, peto, llave de las salas de Mate Arena con veteranos, y *Repaso de normas* en pantalla. Pelota sentada, con sus cuatro normas, como segunda charla | Lote 18. Mientras llega: tiza sobre la pizarra |
| **4. La Fuente y el material** | *Ni una gota* y *Cada cosa, a lo suyo*, con «El pabellón seguro» y los dorsos del material | Lote 19 |
| **5. Motores en marcha** | El calentamiento completo y su guiado de clase | Lote 20 |
| **6. Tarjeta verde y Todos a una** | Los dos juegos y sus cromos de gestos | Lote por pedir |
| **7. Puertas del profe** | Abrir y cerrar, enlace de sesión, normas primero por juego. Es la fase H de la hoja de ruta | — |
| **Después** | Nuevos juegos de ordenador con su charla (pelota sentada, pichi, pinfuvote, baloncesto), El Patio Cubierto y El Botiquín | Láminas de cada juego cuando Pablo confirme sus normas |

La fase 1 no toca ningún juego existente ni cierra nada: añade un lugar, un botón y un juego.

## 11. Decisiones abiertas

| Decisión | Propuesta | Por qué importa |
|---|---|---|
| El objeto | Un álbum de cromos. Alternativas descartadas: llavero (sólo sirve para lugares) y carné con sellos (sin siluetas) | Da nombre y forma a todo lo demás |
| **Normas del mate** | Las doce líneas del apartado 5.5 | Las 14 láminas ya están pedidas con esa versión. Hay que confirmarlas **antes** de enviar el lote 18 |
| Normas de pelota sentada que faltan | Pedir ahora sólo las cuatro láminas de lo que Pablo ha dicho | Bote, atrapar, altura y final cambian el juego |
| Normas de pichi, pinfuvote y baloncesto de clase | Pablo rellena la ficha de 13 apartados de cada uno | Sin eso no hay charla ni láminas |
| Mate Arena con normas primero | Entrenamiento libre, salas con peto, veteranos con peto de regalo | Es lo único de este plan que pone una condición a algo que ya se usa |
| Cuánto empieza abierto | Lo de hoy, más El Vestuario y El Banquillo | Más candados dan más intriga y más riesgo de estorbar |
| Progreso sin hoja conectada | Aceptar que el álbum es de ese ordenador | La alternativa es un código que el alumno escribe |
| Clase en el modo pantalla | Elegir curso y grupo al entrar | El mural necesita saber de qué clase es |
| Tarjeta verde de verdad | Sí, con lista fija de gestos | Une el juego con lo que pasa en la pista; es una valoración del profe |
| Qué da nota | Nada por ahora. Primera candidata: *Cada cosa, a lo suyo*, con el criterio de *Equipment Rescue* | Completar un juego no equivale a superar un criterio |
| Partidas en pareja | Se anotan al jugador que ha entrado, marcadas como pareja y sin nota | Dos alumnos y un solo registro |
| Quién modela el calentamiento | Vega, de pie y en silla | Dieciséis dibujos con un solo personaje |
| Cuatro puertas en el mapa | Las tres de siempre que elija el profe más la última descubierta; el resto, por el álbum | La hoja de ruta fija el máximo en cuatro |

## 12. Choques con las reglas que conviene saber

- **«Sin eliminaciones»** se aplica a las actividades digitales de clase. La cárcel del mate y el sentarse de la pelota sentada son parte del juego real y quien está en ellas sigue jugando; las láminas lo enseñan así.
- **Texto en las imágenes.** Ninguna lámina lleva letras: la norma se escribe debajo, en el juego. Las marcas de «así sí» y «así no» son imágenes sueltas que el juego superpone.
- **Lugar del registro.** *Equipment Rescue* anota como `material`, no como `gimnasio`. Las misiones nuevas usarían `gimnasio`; conviene decidir si se unifican.
- **Índices de arte.** Los lotes 16 a 20 no llevan `_indice` porque `scripts/integrar_arte.py` escribe ese archivo en cada pasada y las carpetas aún no existen. Se añade al crear cada lugar.
