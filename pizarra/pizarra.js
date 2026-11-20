// La Pizarra: the rosco drawn in chalk. Class screen (everyone answers with a posture) or the pupil's own computer.
import {topBar, record, mode, player, playerCode, backToHub} from '../comun/lugar.js';
import {ROSCOS, rosco} from './banco.js';
import * as R from './rosco.js';
import {PINTADOS} from './assets/pintados.js';

topBar('La Pizarra');

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const say = text => { $('live').textContent = ''; setTimeout(() => { $('live').textContent = text; }, 30); };

// Painted art replaces the chalk drawings as soon as scripts/integrar_arte.py lists it in pintados.js.
const painted = key => PINTADOS.includes(key);
const art = key => `./assets/pizarra-${key}.webp`;
for (const key of PINTADOS) document.body.classList.add('con-' + key);
if (painted('robles-aplaude')) $('host-img').dataset.end = art('robles-aplaude');

const screen = mode() === 'pantalla', me = screen ? null : player();
const SAVE = 'pizarra-partida-' + (screen ? 'pantalla' : me ? playerCode(me) : 'libre'), PREFS = 'pizarra-ajustes';
const load = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const store = (key, value) => { try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const prefs = {rosco: me?.course === 6 ? 'sexto' : 'quinto', equipos: 0, sentado: false, ...load(PREFS)};
if (!rosco(prefs.rosco)) prefs.rosco = 'quinto';
const savePrefs = () => store(PREFS, prefs);
document.body.classList.toggle('screen', screen);

// --- Postures: A arms up, B hands on hips, C down low. ------------------------------------
const POSTURES = [
 {name: 'Brazos arriba', seatedName: 'Brazos arriba', en: 'Arms up'},
 {name: 'Manos a la cintura', seatedName: 'Manos a la cintura', en: 'Hands on hips'},
 {name: 'En cuclillas', seatedName: 'Manos a los tobillos', en: 'Squat down'},
];
const CHAIR = '<path class="faint" d="M30 92V46H70V92M24 92H76M28 92L26 134M72 92L74 134"/>';
const SEATED_BODY = '<circle cx="50" cy="24" r="10"/><path d="M50 35V86M50 86L40 92V132L34 133M50 86L60 92V132L66 133"/>';
const FIGURES = {
 a: '<circle cx="50" cy="20" r="10"/><path d="M50 31V80L38 130L31 131M50 80L62 130L69 131M50 40L31 7M50 40L69 7"/>',
 b: '<circle cx="50" cy="20" r="10"/><path d="M50 31V80L38 130L31 131M50 80L62 130L69 131M50 40L33 52L44 70M50 40L67 52L56 70"/>',
 c: '<circle cx="46" cy="60" r="10"/><path d="M44 71L40 102L66 104L60 131L72 131M43 79L76 81"/><path class="faint" d="M20 134H84"/>',
 as: CHAIR + SEATED_BODY + '<path d="M50 44L31 10M50 44L69 10"/>',
 bs: CHAIR + SEATED_BODY + '<path d="M50 44L33 56L43 74M50 44L67 56L57 74"/>',
 cs: '<path class="faint" d="M24 92V50M22 92H58M24 92V134M56 92V134"/><circle cx="69" cy="69" r="9.5"/><path d="M34 88L66 90V132L76 132M34 88L58 75M58 75L63 128"/>',
};
function posture(index, seated) {
 const id = 'abc'[index], key = `postura-${id}${seated ? '-sentado' : ''}`;
 if (painted(key)) return `<img class="figure" src="${art(key)}" alt="" width="400" height="560">`;
 return `<svg class="figure" viewBox="0 0 100 140" aria-hidden="true">${FIGURES[id + (seated ? 's' : '')]}</svg>`;
}
const postureName = (index, seated) => seated ? POSTURES[index].seatedName : POSTURES[index].name;
function drawKey() {
 $('key-list').innerHTML = POSTURES.map((item, i) => `<li class="key-card"><span class="chalk key-letter">${'ABC'[i]}</span>${posture(i, prefs.sentado)}<span class="chalk key-name">${esc(postureName(i, prefs.sentado))}</span><span class="chalk key-en" lang="en">${esc(item.en)}</span></li>`).join('');
}

// --- Start ------------------------------------------------------------------------------
$('start-lead').textContent = screen
 ? 'Pasapalabra para toda la clase: se lee la definición y se responde con el cuerpo. Cada acierto, un reto de movimiento.'
 : 'Contesta las 27 letras. Cada acierto trae un reto de movimiento.';
$('pick-rosco').insertAdjacentHTML('beforeend', ROSCOS.map(item =>
 `<label class="chip"><input type="radio" name="rosco" value="${item.id}"${item.id === prefs.rosco ? ' checked' : ''}><span class="chalk"><b>${esc(item.nombre)}</b><small>${esc(item.nota)}</small></span></label>`).join(''));
$('pick-rosco').addEventListener('change', event => { prefs.rosco = event.target.value; savePrefs(); });
if (screen) {
 $('pick-teams').hidden = $('key').hidden = false;
 $('pick-teams').insertAdjacentHTML('beforeend', [0, 2, 3, 4].map(n =>
  `<label class="chip"><input type="radio" name="teams" value="${n}"${n === prefs.equipos ? ' checked' : ''}><span class="chalk"><b>${n ? n + ' equipos' : 'Toda la clase'}</b></span></label>`).join(''));
 $('pick-teams').addEventListener('change', event => { prefs.equipos = Number(event.target.value); savePrefs(); });
 drawKey();
} else $('how').hidden = false;
$('out').href = backToHub();

const seatedBox = $('seated');
seatedBox.checked = prefs.sentado;
seatedBox.addEventListener('change', () => {
 prefs.sentado = seatedBox.checked; savePrefs();
 drawKey();
 if (view === 'game') drawPanel();
});

// --- Game state -------------------------------------------------------------------------
let view = 'start', bank = null, game = null, phase = 'leer', last = -1, picked = -1;
let countLeft = 0, retoLeft = 0, retoRunning = false, overtimeSaid = false;
let ticker = null, countTimer = null, retoTimer = null, sound = null;
const TEAMS = [{name: 'Amarillo', cls: 'y'}, {name: 'Azul', cls: 'b'}, {name: 'Rosa', cls: 'p'}, {name: 'Verde', cls: 'g'}];
const entry = (index = game.current) => bank.entradas[index];

function show(next) {
 view = next;
 document.body.dataset.view = next;
 for (const name of ['start', 'game', 'end']) $('view-' + name).hidden = name !== next;
 $('end-now').hidden = next !== 'game';
 seatedBox.parentElement.hidden = next === 'end' || (next === 'start' && !screen);
}
function save() {
 if (game && !game.done) store(SAVE, {game, phase: phase === 'cuenta' ? 'leer' : phase, last, picked});
}
function offerResume() {
 const saved = load(SAVE), savedBank = saved && rosco(saved.game?.rosco);
 const ok = savedBank && R.validGame(saved.game, savedBank) && !saved.game.done;
 $('resume').hidden = !ok;
 if (!ok) {
  store(SAVE, null);
  $('start').firstElementChild.textContent = 'Empezar';
  $('start').classList.add('gold', 'big');
  return;
 }
 const {aciertos, fallos} = R.counts(saved.game);
 $('resume-note').textContent = `${savedBank.nombre} · letra ${savedBank.entradas[saved.game.current].letra} · ${aciertos + fallos} de ${saved.game.size} hechas`;
 $('start').firstElementChild.textContent = 'Empezar otra';
 $('start').classList.remove('gold', 'big');
}
$('resume').addEventListener('click', () => {
 const saved = load(SAVE);
 bank = rosco(saved.game.rosco); game = saved.game;
 // A letter that was being answered or celebrated is picked up from its question.
 phase = 'leer'; last = -1; picked = -1;
 begin();
});
$('start').addEventListener('click', () => {
 bank = rosco(prefs.rosco);
 game = R.createGame(bank, {teams: screen ? prefs.equipos : 0});
 phase = 'leer'; last = -1; picked = -1; overtimeSaid = false;
 begin();
});
function begin() {
 show('game');
 drawRing(); drawPanel();
 clearInterval(ticker);
 ticker = setInterval(second, 1000);
 save();
 $('panel').focus({preventScroll: true});
}
// One second of play. On the pupil's computer the clock only runs while a question is open.
function second() {
 if (view !== 'game' || document.hidden || game.done) return;
 if (!screen && phase !== 'leer') return;
 game = R.tick(game);
 drawTime();
 if (game.seconds % 5 === 0) save();
}

// --- The ring -----------------------------------------------------------------------------
function wobble(cx, cy, r, seed, turn = 1.1) {
 const rand = R.seeded(seed), a = rand() * 6.3, b = rand() * 6.3, start = rand() * 6.3, steps = 36;
 const points = [];
 for (let i = 0; i <= steps * turn; i++) {
  const t = start + i / steps * Math.PI * 2, rr = r * (1 + .05 * Math.sin(t * 2 + a) + .03 * Math.sin(t * 3 + b));
  points.push(`${(cx + rr * Math.cos(t)).toFixed(1)} ${(cy + rr * Math.sin(t)).toFixed(1)}`);
 }
 return 'M' + points.join('L');
}
const LABEL = {[R.PENDIENTE]: 'sin responder', [R.ACIERTO]: 'acertada', [R.FALLO]: 'fallada', [R.PASADA]: 'pasada'};
function drawRing() {
 const n = game.size, radius = 258;
 let marks = '';
 bank.entradas.forEach((item, i) => {
  const angle = -Math.PI / 2 + i / n * Math.PI * 2, x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
  const status = game.status[i], now = i === game.current && !game.done, size = now ? 30 : 25;
  let extra = '';
  if (status === R.ACIERTO) extra = painted('tiza-acierto') ? `<image href="${art('tiza-acierto')}" x="${x - 31}" y="${y - 31}" width="62" height="62"/>` : `<path class="tick" d="M${x + 14} ${y + 17}l7 7l13 -18"/>`;
  if (status === R.FALLO) extra = painted('tiza-fallo') ? `<image href="${art('tiza-fallo')}" x="${x - 27}" y="${y - 27}" width="54" height="54"/>` : `<path class="cross" d="M${x - 19} ${y - 19}L${x + 19} ${y + 19}M${x + 19} ${y - 19}L${x - 19} ${y + 19}"/>`;
  const ring = status === R.ACIERTO && painted('tiza-acierto') ? '' : `<path class="loop" d="${wobble(x, y, size, i * 31 + 7)}"/>`;
  marks += `<g class="letter ${status}${now ? ' now' : ''}">${ring}${now ? `<path class="loop outer" d="${wobble(x, y, size + 7, i * 17 + 3, 1.05)}"/>` : ''}${extra}<text x="${x}" y="${y}" dy=".36em">${item.letra}</text></g>`;
 });
 $('ring').innerHTML = `<g filter="url(#tiza)">${marks}</g>`;
 const {aciertos, fallos, quedan} = R.counts(game);
 $('ring').setAttribute('aria-label', `Rosco: ${aciertos} acertadas, ${fallos} falladas, ${quedan} por responder. ` + bank.entradas.map((item, i) => `${item.letra} ${LABEL[game.status[i]]}`).join(', '));
 drawCentre();
}
function drawCentre() {
 const {aciertos, fallos} = R.counts(game);
 const counting = phase === 'cuenta';
 $('centre-letter').textContent = counting ? (countLeft > 0 ? countLeft : '¡Ya!') : entry().letra;
 $('centre-letter').classList.toggle('counting', counting);
 $('centre-note').innerHTML = screen
  ? `<b>${aciertos}</b> ${aciertos === 1 ? 'acierto' : 'aciertos'} de la clase`
  : `<span class="ok">✓ ${aciertos}</span> <span class="ko">✗ ${fallos}</span>`;
 drawTeams();
 drawTime();
}
function drawTime() {
 if (screen) { $('centre-time').textContent = game.round > 1 ? `Vuelta ${game.round}` : ''; return; }
 const left = bank.segundos - game.seconds;
 $('centre-time').textContent = left >= 0 ? clock(left) : `Tiempo extra ${clock(-left)}`;
 $('centre-time').classList.toggle('extra', left < 0);
 if (left < 0 && !overtimeSaid) {
  overtimeSaid = true;
  say('Se acabó el tiempo. Puedes terminar con calma: las letras que quedan cuentan igual.');
  if (phase === 'leer') drawPanel();
 }
}

// --- The panel: question, answer, movement --------------------------------------------------
function drawTeams() {
 const box = $('centre-teams'), reading = ['leer', 'cuenta', 'revelada'].includes(phase);
 box.hidden = !game.teams.length;
 box.innerHTML = game.teams.map((score, i) => `<li class="${TEAMS[i].cls}${i === game.turn && reading ? ' turn' : ''}"><span>${TEAMS[i].name}</span> <b>${score}</b></li>`).join('');
}
function choicesMarkup(item, index, reveal) {
 const shown = R.shownOptions(game, item, index), right = R.rightChoice(game, index);
 return `<ol class="choices${screen ? ' with-figures' : ''}">${shown.map((word, i) => {
  const state = reveal ? (i === right ? ' right' : i === picked ? ' wrong' : ' dim') : '';
  const inner = `<span class="chalk key-letter">${'ABC'[i]}</span>${screen ? posture(i, prefs.sentado) : ''}<span class="chalk word">${esc(cap(word))}</span>`;
  return `<li>${!screen && !reveal ? `<button type="button" class="choice" data-choice="${i}" aria-keyshortcuts="${'abc'[i]}">${inner}</button>` : `<div class="choice${state}">${inner}</div>`}</li>`;
 }).join('')}</ol>`;
}
function answerLine(item) {
 return `<span class="chalk answer">${esc(cap(item.respuesta))}</span>${item.ingles ? ` <span class="chalk en" lang="en">${esc(item.ingles)}</span>` : ''}`;
}
function drawPanel() {
 const panel = $('panel');
 if (phase === 'acierto' || phase === 'fallo') { drawAfter(); return; }
 const item = entry(), reveal = phase === 'revelada';
 const turn = game.teams.length ? ` <span class="turn-note">· lee y puntúa el equipo <b class="${TEAMS[game.turn].cls}">${TEAMS[game.turn].name}</b></span>` : '';
 let actions = '';
 if (screen && phase === 'leer') actions = `<button type="button" class="sign gold" data-do="count"><strong>Cuenta atrás: ¡postura!</strong></button><button type="button" class="sign" data-do="pass"><strong>Pasapalabra</strong></button>`;
 if (screen && phase === 'cuenta') actions = `<p class="chalk big-note">${countLeft > 0 ? 'Elegid postura…' : '¡Quietos así!'}</p>`;
 if (screen && reveal) {
  const who = game.teams.length ? `del equipo ${TEAMS[game.turn].name}` : 'de la clase';
  actions = `<p class="chalk ask">¿Acertó la mayoría ${who}?</p><button type="button" class="sign gold" data-do="yes"><strong>Sí, la mayoría</strong></button><button type="button" class="sign" data-do="no"><strong>No</strong></button>`;
 }
 if (!screen) actions = `<button type="button" class="sign" data-do="pass" aria-keyshortcuts="p"><strong>Pasapalabra</strong></button>`;
 const overtime = !screen && game.seconds > bank.segundos ? '<p class="chalk soft">Se acabó el tiempo, pero puedes terminar con calma: las que quedan cuentan igual.</p>' : '';
 const revealLine = reveal ? `<p class="reveal">Es la <b class="chalk">${'ABC'[R.rightChoice(game)]}</b>: ${answerLine(item)}</p>` : '';
 panel.innerHTML = `<p class="chalk clue">${esc(R.clueText(item))}${turn}</p><p class="chalk definition">${esc(item.definicion)}</p>${choicesMarkup(item, game.current, reveal)}${revealLine}<div class="actions">${actions}</div>${overtime}`;
}
function drawAfter() {
 const item = entry(last), ok = phase === 'acierto', panel = $('panel');
 if (!ok) {
  panel.innerHTML = `<p class="chalk clue ko">${esc(R.clueText(item))} · Para repasar</p><p class="chalk definition small">${esc(item.definicion)}</p>${screen ? '' : choicesMarkup(item, last, true).replace('class="choices', 'class="choices compact')}<p class="reveal">Era ${answerLine(item)}</p><div class="actions"><button type="button" class="sign gold" data-do="next"><strong>${game.done ? 'Ver el resultado' : 'Siguiente letra'}</strong></button></div>`;
  return;
 }
 const text = prefs.sentado ? item.reto.sentado : item.reto.pie;
 const ready = !retoRunning && retoLeft <= 0;
 const startLabel = retoRunning ? 'Pausar' : retoLeft < item.reto.s && retoLeft > 0 ? 'Seguir' : ready ? 'Repetir' : 'Empezar';
 const canGo = screen || ready;
 panel.innerHTML = `<p class="chalk clue ok">¡Acierto! ${answerLine(item)}</p>
  <p class="chalk eyebrow-chalk">Microrreto${prefs.sentado ? ' · sentados' : ''}</p>
  <p class="chalk reto">${esc(text)}</p>
  <div class="reto-clock${ready ? ' done' : ''}"><output class="chalk" id="reto-clock">${clock(Math.max(0, retoLeft))}</output>${screen || ready ? `<button type="button" class="sign" data-do="reto"><strong>${startLabel}</strong></button>` : ''}</div>
  <div class="actions"><button type="button" class="sign gold" data-do="next"${canGo ? '' : ' disabled'}><strong>${game.done ? 'Ver el resultado' : 'Siguiente letra'}</strong></button>${!canGo ? '<span class="chalk soft">El botón se enciende al acabar el reto.</span>' : ''}</div>`;
}

$('panel').addEventListener('click', event => {
 const choice = event.target.closest('[data-choice]');
 if (choice) { choose(Number(choice.dataset.choice)); return; }
 const button = event.target.closest('[data-do]');
 if (!button || button.disabled) return;
 ({count: startCount, pass: passLetter, yes: () => mark(true), no: () => mark(false), next, reto: toggleReto})[button.dataset.do]?.();
});
addEventListener('keydown', event => {
 if (view !== 'game' || event.ctrlKey || event.metaKey || event.altKey) return;
 if (event.target.closest?.('input,select,textarea')) return;
 const key = event.key.toLowerCase();
 if (!screen && phase === 'leer') {
  const index = {a: 0, b: 1, c: 2, 1: 0, 2: 1, 3: 2}[key];
  if (index !== undefined) { event.preventDefault(); choose(index); return; }
  if (key === 'p') { event.preventDefault(); passLetter(); }
 }
 if (screen && phase === 'leer' && key === 'p') { event.preventDefault(); passLetter(); }
});

function focusAction() {
 const target = $('panel').querySelector('[data-do="next"]:not([disabled]), [data-do="yes"], [data-do="count"], .choice');
 (target || $('panel')).focus({preventScroll: true});
 if (matchMedia('(max-width: 760px)').matches) $('panel').scrollIntoView({block: 'nearest', behavior: still() ? 'auto' : 'smooth'});
}
// Pupil: the tap is the answer.
function choose(index) {
 if (screen || phase !== 'leer' || game.done) return;
 picked = index;
 resolve(index === R.rightChoice(game));
}
function passLetter() {
 if (phase !== 'leer' || game.done) return;
 const letter = entry().letra;
 game = R.pass(game);
 say(`Pasapalabra. Letra ${letter} para la siguiente vuelta.`);
 drawRing(); drawPanel(); save();
 focusAction();
}
// Class screen: a short countdown, then the right answer is shown.
function startCount() {
 if (phase !== 'leer') return;
 phase = 'cuenta'; countLeft = 5; picked = -1;
 drawCentre(); drawPanel();
 clearInterval(countTimer);
 countTimer = setInterval(() => {
  countLeft--;
  if (countLeft >= 0) { drawCentre(); drawPanel(); beep(countLeft === 0 ? 880 : 520); }
  if (countLeft < 0) {
   clearInterval(countTimer);
   phase = 'revelada';
   drawCentre(); drawPanel();
   say(`Es la ${'ABC'[R.rightChoice(game)]}: ${entry().respuesta}.`);
   focusAction();
  }
 }, still() ? 700 : 1000);
}
function mark(correct) {
 if (phase !== 'revelada') return;
 resolve(correct);
}
function resolve(correct) {
 last = game.current;
 const item = entry(last);
 game = R.answer(game, correct);
 phase = correct ? 'acierto' : 'fallo';
 retoLeft = item.reto.s; retoRunning = false;
 say(correct ? `¡Acierto! ${item.respuesta}. Microrreto: ${prefs.sentado ? item.reto.sentado : item.reto.pie}` : `Era ${item.respuesta}.`);
 drawRing(); drawPanel(); save();
 // The pupil's movement starts by itself; the class screen waits for the teacher.
 if (correct && !screen) toggleReto();
 focusAction();
}
function toggleReto() {
 if (phase !== 'acierto') return;
 if (retoRunning) { stopReto(); drawPanel(); return; }
 if (retoLeft <= 0) retoLeft = entry(last).reto.s;
 retoRunning = true;
 drawPanel();
 retoTimer = setInterval(() => {
  retoLeft--;
  const out = $('reto-clock');
  if (out) out.textContent = clock(Math.max(0, retoLeft));
  if (retoLeft > 0) return;
  stopReto(); chime();
  drawPanel();
  say('¡Reto hecho!');
  focusAction();
 }, 1000);
}
function stopReto() { clearInterval(retoTimer); retoTimer = null; retoRunning = false; }
function next() {
 stopReto();
 picked = -1;
 if (game.done) { end(); return; }
 phase = 'leer';
 drawRing(); drawPanel(); save();
 focusAction();
}

// --- End ---------------------------------------------------------------------------------
let armed = null;
$('end-now').addEventListener('click', () => {
 if (!armed) {
  $('end-now').firstElementChild.textContent = '¿Seguro? Pulsa otra vez';
  armed = setTimeout(() => { armed = null; $('end-now').firstElementChild.textContent = 'Terminar'; }, 3500);
  return;
 }
 clearTimeout(armed); armed = null;
 $('end-now').firstElementChild.textContent = 'Terminar';
 stopReto(); clearInterval(countTimer);
 game = R.finish(game);
 end();
});
function end() {
 clearInterval(ticker); stopReto(); clearInterval(countTimer);
 const data = R.result(game, bank);
 if (game.teams.length) data.equipos = game.teams.join('-');
 record('pizarra', 'rosco', 'partida', data);
 store(SAVE, null);
 const {aciertos, fallos, pasadas, segundos, repasar} = data;
 $('end-tag').textContent = bank.nombre;
 $('end-title').textContent = `${aciertos} ${aciertos === 1 ? 'acierto' : 'aciertos'} de ${game.size}`;
 const extra = !screen && segundos > bank.segundos ? ` (${clock(segundos - bank.segundos)} de tiempo extra)` : '';
 $('end-line').textContent = `${fallos} ${fallos === 1 ? 'fallo' : 'fallos'} · ${pasadas} ${pasadas === 1 ? 'pasapalabra' : 'pasapalabras'} · ${clock(segundos)}${extra}`;
 const best = Math.max(...game.teams, 0);
 $('end-teams').hidden = !game.teams.length;
 $('end-teams').innerHTML = game.teams.map((score, i) => `<li class="${TEAMS[i].cls}${score === best && best > 0 ? ' turn' : ''}"><span>${TEAMS[i].name}</span> <b>${score}</b></li>`).join('');
 const review = bank.entradas.filter(item => repasar.includes(item.letra));
 $('review-title').textContent = review.length ? 'Para repasar' : '¡Rosco completo, sin nada que repasar!';
 $('review').innerHTML = review.map(item => `<li><span class="chalk key-letter">${item.letra}</span><span><span class="chalk answer">${esc(cap(item.respuesta))}</span>${item.ingles ? ` <span class="chalk en" lang="en">${esc(item.ingles)}</span>` : ''}<small class="chalk">${esc(item.definicion)}</small></span></li>`).join('');
 if ($('host-img').dataset.end) $('host-img').src = $('host-img').dataset.end;
 show('end');
 say(`Rosco terminado: ${aciertos} aciertos.`);
 $('end-title').setAttribute('tabindex', '-1'); $('end-title').focus({preventScroll: true});
 scrollTo(0, 0);
}
$('again').addEventListener('click', () => {
 if (painted('robles-aplaude')) $('host-img').src = '../gimnasio/assets/robles-point.webp';
 offerResume(); show('start');
});

// --- Sound -------------------------------------------------------------------------------
function tone(pitch, at, length = .25, level = .07) {
 sound ||= new (window.AudioContext || window.webkitAudioContext)();
 const osc = sound.createOscillator(), gain = sound.createGain(), when = sound.currentTime + at;
 osc.frequency.value = pitch;
 gain.gain.setValueAtTime(level, when);
 gain.gain.exponentialRampToValueAtTime(.001, when + length);
 osc.connect(gain).connect(sound.destination);
 osc.start(when); osc.stop(when + length + .02);
}
function beep(pitch) { try { tone(pitch, 0, .14, .05); } catch {} }
function chime() { try { tone(660, 0); tone(880, .16); } catch {} }

addEventListener('pagehide', save);
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
offerResume();
show('start');
