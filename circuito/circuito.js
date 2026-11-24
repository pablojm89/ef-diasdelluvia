// El Circuito: orienteering with the plan of the gym. Four sheets, in the order the sport is taught.
// The gym as data and the rules are in plano.js; the drawings, in dibujos.js.
import {topBar, record, mode} from '../comun/lugar.js';
import {DIRS, PAREDES, OBJETOS, objeto, arriba, orientado, RELATIVAS, relativa, HOJAS, rondasPlano, rondasOrienta, pistasDe, rondasSenala, RECORRIDO, CARRERA, balizasDe} from './plano.js';
import {planoSVG, vistaSVG, balizaSVG} from './dibujos.js';
import {PINTADOS} from './assets/pintados.js';

topBar('El Circuito');
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const clase = () => mode() === 'pantalla';
const minus = text => text.charAt(0).toLowerCase() + text.slice(1);

// --- Sound: the punch of a control and the end of a run ---------------------------------------
let audio = null;
function beep(notes) {
 try {
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  for (const [delay, pitch] of notes) {
   const tone = audio.createOscillator(), level = audio.createGain(), at = audio.currentTime + delay;
   tone.frequency.value = pitch; level.gain.setValueAtTime(.08, at); level.gain.exponentialRampToValueAtTime(.001, at + .25);
   tone.connect(level).connect(audio.destination); tone.start(at); tone.stop(at + .27);
  }
 } catch {}
}

// --- The menu: four sheets on the wall ------------------------------------------------------------
$('hojas').innerHTML = HOJAS.map((hoja, index) => `<li><a class="sign big${index === 0 ? ' gold' : ''}" href="#${hoja.id}"><b>${index + 1}</b><strong>${esc(hoja.es)}</strong><small>${esc(hoja.que)}</small></a></li>`).join('');

// --- The plan in your hands --------------------------------------------------------------------------
// `giro` counts quarter turns and is never reduced, so that the sheet always turns the short way.
let giro = 0, marcas = {};
function drawPlan() {
 $('giro').innerHTML = planoSVG({marcas});
 $('giro').style.transform = `rotate(${giro * 90}deg)`;
}
function turn(delta) { giro += delta; $('giro').style.transform = `rotate(${giro * 90}deg)`; onTurn?.(); }
let onTurn = null;
$('turn-left').addEventListener('click', () => turn(-1));
$('turn-right').addEventListener('click', () => turn(1));
addEventListener('keydown', event => {
 if ($('v-hoja').hidden || $('turn-left').hidden || event.target.closest('button,a')) return;
 if (event.key === 'ArrowLeft') { turn(-1); event.preventDefault(); }
 if (event.key === 'ArrowRight') { turn(1); event.preventDefault(); }
});
const canTurn = yes => { $('turn-left').hidden = $('turn-right').hidden = !yes; };
// The gym seen from the floor: its painting when it exists, plain shapes meanwhile.
// All four or none: a painting next to plain shapes would give the answer away.
const PINTADAS = ['E', 'S', 'O'].every(dir => PINTADOS.includes('vista-' + dir));
function sightOf(mira, centro) {
 const painted = PINTADAS && !centro && (mira === 'N' ? '../gimnasio/assets/gym.webp' : `./assets/vista-${mira}.webp`);
 return painted ? `<img src="${painted}" alt="El gimnasio visto desde el suelo" width="1536" height="1024">` : `<svg class="vista" viewBox="0 0 400 260" role="img" aria-label="El gimnasio visto desde el suelo">${vistaSVG(mira, {centro})}</svg>`;
}

