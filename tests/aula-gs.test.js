// backend/apps-script/aula.gs run in Node against simulated sheets (tests/doble-google.mjs). Not Google.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {cargarGs, dobleGoogle} from './doble-google.mjs';

const GS = fileURLToPath(new URL('../backend/apps-script/aula.gs', import.meta.url));
// La Lupa's own server, to check that aula.gs keeps its behaviour. Point MULTIPLICOPOLIS at a clone of that repo.
const LUPA = process.env.MULTIPLICOPOLIS ? `${process.env.MULTIPLICOPOLIS}/backend/apps-script/la-lupa.gs` : '';
const T = '2026-11-20T10:00:00.000Z';
const lote = (app, items, classCode = '5b-prueba') => ({app, classCode, type: 'batch', items});
const alumno = (studentId, alias = studentId, curso = '5') => ({id: `s-${studentId}`, type: 'student', at: T, payload: {studentId, alias, curso}});
const anotacion = (id, extra = {}) => ({id, t: T, place: 'material', activity: 'equipment-rescue', event: 'fase', data: {fase: 2, intentos: 9, pistas: 1}, ...extra});
const progreso = (studentId, registro, alias = studentId) => ({id: `p-${studentId}-${registro[0]?.id}`, type: 'progress', at: T, payload: {studentId, alias, curso: '5', updatedAt: T, snapshot: {registro}}});
const nota = (resultId, studentId, n = 8, extra = {}) => ({id: `g-${resultId}`, type: 'grade', at: T, payload: {resultId, studentId, alias: studentId, curso: '5', tipo: 'aventura',
 unidad: 'equipment-rescue', titulo: 'Equipment Rescue · almacén seguro', nivel: null, fecha: T, libreta: null, diagnostico: false,
 notas: [{criterio: '1.3.a', nota: n, calificacion: n < 5 ? 'IN' : 'NT', aciertos: 24, intentos: 30}], ...extra}});
const filas = (gs, name) => gs.doble.hoja(name)?.table().slice(1) ?? [];
const formulas = gs => gs.doble.book.getSheets().reduce((n, s) => n + s.formulas.size, 0);

test('aula.gs: prueba de conexión, apps admitidas y peticiones mal formadas', () => {
 const gs = cargarGs(GS);
 assert.deepEqual(gs.get({app: 'pabellon', classCode: '5b-prueba', type: 'ping'}), {ok: true, version: 2, apps: ['lalupa', 'pabellon']});
 assert.equal(gs.get({app: 'lalupa', classCode: '5b-prueba', type: 'ping'}).ok, true);
 assert.deepEqual(gs.get({app: 'otra', classCode: 'x', type: 'ping'}), {ok: false, error: 'app'});
 assert.deepEqual(gs.get({app: 'pabellon', classCode: '***', type: 'ping'}), {ok: false, error: 'aula'});
 assert.deepEqual(gs.post(lote('pabellon', [])), {ok: true, recibidos: 0, rechazados: [], version: 2});
 assert.deepEqual(gs.post('esto no es JSON'), {ok: false, error: 'app'});
 assert.deepEqual(gs.post(lote('__proto__', [])), {ok: false, error: 'app'});
 assert.deepEqual(gs.post(lote('pabellon', [], '')), {ok: false, error: 'aula'});
 assert.equal(gs.doble.book.getSheets().length, 0, 'una prueba de conexión no escribe nada');
});

test('aula.gs: el mismo alumno es una sola fila venga de la app que venga', () => {
 const gs = cargarGs(GS);
 assert.equal(gs.post(lote('pabellon', [alumno('5b-12', '5B-12'), alumno('agente-relampago', 'Agente Relámpago')])).ok, true);
 gs.post(lote('lalupa', [alumno('Agente Relámpago', 'Agente Relámpago')]));
 gs.post(lote('pabellon', [alumno('AGENTE RELAMPAGO', 'Agente Relámpago')]));
 const rows = filas(gs, 'Alumnos');
 assert.deepEqual(rows.map(r => [r[1], r[2], r[3], r[4], r[5]]), [['5B-PRUEBA', '5b-12', '5B-12', '5', 'pabellon'], ['5B-PRUEBA', 'agente-relampago', 'Agente Relámpago', '5', 'pabellon']]);
 gs.post(lote('pabellon', [alumno('5b-12')], 'otra aula'));
 assert.equal(filas(gs, 'Alumnos').length, 3, 'otra aula es otra fila');
});

