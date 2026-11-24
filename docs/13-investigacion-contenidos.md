# Qué más incluir: currículo, curiosidades y actividades nuevas

Consulta: 24 de noviembre de 2026. Cuatro líneas de investigación para decidir cómo crece El Pabellón: qué pide el currículo andaluz y qué no cubre aún el juego, si las curiosidades publicadas son ciertas, qué curiosidades nuevas merecen entrar y qué actividades y mecánicas faltan. Complementa [la investigación de formatos](09-investigacion-dias-de-lluvia.md), que no se repite aquí, y alimenta la [hoja de ruta](08-hoja-de-ruta.md) y el [plan de curiosidades](12-curiosidades.md).

**Cómo leer la verificación.** «Leído» significa que se abrió el texto de la fuente. «Resultado de búsqueda» significa que sólo se vio el resumen del buscador. Las ideas de contenido y la valoración de qué cubre el juego son propuestas de este documento, no texto de las fuentes.

## 1. El currículo de Educación Física de Primaria en Andalucía

### Normativa vigente

| Norma | Qué es | Estado |
|---|---|---|
| [Real Decreto 157/2022, de 1 de marzo](https://www.boe.es/buscar/act.php?id=BOE-A-2022-3296) | Ordenación y enseñanzas mínimas de Primaria (BOE 02/03/2022) | Vigente, sin modificaciones (leído) |
| [Decreto 101/2023, de 9 de mayo](https://www.juntadeandalucia.es/boja/2023/90/2.html) | Ordenación y currículo de Primaria en Andalucía (BOJA 15/05/2023) | Vigente (leído) |
| [Orden de 30 de mayo de 2023](https://www.juntadeandalucia.es/boja/2023/104/39) | Desarrolla el currículo de Primaria en Andalucía; su Anexo II trae competencias, criterios y saberes de cada área (BOJA 02/06/2023) | Vigente (leído el PDF del BOJA) |
| [Orden de 31 de agosto de 2026](https://www.juntadeandalucia.es/boja/2026/168/c03/2) | Medidas de organización y gestión; su artículo 5 modifica artículos de la Orden de Primaria | Cambia sólo lo organizativo (proyectos interdisciplinares, horario, evaluación, promoción). No toca el Anexo II (leído) |

No se ha encontrado ninguna corrección ni resolución que modifique los criterios o los saberes de EF, aunque la búsqueda no es exhaustiva. El Anexo I fija tres sesiones semanales de EF en los seis cursos.

### Cómo se codifica

- **Cinco competencias específicas:** 1) vida activa y saludable; 2) esquema corporal, capacidades y habilidades ajustadas a cada situación y a proyectos motores; 3) autorregulación e interacción con actitud empática e inclusiva; 4) manifestaciones de la cultura motriz, tradicional y actual; 5) medios naturales y urbanos, con conservación sostenible.
- **Seis bloques de saberes:** A. Vida activa y saludable · B. Organización y gestión de la actividad física · C. Resolución de problemas en situaciones motrices · D. Autorregulación emocional e interacción social · E. Manifestaciones de la cultura motriz · F. Interacción eficiente y sostenible con el entorno.
- **Saberes:** prefijo `EFI`, ciclo, bloque y número: `EFI.3.B.6`. En documentos del repo donde se escriba `EF.3.…`, lo correcto es `EFI.3.…`.
- **Criterios:** competencia.criterio y una letra por curso del ciclo. En tercer ciclo, **`.a` es 5.º y `.b` es 6.º**. El uso de `1.3.a` y `1.3.b` en `notas.js` es correcto.

### Los 14 criterios de tercer ciclo

