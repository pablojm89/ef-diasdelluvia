// Who is playing on this device, what they have done, and how that reaches the teacher's sheet.
// A player is a class and a list number, or an alias handed out by the teacher, plus one of the eight
// characters: never a name. Nothing leaves the browser until the teacher connects a sheet in the desk.
// The sheet protocol (v2) and the shared `aula-` keys are written down in intercambio/CONTRATO.md.
import {notasDe} from './notas.js';

const PLAYER = 'pabellon-jugador', LOG = 'pabellon-registro', MODE = 'pabellon-modo', LIMIT = 800;
const STATE = 'pabellon-nube-estado', LAST = 'pabellon-nube-ultimo', GEN = 'pabellon-nube-gen', DROPPED = 'pabellon-nube-descartadas';
const ENTRY = 'pabellon-entrada';
// Shared with multiplicopolis (same origin on GitHub Pages): see intercambio/CONTRATO.md.
export const SHARED = {nube: 'aula-nube', lupa: 'lalupa-ajustes', clase: ['aula-clase', 'lalupa-clase']};
export const APP = 'pabellon', VERSION = 2;
export const COURSES = [1, 2, 3, 4, 5, 6], GROUPS = ['A', 'B', 'C', 'D'], LAST_NUMBER = 35;
export const AVATARS = ['Vega', 'Kai', 'Lúa', 'Neo', 'Ada', 'Max', 'Nora', 'Leo'];
const BATCH = {items: 40, chars: 300000, entries: 100};

