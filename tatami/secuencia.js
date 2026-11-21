// Sequences of El Tatami without the page: short codes, turns, the practice timeline and saved sequences.
import {POSES, byId, byCode, CALM} from './posturas.js';

export const MAX = 20;
export const KEY = 'tatami-secuencias', DRAFT = 'tatami-actual', SETTINGS = 'tatami-ajustes';
const SAVED_LIMIT = 24;

// A sequence travels as its pose codes in groups of four poses, e.g. MSUD-TM or EA2R-L3N. A code is one
// letter, or a letter and a digit for the poses that came once the alphabet ran out. Easy to read aloud
// and to type at the board.
export function encode(ids) {
 const codes = ids.map(id => byId(id)?.code).filter(Boolean), groups = [];
 for (let i = 0; i < codes.length; i += 4) groups.push(codes.slice(i, i + 4).join(''));
 return groups.join('-');
}
export function decode(text) {
 const letters = String(text ?? '').toUpperCase().replace(/[\s\-·.]/g, '');
 if (!/^(?:[A-Z][2-9]?)+$/.test(letters)) return null;
 const ids = letters.match(/[A-Z][2-9]?/g).map(code => byCode(code)?.id);
 return ids.length <= MAX && ids.every(Boolean) ? ids : null;
}
export const hashFor = ids => '#s=' + encode(ids).replace(/-/g, '');
export function fromHash(hash) {
 const match = /(?:^#|&)s=([A-Za-z0-9\-]+)/.exec(hash || '');
 return match ? decode(match[1]) : null;
}

export const add = (list, id) => list.length < MAX && byId(id) ? [...list, id] : list;
export const removeAt = (list, index) => list.filter((_, i) => i !== index);
export function move(list, index, delta) {
 const to = index + delta;
 if (index < 0 || index >= list.length || to < 0 || to >= list.length) return list;
 const next = [...list];
 [next[index], next[to]] = [next[to], next[index]];
 return next;
}
// Joining a group's code at the end of the class sequence, without going over the limit.
export const append = (list, more) => [...list, ...more].slice(0, MAX);

// Turns on the class screen: teams take turns, or the next person comes up. Nobody is named.
export function turn({kind = 'equipos', teams = 4, total = 8} = {}, count = 0) {
 if (count >= total) return {done: true, number: total, total, team: null, es: '¡Secuencia completa!', en: 'All done!'};
 const team = kind === 'equipos' ? count % teams + 1 : null;
 return {done: false, number: count + 1, total, team,
  es: team ? `Le toca al equipo ${team}` : 'Le toca a la siguiente persona',
  en: team ? `Team ${team}, your turn` : 'Next person, your turn'};
}

// The practice, step by step. Seconds per step; `beat` is the length of one breath in or out.
export function plan(ids, {beat = 4} = {}) {
 const steps = [];
 ids.forEach((id, index) => {
  const pose = byId(id);
  if (!pose) return;
  for (const side of pose.sides ? [0, 1] : [null]) {
   const base = {pose: id, index, side};
   steps.push({...base, kind: 'announce', duration: side === 1 ? 2 : 3});
   steps.push({...base, kind: 'enter', duration: 4});
   for (let breath = 1; breath <= pose.breaths; breath++) {
    steps.push({...base, kind: 'breathe', breath, of: pose.breaths, phase: 'in', duration: beat});
    steps.push({...base, kind: 'breathe', breath, of: pose.breaths, phase: 'out', duration: beat});
   }
   steps.push({...base, kind: 'exit', duration: 3});
  }
 });
 const calm = {pose: CALM.id, index: ids.length, side: null};
 steps.push({...calm, kind: 'announce', duration: 3}, {...calm, kind: 'enter', duration: 4});
 for (let breath = 1; breath <= CALM.breaths; breath++) {
  steps.push({...calm, kind: 'breathe', breath, of: CALM.breaths, phase: 'in', duration: beat + 1});
  steps.push({...calm, kind: 'breathe', breath, of: CALM.breaths, phase: 'out', duration: beat + 1});
 }
 steps.push({...calm, kind: 'end', duration: 6});
 return steps;
}
export const seconds = steps => steps.reduce((sum, step) => sum + step.duration, 0);
// Where the figure is (0 preparation … 1 pose) at a moment of a step.
export function figureTime(step, progress) {
 if (step.kind === 'enter') return progress;
 if (step.kind === 'exit') return 1 - progress;
 return step.kind === 'breathe' || step.kind === 'end' ? 1 : 0;
}
// The first step of the pose before or after the current one, for the back and next buttons.
export function jump(steps, at, delta) {
 const here = steps[at];
 if (!here) return 0;
 const target = here.index + delta;
 if (target < 0) return 0;
 const found = steps.findIndex(step => step.index === target && step.kind === 'announce');
 return found < 0 ? (delta > 0 ? steps.length - 1 : 0) : found;
}

// --- Saved on this computer -------------------------------------------------------
function read(storage, key, fallback) {
 try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function write(storage, key, value) {
 try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function savedList(storage) {
 const list = read(storage, KEY, []);
 return Array.isArray(list) ? list.filter(item => item && typeof item.code === 'string' && decode(item.code)) : [];
}
export function save(storage, ids, now = new Date()) {
 const code = encode(ids);
 if (!code) return savedList(storage);
 const list = [{code, t: now.toISOString()}, ...savedList(storage).filter(item => item.code !== code)].slice(0, SAVED_LIMIT);
 write(storage, KEY, list);
 return list;
}
export function forget(storage, code) {
 const list = savedList(storage).filter(item => item.code !== code);
 write(storage, KEY, list);
 return list;
}
export const loadDraft = storage => decode(read(storage, DRAFT, '')) ?? [];
export const saveDraft = (storage, ids) => write(storage, DRAFT, encode(ids));
export function loadSettings(storage) {
 const saved = read(storage, SETTINGS, {});
 return {beat: [3, 4, 5].includes(saved?.beat) ? saved.beat : 4, chair: saved?.chair === true};
}
export const saveSettings = (storage, settings) => write(storage, SETTINGS, settings);

export const ALL = POSES.map(pose => pose.id);
