// The queue and the sending of registro.js (protocol v2) with a fake fetch, and end to end against aula.gs on
// simulated sheets. Synthetic players only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {cargarGs} from './doble-google.mjs';

function storage() { const items = new Map(); return {getItem: k => items.has(k) ? items.get(k) : null, setItem: (k, v) => { items.set(k, String(v)); }, removeItem: k => { items.delete(k); }, clear: () => items.clear()}; }
globalThis.localStorage = storage(); globalThis.sessionStorage = storage();
const registro = await import('../registro.js');
const {notasDe, NOTAS, nota, calificacion} = await import('../notas.js');
const GS = fileURLToPath(new URL('../backend/apps-script/aula.gs', import.meta.url));
const URL_PRUEBA = 'http://127.0.0.1:9/exec', AULA = '5B-PRUEBA';

const answer = (body, status = 200) => ({status, text: async () => typeof body === 'string' ? body : JSON.stringify(body), json: async () => (typeof body === 'string' ? JSON.parse(body) : body)});
// A fetch that writes down every call and answers with `reply(body)`.
function fakeFetch(reply) {
 const calls = [];
 const send = async (url, options = {}) => { calls.push({url: String(url), options, body: options.body ? JSON.parse(options.body) : null}); const r = await reply(options.body ? JSON.parse(options.body) : null, new URL(url)); return r instanceof Error ? Promise.reject(r) : answer(r); };
 send.calls = calls;
 return send;
}
// The browser talking to aula.gs (the simulated sheets of tests/doble-google.mjs).
function sheetFetch(gs = cargarGs(GS)) {
 const send = fakeFetch((body, url) => body ? gs.post(body) : gs.get(Object.fromEntries(url.searchParams)));
 send.gs = gs;
 return send;
}
function fresh(connected = true) {
 localStorage.clear(); sessionStorage.clear();
 if (connected) assert.equal(registro.setConnection({url: URL_PRUEBA, classCode: AULA}).ok, true);
}
const play = (p = {course: 5, group: 'B', number: 12, avatar: 1}) => registro.setPlayer(p);
const ok = () => ({ok: true, recibidos: 0, rechazados: [], version: 2});

test('notas: sólo lo declarado da nota, con la escala de La Lupa', () => {
 assert.equal(NOTAS.length, 1);
 const done = {place: 'material', activity: 'equipment-rescue', event: 'completada', data: {fase: 5, intentos: 30, pistas: 2}};
 assert.deepEqual(notasDe(done, '5').notas, [{criterio: '1.3.a', nota: 8, calificacion: 'NT', aciertos: 24, intentos: 30}]);
 assert.equal(notasDe(done, 6).notas[0].criterio, '1.3.b');
 assert.deepEqual(notasDe({...done, data: {intentos: 24}}, 5).notas[0], {criterio: '1.3.a', nota: 10, calificacion: 'SB', aciertos: 24, intentos: 24});
 assert.equal(notasDe({...done, data: {intentos: 10}}, 5).notas[0].aciertos, 10, 'nunca más aciertos que intentos');
 for (const [entry, curso] of [[done, 4], [done, ''], [{...done, event: 'fase'}, 5], [{...done, data: {}}, 5], [{place: 'pista', activity: 'mate', event: 'partido', data: {puntos: 300}}, 5]]) assert.equal(notasDe(entry, curso), null);
 // La Lupa: nota = max(1, aciertos/intentos sobre 10, con un decimal); IN < 5 ≤ SU < 6 ≤ BI < 7 ≤ NT < 9 ≤ SB.
 assert.deepEqual([nota(0, 10), nota(49, 100), nota(2, 3), nota(9, 10)], [1, 4.9, 6.7, 9]);
 assert.deepEqual([4.9, 5, 6, 7, 8.9, 9].map(calificacion), ['IN', 'SU', 'BI', 'NT', 'NT', 'SB']);
});

