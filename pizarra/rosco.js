// Pure rules of the rosco: no DOM, no storage. A game is a plain object that can be saved as JSON.
// Every function returns a new game and leaves the one it receives untouched.

export const PENDIENTE = 'pendiente', ACIERTO = 'acierto', FALLO = 'fallo', PASADA = 'pasada';

// Letters are compared without accents, but Ñ stays a letter of its own.
export function normalize(text) {
 return String(text).toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\u0001/g, 'Ñ');
}
export function fitsClue(entry, word) {
 const plain = normalize(word), letter = normalize(entry.letra);
 return entry.pista === 'empieza' ? plain.startsWith(letter) : plain.includes(letter);
}
export const clueText = entry => `${entry.pista === 'empieza' ? 'Empieza por' : 'Contiene la'} ${entry.letra}`;

// The answer and its two decoys, as given in the bank: the answer is always option 0.
export const options = entry => [entry.respuesta, ...entry.otras];

export function seeded(seed) {
 let a = seed >>> 0;
 return () => {
  a = (a + 0x6D2B79F5) >>> 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}
function shuffled(list, random) {
 const out = [...list];
 for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
 return out;
}

// teams: 0 for the whole class as one, or 2-4 teams that take turns to read.
export function createGame(bank, {teams = 0, random = Math.random} = {}) {
 const size = bank.entradas.length;
 return {
  rosco: bank.id, size, current: 0, round: 1, passes: 0, seconds: 0, done: false,
  status: Array(size).fill(PENDIENTE),
  order: bank.entradas.map(() => shuffled([0, 1, 2], random)),
  teams: Array(teams >= 2 ? Math.min(teams, 4) : 0).fill(0), turn: 0,
 };
}

export const open = status => status === PENDIENTE || status === PASADA;
// The next letter still to answer after `from`, going round the ring; -1 when none is left.
export function nextIndex(status, from) {
 for (let step = 1; step <= status.length; step++) {
  const index = (from + step) % status.length;
  if (open(status[index])) return index;
 }
 return -1;
}
function advance(game, status) {
 const next = nextIndex(status, game.current);
 const round = next !== -1 && next <= game.current ? game.round + 1 : game.round;
 const turn = game.teams.length ? (game.turn + 1) % game.teams.length : 0;
 return {...game, status, turn, round, current: next === -1 ? game.current : next, done: next === -1};
}

// Where the right answer sits among the three shown for a letter.
export const rightChoice = (game, index = game.current) => game.order[index].indexOf(0);
export const shownOptions = (game, entry, index = game.current) => game.order[index].map(i => options(entry)[i]);

export function answer(game, correct) {
 if (game.done) return game;
 const status = [...game.status];
 status[game.current] = correct ? ACIERTO : FALLO;
 const teams = correct && game.teams.length ? game.teams.map((score, i) => i === game.turn ? score + 1 : score) : game.teams;
 return advance({...game, teams}, status);
}
export const choose = (game, choice) => answer(game, choice === rightChoice(game));

export function pass(game) {
 if (game.done) return game;
 const status = [...game.status];
 status[game.current] = PASADA;
 // A passed letter is still open, so if it is the only one left it comes straight back.
 return advance({...game, passes: game.passes + 1}, status);
}

export const finish = game => ({...game, done: true});
export const tick = (game, seconds = 1) => game.done ? game : {...game, seconds: game.seconds + seconds};

export function counts(game) {
 const count = kind => game.status.filter(status => status === kind).length;
 return {aciertos: count(ACIERTO), fallos: count(FALLO), quedan: game.status.filter(open).length};
}
// What is recorded at the end. Letters failed or left unanswered go to the review list.
export function result(game, bank) {
 const {aciertos, fallos} = counts(game);
 const repasar = bank.entradas.filter((_, i) => game.status[i] !== ACIERTO).map(entry => entry.letra);
 return {rosco: game.rosco, aciertos, fallos, pasadas: game.passes, segundos: game.seconds, repasar};
}

export function validGame(game, bank) {
 return !!game && !!bank && game.rosco === bank.id && game.size === bank.entradas.length
  && Array.isArray(game.status) && game.status.length === game.size
  && Array.isArray(game.order) && game.order.length === game.size
  && game.order.every(order => Array.isArray(order) && [...order].sort().join() === '0,1,2')
  && Number.isInteger(game.current) && game.current >= 0 && game.current < game.size
  && Array.isArray(game.teams) && Number.isInteger(game.turn) && Number.isFinite(game.seconds);
}
