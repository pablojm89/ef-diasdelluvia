import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {challenges} from '../content.js';
import * as oca from '../aula/oca-reglas.js';
import * as bingo from '../aula/bingo-reglas.js';
import {MOVIMIENTOS} from '../aula/movimientos.js';

const root = fileURLToPath(new URL('..', import.meta.url));

test('oca: tablero de 31 casillas con salida, meta, pocas especiales y los seis colores', () => {
 assert.equal(oca.POINTS.length, 31);
 assert.equal(oca.TILES[0].special, 'salida');
 assert.equal(oca.TILES[oca.GOAL].special, 'meta');
 const specials = oca.TILES.filter(tile => tile.special && !['salida', 'meta'].includes(tile.special));
 assert.ok(specials.length <= 8);
 assert.deepEqual(new Set(oca.TILES.slice(1).map(tile => tile.family)), new Set(Object.keys(oca.FAMILY_COLOURS)));
 for (const index of oca.CALM) assert.equal(oca.TILES[index].family, 'calma');
 // Neighbouring squares never share a colour, so the path reads from the back of the room.
 for (let i = 2; i < oca.GOAL; i++) assert.notEqual(oca.TILES[i].family, oca.TILES[i - 1].family, `casilla ${i}`);
 // Squares do not overlap.
 for (let i = 0; i < oca.POINTS.length; i++) for (let j = i + 1; j < oca.POINTS.length; j++)
  assert.ok(Math.hypot(oca.POINTS[i][0] - oca.POINTS[j][0], oca.POINTS[i][1] - oca.POINTS[j][1]) >= oca.BOARD.tile, `${i}-${j}`);
});

test('oca: se avanza casilla a casilla y nunca se retrocede', () => {
 const game = oca.newGame({teams: 3, rounds: 8});
 const {state, moves, team} = oca.roll(game, 3);
 assert.equal(team, 0);
 assert.deepEqual(moves, [{team: 0, path: [1, 2, 3]}]);
 assert.equal(state.teams[0].pos, 3);
 assert.equal(game.teams[0].pos, 0, 'no muta el estado anterior');
 // Overshooting the goal just lands on it.
 const near = structuredClone(game); near.teams[0].pos = oca.GOAL - 2;
 const end = oca.roll(near, 6);
 assert.equal(end.state.teams[0].pos, oca.GOAL);
 assert.equal(end.state.teams[0].arrived, 1);
 assert.throws(() => oca.roll(game, 7));
});

test('oca: de oca a oca y vuelve a tirar; el último oca sólo da otra tirada', () => {
 const game = oca.newGame({teams: 2});
 const first = oca.roll(game, oca.GEESE[0]);
 assert.equal(first.special, 'oca');
 assert.equal(first.state.teams[0].pos, oca.GEESE[1]);
 assert.equal(first.again, true);
 const same = oca.nextTurn(first.state);
 assert.equal(same.turn, 0, 'el mismo equipo vuelve a tirar');
 const last = structuredClone(game); last.teams[0].pos = oca.GEESE[2] - 2;
 const after = oca.roll(last, 2);
 assert.equal(after.state.teams[0].pos, oca.GEESE[2]);
 assert.equal(after.again, true);
});

test('oca: el puente hace avanzar a todos los equipos', () => {
 const game = oca.newGame({teams: 3});
 game.teams[0].pos = oca.BRIDGE - 4; game.teams[1].pos = 2; game.teams[2].pos = oca.GOAL;
 const {state, moves} = oca.roll(game, 4);
 assert.equal(state.teams[0].pos, oca.BRIDGE + oca.BRIDGE_STEPS);
 assert.equal(state.teams[1].pos, 2 + oca.BRIDGE_STEPS);
 assert.equal(state.teams[2].pos, oca.GOAL, 'quien ya llegó no se mueve');
 assert.equal(moves.length, 3);
});

test('oca: casilla de calma da un reto de calma para todos', () => {
 const game = oca.newGame({teams: 2});
 game.teams[0].pos = oca.CALM[0] - 4;
 const {family, special} = oca.roll(game, 4);
 assert.equal(special, 'calma');
 assert.equal(family, 'calma');
});

test('oca: los retos salen del banco por color y no se repiten hasta agotarse', () => {
 let game = oca.newGame({teams: 2});
 const seen = [];
 const family = 'ritmo', size = challenges.filter(c => c.family === family).length;
 for (let i = 0; i < size; i++) {
  const drawn = oca.drawChallenge(game, family);
  game = drawn.state; seen.push(drawn.challenge.id);
  assert.equal(drawn.challenge.family, family);
 }
 assert.equal(new Set(seen).size, size);
 const again = oca.drawChallenge(game, family);
 assert.equal(again.challenge.family, family);
 assert.equal(again.state.retos, size + 1);
});