test('aula.gs: una nota por resultado y criterio; repetir no duplica y reenviarla la actualiza', () => {
 const gs = cargarGs(GS);
 const first = gs.post(lote('pabellon', [alumno('5b-12'), nota('ef-abc123', '5b-12', 8)]));
 assert.deepEqual(first, {ok: true, recibidos: 2, rechazados: [], version: 2});
 gs.post(lote('pabellon', [alumno('5b-12'), nota('ef-abc123', '5b-12', 8)]));
 let rows = filas(gs, 'Notas');
 assert.equal(rows.length, 1);
 assert.deepEqual([rows[0][2], rows[0][5], rows[0][6], rows[0][8], rows[0][9], rows[0][10], rows[0][12], rows[0][13], rows[0][14], rows[0][17]],
  ['5b-12', 'aventura', 'equipment-rescue', '1.3.a', 'NT', 'ef-abc123', 8, 24, 30, 'pabellon']);
 gs.post(lote('pabellon', [nota('ef-abc123', '5b-12', 4)]));
 rows = filas(gs, 'Notas');
 assert.equal(rows.length, 1);
 assert.deepEqual([rows[0][9], rows[0][12]], ['IN', 4]);
 const bad = gs.post(lote('pabellon', [nota('x', '5b-12'), {id: 'raro', type: 'otro', payload: {studentId: '5b-12'}}, {id: 'sin', type: 'student', payload: {alias: 'nadie'}}]));
 assert.deepEqual(bad.rechazados, [{id: 'g-x', error: 'nota sin id de resultado'}, {id: 'raro', error: 'tipo desconocido'}, {id: 'sin', error: 'elemento sin alias'}]);
});

test('aula.gs: el registro de El Pabellón se fusiona por anotación y se recupera en otro dispositivo', () => {
 const gs = cargarGs(GS);
 const a = anotacion('lx1-aaaaaa'), b = anotacion('lx2-bbbbbb', {t: '2026-11-21T09:00:00.000Z', event: 'completada', data: {fase: 5, intentos: 30, pistas: 2}});
 const c = anotacion('lx3-cccccc', {place: 'pista', activity: 'mate', event: 'partido', data: {resultado: 'victoria', puntos: 350, asistencias: 2}});
 assert.equal(gs.post(lote('pabellon', [progreso('5b-12', [a])])).ok, true);
 gs.post(lote('pabellon', [progreso('5b-12', [a, b])]));
 gs.post(lote('pabellon', [progreso('5b-12', [a, b, c]), progreso('pantalla', [anotacion('lx4-dddddd', {place: 'espalderas', activity: 'ruleta', event: 'reto', data: {reto: 'c1'}})], 'Pantalla de clase')]));
 const rows = filas(gs, 'Registro EF');
 assert.equal(rows.length, 4);
 assert.deepEqual(rows.map(r => r[9]), ['lx1-aaaaaa', 'lx2-bbbbbb', 'lx3-cccccc', 'lx4-dddddd']);
 assert.deepEqual(JSON.parse(rows[2][8]), {resultado: 'victoria', puntos: 350, asistencias: 2});
 const back = gs.get({app: 'pabellon', classCode: '5B-Prueba', type: 'progress', studentId: '5B-12'});
 assert.equal(back.ok, true);
 assert.deepEqual(back.progress.snapshot.registro.map(x => x.id), ['lx1-aaaaaa', 'lx3-cccccc', 'lx2-bbbbbb']);
 assert.deepEqual(back.progress.snapshot.registro[2].data, {fase: 5, intentos: 30, pistas: 2});
 assert.equal(back.progress.updatedAt, '2026-11-21T09:00:00.000Z');
 assert.deepEqual(gs.get({app: 'pabellon', classCode: '5b-prueba', type: 'progress', studentId: '6a-01'}), {ok: false, error: 'no encontrado'});
 assert.deepEqual(gs.get({app: 'pabellon', classCode: 'otra', type: 'progress', studentId: '5b-12'}), {ok: false, error: 'no encontrado'});
 assert.equal(filas(gs, 'Progreso').length, 0, 'El Pabellón no usa la pestaña de copias de La Lupa');
});

test('aula.gs: el progreso de La Lupa sigue fusionándose por id', () => {
 const gs = cargarGs(GS);
 const res = (id, libreta) => ({id, fecha: T, notas: [{criterio: '5.1', nota: 7}], eventos: [{x: 1}], ...(libreta ? {libreta} : {})});
 const snap = resultados => ({id: 'p1', type: 'progress', payload: {studentId: 'Agente Relámpago', alias: 'Agente Relámpago', curso: '5', snapshot: {perfil: {id: 'perfil1', nombre: 'Agente Relámpago', curso: '5'}, resultados, academia: {puntos: 10}, registrosAca: []}}});
 gs.post(lote('lalupa', [snap([res('caso-0001')])]));
 gs.post(lote('lalupa', [snap([res('caso-0002'), res('caso-0001', {puntos: 4, fecha: T})])]));
 const back = gs.get({app: 'lalupa', classCode: '5b-prueba', type: 'progress', studentId: 'agente relampago'});
 assert.deepEqual(back.progress.snapshot.resultados.map(r => [r.id, r.libreta?.puntos, 'eventos' in r]), [['caso-0001', 4, false], ['caso-0002', undefined, false]]);
 assert.equal(filas(gs, 'Registro EF').length, 0);
});

