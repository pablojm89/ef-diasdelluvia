// Rules of the cooperative goose game. Pure: no DOM, no storage, no clock, no randomness of its own.
// One team rolls; every team does the challenge of the square at the same time. Nobody goes back,
// waits or misses a turn. The class wins when every team reaches the goal before the rounds run out.
import {families} from '../content.js';
import {eligibleChallenges} from '../engine.js';

// The six colours of the challenge wheel in Las Espalderas (hub.js), in the order of `families`.
export const FAMILY_COLOURS = {coordinacion: '#d9703a', equilibrio: '#2f7f78', ritmo: '#e2a63b', expresion: '#c9524a', cooperacion: '#4f8a4b', calma: '#3f6fa8'};
export const FAMILY_NAMES = families;

// Team pawns: a colour and a shape, so they can be told apart without relying on colour alone.
export const TEAMS = [
 {id: 'rojo', name: 'Rojo', colour: '#b8322a', shape: 'circle'},
 {id: 'amarillo', name: 'Amarillo', colour: '#f2c12e', shape: 'star'},
 {id: 'azul', name: 'Azul', colour: '#1f4e9c', shape: 'triangle'},
 {id: 'blanco', name: 'Blanco', colour: '#f7f1e3', shape: 'square'},
 {id: 'morado', name: 'Morado', colour: '#6e3f98', shape: 'diamond'},
 {id: 'negro', name: 'Negro', colour: '#2a2522', shape: 'heart'},
];
export const MIN_TEAMS = 2, MAX_TEAMS = TEAMS.length, ROUND_CHOICES = [6, 8, 10, 12];

// Centres of the 31 squares on a 1536 × 1024 board: a rounded rectangular spiral from the start
// (bottom left) to the goal near the middle. The painted board in arte/lotes/12-aula.json uses the same numbers.
export const BOARD = {width: 1536, height: 1024, tile: 144, goalTile: 176};
export const POINTS = [[150, 880], [150, 687], [150, 494], [150, 302], [232, 152], [425, 150], [617, 150], [810, 150], [1002, 150], [1195, 150],
 [1372, 195], [1386, 385], [1386, 578], [1386, 770], [1256, 874], [1063, 874], [871, 874], [678, 874], [486, 874], [341, 785],
 [340, 593], [347, 401], [513, 340], [706, 340], [898, 340], [1091, 340], [1196, 469], [1169, 656], [985, 684], [792, 684], [600, 684]];
export const GOAL = POINTS.length - 1;
export const GEESE = [5, 14, 23], BRIDGE = 10, BRIDGE_STEPS = 2, CALM = [8, 17, 26];

// Square by square: its family (the colour) and what is special about it. Calm squares are the blue ones.
const CYCLE = ['coordinacion', 'equilibrio', 'ritmo', 'expresion', 'cooperacion'];
export const TILES = POINTS.map((_, index) => {
 if (index === 0) return {family: null, special: 'salida'};
 if (index === GOAL) return {family: 'cooperacion', special: 'meta'};
 if (CALM.includes(index)) return {family: 'calma', special: 'calma'};
 const plain = index - CALM.filter(square => square < index).length - 1;
 return {family: CYCLE[plain % CYCLE.length], special: GEESE.includes(index) ? 'oca' : index === BRIDGE ? 'puente' : null};
});

const clampTeams = n => Math.min(MAX_TEAMS, Math.max(MIN_TEAMS, Math.round(Number(n)) || 4));
export function newGame({teams = 4, rounds = 8} = {}) {
 const count = clampTeams(teams);
 return {v: 1, teams: Array.from({length: count}, () => ({pos: 0, arrived: null})), turn: 0, round: 1,
  rounds: ROUND_CHOICES.includes(rounds) ? rounds : 8, bags: {}, retos: 0, again: false, reto: null, last: null, over: null};
}

