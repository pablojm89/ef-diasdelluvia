import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const B = await import('../botiquin/casos.js');
const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => readFileSync(root + file, 'utf8');

test('botiquín: PAS son tres pasos en su orden, con gesto para toda la clase y variante sentada', () => {
 assert.deepEqual(B.PAS.map(part => part.letra), ['P', 'A', 'S']);
 assert.deepEqual(B.PAS.map(part => part.es), ['Proteger', 'Avisar', 'Socorrer']);
 for (const part of B.PAS) for (const field of ['en', 'pregunta', 'gesto', 'sentada']) assert.ok(part[field].length > 3, `${part.letra}.${field}`);
});
test('botiquín: cada caso tiene tres decisiones con una sola respuesta buena y un porqué en todas', () => {
 const ids = new Set();
 assert.ok(B.CASOS.length >= 6);
 for (const item of B.CASOS) {
  assert.equal(ids.has(item.id), false, item.id); ids.add(item.id);
  for (const field of ['titulo', 'escena', 'donde']) assert.ok(item[field].length > 5, `${item.id}.${field}`);
  assert.equal(item.pasos.length, B.PAS.length, item.id);
  for (const options of item.pasos) {
   assert.ok(options.length >= 3, item.id);
   assert.equal(options.filter(option => option.bien).length, 1, item.id);
   assert.equal(new Set(options.map(option => option.texto)).size, options.length, item.id);
   for (const option of options) assert.ok(option.texto.length > 5 && option.porque.length > 10, `${item.id}: ${option.texto}`);
  }
  assert.equal(B.caso(item.id), item);
 }
 assert.equal(B.caso('no-existe'), null);
});
test('botiquín: avisar es siempre avisar a un adulto, y nunca se da por bueno mover, dar de beber ni dejar solo a quien está mal', () => {
 for (const item of B.CASOS) {
  const [proteger, avisar, socorrer] = item.pasos.map(options => options.find(option => option.bien).texto);
  assert.match(avisar, /profe|adulto/i, `${item.id}: ${avisar}`);
  for (const good of [proteger, avisar, socorrer]) assert.doesNotMatch(good, /le levanto|la levanto|le doy agua|(?<!no )le dejo solo|(?<!no )la dejo sola/i, `${item.id}: ${good}`);
 }
 const unconscious = B.caso('desmayo').pasos;
 assert.match(unconscious[1].find(option => option.bien).texto, /112/);
 assert.match(unconscious[2].find(option => option.bien).texto, /posición lateral/);
});
test('botiquín: una ronda son tres casos distintos y no repite hasta haberlos visto todos', () => {
 const all = B.CASOS.map(item => item.id);
 const first = B.siguienteRonda([], () => 0).map(item => item.id);
 assert.equal(first.length, B.RONDA); assert.equal(new Set(first).size, B.RONDA);
 const second = B.siguienteRonda(first, () => .99).map(item => item.id);
 assert.equal(second.filter(id => first.includes(id)).length, 0, 'la segunda ronda trae los que faltan');
 const late = B.siguienteRonda(all.slice(0, all.length - 1), () => .5).map(item => item.id);
 assert.ok(late.includes(all.at(-1)), 'el que falta entra el primero');
 assert.equal(new Set(late).size, B.RONDA);
 assert.equal(B.siguienteRonda(all, () => 0).length, B.RONDA);
});
test('botiquín: la posición lateral va paso a paso en dos idiomas y los tres pasan por los tres papeles', () => {
 assert.ok(B.LATERAL.length >= 6);
 for (const step of B.LATERAL) for (const field of ['es', 'en', 'texto', 'marca']) assert.ok(step[field].length > 2, field);
 assert.match(B.LATERAL[0].es + B.LATERAL[0].texto, /respira|pecho/i, 'lo primero es comprobar');
 assert.match(B.LATERAL.at(-1).texto, /respirando/, 'lo último es vigilar');
 for (let person = 0; person < B.PAPELES.length; person++) {
  assert.equal(new Set(B.PAPELES.map((_, turn) => B.papelesDe(turn)[person])).size, B.PAPELES.length);
 }
 assert.ok(B.NORMAS_LATERAL.some(line => /colchoneta/.test(line)));
 assert.ok(B.NORMAS_LATERAL.some(line => /sentado/.test(line)), 'hay un papel que se puede hacer sentado');
});
test('botiquín: la llamada pregunta qué, dónde, cuántos y cómo está, y pide no colgar', () => {
 const script = B.LLAMADA.map(line => line.es).join(' ');
 for (const word of [/qué ha pasado/i, /dónde/i, /cuántas/i, /respira/i, /no cuelgues/i]) assert.match(script, word);
 for (const line of B.LLAMADA) assert.ok(line.en.length > 5);
});
test('botiquín: la página enlaza lo que existe, usa la cruz blanca sobre verde y tiene su puerta en el pasillo', () => {
 const page = read('botiquin/index.html');
 for (const link of [...page.matchAll(/(?:href|src)="(\.{1,2}\/[^"#]+)"/g)].map(match => match[1])) assert.ok(existsSync(root + new URL(link, 'https://hub.test/botiquin/').pathname.slice(1)), link);
 assert.equal(/class="(frieze|skirting)/.test(page), false);
 assert.match(read('botiquin/botiquin.css'), /\.cabinet i\{[^}]*#2f8a57/, 'señal de primeros auxilios: verde, no la cruz roja');
 const hub = read('hub.js');
 assert.match(hub, /botiquin: \{name: 'El Botiquín'/);
 for (const map of [...hub.matchAll(/places: \[([^\]]+)\]/g)]) assert.match(map[1], /'botiquin'/);
});
