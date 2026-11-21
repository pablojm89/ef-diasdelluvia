/**
 * Notas del aula · servidor en Google Apps Script (Hojas de Google)
 *
 * UN solo Apps Script y UNA sola hoja para los juegos de Pablo que siguen el protocolo v2:
 *   - "lalupa":   Agencia La Lupa (multiplicopolis/apps/la-lupa/nube.js). Se comporta igual que la-lupa.gs.
 *   - "pabellon": El Pabellón de Educación Física (ef-diasdelluvia/registro.js).
 * Contrato común: ef-diasdelluvia/intercambio/CONTRATO.md. Pasos: ef-diasdelluvia/backend/README.md.
 *
 * Protocolo (versión 2):
 *   POST (text/plain, SIN no-cors: el cliente lee la respuesta)
 *        { app, classCode, type: "batch", items: [{ id, type, payload, at }] }
 *        tipos de item: student | grade | progress        (un lote sin items sirve de prueba de conexión)
 *        → { ok: true, recibidos, rechazados: [{ id, error }], version }   o   { ok: false, error, reintentar? }
 *   GET  ?app=…&classCode=…&type=progress&studentId=…  → { ok, progress: { snapshot, updatedAt } }
 *   GET  ?app=…&classCode=…&type=ping                  → { ok: true, version, apps }
 *
 * Repetir un envío NUNCA duplica (los clientes reintentan si no pueden confirmar que llegó):
 *   - Alumnos: una fila por aula + studentId, venga de la app que venga (el mismo alias es el mismo alumno).
 *   - Notas: una fila por resultId + criterio; si el resultado vuelve (p. ej. al sellarlo), se actualiza su fila.
 *   - Progreso (La Lupa): una fila por aula + studentId; lo que llega se FUSIONA con lo que había, nunca lo sustituye.
 *   - Registro EF (El Pabellón): una fila por aula + id de anotación.
 *
 * Hojas que crea solas: «Alumnos», «Notas», «Progreso» y «Registro EF». Solo alias o códigos de lista, nunca
 * nombres. Las columnas de texto van en «texto sin formato» para que Hojas no convierta «007» en 7, ni «5-11»
 * en una fecha, ni «=…» en una fórmula. Una hoja de la-lupa.gs se aprovecha: solo se le añade la columna «app».
 */

const VERSION = 2;
const HOJAS = {
  // texto: n.º de columnas (desde la primera) que van como texto sin formato; 0 = todas
  // antes: cabecera de la-lupa.gs; una hoja con ella se amplía en su sitio en vez de apartarse
  Alumnos: { cab: ["fecha", "aula", "studentId", "alias", "curso", "app"], texto: 0, antes: ["fecha", "aula", "studentId", "alias", "curso"] },
  Notas: { cab: ["fecha", "aula", "studentId", "alias", "curso", "tipo", "unidad", "titulo", "criterio", "calificacion", "resultId",
    "nivel", "nota", "aciertos", "intentos", "libreta", "diagnostico", "app"], texto: 11,
    antes: ["fecha", "aula", "studentId", "alias", "curso", "tipo", "unidad", "titulo", "criterio", "calificacion", "resultId",
      "nivel", "nota", "aciertos", "intentos", "libreta", "diagnostico"] },
  Progreso: { cab: ["aula", "studentId", "alias", "actualizado", "datos"], texto: 0 },
  "Registro EF": { cab: ["fecha", "aula", "studentId", "alias", "curso", "lugar", "actividad", "evento", "datos", "id"], texto: 0 },
};
const COL_NOTAS = { aula: 2, criterio: 9, resultId: 11 };
const LIMITES = {
  cuerpo: 1000000,    // caracteres del POST entero
  items: 60,          // elementos por lote
  notas: 30,          // criterios por resultado
  registros: 5000,    // resultados (o registros de la Academia) por alumno
  registro: 6000,     // caracteres de un resultado ya sin eventos
  progreso: 900000,   // caracteres del progreso de un alumno ya fusionado
  anotaciones: 100,   // anotaciones de El Pabellón por elemento
  datos: 600,         // caracteres de los datos de una anotación
  devueltas: 800,     // anotaciones que devuelve «recuperar mi progreso»
};
const TROZO = 45000;  // caracteres por celda (el límite de Hojas es 50.000)
const MARCA = "~";    // cada trozo de JSON empieza por esta marca: así nunca parece una fórmula, un número ni una fecha

