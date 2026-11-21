# Mate Arena · balón prisionero arcade

Un videojuego independiente dentro de Patio Interior, accesible desde la isla de la arena y en `/mate/`. El alumnado controla personajes con teclado y ratón; no es una actividad de movimiento físico ni una medición de sus capacidades deportivas.

## Qué incluye

- Trece protagonistas de pixel art. Los ocho alumnos del gimnasio comparten pista con Iris, Bruno, Sol, Teo e Inés. Todos juegan igual en lo básico y cada uno guarda una **definitiva** distinta, con su propia animación.
- Pista con dos campos, dos zonas de cárcel y una pelota. Movimiento, apuntado, lanzamiento, pase, recepción temporal y esquiva rápida.
- Entrenamiento contra IA y salas online por código. Hasta trece plazas por equipo. La IA cubre las vacantes con personajes disponibles.
- Sala de espera, elección de personaje y equipo, confirmación de listos, reglas configurables y comienzo controlado por el anfitrión.
- Marcador, reloj, rondas, puntos por jugada, tabla final de jugadores y vuelta a la sala para repetir.
- Partida a pantalla completa con barra de habilidades en círculos.
- Pausa del anfitrión, control de posesión de cinco segundos, recuperación de pelota inaccesible, ayudas de apuntado, efectos de sonido opcionales y controles táctiles con palanca.
- Recuperación de una plaza tras recargar o desconectarse. La IA cubre al jugador mientras vuelve. La pestaña del anfitrión debe permanecer abierta; no hay migración del anfitrión.

## Reglas de esta versión

1. Cada jugador permanece en su campo. Los presos se mueven en una franja detrás del campo rival.
2. Un impacto de una pelota rival en vuelo envía a la cárcel. Una pelota que toca suelo o pared deja de eliminar hasta que alguien vuelva a lanzarla.
3. Atrapar en la ventana de recepción evita el impacto y da posesión. No basta con mantener una tecla pulsada: hay una ventana breve y un tiempo de recarga.
4. Un preso que alcanza a un jugador de campo rival vuelve a su campo; el rival va a la cárcel.
5. No hay fuego amigo. Los pases a compañeros no eliminan.
6. Gana la ronda el equipo que deja al rival sin jugadores de campo. Por tiempo, gana el que conserve más; si están empatados no se suma victoria.
7. Por defecto se juega al mejor de tres victorias parciales: gana el primero que consigue dos rondas. También se puede elegir una sola victoria. Un máximo de dos rondas adicionales evita partidos indefinidos por empates; después se compara el marcador o se comparte empate.
8. El anfitrión puede activar dos variantes: atrapar elimina al lanzador; atrapar rescata a un preso del equipo. Por defecto ambas están desactivadas.

No hay una regla escolar única para todas las regiones. Estas son las reglas implementadas y visibles en la aplicación; el motor permite modificarlas cuando el docente concrete sus variantes.

## Elección de personaje

Cada equipo puede alinear una vez a cada personaje. Por ejemplo, Cometas y Rayos pueden tener una Lúa cada uno. El vestuario muestra quién está ocupado en tu equipo. Si dos personas piden el mismo personaje a la vez, el anfitrión confirma la primera elección que recibe. La ficha de cada protagonista explica su definitiva y lo que tarda en recargarse antes del partido.

## Definitivas

Cada personaje tiene una sola habilidad definitiva, distinta de las demás. Se lanza con **F** o con el círculo dorado. Empieza el partido a media carga y se recarga con el tiempo de juego: la cuenta atrás y la pausa detienen el reloj, y la carga se conserva de una ronda a la siguiente. Al lanzarla, la pista tiembla un instante y un cartel con el retrato anuncia quién la ha usado. Los efectos se apagan al empezar otra ronda.

