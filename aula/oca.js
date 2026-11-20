// La oca cooperativa: the screen of the class. Rules are in oca-reglas.js; this file draws and animates.
import {topBar, record} from '../comun/lugar.js';
import {challenges} from '../content.js';
import * as oca from './oca-reglas.js';
import {pawn, pawnIcon, SYMBOLS, symbolIcon} from './dibujos.js';
import {$, esc, pintado, load, save, forget, wait, still, countdown, chime} from './aula.js';

topBar('El Aula');
const NS = 'http://www.w3.org/2000/svg';
const board = $('board'), wrap = $('board-wrap');
let game = null, busy = false, setup = {teams: 4, rounds: 8};
const team = index => oca.TEAMS[index];
const teamName = index => 'Equipo ' + team(index).name.toLowerCase();

// --- Background art ------------------------------------------------------------
const room = pintado('aula');
if (room) for (const wall of document.querySelectorAll('.aula-wall')) { wall.style.setProperty('--aula-bg', `url(${room}) 50% 100%`); wall.style.setProperty('--aula-bg-size', 'cover'); }

// --- Setup ---------------------------------------------------------------------
const RULES = [
 ['oca', 'De oca a oca: el equipo salta a la siguiente oca y vuelve a tirar.'],
 ['puente', 'Puente: todos los equipos avanzan dos casillas.'],
 ['calma', 'Calma: un reto tranquilo para toda la clase.'],
];
const rulesMarkup = RULES.map(([name, text]) => `<li>${symbolIcon(name).replace('<svg', `<svg style="background:${name === 'calma' ? oca.FAMILY_COLOURS.calma : '#8a5a2b'};border-radius:10px"`)}<span>${esc(text)}</span></li>`).join('');
$('rules').innerHTML = $('rules-again').innerHTML = rulesMarkup;

function choices(box, values, current, label, onPick) {
 box.innerHTML = values.map(value => `<button type="button" class="choice" data-value="${value}" aria-pressed="${value === current}">${value}<small>${label}</small></button>`).join('');
 box.onclick = event => {
  const button = event.target.closest('.choice');
  if (!button) return;
  for (const other of box.children) other.setAttribute('aria-pressed', other === button);
  onPick(Number(button.dataset.value));
 };
}
choices($('team-choices'), [2, 3, 4, 5, 6], setup.teams, 'equipos', value => { setup.teams = value; });
choices($('round-choices'), oca.ROUND_CHOICES, setup.rounds, 'rondas', value => { setup.rounds = value; });

function showSetup() {
 const saved = load('oca', oca.validGame);
 $('resume').hidden = !saved || !!saved.over;
 if (saved && !saved.over) $('resume-text').textContent = `Ronda ${saved.round} de ${saved.rounds} · ${saved.teams.length} equipos`;
 $('setup').hidden = false; $('game').hidden = true;
}
$('start').addEventListener('click', () => { game = oca.newGame(setup); save('oca', game); play(); });
$('resume-button').addEventListener('click', () => { game = load('oca', oca.validGame); if (game) play(); });

