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
| El mate | Ajustada | Se quita «campo quemado», que sólo aparece en comentarios de un blog. El nombre de aquí, «el mate», lo confirma Pablo | Trabajo de la Universidad de La Laguna (leído), que cita a otros dos autores |

**Lo que sigue sin fuente sólida** y conviene no ampliar: en qué zonas de España se usa cada nombre del balón prisionero (las fuentes no aclaran cuál es el habitual en Andalucía; Pablo confirma que aquí es «el mate», y así lo dice ya la curiosidad); el porcentaje exacto de agua a los 10-12 años («más de la mitad» está cubierto de sobra); y los datos de Olimpia, que coinciden en Britannica y el COI pero no se pudieron abrir.

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

## 5. Curiosidades nuevas candidatas

48 candidatas que no repiten ninguna de las 18 publicadas. **L** = fuente leída; **B** = sólo resultado de búsqueda: hay que abrirla a mano antes de publicar. Todas tienen pensado un «Pruébalo» en el sitio con variante sentada; aquí se resume en pocas palabras.

### Juegos populares y tradicionales

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 1 | En Jaén los bolos salen volando | Los bolos serranos de Cazorla, Segura y Las Villas son Bien de Interés Cultural desde septiembre de 2026. No basta con tumbar el bolo (el «mingo»): cuenta lo lejos que sale. La noticia más antigua es de 1625 | Cinco bolazos imaginarios a ras de suelo | L · [BOJA, Decreto 484/2026](https://www.juntadeandalucia.es/eboja/2026/171/BOJA26-171-00013-11424-01_00342654.pdf) |
| 2 | Una anilla, un palillo y al galope | La carrera de cintas: a caballo, ensartar con un palillo la anilla de una cinta enrollada. El Atlas del Patrimonio Inmaterial de Andalucía la registra en la Axarquía | Galope en el sitio y ensartar arriba | L sólo el registro · [IAPH](https://repositorio.iaph.es/handle/11532/5712?mode=full). La descripción del juego no sale de fuente oficial |
| 3 | Goya pintó la gallinita ciega | Un cuadro de 1788, de más de tres metros de ancho, en el Prado: un corro y alguien vendado con un cucharón | Ojos cerrados, pies quietos: señalar la puerta | L · [Fundación Goya en Aragón](https://fundaciongoyaenaragon.es/obra/la-gallina-ciega/70) |
| 4 | Un cuadro con más de 80 juegos | «Juegos de niños», de Bruegel (1560): el museo cuenta más de 230 niños y 83 juegos | Tres juegos con mímica para que la pareja adivine | L · [Kunsthistorisches Museum](https://khm.at/en/object/321) |
| 5 | Un libro de juegos de hace 400 años | Rodrigo Caro escribió «Días geniales o lúdicros»; un estudio cuenta en él 59 juegos: rayuela, pares y nones, trompo, tabas, bolos… | Pares y nones, cinco rondas | L · [Cultura, Ciencia y Deporte, 2017](https://ccd.ucam.edu/index.php/revista/article/download/948/402/3135). Que Caro fuera de Utrera, sin confirmar |
| 6 | Petanca significa «pies juntos» | Nació hacia 1907 en la Provenza: un jugador que no podía tomar carrerilla lanzó con los pies quietos | Cinco lanzamientos por abajo sin mover los pies | B · [turismo de Provenza](https://provence-alpes-cotedazur.com/en/get-inspired/lifestyle/petanque/) |
| 7 | Tirar de la cuerda fue deporte olímpico | Estuvo en cinco Juegos, entre 1900 y 1920 | Enganchar las manos y tirar cinco segundos | B · [Olympedia](https://www.olympedia.org/sports/TOW) |

### Deporte adaptado y paralímpico

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 8 | La boccia no tiene gemela olímpica | Sólo dos deportes paralímpicos no tienen equivalente olímpico: boccia y goalball. Seis bolas por lado, lo más cerca posible de la blanca | Seis lanzamientos sentados, cada vez más suaves | L · [Comité Paralímpico](https://www.paralympic.org/boccia) |
| 9 | Dos impulsos y hay que botar | En el baloncesto en silla la canasta está igual de alta y los «pasos» se cuentan en empujones a las ruedas | Dos impulsos, bote, dos impulsos, pase | L · [Federación Internacional de Baloncesto en Silla](https://iwbf.org/rules-of-wheelchair-basketball/) |
| 10 | Dos corredores unidos por una cuerda | Quien no ve corre con un guía, unidos por una cuerdecita; el guía avisa con la voz y no puede tirar | Marcha sincronizada por parejas, sin tocarse | L la cuerda y la voz · [Comité Paralímpico](https://www.paralympic.org/news/para-athletics-explained-guide-running); la regla de la meta, B |
| 11 | Aquí está prohibido levantarse | Vóley sentado: nació en los Países Bajos en 1956; la pelvis tiene que tocar el suelo al golpear | Toques de dedos y antebrazos sin despegarse de la silla | L · [Comité Paralímpico](https://www.paralympic.org/sitting-volleyball) |
| 12 | «¡Voy!», la palabra obligatoria | En el fútbol para ciegos se dice «¡voy!», en español, en todo el mundo, antes de ir al balón | Ojos cerrados: decir «¡voy!» y señalar de dónde viene la palmada | L · [Comité Paralímpico](https://www.paralympic.org/blind-football) |
| 13 | Paralímpico quiere decir «al lado» | «Para» es «junto a» en griego. Empezaron en 1948 en un hospital inglés, con 16 personas tirando con arco | Empujar unas ruedas imaginarias 15 segundos | L · [Comité Paralímpico](https://www.paralympic.org/ipc/history) |
| 14 | Una flecha encendió Barcelona 92 | La disparó un arquero paralímpico español; es el único deportista paralímpico que ha encendido un pebetero olímpico | Cinco flechas imaginarias | L · [Comité Paralímpico](https://www.paralympic.org/news/throwback-thursday-spain-s-antonio-rebollo) |

### Deportes alternativos

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 15 | Colpbol: prohibido agarrar el balón | Lo creó en 1997 un profesor de EF valenciano. Equipos mixtos; el balón sólo se golpea y nadie lo toca dos veces seguidas | Diez golpeos con la mano abierta | L · [EFDeportes](https://efdeportes.com/efd183/colpbol-un-nuevo-deporte-de-equipo.htm) |
| 16 | El datchball nació en un pueblo aragonés | Hacia 2005, en el colegio de Brea de Aragón. Tres balones a la vez: nadie está parado | Lanza y esquiva, cinco veces | L · [Ayuntamiento de Zaragoza](https://zaragoza.es/sede/portal/juventud/info-joven/servicio/noticia/331539) |
| 17 | **Un deporte inventado en Dos Hermanas** | El pinfuvote nació en 1992 en un colegio de Dos Hermanas (Sevilla). El nombre junta ping-pong, fútbol, voleibol y tenis | Tres toques con tres partes del cuerpo | L · [EFDeportes, por su creador](https://efdeportes.com/efd211/pinfuvote-un-nuevo-deporte-fusion.htm) |
| 18 | Un balón gigante y tres equipos | Tres equipos a la vez y un balón de más de un metro; antes de golpear se dice el color del equipo que debe cogerlo | Sujetar el balón imaginario, decir un color y golpear | L una ficha docente · [CEFIRE](https://portal.edu.gva.es/cefireae/wp-content/uploads/sites/217/2019/11/THE-KINBALL.pdf). El nombre es marca: «el deporte del balón gigante» |
| 19 | Un deporte sin árbitros | En el ultimate, con disco volador, las faltas las señalan los propios jugadores: «espíritu de juego» | Cinco lanzamientos de revés pivotando | L · [Federación Mundial de Disco Volador](https://wfdf.sport/history/history-of-sotg/) |
| 20 | Un deporte con nombre de sonido | «Tchouk» es el ruido del balón en el marco elástico. Lo ideó un biólogo suizo que quería un juego sin choques | Lanzar, recoger el rebote y decir «¡tchouk!» | L · [Federación Internacional de Tchoukball](https://fitb.org/tchoukball/history) |
| 21 | Chicas y chicos, mismo equipo | El korfball, de hacia 1902, es mixto desde el primer día: cuatro y cuatro | Cinco tiros a una cesta altísima | B · [Federación Internacional de Korfball](https://korfball.sport/playing-rules/) |

### El cuerpo en movimiento

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 22 | **¿Mito o verdad? Las agujetas** | No son «cristales de ácido láctico»: ese ácido desaparece en una hora y las agujetas llegan uno o dos días después. Son pequeñas roturas del músculo | Cinco sentadillas bajando en cuatro tiempos | L · [Houston Methodist](https://www.houstonmethodist.org/blog/articles/2021/oct/is-lactic-acid-buildup-really-what-causes-muscle-soreness-after-a-workout/) |
| 23 | Nadie sabe del todo qué es el flato | Le pasa cada año a unas siete de cada diez personas que corren. La ciencia aún no tiene clara la causa | Mano en el costado y cinco respiraciones hondas | L · [Sports Medicine, 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4281377/) |
| 24 | El bostezo sigue siendo un misterio | No hay respuesta definitiva; lo que sí es verdad es que se contagia | Fingir un bostezo enorme y contar a cuántos se pega | L · [Cleveland Clinic](https://health.clevelandclinic.org/why-do-you-yawn-and-is-it-contagious) |
| 25 | Una de cada diez personas es zurda | Algo más del 10 %. También tenemos un pie y un ojo preferidos | Lanzar, chutar y mirar por un catalejo; luego con el otro lado | L el resumen · [Psychological Bulletin, 2020](https://research-portal.st-andrews.ac.uk/en/publications/human-handedness-a-meta-analysis/) |
| 26 | Tu sexto sentido se llama propiocepción | Con los ojos cerrados sabes dónde tienes la mano: te lo dicen sensores de músculos y tendones | Ojos cerrados: tocarse la nariz y juntar los índices | L · [Universidad de Washington](https://staff.washington.edu/chudler/proprio.html) |
| 27 | Tu músculo más grande es el glúteo | El más fuerte depende de cómo se mida; el de la mandíbula es el que más aprieta | Levantarse y sentarse cinco veces sin manos | B · [Biblioteca del Congreso de EE. UU.](https://www.loc.gov/everyday-mysteries/biology-and-human-anatomy/item/what-is-the-strongest-muscle-in-the-human-body/) |
| 28 | Tus huesos crecen por las puntas | Cerca de los extremos hay placas de cartílago donde se fabrica hueso nuevo | Estirarse de puntillas y tocar rodilla y muñeca | L · [KidsHealth](https://kidshealth.org/en/parents/growth-plates.html) |
| 29 | Movimientos que no pasan por el cerebro | El reflejo de la rodilla va a la médula y vuelve | Golpecito bajo la rótula. No siempre sale: probar antes en clase | L · [Manual MSD](https://www.msdmanuals.com/home/multimedia/image/reflex-arc-a-no-brainer) |
| 30 | Un cuarto de tus huesos, en los pies | 26 huesos en cada pie: 52 de los 206 | Puntillas y talones; escribir tu número con el pie | L · [Arthritis Foundation](https://www.arthritis.org/health-wellness/about-arthritis/where-it-hurts/anatomy-of-the-foot) |

### Salud

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 31 | ¿Mito o verdad? Los dos litros | No hay cifra mágica: cuenta toda el agua, también la de la fruta, la leche y la comida | Un salto por cada cosa que hoy te ha dado agua | B · [EFSA](https://www.efsa.europa.eu/en/efsajournal/pub/1459) |
| 32 | La mochila, con las dos asas | Los pediatras aconsejan que no pese más del 10-15 % de lo que pesas | Ponerse una mochila imaginaria doblando las rodillas | B · [Asociación Española de Pediatría](https://enfamilia.aeped.es/printpdf/vida-sana/mochilas-escolares) |
| 33 | Menos de una hora de pantalla | Recomendación de los pediatras españoles desde 2024 para los 7-12 años, contando la del colegio | Mirar 20 segundos a lo lejos y marchar en el sitio | L · [AEP, Plan Digital Familiar](https://plandigitalfamiliar.aeped.es/downloads/Infografia_Recomendaciones%20por%20edad_AEP_Plan%20Digital%20Familiar_v4.pdf) |
| 34 | **El sol tiene nota: el índice UV** | De 0 a 2 es bajo; por encima de 11, extremo. Con nubes también puede ser alto | Prepararse con mímica: gorra, gafas y crema | L · [AEMET](https://www.aemet.es/ca/eltiempo/prediccion/radiacionuv/ayuda) |
| 35 | No pares de golpe | Si paras en seco, el pulso y la tensión bajan deprisa y puedes marearte | Diez segundos rápido, diez lento, diez de respiración | L · [American Heart Association](https://www.heart.org/en/healthy-living/fitness/fitness-basics/warm-up-cool-down) |

### Historia y cultura

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 36 | El voleibol se llamó «mintonette» | Lo inventó William G. Morgan en 1895, cuatro años después del baloncesto | Cinco saques y cinco toques de dedos | L · [Federación Internacional de Voleibol](https://www.fivb.com/volleyball/the-game/history/) |
| 37 | El bádminton lleva nombre de una casa | Badminton es una finca inglesa donde se jugó hacia 1873 | Cinco saques cortos de revés | B · [Britannica](https://www.britannica.com/sports/badminton) |
| 38 | El tenis de mesa nació en la sobremesa | En la Inglaterra de 1880 se jugaba sobre la mesa del comedor, con libros como red | Diez golpes con la mano como pala | B · [ITTF](https://ittf.com/history/documents/historyoftabletennis) |
| 39 | Judo: el «camino de la suavidad» | Lo creó Jigoro Kano en Japón en 1882; es olímpico desde 1964 | El saludo de pie, a tres personas | L · [Federación Internacional de Judo](https://www.ijf.org/history) |
| 40 | En 1900 compitieron las primeras olímpicas | En 1896 sólo hubo hombres. En París 2024, por primera vez, las mismas plazas para mujeres que para hombres | Cinco saques de tenis imaginarios | B · [Comité Olímpico Internacional](https://olympics.com/ioc/faq/history-and-origin-of-the-games/when-did-women-first-compete-in-the-olympic-games) |
| 41 | Gimnasio es una palabra griega | Viene de «gymnós»: en la Grecia antigua los atletas entrenaban sin ropa | El lanzador de disco, despacio | B · [Universidad de Murcia](https://revistas.um.es/cpd/article/download/356111/255561/1202561) |
| 42 | **El flamenco es Patrimonio de la Humanidad** | Desde 2010. Cante, baile y toque, con palmas y taconeo | Compás de cuatro con palmas y luego con los pies | L · [UNESCO](https://ich.unesco.org/es/RL/el-flamenco-00363) |
| 43 | **Blanco y rojo: vas por buen camino** | Los senderos se marcan con dos rayas: blanco y rojo los largos, blanco y amarillo los medianos, blanco y verde los cortos. Un aspa es «por aquí no» | El profe canta «rayas», «giro» o «aspa» | L · [FEDME, manual de senderos](https://fmm.es/wp-content/uploads/2023/05/ManualSenderosFEDME_18.pdf) |
| 44 | **El club de fútbol más antiguo: Huelva** | Fundado el 23 de diciembre de 1889; su actividad es Bien de Interés Cultural de Andalucía | Diez pases con el interior del pie | L · [BOJA, Decreto 139/2016](https://www.juntadeandalucia.es/boja/2016/148/BOJA16-148-00006-14100-01_00096459.pdf) |
| 45 | El pádel llegó a España por Marbella | Se inventó en México en 1969; las dos primeras pistas de España se hicieron en Marbella en 1974 | Dejar que la pelota rebote detrás y golpear | L · [federación británica de tenis](https://www.ltapadel.org.uk/what-we-do/what-is-the-history-of-padel/) |

### Inglés útil en Educación Física

| # | Titular | El dato | Pruébalo | Fuente |
|---|---|---|---|---|
| 46 | «Soccer» es una palabra inglesa | Nació en Inglaterra: es «Association football» acortado | British or American? Salto a un lado u otro: football/soccer, pitch/field | L · [Oxford University Press](https://blog.oup.com/2014/07/football-soccer-vocabulary/) |
| 47 | En inglés británico, cero es «nil» | Un 2-0 es «two–nil»; la ropa de deporte es el «kit» y el campo, el «pitch» | La pareja dice un resultado y se hace con saltos | L · la misma |
| 48 | Chutar viene de «shoot» | Y fútbol, de «foot» y «ball» | Cinco chuts con cada pie diciendo «shoot!» | B · [Diccionario de la RAE](https://dle.rae.es/chutar) |

**Descartadas por falta de fuente seria:** el pañuelo, las canciones de comba, el elástico y las chapas (sólo webs de crianza y blogs); el trompo (fechas contradictorias); el tiro con honda (sólo prensa local, y el movimiento invita a lanzar); el balonmano (orígenes contradictorios); «la medalla de oro es de plata» (ninguna fuente del COI). **Mitos que no deben entrar como dato:** el 10 % del cerebro, los ocho vasos de agua, el ácido láctico de las agujetas, la lengua como músculo más fuerte, bostezar por falta de oxígeno. Algunos sirven para una serie «¿Mito o verdad?».

**Cuidados al escribirlas:** las curiosidades «de oído» (goalball, fútbol para ciegos, gallinita ciega) no deben colgar la misma semana. Las marcas y los escudos se pueden nombrar en texto, nunca dibujar. Las personas reales aparecen sólo en texto. Con ojos cerrados, siempre junto a la mesa y con los pies quietos.

## 6. Propuesta: qué incluir y en qué orden

Ordenado por lo que aporta a la clase frente a lo que cuesta hacerlo. Pablo dio el visto bueno a la propuesta entera el 24 de noviembre de 2026. **Los pasos 1 a 5 están hechos**; el resto, sin empezar.

| Paso | Qué | Por qué ahora | Qué hace falta |
|---|---|---|---|
| **1 · hecho** | **«Adivina antes de abrir»** en los cuadros: pregunta, apuesta con el cuerpo, pausa y ficha | Es lo mejor respaldado para 10-12 años y sólo cambia el orden de la ficha | Hecho: campos `pregunta`, `opciones` y `correcta` en las 30 curiosidades |
| **2 · hecho** | **Segunda tanda de curiosidades:** las 12 con fuente leída y sabor propio: bolos serranos, pinfuvote, Huelva, flamenco, senderos, índice UV, agujetas, flato, vóley sentado, «¡voy!», zurdos y «soccer» | Mete la cultura andaluza (criterio 4.1), lo paralímpico (4.2) y el bloque F con poco esfuerzo, y sube el banco a 30 | Hecho: están en `curiosidades.js` con dibujos prestados y sus cuadros pedidos en el lote `16-pasillo`. Falta que Pablo las repase |
| **3 · hecho** | **Vuelta a la calma:** «Respira con la ola» y «Tensar y soltar» en El Tatami | Es la barrera que más cita el profesorado para usar descansos activos, y cierra lo que quedaba por decidir en yoga | Hecho: `tatami/calma.js`, en la pestaña «Practicar» |
| **4 · hecho** | **El Botiquín mínimo:** PAS en escena y posición lateral por tríos; «La llamada» como complemento | Es la mayor laguna curricular y completa el único criterio que ya da nota (1.3) | Hecho: carpeta `botiquin/`, con puerta en el pasillo, seis casos, los siete pasos y la llamada. Arte pedido en el lote `17-botiquin` |
| **5 · hecho** | **La Sala de Espejos:** eco de percusión, estatuas con regla que cambia, mímica bilingüe y coreografía de ocho tiempos | Cubre expresión y ritmo (criterio 4.3) con movimiento de toda la clase y casi sin arte | Hecho: carpeta `espejos/`, con puerta en el pasillo de la pantalla. La coreografía tiene su propio constructor, más simple que el de yoga. Arte pedido en el lote `18-espejos` |
| **6** | **Intervalos con historia** de cuatro minutos en Las Espalderas, que pasa de cuadro de diálogo a escena | La dosis con mejor relación entre tiempo y efecto; resuelve de paso la escena que le falta a Las Espalderas | Escribir cuatro o cinco historias |
| **7 · hecho en su primera parte** | **El Circuito:** orientación con el plano del gimnasio (secciones 8 y 9). Quedan para después el plano del aula y las señales con el cuerpo | Abre la competencia 5, hoy sin ninguna evidencia, sin salir de clase | Hecho: carpeta `circuito/`, con puerta en los dos pasillos y cuatro hojas. Arte pedido en el lote `19-circuito` |
| **8** | **El Patio Cubierto:** juegos populares andaluces y «Juegos sentados» paralímpicos | La seña propia del currículo andaluz | Documentarse con Pablo sobre qué se juega aquí |
| **9** | **Tarjeta verde** tras los partidos de mate y **Verdad o mito** | Juego limpio, igualdad e imagen corporal (criterios 1.4, 3.2, 3.3) | Escribir los dilemas con mucho cuidado |
| **10** | **La Vitrina:** reto de la clase de la semana, con sellos de «lo hicimos» | Da sentido de conjunto sin clasificaciones | Que existan las actividades anteriores |

### Lo que decide Pablo

1. ~~Cómo se llama aquí el balón prisionero.~~ **Decidido (24/11/2026): «el mate».** El juego lo llama así en la puerta de La Pista, en su menú, en la curiosidad y en el rosco; «balón prisionero» queda como el nombre de otros sitios.
2. **Qué juegos populares son «de aquí».** No hay fuente seria para el pañuelo, el elástico o las chapas, y sin embargo se juegan. Su conocimiento vale más que lo encontrado.
3. ~~El micrófono en la pantalla digital.~~ **Decidido (24/11/2026): sí**, con las condiciones de la tabla: sólo en la pantalla digital, activado por el profe, midiendo el volumen sin grabar ni enviar nada, escrito en `PRIVACY.md` y con alternativa sin micrófono. Se hará con «Una sola palmada», en La Vitrina.
4. **Qué criterios nuevos dan nota.** Varias actividades darían evidencia de 1.2, 2.1, 4.1, 4.3 y 5.1; hoy sólo cuenta el 1.3.
5. **Personas reales en el texto.** Las candidatas nombran a inventores y deportistas; la regla actual sólo prohíbe su imagen.
6. ~~Primeros auxilios.~~ **Decidido (24/11/2026):** lo evaluable es PAS y posición lateral; la llamada entra como complemento, sin nota.

## 7. El Botiquín: ¿es correcto lo que enseña?

El contenido de `botiquin/casos.js` se contrastó el 24 de noviembre de 2026, instrucción por instrucción, con guías de primeros auxilios. **Ninguna de las respuestas que el juego da por buenas era incorrecta.** Había un error de matiz y varios ajustes, ya aplicados.

| Qué | Antes | Ahora | Fuente (leída) |
|---|---|---|---|
| Comprobar si responde | «Se le habla y se le toca el hombro, sin sacudir» | Se le habla alto y se le mueven los hombros **con suavidad** | [Cruz Roja Española](https://www.cruzroja.es/prevencion/descargas/hogar/Folletoaccidentes2015_Castellano.pdf), [061 Andalucía](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/emergencias061/sites/default/files/mediafile_sasfile/2024/Guia_de_primeros_auxilios_web2.pdf), [St John Ambulance](https://www.sja.org.uk/first-aid-advice/primary-survey/) |
| Caída con dolor de espalda | «Un adulto decide si hay que llamar al 112» | Con una caída así, el profe llamará al 112; que no mueva ni la cabeza | [St John Ambulance](https://www.sja.org.uk/first-aid-advice/spinal-injury/), [AEPap](https://www.aepap.org/sites/default/files/documento/archivos-adjuntos/texto_fracturas_colegios.pdf) |
| Mareo por calor | «Está muy roja»; «sentada o tumbada» | «Pálida y sudando mucho» (la piel roja y seca es golpe de calor, más grave); tumbada con las piernas en alto; se nombran las señales para llamar al 112 | [NHS](https://www.nhs.uk/conditions/heat-exhaustion-heatstroke/), [MedlinePlus](https://medlineplus.gov/spanish/ency/article/000056.htm), [St John Ambulance](https://www.sja.org.uk/first-aid-advice/heat-exhaustion/) |
| Sangrado de nariz | «Unos diez minutos» | Diez minutos seguidos, sin soltar para mirar y respirando por la boca | [British Red Cross](https://www.redcross.org.uk/first-aid/learn-first-aid/nosebleeds), [NHS](https://www.nhs.uk/conditions/nosebleed/), [MedlinePlus](https://medlineplus.gov/spanish/ency/article/003106.htm) |
| Tobillo torcido | Frío envuelto | Se añade el límite: no más de 10 o 20 minutos. Reposo, frío y elevación siguen vigentes | [NHS](https://www.nhs.uk/conditions/sprains-and-strains/), [British Red Cross](https://www.redcross.org.uk/first-aid/learn-first-aid/strains-and-sprains) |
| Herida que sangra | «Soplar lleva microbios» | «Soplar no limpia ni para la sangre»: lo de los microbios no tiene fuente seria | [British Red Cross](https://www.redcross.org.uk/first-aid/learn-first-aid/bleeding-heavily), [AEPap](https://www.aepap.org/sites/default/files/documento/archivos-adjuntos/texto_heridas_colegios.pdf) |
| Para qué sirve ponerle de lado | «De lado respira mejor» | De lado, ni la lengua ni un vómito le tapan el aire; si deja de respirar bien, hace falta RCP | [061 Andalucía](https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/emergencias061/sites/default/files/mediafile_sasfile/2024/Guia_de_primeros_auxilios_web2.pdf) |
| Posición lateral, paso 1 | Mirar si respira | Hasta 10 segundos | Cruz Roja Española |
| Posición lateral, paso 2 | — | Antes: quitar las gafas y estirar las piernas | [St John Ambulance](https://www.sja.org.uk/first-aid-advice/recovery-position/) |
| Posición lateral, paso 7 | Quedarse y vigilar | Que un adulto llame al 112 si aún no lo ha hecho; vigilar la respiración todo el rato | Cruz Roja Española, [ILCOR 2025](https://www.ilcor.org/uploads/FA-2025-COSTR-Full-Chapter.pdf) |
| Cuándo **no** se hace | No se decía | Tras una caída o un golpe no se mueve a nadie: se dice antes de practicar | [Resuscitation Council UK 2025](https://www.resus.org.uk/library/2025-resuscitation-guidelines/first-aid-guidelines), AEPap |
| La llamada | Cinco preguntas | Se añaden «¿Hay algún peligro cerca?» y poner el altavoz | [061 Andalucía](https://juntadeandalucia.es/temas/salud/urgencias/urgencias.html), [Gobierno de La Rioja](https://riojasalud.es/files/content/ciudadanos/escuela-salud/la-salud-en-tu-comunidad/entorno-y-salud/2023.03.31_LR_Manual%20de%20RCP_4%C2%BAEP-2%C2%BAESO.pdf) |

**Lo que se confirmó sin cambios:** «Proteger, Avisar, Socorrer» es la formulación de Cruz Roja Española (en inglés no hay un equivalente fijo; se usa «Protect, call for help, give first aid»). La secuencia de la posición lateral coincide con la de St John Ambulance y el 061 de Andalucía. Echar la cabeza hacia atrás con sangre en la nariz es un error. No se da de beber a quien no responde.

**¿Pueden practicar la posición lateral entre ellos?** Sí: el manual escolar del Gobierno de La Rioja la enseña desde 4.º de Primaria y el programa de la Cruz Roja británica para 5 a 11 años la incluye. Ninguna guía detalla normas para practicarla entre compañeros; las que enseña la pantalla salen de la propia técnica (gafas, bolsillos, sin tirones, nadie encima) y de sentido común docente.

**Lo que no se pudo confirmar** en una fuente de primer nivel, y por eso se ha escrito con prudencia: que tirar de la zapatilla haga más daño y que echar agua en la cara no ayude (son opciones marcadas como error por prudencia, sin cita). No se pudieron abrir las guías europeas de reanimación de 2021 ni las estadounidenses de 2024; la secuencia europea se contrastó de forma indirecta, por su adaptación británica de 2025.

**Límite que la pantalla dice y hay que mantener:** enseña el orden, no sustituye a un taller con alguien que sepa de primeros auxilios.

## 8. La orientación: qué existe y qué dice la evidencia

Consulta: 24 de noviembre de 2026, antes de diseñar El Circuito. **L** = fuente leída (al menos el resumen); **B** = sólo resultado de búsqueda.

### Lo que ya existe en digital

No hay ningún juego de navegador que enseñe a orientar el plano a los 10-12 años. Lo que hay se reparte en tres grupos:

| Tipo | Ejemplos | Por qué no sirve tal cual |
|---|---|---|
| Simuladores 3D de bosque | [Catching Features](https://catchingfeatures.com/game.php) (L), Virtual-O (B), [The Forest](https://grelf.itch.io/forest/devlog/778564/the-forest-orienteering-simulation) (L) | Para orientadores: curvas de nivel, instalación, individual y sentado |
| Cuestionarios de símbolos y teoría | [iKnow-O](https://iknow-o.com/quiz) (L), [Educaplay](https://www.educaplay.com/learning-resources/5892367-mapa_de_orientacion_simbologia.html) (L), [Genially](https://view.genially.com/5ecf81705173f90db7dc1720/game-orientacion) (L) | Es lo que abunda y no es la dificultad real; no se lee ningún plano |
| Aplicaciones con GPS | MapRun, UsynligO, iOrienteering ([comparativa](https://sites.google.com/navigationgames.org/management/resources/orienteering-apps), L) | Posicionan a quien las usa: excluidas con menores |

Dos referencias valen como modelo de mecánica: el simulador de TempO (una foto del terreno con varias balizas y un recorte de plano: ¿cuál es la del círculo?) y «Where Are We?», de la Universidad de Columbia y Penn State, el único diseñado desde la investigación para Primaria: vídeos de un parque enlazados a su plano ([descripción](https://www.ldeo.columbia.edu/~kastens/spatial/mapskills/index.html), L).

**Formatos de entrenamiento sin terreno** que caben en una pantalla ([o-training.net](https://o-training.net/w/Category:Orienteering_exercises.html), L): memoria de plano (ver el tramo, ocultarlo e ir), encadenar muchos controles cortos, seguir una línea, ver sólo un corredor o una ventana del plano. Y los de [Navigation Games](https://navigation-games-2.gitbook.io/navigationgames/progressions/at-home-intro/list-of-games) (L), los más cercanos a «junto a la mesa»: colocar objetos según un plano de mesa, girar el plano hasta que cuadre con la sala y «¡congelados!» para comprobar si sigue orientado.

### Qué cuesta de verdad a esta edad

- **Los símbolos no son el problema.** A los tres años ya se entiende que un plano representa un lugar ([Uttal, 2000](https://groups.psych.northwestern.edu/uttal/vittae/documents/Seeingthebigpictureuttal2000_000.pdf), L).
- **Lo difícil es la geometría: relacionar el plano con el espacio cuando no están alineados.** Con 259 niños de 5 a 12 años y el plano de su propia aula, se acierta más con el plano alineado que girado 180°, y cuando se mira paralelo a una pared ([Liben y Downs, 1993](https://pure.psu.edu/en/publications/understanding-person-space-map-relations-cartographic-and-develop/), L).
- **En 4.º siguen los errores graves al situarse en un mapa.** Nadie usó la escala ni la flecha del norte, y los fallos vienen de fijarse en detalles que no informan ([Kastens y Liben, 2010](https://pure.psu.edu/en/publications/childrens-strategies-and-difficulties-while-using-a-map-to-record/), L).
- **Rinde más quien coordina por su cuenta plano y espacio** ([Liben y otros, 2013](https://pure.psu.edu/en/publications/environmental-scale-map-use-in-middle-childhood-links-to-spatial-/), L). En 5.º y 6.º habrá niveles muy distintos.
- **El mapa mental no se organiza por el norte, sino por los ejes del lugar** ([Brunyé y otros, 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4564159), L, en adultos). La referencia deben ser las paredes y los objetos antes que los puntos cardinales.

### Qué ayuda

- **Decir en qué te has fijado.** En 4.º, quienes explicaban la pista usada cometieron menos errores graves ([Kastens y Liben, 2007](https://pure.psu.edu/en/publications/eliciting-self-explanations-improves-childrens-performance-on-a-f/), L). Sin texto libre: elegir entre tres pistas dibujadas.
- **Señalar y nombrar los puntos de referencia útiles** ([Lingwood y otros, 2015](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00174/full), L).
- **Ver el sitio «a pie de pista» junto al plano**, y **girar el plano uno mismo**: si gira solo, se pierde la destreza que se quiere enseñar.
- **Precisión antes que velocidad**, con corrección inmediata y dificultad graduada.

### Qué se puede prometer

La orientación en la escuela tiene evidencia prometedora pero escasa: seis meses de orientación mejoraron la memoria visoespacial en niños de 8 a 10 años ([Notarnicola y otros, 2012](https://ricerca.uniba.it/handle/11586/126403), L), y una revisión de 11 estudios habla de «evidencia limitada» ([Morawietz y Muehlbauer, 2021](https://www.frontiersin.org/articles/10.3389/fspor.2021.664640/full), L). Navegar en pantalla se parece a navegar de verdad, pero la pantalla no entrena girar el propio cuerpo, las distancias reales ni leer mientras se corre. **El juego es la preparación de la orientación real en el patio, no su sustituto.**

### Lo que una web puede y no debe hacer

Sí, sin permisos: girar el plano con el dedo, el ratón o botones; arrastrar un marcador de «pulgar»; tocar balizas; tapar parte del plano; esconderlo para memoria; reloj y sonido. **No: GPS, cámara ni brújula del móvil.** La brújula no da ubicación, pero pide permiso ante menores, no existe en ordenadores ni en la pantalla digital, y entre mesas metálicas falla.

### Del plano al movimiento de toda la clase

Hay actividades publicadas de girar o correr hacia el punto que se canta, con cada pared como un punto ([The PE Dept](https://thepedept.com/activities/compass-points-navigation-game), L; Scouts, B), y la lección de 5.º de [Oak National Academy](https://www.thenational.academy/teachers/programmes/physical-education-primary-ks2/units/outdoor-adventurous-activities-orienteering/lessons/orientating-a-map-to-locate-points) (L), cuyo error típico es llevar el plano al revés. Ninguna usa una pantalla. La adaptación natural: la pantalla enseña el plano girado con una baliza y toda la clase señala con el brazo, o gira el cuerpo, hacia ese punto del espacio real.

### Qué se enseña y en qué orden

Las progresiones publicadas coinciden en el orden; cambian los nombres y la edad exacta. Fuentes leídas: el [sistema de pasos](https://www.britishorienteering.org.uk/document/b59e3524efd9ceaab452980bd12793a3/coaching_support_stepsystem.pdf) y el [curso para docentes](https://www.britishorienteering.org.uk/document/4817a779f7097235d40ea98215f47227/coaching_teachingorienteering_part_1.pdf) de British Orienteering, las [cinco lecciones de Scottish Orienteering](https://www.scottish-orienteering.org/download/57/schools-teachers/15573/schools-self-help-orienteering.pdf), los [niveles irlandeses](https://www.orienteering.ie/wp-content/uploads/2025/11/Orienteering-Skills-Levels-Descriptors.pdf), el [documento francés de ciclo 3](https://eduscol.education.fr/document/16669/download), el [libro del CSD y la FEDO](https://www.fedo.org/web/ficheros/area-tecnica/eeto/libros/libro-001.pdf) y la [unidad de 4.º del CEFIRE valenciano](https://portal.edu.gva.es/cefireae/wp-content/uploads/sites/217/2019/09/UD4o-PRIMARIA.pdf). No se encontró ningún programa escolar publicado por la federación andaluza.

| Paso | Habilidad | ¿A los 10-12 años? |
|---|---|---|
| 0 | Entender qué es un plano: vista de pájaro, objeto y símbolo | Sí, es la base |
| 1 | **Orientar el plano** con el espacio y mantenerlo orientado al girar | Sí, es la prioridad |
| 2 | Leyenda corta: colores y símbolos habituales | Sí, con pocos símbolos |
| 3 | Símbolos del recorrido: triángulo, círculos, doble círculo, orden | Sí |
| 4 | Doblar el plano y técnica del pulgar | Sí |
| 5 | Seguir caminos y elementos lineales; decidir en los cruces | Sí, es el núcleo de la edad |
| 6 | Salir de la línea a un control visible y volver; línea de parada | Sí, al final |
| 7 | Elección de ruta simple | Sí, sencilla |
| 8 en adelante | Rumbos con brújula, talonamiento, curvas de nivel | Después de los 12 |

Espacios, siempre en este orden: aula, gimnasio, patio, parque. Lema de la unidad valenciana: «primero pensar y luego correr».

### Convenciones reales que el juego respeta

- **Recorrido** (norma de sprint, traducida por la FEDO): la salida es un triángulo; cada control, un círculo, y **el control está en el centro del círculo**, no donde está el número; la meta son dos círculos concéntricos. Todo en magenta. Las líneas que unen controles indican el orden, no el camino.
- **Número y código.** El número del plano es el orden. La baliza lleva un código distinto, que nunca es menor de 31, y hay que comprobarlo antes de picar ([reglamento de la FEDO de 2025](https://fedo.org/web/ficheros/competicion/o-pie/reglamentos/2025/Reglamento-Orientacion-2025.pdf), leído).
- **La baliza** es un prisma de tres caras; cada cara, un cuadrado de 30 cm partido por la diagonal, mitad blanco y mitad naranja (mismo reglamento).
- **El norte** es el borde de arriba del papel cuando se leen las letras, no «lo que tengo delante». El método escolar sueco pinta de rojo el borde norte del plano y lo hace coincidir con una pared marcada: «rojo a rojo».
- **Colores**: blanco, bosque por el que se corre bien; amarillo, terreno abierto; verde, vegetación que frena; verde oliva, zona prohibida; azul, agua; negro, lo construido; gris, edificios; magenta, el recorrido. En el plano de un gimnasio casi todo es negro sobre el suelo.
- **Formatos de recorrido**: en línea (orden obligatorio), score (orden libre y tiempo límite), estrella (se vuelve al centro tras cada control), laberinto y rejilla de conos.

### Errores típicos y cómo se corrigen

| Error | Corrección que proponen las fuentes |
|---|---|
| No orientar el plano, o dejar de hacerlo al girar | Reorientarlo en cada cambio de dirección; «rojo a rojo» |
| Salir corriendo sin plan | «Primero pensar y luego correr»; decir sobre qué objeto está la baliza antes de salir |
| Anteponer velocidad a precisión | Puntuar aciertos, no tiempo, al principio |
| Picar una baliza que no es la suya | Comparar siempre el código |
| Ante el fallo, cambiar de recorrido en vez de analizar | Repetir el mismo y repasar la ruta |
| Perderse y seguir andando | Parar, orientar el plano y volver al último punto seguro |

### Seguridad en la sesión real

Parejas o tríos que no se separan; límites y zonas prohibidas explicados antes de salir; hora de regreso y pasar siempre por meta; una señal sonora que significa «volved ya»; si te pierdes, quédate en una baliza ([guía de seguridad de British Orienteering](https://www.britishorienteering.org.uk/doc/coaching/deployer-safety-guidelines-2026.pdf), leída).

### Lo que la pantalla no enseña

Talonamiento, rumbos con brújula real, curvas de nivel, relocalizarse de verdad, leer el plano corriendo y estimar distancias reales. El aprendizaje se cierra en el patio.

## 9. El Circuito: la propuesta

Lugar nuevo: **El Circuito**, en el pasillo del alumno y en el de la pantalla digital. Todo ocurre en un sitio que el alumnado ya conoce, el gimnasio pintado, y su plano.

**Cuatro hojas**, en el orden de las progresiones (y como las «hojas de orientación» de dificultad creciente que Pablo ya programaba):

| Hoja | Qué se hace | Habilidad | Cómo se mueve la clase |
|---|---|---|---|
| 1 · **El plano** | El gimnasio pintado y su plano, lado a lado. Se señala un objeto en el cuadro y hay que tocarlo en el plano | Vista de pájaro y leyenda, en dos idiomas | Antes de tocar, todos señalan con el brazo hacia dónde está ese objeto en la sala real… o en el cuadro |
| 2 · **Orienta el plano** | Se ve el gimnasio desde una de sus cuatro paredes y el plano sale girado. Hay que girarlo hasta que lo que se tiene delante quede arriba | Orientar el plano: la que más cuesta | El plano sólo se gira con las manos: nunca gira solo |
| 3 · **Señala la baliza** | Desde el centro del gimnasio, mirando a una pared: ¿dónde está la baliza del plano, delante, detrás, a la izquierda o a la derecha? | Relacionar plano y espacio | Toda la clase gira el cuerpo o señala con el brazo; sentados, con el brazo |
| 4 · **El recorrido** | Un recorrido en línea con triángulo, cinco controles y meta. En cada control hay tres balizas con su código: se pica la que está en el centro del círculo. Entre control y control, a correr | Símbolos del recorrido, centro del círculo, código | «Primero pensar y luego correr»: ocho segundos de carrera en el sitio entre controles |

**Decisiones de diseño que salen de la investigación:**

- **El plano no gira solo.** Girarlo es la destreza.
- **La referencia son las paredes y los objetos**, no los puntos cardinales. El borde norte del plano va en rojo y siempre mira a la pared de la canasta: «rojo a rojo».
- **Tras un fallo, «¿en qué te has fijado?»**, con tres pistas para elegir. Sin texto libre.
- **Precisión, no velocidad.** No hay reloj que puntúe; se anotan aciertos e intentos.
- **Nada de GPS, cámara ni brújula del móvil.**
- **Las vistas del gimnasio desde tres de sus paredes no están pintadas**: se dibujan con formas simples y se piden en el lote `19-circuito`.

**Hecho el 24/11/2026:** carpeta `circuito/` (`plano.js` son el gimnasio y las reglas, con sus pruebas; `dibujos.js`, el plano y las vistas), puerta en el pasillo del alumno y en el de la pantalla, y anotación `record('circuito', 'orientacion', 'hoja', …)`.

**Lo que queda para después:** elección de ruta y recorrido score; memoria de plano; el plano del aula que el profe configura para señalar balizas en la sala real; y la ficha para la sesión de patio, con las normas de seguridad.