| Personaje | Definitiva | Qué hace | Recarga |
| --- | --- | --- | --- |
| Vega | ¡A por ellos! | Todo su equipo corre un 45 % más rápido durante 6 s, recupera al instante atrapar y esquivar y los recarga el triple de rápido. Mientras dura, ni la Mirada ni el Pies quietos le afectan | 45 s |
| Kai | Superimán | La pelota vuela a sus manos esté donde esté: suelta, en el aire o en las manos de un rival | 35 s |
| Lúa | ¡Pies quietos! | Todos los demás, rivales y compañeros, se quedan de estatua 3 s: no se mueven, no atrapan, no esquivan y no lanzan | 55 s |
| Neo | Centella | Durante 5 s corre el doble, la pelota le atraviesa sin tocarle y sus tiros salen un 35 % más rápidos | 40 s |
| Ada | Teledirigida | Un tiro lento que persigue a su objetivo hasta 3,5 s. **No se puede esquivar: sólo atraparlo** | 45 s |
| Max | Burbujas | Cada compañero del campo recibe una burbuja que para un impacto. Duran 8 s | 50 s |
| Nora | Cometa imparable | Un tiro muy rápido en llamas. **No se puede atrapar: sólo esquivarlo** | 40 s |
| Leo | Espejismo | Tres copias suyas corren por su campo durante 7 s. El rival las ve iguales que a él, y la pelota que da a una copia se pierde | 40 s |
| Iris | La Red | Una red en la línea central durante 5 s: ninguna pelota del rival la cruza, ni siquiera el cometa | 50 s |
| Bruno | Gigante | Crece durante 6 s: nada le manda a la cárcel, atrapa todo lo que le toca y lanza balonazos enormes | 50 s |
| Sol | Bumerán | Un tiro que atraviesa a los rivales, da la vuelta y regresa a su mano. Puede dar a uno a la ida y a otro a la vuelta | 40 s |
| Teo | Mirada intensa | Todos los rivales se mueven a la mitad de velocidad y pierden la esquiva durante 10 s, incluidas las esquivas ya iniciadas | 60 s |
| Inés | ¡Fuga! | Todos los presos de su equipo, ella incluida, vuelven al campo | 60 s |

Detalles que deciden los cruces:

- Las tres que son un tiro (Teledirigida, Cometa y Bumerán) necesitan la pelota en la mano. El Superimán necesita no tenerla, y la Fuga, que haya algún compañero preso. Si no se puede usar, la carga se conserva.
- La Mirada no se gasta si todos los rivales ya están frenados.
- Contra el Cometa, el Gigante no lo atrapa pero tampoco cae: la pelota rebota. Una burbuja también lo para.
- La Teledirigida ignora la esquiva, pero no la Centella, la burbuja ni al Gigante.
- La Red no detiene los tiros de los presos rivales, que lanzan desde detrás del campo.
- Las copias de Leo engañan también a la ayuda de apuntado y a la máquina. Sus compañeros y La Grada las ven translúcidas y con la etiqueta «copia».
- La máquina usa la definitiva de su personaje cuando le conviene.

Los números y las condiciones están en `mate/roster.js` y `mate/sim.js` (`CAST`, `EFFECT`); los dibujos, en `mate/ultfx.js`. Para una clase de 26, el anfitrión selecciona **13 contra 13** antes de que entren todos.

## Pantalla de juego

La pista ocupa toda la ventana y al empezar se solicita la pantalla completa del navegador. Sobre ella flotan el retrato con los puntos, los botones de sonido, pausa, pantalla completa y salida, y la barra de habilidades.

- **Con teclado:** cinco círculos en la parte inferior: pasar, atrapar, esquivar, lanzar y, más grande y con borde dorado, la definitiva del personaje. Cada uno lleva su tecla escrita debajo. Un barrido oscuro y una cuenta atrás indican la recarga, y el círculo dorado late cuando la definitiva está lista. El círculo se apaga si la acción no está disponible, por ejemplo lanzar sin pelota. Un anillo naranja alrededor de «Lanzar» muestra los cinco segundos de posesión.
- **Con los dedos:** una palanca aparece bajo el pulgar en la mitad izquierda y los círculos se abren en abanico alrededor de «Lanzar» a la derecha, con el nombre en lugar de la tecla y la definitiva arriba. Tocar «Lanzar» apunta al rival más cercano; arrastrarlo apunta en esa dirección y al soltar se lanza. El juego cambia de un modo a otro según se use teclado o pantalla táctil.
- Los iconos están en `mate/assets/abilities/` y la lista de acciones, en `mate/abilities.js`.

## Puntos

