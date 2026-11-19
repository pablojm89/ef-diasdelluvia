# Patio Interior: concepto de producto

## La idea

«Fuera llueve. Dentro se juega». Un club de misiones de aula en el que una tripulación recupera seis señales: coordinación, equilibrio, ritmo, expresión, cooperación y calma. La dirección visual actual es una aventura de islas flotantes: azul nocturno, oro cálido, vegetación y luces de refugio. Chispa, un robot explorador con capa amarilla, acompaña al grupo. El mapa abre las tres experiencias; las balizas, el escenario de baile y la arena forman parte de la interfaz jugable. Las capturas actuales están en el README. No se utilizan personajes de franquicias.

El profesor abre la app, decide cómo está el aula, cuánto tiempo tiene y cuántos dispositivos usará. El sistema propone una sesión. Los alumnos reciben una consigna breve, dejan el dispositivo en un lugar estable y actúan. Vuelven a la pantalla para elegir, responder o dar feedback.

La referencia a Multiplicópolis se toma del encargo: autonomía, interactividad y variedad. No se ha auditado su código ni se presupone que su arquitectura o identidad deban reutilizarse.

## Formas de jugar

| Modalidad | Dispositivos | Organización | Validación |
| --- | --- | --- | --- |
| Individual | Uno por alumno o estación | Reto personal y registro de mejora | Autoobservación guiada; no ranking público |
| Cooperativa de grupo | Uno por 3–5 alumnos | Consigna compartida, roles rotativos | Compañeros con criterios y moderación docente |
| Toda la clase | Sólo proyector | Todos realizan la misma ronda | Docente o muestra de observación |
| Liga presencial | Sólo proyector | Equipos actúan a la vez | Docente registra resultados en el ordenador común |
| Sala online, futura | Docente + un dispositivo por equipo | Misma fase y reloj; decisiones propias | Servidor controla fase, permisos y resultados |

No todas las modalidades son adecuadas para todos los juegos. En mímica hace falta al menos una pareja o un observador; una experiencia individual puede entrenar gestos, pero no simular comunicación real con un equipo.

## Seis juegos con reglas concretas

### 1. Misión Refugio — aventura cooperativa

**Objetivo:** encender seis señales completando retos de distintas familias. 12–20 minutos; individual, equipo o clase; sin material.

Cada ronda: leer 20 s → elegir variante 10 s → actuar 30–60 s → observar 20 s → avanzar. Cada señal propone un reto y una alternativa sentada. Si cuesta, se adapta y se prueba otra vez. Un hito se enciende al completar el intento y reconocer un criterio, no por superar a otro niño. Al sexto hito se abre un reto creativo final.

Ejemplo: «Reproduce una secuencia de cuatro gestos y cambia uno para que tu pareja la copie». Criterio: mantener el orden y explicar el cambio. En individual, recordar y reproducir dos veces con una pausa. Progreso personal como recorrido, sin comparaciones de capacidades.

**Prototipo:** seis hitos, selección individual/clase, temporizador, cambio de reto, variante sentada y cierre. La complejidad narrativa ampliada queda para después del pilotaje.

### 2. Pulso Lab — crear, ensayar y compartir baile

**Objetivo:** construir una frase de 4 × 8 tiempos con movimientos accesibles. 15–25 minutos; equipos o práctica individual; base rítmica opcional.

Cada equipo recibe o elige cuatro cartas: marcha o alternancia de manos, apertura, cruce y pose. Puede cambiar una carta para expresar una emoción. Roles: creador de secuencia, guía de pulso, observador y portavoz; todos bailan durante el ensayo y los roles cambian entre rondas. Un compañero puede interpretar el patrón con brazos o amplitud reducida.

Fases de una ronda: 90 s de creación, 60 s de ensayo simultáneo, 20–30 s de muestra por equipo, 20 s de valoración por muestra. Mientras se muestra un equipo, los demás observan. Si el docente quiere mantener más actividad, muestra por parejas de equipos con observadores asignados.

**Propuesta de competición online:** rúbrica docente de 0–2 en pulso, secuencia y cooperación, normalizada a 80 puntos; voto de pares de 0–2 en claridad y creatividad, normalizado a 20. Puntuación = `80 × sumaDocente/6 + 20 × mediaPares/4`. La media se calcula sobre sumas válidas por votante. Sin votos válidos, sólo se normaliza la parte docente a 100 y se indica. Empates comparten puesto. No se vota al propio equipo ni se muestran resultados parciales; cada equipo dispone de una papeleta por muestra. Los votos no son calificaciones académicas.

