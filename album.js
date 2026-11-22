// El Álbum del Pabellón: the stickers each pupil collects. A sticker of a place or a game is also the quick
// way in; an empty slot shows the silhouette and a clue from Robles. Nothing is random: every sticker comes
// from one action, always the same, and the clue says which. Design: docs/12-descubrimiento.md.
//
// What was already played sticks its stickers by itself (it is read from the record). The album is also kept
// apart, per player, in `pabellon-album`, because the record of a computer drops its oldest entries.
import {entries, player, studentId, record, mode} from './registro.js';
import {CON_CROMO} from './vestuario/neceser-banco.js';
import {PINTADOS as ARTE_VESTUARIO} from './vestuario/assets/pintados.js';

const KEY = 'pabellon-album';

export const PAGINAS = [
 {id: 'lugares', titulo: 'Lugares y juegos', en: 'Places and games'},
 {id: 'material', titulo: 'El material', en: 'PE kit'},
 {id: 'neceser', titulo: 'El neceser', en: 'Wash bag'},
];

// Games with mastery stamps: one per level, 1 to 3.
export const SELLOS = [
 {n: 1, nombre: 'La zapatilla', en: 'Trainer'},
 {n: 2, nombre: 'El silbato', en: 'Whistle'},
 {n: 3, nombre: 'La naranja', en: 'Orange'},
];

// `arte` is a path from the root of the site; `pintado` names the piece in vestuario/assets/pintados.js
// when the sticker waits for art that is still being painted. `href` makes the sticker a way in.
const lugar = (id, nombre, en, arte, href, pista, dorso) => ({id, pagina: 'lugares', nombre, en, arte: `assets/${arte}.webp`, href, pista, dorso});
const material = (id, nombre, en, prop, pista, dorso) => ({id, pagina: 'material', nombre, en, arte: `gimnasio/assets/prop-${prop}.webp`, pista, dorso});
export const CROMOS = [
 lugar('vestuario', 'El Vestuario', 'Changing room', 'door-vestuario', 'vestuario/', 'Entra en El Vestuario.', 'Tu taquilla, tu álbum y el banco del neceser.'),
 lugar('gimnasio', 'El Gimnasio', 'The gym', 'door-gimnasio', 'gimnasio/', 'El cuarto de material es un desastre. ¿Me echas una mano en El Gimnasio?', 'Equipment Rescue: ordena el cuarto de material con el profe.'),
 lugar('pista', 'La Pista', 'The court', 'door-mate', 'mate/', 'Juega un partido de mate en La Pista, aunque sea de entrenamiento.', 'Mate Arena: balón prisionero con habilidades.'),
 lugar('pizarra', 'La Pizarra', 'The board', 'door-pizarra', 'pizarra/', 'Termina un rosco en La Pizarra.', 'El rosco de Educación Física: cada acierto, un reto de movimiento.'),
 lugar('tatami', 'El Tatami', 'Yoga mats', 'door-tatami', 'tatami/', 'Abre la ficha de una postura en El Tatami.', 'Yoga: posturas y secuencias, de pie o en silla.'),
 {id: 'juego-neceser', pagina: 'lugares', nombre: 'El Neceser', en: 'What’s in my wash bag?', arte: 'vestuario/assets/neceser-abierto.webp', pintado: 'neceser-abierto', href: 'vestuario/#neceser', juego: 'neceser',
  pista: 'Ayúdame a preparar la bolsa de aseo. Está en el banco del vestuario.', dorso: 'Prepara la bolsa de aseo para después de Educación Física.'},
 material('cono', 'El cono', 'cone', 'cone', 'Está en el cuarto de material, con el aro y la cuerda.', 'Marca sitios en la pista. Se apila en su soporte.'),
 material('aro', 'El aro', 'hoop', 'hoop', 'Está en el cuarto de material. Se cuelga, no se pisa.', 'Para saltar dentro, rodarlo o lanzar. Se cuelga en su soporte.'),
 material('cuerda', 'La cuerda', 'skipping rope', 'rope', 'Está en el cuarto de material, hecha un lío.', 'Para saltar a la comba. Recogida, no se enreda.'),
 material('raqueta', 'La raqueta', 'racket', 'racket', 'Termina de ordenar el cuarto de material.', 'Antes de mover la raqueta, mira que no haya nadie cerca.'),
 material('peto', 'El peto', 'bib', 'bib', 'Termina de ordenar el cuarto de material.', 'Para saber quién va con quién. Se dobla y se guarda.'),
 material('pelota', 'La pelota blanda', 'soft ball', 'softball', 'Prepara el carro con el pedido del profe.', 'Blanda y ligera: la que se usa para lanzar a alguien.'),
 material('colchoneta', 'La colchoneta', 'mat', 'mat', 'Deja el gimnasio seguro para la clase.', 'Se lleva entre dos y no se arrastra.'),
 ...CON_CROMO.map(o => ({id: o.id, pagina: 'neceser', nombre: o.es, en: o.en, arte: `vestuario/assets/${o.id}.webp`, pintado: 'neceser-' + o.id,
  pista: o.dias ? 'Sale en «Depende del día». Cada día necesita una cosa distinta.' : o.nivel2 ? 'Sale en «Depende del día».' : 'Prepara la bolsa de aseo en el banco del vestuario.', dorso: o.si})),
];
export const cromo = id => CROMOS.find(c => c.id === id);
// The painted picture of a sticker, or null while it is still being painted (the page then draws a card).
export const arteDe = c => !c.pintado || ARTE_VESTUARIO.includes(c.pintado) ? c.arte : null;