test('conexión: dirección de Apps Script y código de aula, guardados en la clave compartida', () => {
 fresh(false);
 assert.equal(registro.connection(), null);
 assert.equal(registro.setConnection({url: 'https://example.com/exec', classCode: AULA}).ok, false);
 assert.equal(registro.setConnection({url: 'https://script.google.com/macros/s/AKfyc-PRUEBA_1/exec', classCode: ' '}).ok, false);
 assert.equal(registro.setConnection({url: 'https://script.google.com/macros/s/AKfyc-PRUEBA_1/exec', classCode: ' 5b-prueba '}).ok, true);
 assert.deepEqual(registro.connection(), {url: 'https://script.google.com/macros/s/AKfyc-PRUEBA_1/exec', classCode: '5b-prueba'});
 const shared = JSON.parse(localStorage.getItem('aula-nube'));
 assert.deepEqual([shared.v, shared.url, shared.classCode, shared.app], [1, 'https://script.google.com/macros/s/AKfyc-PRUEBA_1/exec', '5b-prueba', 'pabellon']);
 registro.forgetConnection();
 assert.equal(registro.connection(), null);
 // La Lupa keeps its own in lalupa-ajustes → nube: {url, aula}; El Pabellón can read it, never writes it.
 localStorage.setItem('lalupa-ajustes', JSON.stringify({libreta: 'papel', pin: '1234', nube: {url: 'https://script.google.com/macros/s/AKfyc-LUPA/exec', aula: '5A-PRUEBA'}}));
 assert.deepEqual(registro.lupaConnection(), {url: 'https://script.google.com/macros/s/AKfyc-LUPA/exec', classCode: '5A-PRUEBA'});
 localStorage.setItem('lalupa-ajustes', JSON.stringify({nube: null}));
 assert.equal(registro.lupaConnection(), null);
 localStorage.setItem('lalupa-ajustes', '{roto');
 assert.equal(registro.lupaConnection(), null);
});

test('envío: forma exacta del lote y sólo se da por enviado lo que la hoja confirma', async () => {
 fresh(); play();
 registro.record('pabellon', 'entrada', 'entra', {}, new Date('2026-11-20T09:00:00Z'));
 const done = registro.record('material', 'equipment-rescue', 'completada', {fase: 5, intentos: 30, pistas: 2}, new Date('2026-11-20T09:10:00Z'));
 registro.setMode('pantalla');
 registro.record('espalderas', 'ruleta', 'reto', {reto: 'c1', sentado: false}, new Date('2026-11-20T09:20:00Z'));
 registro.setMode(null);
 assert.equal(registro.pending(), 3);
 const send = fakeFetch(ok);
 const result = await registro.sync({send});
 assert.deepEqual(result, {ok: true, sent: 3, rechazados: 0});
 assert.equal(registro.pending(), 0);
 const [{url, options, body}] = send.calls;
 assert.equal(url, URL_PRUEBA);
 assert.deepEqual([options.method, options.headers, options.redirect, 'mode' in options], ['POST', {'Content-Type': 'text/plain;charset=utf-8'}, 'follow', false]);
 assert.deepEqual(Object.keys(body), ['app', 'classCode', 'type', 'items']);
 assert.deepEqual([body.app, body.classCode, body.type], ['pabellon', AULA, 'batch']);
 assert.deepEqual(body.items.map(i => [i.id.split('-')[0], i.type]), [['s', 'student'], ['g', 'grade'], ['p', 'progress'], ['p', 'progress']]);
 const [student, grade, mine, screen] = body.items;
 assert.deepEqual(student, {id: 's-5b-12', type: 'student', at: student.at, payload: {studentId: '5b-12', alias: '5B-12', curso: '5'}});
 assert.deepEqual(grade.payload, {resultId: `ef-${done.id}`, studentId: '5b-12', alias: '5B-12', curso: '5', tipo: 'aventura', unidad: 'equipment-rescue',
  titulo: 'Equipment Rescue · almacén seguro', nivel: null, fecha: '2026-11-20T09:10:00.000Z', libreta: null, diagnostico: false,
  notas: [{criterio: '1.3.a', nota: 8, calificacion: 'NT', aciertos: 24, intentos: 30}]});
 assert.equal(grade.id, `g-${done.id}`);
 assert.deepEqual(Object.keys(mine.payload), ['studentId', 'alias', 'curso', 'updatedAt', 'snapshot']);
 assert.deepEqual(mine.payload.snapshot.registro.map(e => Object.keys(e)), [['id', 't', 'place', 'activity', 'event', 'data'], ['id', 't', 'place', 'activity', 'event', 'data']]);
 assert.deepEqual([screen.payload.studentId, screen.payload.alias, screen.payload.snapshot.registro[0].activity], ['pantalla', 'Pantalla de clase', 'ruleta']);
 assert.ok(body.items.every(i => !JSON.stringify(i).includes('"sent"')), 'el estado local no viaja');
 assert.deepEqual(await registro.sync({send}), {ok: true, sent: 0});
 assert.equal(send.calls.length, 1, 'sin pendientes no se envía nada');
});