// --- Common to every sheet ----------------------------------------------------------------------------
let hoja = null, rondas = [], at = 0, aciertos = 0, intentos = 0, falloEnRonda = false, runTimer = null, extra = {};
const say = (text, miss = false) => { $('feedback').textContent = text; $('feedback').classList.toggle('miss', miss); };
function header(text) {
 $('hoja-count').textContent = `Hoja ${HOJAS.indexOf(hoja) + 1} · ${hoja.en}${rondas.length ? ` · ${Math.min(at + 1, rondas.length)} de ${rondas.length}` : ''}`;
 $('hoja-title').textContent = text;
}
function reset() {
 clearInterval(runTimer); runTimer = null; onTurn = null;
 $('next').hidden = true; $('options').innerHTML = ''; $('options').className = 'options';
 $('move').textContent = ''; $('task-en').textContent = ''; $('sight-note').textContent = '';
 $('plan').classList.remove('tocar');
 say('');
}
// Right at the first try counts as a hit; every answer counts as a try.
function answered(right) { intentos++; if (right && !falloEnRonda) aciertos++; if (!right) falloEnRonda = true; }
function nextRound() { at++; falloEnRonda = false; if (at >= rondas.length) finish(); else STEPS[hoja.id](); }
function offerNext(label = 'Siguiente') { $('next').firstElementChild.textContent = label; $('next').hidden = false; $('next').focus(); }
$('next').addEventListener('click', nextRound);
function finish() {
 reset(); canTurn(false);
 record('circuito', 'orientacion', 'hoja', {hoja: hoja.id, aciertos, rondas: rondas.length, intentos, ...extra});
 const index = HOJAS.indexOf(hoja), following = HOJAS[index + 1];
 header('Hoja terminada');
 if (hoja.id === 'recorrido') { $('sight').innerHTML = `<div class="paper" style="box-shadow:none">${cardMarkup()}</div>`; marcas = {controles: 'recorrido', ahora: at}; drawPlan(); }
 $('task').textContent = `${aciertos} de ${rondas.length} a la primera.`;
 $('task-en').textContent = aciertos === rondas.length ? 'Well done!' : 'Good. Try it again and beat yourself.';
 $('move').textContent = hoja.id === 'recorrido' ? 'En una carrera de verdad: siempre en pareja, sin salir de los límites y pasando por meta al volver.' : '';
 $('options').className = 'options tres';
 $('options').innerHTML = `<a class="sign" href="#${hoja.id}" id="again"><strong>Otra vez</strong></a>${following ? `<a class="sign gold" href="#${following.id}"><strong>Hoja ${index + 2}</strong><small>${esc(following.es)}</small></a>` : ''}`;
 $('again').addEventListener('click', event => { event.preventDefault(); start(hoja.id); });
 beep([[0, 660], [.14, 880], [.28, 1100]]);
}

// --- Sheet 1: from the gym to its plan ------------------------------------------------------------------
function stepPlano() {
 reset(); canTurn(false);
 const item = objeto(rondas[at]);
 header('Del gimnasio a su plano');
 $('sight').innerHTML = `<img src="../gimnasio/assets/gym.webp" alt="El gimnasio" width="1536" height="1024"><i class="ring" style="left:${item.cuadro[0] * 100}%;top:${item.cuadro[1] * 100}%"></i>`;
 $('sight-note').textContent = 'El plano es el gimnasio visto desde el techo. La canasta está en la pared de arriba.';
 $('task').textContent = `Toca en el plano: ${minus(item.es)}`;
 $('task-en').textContent = item.en;
 $('move').textContent = clase() ? 'Antes de tocar, señaladlo todos con el brazo en el cuadro.' : '';
 giro = 0; marcas = {}; drawPlan();
 $('plan').classList.add('tocar');
}
$('plan').addEventListener('click', event => {
 const target = event.target.closest('[data-obj]');
 if (!target || hoja?.id !== 'plano' || !$('next').hidden) return;
 const wanted = rondas[at], right = target.dataset.obj === wanted;
 answered(right);
 target.classList.add(right ? 'bien' : 'mal');
 if (!right) { say(`Eso es ${minus(objeto(target.dataset.obj).es)}. Mira qué forma tiene y junto a qué pared está.`, true); return; }
 $('plan').classList.remove('tocar');
 say(`Eso es: ${minus(objeto(wanted).es)}.`);
 beep([[0, 880]]);
 offerNext();
});

