// Who is playing on this device and what they have done. Nothing here leaves the browser.
// A player is a class and a list number plus one of the eight characters: never a name.
import {REGISTRO_URL} from './config.js';

const PLAYER = 'pabellon-jugador', LOG = 'pabellon-registro', MODE = 'pabellon-modo', LIMIT = 800;
export const COURSES = [1, 2, 3, 4, 5, 6], GROUPS = ['A', 'B', 'C', 'D'], LAST_NUMBER = 35;
export const AVATARS = ['Vega', 'Kai', 'Lúa', 'Neo', 'Ada', 'Max', 'Nora', 'Leo'];

function read(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function write(key, value) {
 try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export function validPlayer(p) {
 return !!p && COURSES.includes(p.course) && GROUPS.includes(p.group)
  && Number.isInteger(p.number) && p.number >= 1 && p.number <= LAST_NUMBER
  && Number.isInteger(p.avatar) && p.avatar >= 0 && p.avatar < AVATARS.length;
}
export const playerCode = p => `${p.course}${p.group}-${String(p.number).padStart(2, '0')}`;

export function player() {
 const saved = read(PLAYER, null);
 return validPlayer(saved) ? saved : null;
}
export function setPlayer(next) {
 if (!validPlayer(next)) return false;
 const {course, group, number, avatar} = next;
 write(PLAYER, {course, group, number, avatar});
 // The same character walks the gym and steps onto the court.
 try { localStorage.setItem('gym-avatar', String(avatar)); localStorage.setItem('mate-character', String(avatar)); } catch {}
 return true;
}
export function leave() {
 try { localStorage.removeItem(PLAYER); } catch {}
}

// The shared screen of the class plays as a group, not as the pupil who used the computer last.
export function setMode(mode) {
 try { if (mode) sessionStorage.setItem(MODE, mode); else sessionStorage.removeItem(MODE); } catch {}
}
export function mode() {
 try { return sessionStorage.getItem(MODE); } catch { return null; }
}

function validEntry(e) {
 return !!e && typeof e.t === 'string' && (e.who === null || typeof e.who === 'string')
  && [e.place, e.activity, e.event].every(text => typeof text === 'string') && !!e.data && typeof e.data === 'object';
}
export function entries() {
 const list = read(LOG, []);
 return Array.isArray(list) ? list.filter(validEntry) : [];
}
export function record(place, activity, event, data = {}, now = new Date()) {
 const current = mode() === 'pantalla' ? null : player();
 const id = now.getTime().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
 const entry = {id, t: now.toISOString(), who: current ? playerCode(current) : null, place, activity, event, data, sent: false};
 write(LOG, [...entries(), entry].slice(-LIMIT));
 sync();
 return entry;
}
// Send what has not been sent yet to the teacher's sheet. Entries keep their id, so a batch
// that is sent twice after a bad connection is only written once on the other side.
export const pending = () => entries().filter(entry => !entry.sent).length;
export async function sync(send = globalThis.fetch, url = REGISTRO_URL) {
 if (!url || !send) return {sent: 0, off: true};
 const batch = entries().filter(entry => !entry.sent).slice(0, 100);
 if (!batch.length) return {sent: 0};
 try {
  const response = await send(url, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, keepalive: true,
   body: JSON.stringify({v: 1, entries: batch.map(({sent, ...entry}) => entry)})});
  if (!(await response.json())?.ok) throw new Error('not accepted');
  const done = new Set(batch.map(entry => entry.id));
  write(LOG, entries().map(entry => done.has(entry.id) ? {...entry, sent: true} : entry));
  return {sent: batch.length};
 } catch {
  return {sent: 0, failed: batch.length};
 }
}
export function clearEntries() {
 try { localStorage.removeItem(LOG); } catch {}
}

// One line per player for the teacher's desk and the pupil's locker.
export function summary(list = entries()) {
 const rows = new Map();
 for (const entry of list) {
  const who = entry.who || 'Pantalla de clase';
  const row = rows.get(who) || {who, last: entry.t, gymPhase: 0, gymDone: false, matches: 0, wins: 0, bestPoints: 0, challenges: 0};
  if (entry.t > row.last) row.last = entry.t;
  if (entry.activity === 'equipment-rescue') {
   row.gymPhase = Math.max(row.gymPhase, Number(entry.data.fase) || 0);
   if (entry.event === 'completada') row.gymDone = true;
  }
  if (entry.activity === 'mate' && entry.event === 'partido') {
   row.matches++;
   if (entry.data.resultado === 'victoria') row.wins++;
   row.bestPoints = Math.max(row.bestPoints, Number(entry.data.puntos) || 0);
  }
  if (entry.activity === 'ruleta' && entry.event === 'reto') row.challenges++;
  rows.set(who, row);
 }
 return [...rows.values()].sort((a, b) => a.who.localeCompare(b.who, 'es', {numeric: true}));
}

const cell = value => /[",;\n]/.test(String(value)) ? '"' + String(value).replace(/"/g, '""') + '"' : String(value);
export function toSheet(list = entries()) {
 const lines = [['fecha', 'jugador', 'lugar', 'actividad', 'evento', 'datos']];
 for (const e of list) lines.push([e.t, e.who || 'pantalla', e.place, e.activity, e.event, Object.entries(e.data).map(([k, v]) => `${k}=${v}`).join(' ')]);
 return lines.map(line => line.map(cell).join(';')).join('\n');
}