La app no detecta calidad del baile. Un botón pulsado a tiempo sólo mediría una interacción, no coordinación corporal. Just Dance puede inspirar el seguimiento visual, pero aquí se añade creación, roles y feedback. No se distribuyen sus canciones ni coreografías.

**Prototipo:** generador/editor de cuatro cartas, metrónomo sintetizado opcional a 80–120 BPM, guía visual de ocho pulsos y temporizadores de fase. Sin votación remota ni puntuación de baile todavía.

### 3. Liga Relámpago — equipos simultáneos

**Objetivo:** resolver seis rondas breves de coordinación, expresión y cooperación. 10–18 minutos; 2–6 equipos, idealmente 3–5 alumnos cada uno; un proyector basta.

Todos reciben el mismo reto en cada ronda. Ensayan simultáneamente. El docente observa o pide muestras breves y asigna a cada equipo tres criterios de 0–2: control, ajuste a la consigna y cooperación. Cada ronda vale hasta 6 puntos. Roles rotan. No hay bonificación por terminar antes. En la modalidad online futura, cada equipo envía su decisión y solicita validación; no envía directamente sus puntos.

Ejemplo: inventar una secuencia de tres gestos que otra pareja del equipo pueda copiar. Rúbrica: movimientos controlados, secuencia reconocible y turnos repartidos. Repetición adaptada si no se consigue; ninguna eliminación. Empates compartidos. Opción futura de meta de clase para rebajar la competición.

**Prototipo:** selección de equipos, seis rondas, mismo reto para todos, temporizador y registro manual de criterios una vez por equipo y ronda. Clasificación visible sólo al cerrar las seis rondas.

### 4. Código Cuerpo — memoria motriz

**Objetivo:** recordar, ejecutar y transformar patrones. 8–12 minutos; individual, pareja o equipos conectados.

La pantalla muestra 3–6 símbolos; después los oculta y se reproduce la secuencia. En parejas, uno observa el orden y ambos alternan ejecución. Nivel siguiente: invertir el orden o cambiar de lado. La variante sentada usa manos y hombros. Sin evaluación por cámara: el observador confirma el orden. En competición se puntúa la reproducción de una muestra, no quién aprieta primero. Se plantea una progresión de tres dificultades.

**Estado:** reglas diseñadas; algunos retos están en biblioteca, el motor de secuencias ocultas aún no.

### 5. Director Invisible — expresión y observación

**Objetivo:** interpretar señales corporales y coordinarse sin palabras. 8–15 minutos; grupos o clase.

El docente asigna discretamente un director. El grupo repite sus gestos y cambia con él; un detective intenta identificar quién guía. Todos permanecen en su zona. Se rota a los 45 s, acierte o no el detective. Variante: representar una acción o emoción a otra pareja sin imitar a compañeros concretos. La app reparte consignas y turnos, sin pedir grabaciones.

**Estado:** diseñado; biblioteca con retos de espejo y mímica. El reparto privado de roles requiere desarrollo.

### 6. Decisión en Juego — pensar y actuar

**Objetivo:** justificar decisiones de juego limpio, cuidado corporal y, más adelante, táctica de un deporte. 10–15 minutos; individual o equipos.

Viñeta original → dos opciones razonables y una pregunta → representación corporal de la decisión → explicación breve → feedback. Ejemplo: un compañero no puede realizar el movimiento elegido, ¿cómo conservamos el objetivo de la secuencia? El equipo demuestra su adaptación. Puntuación por justificar y representar, no por memorizar trivialidades deportivas. Los packs por deportes llegarían cuando se elija una unidad concreta.

**Estado:** concepto y ejemplos; sin motor propio en el prototipo.

## Contenidos y progresión

Las seis familias son etiquetas prácticas, no bloques curriculares oficiales. 5.º empieza con secuencias cortas y guía explícita; 6.º aumenta memoria, autonomía y capacidad para justificar adaptaciones. La dificultad también se regula por experiencia, sin asignarla sólo por curso.

Banco previsto tras el piloto: 60 retos revisados, con versión sentada, consigna proyectable, objetivo, criterio observable, duración, material, número mínimo de jugadores y condiciones de espacio. Primera entrega: 24 originales para probar variedad antes de multiplicar contenido.

## Qué hace potente la experiencia

Sesiones listas en pocos pasos; una identidad común sin obligar a una única mecánica; un modo completo con sólo proyector; creación de contenidos por los niños; competición limitada por reglas observables; recursos reutilizables para días sucesivos; cierre con una decisión o descubrimiento que el alumno pueda explicar.
