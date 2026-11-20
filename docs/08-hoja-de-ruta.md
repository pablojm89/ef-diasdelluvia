# Hoja de ruta: de tres prototipos a un hub de EF para días de lluvia

20 de noviembre de 2026. Sustituye como guía de trabajo a [05-plan.md](05-plan.md), que queda como registro de la primera entrega. La investigación que la sustenta está en [09-investigacion-dias-de-lluvia.md](09-investigacion-dias-de-lluvia.md) y las imágenes pendientes de pintar, en [arte/peticiones-imagenes.md](arte/peticiones-imagenes.md).

## Dónde estamos

Hay tres productos que no se conocen entre sí:

| Pieza | Qué es | Estado | Lo que cojea |
|---|---|---|---|
| **El Gimnasio** (`/gimnasio/`) | Aventura gráfica bilingüe; una misión de cinco fases en gimnasio y almacén | Jugable de principio a fin | Una sola misión; en móvil los paneles pisan la escena; el pedido se hace en un panel de texto; sin sonido |
| **Mate Arena** (`/mate/`) | Balón prisionero arcade, entrenamiento y salas online de hasta 26 | Jugable; online probado por la entrega anterior | Pista dibujada por código, sin arte propio; sin tutorial; la IA tiene un único nivel |
| **Patio Interior** (`/patio.html`) | Tres experiencias de aula con movimiento real y 24 retos | Jugable con proyector | Otra estética y otro nombre; es lo único que hace moverse a la clase y está escondido tras dos enlaces |

Problemas de conjunto:

- **No hay portada.** `index.html` redirige al gimnasio. Quien llega no ve que existen tres cosas ni para qué sirve cada una.
- **Tres identidades.** Tres nombres, tres paletas y tres tipografías. El gimnasio es ilustración pintada, Mate es pixel art y Patio es interfaz plana.
- **Poco movimiento real.** El gimnasio y Mate son de pantalla. Un «día de lluvia» de EF necesita que la clase se mueva; hoy sólo lo consigue Patio Interior.
- **El hub casi no tiene contenido.** Comparado con lo que usan los docentes (tableros, ruletas, bingos, breakouts), faltan los formatos de «tengo cinco minutos» y «tengo la hora entera».

## Hecho en esta entrega

**Mate Arena**

- Pantalla de juego a ventana completa; entra en pantalla completa real al empezar si el navegador lo permite.
- Barra de habilidades tipo MOBA: un círculo con la imagen de cada habilidad, su tecla debajo, barrido de recarga con cuenta atrás, y estados de lista, activa, no disponible y bloqueada. El talento pasivo del personaje tiene su propio círculo.
- 19 iconos propios: 6 acciones y los 13 talentos (`mate/assets/abilities/`).
- En tableta y móvil: palanca flotante a la izquierda y círculos en abanico alrededor de «Lanzar» a la derecha, sin teclas. Arrastrar «Lanzar» apunta; soltar lanza.
- Sistema de puntos dentro de la simulación, de modo que se sincroniza en online: diana 100, atrapada 75, rescate 50, asistencia 40, esquiva 25 y 50 a cada jugador del equipo que gana la ronda. Los puntos saltan sobre la pista, se acumulan junto al retrato y hay tabla de todos los jugadores con MVP al acabar o manteniendo Tab.

**El Gimnasio**

- El material guardado ya no flota sobre el fondo: cada objeto revela su parte de una imagen del cuarto ordenado (balones tras la rejilla del carro, cestas, ganchos, colchoneta apilada). Al completar el orden, el fondo pasa a la imagen ordenada entera.
- El objeto vuela a su sitio al guardarlo.
- El pedido se recoge tocando cada material en su sitio, con contador sobre la escena.
- La colchoneta de riesgo está sobre la estantería en lugar de flotar en la pared.
- `scripts/build-store-states.py` regenera el cuarto ordenado y sus partes; con `--from-tidy` las recorta de una imagen repintada.

**Documentación**

- Investigación de 23 recursos reales de EF para lluvia y qué rehacer de ellos.
- Peticiones de imágenes listas para generar, con nombre de archivo, tamaño y punto de integración.

## Plan

El orden busca que cada fase deje algo usable en clase.

### Fase 1 · Una sola casa (corta)

1. **Portada del hub.** Sustituir la redirección por una portada: el colegio en día de lluvia, con una puerta por actividad y dos accesos rápidos, «Tengo 5 minutos» y «Tengo la clase entera». Indicar en cada puerta si se juega con proyector, con tablets o ambos, y si hay movimiento real.
2. **Un nombre y una identidad.** Decidir el nombre del hub (ver decisiones abiertas). Unificar tipografía, botones, cabecera y la forma de volver a la portada. La ilustración pintada del gimnasio es la identidad del hub; el pixel art queda como estilo propio de Mate Arena, igual que una recreativa dentro del colegio.
3. **Patio Interior dentro del colegio.** Reubicar Misión Refugio, Pulso Lab y Liga Relámpago como salas del mismo edificio y repintar su interfaz con la identidad común. Su banco de 24 retos pasa a ser el banco compartido de todo el hub.

