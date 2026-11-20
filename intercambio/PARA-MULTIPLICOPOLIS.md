# Cambios que pide El Pabellón a multiplicopolis

Para quien trabaje en multiplicopolis (Agencia La Lupa). Antes, lee [`CONTRATO.md`](CONTRATO.md). Al hacer cada punto, táchalo aquí (`~~…~~` y la fecha) en este repo, o pídeselo a Pablo. Ninguno rompe lo que ya funciona.

1. **Servidor único.** Sustituir `backend/apps-script/la-lupa.gs` por una copia de `backend/apps-script/aula.gs` de este repo (o enlazarlo). Para `app: "lalupa"` responde y escribe lo mismo; sólo añade la columna `app` al final de «Alumnos» y «Notas» (una hoja existente se amplía sola). Comprobado en Node comparando los dos sobre hojas simuladas (`tests/aula-gs.test.js`, con `MULTIPLICOPOLIS=<clon>`). Actualizar `backend/README.md` y `apps/la-lupa/NUBE.md` (paso 2: pegar `aula.gs`).
2. **«Probar conexión» de La Lupa** (`nubeProbar` en `apps/la-lupa/nube.js`): el `ping` ahora devuelve también `apps: ["lalupa", "pabellon"]`. No hace falta cambiar nada; opcional, avisar si `apps` no incluye `lalupa`.
3. **Leer y escribir `aula-nube`** (`nubeConf` en `nube.js` y `activarNubeMaestro`): leer primero `localStorage["aula-nube"]` (`{ v: 1, url, classCode }`) y, si no es válida, `ajustes.nube`. Al guardar en la zona del maestro, escribir también `aula-nube` con `{ v: 1, url, classCode: aula, app: "lalupa", fecha }`. Así Pablo configura la hoja una vez por navegador. Ojo: el formato usa `classCode`, no `aula`.
4. **Paquete de clase compartido** (`apps/la-lupa/clase.js`): al importar, guardar también en la base IndexedDB `aula-clase` (versión 1, almacén `paquete`, clave `actual`, mismo formato). Al cargar, leer `aula-clase` si `lalupa-clase` está vacía. Al quitarlo, quitar los dos. El Pabellón ya lee los dos (primero `aula-clase`).
5. **Mismo alias, misma fila.** No cambiar `normAlias`; si alguna vez cambia, cambiarlo a la vez en `registro.js` y `aula.gs` de este repo.
6. **Enlazar el contrato** desde `CLAUDE.md` de multiplicopolis (tabla «Mapa», fila `backend/`) y desde `apps/la-lupa/NUBE.md`: «Contrato común con El Pabellón: ef-diasdelluvia/intercambio/CONTRATO.md».
7. **Zona del maestro**: con el punto 3 hecho, mostrar «Esta conexión la comparte El Pabellón» cuando `aula-nube.app` sea `pabellon`. Opcional.

Hecho: nada todavía (20/11/2026).