| Criterio | Resumen | Saberes vinculados |
|---|---|---|
| 1.1 | Efectos beneficiosos, físicos y mentales, de la actividad física, analizando situaciones cotidianas | A.1, A.2 |
| 1.2 | Activación corporal, dosificación del esfuerzo, relajación, higiene y seguridad como rutinas | B.3, B.5 |
| **1.3** | Medidas de seguridad antes, durante y después de la práctica; contextos de riesgo. **El único que hoy da nota en el juego** | B.5, B.6, F.3 |
| 1.4 | Conductas inapropiadas del ámbito corporal y deportivo; rechazo de violencia, discriminación y estereotipos de género | A.3, D.4 |
| 2.1 | Proyectos motores: metas, secuencia de acciones, cambios durante el proceso y valoración | B.1, B.4, D.2 |
| 2.2 | Toma de decisiones a partir de la anticipación, «en contextos reales o simulados» | B.1, C.1, D.2 |
| 2.3 | Control y dominio corporal, eficiente y creativo | C.1 a C.5 |
| 3.1 | Autorregulación y gestión de emociones; en 6.º, perseverancia, control de la impulsividad y asertividad | D.1 |
| 3.2 | Normas y reglas con deportividad y juego limpio | D.2, D.3, E.5 |
| 3.3 | Habilidades sociales, resolución pacífica de conflictos, respeto a la diversidad e igualdad de género | A.2, A.3, D.2, D.4 |
| 4.1 | Juegos, deportes y danzas **con arraigo en la cultura andaluza** y de otras culturas | E.1 |
| 4.2 | Deporte como fenómeno cultural; estereotipos de género o capacidad y comportamientos sexistas | E.1, E.4, E.5 |
| 4.3 | Composiciones con o sin soporte musical: ejecutar (5.º), reproducir y crear (6.º) | C.5, E.2, E.3 |
| 5.1 | Acciones motrices ajustadas a los riesgos del medio natural y urbano, con respeto al entorno | B.2, F.1 a F.6 |

### Qué cubre hoy el juego y con qué se taparía cada hueco

| Saber de tercer ciclo | ¿Cubierto? | Idea jugable |
|---|---|---|
| **A.1** Salud física: alimentación, hidratación, educación postural, higiene y descanso | Parcial: curiosidades y letras del rosco. Nada de alimentación; la postura es sólo una definición | El Botiquín, «Espalda de campeón»: una escena con cuatro errores posturales (mochila, silla, levantar una caja, pantalla) que la clase corrige con el cuerpo |
| **A.2** Salud social: malos hábitos, tipologías corporales, estereotipos | No | «Verdad o mito»: afirmación en pantalla, la clase responde de pie o en cuclillas, explicación y microrreto |
| **A.3** Salud mental: autoconcepto, respeto al cuerpo, visión crítica de imágenes reales y virtuales | No | La Sala de Espejos, «El cartel retocado»: dos carteles dibujados, uno con cuerpos imposibles; se detecta el truco |
| **B.2** Consumo responsable de equipamiento | No | Segunda misión del gimnasio, «El pedido»: con un presupuesto, reparar, reutilizar o comprar |
| **B.4** Planificación y seguimiento de proyectos motores | Parcial: crear secuencias en El Tatami | Cuaderno de proyecto en El Vestuario: meta, tres pasos y semáforo por sesión, sin texto libre |
| **B.5** Calentamiento, vuelta a la calma y seguridad | En parte: Equipment Rescue. El alumnado no construye su calentamiento | «Monta tu calentamiento» con el constructor de secuencias: movilidad, activación y específico |
| **B.6** Actuación ante accidentes, **posición lateral de seguridad y conducta PAS** | **No** | El Botiquín: ordenar proteger-avisar-socorrer en escenas del recreo; posición lateral por parejas guiada paso a paso; «La llamada» en dos idiomas |
| **C.1** Toma de decisiones | Parcial: Mate Arena decide en simulación | La Pizarra táctica: jugada congelada del propio mate, la clase vota con el cuerpo y se ve qué pasa |
| **C.2** Esquema corporal, equilibrio, orientación espacial y ritmo | Parcial. Falta la orientación | El Circuito: plano del aula y del cole con balizas |
| **C.3** Capacidades físicas y dosificación | Parcial: sólo definiciones | «El pulso de la clase»: en reposo, tras activar y tras la calma; se anota el dato de la clase |
| **C.5** Creatividad motriz ante estímulos imprevistos | Parcial | «Cambio»: una señal de la pantalla obliga a cambiar el movimiento en curso |
| **D.1** Gestión emocional en situaciones motrices | Parcial: familia «calma» de la ruleta | «El marcador por dentro»: situación de juego, emoción, estrategia y una respiración guiada |
| **D.2** Trabajo en equipo, roles y responsabilidades | Parcial: oca cooperativa. Sin roles | Tarjetas de rol rotativo en la oca y el bingo: capitanía, arbitraje, ánimo, anotación |
| **D.3, D.4** Juego limpio y rechazo de conductas violentas | Sólo definiciones | «Tarjeta verde»: dilemas de juego limpio sacados del mate; tras cada partido de La Grada, votar el gesto deportivo |
| **E.1** Cultura motriz **andaluza** | **No**: dos curiosidades | El Patio Cubierto: juegos populares jugables junto al pupitre, con su origen |
| **E.2, E.3** Expresión corporal y actividades rítmicas | Parcial: no hay composición | La Sala de Espejos: mímica por equipos simultáneos y coreografía de ocho tiempos |
| **E.4** Deporte e igualdad de género | No | «¿Quién lo consiguió?»: logros contados sin nombre, la clase apuesta y se revela. Sin fotos de personas reales |
| **E.5** Deportes olímpicos y paralímpicos | Parcial: curiosidades | «Juegos sentados»: boccia con pelotas de papel, voleibol sentado con globo, escucha tipo goalball |
| **F.1, F.2** Educación vial y transporte activo | No | El Circuito, «Señales con el cuerpo»: señales de brazo del ciclista. «Bike check» con la mecánica de Equipment Rescue |
| **F.3** Riesgos en el medio natural y urbano | Parcial: sólo interior | «La mochila de la salida» según el parte del día |
| **F.4** Construcción y reutilización de materiales | No | «Taller del almacén»: fichas para construir material reutilizado y jugar en la misma sesión |
| **F.5, F.6** Entorno y clima de Andalucía; cuidado del entorno | No | Curiosidades «de casa» y un reto de clase en La Vitrina |

