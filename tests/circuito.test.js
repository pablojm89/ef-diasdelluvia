import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const C = await import('../circuito/plano.js');
const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => readFileSync(root + file, 'utf8');
const seeded = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

test('circuito: el gimnasio tiene cuatro paredes con nombre, objetos en dos idiomas y códigos de baliza reglamentarios', () => {
 assert.deepEqual(C.DIRS, ['N', 'E', 'S', 'O']);
 for (const dir of C.DIRS) assert.ok(C.PAREDES[dir].es && C.PAREDES[dir].en);
 const ids = new Set(), codes = new Set();
 for (const item of C.OBJETOS) {
  assert.equal(ids.has(item.id), false); ids.add(item.id);
  assert.ok(item.es.length > 3 && item.en.length > 2, item.id);
  assert.ok(item.x >= 0 && item.x <= 1 && item.y >= 0 && item.y <= 1, item.id);
  assert.ok(Number.isInteger(item.codigo) && item.codigo >= 31, `${item.id}: el código de una baliza nunca es menor de 31`);
  assert.equal(codes.has(item.codigo), false, 'códigos distintos'); codes.add(item.codigo);
  if (item.pared) assert.ok(C.DIRS.includes(item.pared));
  if (item.cuadro) assert.ok(item.cuadro.every(n => n > 0 && n < 1));
 }
 for (const dir of C.DIRS) assert.ok(C.OBJETOS.some(item => item.pared === dir), `algo cuelga de la pared ${dir}`);
 assert.ok(existsSync(root + 'gimnasio/assets/gym.webp'));
});
test('circuito: el plano está orientado cuando la pared que miras queda arriba, y sólo entonces', () => {
 assert.equal(C.arriba(0), 'N'); assert.equal(C.arriba(1), 'O'); assert.equal(C.arriba(2), 'S'); assert.equal(C.arriba(3), 'E');
 assert.equal(C.arriba(4), 'N'); assert.equal(C.arriba(-1), 'E');
 for (const mira of C.DIRS) assert.equal([0, 1, 2, 3].filter(giro => C.orientado(giro, mira)).length, 1);
 assert.equal(C.orientado(0, 'N'), true); assert.equal(C.orientado(2, 'N'), false); assert.equal(C.orientado(3, 'E'), true);
});
test('circuito: delante, derecha, detrás e izquierda salen de hacia dónde miras', () => {
 assert.equal(C.RELATIVAS[C.relativa('N', 'N')].id, 'delante');
 assert.equal(C.RELATIVAS[C.relativa('N', 'E')].id, 'derecha');
 assert.equal(C.RELATIVAS[C.relativa('N', 'S')].id, 'detras');
 assert.equal(C.RELATIVAS[C.relativa('N', 'O')].id, 'izquierda');
 assert.equal(C.RELATIVAS[C.relativa('S', 'E')].id, 'izquierda', 'mirando al sur, el este queda a la izquierda');
 assert.equal(C.RELATIVAS[C.relativa('O', 'N')].id, 'derecha');
 for (const item of C.RELATIVAS) assert.ok(item.es && item.en);
});
test('circuito: las hojas van en el orden de las progresiones y sus rondas son jugables', () => {
 assert.deepEqual(C.HOJAS.map(hoja => hoja.id), ['plano', 'orienta', 'senala', 'recorrido']);
 for (let seed = 1; seed <= 30; seed++) {
  const azar = seeded(seed);
  const plano = C.rondasPlano(azar);
  assert.equal(plano.length, 7); assert.equal(new Set(plano).size, 7);
  for (const id of plano) assert.ok(C.objeto(id).cuadro, 'se ve en el cuadro');
  const orienta = C.rondasOrienta(azar);
  assert.equal(orienta.length, 6);
  assert.deepEqual([...new Set(orienta.slice(0, 4).map(ronda => ronda.mira))].sort(), [...C.DIRS].sort(), 'salen las cuatro paredes');
  for (const ronda of orienta) assert.equal(C.orientado(ronda.giro, ronda.mira), false, 'el plano nunca sale ya orientado');
  const senala = C.rondasSenala(azar);
  assert.equal(senala.length, 6);
  const respuestas = senala.map(ronda => C.relativa(ronda.mira, C.objeto(ronda.objeto).pared));
  assert.deepEqual([...new Set(respuestas)].sort(), [0, 1, 2, 3], 'salen las cuatro respuestas');
  for (const mira of C.DIRS) {
   const pistas = C.pistasDe(mira, azar);
   assert.equal(pistas.length, 3);
   assert.deepEqual(pistas.map(pista => pista.id).sort(), ['azar', 'otra', 'referencia']);
   assert.equal(C.objeto(pistas.find(pista => pista.id === 'referencia').objeto).pared, mira);
   assert.notEqual(C.objeto(pistas.find(pista => pista.id === 'otra').objeto).pared, mira);
  }
 }
});
test('circuito: el recorrido es en línea, con salida, cinco controles y meta, y en cada control sólo una baliza es la buena', () => {
 assert.equal(C.RECORRIDO.controles.length, 5);
 assert.equal(new Set(C.RECORRIDO.controles.map(control => control.objeto)).size, 5);
 assert.ok(C.CARRERA >= 5 && C.CARRERA <= 15);
 C.RECORRIDO.controles.forEach((control, index) => {
  assert.ok(C.objeto(control.objeto));
  const flags = C.balizasDe(index, seeded(index + 5));
  assert.equal(flags.length, 3); assert.equal(new Set(flags.map(flag => flag.id)).size, 3);
  assert.equal(flags.filter(flag => flag.id === control.objeto).length, 1);
 });
});
