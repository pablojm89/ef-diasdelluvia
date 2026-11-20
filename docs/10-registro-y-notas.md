# Registro y notas

Cómo lo que hace el alumnado en El Pabellón llega a ser una evidencia que el profe puede usar para evaluar, sin que el repositorio público ni la web guarden datos de menores.

## Qué hay hoy

- **Jugador sin nombre.** El alumno elige curso, grupo, número de lista y personaje. Su código es, por ejemplo, `5B-12`. No hay campo de texto libre, así que no puede escribir su nombre.
- **Registro en el navegador.** Cada actividad anota una línea con fecha, código, lugar, actividad, evento y datos. Ejemplos: fase superada de la aventura con intentos y pistas; partido de mate con resultado, puntos, dianas, atrapadas, esquivas, asistencias y rescates; reto de ruleta completado por la clase.
- **Despacho.** Muestra un resumen por jugador de lo anotado en ese ordenador y permite descargarlo como hoja de cálculo o borrarlo.
- **Límite.** El registro está repartido: cada ordenador tiene el suyo. Si un alumno cambia de ordenador, su taquilla empieza vacía en el nuevo.

## Dónde reunirlo: hoja de Google en la cuenta del profe

Propuesta: una hoja de cálculo en Google Drive con un pequeño programa de Apps Script que recibe las anotaciones. Es la opción que encaja con una web estática:

| Opción | Encaja | Motivo |
|---|---|---|
| **Hoja de Google + Apps Script** | Sí | El programa vive en la cuenta del profe y recibe datos sin que la web lleve ninguna clave. La hoja es a la vez base de datos y cuaderno de notas |
| Notion | No directamente | Su API exige una clave secreta y no admite llamadas desde el navegador. Haría falta un servicio intermedio que mantener |
| Base de datos externa | Sí, con más trabajo | Añade un proveedor, cuentas y una revisión de protección de datos; innecesario para empezar |

Si el centro dispone de cuentas de Google para el profesorado, conviene usar esa cuenta y no una personal: son datos de alumnado, aunque vayan sin nombre.

### Cómo funcionará

1. El profe crea la hoja y pega el programa de abajo en Extensiones → Apps Script. Lo publica como aplicación web con acceso para cualquiera y copia su dirección.
2. Esa dirección se escribe en `config.js`. A partir de ahí cada anotación se envía al momento; si no hay conexión se queda pendiente y se reintenta al seguir jugando. El despacho indica cuántas faltan por enviar.
3. La pestaña `Registro` recibe una fila por anotación. Una pestaña `Alumnado`, que sólo existe en la hoja, relaciona cada código con su nombre. Una pestaña `Notas` calcula con fórmulas los indicadores por alumno.

La dirección del programa queda visible en el código de la web. Quien la conozca podría enviar filas falsas; el programa sólo acepta anotaciones con la forma correcta y descarta las repetidas. Si hiciera falta más control, el siguiente paso es un código de sesión que el profe abre desde el despacho y sin el cual no se acepta nada.

### Programa propuesto para la hoja

Escrito pero **sin probar todavía contra Google**: hay que comprobarlo al crear la hoja.

```js
const CAMPOS = ['id', 't', 'who', 'place', 'activity', 'event'];

function doPost(e) {
  const hoja = SpreadsheetApp.getActive().getSheetByName('Registro') || SpreadsheetApp.getActive().insertSheet('Registro');
  if (hoja.getLastRow() === 0) hoja.appendRow(['id', 'fecha', 'jugador', 'lugar', 'actividad', 'evento', 'datos']);
  let lote;
  try { lote = JSON.parse(e.postData.contents); } catch (error) { return responder({ok: false}); }
  if (!lote || lote.v !== 1 || !Array.isArray(lote.entries) || lote.entries.length > 100) return responder({ok: false});
  const vistos = new Set(hoja.getRange(1, 1, Math.max(1, hoja.getLastRow()), 1).getValues().flat());
  const filas = lote.entries.filter(valida).filter(x => !vistos.has(x.id))
    .map(x => [x.id, x.t, x.who || 'pantalla', x.place, x.activity, x.event, JSON.stringify(x.data)]);
  if (filas.length) hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, 7).setValues(filas);
  return responder({ok: true, nuevas: filas.length});
}

function valida(x) {
  return x && CAMPOS.every(c => c === 'who' ? (x.who === null || /^[1-6][A-D]-\d{2}$/.test(x.who)) : typeof x[c] === 'string' && x[c].length < 60)
    && x.data && typeof x.data === 'object' && JSON.stringify(x.data).length < 600;
}

function responder(cuerpo) {
  return ContentService.createTextOutput(JSON.stringify(cuerpo)).setMimeType(ContentService.MimeType.JSON);
}
```

## De anotación a nota

El juego aporta evidencias; la nota la pone el profe. Antes de construir la pestaña `Notas` hay que decidir, criterio por criterio, qué cuenta. Punto de partida para discutir:

| Evidencia anotada | Qué puede indicar | Qué no demuestra |
|---|---|---|
| Fases de la aventura, intentos y pistas | Comprensión de consignas en inglés y reconocimiento de riesgos con el material | Que actúe con seguridad en el gimnasio real |
| Partidos de mate: asistencias y rescates | Juego de equipo dentro del videojuego | Su conducta en un partido real |
| Partidos de mate: puntos y victorias | Destreza con el juego | Nada evaluable en EF; mejor no puntuarlo |
| Posturas y secuencias de yoga creadas | Conocimiento de posturas y composición | La ejecución, que se observa en clase |
| Retos de ruleta completados por la clase | Participación del grupo | Nada individual |

Lo observado en clase se podrá apuntar desde el despacho en la misma hoja, para que juego y observación queden juntos.

## Privacidad

- En el repositorio y en la web no hay ni habrá nombres, listados ni notas. La comprobación automática previa a cada publicación sigue activa.
- Curso, grupo y número de lista permiten al profe saber quién es cada alumno, así que siguen siendo datos personales aunque no lleven nombre. Sólo se guardan en el navegador del ordenador usado y, cuando se conecte, en la hoja del profe.
- Un ordenador compartido conserva el último jugador hasta que alguien pulsa «No soy yo» en la taquilla. Conviene enseñarlo como rutina de clase.
- La clave del despacho es una barrera para el alumnado en ese ordenador, no una protección de datos.