// --- Sheet 2: set the map -------------------------------------------------------------------------------
const LADO = ['arriba', 'a la derecha', 'abajo', 'a la izquierda'];
function stepOrienta() {
 reset(); canTurn(true);
 const {mira} = rondas[at];
 header('Orienta el plano');
 $('sight').innerHTML = sightOf(mira, false);
 $('sight-note').textContent = 'Estás pegado a una pared, mirando a la de enfrente.';
 $('task').textContent = 'Gira el plano hasta que lo que tienes delante quede arriba.';
 $('task-en').textContent = 'Turn the plan until it matches what you see.';
 $('move').textContent = clase() ? 'Todos con las manos planas, como si llevarais el plano: giradlo a la vez que la pantalla.' : 'El borde rojo del plano mira siempre a la pared de la canasta.';
 giro = rondas[at].giro; marcas = {}; drawPlan();
 $('options').innerHTML = '<button type="button" class="sign gold" id="check"><strong>¡Orientado!</strong><small lang="en">It is set</small></button>';
 $('check').addEventListener('click', checkOrienta);
}
function checkOrienta() {
 const {mira} = rondas[at], right = orientado(giro, mira);
 answered(right);
 if (right) {
  marcas = {tu: {x: {N: .5, E: .06, S: .5, O: .94}[mira], y: {N: .94, E: .5, S: .06, O: .5}[mira], mira}}; drawPlan();
  canTurn(false); $('options').innerHTML = '';
  say(`Eso es: delante tienes ${PAREDES[mira].es}, y en tu plano ha quedado arriba. Tú estás en el punto verde.`);
  beep([[0, 880]]); offerNext();
  return;
 }
 const where = LADO[(DIRS.indexOf(mira) - DIRS.indexOf(arriba(giro)) + 4) % 4];
 say(`Todavía no: delante tienes ${PAREDES[mira].es}, y en tu plano ha quedado ${where}.`, true);
 // After the first miss of a round: what did you look at? Saying it is what makes the next one better.
 if (extra.preguntado === at) return;
 extra.preguntado = at;
 const pistas = pistasDe(mira);
 $('options').innerHTML = `<p class="task">¿En qué te has fijado?</p>${pistas.map(pista => `<button type="button" class="sign" data-pista="${pista.id}"><strong>${esc(pista.es)}</strong></button>`).join('')}`;
 $('options').addEventListener('click', function pick(event) {
  const button = event.target.closest('[data-pista]');
  if (!button) return;
  $('options').removeEventListener('click', pick);
  extra.pistas = {...extra.pistas, [button.dataset.pista]: (extra.pistas?.[button.dataset.pista] || 0) + 1};
  say(button.dataset.pista === 'referencia' ? 'Buena pista. Búscala en el plano y gíralo hasta que quede arriba.' : `Fíjate en lo que tienes justo delante: ${PAREDES[mira].es}. Búscala en el plano y ponla arriba.`, button.dataset.pista !== 'referencia');
  $('options').innerHTML = '<button type="button" class="sign gold" id="check"><strong>¡Orientado!</strong><small lang="en">It is set</small></button>';
  $('check').addEventListener('click', checkOrienta);
 });
}

// --- Sheet 3: point to the control ------------------------------------------------------------------------
function stepSenala() {
 reset(); canTurn(true);
 const ronda = rondas[at];
 header('Señala la baliza');
 $('sight').innerHTML = sightOf(ronda.mira, true);
 $('sight-note').textContent = 'Estás en el círculo central, mirando hacia aquí. Lo que tienes detrás no lo ves.';
 $('task').textContent = 'La baliza está en el centro del círculo. ¿Dónde la tienes?';
 $('task-en').textContent = 'Where is the control?';
 $('move').textContent = `${clase() ? 'Todos a la vez: señaladla' : 'Señálala'} con el brazo, o gira el cuerpo hacia ella, y después toca. Sentados, con el brazo. Si dudas, orienta antes el plano.`;
 giro = ronda.giro; marcas = {controles: [ronda.objeto], tu: {x: .5, y: .5, mira: ronda.mira}}; drawPlan();
 $('giro').querySelector('.tu path').style.display = 'none';
 $('options').className = 'options cruz';
 $('options').innerHTML = RELATIVAS.map((item, index) => `<button type="button" class="sign" data-rel="${index}"><strong>${esc(item.es)}</strong><small lang="en">${esc(item.en)}</small></button>`).join('');
}
$('options').addEventListener('click', event => {
 const button = event.target.closest('[data-rel]');
 if (!button || button.disabled || hoja?.id !== 'senala') return;
 const ronda = rondas[at], good = relativa(ronda.mira, objeto(ronda.objeto).pared), right = Number(button.dataset.rel) === good;
 answered(right);
 button.disabled = true; button.classList.add(right ? 'right' : 'wrong');
 if (!right) { say(orientado(giro, ronda.mira) ? 'Mira otra vez: tú estás en el centro del plano y miras hacia arriba.' : 'Orienta antes el plano: gíralo hasta que lo que ves delante quede arriba.', true); return; }
 for (const other of $('options').querySelectorAll('[data-rel]')) other.disabled = true;
 $('giro').querySelector('.tu path').style.display = '';
 say(`Eso es: ${minus(RELATIVAS[good].es)}, en ${PAREDES[objeto(ronda.objeto).pared].es}.`);
 beep([[0, 880]]); offerNext();
});