// --- Board -----------------------------------------------------------------------
function drawBoard() {
 const painted = pintado('tablero');
 wrap.classList.toggle('painted', !!painted);
 if (painted) wrap.style.setProperty('--board-art', `url(${painted})`);
 const path = 'M' + oca.POINTS.map(([x, y]) => `${x} ${y}`).join('L');
 let svg = `<defs><filter id="lift" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#3a1a05" flood-opacity=".45"/></filter></defs>`;
 if (!painted) svg += `<path d="${path}" fill="none" stroke="#5a3210" stroke-opacity=".35" stroke-width="44" stroke-linejoin="round"/>
  <path d="${path}" fill="none" stroke="#fff3d9" stroke-opacity=".75" stroke-width="7" stroke-dasharray="2 22" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="770" cy="512" rx="300" ry="86" fill="#fff3d9" opacity=".22"/>`;
 // The plaque in the middle of the spiral: the round, readable from the back of the room.
 svg += `<g id="plaque" transform="translate(770 512)"><text y="-14" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="800" font-size="30" letter-spacing="6" fill="#fff3d9" stroke="#3a2a14" stroke-width="6" paint-order="stroke">RONDA</text>
  <text id="plaque-round" y="58" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="76" fill="#fff3d9" stroke="#3a2a14" stroke-width="8" paint-order="stroke">1 / 8</text></g>`;
 oca.POINTS.forEach(([x, y], index) => {
  const tile = oca.TILES[index], size = index === oca.GOAL ? oca.BOARD.goalTile : oca.BOARD.tile, h = size / 2;
  const fill = tile.special === 'salida' ? '#f4e6c4' : tile.special === 'meta' ? '#f2bd57' : oca.FAMILY_COLOURS[tile.family];
  const dark = tile.special === 'salida' || tile.special === 'meta';
  let inside = painted
   ? `<rect x="${-h}" y="${-h}" width="${size}" height="${size}" rx="22" fill="none" stroke="none"/>`
   : `<rect x="${-h}" y="${-h}" width="${size}" height="${size}" rx="22" fill="${fill}" stroke="#3a2a14" stroke-width="6" filter="url(#lift)"/>
      <rect x="${-h + 9}" y="${-h + 9}" width="${size - 18}" height="${size - 18}" rx="15" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="3"/>`;
  if (!painted && SYMBOLS[tile.special]) {
   const label = tile.special === 'salida' ? 'SALIDA' : tile.special === 'meta' ? 'META' : '';
   inside += `<g transform="translate(0 ${label ? -14 : 4}) scale(${label ? .78 : .95})" opacity="${label ? 1 : .92}">${SYMBOLS[tile.special]}</g>`;
   if (label) inside += `<text y="${h - 18}" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="800" font-size="${index === oca.GOAL ? 30 : 24}" letter-spacing="3" fill="#3a2a14">${label}</text>`;
  }
  if (index > 0 && index < oca.GOAL) inside += `<text x="${-h + 12}" y="${-h + 36}" font-family="Trebuchet MS,sans-serif" font-weight="800" font-size="30" fill="${dark ? '#3a2a14' : '#fff6e0'}" stroke="#3a2a14" stroke-width="${dark ? 0 : 5}" paint-order="stroke">${index}</text>`;
  svg += `<g class="tile" id="tile-${index}" transform="translate(${x} ${y})">${inside}</g>`;
 });
 svg += '<g id="tokens"></g>';
 board.innerHTML = svg;
}

// Several pawns on one square sit side by side.
const SPREAD = {1: [[0, 0]], 2: [[-30, 0], [30, 0]], 3: [[-30, -22], [30, -22], [0, 26]], 4: [[-30, -26], [30, -26], [-30, 26], [30, 26]],
 5: [[-40, -28], [0, -28], [40, -28], [-22, 28], [22, 28]], 6: [[-40, -28], [0, -28], [40, -28], [-40, 28], [0, 28], [40, 28]]};
const at = ([x, y], [dx, dy] = [0, 0]) => `translate(${x + dx}px, ${y + dy}px)`;
function drawTokens() {
 const layer = $('tokens');
 layer.innerHTML = game.teams.map((_, index) => `<g class="token" id="token-${index}"><g>${pawn(team(index), game.teams.length > 4 ? 27 : 34)}</g></g>`).join('');
 placeTokens();
}
function placeTokens() {
 const groups = new Map();
 game.teams.forEach((t, index) => groups.set(t.pos, [...(groups.get(t.pos) || []), index]));
 for (const [pos, members] of groups) members.forEach((index, k) => {
  const token = $('token-' + index);
  token.style.transitionDuration = '';
  token.style.transform = at(oca.POINTS[pos], SPREAD[members.length][k]);
 });
 const moving = oca.mover(game);
 game.teams.forEach((_, index) => $('token-' + index).classList.toggle('current', !game.over && index === moving && !busy));
 // The pawn that moves is drawn last, on top of the others.
 if (moving >= 0) $('tokens').append($('token-' + moving));
}
async function animate(moves) {
 for (const move of moves) {
  const token = $('token-' + move.team);
  $('tokens').append(token);
  token.classList.remove('current');
  const jump = move.path.length === 1 && moves.length === 2 && move === moves[1];
  for (const pos of move.path) {
   token.style.transitionDuration = jump ? '.7s' : '';
   token.style.transform = at(oca.POINTS[pos]);
   token.classList.remove('hop'); void token.getBBox(); token.classList.add('hop');
   await wait(jump ? 720 : 300);
  }
  token.classList.remove('hop');
 }
}