function read(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function write(key, value) {
 try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
const isObject = v => !!v && typeof v === 'object' && !Array.isArray(v);

// --- Identity -------------------------------------------------------------------
// The same normalisation as La Lupa (normAlias in nube.js, normAlias_ in the .gs): the student id.
export const normAlias = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC')
 .replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 40).replace(/^-+|-+$/g, '');

const validAvatar = a => Number.isInteger(a) && a >= 0 && a < AVATARS.length;
export function validPlayer(p) {
 if (!p || !COURSES.includes(p.course) || !validAvatar(p.avatar)) return false;
 if (p.alias !== undefined) return typeof p.alias === 'string' && p.alias.length <= 40 && !!normAlias(p.alias);
 return GROUPS.includes(p.group) && Number.isInteger(p.number) && p.number >= 1 && p.number <= LAST_NUMBER;
}
export const playerCode = p => p.alias ?? `${p.course}${p.group}-${String(p.number).padStart(2, '0')}`;
export const studentId = p => normAlias(playerCode(p));

export function player() {
 const saved = read(PLAYER, null);
 return validPlayer(saved) ? saved : null;
}
export function setPlayer(next) {
 if (!validPlayer(next)) return false;
 const {course, group, number, avatar, alias} = next;
 write(PLAYER, alias !== undefined ? {course, alias: alias.trim(), avatar} : {course, group, number, avatar});
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

// --- Record -----------------------------------------------------------------------
const SCREEN = 'pantalla';
// Entries written before the sheet existed have no student id: it is the list code itself.
function withId(e) {
 if (typeof e.sid === 'string') return e;
 const course = /^([1-6])[A-D]-\d{2}$/.exec(e.who || '');
 return {...e, sid: e.who ? normAlias(e.who) : SCREEN, curso: course ? course[1] : ''};
}
function validEntry(e) {
 return !!e && typeof e.id === 'string' && typeof e.t === 'string' && (e.who === null || typeof e.who === 'string')
  && [e.place, e.activity, e.event].every(text => typeof text === 'string') && isObject(e.data);
}
export function entries() {
 const list = read(LOG, []);
 return Array.isArray(list) ? list.filter(validEntry).map(withId) : [];
}
// Keeps the record under its limit, dropping what is already in the sheet first.
function store(list) {
 let extra = list.length - LIMIT;
 if (extra > 0) {
  const drop = new Set();
  for (const e of list) if (drop.size < extra && e.sent) drop.add(e);
  for (const e of list) if (drop.size < extra && !drop.has(e)) { drop.add(e); write(DROPPED, (Number(read(DROPPED, 0)) || 0) + 1); }
  list = list.filter(e => !drop.has(e));
 }
 return write(LOG, list);
}
export function record(place, activity, event, data = {}, now = new Date()) {
 const current = mode() === SCREEN ? null : player();
 const id = now.getTime().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
 const entry = {id, t: now.toISOString(), who: current ? playerCode(current) : null, sid: current ? studentId(current) : SCREEN,
  curso: current ? String(current.course) : '', place, activity, event, data, sent: false};
 store([...entries(), entry]);
 soon(300);
 return entry;
}
export function clearEntries() {
 try { localStorage.removeItem(LOG); localStorage.removeItem(DROPPED); } catch {}
}

// One line per player for the teacher's desk and the pupil's locker.
export function summary(list = entries()) {
 const rows = new Map();
 for (const entry of list) {
  const who = entry.who || 'Pantalla de clase';
  const row = rows.get(who) || {who, sid: entry.sid, last: entry.t, gymPhase: 0, gymDone: false, matches: 0, wins: 0, bestPoints: 0, challenges: 0, poses: [], sequences: 0, practices: 0, roscos: 0, bestRosco: 0, boards: 0, bingos: 0, curiosities: [], firstAid: 0, marks: []};
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
  if (entry.activity === 'yoga') {
   if (entry.event === 'postura' && entry.data.id && !row.poses.includes(entry.data.id)) row.poses.push(entry.data.id);
   if (entry.event === 'secuencia-creada') row.sequences++;
   if (entry.event === 'secuencia-practicada') row.practices++;
  }
  if (entry.activity === 'rosco' && entry.event === 'partida') {
   row.roscos++;
   row.bestRosco = Math.max(row.bestRosco, Number(entry.data.aciertos) || 0);
  }
  if (entry.activity === 'oca' && entry.event === 'partida') row.boards++;
  if (entry.activity === 'bingo') row.bingos++;
  if (entry.place === 'botiquin' && entry.activity === 'pas' && entry.event === 'caso') row.firstAid++;
  if (entry.activity === 'curiosidades' && entry.event === 'descubre' && entry.data.id && !row.curiosities.includes(entry.data.id)) row.curiosities.push(entry.data.id);
  for (const mark of notasDe(entry, entry.curso)?.notas || []) row.marks.push(mark);
  rows.set(who, row);
 }
 return [...rows.values()].sort((a, b) => a.who.localeCompare(b.who, 'es', {numeric: true}));
}

const cell = value => /[",;\n]/.test(String(value)) ? '"' + String(value).replace(/"/g, '""') + '"' : String(value);
export function toSheet(list = entries()) {
 const lines = [['fecha', 'jugador', 'lugar', 'actividad', 'evento', 'datos']];
 for (const e of list) lines.push([e.t, e.who || 'pantalla', e.place, e.activity, e.event, Object.entries(e.data).map(([k, v]) => `${k}=${v}`).join(' ')]);
 // A leading = + - @ would be read as a formula by a spreadsheet.
 return lines.map(line => line.map(v => cell(/^[=+\-@]/.test(String(v)) ? "'" + v : v)).join(';')).join('\n');
}

// --- Who enters with an alias: the class package of La Lupa ---------------------------
// The teacher imports it in La Lupa (IndexedDB `lalupa-clase`, store `paquete`, key `actual`); the shared
// name for the future is `aula-clase`. It never leaves the device. Opening must not create the database,
// or La Lupa would later find it without its store.
function openExisting(name) {
 return new Promise(resolve => {
  let request;
  try { request = indexedDB.open(name); } catch { resolve(null); return; }
  request.onupgradeneeded = () => request.transaction.abort();
  request.onerror = () => resolve(null);
  request.onblocked = () => resolve(null);
  request.onsuccess = () => resolve(request.result);
 });
}
async function readPackage(name) {
 const db = await openExisting(name);
 if (!db) return null;
 try {
  if (!db.objectStoreNames.contains('paquete')) return null;
  return await new Promise(resolve => {
   const get = db.transaction('paquete', 'readonly').objectStore('paquete').get('actual');
   get.onsuccess = () => resolve(get.result ?? null);
   get.onerror = () => resolve(null);
  });
 } catch { return null; } finally { db.close(); }
}
const SAFE_IMAGE = /^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/;
export function validPackage(p) {
 if (!isObject(p) || p.tipo !== 'lalupa-clase' || !Array.isArray(p.alumnos) || !p.alumnos.length) return null;
 const course = Number(p.curso), seen = new Set(), alumnos = [];
 if (!COURSES.includes(course)) return null;
 for (const a of p.alumnos) {
  const alias = typeof a?.alias === 'string' ? a.alias.trim().slice(0, 40) : '', id = normAlias(alias);
  if (!id || seen.has(id)) return null;
  seen.add(id);
  alumnos.push({alias, avatar: SAFE_IMAGE.test(a.avatar || '') ? a.avatar : null});
 }
 return {clase: String(p.clase || '').slice(0, 30), course, alumnos};
}
export async function classPackage() {
 if (typeof indexedDB === 'undefined') return null;
 for (const name of SHARED.clase) {
  const found = validPackage(await readPackage(name));
  if (found) return found;
 }
 return null;
}
// Whether pupils enter by picking their alias from the package (the teacher decides in the desk).
export const aliasEntry = () => read(ENTRY, null) === 'alias';
export const setAliasEntry = on => write(ENTRY, on ? 'alias' : 'lista');

// --- Connection to the teacher's sheet ---------------------------------------------
export const validUrl = url => /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url);
const cleanCode = code => String(code ?? '').trim().slice(0, 20);
function shape(v, codeKey) {
 if (!isObject(v)) return null;
 const url = String(v.url ?? '').trim(), classCode = cleanCode(v[codeKey]);
 return validUrl(url) && classCode ? {url, classCode} : null;
}
// The connection this device uses: the shared key, written by whichever project was set up last.
export const connection = () => shape(read(SHARED.nube, null), 'classCode');
// La Lupa keeps its own in `lalupa-ajustes` → nube: {url, aula}. The desk offers to reuse it.
export const lupaConnection = () => shape(read(SHARED.lupa, null)?.nube, 'aula');
export function setConnection({url, classCode} = {}) {
 const next = shape({url, classCode}, 'classCode');
 if (!next) return {ok: false, motivo: !validUrl(String(url ?? '').trim()) ? 'La dirección tiene que ser la de una aplicación web de Apps Script: https://script.google.com/macros/s/…/exec' : 'Falta el código de aula.'};
 const before = connection();
 write(SHARED.nube, {v: 1, ...next, app: APP, fecha: new Date().toISOString()});
 // A new destination gets everything this device holds; the sheet does not duplicate what it already has.
 if (!before || before.url !== next.url || before.classCode.toUpperCase() !== next.classCode.toUpperCase()) { resendAll(); write(STATE, null); }
 return {ok: true};
}
export function forgetConnection() {
 try { localStorage.removeItem(SHARED.nube); localStorage.removeItem(STATE); } catch {}
}

// --- Sending: protocol v2, the same as La Lupa --------------------------------------
export const pending = () => entries().filter(entry => !entry.sent).length;
export function resendAll() {
 write(GEN, (Number(read(GEN, 0)) || 0) + 1);
 store(entries().map(entry => ({...entry, sent: false})));
 soon(300);
}
export const cloudState = () => ({pending: pending(), last: read(LAST, null), state: read(STATE, null), dropped: Number(read(DROPPED, 0)) || 0});

const evidence = ({id, t, place, activity, event, data}) => ({id, t, place, activity, event, data});
// The items of the next batch, oldest entries first, and the entries they carry.
export function batch(list = entries(), at = new Date().toISOString()) {
 const waiting = list.filter(entry => !entry.sent), groups = new Map(), grades = [], taken = [];
 let count = 0, size = 0;
 for (const entry of waiting) {
  if (taken.length >= BATCH.entries) break;
  const group = groups.get(entry.sid), grade = entry.sid !== SCREEN && notasDe(entry, entry.curso);
  const more = (group ? 0 : entry.sid === SCREEN ? 1 : 2) + (grade ? 1 : 0), weight = JSON.stringify(entry).length + (grade ? 600 : 0);
  if (taken.length && (count + more > BATCH.items || size + weight > BATCH.chars)) break;
  count += more; size += weight;
  if (!group) groups.set(entry.sid, {who: entry.who, curso: entry.curso, list: []});
  groups.get(entry.sid).list.push(entry);
  if (grade) grades.push({entry, grade});
  taken.push(entry.id);
 }
 const items = [];
 for (const [sid, group] of groups) if (sid !== SCREEN) items.push({id: `s-${sid}`, type: 'student', at, payload: {studentId: sid, alias: group.who, curso: group.curso}});
 for (const {entry, grade} of grades) items.push({id: `g-${entry.id}`, type: 'grade', at, payload: {
  resultId: `ef-${entry.id}`, studentId: entry.sid, alias: entry.who, curso: entry.curso, tipo: grade.rule.tipo, unidad: entry.activity,
  titulo: grade.rule.titulo, nivel: null, fecha: entry.t, libreta: null, diagnostico: false, notas: grade.notas}});
 for (const [sid, group] of groups) items.push({id: `p-${sid}-${group.list[0].id}`, type: 'progress', at, payload: {
  studentId: sid, alias: group.who || 'Pantalla de clase', curso: group.curso, updatedAt: at, snapshot: {registro: group.list.map(evidence)}}});
 return {items, ids: taken};
}

// POST text/plain without no-cors, so that the answer can be read: only { ok: true } counts as stored.
export async function post(items, send = globalThis.fetch, target = connection()) {
 const control = typeof AbortController === 'function' ? new AbortController() : null;
 const clock = control && setTimeout(() => control.abort(), 45000);
 try {
  const response = await send(target.url, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, redirect: 'follow', signal: control?.signal,
   body: JSON.stringify({app: APP, classCode: target.classCode, type: 'batch', items})});
  const text = await response.text();
  let answer = null;
  try { answer = JSON.parse(text); } catch {}
  if (isObject(answer) && answer.ok === true) return {ok: true, answer};
  if (isObject(answer)) return {ok: false, motivo: answer.error === 'ocupado' ? 'La hoja estaba ocupada; se reintenta sola.' : `La hoja ha contestado con un error (${String(answer.error || 'sin detalle').slice(0, 120)}).`};
  return {ok: false, motivo: `La hoja no ha contestado como se esperaba (código ${response.status}). Revisa que la implementación sea para «Cualquier usuario» y que la dirección acabe en /exec.`};
 } catch {
  return {ok: false, motivo: globalThis.navigator?.onLine === false ? 'No hay conexión.' : 'No se ha podido leer la respuesta de la hoja (sin conexión, dirección equivocada o el navegador no deja leerla).'};
 } finally { clearTimeout(clock); }
}

const NET = {busy: false, failures: 0, notBefore: 0, timer: null};
// Sends the next batch. Retries wait 1, 2, 4… minutes (at most 10) unless `now` is asked for.
export async function sync({now = false, send = globalThis.fetch, clock = Date.now} = {}) {
 const target = connection();
 if (!target || !send) return {ok: false, off: true};
 if (NET.busy) return {ok: false, busy: true};
 if (!now && clock() < NET.notBefore) return {ok: false, waiting: true};
 const gen = read(GEN, 0), {items, ids} = batch();
 if (!items.length) return {ok: true, sent: 0};
 NET.busy = true;
 let result;
 try { result = await post(items, send, target); } finally { NET.busy = false; }
 const at = new Date(clock()).toISOString();
 if (!result.ok) {
  NET.failures++;
  NET.notBefore = clock() + Math.min(600000, 30000 * 2 ** NET.failures);
  write(STATE, {ok: false, at, motivo: result.motivo});
  return result;
 }
 // Only what the sheet confirmed, and only if nobody asked to send everything again meanwhile.
 const done = new Set(ids), rejected = Array.isArray(result.answer.rechazados) ? result.answer.rechazados : [];
 if (read(GEN, 0) === gen) store(entries().map(entry => done.has(entry.id) ? {...entry, sent: true} : entry));
 NET.failures = 0; NET.notBefore = 0;
 write(LAST, at);
 write(STATE, {ok: true, at, rechazados: rejected.length, motivo: rejected.length ? String(rejected[0]?.error || '').slice(0, 120) : ''});
 if (pending()) soon(1500);
 return {ok: true, sent: ids.length, rechazados: rejected.length};
}
function soon(ms) {
 if (!globalThis.document || !connection()) return;
 clearTimeout(NET.timer);
 NET.timer = setTimeout(() => sync(), ms);
}

async function getJson(params, send, target) {
 const url = new URL(target.url);
 for (const [key, value] of Object.entries({app: APP, classCode: target.classCode, ...params})) url.searchParams.set(key, value);
 return (await send(url, {method: 'GET', redirect: 'follow'})).json();
}
// «Probar conexión»: the sheet must answer a GET and confirm an empty batch.
export async function testConnection(send = globalThis.fetch, target = connection()) {
 if (!target) return {ok: false, motivo: 'Primero guarda la dirección y el código de aula.'};
 try {
  const answer = await getJson({type: 'ping'}, send, target);
  if (!isObject(answer) || answer.ok !== true) return {ok: false, motivo: 'Contesta, pero no es el Apps Script de las notas del aula (revisa la dirección y que hayas pegado la última versión de aula.gs).'};
  if (!(Number(answer.version) >= VERSION) || !(answer.apps || []).includes(APP)) return {ok: false, motivo: 'El Apps Script no acepta todavía a El Pabellón: pega el código de backend/apps-script/aula.gs y publica una versión nueva.'};
 } catch { return {ok: false, motivo: 'No se puede leer de la hoja (sin conexión, dirección equivocada o la implementación no es para «Cualquier usuario»).'}; }
 const empty = await post([], send, target);
 return empty.ok ? {ok: true} : {ok: false, motivo: `Se puede leer, pero el envío no se confirma: ${empty.motivo}`};
}

// «Recuperar mi progreso»: what the sheet holds for this player joins the record of this device.
const ID = /^[\w-]{4,40}$/;
function fromCloud(x, current) {
 if (!isObject(x) || !ID.test(String(x.id ?? '')) || typeof x.t !== 'string' || Number.isNaN(Date.parse(x.t)) || !isObject(x.data)) return null;
 if (![x.place, x.activity, x.event].every(v => typeof v === 'string' && /^[\w-]{1,40}$/.test(v)) || JSON.stringify(x.data).length > 600) return null;
 const data = {};
 for (const [key, value] of Object.entries(x.data)) if (/^[\w-]{1,30}$/.test(key) && ['string', 'number', 'boolean'].includes(typeof value)) data[key] = typeof value === 'string' ? value.replace(/[<>]/g, '').slice(0, 60) : value;
 return {id: x.id, t: x.t, who: playerCode(current), sid: studentId(current), curso: String(current.course), place: x.place, activity: x.activity, event: x.event, data, sent: true};
}
export async function recover(current = player(), send = globalThis.fetch, target = connection()) {
 if (!current || !target) return {ok: false, motivo: 'La hoja de notas no está conectada en este ordenador.'};
 let answer;
 try { answer = await getJson({type: 'progress', studentId: studentId(current)}, send, target); }
 catch { return {ok: false, motivo: 'No se ha podido conectar con la hoja. Prueba más tarde.'}; }
 if (!isObject(answer) || answer.ok !== true) return {ok: false, motivo: answer?.error === 'no encontrado' ? 'En la hoja todavía no hay nada tuyo.' : 'La hoja ha contestado con un error. Avisa a tu profe.'};
 const list = entries(), known = new Set(list.map(entry => entry.id));
 const remote = Array.isArray(answer.progress?.snapshot?.registro) ? answer.progress.snapshot.registro : [];
 const added = remote.slice(-LIMIT).map(x => fromCloud(x, current)).filter(x => x && !known.has(x.id));
 if (added.length) store([...list, ...added].sort((a, b) => a.t.localeCompare(b.t)));
 return {ok: true, added: added.length, discarded: remote.length - added.length - remote.filter(x => known.has(x?.id)).length};
}

if (globalThis.document) {
 addEventListener('online', () => sync({now: true}));
 setInterval(() => sync(), 60000);
 if (connection() && pending()) setTimeout(() => sync(), 3000);
}