### Fase 2 · Pulir lo que hay

**El Gimnasio**

- Disposición táctil y de pantalla pequeña: diálogo plegable, botones de tamaño de dedo, paneles que no tapen la escena.
- Carro del pedido como objeto de la escena que se va llenando (imagen pedida).
- Riesgos de la fase 4 como parte de la imagen, sin botones rojos encima.
- Sonido ambiente de lluvia y efectos al guardar; voz del profe ya disponible con la síntesis del navegador.
- Segunda misión: **la pizarra de reglas**, que enseña las reglas del mate y desemboca en una partida de Mate Arena con esas mismas reglas.

**Mate Arena**

- Pista pintada en pixel art en lugar de la dibujada por código (imagen pedida), con gradas animadas.
- Tutorial jugable de un minuto: moverse, lanzar, atrapar, esquivar.
- Tres niveles de IA y elección de nivel en entrenamiento.
- Modo proyector: una pantalla sólo de espectador con marcador grande para la clase.
- Efectos de sonido propios y música corta de menú.
- Insignias de fin de partido que premien el juego de equipo (más asistencias, más rescates), además del MVP por puntos.

### Fase 3 · Actividades nuevas con movimiento real

Rehechas desde cero a partir de los formatos que los docentes ya usan, corrigiendo sus carencias: esperas largas, movimiento ausente o reducido a repeticiones, sin inglés, una sola pantalla.

| Orden | Actividad | En qué mejora lo que existe | Dispositivos | Tamaño |
|---|---|---|---|---|
| 1 | **Ruleta de retos** con filtros (de pie, sentado, parejas, calma) y temporizador | Banco curado sin repeticiones máximas ni carreras entre mesas; variante sentada siempre | Proyector | Pequeño |
| 2 | **This or That activo**: se elige con el cuerpo y siguen 20–30 s de movimiento | Cero espera; frase modelo en inglés; sin vídeo externo | Proyector | Pequeño |
| 3 | **Tablero cooperativo**: todos los equipos ejecutan cada casilla a la vez | Sin turnos perdidos, pozos ni retrocesos; dado y cronómetro integrados | Proyector | Medio |
| 4 | **Bingo de movimiento** por equipos | Cartones únicos generados en el navegador; cantadas ES/EN; líneas cooperativas | Proyector + tablets | Medio |
| 5 | **Campaña de lluvia por capítulos**: cada día de lluvia se supera un capítulo con retos de pupitre y un código | Progreso entre sesiones guardado; sin material voluminoso; el docente valida cada reto | Proyector | Grande |
| 6 | **Rosco motor**: se responde con el cuerpo y cada acierto abre un microrreto | Quita el sedentarismo al formato más abundante; definiciones en inglés con apoyo visual | Proyector | Medio |
| 7 | **Tabata de pupitre** con estaciones en el sitio | Versión sentada equivalente; pictogramas propios | Proyector | Pequeño |

La ruleta y This or That salen primero porque reutilizan el banco de retos ya escrito y dan al docente algo que usar en cinco minutos. La campaña es la que da personalidad al hub, pero necesita el banco ampliado y la portada.

### Criterios para todo lo nuevo

- **Movimiento real en poco espacio.** Cada actividad nueva tiene a toda la clase moviéndose a la vez la mayor parte del tiempo.
- **Variante sentada o adaptada en cada reto**, visible, no escondida en ajustes.
- **Bilingüe con función.** El inglés hace falta para jugar: la consigna, la frase modelo, la cantada.
- **Sin cuentas ni datos de alumnos.** Progreso sólo en el navegador. Ver [PRIVACY.md](../PRIVACY.md).
- **Proyector primero.** Legible desde el fondo del aula; las tablets suman, no son requisito.
- **Arte propio.** Sin personajes ni música de terceros.

## Decisiones abiertas

| Decisión | Propuesta | Por qué importa |
|---|---|---|
| Nombre del hub | Elegir uno entre «El Gimnasio», «Patio Interior» u otro nuevo | Hoy conviven tres nombres; la portada necesita uno |
| Estilo de los iconos de Mate | Pixel art, como retratos y jugadores | Los iconos actuales son vectoriales y funcionan, pero el pixel art los integraría mejor |
| Puntos en Mate | Mantenerlos como parte del juego arcade, fuera de cualquier evaluación | El dossier del hub pedía no usar clasificaciones como medida de aprendizaje |
| Pantalla completa automática | Activa al empezar la partida | En ordenadores de aula puede sorprender; se desactiva con una línea |
| Cuarto ordenado definitivo | Repintarlo con el modelo de imagen a partir de la composición actual | La composición actual es correcta pero es un montaje de los objetos sueltos |
