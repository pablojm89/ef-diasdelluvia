// La Sala de Espejos: four class games of rhythm and expression. Their rules live in reglas.js.
import {topBar, record} from '../comun/lugar.js';
import {GOLPES, PATRONES, golpe, tiempos, ACCIONES, COLORES, partida, BARAJA, siguienteMimica, FRASE, CUENTAS, oferta, enCuenta} from './reglas.js';

topBar('La Sala de Espejos');
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const art = id => `../aula/assets/mov-${id}.webp`;
const byId = id => BARAJA.find(move => move.id === id);

// --- Sound: every hit of the body has its own, made on the spot --------------------------------
let audio = null;
function sound(kind) {
 try {
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  const at = audio.currentTime, level = audio.createGain();
  level.connect(audio.destination);
  const tone = (from, to, seconds, gain, type = 'sine') => {
   const osc = audio.createOscillator();
   osc.type = type; osc.frequency.setValueAtTime(from, at); osc.frequency.exponentialRampToValueAtTime(to, at + seconds);
   level.gain.setValueAtTime(gain, at); level.gain.exponentialRampToValueAtTime(.001, at + seconds);
   osc.connect(level); osc.start(at); osc.stop(at + seconds + .02);
  };
  const noise = (cut, type, seconds, gain) => {
   const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * seconds), audio.sampleRate), data = buffer.getChannelData(0);
   for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
   const source = audio.createBufferSource(), filter = audio.createBiquadFilter();
   source.buffer = buffer; filter.type = type; filter.frequency.value = cut;
   level.gain.setValueAtTime(gain, at);
   source.connect(filter).connect(level); source.start(at);
  };
  if (kind === 'P') noise(1600, 'bandpass', .07, .5);
  else if (kind === 'C') tone(130, 70, .12, .5);
  else if (kind === 'M') noise(700, 'lowpass', .08, .4);
  else if (kind === 'S') tone(80, 42, .16, .6);
  else if (kind === 'click') tone(1400, 900, .03, .25, 'square');
  else if (kind === 'tick') tone(880, 700, .03, .08);
 } catch {}
}

// --- Views -------------------------------------------------------------------------------------
const VIEWS = {'': 'menu', eco: 'eco', estatuas: 'estatuas', mimica: 'mimica', coreo: 'coreo'};
let beat = null;
function stopBeat() { clearInterval(beat); beat = null; }
function route() {
 const view = VIEWS[location.hash.slice(1)] || 'menu';
 document.body.dataset.view = view;
 for (const name of Object.values(VIEWS)) $('v-' + name).hidden = name !== view;
 stopBeat(); stopStatues(); stopMime();
 if (view === 'eco') showEcho(0);
 if (view === 'mimica') nextMime(false);
 if (view === 'coreo') newPhrase();
 scrollTo(0, 0);
}
addEventListener('hashchange', route);

// --- Echo ----------------------------------------------------------------------------------------
// The screen plays the rhythm once, the class answers once, and again: then the next one.
const ECHO_MS = 714, REPEATS = 2;
let pattern = 0, cursor = 0;
const seated = () => $('eco-seated').checked;
function showEcho(index) {
 pattern = index; cursor = -1;
 const beats = tiempos(PATRONES[pattern]);
 $('eco-count').textContent = `Ritmo ${pattern + 1} de ${PATRONES.length}`;
 $('eco-phase').textContent = 'Mirad el ritmo';
 $('eco-beats').innerHTML = beats.map(letter => { const hit = golpe(letter, seated()); return `<li data-hit="${letter}" class="${letter === '_' ? 'rest' : ''}"><b>${letter === '_' ? '·' : esc(hit.es.charAt(0))}</b><span>${esc(hit.es)}</span><small lang="en">${esc(hit.en)}</small></li>`; }).join('');
 $('v-eco').dataset.turn = 'pantalla';
}
function echoTick() {
 const beats = tiempos(PATRONES[pattern]), total = beats.length * 2 * REPEATS;
 cursor++;
 if (cursor >= total) {
  if (pattern >= PATRONES.length - 1) {
   stopBeat();
   record('espejos', 'ritmo', 'eco', {ritmos: PATRONES.length, sentada: seated()});
   $('eco-phase').textContent = '¡Hecho! Los diez ritmos.';
   $('eco-start').firstElementChild.textContent = 'Otra vez';
   for (const tile of $('eco-beats').children) tile.classList.remove('now');
   pattern = -1;
   return;
  }
  showEcho(pattern + 1); cursor = 0;
 }
 const now = tiempos(PATRONES[pattern]), mine = Math.floor(cursor / now.length) % 2 === 1, at = cursor % now.length;
 $('v-eco').dataset.turn = mine ? 'clase' : 'pantalla';
 $('eco-phase').textContent = mine ? '¡Vuestro turno! · Your turn!' : 'Escuchad · Listen';
 [...$('eco-beats').children].forEach((tile, index) => tile.classList.toggle('now', index === at));
 const letter = now[at];
 // The class plays over a soft tick; the screen plays the real sounds.
 if (mine) sound('tick'); else if (letter !== '_') sound(letter === 'S' && seated() ? 'click' : letter);
}
$('eco-start').addEventListener('click', () => {
 if (beat) { stopBeat(); $('eco-start').firstElementChild.textContent = 'Seguir'; return; }
 if (pattern < 0) showEcho(0);
 $('eco-start').firstElementChild.textContent = 'Pausa';
 beat = setInterval(echoTick, ECHO_MS);
});
$('eco-seated').addEventListener('change', () => { if (!beat) showEcho(Math.max(0, pattern)); });