/* Cada app dice qué hace con su progreso. Para añadir otra, se añade aquí y se documenta en el contrato. */
const APPS = {
  lalupa: { guardarProgreso: function (aula, progresos, rechazados) { guardarProgresos_(aula, progresos, rechazados); }, leerProgreso: leerProgresoLupa_, validarProgreso: function (p) { return esObjeto_(p.snapshot) ? p.snapshot : null; } },
  pabellon: { guardarProgreso: guardarRegistroEF_, leerProgreso: leerRegistroEF_, validarProgreso: validarRegistroEF_ },
};

/* ── Utilidades ─────────────────────────────────────────────── */
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function esObjeto_(v) { return !!v && typeof v === "object" && !Array.isArray(v); }
function lista_(v) { return Array.isArray(v) ? v : []; }
/* Texto para una celda: recortado y sin posibilidad de fórmula (el apóstrofo inicial obliga a Hojas a tratarlo como texto) */
function texto_(v, max) {
  let s = v == null ? "" : String(v).slice(0, max || 160);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}
function num_(v) { const n = Number(v); return v === null || v === "" || v === undefined || !isFinite(n) ? "" : n; }
function id_(v) { const s = v == null ? "" : String(v); return /^[\w-]{4,40}$/.test(s) ? s : ""; }
/* La MISMA normalización que normAlias en la-lupa/nube.js y en ef-diasdelluvia/registro.js */
function normAlias_(s) {
  return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40).replace(/^-+|-+$/g, "");
}
/* Código de aula: en mayúsculas, solo letras, números, espacio, punto y guiones, y empezando por letra o número */
function normAula_(s) {
  return String(s == null ? "" : s).trim().toUpperCase().replace(/[^\p{L}\p{N} ._-]/gu, "").replace(/^[^\p{L}\p{N}]+/u, "").slice(0, 30).trim();
}

/* ── Hojas ──────────────────────────────────────────────────── */
function hoja_(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const def = HOJAS[nombre];
  let h = ss.getSheetByName(nombre);
  if (h && h.getLastRow() >= 1) {
    const cab = h.getRange(1, 1, 1, def.cab.length).getValues()[0].map(String);
    if (cab.join("|") !== def.cab.join("|")) {
      const ampliable = def.antes && cab.slice(0, def.antes.length).join("|") === def.antes.join("|") && cab.slice(def.antes.length).every(function (c) { return c === ""; });
      // Una hoja de la-lupa.gs se amplía con las columnas nuevas; otra de formato distinto se aparta con otro nombre (no se borra nada)
      if (ampliable) h.getRange(1, def.antes.length + 1, 1, def.cab.length - def.antes.length).setValues([def.cab.slice(def.antes.length)]);
      else { h.setName(nombre + " (formato antiguo " + new Date().toISOString().slice(0, 19).replace(/:/g, ".") + ")"); h = null; }
    }
  }
  if (!h) h = ss.insertSheet(nombre);
  if (h.getLastRow() === 0) {
    h.getRange(1, 1, h.getMaxRows(), def.texto || h.getMaxColumns()).setNumberFormat("@");
    h.getRange(1, 1, 1, def.cab.length).setValues([def.cab]);
    h.setFrozenRows(1);
  }
  return h;
}
/* Escribe un bloque de filas de una vez (una sola escritura), ampliando la hoja si hace falta y fijando el formato de texto */
function escribir_(h, fila1, filas, colsTexto) {
  if (!filas.length) return;
  const ancho = filas.reduce(function (a, f) { return Math.max(a, f.length); }, 1);
  const bloque = filas.map(function (f) { return f.concat(new Array(ancho - f.length).fill("")); });
  const faltanFilas = fila1 + bloque.length - 1 - h.getMaxRows();
  if (faltanFilas > 0) h.insertRowsAfter(h.getMaxRows(), faltanFilas);
  const faltanCols = ancho - h.getMaxColumns();
  if (faltanCols > 0) h.insertColumnsAfter(h.getMaxColumns(), faltanCols);
  h.getRange(fila1, 1, bloque.length, Math.min(ancho, colsTexto || ancho)).setNumberFormat("@");
  h.getRange(fila1, 1, bloque.length, ancho).setValues(bloque);
}
/* Índice «aula|clave» → n.º de fila, leyendo solo las columnas de la clave */
function indice_(h, colAula, colId) {
  const n = h.getLastRow() - 1, idx = {};
  if (n < 1) return idx;
  const desde = Math.min(colAula, colId), ancho = Math.abs(colAula - colId) + 1;
  const v = h.getRange(2, desde, n, ancho).getValues();
  for (let r = 0; r < n; r++) {
    const k = String(v[r][colAula - desde]) + "|" + String(v[r][colId - desde]);
    if (!(k in idx)) idx[k] = r + 2;
  }
  return idx;
}