test('envío: error, respuesta ilegible o sin red no borran nada y se reintenta con espera creciente', async () => {
 fresh(); play();
 registro.record('pista', 'mate', 'partido', {resultado: 'empate', puntos: 75});
 let t = Date.parse('2026-11-20T10:00:00Z');
 const clock = () => t;
 const failures = [{ok: false, error: 'ocupado', reintentar: true}, '<html>Inicia sesión</html>', new Error('sin red'), {ok: false, error: 'aula'}];
 const send = fakeFetch(() => failures.shift() ?? ok());
 let r = await registro.sync({send, clock});
 assert.deepEqual([r.ok, r.motivo], [false, 'La hoja estaba ocupada; se reintenta sola.']);
 assert.equal(registro.pending(), 1);
 assert.equal(registro.cloudState().state.ok, false);
 assert.deepEqual(await registro.sync({send, clock}), {ok: false, waiting: true}, 'espera antes de reintentar');
 t += 59000; assert.equal((await registro.sync({send, clock})).waiting, true);
 t += 2000; r = await registro.sync({send, clock});
 assert.match(r.motivo, /no ha contestado como se esperaba \(código 200\)/);
 t += 61000; assert.equal((await registro.sync({send, clock})).waiting, true, 'la segunda espera es más larga');
 t += 60000; r = await registro.sync({send, clock});
 assert.match(r.motivo, /No se ha podido leer la respuesta/);
 r = await registro.sync({send, clock, now: true});
 assert.match(r.motivo, /error \(aula\)/, '«Enviar ahora» no espera');
 assert.equal(registro.pending(), 1);
 assert.equal(registro.cloudState().last, null);
 r = await registro.sync({send, clock, now: true});
 assert.deepEqual(r, {ok: true, sent: 1, rechazados: 0});
 assert.equal(registro.pending(), 0);
 assert.equal(registro.cloudState().state.ok, true);
 assert.ok(registro.cloudState().last);
 assert.equal(send.calls.length, 5);
});

test('envío: un rechazo parcial se confirma y se avisa', async () => {
 fresh(); play();
 registro.record('pista', 'mate', 'partido', {resultado: 'victoria', puntos: 200});
 const send = fakeFetch(body => ({ok: true, recibidos: body.items.length, rechazados: [{id: body.items[1].id, error: 'progreso vacío'}], version: 2}));
 assert.deepEqual(await registro.sync({send, now: true}), {ok: true, sent: 1, rechazados: 1});
 assert.equal(registro.pending(), 0);
 assert.deepEqual([registro.cloudState().state.rechazados, registro.cloudState().state.motivo], [1, 'progreso vacío']);
});