// --- Sheet 4: the course ----------------------------------------------------------------------------------
function cardMarkup() {
 return `<ol class="card" aria-label="Tarjeta de control">${RECORRIDO.controles.map((_, index) => `<li class="${index < at ? 'picado' : ''}">${index < at ? '✓' : index + 1}</li>`).join('')}</ol>
  <ul class="lista">${RECORRIDO.controles.slice(0, at).map((control, index) => `<li><b>${index + 1}</b> · código ${objeto(control.objeto).codigo} · ${esc(objeto(control.objeto).es)} · <span lang="en">${esc(objeto(control.objeto).en)}</span></li>`).join('')}</ul>`;
}
function stepRecorrido() {
 reset(); canTurn(true);
 header('El recorrido');
 $('sight').innerHTML = `<div class="paper" style="box-shadow:none">${cardMarkup()}</div>`;
 $('sight-note').textContent = 'Tu tarjeta de control. El triángulo es la salida; los círculos, los controles, en orden; el círculo doble, la meta. Las líneas dicen el orden, no el camino.';
 $('task').textContent = `Control ${at + 1}: ¿qué baliza está en el centro del círculo ${at + 1}?`;
 $('task-en').textContent = 'Check the code before you punch.';
 if (at === 0) giro = 0;
 marcas = {controles: 'recorrido', ahora: at}; drawPlan();
 $('options').className = 'options tres';
 $('options').innerHTML = balizasDe(at).map(item => `<button type="button" class="sign" data-flag="${item.id}">${balizaSVG()}<span class="code">${item.codigo}</span><strong>${esc(item.es)}</strong><small lang="en">${esc(item.en)}</small></button>`).join('');
}
$('options').addEventListener('click', event => {
 const button = event.target.closest('[data-flag]');
 if (!button || button.disabled || hoja?.id !== 'recorrido') return;
 const control = RECORRIDO.controles[at], right = button.dataset.flag === control.objeto;
 answered(right);
 button.disabled = true; button.classList.add(right ? 'right' : 'wrong');
 if (!right) { say('Esa baliza no es la tuya. El control está en el centro del círculo: mira qué símbolo hay justo ahí.', true); return; }
 beep([[0, 990], [.1, 1320]]);
 run(at === RECORRIDO.controles.length - 1 ? 'la meta' : `el control ${at + 2}`);
});
// Think first, then run: a few seconds on the spot between one control and the next.
function run(towards) {
 let left = CARRERA;
 $('options').className = 'options';
 $('options').innerHTML = `<div class="run"><strong>¡Picado! Ahora corre hasta ${towards}</strong><output id="run-left">${left}</output><small>En el sitio. Sentados: brazos de carrera y talones.</small></div>`;
 say(`Código ${objeto(RECORRIDO.controles[at].objeto).codigo}: es el de tu descripción.`);
 runTimer = setInterval(() => {
  left--; $('run-left').textContent = Math.max(0, left);
  if (left > 0) return;
  clearInterval(runTimer); runTimer = null; beep([[0, 660]]);
  nextRound();
 }, 1000);
}

// --- Views ----------------------------------------------------------------------------------------------------
const STEPS = {plano: stepPlano, orienta: stepOrienta, senala: stepSenala, recorrido: stepRecorrido};
function start(id) {
 hoja = HOJAS.find(item => item.id === id);
 rondas = {plano: rondasPlano, orienta: rondasOrienta, senala: rondasSenala, recorrido: () => RECORRIDO.controles}[id]();
 at = 0; aciertos = 0; intentos = 0; falloEnRonda = false; extra = {};
 STEPS[id]();
}
function route() {
 const id = location.hash.slice(1), sheet = HOJAS.some(item => item.id === id);
 document.body.dataset.view = sheet ? 'hoja' : 'menu';
 $('v-menu').hidden = sheet; $('v-hoja').hidden = !sheet;
 clearInterval(runTimer); runTimer = null;
 if (sheet) start(id);
 scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