test('aula.gs: límites, hoja ocupada y anotaciones mal formadas', () => {
 const gs = cargarGs(GS);
 assert.deepEqual(gs.post(lote('pabellon', Array.from({length: 61}, (_, i) => alumno(`5b-${i}`)))), {ok: false, error: 'demasiados elementos'});
 assert.deepEqual(gs.post(lote('pabellon', [alumno('x'.repeat(1000001))])), {ok: false, error: 'envío demasiado grande'});
 const many = Array.from({length: 101}, (_, i) => anotacion(`lx-${String(i).padStart(4, '0')}`));
 assert.deepEqual(gs.post(lote('pabellon', [progreso('5b-12', many)])).rechazados, [{id: 'p-5b-12-lx-0000', error: 'progreso vacío'}]);
 const mixed = [anotacion('lx-buena1'), anotacion('lx-grande', {data: {texto: 'a'.repeat(700)}}), anotacion('lx-raro1', {place: 'el gimnasio'}), anotacion('x', {}), anotacion('lx-fecha1', {t: 'ayer'}), {id: 'lx-sindatos', t: T, place: 'a', activity: 'b', event: 'c'}];
 const answer = gs.post(lote('pabellon', [progreso('5b-12', mixed)]));
 assert.deepEqual(answer.rechazados, [{id: 'p-5b-12-lx-buena1', error: '5 anotaciones sin forma válida'}]);
 assert.deepEqual(filas(gs, 'Registro EF').map(r => r[9]), ['lx-buena1']);
 gs.doble.book.busy = true;
 assert.deepEqual(gs.post(lote('pabellon', [alumno('5b-12')])), {ok: false, error: 'ocupado', reintentar: true});
 gs.doble.book.busy = false;
});

test('aula.gs: lo que parece fórmula, número o fecha se guarda como texto', () => {
 const gs = cargarGs(GS);
 gs.post(lote('pabellon', [alumno('007', '007'), alumno('=1+1', '=HYPERLINK("x")'), nota('ef-formula', '5-11', 7, {titulo: '+SUM(A1)', unidad: '@x'}),
  progreso('5-11', [anotacion('lx-formula', {data: {nota: '=1+1'}})], '-5')], '1234'));
 assert.equal(formulas(gs), 0);
 const alumnos = filas(gs, 'Alumnos');
 assert.deepEqual(alumnos.map(r => [r[1], r[2], r[3]]), [['1234', '007', '007'], ['1234', '1-1', '=HYPERLINK("x")']]);
 const [n] = filas(gs, 'Notas');
 assert.deepEqual([n[1], n[2], n[6], n[7]], ['1234', '5-11', '@x', '+SUM(A1)']);
 const [r] = filas(gs, 'Registro EF');
 assert.deepEqual([r[2], r[3], typeof r[0]], ['5-11', '-5', 'string']);
 assert.equal(gs.get({app: 'pabellon', classCode: '1234', type: 'progress', studentId: '5-11'}).progress.snapshot.registro[0].data.nota, '=1+1');
 assert.equal(gs.get({app: 'pabellon', classCode: '1234', type: 'progress', studentId: '007'}).error, 'no encontrado');
});

test('aula.gs: una hoja de la-lupa.gs se amplía con la columna app sin apartarla', () => {
 const doble = dobleGoogle(), old = doble.book.insertSheet('Notas');
 const before = ['fecha', 'aula', 'studentId', 'alias', 'curso', 'tipo', 'unidad', 'titulo', 'criterio', 'calificacion', 'resultId', 'nivel', 'nota', 'aciertos', 'intentos', 'libreta', 'diagnostico'];
 old.getRange(1, 1, 1, before.length).setValues([before]);
 old.getRange(2, 1, 1, before.length).setValues([[T, '5B-PRUEBA', 'agente', 'Agente', '5', 'caso', 'u1', 'Caso', '5.1.a', 'NT', 'caso-0001', 2, 8, 8, 10, '', false]]);
 const other = doble.book.insertSheet('Alumnos');
 other.getRange(1, 1, 1, 3).setValues([['otra', 'cosa', 'distinta']]);
 const gs = cargarGs(GS, doble);
 gs.post(lote('pabellon', [alumno('5b-12'), nota('ef-abc123', '5b-12')]));
 const notas = doble.hoja('Notas').table();
 assert.equal(notas[0].at(-1), 'app');
 assert.equal(notas.length, 3);
 assert.equal(notas[1][10], 'caso-0001');
 assert.ok(doble.book.getSheets().some(s => s.getName().startsWith('Alumnos (formato antiguo')), 'otra cabecera se aparta sin borrarla');
 assert.equal(doble.hoja('Alumnos').table().length, 2);
});