// --- From the record to stickers ----------------------------------------------------------------
// Pure: the stickers and stamps that a list of entries of one player has earned.
export function ganados(lista) {
 const cromos = new Set(), sellos = {};
 const dar = (...ids) => ids.forEach(id => cromos.add(id));
 for (const e of lista) {
  const d = e.data || {};
  if (e.place === 'album' && e.event === 'pegado' && cromo(d.id)) dar(d.id);
  if (e.place === 'vestuario') dar('vestuario');
  if (e.activity === 'equipment-rescue') {
   const fase = Number(d.fase) || 0;
   dar('gimnasio');
   if (fase >= 1) dar('aro', 'cono', 'cuerda');
   if (fase >= 3) dar('raqueta', 'peto');
   if (fase >= 4) dar('pelota');
   if (fase >= 5 || e.event === 'completada') dar('colchoneta');
  }
  if (e.activity === 'mate' && e.event === 'partido') dar('pista');
  if (e.activity === 'rosco' && e.event === 'partida') dar('pizarra');
  if (e.activity === 'yoga') dar('tatami');
  if (e.activity === 'neceser' && e.event === 'nivel') {
   const n = Number(d.nivel);
   dar('juego-neceser');
   if ([1, 2, 3].includes(n)) (sellos.neceser ||= new Set()).add(n);
  }
 }
 return {cromos, sellos};
}

// --- Stored album --------------------------------------------------------------------------------
// {[student id]: {desde, cromos: {id: {t, visto}}, sellos: {juego: [n]}}}. `desde` is set when the teacher
// resets an album: what was played before it no longer sticks anything.
function leer() {
 try { const all = JSON.parse(localStorage.getItem(KEY)); return all && typeof all === 'object' && !Array.isArray(all) ? all : {}; } catch { return {}; }
}
function escribir(all) {
 try { localStorage.setItem(KEY, JSON.stringify(all)); return true; } catch { return false; }
}
const vacio = () => ({desde: null, cromos: {}, sellos: {}});
function limpio(a) {
 if (!a || typeof a !== 'object') return vacio();
 const cromos = {}, sellos = {};
 for (const [id, c] of Object.entries(a.cromos || {})) if (cromo(id) && c && typeof c.t === 'string') cromos[id] = {t: c.t, visto: !!c.visto};
 for (const [juego, lista] of Object.entries(a.sellos || {})) if (Array.isArray(lista)) sellos[juego] = lista.filter(n => [1, 2, 3].includes(n));
 return {desde: typeof a.desde === 'string' ? a.desde : null, cromos, sellos};
}
const quien = () => (mode() === 'pantalla' ? null : player());

// Brings the stored album of a player up to date with the record and returns it. The pupil sees the
// stickers that have just appeared (`visto: false`) as new.
export function album(sid = quien() && studentId(quien()), lista = entries(), now = new Date()) {
 if (!sid) return null;
 const all = leer(), a = limpio(all[sid]);
 const mias = lista.filter(e => e.sid === sid && (!a.desde || e.t > a.desde));
 const {cromos, sellos} = ganados(mias);
 let cambio = !all[sid];
 for (const id of cromos) if (!a.cromos[id]) { a.cromos[id] = {t: now.toISOString(), visto: false}; cambio = true; }
 for (const [juego, set] of Object.entries(sellos)) {
  const antes = new Set(a.sellos[juego] || []);
  for (const n of set) if (!antes.has(n)) { antes.add(n); cambio = true; }
  a.sellos[juego] = [...antes].sort();
 }
 if (cambio) { all[sid] = a; escribir(all); }
 return a;
}
export const tiene = (a, id) => !!a?.cromos[id];
export const nuevos = a => Object.entries(a?.cromos || {}).filter(([, c]) => !c.visto).map(([id]) => id);
export const sellosDe = (a, juego) => a?.sellos[juego] || [];
export function cuenta(a, pagina) {
 const lista = CROMOS.filter(c => c.pagina === pagina);
 return {tiene: lista.filter(c => tiene(a, c.id)).length, de: lista.length};
}

// Sticks a sticker for the player who is playing now. It is also written in the record, so that it travels
// to the teacher's sheet and comes back with «Recuperar mi progreso». Returns true if it is new.
export function pegar(id, now = new Date()) {
 const current = quien();
 if (!current || !cromo(id)) return false;
 const sid = studentId(current), all = leer(), a = limpio(all[sid]);
 if (a.cromos[id]) return false;
 record('album', 'cromo', 'pegado', {id}, now);
 a.cromos[id] = {t: now.toISOString(), visto: false};
 all[sid] = a;
 escribir(all);
 return true;
}
export function marcarVistos(ids, sid = quien() && studentId(quien())) {
 if (!sid) return;
 const all = leer(), a = limpio(all[sid]);
 for (const id of ids) if (a.cromos[id]) a.cromos[id].visto = true;
 all[sid] = a;
 escribir(all);
}

// --- Teacher's desk ------------------------------------------------------------------------------
export function albumes() {
 return Object.entries(leer()).map(([sid, a]) => {
  const limpia = limpio(a), ultimo = Object.values(limpia.cromos).map(c => c.t).sort().pop() || limpia.desde || '';
  return {sid, paginas: PAGINAS.map(p => ({...p, ...cuenta(limpia, p.id)})), sellos: limpia.sellos, ultimo};
 }).sort((x, y) => x.sid.localeCompare(y.sid, 'es', {numeric: true}));
}
// Empties the album of a player. What was played before stops counting; the record is not touched.
export function reiniciar(sid, now = new Date()) {
 const all = leer();
 all[sid] = {...vacio(), desde: now.toISOString()};
 escribir(all);
}
export function reiniciarTodos(now = new Date()) {
 const all = leer();
 for (const sid of Object.keys(all)) all[sid] = {...vacio(), desde: now.toISOString()};
 escribir(all);
}