test('envío: sin conexión configurada no sale nada', async () => {
 fresh(false); play();
 registro.record('pista', 'mate', 'partido', {resultado: 'empate', puntos: 0});
 const send = fakeFetch(ok);
 assert.deepEqual(await registro.sync({send, now: true}), {ok: false, off: true});
 assert.equal(send.calls.length, 0);
 assert.equal(registro.pending(), 1);
});

test('envío: lotes de 40 elementos como máximo, hasta vaciar la cola', async () => {
 fresh();
 for (let n = 1; n <= 30; n++) { play({course: 6, group: 'A', number: n, avatar: 0}); registro.record('material', 'equipment-rescue', 'completada', {fase: 5, intentos: 40, pistas: 0}); }
 const send = fakeFetch(body => ({ok: true, recibidos: body.items.length, rechazados: [], version: 2}));
 while (registro.pending()) await registro.sync({send, now: true});
 assert.ok(send.calls.length >= 3);
 assert.ok(send.calls.every(c => c.body.items.length <= 40));
 assert.equal(send.calls.flatMap(c => c.body.items).filter(i => i.type === 'grade').length, 30);
});

test('de punta a punta con aula.gs: repetir el envío y «volver a enviar todo» no duplican filas', async () => {
 fresh(); play();
 const send = sheetFetch();
 assert.deepEqual(await registro.testConnection(send), {ok: true});
 registro.record('material', 'equipment-rescue', 'fase', {fase: 2, intentos: 9, pistas: 1});
 registro.record('material', 'equipment-rescue', 'completada', {fase: 5, intentos: 25, pistas: 1});
 await registro.sync({send, now: true});
 // The answer was lost: the client did not see it and sends the same batch again.
 send.gs.post(send.calls.at(-1).body);
 registro.resendAll();
 assert.equal(registro.pending(), 2);
 await registro.sync({send, now: true});
 assert.equal(registro.pending(), 0);
 const rows = name => send.gs.doble.hoja(name).table().slice(1);
 assert.equal(rows('Alumnos').length, 1);
 assert.deepEqual(rows('Notas').map(r => [r[2], r[8], r[12], r[9], r[17]]), [['5b-12', '1.3.a', 9.6, 'SB', 'pabellon']]);
 assert.equal(rows('Registro EF').length, 2);
 // Another device: the record comes back from the sheet, already marked as sent.
 localStorage.removeItem('pabellon-registro');
 const back = await registro.recover(registro.player(), send);
 assert.deepEqual([back.ok, back.added], [true, 2]);
 assert.equal(registro.pending(), 0);
 assert.deepEqual(registro.summary().map(r => [r.who, r.gymDone, r.marks.length]), [['5B-12', true, 1]]);
 assert.deepEqual(await registro.recover(registro.player(), send), {ok: true, added: 0, discarded: 0}, 'recuperar dos veces no duplica');
 play({course: 5, group: 'B', number: 13, avatar: 1});
 assert.deepEqual(await registro.recover(registro.player(), send), {ok: false, motivo: 'En la hoja todavía no hay nada tuyo.'});
});

test('recuperar: lo que llega de la hoja se valida antes de guardarlo', async () => {
 fresh(); play();
 const good = {id: 'lx1-aaaaaa', t: '2026-11-20T10:00:00.000Z', place: 'pista', activity: 'mate', event: 'partido', data: {resultado: 'victoria', puntos: 100, nota: '<b>x</b>'}};
 const send = fakeFetch(() => ({ok: true, progress: {snapshot: {registro: [good, {...good, id: 'x'}, {...good, id: 'lx2-bbbbbb', place: '<img>'}, {...good, id: 'lx3-cccccc', data: null}, {...good, id: 'lx4-dddddd', t: 'ayer'}, 'nada']}}}));
 const back = await registro.recover(registro.player(), send);
 assert.deepEqual([back.added, back.discarded], [1, 5]);
 const [entry] = registro.entries();
 assert.deepEqual([entry.who, entry.sid, entry.sent, entry.data.nota], ['5B-12', '5b-12', true, 'bx/b']);
 assert.equal(send.calls[0].url, `${URL_PRUEBA}?app=pabellon&classCode=${AULA}&type=progress&studentId=5b-12`);
});

