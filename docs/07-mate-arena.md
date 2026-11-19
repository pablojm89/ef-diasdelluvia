# Mate Arena · balón prisionero arcade

Un videojuego independiente dentro de Patio Interior, accesible desde la isla de la arena y en `/mate/`. El alumnado controla personajes con teclado y ratón; no es una actividad de movimiento físico ni una medición de sus capacidades deportivas.

## Qué incluye

- Ocho personajes originales dibujados por código: Vega, Kai, Lúa, Neo, Ada, Max, Nora y Leo. Peinados, siluetas, colores y poses diferentes; las habilidades son iguales para mantener el equilibrio.
- Pista con dos campos, dos zonas de cárcel y una pelota. Movimiento, apuntado, lanzamiento, pase, recepción temporal y esquiva rápida.
- Entrenamiento contra IA y salas online por código. Hasta seis plazas por equipo; las vacantes se completan con IA.
- Sala de espera, elección de personaje y equipo, confirmación de listos, reglas configurables y comienzo controlado por el anfitrión.
- Marcador, reloj, rondas, resultado del partido y vuelta a la sala para repetir.
- Pausa del anfitrión, control de posesión de cinco segundos, recuperación de pelota inaccesible, ayudas de apuntado, efectos de sonido opcionales y controles táctiles.
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
| Pausar o reanudar | P; sólo anfitrión en online |

Hay controles táctiles. La pista está pensada principalmente para portátil o pantalla en horizontal. El botón de pantalla completa depende de las capacidades y políticas del navegador. El audio se activa expresamente.

## Arquitectura implementada

`sim.js` contiene la simulación a 60 pasos por segundo, sin navegador ni red. El anfitrión es la autoridad sobre movimientos, posesión, colisiones, cárcel, rescates, tiempo y resultado. Los invitados envían direcciones y acciones; no envían coordenadas finales, impactos ni puntuaciones. Se validan los tipos, rangos y la secuencia de las entradas. Las entradas antiguas caducan para impedir que una tecla quede atascada al desconectar.

`renderer.js` dibuja la pista, sprites, pelota, marcador y efectos en Canvas. `characters.js` genera sprites y retratos propios. Los clientes interpolan posiciones recibidas; no deciden colisiones.

`network.js` gestiona códigos, miembros, preparación, comienzo, pausa, reconexión y cambios de partida. Las instantáneas llevan un identificador de partido para no confundir paquetes antiguos con una revancha. La entrada se vincula a la conexión aceptada. Las credenciales de recuperación no se incluyen en la lista pública de miembros.

Se intenta conectar mediante **PeerJS 1.5.5 / WebRTC DataChannel**, con la biblioteca servida desde el propio repo. Si no se logra la conexión directa, el juego usa **MQTT sobre WebSocket seguro** a través de `relay.js`. El anfitrión abre ambas vías para que los participantes puedan usar la que funcione en su red. No se utiliza BroadcastChannel ni almacenamiento local para simular multijugador.

En el relevo se publica una sola instantánea compartida por sala para evitar multiplicar los envíos del anfitrión por cada invitado. Los mensajes de entrada y respuestas de incorporación se separan por conexión. No se retienen partidas en el broker. Se reintenta el saludo de incorporación hasta recibir confirmación.

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

- `npm test`: reglas, impactos sin bote, recepción, recargas, esquiva, rescate desde la cárcel, variantes, pases, límites de campo, pausa, caducidad de controles y posesión, final de partido, IA, validación de paquetes y trama MQTT.
- `npm run test:mate`: recorrido real de entrenamiento y partida online con navegadores aislados, sin simular sockets; requiere Playwright, Chromium e internet. Genera capturas y un informe en `artifacts/`.
- `MATE_CLIENTS=12 MATE_FULL_MATCH=0 npm run test:mate`: incorporación y controles de una sala llena. El recorrido normal comprueba además el final de partido y la vuelta al vestuario.
- Pruebas visuales de menú y juego en 320, 390, 768 y 1366 px, sin desbordamiento horizontal.

El navegador gestionado del entorno impide candidatos WebRTC directos por una política administrativa. Se mantuvo esa política: la prueba online se realiza mediante el relevo WSS real. La vía directa necesita comprobarse adicionalmente en los navegadores y la red del centro.

La aplicación es estática y se publica en GitHub Pages junto con el resto del proyecto. El workflow copia también `mate/` y su biblioteca local. El estado de publicación en Pages es independiente de que la partida funcione en el servidor estático de pruebas.