// --- The die ----------------------------------------------------------------------
const PIPS = {1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]};
const FACE = {1: [0, 0], 6: [0, 180], 3: [0, -90], 4: [0, 90], 2: [-90, 0], 5: [90, 0]};
const die = $('die');
die.innerHTML = Object.entries(PIPS).map(([face, pips]) => {
 const art = pintado('dado-' + face);
 return `<i class="f${face}"${art ? ` style="background-image:url(${art});border:0"` : ''}>${Array.from({length: 9}, (_, cell) => pips.includes(cell) ? '<b></b>' : '<u></u>').join('')}</i>`;
}).join('');
if (pintado('dado-1')) die.classList.add('painted');
let spin = 0;
function showDie(value, roll = true) {
 if (roll) spin += 2;
 const [x, y] = FACE[value];
 die.style.transform = `rotateX(-16deg) rotateY(20deg) rotateX(${spin * 360 + x}deg) rotateY(${spin * 180 + y}deg)`;
}

// --- Turns ------------------------------------------------------------------------
function render() {
 $('round-label').textContent = `Ronda ${game.round} de ${game.rounds}`;
 const plaque = board.querySelector('#plaque-round');
 if (plaque) plaque.textContent = `${game.round} / ${game.rounds}`;
 const moving = oca.mover(game), helped = moving !== game.turn;
 $('turn-team').innerHTML = `${pawnIcon(team(game.turn))}<strong>${esc(teamName(game.turn))}</strong>`;
 $('turn-help').textContent = game.over || moving < 0 ? '¡Todos en la meta!' : helped ?`Ya está en la meta: tira para el ${teamName(moving).toLowerCase()}` : game.again ? '¡Vuelve a tirar!' : 'Os toca tirar el dado';
 $('teams').innerHTML = game.teams.map((t, index) => `<li class="${index === game.turn ? 'now' : ''}">${pawnIcon(team(index))}<span>${esc(team(index).name)}</span><b>${t.pos >= oca.GOAL ? 'Meta ✓' : t.pos === 0 ? 'Salida' : 'Casilla ' + t.pos}</b></li>`).join('');
 $('roll').disabled = busy || !!game.over;
 placeTokens();
}

function news(result) {
 const who = teamName(result.team);
 if (result.special === 'oca') return result.moves.length > 1
  ? `¡De oca a oca! El ${who.toLowerCase()} salta a la casilla ${result.square} y vuelve a tirar después del reto.` : `¡Oca! El ${who.toLowerCase()} vuelve a tirar después del reto.`;
 if (result.special === 'puente') return `¡Puente! Todos los equipos avanzan ${oca.BRIDGE_STEPS} casillas.`;
 if (result.special === 'calma') return 'Casilla de calma: toda la clase baja el ritmo.';
 if (result.special === 'meta') return `¡El ${who.toLowerCase()} llega a la meta! A partir de ahora tira para ayudar a los demás.`;
 const arrivedNow = result.moves.filter(m => m.path.at(-1) === oca.GOAL).map(m => teamName(m.team).toLowerCase());
 return arrivedNow.length ? `¡Llega a la meta el ${arrivedNow.join(' y el ')}!` : '';
}

