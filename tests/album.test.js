import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// The album and the record live in the browser's storage; a small stand-in is enough here.
function storage() { const items = new Map(); return {getItem: k => items.has(k) ? items.get(k) : null, setItem: (k, v) => { items.set(k, String(v)); }, removeItem: k => { items.delete(k); }, clear: () => items.clear()}; }
globalThis.localStorage = storage(); globalThis.sessionStorage = storage();
const registro = await import('../registro.js');
const A = await import('../album.js');
const root = fileURLToPath(new URL('..', import.meta.url));
const entry = (place, activity, event, data = {}, t = '2026-11-20T10:00:00.000Z', sid = '5b-07') => ({id: Math.random().toString(36), t, who: '5B-07', sid, curso: '5', place, activity, event, data, sent: false});

test('álbum: cada cromo tiene página, nombre en los dos idiomas, pista y dorso, y su dibujo existe o está pedido', () => {
 const ids = new Set();
 for (const c of A.CROMOS) {
  assert.ok(!ids.has(c.id), c.id); ids.add(c.id);
  assert.ok(A.PAGINAS.some(p => p.id === c.pagina), c.id);
  for (const field of ['nombre', 'en', 'pista', 'dorso']) assert.ok(c[field]?.length > 2, `${c.id}.${field}`);
  // An empty slot never lies: no «pronto», no countdowns, no luck.
  assert.doesNotMatch(c.pista, /pronto|sólo hoy|casi lo tienes|suerte/i, c.id);
  if (c.pintado) assert.match(c.arte, /^vestuario\/assets\/.+\.webp$/, c.id);
  else assert.ok(existsSync(root + c.arte), c.arte);
  if (c.href) assert.ok(existsSync(root + c.href.split('#')[0] + 'index.html'), c.href);
 }
 assert.deepEqual(A.PAGINAS.map(p => A.CROMOS.filter(c => c.pagina === p.id).length), [6, 7, 14]);
});

test('álbum: lo ya jugado pega sus cromos y los sellos salen de los niveles terminados', () => {
 const {cromos, sellos} = A.ganados([
  entry('material', 'equipment-rescue', 'fase', {fase: 3}),
  entry('pizarra', 'rosco', 'partida', {aciertos: 10}),
  entry('tatami', 'yoga', 'postura', {id: 'a'}),
  entry('vestuario', 'neceser', 'nivel', {nivel: 1}),
  entry('vestuario', 'neceser', 'nivel', {nivel: 2}),
  entry('album', 'cromo', 'pegado', {id: 'toalla'}),
  entry('album', 'cromo', 'pegado', {id: 'no-existe'}),
 ]);
 assert.deepEqual([...cromos].sort(), ['aro', 'cono', 'cuerda', 'gimnasio', 'juego-neceser', 'peto', 'pizarra', 'raqueta', 'tatami', 'toalla', 'vestuario'].sort());
 assert.deepEqual([...sellos.neceser].sort(), [1, 2]);
 const done = A.ganados([entry('material', 'equipment-rescue', 'completada', {fase: 5}), entry('pista', 'mate', 'partido', {})]).cromos;
 for (const id of ['pelota', 'colchoneta', 'pista']) assert.ok(done.has(id), id);
});

test('álbum: se guarda por jugador, lo nuevo se ve una vez y pegar deja huella en el registro', () => {
 localStorage.clear();
 registro.setPlayer({course: 5, group: 'B', number: 7, avatar: 2});
 const lista = [entry('pizarra', 'rosco', 'partida', {}), entry('pizarra', 'rosco', 'partida', {}, undefined, '5b-08')];
 const a = A.album('5b-07', lista);
 assert.ok(A.tiene(a, 'pizarra'));
 assert.deepEqual(A.nuevos(a), ['pizarra']);
 assert.equal(A.cuenta(a, 'lugares').tiene, 1);
 A.marcarVistos(['pizarra'], '5b-07');
 assert.deepEqual(A.nuevos(A.album('5b-07', lista)), []);
 assert.equal(A.pegar('toalla'), true);
 assert.equal(A.pegar('toalla'), false, 'un cromo se pega una vez');
 assert.equal(A.pegar('inventado'), false);
 const written = registro.entries().filter(e => e.place === 'album');
 assert.deepEqual(written.map(e => [e.activity, e.event, e.data.id, e.sid]), [['cromo', 'pegado', 'toalla', '5b-07']]);
 // From the record alone (another computer, the album key lost) the sticker comes back.
 localStorage.removeItem('pabellon-album');
 assert.ok(A.tiene(A.album('5b-07', registro.entries()), 'toalla'));
 // The class screen has no album.
 registro.setMode('pantalla');
 assert.equal(A.pegar('peine'), false);
 assert.equal(A.album(), null);
 registro.setMode(null);
});

test('álbum: el profe ve cada álbum y puede empezarlo de cero sin tocar el registro', () => {
 localStorage.clear();
 const lista = [entry('material', 'equipment-rescue', 'fase', {fase: 1}, '2026-11-20T10:00:00.000Z'), entry('vestuario', 'neceser', 'nivel', {nivel: 1}, '2026-11-20T10:05:00.000Z')];
 A.album('5b-07', lista);
 const [row] = A.albumes();
 assert.equal(row.sid, '5b-07');
 assert.deepEqual(row.paginas.map(p => p.tiene), [3, 3, 0]);
 assert.deepEqual(row.sellos.neceser, [1]);
 A.reiniciar('5b-07', new Date('2026-11-21T09:00:00.000Z'));
 const fresh = A.album('5b-07', lista);
 assert.equal(Object.keys(fresh.cromos).length, 0, 'lo jugado antes de empezar de cero ya no pega cromos');
 assert.deepEqual(fresh.sellos, {});
 const later = A.album('5b-07', [...lista, entry('pizarra', 'rosco', 'partida', {}, '2026-11-21T10:00:00.000Z')]);
 assert.deepEqual(Object.keys(later.cromos), ['pizarra']);
 A.reiniciarTodos();
 assert.equal(A.albumes()[0].paginas[0].tiene, 0);
});