### Lo que el currículo dice y conviene saber antes de diseñar

- **Cultura andaluza.** La introducción del área pide que el alumnado «conozca y practique juegos autóctonos y tradicionales». El criterio 4.1 habla de «arraigo en la cultura andaluza». El **flamenco no está en el área de EF**: está en Educación Artística y como principio de todo el currículo (Decreto 101/2023, art. 6.g). Cabe como actividad rítmica, pero no es evidencia propia de EF.
- **Primeros auxilios.** En EF de Primaria sólo figura `EFI.3.B.6`: actuaciones básicas, posición lateral de seguridad y conducta PAS. **El 112 y la RCP no figuran en Primaria**; aparecen en la ESO. Se pueden contar, pero lo evaluable es PAS y posición lateral.
- **Pantallas.** No se nombran en EF; lo más cercano es la «visión crítica de las imágenes… en entornos reales y virtuales». El uso de dispositivos está en Conocimiento del Medio.
- **Referentes deportivos.** La palabra «referentes» pertenece a los ciclos anteriores. En tercer ciclo el foco es el análisis crítico del sexismo.
- **Deporte adaptado.** La expresión no aparece; sí los deportes paralímpicos y los estereotipos «de género o capacidad». La competencia 2 cita la boccia.
- **Medio natural.** El bloque F cita senderismo, orientación (también urbana), cicloturismo, autoconstrucción de materiales, cabuyería y patinaje.
- **Tecnología.** La introducción del área anima a recoger y analizar datos de la propia actividad física. Los «recursos digitales» son un añadido andaluz en B.2, B.4, C.5 y F.4: el juego encaja de lleno ahí.
- **Dato reciente.** Según el [acuerdo del Consejo de Gobierno de 31/08/2026](https://www.juntadeandalucia.es/sites/default/files/2026-08/CG31082026.pdf), los bolos serranos de Jaén se inscriben como Bien de Interés Cultural. Es un punto de partida documentado para El Patio Cubierto.

### Las ocho lagunas, por orden

1. **Primeros auxilios: PAS y posición lateral de seguridad** (B.6, criterio 1.3). Saber explícito, cerrado y practicable en el aula por parejas. El juego ya evalúa el 1.3, pero sólo la mitad de «material y riesgos».
2. **Cultura motriz andaluza** (E.1, criterio 4.1). Es la seña propia del currículo andaluz y sólo hay dos curiosidades.
3. **El bloque F y la competencia 5 enteros** (criterio 5.1). Cobertura nula.
4. **Igualdad, imagen corporal y deporte paralímpico** (A.2, A.3, E.4, E.5; criterios 1.4 y 4.2). Dos criterios sin ninguna evidencia.
5. **Juego limpio, conflictos y emociones en situación** (bloque D; criterios 3.1 a 3.3). Hoy sólo hay vocabulario y calma.
6. **Hábitos saludables practicados** (A.1, B.3, B.5; criterios 1.1 y 1.2): alimentación, postura, pulso y calentamiento propio.
7. **Proyecto motor y composición expresiva** (B.4, E.2, E.3; criterios 2.1 y 4.3).
8. **Decisión táctica y consumo responsable** (C.1, B.2; criterio 2.2).

## 2. ¿Son ciertas las 18 curiosidades publicadas?

Se contrastaron una a una con organismos oficiales y sitios médicos de referencia. Resultado: **8 correctas, 10 con ajustes y ninguna falsa**. Los ajustes ya están aplicados en [`curiosidades.js`](../curiosidades.js).

| Curiosidad | Veredicto | Qué se cambió | Fuente principal |
|---|---|---|---|
| Corazón | Correcta | — | [British Heart Foundation](https://www.bhf.org.uk/informationsupport/how-a-healthy-heart-works) (leído): tamaño del puño, unas 100.000 pulsaciones al día |
| Huesos | Ajustada | «Unas 300 piezas» pasa a «entre 270 y 300, según cómo se cuenten» | [Cleveland Clinic](https://my.clevelandclinic.org/health/body/25176-bones) (leído): 270 al nacer, 206 de adulto, fémur y estribo |
| Equilibrio | Ajustada | No sólo ayudan las plantas de los pies: «los ojos, los músculos y el tacto de piernas y pies». Título y frase en inglés más exactos | [NIDCD, NIH](https://www.nidcd.nih.gov/health/balance-disorders) (leído) |
| Músculos | Correcta | — | [KidsHealth](https://kidshealth.org/en/kids/muscles.html) y [Cleveland Clinic](https://my.clevelandclinic.org/health/body/21887-muscle) (leídos) |
| Agua | Correcta | — | [USGS](https://www.usgs.gov/water-science-school/science/water-you-water-and-human-body) (leído): 65 % al año de vida, 55-60 % en adultos |
| Dormir | Ajustada | Se quita «también los movimientos nuevos» (probado en adultos, poco claro en niños) y se precisa «de los 6 a los 12 años» | [American Academy of Sleep Medicine](https://aasm.org/advocacy/position-statements/child-sleep-duration-health-advisory/) (leído): 9 a 12 horas cada 24 |
| Sesenta minutos | Ajustada | La OMS dice desde 2020 «una media de 60 minutos al día», no «al menos una hora cada día» | [Directrices OMS 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7719906/) y [nota de la OMS en español](https://www.who.int/es/news/item/25-11-2020-every-move-counts-towards-better-health-says-who) (leídos) |
| Calentar | Correcta | — | [Revisión sobre el calentamiento](https://pmc.ncbi.nlm.nih.gov/articles/PMC7675624/) (leído) |
| Baloncesto | Correcta | — | [Springfield College](https://springfield.edu/about/birthplace-of-basketball) (leído) |
| Maratón | Ajustada | «Poco más de dos horas» pasa a «alrededor de dos horas»: según World Athletics hay récord masculino por debajo de dos horas desde abril de 2026 | [World Athletics](https://worldathletics.org/disciplines/road-running/marathon) (leído): distancia oficial desde 1921 |
| Olimpia | Ajustada | «Hace unos 2.800 años» y «según la tradición»: la fecha y la carrera única son tradición, no dato exacto | [Britannica](https://www.britannica.com/sports/ancient-Olympic-Games) y [COI](https://www.olympics.com/ioc/ancient-olympic-games/running) (sólo resultado de búsqueda) |
| Yoga | Correcta | — | [OMS India](https://www.who.int/india/campaigns/international-yoga-day-2020) (leído): la raíz «yuj» es juntar o unir |
| Balón | Ajustada | Quien «se pintó así» fue un balón concreto: el del Mundial de 1970 | [FIFA](https://inside.fifa.com/news/telstar-story-fifa-world-cup-ball-3073424) (leído) |
| Volante | Correcta | — | [Guinness World Records](https://www.guinnessworldrecords.com/world-records/fastest-badminton-hit-in-competition-male) (leído): 426 km/h en competición |
| Comba | Ajustada | Las pruebas oficiales son de velocidad y de «estilo libre», no de «figuras» | [International Jump Rope Union](https://ijru.sport/events) (leído) |
| Goalball | Correcta | Se añade «mientras se juega» al silencio del público | [Comité Paralímpico Internacional](https://www.paralympic.org/goalball) (leído) |
| Rayuela | Ajustada | «Avioncito» no está documentado: es «avión» (México). Se dice dónde se usa cada nombre | [Diccionario de americanismos](https://www.asale.org/damer/golosa) (leído) |
| Balón prisionero | Ajustada | Se quita «campo quemado», que sólo aparece en comentarios de un blog | Trabajo de la Universidad de La Laguna (leído), que cita a otros dos autores |

**Lo que sigue sin fuente sólida** y conviene no ampliar: en qué zonas de España se usa cada nombre del balón prisionero (no hay prueba de cuál es el habitual en Andalucía: aquí decide Pablo, que lo sabe de primera mano); el porcentaje exacto de agua a los 10-12 años («más de la mitad» está cubierto de sobra); y los datos de Olimpia, que coinciden en Britannica y el COI pero no se pudieron abrir.

**Regla nueva para el banco:** cada curiosidad lleva su fuente. El campo `fuente` de `curiosidades.js` guarda quién lo afirma y la dirección; la ficha enseña el nombre al pie, para que el profe pueda responder a un «¿y eso quién lo dice?», y una prueba impide añadir una curiosidad sin él.

## 3. Qué dice la evidencia

### Descansos activos en el aula

- **Lo que mejora con más claridad es la conducta en la tarea**, no las notas. [Watson y otros (2017)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5574081) encuentran un efecto apreciable con pocos estudios; [Reyes-Amigo y otros (2025)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11822862/) ven mejora en 6 de 7 estudios. [Peiris y otros (2022)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9368257/), con diez ensayos aleatorizados, no hallan efecto en matemáticas, lectura ni cognición; sí aumenta la actividad moderada o vigorosa. (Los tres, leídos.)
- **Dosis:** lo más estudiado son 10 minutos y después 4. Reyes-Amigo sugiere de 4 a 10 minutos de intensidad moderada o vigorosa, tres veces por semana.
- **Con reto mental funcionan mejor en 5.º.** En [Schmidt, Benzing y Kamer (2016)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01474/full) (leído) mejoró la atención el descanso que exigía pensar, no el esfuerzo físico solo. Hay estudios en contra.
- **Lo que hace que el profesorado los mantenga:** unos 5 minutos, sin preparación, y decidir cuándo. Las barreras son el tiempo y la vuelta a la calma ([Chorlton y otros, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9701018/), leído).
- **Formato con nombre que encaja:** los intervalos con historia de la [Universidad de Queen's](https://www.queensu.ca/qmpl-nmrg/qmpl/funtervals) (leído): ocho tramos de 20 segundos de movimiento y 10 de pausa, cuatro minutos en total, narrados.

**Para el diseño:** ofrecer piezas de 4 o 5 minutos que se abren con un toque, que incluyan un reto mental y que terminen con una vuelta a la calma. Y no prometer que mejoran las notas: lo defendible es «mejora la conducta en la tarea y suma minutos de movimiento».

### Recompensas, coleccionables y motivación

- Las recompensas tangibles y esperadas bajan la motivación intrínseca ([Deci, Koestner y Ryan, 1999](https://pubmed.ncbi.nlm.nih.gov/10589297/), 128 experimentos; sólo resultado de búsqueda). En un aula, insignias y clasificación durante un trimestre bajaron motivación y nota (Hanus y Fox, 2015; citado por terceros).
- Lo que no daña: narrativa, elección y poder reintentar, retos graduados, metas de equipo y coleccionables que informan y no dependen del rendimiento ([Sailer y Homner, 2020](https://link.springer.com/article/10.1007/s10648-019-09498-w); sólo resultado de búsqueda).
- Los videojuegos activos mejoran algo el aprendizaje en EF, pero casi todos los estudios usan consola y cámara, así que no se trasladan a una web sin sensores.

**Para el diseño:** el álbum sin puntos ni rachas está bien planteado. Las insignias pendientes de El Vestuario deben ser sellos de «lo hice», nunca de «lo hice mejor que otro». La Vitrina, un reto de la clase entera, sin clasificación entre clases.

### Qué hace que una curiosidad se recuerde

- A los 10-12 años, lo que despierta curiosidad se recuerda mejor, y cuenta más **la expectativa previa** que la sorpresa final ([Fandakova y Gruber, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7618219), leído). En ese estudio la pregunta se veía unos segundos y la respuesta llegaba tras una espera.
- Intentar responder antes de ver la respuesta mejora el recuerdo aunque se falle, si después se da la correcta ([Pan y Carpenter, 2023](https://link.springer.com/article/10.1007/s10648-023-09814-5); sólo resultado de búsqueda).
- En 5.º, preguntarse a uno mismo con corrección supera con claridad a releer una semana después ([Franzoi y otros, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12372469/), leído).

**Para el diseño:** hoy el cuadro se abre y lo cuenta todo. Debería enseñar primero **una pregunta**, pedir una apuesta con el cuerpo (de pie o en cuclillas), dejar una pausa y entonces abrir. Y el rosco debería repasar a la semana lo que la clase tiene en el álbum. Es el cambio con mejor relación entre respaldo y esfuerzo de todo este documento.

### Educación Física bilingüe

- Con alumnado de 10-11 años, las tareas que unen movimiento y habla mejoran la comprensión y la interacción oral ([Coral y Lleixà, 2016](https://portalrecerca.uab.cat/en/publications/physical-education-in-content-and-language-integrated-learning-su/); leído el resumen). Y la clase bilingüe no se mueve menos.
- Andamiajes descritos en la práctica: apoyo visual, frases hechas, frases cortas y rutinas fijas ([López Cancho, 2021](https://ddd.uab.cat/pub/clil/clil_a2021v4n1/clil_a2021v4n1p57.pdf), leído).
- El gesto ayuda al vocabulario, pero ver el gesto rinde casi como hacerlo ([Oppici y otros, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10669578), leído): no es un método milagroso.

**Para el diseño:** imagen, gesto y una frase modelo corta, siempre en el mismo sitio de la pantalla y repetida como rutina.

## 4. Actividades que el juego aún no tiene

Descritas como mecánica. En todas se mueve la clase entera a la vez junto a su mesa y hay variante sentada.

| Actividad | Lugar | Cómo se juega | Qué pone la pantalla | Tapa |
|---|---|---|---|---|
| **Adivina antes de abrir** | El Pasillo | El cuadro enseña una pregunta; la clase apuesta de pie o en cuclillas; pausa; se abre | Pregunta, cuenta de tres y la ficha de siempre | Recuerdo; no necesita arte |
| **Respira con la ola** | El Tatami | Una forma crece y mengua; se suelta el aire más despacio de lo que se coge, sin retenerlo | La forma y un contador de respiraciones | D.1, criterio 1.2; cierra lo que quedaba «por decidir» en yoga |
| **Tensar y soltar** | El Tatami | Recorrido por zonas del cuerpo: apretar la pelota, empujar la pared… 5 segundos y soltar 10 | Dibujo de la zona y reloj | D.1, vuelta a la calma |
| **Eco de percusión corporal** | La Sala de Espejos | La pantalla marca cuatro tiempos (palmas, pecho, muslos, pisada), la clase los repite; luego por filas, en canon | Iconos por tiempo y metrónomo | E.3, criterio 4.3 |
| **Estatuas con regla que cambia** | La Sala de Espejos | Moverse o congelarse según el color; a mitad, la regla se invierte. Nadie queda fuera: la clase suma | Color grande y regla vigente | C.5; descanso con reto mental |
| **Simon de cuerpo** | El Armario de los candados | Secuencia de gestos que crece; la clase la reproduce de memoria | Enseña la secuencia, la esconde y el profe valida | C.2, C.5; descanso con reto mental |
| **Mímica bilingüe por mitades** | La Sala de Espejos | Media clase ve la palabra y la representa; la otra media adivina con la frase modelo | Palabra, dibujo y «Are you…? / We are…» | E.2; inglés con función |
| **Espejo con relevo de guía** | La Sala de Espejos | Por parejas, sin tocarse; la pantalla cambia quién guía y cómo es el gesto | Señal de cambio y palabra de calidad (slow, sharp, wide) | E.2, D.2 |
| **Coreografía de ocho tiempos** | La Sala de Espejos | Cada fila añade un gesto de un mazo; toda la clase repite la frase cada vez que crece | Guarda la secuencia y cuenta; reutiliza el constructor de El Tatami | E.3, B.4; criterios 2.1 y 4.3 |
| **Intervalos con historia** | Las Espalderas o El Armario | Ocho tramos de 20 segundos y 10 de pausa, narrados por Robles | Escena, verbo en dos idiomas y reloj | Criterio 1.2; cuatro minutos |
| **PAS en escena** | El Botiquín | Ordenar proteger, avisar y socorrer en una escena del gimnasio, con un gesto por letra | Aventura corta de tres decisiones, sin dramatismo | **B.6, criterio 1.3** |
| **Posición lateral por tríos** | El Botiquín, hecha en colchoneta | Uno tumbado, uno coloca, uno lee los pasos; rotan | Pasos numerados con dibujo, como las posturas | **B.6, criterio 1.3** |
| **La llamada** | El Botiquín | Por parejas, espalda con espalda: uno avisa y otro hace de operador | Guion del operador (dónde, qué pasa, no cuelgues) y caso nuevo | Complemento: el 112 no es de Primaria |
| **Rumbos junto a la mesa** | El Circuito | «Mira al norte, dos pasos al este»; secuencias que crecen | Rosa de los vientos que el profe orienta una vez | C.2, F.5; criterio 5.1 |
| **El plano correcto** | El Circuito | Elegir el plano bien orientado del aula; la pantalla marca una mesa y desde allí arranca una ola | Plano por filas y columnas, sin nombres | C.2; criterio 5.1 |
| **Señales con el cuerpo** | El Circuito | Las señales de brazo del ciclista, a la orden de la pantalla | Dibujo de la señal y la orden en dos idiomas | F.1, F.2; criterio 5.1 |
| **Juegos sentados** | El Patio Cubierto | Boccia con pelotas de papel, voleibol sentado con globo y un juego de escucha, por grupos | Reglas de cada juego y marcador de la clase | E.5; criterio 4.2 |
| **Tarjeta verde** | La Grada y La Pista | Un dilema de juego limpio sacado del mate; la clase decide con el cuerpo y ensaya la respuesta | La situación y las opciones | D.3, D.4; criterios 3.2 y 3.3 |
| **Verdad o mito** | El Botiquín | Afirmación sobre salud o deporte; de pie si es verdad, en cuclillas si es mito; explicación y microrreto | Afirmación, pausa y respuesta | A.2; criterio 1.4 |
| **Retos de folio** | El Armario de los candados | Por grupos de mesa: bajar un folio al suelo sosteniéndolo con un dedo cada uno | Enunciado, reloj y «conseguido», que da un dígito | D.2; criterio 3.3 |

**Avisos de la evidencia sobre estas actividades**

- **Primeros auxilios.** Lo evaluable en Primaria es PAS y posición lateral. La declaración [Kids Save Lives](https://www.resus.org.uk/sites/default/files/2020-05/Statement_Kids-save-lives.pdf) (leída) recomienda formar a los escolares cada año, y la [declaración científica de 2023](https://newsroom.heart.org/news/learning-to-save-lives-can-start-as-early-as-age-4-according-to-new-scientific-statement) (leída la nota) dice que hacia los 10-12 años ya se logran compresiones eficaces con maniquí. Desde una pantalla sólo se puede enseñar el orden, la llamada y el ritmo; la pantalla debe decirlo y no sustituye a un taller.
- **Respiración y relajación.** Base modesta: en un ensayo con niños de 9 a 13 años, respirar despacio relajó más que no hacer nada, pero no más que otra actividad tranquila. El gran ensayo británico de atención plena en la escuela no mejoró el bienestar. Sirven como vuelta a la calma, no como programa de bienestar. Sin retener el aire: la respiración «cuadrada» choca con la regla de no hacer apneas.
- **La posición lateral** no cabe entre pupitres: se hace en colchoneta, en El Tatami o en el pabellón.

### Lo que el navegador permite sin instalar nada ni captar imagen

| Recurso | Sirve para | Riesgo | Decisión propuesta |
|---|---|---|---|
| Temporizadores y sonido generado | Metrónomo, intervalos, cuenta atrás | Ninguno | Ya se usa: es la base de casi todo |
| Voz sintetizada | Órdenes y frases modelo | Bajo: sólo sale texto del juego | Ya se usa; preferir voces del propio equipo |
| Micrófono, sólo el volumen | «Una sola palmada», silencio | La voz es dato personal si se graba o se envía; y cómo lo ven las familias | Sólo en la pantalla digital, activado por el profe, sin guardar ni enviar, escrito en `PRIVACY.md` y con alternativa sin micrófono. **Decide Pablo** |
| Acelerómetro de la tableta | Contar saltos | Bajo, pero falla entre dispositivos | No depender de él |
| Vibración | Pulso | Ninguno; no existe en iPhone ni iPad | Sólo adorno |
| Cámara o detección de postura | — | Imagen de menores | **No** |
| Reconocimiento de voz | — | El audio puede salir a un servicio externo | **No** |
