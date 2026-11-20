# Hoja de notas del aula: Apps Script + Hojas de Google

`apps-script/aula.gs` es **un único servidor para una única hoja** que reciben a la vez Agencia La Lupa (`app: "lalupa"`) y El Pabellón (`app: "pabellon"`). El protocolo, las pestañas y lo que comparten los dos proyectos están en [`intercambio/CONTRATO.md`](../intercambio/CONTRATO.md).

> **Estado (20/11/2026): NO se ha probado con Google.** Está probado en Node: el `aula.gs` de verdad se ejecuta sobre unas hojas simuladas que imitan las conversiones de Hojas de Google (números, fechas, fórmulas, apóstrofo), y El Pabellón se ha recorrido en Chromium contra ese servidor. Falta la comprobación con un Apps Script real de más abajo. Hasta entonces, no se usa con alumnado real.

## Por qué un solo `aula.gs` y no un `pabellon.gs` aparte

Pablo quiere una sola hoja y un solo procedimiento. Con dos Apps Script habría dos hojas, dos direcciones y dos códigos de aula por clase, y el mismo niño estaría en dos sitios. `aula.gs` es `la-lupa.gs` con una tabla `APPS` que dice qué hace cada juego con su progreso:

- **Para La Lupa no cambia nada observable.** Las mismas respuestas y las mismas filas: una prueba (`tests/aula-gs.test.js`) envía los mismos lotes a `la-lupa.gs` y a `aula.gs` y compara respuestas y pestañas. La única diferencia es una columna `app` al final de «Alumnos» y «Notas». Una hoja que ya tenga las pestañas de `la-lupa.gs` se amplía en su sitio con esa columna; no se aparta ni se borra nada.
- **El Pabellón** comparte «Alumnos» (una fila por aula y alumno, venga de donde venga) y «Notas» (una fila por resultado y criterio). Su progreso no va a «Progreso» (copia de seguridad de La Lupa, en trozos de JSON), sino a una pestaña legible, **«Registro EF»**: una fila por anotación.
- `la-lupa.gs` sigue en multiplicopolis hasta que allí se cambie por `aula.gs` (ver `intercambio/PARA-MULTIPLICOPOLIS.md`). Se pega uno u otro, nunca los dos en la misma hoja.

## Ponerlo en marcha (unos 10 minutos)

1. Crea una hoja de cálculo nueva en Google Drive, mejor en la cuenta educativa del centro que en una personal (ver `PRIVACY.md`). Por ejemplo, «Notas 5.º B».
2. **Extensiones → Apps Script.** Borra lo que haya, pega el contenido de `backend/apps-script/aula.gs` y guarda.
3. **Implementar → Nueva implementación → Aplicación web.** Ejecutar como: *yo*. Quién tiene acceso: *cualquier usuario* (los ordenadores del aula envían sin iniciar sesión).
4. Autoriza los permisos y copia la dirección de la aplicación web, la que acaba en `/exec`. **No la escribas en ningún repositorio.**
5. En El Pabellón: **Soy profe → Despacho → Hoja de notas.** Pega la dirección, inventa un código de aula (por ejemplo `5B-2027`), Guardar y **Probar conexión**. Tiene que decir «Conexión correcta: la hoja confirma los envíos». Si La Lupa ya está conectada en ese navegador, el despacho ofrece «Usar la misma conexión».
6. Repítelo una vez en cada ordenador del aula (la conexión se guarda en el navegador).
7. Si cambias el código: **Implementar → Gestionar implementaciones → editar → Versión nueva**. Así la dirección no cambia.

Pestañas que crea solas: «Alumnos», «Notas», «Progreso» (La Lupa) y «Registro EF» (El Pabellón). Junto a «Alumnos» puedes añadir tus propias columnas a la derecha (nombre, n.º de lista de Séneca): la hoja nunca las toca. Para Séneca, una tabla dinámica de «Notas» por `studentId` y `criterio`, filtrada por `app`.

## Comprobar con un Apps Script de verdad (pendiente, obligatorio)

Con datos de prueba, nunca con los de la clase:

1. «Probar conexión» da ✔. Es la prueba de que el navegador puede leer la respuesta de un POST `text/plain` sin `no-cors`. Si dijera «Se puede leer, pero el envío no se confirma», la cola no se vaciaría nunca (no se pierde nada) y habría que confirmar de otra forma.
2. Entrar como alumno y terminar Equipment Rescue: 1 fila en «Alumnos», 1 en «Notas» (criterio `1.3.a` o `1.3.b`), 2 en «Registro EF». El despacho marca «Pendientes de enviar: 0».
3. «Volver a enviar todo» dos veces: ninguna fila nueva.
4. Un alias del paquete de clase que ya exista en La Lupa: no aparece una segunda fila en «Alumnos».
5. Una hoja que ya tenía las pestañas de `la-lupa.gs`: «Notas» y «Alumnos» ganan la columna `app` y conservan sus filas; La Lupa sigue enviando y recuperando.
6. «Recuperar mi progreso» desde otro navegador.
7. Unos 25 ordenadores a la vez: al rato, todos con 0 pendientes. En el editor, **Ejecuciones**: sin errores.

## Probarlo en local

- `npm test` ejecuta `tests/aula-gs.test.js` (el `.gs` sobre hojas simuladas, doble en `tests/doble-google.mjs`) y `tests/registro-nube.test.js` (cola y envío del navegador). Con `MULTIPLICOPOLIS=<ruta a un clon de multiplicopolis>` compara además con `la-lupa.gs`.
- `node tests/servidor-hoja.mjs 3107` levanta una hoja simulada en `http://127.0.0.1:3107/exec` (el despacho acepta `localhost` y `127.0.0.1` para probar). `GET /hojas` enseña las pestañas.
- `node tests/notas-browser.mjs`, con la web servida en `http://127.0.0.1:3106/`, recorre en Chromium el despacho, la entrada con alias, una misión, el envío, el reenvío, un fallo y la recuperación en otro navegador.

## Lo que falta decidir antes de usarlo con alumnado real

- **El código de aula no es una contraseña.** Con la dirección, cualquiera podría añadir filas basura. Igual que en La Lupa; la propuesta común es una lista de aulas válidas en las propiedades del script.
- **Recuperar progreso** sólo pide el código o el alias. En El Pabellón eso revela, como mucho, lo jugado (fases, partidos): poco sensible, pero conviene saberlo.
- Cuenta de Google del centro y aviso a las familias (ver `docs/10-registro-y-notas.md`).