export function validGame(state) {
 return !!state && state.v === 1 && Array.isArray(state.teams) && state.teams.length >= MIN_TEAMS && state.teams.length <= MAX_TEAMS
  && state.teams.every(t => Number.isInteger(t.pos) && t.pos >= 0 && t.pos <= GOAL)
  && Number.isInteger(state.turn) && state.turn >= 0 && state.turn < state.teams.length
  && Number.isInteger(state.round) && state.round >= 1 && ROUND_CHOICES.includes(state.rounds);
}

export const arrived = (state, index) => state.teams[index].pos >= GOAL;
export const allArrived = state => state.teams.every(team => team.pos >= GOAL);

// Who moves this turn. A team already at the goal rolls for the team furthest behind.
export function mover(state) {
 if (!arrived(state, state.turn)) return state.turn;
 let best = -1;
 state.teams.forEach((team, index) => { if (team.pos < GOAL && (best < 0 || team.pos < state.teams[best].pos)) best = index; });
 return best;
}

function walk(from, steps) {
 const path = [];
 for (let pos = from + 1; pos <= Math.min(GOAL, from + steps); pos++) path.push(pos);
 return path;
}

// Apply a die (1–6). Returns the new state and what happened, square by square, so the screen can animate it.
export function roll(state, die) {
 if (state.over) throw new Error('La partida ha terminado');
 if (!Number.isInteger(die) || die < 1 || die > 6) throw new RangeError('El dado va de 1 a 6');
 const next = structuredClone(state), who = mover(next), moves = [];
 const advance = (index, path) => {
  if (!path.length) return;
  next.teams[index].pos = path[path.length - 1];
  if (next.teams[index].pos >= GOAL && next.teams[index].arrived == null) next.teams[index].arrived = next.round;
  moves.push({team: index, path});
 };
 advance(who, walk(next.teams[who].pos, die));
 let square = next.teams[who].pos;
 const special = TILES[square].special;
 next.again = false;
 if (special === 'oca') {
  // From goose to goose and roll again. The last goose only gives the extra roll.
  const ahead = GEESE.find(goose => goose > square);
  if (ahead) advance(who, [ahead]);
  square = next.teams[who].pos;
  next.again = true;
 } else if (special === 'puente') {
  // The bridge carries every team that has not arrived yet.
  next.teams.forEach((team, index) => { if (team.pos < GOAL) advance(index, walk(team.pos, BRIDGE_STEPS)); });
 }
 if (allArrived(next)) next.again = false;
 next.last = {die, team: who, roller: next.turn, square, special};
 return {state: next, moves, team: who, square, special, family: TILES[square].family || 'cooperacion', again: next.again};
}

// One shuffled bag per family: a challenge does not come back until all of its family have been played.
export function drawChallenge(state, family, random = Math.random) {
 if (!FAMILY_NAMES[family]) throw new RangeError('Familia desconocida');
 const next = structuredClone(state);
 let bag = next.bags[family];
 if (!Array.isArray(bag) || !bag.length) {
  bag = eligibleChallenges({family}).map(challenge => challenge.id);
  for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
 }
 const id = bag.pop();
 next.bags[family] = bag;
 next.reto = id;
 next.retos++;
 return {state: next, challenge: eligibleChallenges({family}).find(challenge => challenge.id === id)};
}

// Close the turn: same team again after a goose, otherwise the next team; a round ends when every team has rolled.
export function nextTurn(state) {
 const next = structuredClone(state);
 next.reto = null;
 if (allArrived(next)) { next.over = 'ganada'; return next; }
 if (next.again) { next.again = false; return next; }
 next.turn = (next.turn + 1) % next.teams.length;
 if (next.turn === 0) next.round++;
 if (next.round > next.rounds) { next.round = next.rounds; next.over = 'agotada'; }
 return next;
}

// What goes to the record when the game ends.
export const summaryOf = state => ({equipos: state.teams.length, rondas: state.round, retos: state.retos, completada: state.over === 'ganada'});