Los puntos se calculan en la simulación del anfitrión y viajan en cada instantánea, así que todos ven lo mismo.

| Jugada | Puntos |
| --- | --- |
| Diana: tu tiro envía a un rival a la cárcel | 100 |
| Atrapada al vuelo | 75 |
| Rescate: volver de la cárcel o liberar a un compañero | 50 |
| Asistencia: tu pase acaba en diana de un compañero | 40 |
| Esquiva de un tiro que te habría dado | 25 |
| Ronda ganada, para cada jugador del equipo | 50 |

Cada jugada muestra los puntos sobre la pista. El total propio está junto al retrato. La tabla de todos los jugadores, con el más valioso señalado, aparece al terminar el partido y también manteniendo Tab o tocando los puntos. Los puntos pertenecen al juego: no se guardan ni se usan como evaluación.

## Cómo jugar online

1. Abrir `/mate/`, elegir personaje y pulsar **Crear sala online**.
2. El anfitrión comparte el código o la invitación. Participa como un jugador de Cometas y puede cambiarse de equipo antes de empezar.
3. Cada compañero abre el enlace, elige personaje, pulsa **Entrar**, elige equipo y marca **Estoy listo**.
4. El anfitrión selecciona tamaño, duración y variantes, y pulsa **¡A la pista!** cuando todos están listos.
5. Si alguien recarga, vuelve a entrar con el código en la misma pestaña para recuperar su plaza. Las credenciales de recuperación son temporales y se conservan en `sessionStorage`.
6. Las nuevas incorporaciones se admiten en la sala de espera. Una partida empezada sólo permite recuperar plazas existentes.

Para una clase mayor que la capacidad de una sala se pueden abrir varias salas independientes. La respuesta del juego depende del ordenador anfitrión y de la latencia de la red; conviene probar la wifi del centro antes de una sesión.

## Controles

| Acción | Teclado o ratón |
| --- | --- |
| Mover | WASD o flechas |
| Apuntar | Ratón; sin ratón se utiliza ayuda automática |
| Lanzar | Espacio o clic principal |
| Atrapar al vuelo | E o clic derecho |
| Esquiva rápida | Shift más dirección |
| Pasar al compañero más cercano | Q |
| Cambiar objetivo automático | R |
| Definitiva del personaje | F |
| Pausar o reanudar | P; sólo anfitrión en online |

Hay controles táctiles. La pista está pensada principalmente para portátil o pantalla en horizontal. El botón de pantalla completa depende de las capacidades y políticas del navegador. El audio se activa expresamente.

## Arquitectura implementada

`sim.js` contiene la simulación a 60 pasos por segundo, sin navegador ni red. El anfitrión es la autoridad sobre movimientos, posesión, colisiones, cárcel, rescates, tiempo y resultado. Los invitados envían direcciones y acciones; no envían coordenadas finales, impactos ni puntuaciones. Se validan los tipos, rangos y la secuencia de las entradas. Las entradas antiguas caducan para impedir que una tecla quede atascada al desconectar.

`renderer.js` dibuja la pista, sprites, pelota, marcador y efectos en Canvas; `ultfx.js` pone lo propio de cada definitiva. `characters.js` carga los retratos y selecciona el fotograma de cada jugador en las hojas de animación de Cometas y Rayos. Los clientes interpolan posiciones recibidas; no deciden colisiones.

`network.js` gestiona códigos, miembros, preparación, comienzo, pausa, reconexión y cambios de partida. Las instantáneas llevan un identificador de partido para no confundir paquetes antiguos con una revancha. La entrada se vincula a la conexión aceptada. Las credenciales de recuperación no se incluyen en la lista pública de miembros.

Se intenta conectar mediante **PeerJS 1.5.5 / WebRTC DataChannel**, con la biblioteca servida desde el propio repo. Si no se logra la conexión directa, el juego usa **MQTT sobre WebSocket seguro** a través de `relay.js`. El anfitrión abre ambas vías para que los participantes puedan usar la que funcione en su red. No se utiliza BroadcastChannel ni almacenamiento local para simular multijugador.

En el relevo se publica una sola instantánea compartida por sala para evitar multiplicar los envíos del anfitrión por cada invitado. Los mensajes de entrada y respuestas de incorporación se separan por conexión. No se retienen partidas en el broker. Se reintenta el saludo de incorporación hasta recibir confirmación.

