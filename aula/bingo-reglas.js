// Rules of the movement bingo. Pure: cards come from their number, so card 12 is the same on every tablet
// and on paper, and the class screen can check a card without any connection between devices.
import {MOVIMIENTOS} from './movimientos.js';

export const SIZES = [3, 4], FIRST_CARD = 1, LAST_CARD = 60, GOALS = [5, 10, 15, 20];

// Small seeded generator (mulberry32).
export function seeded(seed) {
 let a = seed >>> 0;
 return () => {
  a = (a + 0x6d2b79f5) >>> 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}

export const validCard = (number, size) => Number.isInteger(number) && number >= FIRST_CARD && number <= LAST_CARD && SIZES.includes(size);

// The ids on card `number`, row by row. Partial Fisher–Yates: no movement twice on a card.
export function cardFor(number, size) {
 if (!validCard(number, size)) throw new RangeError('Cartón no válido');
 const random = seeded(Math.imul(number, 2654435761) ^ (size * 40503));
 const ids = MOVIMIENTOS.map(move => move.id), count = size * size;
 for (let i = 0; i < count; i++) {
  const j = i + Math.floor(random() * (ids.length - i));
  [ids[i], ids[j]] = [ids[j], ids[i]];
 }
 return ids.slice(0, count);
}

// Rows, then columns, then the two diagonals, as lists of cell indexes.
export function linesOf(size) {
 const range = Array.from({length: size}, (_, i) => i), lines = [];
 for (const r of range) lines.push(range.map(c => r * size + c));
 for (const c of range) lines.push(range.map(r => r * size + c));
 lines.push(range.map(i => i * size + i), range.map(i => i * size + size - 1 - i));
 return lines;
}

// Which lines of the card are complete with these ids marked (a Set or an array).
export function completeLines(card, marked) {
 const size = Math.round(Math.sqrt(card.length)), done = new Set(marked);
 return linesOf(size).map((line, index) => line.every(cell => done.has(card[cell])) ? index : -1).filter(index => index >= 0);
}
export const isBingo = (card, marked) => { const done = new Set(marked); return card.every(id => done.has(id)); };

// The class screen: what has been called and the lines the class has collected.
export function newCaller({size = 3, goal = 10} = {}, random = Math.random) {
 const order = MOVIMIENTOS.map(move => move.id);
 for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
 return {v: 1, size: SIZES.includes(size) ? size : 3, goal: GOALS.includes(goal) ? goal : 10, order, called: [], counted: {}, bingos: []};
}
export function validCaller(state) {
 return !!state && state.v === 1 && SIZES.includes(state.size) && GOALS.includes(state.goal) && Array.isArray(state.order)
  && state.order.length === MOVIMIENTOS.length && Array.isArray(state.called) && !!state.counted && typeof state.counted === 'object' && Array.isArray(state.bingos);
}
export function callNext(state) {
 if (state.called.length >= state.order.length) return {state, id: null};
 const next = structuredClone(state), id = next.order[next.called.length];
 next.called.push(id);
 return {state: next, id};
}
export const classLines = state => Object.values(state.counted).reduce((sum, lines) => sum + lines.length, 0);

// Check a card on the screen: its lines with what has been called. New lines add to the class goal once.
export function checkCard(state, number) {
 const card = cardFor(number, state.size), lines = completeLines(card, state.called), bingo = isBingo(card, state.called);
 const next = structuredClone(state), before = next.counted[number] || [];
 const fresh = lines.filter(line => !before.includes(line));
 if (fresh.length) next.counted[number] = [...before, ...fresh];
 if (bingo && !next.bingos.includes(number)) next.bingos.push(number);
 return {state: next, card, lines, fresh, bingo};
}
