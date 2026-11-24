// La Sala de Espejos: the rules of its four class games, without any page. Expression and rhythm for the
// whole class at once, standing by the desk or seated. Why these four: docs/13-investigacion-contenidos.md.
import {MOVIMIENTOS} from '../aula/movimientos.js';

// --- Echo: body percussion ------------------------------------------------------------------
// One letter per beat. Seated, the stomp becomes a finger click.
export const GOLPES = {
 P: {es: 'Palmas', en: 'Clap'},
 C: {es: 'Pecho', en: 'Chest'},
 M: {es: 'Muslos', en: 'Thighs'},
 S: {es: 'Pisada', en: 'Stomp', sentada: {es: 'Chasquido', en: 'Click'}},
 _: {es: 'Silencio', en: 'Rest'},
};
// From easy to hard: first four beats, then eight. The screen plays one and the class echoes it.
export const PATRONES = ['P_P_', 'PPPP', 'PMPM', 'PPMM', 'PCPM', 'MMPS', 'PCMS', 'P_CS', 'PMPMPPS_', 'PCMSPPM_'];
export const golpe = (letra, sentada = false) => (sentada && GOLPES[letra]?.sentada) || GOLPES[letra];
export const tiempos = patron => [...patron];

// --- Statues with a rule that changes ---------------------------------------------------------
// Each colour means one thing, and the meaning changes from one phase to the next: that is the game.
export const ACCIONES = {
 mover: {es: '¡Muévete!', en: 'Move!'},
 estatua: {es: '¡Estatua!', en: 'Freeze!'},
 lento: {es: 'A cámara lenta', en: 'Slow motion'},
};
export const COLORES = {
 verde: {es: 'Verde', en: 'Green', tinta: '#2f8a57', forma: 'circulo'},
 rojo: {es: 'Rojo', en: 'Red', tinta: '#c9524a', forma: 'cuadrado'},
 azul: {es: 'Azul', en: 'Blue', tinta: '#3f6fa8', forma: 'triangulo'},
};
export const FASES = [
 {verde: 'mover', rojo: 'estatua'},
 {verde: 'estatua', rojo: 'mover'},
 {verde: 'mover', rojo: 'estatua', azul: 'lento'},
];
const SEGMENTOS = 6;
// A game: for each phase, its rule and the colours that will come up, never the same one twice in a row.
export function partida(azar = Math.random) {
 return FASES.map(regla => {
  const colores = Object.keys(regla), segmentos = [];
  let antes = null;
  // Every colour of the phase comes up at least once.
  const pendientes = [...colores];
  for (let i = 0; i < SEGMENTOS; i++) {
   const posibles = (pendientes.length && SEGMENTOS - i <= pendientes.length ? pendientes : colores).filter(color => color !== antes);
   const color = posibles[Math.floor(azar() * posibles.length)] ?? colores.find(other => other !== antes);
   const at = pendientes.indexOf(color);
   if (at >= 0) pendientes.splice(at, 1);
   segmentos.push({color, accion: regla[color], segundos: 3 + Math.floor(azar() * 4)});
   antes = color;
  }
  return {regla, segmentos};
 });
}

// --- Mime and choreography: the painted moves of the bingo are the deck --------------------------
export const BARAJA = MOVIMIENTOS.filter(move => move.zona !== 'calma');
// The next move to mime: none comes back until the deck has gone round.
export function siguienteMimica(vistos = [], azar = Math.random) {
 const quedan = BARAJA.filter(move => !vistos.includes(move.id));
 const de = quedan.length ? quedan : BARAJA;
 return de[Math.floor(azar() * de.length)];
}
export const FRASE = 4;      // moves in a choreography
export const CUENTAS = 2;    // counts each move lasts: four moves make the eight counts
// Three moves to choose from for the next place of the phrase, none of them already in it.
export function oferta(frase = [], azar = Math.random) {
 const libres = BARAJA.filter(move => !frase.includes(move.id)), elegidos = [];
 while (elegidos.length < 3 && libres.length) elegidos.push(libres.splice(Math.floor(azar() * libres.length), 1)[0]);
 return elegidos;
}
// Which move of the phrase is danced on a count (from 0), and whether it is its first count.
export function enCuenta(frase, cuenta) {
 const total = frase.length * CUENTAS, dentro = ((cuenta % total) + total) % total;
 return {indice: Math.floor(dentro / CUENTAS), entra: dentro % CUENTAS === 0, numero: dentro + 1};
}