## Espectadores: La Grada

`grada/` muestra en la pantalla de clase los partidos que se están jugando, hasta cuatro salas a la vez en mosaico. Se entra con el código de la sala o con un enlace `grada/#sala=ABC234` (varias salas: `#sala=ABC234,K7M2PQ`). En la sala de espera, el anfitrión tiene el botón **Ver en la pantalla**, que copia ese enlace. La grada usa `ArenaRenderer` para la pista y `resultsMarkup` para la tabla final; el marcador, la ronda y el reloj van en grande en una placa crema junto al partido.

Un espectador:

- No ocupa plaza ni aparece en los equipos ni en el vestuario. No cuenta para «todos listos».
- No envía controles. El anfitrión descarta todo lo que llegue de un espectador salvo el saludo y el ping: entradas, «listo», equipo y personaje.
- Recibe lo mismo que un invitado: el estado de la sala, el comienzo y las instantáneas. En el relevo MQTT sigue la instantánea única por sala, así que no multiplica los envíos del anfitrión.
- Puede entrar con la partida empezada, y después de que termine ve la vuelta al vestuario y la revancha.
- Se reconecta solo: si se corta la conexión, la sala se cierra o deja de llegar el partido durante 7 s sin pausa, la grada lo dice y reintenta a los 2, 4, 8 y luego cada 15 s. Guarda su identificador de espectador en `sessionStorage` para que el anfitrión sustituya la conexión antigua en vez de contarla dos veces.
- Hay un máximo de `maxSpectators` (6) por sala, en `mate/config.js`, aparte de las 26 plazas de jugador: una sala llena de jugadores sigue admitiendo espectadores.

### Protocolo

La versión del protocolo es la 4. La 3 añadió al espectador: así, un anfitrión antiguo rechaza a un espectador con el aviso de versiones distintas en lugar de sentarlo como jugador; el flujo de los jugadores, incluida la recuperación de plaza, no cambió. La 4 llega con las definitivas, que cambian los controles que se envían y el estado que se recibe: dos navegadores con versiones distintas reciben el aviso de recargar.

| Mensaje | Dirección | Contenido |
| --- | --- | --- |
| `hello` | espectador → anfitrión | `{type:'hello', v:4, clientId, role:'spectator'}`. Sin perfil ni credencial de recuperación |
| `welcome` | anfitrión → espectador | `{type:'welcome', v:4, id:'s-…', hostId, code, role:'spectator', started, matchId, rules}`. Va seguido de un `lobby` y, si se está jugando, de un `start` con `reconnecting:true` |
| `lobby` | anfitrión → todos | Añade `spectators`: cuántas pantallas miran. Es un número; no identifica a nadie |
| `ping` / `pong` | ambos | Igual que un invitado: mide la latencia y recupera el `lobby` perdido |
| `ended`, `rejected` | anfitrión → espectador | Igual que un invitado. Rechazos propios: versión distinta y «Ya hay demasiadas pantallas mirando esta sala» |

Los espectadores no añaden datos personales: no hay nombre, curso ni perfil, sólo un identificador aleatorio de conexión. En el cliente, `Room.watch(code)` hace de espectador con los mismos transportes que `Room.join`; `grada/sala.js` lleva los estados (buscando, vestuario, en juego, pausa, terminado, conexión perdida) y los reintentos.

## Servicios y configuración

Por defecto se utilizan el servicio público de señalización de PeerJS y el broker público de EMQX, `wss://broker.emqx.io:8084/mqtt`. Permiten probar sin crear cuentas, pero son servicios externos compartidos para experimentación, sin garantía de disponibilidad ni privacidad de canales. La aplicación transmite posiciones, acciones y nombres de personajes prefijados; no ofrece nombres reales ni chat. No se deben añadir datos personales al protocolo de un broker público.

Para utilizarlo de manera habitual en un centro, sustituir el servicio de relevo por un broker WSS propio o gestionado en `mate/config.js`, con acceso y permisos adecuados. El código admite la configuración de PeerServer/ICE y la del broker. No incluir credenciales administrativas o de larga duración en archivos públicos; las credenciales de cliente, si se usan, deben tener permisos limitados a las salas y una duración apropiada. Este juego no incorpora una plataforma de cuentas docentes ni un servidor antitrampas para usuarios no confiables.