test('probar conexión: avisa si la hoja no confirma o no acepta a El Pabellón', async () => {
 fresh();
 const lupaOnly = fakeFetch((body, url) => body ? {ok: false, error: 'app'} : {ok: true, version: 2});
 assert.match((await registro.testConnection(lupaOnly)).motivo, /no acepta todavía a El Pabellón/);
 const noPost = fakeFetch((body, url) => body ? '<html></html>' : {ok: true, version: 2, apps: ['lalupa', 'pabellon']});
 assert.match((await registro.testConnection(noPost)).motivo, /^Se puede leer, pero el envío no se confirma/);
 const down = fakeFetch(() => new Error('sin red'));
 assert.match((await registro.testConnection(down)).motivo, /No se puede leer de la hoja/);
});

test('identidad: alias del paquete de clase de La Lupa o código de lista', () => {
 fresh(false);
 assert.equal(registro.setPlayer({course: 5, alias: 'Agente Relámpago', avatar: 3}), true);
 assert.deepEqual(registro.player(), {course: 5, alias: 'Agente Relámpago', avatar: 3});
 assert.equal(registro.playerCode(registro.player()), 'Agente Relámpago');
 assert.equal(registro.studentId(registro.player()), 'agente-relampago', 'el mismo studentId que La Lupa (normAlias)');
 for (const bad of [{course: 5, alias: '', avatar: 1}, {course: 5, alias: '!!!', avatar: 1}, {course: 5, alias: 'x'.repeat(41), avatar: 1}, {course: 7, alias: 'Agente', avatar: 1}])
  assert.equal(registro.setPlayer(bad), false, JSON.stringify(bad));
 const e = registro.record('pista', 'mate', 'partido', {resultado: 'empate', puntos: 0});
 assert.deepEqual([e.who, e.sid, e.curso], ['Agente Relámpago', 'agente-relampago', '5']);
 // Package validation: the same rules as La Lupa's validarPaquete, without the pictures being required.
 const pkg = {tipo: 'lalupa-clase', version: 1, clase: '5.º B', curso: '5', alumnos: [{alias: 'Agente Relámpago', avatar: 'data:image/png;base64,AAAA'}, {alias: 'Detective Lince', avatar: 'javascript:alert(1)'}]};
 assert.deepEqual(registro.validPackage(pkg), {clase: '5.º B', course: 5, alumnos: [{alias: 'Agente Relámpago', avatar: 'data:image/png;base64,AAAA'}, {alias: 'Detective Lince', avatar: null}]});
 for (const bad of [{...pkg, tipo: 'otro'}, {...pkg, alumnos: []}, {...pkg, curso: '9'}, {...pkg, alumnos: [{alias: 'Lince'}, {alias: 'LINCE'}]}]) assert.equal(registro.validPackage(bad), null);
 assert.equal(registro.aliasEntry(), false);
 registro.setAliasEntry(true); assert.equal(registro.aliasEntry(), true);
});

test('registro: al llenarse se sueltan primero las anotaciones ya enviadas', () => {
 fresh(false); play();
 const list = Array.from({length: 800}, (_, i) => ({id: `lx-${String(i).padStart(4, '0')}`, t: new Date(Date.UTC(2026, 10, 1) + i * 60000).toISOString(), who: '5B-12', sid: '5b-12', curso: '5', place: 'pista', activity: 'mate', event: 'partido', data: {}, sent: i >= 10}));
 localStorage.setItem('pabellon-registro', JSON.stringify(list));
 registro.record('pista', 'mate', 'partido', {resultado: 'empate'});
 const now = registro.entries();
 assert.equal(now.length, 800);
 assert.equal(now.filter(e => !e.sent).length, 11, 'las diez pendientes siguen y la nueva también');
 assert.equal(registro.cloudState().dropped, 0);
});