/* ── POST: un lote de elementos ─────────────────────────────── */
function doPost(e) {
  const lock = LockService.getScriptLock();
  let cogido = false;
  try {
    const crudo = (e && e.postData && e.postData.contents) || "";
    if (crudo.length > LIMITES.cuerpo) return json_({ ok: false, error: "envío demasiado grande" });
    let body = null;
    try { body = JSON.parse(crudo); } catch (x) { body = null; }
    if (!esObjeto_(body) || typeof body.app !== "string" || !APPS.hasOwnProperty(body.app)) return json_({ ok: false, error: "app" });
    const app = APPS[body.app];
    const aula = normAula_(body.classCode);
    if (!aula) return json_({ ok: false, error: "aula" });
    const items = lista_(body.items);
    if (items.length > LIMITES.items) return json_({ ok: false, error: "demasiados elementos" });
    if (!items.length) return json_({ ok: true, recibidos: 0, rechazados: [], version: VERSION });   // prueba de conexión

    cogido = lock.tryLock(25000);
    if (!cogido) return json_({ ok: false, error: "ocupado", reintentar: true });

    const rechazados = [], alumnos = [], notas = [], progresos = [];
    items.forEach(function (it) {
      const idItem = esObjeto_(it) ? String(it.id == null ? "" : it.id).slice(0, 80) : "";
      const p = esObjeto_(it) && esObjeto_(it.payload) ? it.payload : null;
      const studentId = p ? normAlias_(p.studentId) : "";
      if (!p || !studentId) { rechazados.push({ id: idItem, error: "elemento sin alias" }); return; }
      const base = { idItem: idItem, studentId: studentId, alias: texto_(p.alias, 40), curso: texto_(p.curso, 10), app: body.app };
      if (it.type === "student") alumnos.push(base);
      else if (it.type === "grade") {
        base.resultId = id_(p.resultId);
        if (!base.resultId) { rechazados.push({ id: idItem, error: "nota sin id de resultado" }); return; }
        base.p = p;
        notas.push(base);
      } else if (it.type === "progress") {
        const snapshot = app.validarProgreso(p);
        if (!snapshot) { rechazados.push({ id: idItem, error: "progreso vacío" }); return; }
        base.snapshot = snapshot;
        progresos.push(base);
      } else rechazados.push({ id: idItem, error: "tipo desconocido" });
    });

    if (alumnos.length) guardarAlumnos_(aula, alumnos);
    if (notas.length) guardarNotas_(aula, notas);
    if (progresos.length) app.guardarProgreso(aula, progresos, rechazados);
    SpreadsheetApp.flush();
    return json_({ ok: true, recibidos: items.length, rechazados: rechazados, version: VERSION });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err).slice(0, 200) });
  } finally {
    if (cogido) lock.releaseLock();
  }
}

/* Alumnos: se añaden solo los que no estaban (una escritura). Un alumno que ya llegó desde otra app no se repite */
function guardarAlumnos_(aula, alumnos) {
  const h = hoja_("Alumnos");
  const idx = indice_(h, 2, 3), nuevas = [], ahora = new Date().toISOString();
  alumnos.forEach(function (a) {
    const k = aula + "|" + a.studentId;
    if (k in idx) return;
    idx[k] = -1;
    nuevas.push([ahora, aula, a.studentId, a.alias, a.curso, a.app]);
  });
  escribir_(h, h.getLastRow() + 1, nuevas, HOJAS.Alumnos.texto);
}

