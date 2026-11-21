# Intercambio con multiplicopolis

El Pabellón y los juegos de [multiplicopolis](https://github.com/pablojm89/multiplicopolis) (Multiplicópolis y Agencia La Lupa) son del mismo maestro y deben funcionar igual en lo que le toca a él: cómo se identifica el alumnado, a dónde van las notas y cómo se encarga el arte.

Esta carpeta es el lugar donde se escribe lo que los dos repositorios comparten. Cada sesión de trabajo de cualquiera de los dos la lee antes de tocar registro, notas, hojas de cálculo o encargos.

- [`CONTRATO.md`](CONTRATO.md): lo acordado y vigente en los dos lados: identidad, código de aula, protocolo v2, pestañas de la hoja, claves `aula-` del navegador, límites, privacidad y encargo de arte.
- [`PARA-MULTIPLICOPOLIS.md`](PARA-MULTIPLICOPOLIS.md): cambios que este repositorio pide al otro. Quien trabaje allí los aplica y los tacha aquí.

En ejecución, el intercambio es el propio navegador: las dos webs comparten origen en GitHub Pages y, por tanto, `localStorage` e IndexedDB (claves con prefijo `aula-`). El servidor común es `backend/apps-script/aula.gs`.
