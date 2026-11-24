import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const E = await import('../espejos/reglas.js');
const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => readFileSync(root + file, 'utf8');
// A random source that repeats, so the games can be checked.
const seeded = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

test('espejos: los ritmos van de fáciles a difíciles, con golpes en dos idiomas y pisada que sentados es chasquido', () => {
 assert.ok(E.PATRONES.length >= 8);
 for (const patron of E.PATRONES) {
  assert.ok([4, 8].includes(patron.length), patron);
  for (const letra of E.tiempos(patron)) assert.ok(E.GOLPES[letra], `${patron}: ${letra}`);
  assert.notEqual(patron[0], '_', 'se empieza sonando');
 }
 assert.equal(E.PATRONES[0].length, 4); assert.equal(E.PATRONES.at(-1).length, 8);
 assert.equal(new Set(E.PATRONES).size, E.PATRONES.length);
 for (const item of Object.values(E.GOLPES)) assert.ok(item.es && item.en);
 assert.equal(E.golpe('S').es, 'Pisada'); assert.equal(E.golpe('S', true).es, 'Chasquido'); assert.equal(E.golpe('P', true).es, 'Palmas');
});
test('espejos: en las estatuas la regla cambia de fase a fase, salen todos los colores y nunca dos iguales seguidos', () => {
 assert.notDeepEqual(E.FASES[0], E.FASES[1]);
 assert.equal(E.FASES[1].verde, 'estatua', 'la segunda fase da la vuelta a la primera');
 assert.ok(Object.keys(E.FASES.at(-1)).length > Object.keys(E.FASES[0]).length, 'la última añade un color');
 for (const color of Object.values(E.COLORES)) assert.ok(color.es && color.en && color.forma, 'cada color tiene nombre y forma: no depende sólo del color');
 assert.equal(new Set(Object.values(E.COLORES).map(color => color.forma)).size, Object.keys(E.COLORES).length);
 for (let seed = 1; seed <= 40; seed++) {
  const game = E.partida(seeded(seed));
  assert.equal(game.length, E.FASES.length);
  for (const phase of game) {
   const colours = phase.segmentos.map(part => part.color);
   assert.deepEqual([...new Set(colours)].sort(), Object.keys(phase.regla).sort(), `semilla ${seed}: ${colours}`);
   for (let i = 1; i < colours.length; i++) assert.notEqual(colours[i], colours[i - 1], `semilla ${seed}`);
   for (const part of phase.segmentos) { assert.equal(part.accion, phase.regla[part.color]); assert.ok(part.segundos >= 3 && part.segundos <= 6); }
  }
  const total = game.flatMap(phase => phase.segmentos).reduce((sum, part) => sum + part.segundos, 0);
  assert.ok(total >= 54 && total <= 108, `dura entre uno y dos minutos: ${total}`);
 }
});
test('espejos: la baraja son movimientos pintados con nombre en inglés; la mímica no repite hasta dar la vuelta', () => {
 assert.ok(E.BARAJA.length >= 24);
 for (const move of E.BARAJA) { assert.ok(move.es && move.en && move.sentada, move.id); assert.ok(existsSync(`${root}aula/assets/mov-${move.id}.webp`), move.id); }
 const seen = [];
 for (let i = 0; i < E.BARAJA.length; i++) { const move = E.siguienteMimica(seen, seeded(i + 3)); assert.equal(seen.includes(move.id), false); seen.push(move.id); }
 assert.ok(E.siguienteMimica(seen, seeded(9)));
});
test('espejos: la coreografía son cuatro movimientos de dos cuentas, ocho tiempos, y se elige entre tres que no estén ya', () => {
 assert.equal(E.FRASE * E.CUENTAS, 8);
 const phrase = [];
 for (let i = 0; i < E.FRASE; i++) {
  const offer = E.oferta(phrase, seeded(i + 11));
  assert.equal(offer.length, 3); assert.equal(new Set(offer.map(move => move.id)).size, 3);
  for (const move of offer) assert.equal(phrase.includes(move.id), false);
  phrase.push(offer[0].id);
 }
 assert.deepEqual(E.enCuenta(phrase, 0), {indice: 0, entra: true, numero: 1});
 assert.deepEqual(E.enCuenta(phrase, 1), {indice: 0, entra: false, numero: 2});
 assert.deepEqual(E.enCuenta(phrase, 7), {indice: 3, entra: false, numero: 8});
 assert.deepEqual(E.enCuenta(phrase, 8), {indice: 0, entra: true, numero: 1});
 assert.deepEqual(E.enCuenta(phrase.slice(0, 2), 3), {indice: 1, entra: false, numero: 4});
});
test('espejos: la página enlaza lo que existe y tiene su puerta en el pasillo de la pantalla digital', () => {
 const page = read('espejos/index.html');
 for (const link of [...page.matchAll(/(?:href|src)="(\.{1,2}\/[^"#]+)"/g)].map(match => match[1])) assert.ok(existsSync(root + new URL(link, 'https://hub.test/espejos/').pathname.slice(1)), link);
 for (const style of [...read('espejos/espejos.css').matchAll(/url\('([^']+)'\)/g)]) assert.ok(existsSync(root + new URL(style[1], 'https://hub.test/espejos/').pathname.slice(1)), style[1]);
 assert.equal(/class="(frieze|skirting)/.test(page), false);
 const hub = read('hub.js');
 assert.match(hub, /espejos: \{name: 'La Sala de Espejos'/);
 assert.match(hub, /pantalla: \{[^}]*'espejos'/);
});