test('oca: turnos, rondas y final cooperativo', () => {
 let game = oca.newGame({teams: 2, rounds: 6});
 game = oca.nextTurn(game); assert.equal(game.turn, 1); assert.equal(game.round, 1);
 game = oca.nextTurn(game); assert.equal(game.turn, 0); assert.equal(game.round, 2);
 // A team at the goal rolls for the team furthest behind.
 game.teams[0].pos = oca.GOAL;
 assert.equal(oca.mover(game), 1);
 const helped = oca.roll(game, 2);
 assert.equal(helped.team, 1);
 assert.equal(helped.state.teams[1].pos, 2);
 // Everyone at the goal: the class wins.
 const win = structuredClone(game); win.teams[1].pos = oca.GOAL;
 assert.equal(oca.nextTurn(win).over, 'ganada');
 // Rounds run out before everyone arrives.
 let slow = oca.newGame({teams: 2, rounds: 6});
 for (let i = 0; i < 12; i++) slow = oca.nextTurn(slow);
 assert.equal(slow.over, 'agotada');
 assert.deepEqual(oca.summaryOf(slow), {equipos: 2, rondas: 6, retos: 0, completada: false});
});

test('oca: una partida entera con dados al azar acaba siempre y sin retrocesos', () => {
 for (let seed = 1; seed < 60; seed++) {
  const random = bingo.seeded(seed);
  let game = oca.newGame({teams: 2 + seed % 5, rounds: 12}), guard = 0;
  while (!game.over && guard++ < 500) {
   const before = game.teams.map(team => team.pos);
   const rolled = oca.roll(game, 1 + Math.floor(random() * 6));
   rolled.state.teams.forEach((team, i) => assert.ok(team.pos >= before[i]));
   game = oca.nextTurn(oca.drawChallenge(rolled.state, rolled.family, random).state);
  }
  assert.ok(game.over);
  assert.ok(oca.validGame(game));
 }
});

test('bingo: unos 30 movimientos completos, bilingües y de 15 a 20 segundos', () => {
 assert.ok(MOVIMIENTOS.length >= 28 && MOVIMIENTOS.length <= 34);
 assert.equal(new Set(MOVIMIENTOS.map(m => m.id)).size, MOVIMIENTOS.length);
 for (const m of MOVIMIENTOS) {
  for (const field of ['es', 'en', 'texto', 'sentada']) assert.ok(m[field].length > 2, `${m.id}.${field}`);
  assert.ok(m.segundos >= 15 && m.segundos <= 20, m.id);
  assert.doesNotMatch(m.texto + m.sentada, /corre|carrera|máximo|salta(?!r)/i, m.id);
 }
});

test('bingo: los cartones son deterministas, sin repetidos y distintos entre sí', () => {
 for (const size of bingo.SIZES) {
  const seen = new Set();
  for (let n = bingo.FIRST_CARD; n <= bingo.LAST_CARD; n++) {
   const card = bingo.cardFor(n, size);
   assert.deepEqual(card, bingo.cardFor(n, size));
   assert.equal(card.length, size * size);
   assert.equal(new Set(card).size, card.length);
   seen.add([...card].sort().join());
  }
  assert.equal(seen.size, bingo.LAST_CARD - bingo.FIRST_CARD + 1, `cartones ${size}×${size}`);
 }
 assert.notDeepEqual(bingo.cardFor(12, 3), bingo.cardFor(12, 4).slice(0, 9));
 assert.throws(() => bingo.cardFor(0, 3));
 assert.throws(() => bingo.cardFor(5, 5));
});

test('bingo: detecta filas, columnas, diagonales y bingo', () => {
 assert.equal(bingo.linesOf(3).length, 8);
 assert.equal(bingo.linesOf(4).length, 10);
 const card = bingo.cardFor(7, 3);
 assert.deepEqual(bingo.completeLines(card, []), []);
 assert.deepEqual(bingo.completeLines(card, card.slice(0, 3)), [0]);
 assert.deepEqual(bingo.completeLines(card, [card[1], card[4], card[7]]), [4]);
 assert.deepEqual(bingo.completeLines(card, [card[0], card[4], card[8]]), [6]);
 assert.deepEqual(bingo.completeLines(card, [card[2], card[4], card[6]]), [7]);
 assert.equal(bingo.isBingo(card, card.slice(0, 8)), false);
 assert.equal(bingo.isBingo(card, card), true);
 assert.equal(bingo.completeLines(card, card).length, 8);
});

test('bingo: la pantalla canta sin repetir y suma las líneas de clase una sola vez', () => {
 let caller = bingo.newCaller({size: 3, goal: 10}, bingo.seeded(3));
 assert.ok(bingo.validCaller(caller));
 const called = [];
 for (let i = 0; i < MOVIMIENTOS.length; i++) { const step = bingo.callNext(caller); caller = step.state; called.push(step.id); }
 assert.equal(new Set(called).size, MOVIMIENTOS.length);
 assert.equal(bingo.callNext(caller).id, null);
 let check = bingo.checkCard(caller, 12);
 assert.equal(check.lines.length, 8);
 assert.equal(check.fresh.length, 8);
 assert.equal(check.bingo, true);
 check = bingo.checkCard(check.state, 12);
 assert.equal(check.fresh.length, 0);
 assert.equal(bingo.classLines(check.state), 8);
 assert.deepEqual(check.state.bingos, [12]);
});

test('aula: las páginas existen y sólo enlazan a lo que existe', () => {
 for (const page of ['aula/index.html', 'aula/oca.html', 'aula/bingo.html']) {
  const html = readFileSync(root + page, 'utf8');
  for (const [, link] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
   if (/^https?:/.test(link)) continue;
   const target = new URL(link, 'https://hub.test/' + page).pathname.slice(1);
   assert.ok(existsSync(root + (target.endsWith('/') ? target + 'index.html' : target)), `${page}: ${link}`);
  }
 }
});
