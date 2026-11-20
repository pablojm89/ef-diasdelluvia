import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {ROSCOS, LETRAS, rosco} from '../pizarra/banco.js';
import * as R from '../pizarra/rosco.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const tiny = {id: 'mini', entradas: ROSCOS[0].entradas.slice(0, 4)};

test('pizarra: el rosco avanza, guarda las pasadas para la siguiente vuelta y termina', () => {
 let game = R.createGame(tiny, {random: R.seeded(1)});
 assert.deepEqual([game.current, game.round, game.done], [0, 1, false]);
 game = R.choose(game, R.rightChoice(game));
 assert.equal(game.status[0], R.ACIERTO); assert.equal(game.current, 1);
 game = R.pass(game);
 assert.equal(game.status[1], R.PASADA); assert.equal(game.current, 2); assert.equal(game.passes, 1);
 game = R.choose(game, (R.rightChoice(game) + 1) % 3);
 assert.equal(game.status[2], R.FALLO);
 game = R.pass(game);
 // Second round: back to the first passed letter.
 assert.deepEqual([game.current, game.round], [1, 2]);
 game = R.answer(game, true);
 assert.deepEqual([game.current, game.done], [3, false]);
 game = R.pass(game);
 // The only letter left comes back to itself, and the game goes on.
 assert.deepEqual([game.current, game.round, game.done], [3, 3, false]);
 game = R.answer(game, false);
 assert.equal(game.done, true);
 assert.deepEqual(R.counts(game), {aciertos: 2, fallos: 2, quedan: 0});
 assert.equal(R.answer(game, true), game);
 const result = R.result(R.tick(game, 5), tiny);
 assert.deepEqual(result, {rosco: 'mini', aciertos: 2, fallos: 2, pasadas: 3, segundos: 0, repasar: ['C', 'D']});
});

test('pizarra: terminar antes deja las letras sin responder para repasar y no cambia la partida original', () => {
 const start = R.createGame(tiny);
 const later = R.tick(R.answer(start, true), 42);
 assert.equal(start.status[0], R.PENDIENTE);
 const done = R.finish(later);
 assert.equal(done.done, true);
 assert.deepEqual(R.result(done, tiny), {rosco: 'mini', aciertos: 1, fallos: 0, pasadas: 0, segundos: 42, repasar: ['B', 'C', 'D']});
 assert.equal(R.tick(done, 3).seconds, 42);
});

test('pizarra: los equipos leen por turnos y solo puntúa el equipo de turno', () => {
 let game = R.createGame(tiny, {teams: 3});
 assert.deepEqual(game.teams, [0, 0, 0]);
 game = R.answer(game, true);  // team 0
 game = R.pass(game);          // team 1 passes
 game = R.answer(game, false); // team 2
 game = R.answer(game, true);  // team 0 again
 assert.deepEqual(game.teams, [2, 0, 0]);
 assert.equal(game.turn, 1);
 assert.deepEqual(R.createGame(tiny, {teams: 1}).teams, []);
 assert.equal(R.createGame(tiny, {teams: 9}).teams.length, 4);
});

test('pizarra: una partida guardada se reconoce y una estropeada no', () => {
 const bank = ROSCOS[1], game = R.createGame(bank);
 assert.ok(R.validGame(JSON.parse(JSON.stringify(game)), bank));
 assert.equal(R.validGame(game, ROSCOS[0]), false);
 assert.equal(R.validGame({...game, current: 99}, bank), false);
 assert.equal(R.validGame({...game, order: game.order.map(() => [0, 0, 1])}, bank), false);
 assert.equal(R.validGame(null, bank), false);
});

test('pizarra: las letras se comparan sin tildes pero la Ñ es una letra propia', () => {
 assert.equal(R.normalize('Ágil'), 'AGIL');
 assert.ok(R.fitsClue({letra: 'Ñ', pista: 'contiene'}, 'muñeca'));
 assert.equal(R.fitsClue({letra: 'N', pista: 'contiene'}, 'muñeca'), false);
 assert.ok(R.fitsClue({letra: 'O', pista: 'empieza'}, 'Óxido'));
 assert.equal(R.clueText({letra: 'X', pista: 'contiene'}), 'Contiene la X');
});

test('banco: dos roscos completos, coherentes y con un microrreto seguro con variante sentada', () => {
 assert.ok(ROSCOS.length >= 2);
 assert.deepEqual(ROSCOS.map(item => item.curso), [5, 6]);
 for (const bank of ROSCOS) {
  assert.equal(rosco(bank.id), bank);
  assert.deepEqual(bank.entradas.map(entry => entry.letra), LETRAS, bank.id);
  const answers = new Set();
  for (const entry of bank.entradas) {
   const where = `${bank.id} ${entry.letra}`;
   assert.ok(['empieza', 'contiene'].includes(entry.pista), where);
   if (['K', 'Ñ', 'W', 'X', 'Y'].includes(entry.letra)) assert.equal(entry.pista, 'contiene', where);
   assert.ok(entry.definicion.length >= 30 && /[.!?]$/.test(entry.definicion), where);
   const choices = R.options(entry);
   assert.equal(choices.length, 3, where);
   assert.equal(new Set(choices.map(R.normalize)).size, 3, where + ': opciones repetidas');
   for (const choice of choices) assert.ok(R.fitsClue(entry, choice), `${where}: «${choice}» no cumple «${R.clueText(entry)}»`);
   // The definition must not give the answer away by spelling it.
   assert.equal(R.normalize(entry.definicion).includes(R.normalize(entry.respuesta)), false, where + ': la definición contiene la respuesta');
   assert.ok(!answers.has(entry.respuesta), where + ': respuesta repetida'); answers.add(entry.respuesta);
   assert.ok(entry.ingles === null || (typeof entry.ingles === 'string' && entry.ingles.length > 1), where);
   const {pie, sentado, s} = entry.reto;
   assert.ok(pie.length > 20 && sentado.length > 20, where + ': reto sin texto');
   assert.ok(s >= 15 && s <= 20, where + ': el reto dura 15–20 s');
   assert.equal(/correr por|carrera hasta|ojos vendados|voltereta|pino/i.test(pie + sentado), false, where + ': reto poco seguro en el aula');
  }
  const game = R.createGame(bank, {random: R.seeded(7)});
  bank.entradas.forEach((entry, i) => {
   const shown = R.shownOptions(game, entry, i);
   assert.equal(shown[R.rightChoice(game, i)], entry.respuesta);
   assert.equal(new Set(shown).size, 3);
  });
 }
});

test('pizarra: el pedido de arte apunta a la carpeta del lugar y el índice existe', () => {
 const lot = JSON.parse(readFileSync(root + 'arte/lotes/11-pizarra.json', 'utf8'));
 assert.ok(existsSync(root + lot._indice.archivo));
 for (const [key, item] of Object.entries(lot)) {
  if (key.startsWith('_')) continue;
  assert.ok(item.destino.startsWith('pizarra/assets/') && item.destino.endsWith('.webp'), key);
  assert.ok(item.ancho > 0 && item.alto > 0 && typeof item.transparente === 'boolean' && item.prompt.length > 80, key);
  assert.ok(item.clave, key);
 }
 for (const file of ['index.html', 'pizarra.css', 'pizarra.js', 'rosco.js', 'banco.js']) assert.ok(existsSync(root + 'pizarra/' + file), file);
});
