# Registro y notas

Cómo lo que hace el alumnado en El Pabellón llega a ser una evidencia y, cuando se ha decidido, una nota orientativa que el profe usa para evaluar Educación Física. Funciona igual que La Lupa (multiplicopolis): misma hoja, mismo Apps Script, mismo protocolo y misma escala. Lo común está en [`intercambio/CONTRATO.md`](../intercambio/CONTRATO.md); los pasos para crear la hoja, en [`backend/README.md`](../backend/README.md).

> **Estado (20/11/2026):** programado y probado en local contra hojas simuladas. **No se ha probado con Google.** No usar con alumnado real hasta hacer la comprobación de `backend/README.md` y decidir lo de abajo.

## Cómo funciona

1. **Quién juega.** Sin nombres ni texto libre. Dos formas, que decide el profe en el despacho:
   - *Con el paquete de clase de La Lupa en ese navegador:* el alumno elige su alias en una lista. Es el mismo alias que en La Lupa, así que es la misma fila en la hoja.
   - *Sin paquete:* curso, grupo y número de lista → código `5B-12`.
   En los dos casos elige además uno de los ocho personajes para jugar.
2. **Qué se anota.** Cada lugar llama a `record(lugar, actividad, evento, datos)` (desde `comun/lugar.js`). La anotación queda en el navegador con su id, fecha y alumno.
3. **Envío.** Si el despacho tiene la hoja conectada, las anotaciones se envían por lotes a la hoja de Google del profe. Sólo se dan por enviadas cuando la hoja lo confirma; si no, se reintenta sola (1, 2, 4… hasta 10 minutos) sin borrar nada, y repetir un envío no duplica filas.
4. **En la hoja.** «Alumnos» (una fila por niño), «Notas» (una fila por criterio de cada resultado, junto a las de La Lupa) y «Registro EF» (una fila legible por anotación). Para Séneca: tabla dinámica de «Notas» por alumno y criterio, filtrando `app = pabellon`.
5. **Otro ordenador.** En la taquilla, «Recuperar mi progreso» trae lo que la hoja tiene de ese jugador.

## El despacho

Sección **Hoja de notas**: dirección del Apps Script y código de aula (se guardan sólo en ese navegador, en la clave compartida `aula-nube`; nunca en el código), «Probar conexión», «Enviar ahora», «Volver a enviar todo», «Quitar la conexión», pendientes, último envío confirmado y avisos de envío no confirmado o rechazado. Si La Lupa ya está conectada en ese navegador, ofrece «Usar la misma conexión». Debajo, si hay paquete de clase, la casilla para entrar con alias.

La tabla del registro de ese ordenador muestra la nota orientativa de cada jugador cuando la hay.

## De anotación a nota

**El único sitio donde se decide es la tabla `NOTAS` de [`notas.js`](../notas.js).** Cada línea dice qué anotación (lugar, actividad, evento) da nota, para qué criterio y cursos, y cómo se cuentan aciertos e intentos. Lo que no está en la tabla viaja como evidencia, sin nota. La escala es la de La Lupa: nota = aciertos / intentos sobre 10 (mínimo 1, un decimal) y IN/SU/BI/NT/SB.

Decidido hoy, con prudencia:

| Anotación | ¿Nota? | Cómo |
|---|---|---|
| Equipment Rescue completada (`material`, `equipment-rescue`, `completada`) | **Sí, orientativa**, criterio **1.3** (`1.3.a` en 5.º, `1.3.b` en 6.º): reconocer riesgos y usar el material con seguridad | aciertos = las 24 acciones mínimas para terminar; intentos = acciones hechas. Ej.: 25 intentos → 9,6 SB |
| Fases sueltas de la aventura, intentos y pistas | No | Evidencia en «Registro EF» |
| Partidos de mate: asistencias, rescates, puntos, resultado | No | Evidencia. Destreza en un videojuego, no conducta motriz |
| Ruleta de retos en la pantalla | No | Evidencia de la clase (`pantalla`), nada individual |
| Yoga, rosco, oca, bingo (`tatami`, `pizarra`, `aula`) | No, hasta que se añadan a `NOTAS` | Llegan como evidencia en cuanto anoten |
| El Botiquín: caso resuelto (`botiquin`, `pas`, `caso`) y ronda de tres (`botiquin`, `pas`, `ronda`) | **No, de momento.** Es el mismo criterio 1.3 que ya da nota con Equipment Rescue | Evidencia: el caso y los intentos (el mínimo son 3 por caso). La ronda trae aciertos e intentos, lista para ser nota si Pablo lo decide añadiendo una línea a `NOTAS` |
| El Botiquín: posición lateral practicada por los tres (`botiquin`, `lateral`, `practica`) y llamada ensayada (`botiquin`, `llamada`, `ronda`) | No | Evidencia de que se practicó |
| La Sala de Espejos (`espejos`): eco de ritmo completo (`ritmo`, `eco`), estatuas (`estatuas`, `partida`), ronda de mímica (`mimica`, `ronda`), coreografía creada y bailada (`coreografia`, `creada` y `bailada`) | No | Evidencia de la clase. La coreografía creada y bailada es la candidata natural al criterio 4.3 cuando Pablo lo decida |
| Vuelta a la calma hecha hasta el final (`tatami`, `yoga`, `calma`) | No | Evidencia de que se hizo, con el tipo (`ola` o `tensar`) y los segundos |
| Curiosidad descubierta en el pasillo (`pasillo`, `curiosidades`, `descubre`) | No | Evidencia de interés, con el `id` y el tema. En la pantalla digital se anota como clase. El álbum se guarda aparte, en `pabellon-curiosidades`, y no viaja |
| Cursos de 1.º a 4.º | No | La letra `.a/.b` sólo está definida para el tercer ciclo |

Completar un juego no equivale a superar un criterio: la nota del juego es una evidencia más, junto a lo observado en clase. Lo observado se puede apuntar en la misma hoja, en columnas propias.

### Para añadir una nota (otros lugares)

Añadir una línea a `NOTAS` en `notas.js`: `{place, activity, event, criterio, cursos, tipo, titulo, medir: data => ({aciertos, intentos})}`, con `aciertos ≤ intentos` enteros. Añadir su prueba en `tests/registro-nube.test.js` y una fila en la tabla de arriba con lo que Pablo haya decidido.

## Lo que decide Pablo

1. **Identidad.** ¿Usar los alias del paquete de La Lupa también en EF (recomendado: cada niño una fila) o el código de curso, grupo y número (y relacionarlos a mano en la hoja)? El paquete sólo existe en los navegadores donde se importó en La Lupa.
2. **Equipment Rescue como evidencia del criterio 1.3.** ¿Cuenta para la nota o sólo como información? ¿Con qué peso frente a la observación?
3. **Qué cuenta de las actividades nuevas** (yoga, rosco, oca, bingo) antes de abrirlas: criterio, cursos y qué es acierto.
4. **Cuenta de Google**: la del centro, con permiso de la dirección y consulta a la DPD; familias informadas.
5. **Recuperar progreso** con sólo el código o el alias: aceptable para EF (sólo hay juego, no notas), o pedir un código por alumno como el propuesto en La Lupa.

## Privacidad

- En el repositorio y en la web no hay nombres, listas, notas, direcciones de Apps Script ni códigos de aula reales. La comprobación previa a publicar sigue activa.
- Curso, grupo y número, o el alias, siguen siendo datos personales para quien tiene la lista. Viajan sólo a la hoja del profe cuando él la conecta.
- No viajan: avatares del paquete, PIN del despacho, nada de La Lupa.
- Un ordenador compartido conserva el último jugador hasta «No soy yo» en la taquilla.
- La clave del despacho es una barrera para el alumnado en ese ordenador, no una protección de datos.