/* Notas: una fila por resultado y criterio. Las nuevas se añaden de una vez; las de un resultado que ya estaba se actualizan */
function filasNota_(aula, g) {
  const p = g.p;
  const libreta = esObjeto_(p.libreta) ? num_(p.libreta.puntos) : num_(p.libreta);
  return lista_(p.notas).slice(0, LIMITES.notas).filter(esObjeto_).map(function (n) {
    return [texto_(p.fecha, 40), aula, g.studentId, g.alias, g.curso, texto_(p.tipo, 20), texto_(p.unidad, 60), texto_(p.titulo, 160),
      texto_(n.criterio, 20), texto_(n.calificacion, 4), g.resultId,
      num_(p.nivel), num_(n.nota), num_(n.aciertos), num_(n.intentos), libreta, p.diagnostico === true, g.app];
  });
}
function guardarNotas_(aula, notas) {
  const h = hoja_("Notas");
  const n = h.getLastRow() - 1;
  // Filas que ya tiene cada resultado: primero solo la columna de resultId; el resto, solo si alguno coincide
  const ids = n > 0 ? h.getRange(2, COL_NOTAS.resultId, n, 1).getValues() : [];
  const pedidos = {};
  notas.forEach(function (g) { pedidos[g.resultId] = true; });
  const existentes = {};   // resultId → { criterio: n.º de fila }
  for (let r = 0; r < ids.length; r++) {
    const id = String(ids[r][0]);
    if (!pedidos[id]) continue;
    const fila = h.getRange(r + 2, 1, 1, COL_NOTAS.resultId).getValues()[0];
    if (String(fila[COL_NOTAS.aula - 1]) !== aula) continue;
    (existentes[id] = existentes[id] || {})[String(fila[COL_NOTAS.criterio - 1])] = r + 2;
  }
  const nuevas = [], ultimo = {};
  notas.forEach(function (g) { ultimo[g.resultId] = g; });   // si un resultado viene dos veces en el lote, vale el último
  Object.keys(ultimo).forEach(function (id) {
    filasNota_(aula, ultimo[id]).forEach(function (fila) {
      const criterio = String(fila[COL_NOTAS.criterio - 1]).replace(/^'/, "");
      const donde = existentes[id] && existentes[id][criterio];
      if (donde) escribir_(h, donde, [fila], HOJAS.Notas.texto);
      else nuevas.push(fila);
    });
  });
  escribir_(h, h.getLastRow() + 1, nuevas, HOJAS.Notas.texto);
}

/* ── La Lupa · progreso: fusionar, nunca sustituir (igual que la-lupa.gs) ── */
function leerDatos_(fila) {
  const texto = fila.slice(4).map(function (c) { c = String(c); return c.charAt(0) === MARCA ? c.slice(1) : c; }).join("");
  if (!texto) return {};
  try { const o = JSON.parse(texto); return esObjeto_(o) ? o : {}; } catch (x) { return {}; }
}
function trozos_(texto) {
  const t = [];
  for (let i = 0; i < texto.length; i += TROZO) t.push(MARCA + texto.slice(i, i + TROZO));
  return t;
}
function guardarProgresos_(aula, progresos, rechazados) {
  const h = hoja_("Progreso");
  const idx = indice_(h, 1, 2);
  const porAlumno = {};   // varios elementos del mismo alumno en un lote se fusionan en memoria y se escriben una vez
  progresos.forEach(function (g) {
    const k = aula + "|" + g.studentId;
    let a = porAlumno[k];
    if (!a) {
      const fila = idx[k] ? h.getRange(idx[k], 1, 1, Math.max(5, h.getLastColumn())).getValues()[0] : null;
      a = porAlumno[k] = { fila: idx[k] || 0, ancho: fila ? fila.length : 0, studentId: g.studentId, alias: g.alias, datos: fila ? leerDatos_(fila) : {}, ids: [] };
    }
    a.alias = g.alias || a.alias;
    a.datos = fusionarInstantanea_(a.datos, g.snapshot);
    a.ids.push(g.idItem);
  });
  const nuevas = [], ahora = new Date().toISOString();
  Object.keys(porAlumno).forEach(function (k) {
    const a = porAlumno[k];
    const texto = JSON.stringify(a.datos);
    if (texto.length > LIMITES.progreso) { a.ids.forEach(function (id) { rechazados.push({ id: id, error: "progreso demasiado grande" }); }); return; }
    let fila = [aula, a.studentId, a.alias, ahora].concat(trozos_(texto));
    if (a.fila) {
      // Se rellena hasta el ancho anterior para que no queden trozos viejos; una sola escritura, sin borrar antes
      if (fila.length < a.ancho) fila = fila.concat(new Array(a.ancho - fila.length).fill(""));
      escribir_(h, a.fila, [fila], 0);
    } else nuevas.push(fila);
  });
  escribir_(h, h.getLastRow() + 1, nuevas, 0);
}
function leerProgresoLupa_(aula, id) {
  const h = hoja_("Progreso");
  const fila = indice_(h, 1, 2)[aula + "|" + id];
  if (!fila) return null;
  const v = h.getRange(fila, 1, 1, Math.max(5, h.getLastColumn())).getValues()[0];
  return { snapshot: leerDatos_(v), updatedAt: String(v[3]) };
}

/* Un resultado (o un registro de la Academia) tal como se guarda: objeto con id, sin eventos y de tamaño razonable */
function registros_(v) {
  return lista_(v).filter(function (x) {
    if (!esObjeto_(x) || !id_(x.id)) return false;
    delete x.eventos; delete x.notasLibreta;
    return JSON.stringify(x).length <= LIMITES.registro;
  });
}
function sellado_(x) { return esObjeto_(x.libreta); }
/* Unión por id. Si el mismo resultado está en los dos lados, se queda el que había y solo se copia el sello más reciente */
function fusionarPorId_(a, b) {
  const out = registros_(a), pos = {};
  out.forEach(function (x, i) { pos[x.id] = i; });
  registros_(b).forEach(function (x) {
    if (!(x.id in pos)) { pos[x.id] = out.length; out.push(x); return; }
    const mio = out[pos[x.id]];
    if (sellado_(x) && (!sellado_(mio) || String(x.libreta.fecha || "") > String(mio.libreta.fecha || ""))) mio.libreta = x.libreta;
  });
  return out.slice(-LIMITES.registros);
}
function perfil_(p) {
  if (!esObjeto_(p) || !id_(p.id)) return null;
  const out = { id: id_(p.id), nombre: String(p.nombre == null ? "" : p.nombre).slice(0, 40), curso: String(p.curso == null ? "" : p.curso).slice(0, 10) };
  if (typeof p.avatar === "string" && p.avatar) out.avatar = p.avatar.slice(0, 60);
  if (typeof p.creado === "string" && p.creado) out.creado = p.creado.slice(0, 40);
  return out;   // solo estos campos: nada de n.º de lista ni otros datos del perfil
}
function fusionarInstantanea_(a, b) {
  a = esObjeto_(a) ? a : {}; b = esObjeto_(b) ? b : {};
  const pa = perfil_(a.perfil), pb = perfil_(b.perfil);
  // El perfil conserva su primer id (los resultados van por id propio); alias, curso y avatar, los últimos que llegan
  const perfil = pa && pb ? Object.assign({}, pa, pb, { id: pa.id, creado: [pa.creado, pb.creado].filter(Boolean).sort()[0] }) : (pb || pa);
  const out = { resultados: fusionarPorId_(a.resultados, b.resultados), academia: fusionarAcademia_(a.academia, b.academia), registrosAca: fusionarPorId_(a.registrosAca, b.registrosAca) };
  if (perfil) { if (!perfil.creado) delete perfil.creado; out.perfil = perfil; }
  return out;
}

/* Estado de la Academia, campo a campo, sin perder puntos ni niveles. ES LA MISMA FUNCIÓN que fusionarAcademia en
   la-lupa/nube.js: si se cambia una, hay que cambiar la otra. Es idempotente: fusionar dos veces da lo mismo. */
function fusionarAcademia_(a, b) {
  a = esObjeto_(a) ? a : {}; b = esObjeto_(b) ? b : {};
  const n = function (v) { v = Number(v); return isFinite(v) ? v : 0; };
  const mapa = function (v) { return esObjeto_(v) ? v : {}; };
  const claves = function (x, y) { const o = {}; Object.keys(mapa(x)).concat(Object.keys(mapa(y))).forEach(function (k) { if (k !== "__proto__") o[k] = 1; }); return Object.keys(o); };
  const maxTexto = function (x, y) { x = typeof x === "string" ? x : ""; y = typeof y === "string" ? y : ""; return (x > y ? x : y) || null; };
  const nuevo = n(b.sesion) > n(a.sesion) ? b : a, viejo = nuevo === a ? b : a;
  const out = Object.assign({}, viejo, nuevo);
  out.sesion = Math.max(n(a.sesion), n(b.sesion));
  out.ultimoDia = maxTexto(a.ultimoDia, b.ultimoDia);
  // Puntos: por día, el mayor; el total nunca baja respecto a ninguno de los dos
  out.puntosDia = {};
  claves(a.puntosDia, b.puntosDia).forEach(function (d) { out.puntosDia[d] = Math.max(n(mapa(a.puntosDia)[d]), n(mapa(b.puntosDia)[d])); });
  out.puntos = Math.max(n(a.puntos), n(b.puntos), Object.keys(out.puntosDia).reduce(function (s, d) { return s + out.puntosDia[d]; }, 0));
  // Niveles (lupas) por ejercicio: el más alto; la racha, la del que va más alto
  out.niveles = {};
  claves(a.niveles, b.niveles).forEach(function (k) {
    const x = mapa(mapa(a.niveles)[k]), y = mapa(mapa(b.niveles)[k]);
    const mx = Math.max(n(x.max), 1), my = Math.max(n(y.max), 1);
    out.niveles[k] = { max: Math.max(mx, my), racha: mx === my ? Math.max(n(x.racha), n(y.racha)) : (mx > my ? n(x.racha) : n(y.racha)) };
  });
  // Cola de repaso: unión; si la palabra está en los dos, la ficha más avanzada (y el mayor n.º de fallos)
  const ca = mapa(a.cola), cb = mapa(b.cola), an = lista_(nuevo.archivadas), av = lista_(viejo.archivadas);
  out.cola = {};
  claves(ca, cb).forEach(function (w) {
    const x = esObjeto_(ca[w]) ? ca[w] : null, y = esObjeto_(cb[w]) ? cb[w] : null;
    if (x && y) {
      const mejor = n(y.nivel) > n(x.nivel) || (n(y.nivel) === n(x.nivel) && n(y.proximo) > n(x.proximo)) ? y : x;
      out.cola[w] = Object.assign({}, mejor, { fallos: Math.max(n(x.fallos), n(y.fallos)) });
    } else if (x || y) {
      // Está en la cola de uno y archivada (dominada) en el otro: manda el que lleva más sesiones; a igualdad, se repasa
      const esDelNuevo = (nuevo === a ? x : y) !== null;
      if (!esDelNuevo && an.indexOf(w) >= 0 && n(a.sesion) !== n(b.sesion)) return;
      out.cola[w] = Object.assign({}, x || y);
    }
  });
  out.archivadas = [];
  an.concat(av).forEach(function (w) { if (typeof w === "string" && !(w in out.cola) && out.archivadas.indexOf(w) < 0) out.archivadas.push(w); });
  // Turno de hoy: el del día más reciente; si es el mismo día, lo hecho en los dos
  const ta = mapa(a.turno), tb = mapa(b.turno), da = typeof ta.dia === "string" ? ta.dia : "", db = typeof tb.dia === "string" ? tb.dia : "";
  const hechas = function (t) { return lista_(t.hechas).filter(function (x) { return typeof x === "string"; }); };
  out.turno = da === db ? { dia: da || null, hechas: hechas(ta).concat(hechas(tb).filter(function (x) { return hechas(ta).indexOf(x) < 0; })) }
    : (da > db ? { dia: da, hechas: hechas(ta) } : { dia: db, hechas: hechas(tb) });
  // Lecciones vistas: la sesión más alta. Preparación de cada caso: los pasos hechos en cualquiera de los dos
  out.leccionVista = {};
  claves(a.leccionVista, b.leccionVista).forEach(function (k) { out.leccionVista[k] = Math.max(n(mapa(a.leccionVista)[k]), n(mapa(b.leccionVista)[k])); });
  out.prep = {};
  claves(a.prep, b.prep).forEach(function (u) {
    const pasos = lista_(mapa(a.prep)[u]).concat(lista_(mapa(b.prep)[u])).filter(function (x) { return typeof x === "string"; });
    out.prep[u] = pasos.filter(function (x, i) { return pasos.indexOf(x) === i; });
  });
  return out;
}

/* ── El Pabellón · registro: una fila legible por anotación ─────
   snapshot = { registro: [{ id, t, place, activity, event, data }] }. Lo que no tiene forma válida se descarta. */
function anotacion_(x) {
  if (!esObjeto_(x) || !id_(x.id) || typeof x.t !== "string" || x.t.length > 40 || isNaN(Date.parse(x.t)) || !esObjeto_(x.data)) return null;
  const palabra = function (v) { return typeof v === "string" && /^[\w-]{1,40}$/.test(v); };
  if (!palabra(x.place) || !palabra(x.activity) || !palabra(x.event)) return null;
  const datos = JSON.stringify(x.data);
  if (datos.length > LIMITES.datos) return null;
  return { id: x.id, t: x.t, place: x.place, activity: x.activity, event: x.event, datos: datos };
}
function validarRegistroEF_(p) {
  const lista = esObjeto_(p.snapshot) ? lista_(p.snapshot.registro) : [];
  if (!lista.length || lista.length > LIMITES.anotaciones) return null;
  const buenas = lista.map(anotacion_).filter(Boolean);
  return buenas.length ? { registro: buenas, descartadas: lista.length - buenas.length } : null;
}
function guardarRegistroEF_(aula, progresos, rechazados) {
  const h = hoja_("Registro EF");
  const idx = indice_(h, 2, 10), nuevas = [];
  progresos.forEach(function (g) {
    if (g.snapshot.descartadas) rechazados.push({ id: g.idItem, error: g.snapshot.descartadas + " anotaciones sin forma válida" });
    g.snapshot.registro.forEach(function (x) {
      const k = aula + "|" + x.id;
      if (k in idx) return;
      idx[k] = -1;
      nuevas.push([texto_(x.t, 40), aula, g.studentId, g.alias, g.curso, x.place, x.activity, x.event, texto_(x.datos, LIMITES.datos), x.id]);
    });
  });
  escribir_(h, h.getLastRow() + 1, nuevas, HOJAS["Registro EF"].texto);
}
function leerRegistroEF_(aula, id) {
  const h = hoja_("Registro EF");
  const n = h.getLastRow() - 1;
  if (n < 1) return null;
  const v = h.getRange(2, 1, n, HOJAS["Registro EF"].cab.length).getValues(), registro = [];
  let ultima = "";
  for (let r = 0; r < n; r++) {
    if (String(v[r][1]) !== aula || String(v[r][2]) !== id) continue;
    let data = {};
    try { data = JSON.parse(String(v[r][8])); } catch (x) { data = {}; }
    const t = String(v[r][0]);
    if (t > ultima) ultima = t;
    registro.push({ id: String(v[r][9]), t: t, place: String(v[r][5]), activity: String(v[r][6]), event: String(v[r][7]), data: esObjeto_(data) ? data : {} });
  }
  if (!registro.length) return null;
  registro.sort(function (a, b) { return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; });
  return { snapshot: { registro: registro.slice(-LIMITES.devueltas) }, updatedAt: ultima };
}

/* ── GET: recuperar el progreso de un alumno ────────────────── */
function doGet(e) {
  try {
    const q = (e && e.parameter) || {};
    if (typeof q.app !== "string" || !APPS.hasOwnProperty(q.app)) return json_({ ok: false, error: "app" });
    const aula = normAula_(q.classCode);
    if (!aula) return json_({ ok: false, error: "aula" });
    if (q.type === "ping") return json_({ ok: true, version: VERSION, apps: Object.keys(APPS) });
    if (q.type === "progress") {
      const id = normAlias_(q.studentId);
      if (!id) return json_({ ok: false, error: "alias" });
      const progreso = APPS[q.app].leerProgreso(aula, id);
      if (!progreso) return json_({ ok: false, error: "no encontrado" });
      return json_({ ok: true, progress: progreso });
    }
    return json_({ ok: false, error: "tipo" });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err).slice(0, 200) });
  }
}