// --- Statues with a rule that changes ---------------------------------------------------------------
const RULE_MS = 7000;
let statues = null, statueTimer = null;
function stopStatues() { clearTimeout(statueTimer); statueTimer = null; statues = null; $('est-stage').hidden = true; document.body.classList.remove('practising'); }
const ruleLines = regla => Object.entries(regla).map(([color, accion]) =>
 `<li data-shape="${COLORES[color].forma}" style="--tinta:${COLORES[color].tinta}"><i></i>${esc(COLORES[color].es)}: ${esc(ACCIONES[accion].es)} <span lang="en">${esc(ACCIONES[accion].en)}</span></li>`).join('');
function statueStep() {
 const {game, phase, part} = statues, now = game[phase];
 const stage = $('est-stage'), rule = $('est-rule'), shape = $('est-shape'), legend = $('est-legend');
 if (part < 0) {
  // The rule of the phase, on a sheet, for a few seconds.
  stage.style.background = '#142e30';
  shape.hidden = true; legend.hidden = true; rule.hidden = false;
  rule.innerHTML = `<p class="eyebrow">Ronda ${phase + 1} de ${game.length}</p><h2>${phase === 0 ? 'La regla' : '¡Cambia la regla!'}</h2><ul>${ruleLines(now.regla)}</ul><p class="fine">Miradla bien: ahora desaparece.</p>`;
  statues.part = 0;
  statueTimer = setTimeout(statueStep, RULE_MS);
  return;
 }
 if (part >= now.segmentos.length) {
  if (phase >= game.length - 1) {
   record('espejos', 'estatuas', 'partida', {rondas: game.length, ayuda: $('est-help').checked});
   stage.style.background = '#142e30'; shape.hidden = true; legend.hidden = true; rule.hidden = false;
   rule.innerHTML = '<h2>¡Hecho!</h2><p>Tres reglas distintas y seguís en pie. Respirad hondo.</p>';
   statueTimer = setTimeout(stopStatues, 4000);
   return;
  }
  statues.phase++; statues.part = -1; statueStep();
  return;
 }
 const segment = now.segmentos[part], colour = COLORES[segment.color];
 rule.hidden = true; shape.hidden = false;
 stage.style.background = colour.tinta;
 shape.dataset.shape = colour.forma;
 shape.querySelector('strong').textContent = colour.es;
 shape.querySelector('span').textContent = colour.en;
 legend.hidden = !$('est-help').checked;
 legend.innerHTML = ruleLines(now.regla);
 sound('tick');
 statues.part++;
 statueTimer = setTimeout(statueStep, segment.segundos * 1000);
}
$('est-start').addEventListener('click', () => {
 statues = {game: partida(), phase: 0, part: -1};
 $('est-stage').hidden = false; document.body.classList.add('practising');
 statueStep();
 $('est-close').focus();
});
$('est-close').addEventListener('click', stopStatues);
addEventListener('keydown', event => { if (event.key === 'Escape' && !$('est-stage').hidden) stopStatues(); });

