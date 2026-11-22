import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {OBJETOS, objeto, DIAS, RUTINA, PREGUNTAS, CARTELES, CON_CROMO} from '../vestuario/neceser-banco.js';
import * as N from '../vestuario/neceser.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = file => readFileSync(root + file, 'utf8');

test('neceser: cada objeto tiene nombre, inglés y una razón, y su dibujo está pedido', () => {
 const lote = JSON.parse(read('arte/lotes/17-vestuario.json'));
 for (const o of OBJETOS) {
  assert.ok(o.es && o.en && o.por, o.id);
  assert.ok(['neceser', 'mochila', 'fuera'].includes(o.donde), o.id);
  if (o.donde !== 'fuera') assert.ok(o.si, o.id);
  if (o.dias) { assert.ok(o.dias.every(d => DIAS.some(x => x.id === d)), o.id); if (o.dias.length < DIAS.length) assert.ok(o.hoyNo, o.id); }
  assert.equal(lote['neceser-' + o.id]?.destino, `vestuario/assets/${o.id}.webp`, o.id);
 }
 assert.equal(CON_CROMO.length, 14);
 assert.equal(CARTELES.length, 3);
 for (const q of PREGUNTAS) { assert.equal(q.o.length, 3, q.p); assert.ok(q.bien >= 0 && q.bien < 3 && q.por, q.p); }
 assert.ok(PREGUNTAS.length >= 12);
});

test('neceser: nivel 1, lo que va al neceser entra y lo demás vuelve al banco con su razón', () => {
 let r = N.ronda(1, {random: N.seeded(3)});
 assert.equal(r.objetos.length, 10);
 assert.deepEqual(N.destinos(1), ['neceser', 'fuera']);
 const wrong = N.poner(r, 'no-consola', 'neceser');
 assert.equal(wrong.ok, false); assert.match(wrong.texto, /consola/i); assert.equal(wrong.r.fallos, 1);
 assert.equal(r.fallos, 0, 'la ronda original no cambia');
 r = wrong.r;
 for (const id of r.objetos) r = N.poner(r, id, N.destino(objeto(id), 1)).r;
 assert.ok(N.hecha(r));
 assert.deepEqual(N.guardados(r).sort(), ['bolsa-ropa', 'camiseta', 'desodorante', 'jabon', 'peine', 'toalla']);
 assert.deepEqual(N.resultado(r, 2, 2), {nivel: 1, aciertos: 10, fallos: 1, preguntas: 2, de: 2});
 assert.equal(N.poner(r, 'toalla', 'fuera').texto, '', 'lo que ya está puesto no se mueve');
});

test('neceser: nivel 2 depende del día y busca primero los cromos que faltan', () => {
 for (const dia of DIAS) {
  const r = N.ronda(2, {random: N.seeded(7), dia: dia.id});
  assert.equal(r.dia, dia.id);
  assert.equal(new Set(r.objetos).size, r.objetos.length);
  assert.ok(r.objetos.length >= 10 && r.objetos.length <= 14, `${dia.id}: ${r.objetos.length}`);
  assert.ok(r.objetos.includes('botella') && r.objetos.includes('coletero'));
  for (const id of r.objetos) assert.ok(N.destinos(2).includes(N.destino(objeto(id), 2, dia.id)));
 }
 assert.equal(N.destino(objeto('crema-solar'), 2, 'lluvia'), 'fuera');
 assert.equal(N.destino(objeto('crema-solar'), 2, 'sol'), 'neceser');
 assert.equal(N.destino(objeto('gorra'), 2, 'sol'), 'mochila');
 assert.match(N.poner(N.ronda(2, {dia: 'lluvia', random: N.seeded(1)}), 'botella', 'neceser').texto, /mochila/);
 // With only the toothbrush missing, the day is always the canteen one.
 for (let seed = 0; seed < 20; seed++) assert.equal(N.eligeDia(new Set(['cepillo-dientes']), N.seeded(seed)), 'comedor');
 // Over the four days, every sticker of the page can be earned.
 const ganables = new Set(DIAS.flatMap(d => { const r = N.ronda(2, {dia: d.id, random: N.seeded(2)}); return r.objetos.filter(id => N.destino(objeto(id), 2, d.id) !== 'fuera'); }));
 for (const o of CON_CROMO.filter(o => !o.base)) assert.ok(ganables.has(o.id), o.id);
});

test('neceser: nivel 3 ordena la rutina y explica por qué no toca todavía', () => {
 let r = N.rutina(N.seeded(5));
 assert.equal(r.orden.length, RUTINA.length);
 const early = N.elegir(r, 'desodorante');
 assert.equal(early.ok, false); assert.match(early.texto, /desodorante/i);
 r = early.r;
 for (const p of RUTINA) r = N.elegir(r, p.id).r;
 assert.ok(N.rutinaHecha(r));
 assert.deepEqual(N.resultado(r, 1, 2), {nivel: 3, aciertos: 7, fallos: 1, preguntas: 1, de: 2});
});

test('neceser: la pantalla de clase mezcla lo que va y lo que no, y las preguntas no se repiten', () => {
 const lista = N.rondaClase(N.seeded(9));
 assert.equal(lista.length, 10);
 assert.equal(lista.filter(x => x.va).length, 5);
 for (const x of lista) assert.equal(x.va, N.destino(objeto(x.id), 1) === 'neceser', x.id);
 const first = N.preguntas(N.seeded(1), 2), second = N.preguntas(N.seeded(1), 2, first);
 assert.equal(first.length, 2);
 assert.ok(second.every(i => !first.includes(i)));
});

test('vestuario: la página enlaza lo que existe, sin campos de texto, y el hub tiene su puerta', () => {
 const page = read('vestuario/index.html');
 for (const [, link] of page.matchAll(/(?:href|src)="([^"#]+)"/g)) assert.ok(existsSync(new URL(link, 'file://' + root + 'vestuario/').pathname), link);
 assert.doesNotMatch(page, /<input(?![^>]*type="checkbox")/, 'el alumnado no escribe nada');
 assert.doesNotMatch(page, /<textarea/);
 const hub = read('hub.js');
 assert.match(hub, /vestuario: \{name: 'El Vestuario'/);
 assert.match(hub, /places: \[[^\]]*'vestuario'[^\]]*\]/);
 assert.match(read('PRIVACY.md'), /pabellon-album/);
});