La simulación sigue estando en el navegador anfitrión, incluso al usar relevo. Si el anfitrión cierra, termina la sala. Una pestaña anfitriona oculta pausa el juego; se reanuda de forma explícita. No se cobran servicios ni se ha creado infraestructura de pago.

Referencias técnicas: [PeerJS: funcionamiento y señalización](https://peerjs.com/client/getting-started), [limitaciones de NAT y TURN](https://peerjs.com/client/faq), [servicio público EMQX y límites de uso](https://www.emqx.com/en/mqtt/public-mqtt5-broker). PeerJS se redistribuye con su licencia MIT en `mate/vendor/PEERJS-LICENSE`.

## Resultados comprobados

El 19 de noviembre de 2026 se completaron las siguientes comprobaciones:

- 26 pruebas automáticas de reglas y validación del proyecto, incluyendo las específicas de mate y los juegos existentes.
- Sala real con **doce contextos de navegador independientes**: incorporación, preparación, movimiento remoto validado en el anfitrión, pausa, rechazo de pausa del invitado, recarga y recuperación de la misma plaza, y lanzamiento compartido.
- **Partido online completo con cuatro clientes**: resultado idéntico y regreso de todos al vestuario para repetir.
- Conexión mediante el broker WSS externo real; no se sustituyó por sockets simulados, pestañas comunicadas por BroadcastChannel ni un servidor falso.
- Recorridos de los juegos anteriores y capturas de Mate en móvil, tablet y portátil, sin desbordamiento horizontal.

Los contextos de prueba se ejecutan en el mismo entorno de cómputo; esto verifica el protocolo y la integración de red, pero no sustituye una prueba con ordenadores físicos distribuidos por la wifi del centro.

## Verificación y ejecución

- `npm test`: reglas, impactos sin bote, recepción, recargas, esquiva, las trece definitivas y su uso por la máquina, rescate desde la cárcel, variantes, pases, límites de campo, pausa, caducidad de controles y posesión, final de partido, IA, validación de paquetes y trama MQTT.
- `npm run test:mate`: recorrido real de entrenamiento y partida online con navegadores aislados, sin simular sockets; requiere Playwright, Chromium e internet. Genera capturas y un informe en `artifacts/`.
- `MATE_CLIENTS=12 MATE_FULL_MATCH=0 npm run test:mate`: incorporación y controles de una sala llena. El recorrido normal comprueba además el final de partido y la vuelta al vestuario.
- Pruebas visuales de menú y juego en 320, 390, 768 y 1366 px, sin desbordamiento horizontal.

El navegador gestionado del entorno impide candidatos WebRTC directos por una política administrativa. Se mantuvo esa política: la prueba online se realiza mediante el relevo WSS real. La vía directa necesita comprobarse adicionalmente en los navegadores y la red del centro.

La aplicación es estática y se publica en GitHub Pages junto con el resto del proyecto. El workflow copia también `mate/` y su biblioteca local. El estado de publicación en Pages es independiente de que la partida funcione en el servidor estático de pruebas.

## Intento de publicación en GitHub Pages

La entrega de código `3fbb6b0` se subió a `main` y se ejecutó el workflow [44559142510](https://github.com/pablojm89/ef-diasdelluvia/actions/runs/44559142510). Las 26 pruebas pasaron también en GitHub Actions. El despliegue se detuvo en `actions/configure-pages@v5`: GitHub respondió `Not Found` al consultar el sitio Pages y pidió comprobar que estuviera habilitado con origen GitHub Actions.

La conexión disponible devuelve acceso denegado a la API administrativa de Pages y no puede habilitarlo. Por tanto **no se afirma que exista una web publicada**. El siguiente paso en la cuenta propietaria es abrir **Settings → Pages**, elegir **GitHub Actions** como origen y volver a ejecutar **Publicar Patio Interior y Mate Arena**. Al ser un repositorio privado hace falta un plan compatible con Pages privado; no se ha cambiado su visibilidad ni contratado ningún plan.