// --- Mime in halves ------------------------------------------------------------------------------
const MIME = 20, SEEN = 'espejos-mimica';
let mime = null, half = 0, mimeLeft = MIME, mimeTimer = null, mimed = false;
const time = seconds => `0:${String(Math.max(0, seconds)).padStart(2, '0')}`;
const seenMoves = () => { try { const list = JSON.parse(sessionStorage.getItem(SEEN)); return Array.isArray(list) ? list : []; } catch { return []; } };
function stopMime() { clearInterval(mimeTimer); mimeTimer = null; }
function nextMime(swap) {
 if (swap && mimed && mime) record('espejos', 'mimica', 'ronda', {movimiento: mime.id});
 stopMime(); mimed = false; mimeLeft = MIME;
 if (swap) half = 1 - half;
 const seen = seenMoves();
 mime = siguienteMimica(seen);
 try { sessionStorage.setItem(SEEN, JSON.stringify(seen.length + 1 >= BARAJA.length ? [] : [...seen, mime.id])); } catch {}
 $('mim-turn').textContent = `Actúa la mitad ${'AB'[half]} · Adivina la mitad ${'BA'[half]}`;
 $('mim-art').src = art(mime.id);
 $('mim-en').textContent = mime.en; $('mim-es').textContent = mime.es;
 $('mim-seated').textContent = mime.sentada;
 $('mim-clock').textContent = time(mimeLeft);
 $('mim-clock-box').classList.remove('done');
 $('mim-start').firstElementChild.textContent = 'Empezar';
}
$('mim-start').addEventListener('click', () => {
 if (mimeTimer) { stopMime(); $('mim-start').firstElementChild.textContent = 'Seguir'; return; }
 if (mimeLeft <= 0) { mimeLeft = MIME; $('mim-clock-box').classList.remove('done'); }
 mimed = true;
 $('mim-start').firstElementChild.textContent = 'Pausar';
 mimeTimer = setInterval(() => {
  mimeLeft--; $('mim-clock').textContent = time(mimeLeft);
  if (mimeLeft > 0) return;
  stopMime(); sound('tick');
  $('mim-clock-box').classList.add('done');
  $('mim-start').firstElementChild.textContent = 'Repetir';
 }, 1000);
});
$('mim-next').addEventListener('click', () => nextMime(true));

// --- Choreography of eight counts -----------------------------------------------------------------------
const COUNT_MS = 1000;
let phrase = [], count = 0, loops = 0;
function drawPhrase(now = -1) {
 $('cor-phrase').innerHTML = Array.from({length: FRASE}, (_, index) => {
  const move = phrase[index] && byId(phrase[index]);
  return move ? `<li class="set${index === now ? ' now' : ''}"><b>${index * CUENTAS + 1}-${index * CUENTAS + CUENTAS}</b><img src="${art(move.id)}" alt="" width="160" height="160">${esc(move.es)}<small lang="en">${esc(move.en)}</small></li>`
   : `<li><b>${index * CUENTAS + 1}-${index * CUENTAS + CUENTAS}</b></li>`;
 }).join('');
}
function drawOffer() {
 const done = phrase.length >= FRASE;
 $('cor-count').textContent = done ? 'Coreografía completa · ocho tiempos' : `Elige la fila ${phrase.length + 1} · movimiento ${phrase.length + 1} de ${FRASE}`;
 $('cor-title').textContent = done ? 'Toda la clase a la vez' : '¿Cuál añadimos?';
 $('cor-offer').innerHTML = done ? '' : oferta(phrase).map(move => `<button type="button" class="sign" data-move="${move.id}"><img src="${art(move.id)}" alt="" width="160" height="160"><strong>${esc(move.es)}</strong><small lang="en">${esc(move.en)}</small></button>`).join('');
 $('cor-play').hidden = !phrase.length; $('cor-new').hidden = !done;
 $('cor-play').firstElementChild.textContent = done ? '¡A bailar!' : 'Ensayar lo que llevamos';
}
function newPhrase() { stopBeat(); phrase = []; drawPhrase(); drawOffer(); }
// Counts aloud on the screen while the place being danced lights up; `times` times through the phrase.
function dance(times) {
 stopBeat(); count = -1; loops = times;
 const total = phrase.length * CUENTAS;
 beat = setInterval(() => {
  count++;
  if (count >= total * loops) {
   stopBeat(); drawPhrase(); drawOffer();
   if (phrase.length >= FRASE) { record('espejos', 'coreografia', 'bailada', {movimientos: phrase.join('-')}); $('cor-title').textContent = '¡Coreografía hecha!'; }
   return;
  }
  const {indice, entra, numero} = enCuenta(phrase, count);
  drawPhrase(indice);
  $('cor-title').textContent = String(numero);
  sound(entra ? 'P' : 'tick');
 }, COUNT_MS);
}
$('cor-offer').addEventListener('click', event => {
 const button = event.target.closest('[data-move]');
 if (!button || phrase.length >= FRASE || beat) return;
 phrase.push(button.dataset.move);
 drawPhrase(); drawOffer();
 if (phrase.length >= FRASE) record('espejos', 'coreografia', 'creada', {movimientos: phrase.join('-')});
});
$('cor-play').addEventListener('click', () => { if (phrase.length && !beat) { $('cor-offer').innerHTML = ''; dance(phrase.length >= FRASE ? 4 : 2); } });
$('cor-new').addEventListener('click', newPhrase);

route();
