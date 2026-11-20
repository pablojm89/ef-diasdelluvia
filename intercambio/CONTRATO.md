# Contrato común: El Pabellón y multiplicopolis

Vigente desde el 20/11/2026. Lo comparten [ef-diasdelluvia](https://github.com/pablojm89/ef-diasdelluvia) (El Pabellón, Educación Física) y [multiplicopolis](https://github.com/pablojm89/multiplicopolis) (Multiplicópolis y Agencia La Lupa). Se escribe para leerlo en frío: quien cambie el registro, las notas, la hoja de cálculo o el encargo de arte en cualquiera de los dos repos lo lee antes y, si cambia algo de aquí, lo cambia aquí en el mismo trabajo.

Fuentes de verdad: servidor `backend/apps-script/aula.gs` (este repo); cliente de La Lupa `apps/la-lupa/nube.js` (multiplicopolis); cliente de El Pabellón `registro.js` y `notas.js` (este repo).

## 1. Para qué

Pablo usa **una sola hoja de Google por clase**, con **un solo Apps Script**, **una sola dirección** y **un código de aula**. Cada niño es **una sola fila** en «Alumnos», juegue a lo que juegue. Las notas de todos los juegos van a «Notas» con la misma escala. Notion no es destino: su API no admite llamadas desde el navegador sin exponer la clave secreta.

## 2. Identidad del alumnado

- Nunca un nombre ni texto libre que identifique. El repositorio es público; la correspondencia con los nombres sólo existe en la hoja de Pablo o en papel.
- **`studentId = normAlias(texto)`**: minúsculas, sin tildes, y todo lo que no sea letra o número pasa a guion (máx. 40). La misma función en `nube.js` (`normAlias`), `registro.js` (`normAlias`) y `aula.gs` (`normAlias_`). Si se cambia una, se cambian las tres.
- **Alias del paquete de clase (preferente).** El maestro reparte alias en el paquete de La Lupa. Con paquete en el dispositivo, El Pabellón ofrece esos alias en una lista para elegir (si el maestro lo activa en el despacho) y `studentId = normAlias(alias)`: el mismo niño es la misma fila en los dos juegos.
- **Código de lista (sin paquete).** En El Pabellón el alumno elige curso, grupo y número: `5B-12` → `studentId` `5b-12`. Es otra fila que la de su alias: Pablo las relaciona a mano en «Alumnos». El n.º de lista nunca viaja en La Lupa; en El Pabellón viaja dentro del código.
- `pantalla`: lo que se juega en la pantalla de clase sin jugador (p. ej. la ruleta). Sólo viaja como evidencia.

## 3. Código de aula

Lo inventa el maestro (`5B-2027`). El servidor lo normaliza (mayúsculas; letras, números, espacio, punto y guiones; máx. 30). El mismo en todos los dispositivos y juegos de esa clase. No es una contraseña. Nunca se escribe en un repositorio.

## 4. Protocolo v2

**POST** a la dirección `/exec`, `Content-Type: text/plain;charset=utf-8`, **sin** `no-cors` (hay que leer la respuesta), `redirect: "follow"`:

```json
{ "app": "lalupa" | "pabellon", "classCode": "…", "type": "batch",
  "items": [ { "id": "…", "type": "student" | "grade" | "progress", "payload": { … }, "at": "ISO" } ] }
```

- Respuesta, siempre JSON: `{ ok: true, recibidos, rechazados: [{ id, error }], version: 2 }` o `{ ok: false, error, reintentar? }` (`error: "ocupado"` → reintentar).
- **Sólo `ok: true` da por enviado.** Respuesta ilegible, error o sin red: no se borra nada y se reintenta a 1, 2, 4… minutos (máx. 10), al volver la red o con «Enviar ahora». Un `ok: true` con rechazados se da por enviado y se avisa en la zona del maestro.
- **Idempotente.** Repetir un lote no duplica: «Alumnos» por aula + `studentId`; «Notas» por `resultId` + criterio (si vuelve, se actualiza); «Progreso» por aula + `studentId` con fusión; «Registro EF» por aula + id de anotación.
- **Lote vacío = prueba de conexión.** «Probar conexión»: `GET ?app=…&classCode=…&type=ping` → `{ ok: true, version: 2, apps: ["lalupa", "pabellon"] }` y después un POST con `items: []`.
- **GET** `?app=…&classCode=…&type=progress&studentId=…` → `{ ok: true, progress: { snapshot, updatedAt } }` o `{ ok: false, error: "no encontrado" }`.

### Payload de cada tipo

`student` (los dos): `{ studentId, alias, curso }`. `alias` es lo que ve el maestro: el alias o el código `5B-12`. `curso`: `"1"`…`"6"`.

`grade` (los dos): `{ resultId, studentId, alias, curso, tipo, unidad, titulo, nivel, fecha, libreta, diagnostico, notas: [{ criterio, nota, calificacion, aciertos, intentos }] }`.
- `criterio` con la letra del curso: `5.1.a` (5.º) / `5.1.b` (6.º). Lengua en La Lupa; EF en El Pabellón (`1.3.a`). Se distinguen por la columna `app`.
- **Escala común** (`motor.js` de La Lupa, `notas.js` aquí): `nota = max(1, aciertos / intentos × 10)`, con un decimal; `calificacion`: IN < 5 ≤ SU < 6 ≤ BI < 7 ≤ NT < 9 ≤ SB. Séneca: la media redondeada a entero de 1 a 10.
- La Lupa: `tipo` = `caso` | `encargo` | `academia`. El Pabellón: `tipo` = `aventura` (de momento), `resultId` = `ef-<id de la anotación>`, `nivel`/`libreta` = `null`, `diagnostico` = `false`.

`progress`:
- La Lupa: `{ studentId, alias, curso, updatedAt, snapshot: { perfil, resultados, academia, registrosAca } }`; el servidor fusiona por id (`fusionarAcademia` igual en cliente y servidor).
- El Pabellón: `{ studentId, alias, curso, updatedAt, snapshot: { registro: [{ id, t, place, activity, event, data }] } }`, como mucho 100 anotaciones por elemento. Cada anotación es una fila de «Registro EF»; lo que no tiene forma válida se descarta y se avisa. El GET devuelve las 800 últimas de ese alumno.

### Límites

1 MB por POST; 60 elementos por lote (los clientes envían ≤ 40 y ≈ 300 KB); 30 criterios por nota; 900 KB de progreso por alumno de La Lupa; 100 anotaciones por elemento y 600 caracteres de `data` por anotación en El Pabellón; `id` de resultado y de anotación: `[A-Za-z0-9_-]{4,40}`; `place`, `activity`, `event`: `[A-Za-z0-9_-]{1,40}`.

## 5. La hoja

| Pestaña | Columnas | Quién |
|---|---|---|
| Alumnos | fecha, aula, studentId, alias, curso, app | los dos (una fila por niño; `app` = quién lo dio de alta) |
| Notas | fecha, aula, studentId, alias, curso, tipo, unidad, titulo, criterio, calificacion, resultId, nivel, nota, aciertos, intentos, libreta, diagnostico, app | los dos |
| Progreso | aula, studentId, alias, actualizado, datos… (JSON en trozos que empiezan por `~`) | La Lupa |
| Registro EF | fecha, aula, studentId, alias, curso, lugar, actividad, evento, datos (JSON), id | El Pabellón |

Columnas de texto en «texto sin formato»; lo que empieza por `=`, `+`, `-` o `@` lleva apóstrofo. Una pestaña con otra cabecera se aparta con «(formato antiguo …)»; una de `la-lupa.gs` se amplía con `app`. Pablo puede añadir columnas suyas a la derecha de «Alumnos».

## 6. Claves compartidas del navegador

Las dos webs se sirven desde el mismo origen (`https://pablojm89.github.io/multiplicopolis/…` y `…/ef-diasdelluvia/…`), así que **comparten `localStorage` e IndexedDB**. Prefijo común: `aula-`. Cada proyecto mantiene además las suyas (`lalupa-…`, `pabellon-…`, `<juego>-…`) y **no escribe nunca en las del otro**.

| Clave | Dónde | Formato | Escribe | Lee |
|---|---|---|---|---|
| `aula-nube` | localStorage | `{ v: 1, url, classCode, app, fecha }`; `app` = quién la guardó | quien configure la hoja en ese navegador | todos |
| `aula-clase` | IndexedDB, almacén `paquete`, clave `actual` | el paquete de clase de La Lupa tal cual: `{ tipo: "lalupa-clase", version: 1, clase, curso, alumnos: [{ alias, avatar }] }` | quien importe el paquete (La Lupa, cuando aplique `PARA-MULTIPLICOPOLIS.md`) | todos |

Mientras La Lupa no las use, El Pabellón lee también las suyas, **sin escribirlas**: la conexión en `lalupa-ajustes` → `nube: { url, aula }` (la ofrece en el despacho y, si Pablo acepta, la copia a `aula-nube`) y el paquete en la base IndexedDB `lalupa-clase` (almacén `paquete`, clave `actual`). Al abrir una base ajena hay que **no crearla** si no existe (abortar en `onupgradeneeded`), o el otro juego la encontraría sin su almacén.

Regla de lectura de la conexión: `aula-nube` si es válida; si no, la del propio juego. Al guardar una conexión nueva se escribe `aula-nube`. La dirección válida es `https://script.google.com/macros/s/<id>/exec` (en pruebas, `http://localhost` o `http://127.0.0.1`).

## 7. Privacidad

- Repos públicos: sin nombres, listas, notas, direcciones `/exec` reales ni códigos de aula reales; en pruebas, datos sintéticos. Los paquetes de clase (`*.lalupa-clase.json`) y cualquier exportación nunca se suben.
- Sale del dispositivo, sólo con la hoja configurada: `studentId`, alias o código de lista, curso, notas por criterio y la evidencia de cada juego. No salen: nombres, avatares del paquete, n.º de lista de La Lupa, PIN, partidas a medias.
- Hoja en la cuenta educativa del centro, con permiso de la dirección y consulta a la DPD; familias informadas. Ver `docs/investigacion/seneca-exportacion.md` (multiplicopolis) y `PRIVACY.md` (aquí).
- La clave o PIN del despacho/zona del maestro sólo aparta al alumnado de ese dispositivo.

## 8. Encargo de arte (ya común)

- Cada repo tiene su `ENCARGO.md` generado (El Pabellón: `arte/ENCARGO.md`; La Lupa: `apps/la-lupa/arte/ENCARGO.md`). No se edita a mano.
- La IA ilustradora entrega PNG con el nombre exacto en la carpeta `entrega/` junto a ese encargo (`arte/entrega/`, `apps/la-lupa/arte/entrega/`), en una rama suya **`gpt/<lote>`** (nunca `main` ni la rama de Claude), con un **`MANIFIESTO`** de SHA-256 (una línea por imagen: huella, dos espacios, nombre). Sólo toca `entrega/`.
- Claude integra con el script del repo (`scripts/integrar_arte.py` aquí; `apps/la-lupa/herramientas/integrar_arte.py` allí), que comprueba el manifiesto, convierte a WebP y coloca.
- Personajes y objetos con fondo transparente, sin halo. Avatares del alumnado: sólo por Pablo, fuera del repo.