const clock = countdown($('reto-clock'), $('reto-start'), () => { $('reto-status').textContent = '¡Tiempo! Comentad cómo ha salido.'; });
function showChallenge(challenge, message) {
 const colour = oca.FAMILY_COLOURS[challenge.family];
 $('reto-family').textContent = oca.FAMILY_NAMES[challenge.family];
 $('reto-family').style.background = colour;
 $('reto').style.borderColor = colour;
 $('reto-who').textContent = challenge.minPlayers > 1 ? 'Toda la clase a la vez · por parejas o grupos' : 'Toda la clase a la vez · cada uno en su sitio';
 $('reto-news').hidden = !message; $('reto-news').textContent = message || '';
 $('reto-title').textContent = challenge.title;
 $('reto-text').textContent = challenge.standing;
 $('reto-seated').textContent = challenge.seated;
 $('reto-criterion').textContent = challenge.criterion;
 $('reto-status').textContent = '';
 clock.set(challenge.seconds);
 for (const lit of board.querySelectorAll('.tile.lit')) lit.classList.remove('lit');
 if (game.last) $('tile-' + game.last.square)?.classList.add('lit');
 if (!$('reto').open) $('reto').showModal();
 $('reto-start').focus();
}

$('roll').addEventListener('click', async () => {
 if (busy || game.over || game.reto) return;
 busy = true; render();
 const value = 1 + Math.floor(Math.random() * 6);
 showDie(value);
 $('oca-status').textContent = 'Rodando…';
 await wait(1100);
 $('oca-status').textContent = `Ha salido un ${value}.`;
 const result = oca.roll(game, value);
 game = result.state;
 await animate(result.moves);
 const drawn = oca.drawChallenge(game, result.family);
 game = drawn.state;
 game.news = news(result);
 save('oca', game);
 busy = false; render();
 if (result.special && result.special !== 'meta') chime([[0, 520], [.12, 660], [.24, 880]]);
 showChallenge(drawn.challenge, game.news);
});

$('reto').addEventListener('cancel', event => event.preventDefault());
$('reto-done').addEventListener('click', () => {
 clock.stop();
 $('reto').close();
 for (const lit of board.querySelectorAll('.tile.lit')) lit.classList.remove('lit');
 const again = game.again, roller = game.turn;
 game = oca.nextTurn(game);
 delete game.news;
 save('oca', game);
 render();
 $('oca-status').textContent = game.over ? '' : again ? `¡${teamName(roller)} vuelve a tirar!` : '';
 if (game.over) finish(); else $('roll').focus();
});

function finish() {
 record('aula', 'oca', 'partida', oca.summaryOf(game));
 forget('oca');
 const won = game.over === 'ganada', inGoal = game.teams.filter(t => t.pos >= oca.GOAL).length;
 $('final-eyebrow').textContent = `Fin de la partida · ${game.retos} retos en ${game.round} rondas`;
 $('final-title').textContent = won ? '¡Gana la clase!' : '¡Casi!';
 $('final-text').textContent = won ? 'Todos los equipos han llegado a la meta antes de acabar las rondas.'
  : `Se han acabado las rondas con ${inGoal} de ${game.teams.length} equipos en la meta. La próxima vez, con una ronda más.`;
 $('final-teams').innerHTML = game.teams.map((t, index) => `<span title="${esc(team(index).name)}">${pawnIcon(team(index))}</span>`).join('');
 if (won) chime([[0, 523], [.15, 659], [.3, 784], [.45, 1047]]);
 $('final').showModal();
}
$('again').addEventListener('click', () => { $('final').close(); game = null; showSetup(); });

$('show-rules').addEventListener('click', () => $('rules-dialog').showModal());
$('quit').addEventListener('click', () => {
 if (!confirm('¿Terminar esta partida? Se borra la partida guardada.')) return;
 if (game.retos) record('aula', 'oca', 'partida', oca.summaryOf(game));
 forget('oca'); game = null; showSetup();
});

function play() {
 $('setup').hidden = true; $('game').hidden = false;
 drawBoard(); drawTokens();
 showDie(game.last?.die || 1, false);
 render();
 $('oca-status').textContent = '';
 // A saved game stopped in the middle of a challenge opens it again.
 const pending = game.reto && challenges.find(challenge => challenge.id === game.reto);
 if (pending) showChallenge(pending, game.news); else $('roll').focus();
}

if (still()) die.style.transition = 'none';
showSetup();