test('aula.gs: para La Lupa responde y escribe lo mismo que la-lupa.gs', {skip: !LUPA || !existsSync(LUPA) ? 'sin copia de multiplicopolis (variable MULTIPLICOPOLIS)' : false}, () => {
 const lupa = cargarGs(LUPA), aula = cargarGs(GS);
 const res = (id, extra = {}) => ({id, fecha: T, curso: '5', notas: [{criterio: '5.1', nota: 7, aciertos: 7, intentos: 10}], ...extra});
 const grade = (resultId, extra = {}) => ({id: `g-${resultId}`, type: 'grade', payload: {resultId, studentId: 'Agente Relámpago', alias: 'Agente Relámpago', curso: '5', tipo: 'caso', unidad: 'u1', titulo: 'El caso', nivel: 2, fecha: T, libreta: null, diagnostico: false,
  notas: [{criterio: '5.1.a', nota: 7, calificacion: 'NT', aciertos: 7, intentos: 10}, {criterio: '9.1.a', nota: 9.5, calificacion: 'SB', aciertos: 19, intentos: 20}], ...extra}});
 const snap = (resultados, extra = {}) => ({id: 'p-1', type: 'progress', payload: {studentId: 'agente relámpago', alias: 'Agente Relámpago', curso: '5', snapshot: {perfil: {id: 'perfil01', nombre: 'Agente Relámpago', curso: '5', avatar: 'Agente Relámpago'}, resultados, academia: {sesion: 2, puntos: 40, puntosDia: {'2026-11-20': 40}}, registrosAca: [], ...extra}}});
 const lotes = [
  lote('lalupa', []),
  lote('lalupa', [alumno('Agente Relámpago'), alumno('007'), grade('caso-0001'), snap([res('caso-0001')])]),
  lote('lalupa', [alumno('Agente Relámpago'), grade('caso-0001', {libreta: {puntos: 3}}), grade('caso-0002'), snap([res('caso-0002'), res('caso-0001', {libreta: {puntos: 3, fecha: T}})])]),
  lote('lalupa', [grade('x'), {id: 'mal', type: 'nuevo', payload: {studentId: 'a'}}, {id: 'p-vacio', type: 'progress', payload: {studentId: 'a'}}]),
  lote('lalupa', [alumno('=1+1', '=1+1'), grade('caso-0003', {titulo: '=HYPERLINK("x")'})], '1234'),
 ];
 for (const body of lotes) assert.deepEqual(aula.post(body), lupa.post(body), JSON.stringify(body).slice(0, 80));
 for (const name of ['Alumnos', 'Notas', 'Progreso']) {
  const strip = rows => rows.map(r => name === 'Progreso' ? r.map((c, i) => i === 3 ? 'fecha' : c) : r.slice(0, -1).map((c, i) => i === 0 && name === 'Alumnos' ? 'fecha' : c));
  assert.deepEqual(strip(aula.doble.hoja(name).table()), (lupa.doble.hoja(name).table()).map(r => name === 'Progreso' ? r.map((c, i) => i === 3 ? 'fecha' : c) : r.map((c, i) => i === 0 && name === 'Alumnos' ? 'fecha' : c)), name);
 }
 for (const q of [{type: 'progress', studentId: 'AGENTE RELAMPAGO'}, {type: 'progress', studentId: 'nadie'}, {type: 'otra'}]) {
  const a = aula.get({app: 'lalupa', classCode: '5b-prueba', ...q}), b = lupa.get({app: 'lalupa', classCode: '5b-prueba', ...q});
  if (a.progress) { a.progress.updatedAt = b.progress.updatedAt = 'x'; }
  assert.deepEqual(a, b, JSON.stringify(q));
 }
 assert.equal(formulas(aula), 0);
 assert.deepEqual(lupa.post(lote('pabellon', [])), {ok: false, error: 'app'}, 'la-lupa.gs no acepta a El Pabellón: por eso hace falta aula.gs');
});
