// El Neceser: the rules of the game, without the page. Rounds, where each object goes, the routine
// after class and the class-screen version. Every function returns a new round and never changes the old one.
import {OBJETOS, objeto, DIAS, RUTINA, PREGUNTAS} from './neceser-banco.js';

export const NIVELES = [
 {n: 1, titulo: 'La bolsa de hoy', en: 'Today’s bag', texto: 'Mete en el neceser lo que hace falta después de Educación Física. Lo que no, se queda en casa.'},
 {n: 2, titulo: 'Depende del día', en: 'It depends on the day', texto: 'Lee la nota del corcho: según el día, unas cosas van y otras no. Lo que no es de aseo, a la mochila.'},
 {n: 3, titulo: 'La rutina', en: 'After PE', texto: 'Al terminar la clase, ¿qué va primero? Ordena los pasos.'},
];
export const DESTINOS = {
 neceser: {es: 'Al neceser', en: 'In the wash bag'},
 mochila: {es: 'A la mochila', en: 'In the backpack'},
 fuera: {es: 'Se queda en casa', en: 'Leave it at home'},
};

// A small seeded generator, so that tests (and a repeated round) can be the same.
export function seeded(seed) {
 let a = seed >>> 0;
 return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function barajar(list, random = Math.random) {
 const out = [...list];
 for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
 return out;
}

// Where an object goes in a level and, in level 2, on a given day.
export function destino(obj, nivel, dia) {
 if (obj.intruso) return 'fuera';
 if (nivel >= 2 && obj.dias && !obj.dias.includes(dia)) return 'fuera';
 return obj.donde;
}
export function destinos(nivel) {
 return nivel === 1 ? ['neceser', 'fuera'] : ['neceser', 'mochila', 'fuera'];
}

// The day of level 2: first the days that still give a sticker the player lacks, so that playing again finds new ones.
export function eligeDia(faltan = new Set(), random = Math.random) {
 const utiles = DIAS.filter(d => OBJETOS.some(o => o.dias?.includes(d.id) && faltan.has(o.id)));
 const lista = utiles.length ? utiles : DIAS;
 return lista[Math.floor(random() * lista.length)].id;
}

export function ronda(nivel, {random = Math.random, dia, faltan} = {}) {
 const base = OBJETOS.filter(o => o.base);
 let lista;
 if (nivel === 1) lista = [...base, ...OBJETOS.filter(o => o.intruso === 1)];
 else {
  dia ||= eligeDia(faltan, random);
  const delDia = OBJETOS.filter(o => o.dias?.includes(dia));
  // Things of other days that are not needed today: the reason is the day, not the object.
  const otros = barajar(OBJETOS.filter(o => o.dias && !o.dias.includes(dia)), random).slice(0, 2);
  const intrusos = barajar(OBJETOS.filter(o => o.intruso === 2), random).slice(0, 2);
  lista = [...barajar(base, random).slice(0, 4), ...OBJETOS.filter(o => o.nivel2), ...delDia, ...otros, ...intrusos];
 }
 return {nivel, dia: nivel === 1 ? null : dia, objetos: barajar(lista.map(o => o.id), random), puestos: {}, fallos: 0};
}

// Puts an object somewhere. A wrong place sends it back to the bench with a reason; nothing is lost.
export function poner(r, id, donde) {
 const obj = objeto(id);
 if (!obj || !r.objetos.includes(id) || r.puestos[id]) return {r, ok: false, texto: ''};
 const bien = destino(obj, r.nivel, r.dia);
 if (bien === donde) {
  const texto = bien === 'fuera' ? (obj.intruso ? obj.por : obj.hoyNo) : obj.si;
  return {r: {...r, puestos: {...r.puestos, [id]: donde}}, ok: true, texto};
 }
 const texto = bien === 'fuera' ? (obj.intruso ? obj.por : obj.hoyNo) : obj.por;
 return {r: {...r, fallos: r.fallos + 1}, ok: false, texto};
}
export const hecha = r => r.objetos.every(id => r.puestos[id]);
// What was packed right in this round: each one is a sticker of the album.
export const guardados = r => Object.entries(r.puestos).filter(([, donde]) => donde !== 'fuera').map(([id]) => id);

// Level 3: the routine after class.
export function rutina(random = Math.random) {
 return {nivel: 3, orden: barajar(RUTINA.map(p => p.id), random), hechos: [], fallos: 0};
}
export function elegir(r, id) {
 const siguiente = RUTINA[r.hechos.length];
 if (!siguiente || r.hechos.includes(id)) return {r, ok: false, texto: ''};
 if (siguiente.id === id) return {r: {...r, hechos: [...r.hechos, id]}, ok: true, texto: ''};
 return {r: {...r, fallos: r.fallos + 1}, ok: false, texto: RUTINA.find(p => p.id === id).antes};
}
export const rutinaHecha = r => r.hechos.length === RUTINA.length;

// Two questions after each level, different from the last ones if possible.
export function preguntas(random = Math.random, n = 2, evitar = []) {
 const libres = PREGUNTAS.map((_, i) => i).filter(i => !evitar.includes(i));
 return barajar(libres.length >= n ? libres : PREGUNTAS.map((_, i) => i), random).slice(0, n);
}

// What the record keeps of a finished level: numbers and short words only.
export function resultado(r, bien, de) {
 const data = {nivel: r.nivel, aciertos: r.nivel === 3 ? RUTINA.length : r.objetos.length, fallos: r.fallos, preguntas: bien, de};
 if (r.dia) data.dia = r.dia;
 return data;
}

// Class screen: «¿Va en el neceser?», answered with the body. Half go, half do not.
export function rondaClase(random = Math.random, n = 10) {
 const si = barajar(OBJETOS.filter(o => o.base || o.nivel2), random).slice(0, Math.ceil(n / 2));
 const no = barajar(OBJETOS.filter(o => o.intruso || o.donde === 'mochila'), random).slice(0, Math.floor(n / 2));
 return barajar([...si.map(o => ({id: o.id, va: true})), ...no.map(o => ({id: o.id, va: false}))], random);
}
