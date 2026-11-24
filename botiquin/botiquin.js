// El Botiquín: first aid practised by the whole class. What is taught lives in casos.js.
import {topBar, record} from '../comun/lugar.js';
import {PAS, CASOS, siguienteRonda, LATERAL, PAPELES, papelesDe, NORMAS_LATERAL, DE_VERDAD, LLAMADA} from './casos.js';

topBar('El Botiquín');
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const shuffle = list => { const out = [...list]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; };

// --- Views: the room and the three activities ---------------------------------------------
const VIEWS = {'': 'menu', pas: 'pas', lateral: 'lateral', llamada: 'llamada'};
function route() {
 const view = VIEWS[location.hash.slice(1)] || 'menu';
 document.body.dataset.view = view;
 for (const name of Object.values(VIEWS)) $('v-' + name).hidden = name !== view;
 stopClock();
 if (view === 'pas') startRound();
 if (view === 'lateral') showRules();
 if (view === 'llamada') nextCall(false);
 scrollTo(0, 0);
}
addEventListener('hashchange', route);

// --- PAS: three cases a round, three decisions a case -------------------------------------
// Which cases this device has already played, so that a round brings new ones first.
const SEEN = 'botiquin-vistos';
const seen = () => { try { const list = JSON.parse(localStorage.getItem(SEEN)); return Array.isArray(list) ? list.filter(id => CASOS.some(item => item.id === id)) : []; } catch { return []; } };
const remember = id => { const list = seen().filter(other => other !== id); list.push(id); try { localStorage.setItem(SEEN, JSON.stringify(list.length >= CASOS.length ? [] : list)); } catch {} };
let round = [], at = 0, step = 0, tries = 0, roundTries = 0;
function startRound() { round = siguienteRonda(seen()); at = 0; roundTries = 0; showCase(); }
function showCase() {
 const item = round[at];
 step = 0; tries = 0;
 $('pas-count').textContent = `Caso ${at + 1} de ${round.length}`;
 $('pas-title').textContent = item.titulo;
 $('pas-scene').textContent = item.escena;
 showStep();
}
function drawChips() {
 $('pas-chips').innerHTML = PAS.map((part, index) => `<li class="${index < step ? 'done' : index === step ? 'now' : ''}"><b>${part.letra}</b>${esc(part.es)}</li>`).join('');
}
function showStep() {
 const part = PAS[step], item = round[at];
 drawChips();
 $('pas-step').hidden = false;
 $('pas-letter').textContent = part.letra; $('pas-es').textContent = part.es; $('pas-en').textContent = part.en;
 $('pas-gesture').textContent = part.gesto; $('pas-seated').textContent = part.sentada;
 $('pas-question').textContent = part.pregunta;
 $('pas-options').innerHTML = shuffle(item.pasos[step].map((option, index) => ({option, index}))).map(({option, index}) =>
  `<button type="button" class="sign" data-option="${index}"><strong>${esc(option.texto)}</strong></button>`).join('');
 $('pas-feedback').textContent = ''; $('pas-feedback').classList.remove('miss');
 $('pas-next').hidden = true;
}
$('pas-options').addEventListener('click', event => {
 const button = event.target.closest('[data-option]');
 if (!button || button.disabled) return;
 const option = round[at].pasos[step][Number(button.dataset.option)];
 tries++; roundTries++;
 button.disabled = true;
 button.classList.add(option.bien ? 'right' : 'wrong');
 $('pas-feedback').classList.toggle('miss', !option.bien);
 $('pas-feedback').textContent = (option.bien ? 'Eso es. ' : 'Mejor no. ') + option.porque;
 if (!option.bien) return;
 for (const other of $('pas-options').querySelectorAll('[data-option]')) other.disabled = true;
 const last = step === PAS.length - 1;
 $('pas-next').firstElementChild.textContent = !last ? `Ahora, ${PAS[step + 1].es.toLowerCase()}` : at < round.length - 1 ? 'Otro caso' : 'Terminar';
 $('pas-next').hidden = false;
 $('pas-next').focus();
});
$('pas-next').addEventListener('click', () => {
 if (step < PAS.length - 1) { step++; showStep(); return; }
 // A case is done: protect, call, help, in that order. The tries travel as evidence, not as a mark.
 record('botiquin', 'pas', 'caso', {caso: round[at].id, intentos: tries});
 remember(round[at].id);
 if (at < round.length - 1) { at++; showCase(); return; }
 record('botiquin', 'pas', 'ronda', {casos: round.map(item => item.id).join('-'), aciertos: round.length * PAS.length, intentos: roundTries});
 step = PAS.length; drawChips();
 $('pas-count').textContent = `${round.length} casos resueltos`;
 $('pas-title').textContent = 'Proteger, avisar, socorrer';
 $('pas-scene').textContent = 'Siempre en ese orden: primero que no haya más peligro, después avisar a un adulto y, mientras llega, ayudar con lo que sabes.';
 $('pas-options').innerHTML = '<a class="sign gold" href="#pas" id="pas-again"><strong>Otra ronda</strong></a>';
 $('pas-question').textContent = '¿Seguimos?';
 $('pas-feedback').textContent = ''; $('pas-next').hidden = true;
 $('pas-again').addEventListener('click', event => { event.preventDefault(); startRound(); });
});

// --- Recovery position: in threes, three turns so that everybody plays every part ----------
// A plain drawing seen from above, head to the left and the helper below: provisional until the painted
// steps of arte/lotes/17-botiquin.json arrive.
function figure(index) {
 const side = index >= 4, mark = LATERAL[index].marca;
 const ink = '#1f5753', hot = '#d9703a';
 const limb = (points, on) => `<polyline points="${points}" fill="none" stroke="${on ? hot : ink}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
 const nearArm = index >= 1 ? '100,112 100,152 66,152' : '100,112 165,120';
 const farArm = side ? '102,98 122,114 86,116' : index >= 2 ? '100,90 126,104 86,112' : '100,88 165,80';
 const nearLeg = side ? '185,98 276,98' : '185,107 276,112';
 const farLeg = side ? '185,104 214,152 256,152' : index >= 3 ? '185,93 226,66 242,98' : '185,93 276,88';
 const head = index >= 5 ? [64, 98] : side ? [70, 104] : [70, 100];
 const helper = '<g transform="translate(150 190)"><circle cx="0" cy="-22" r="10" fill="#e9b783" stroke="#463e28" stroke-width="2"/><path d="M-13 12Q0-20 13 12Z" fill="#d9703a" stroke="#463e28" stroke-width="2"/></g>';
 const extras = {
  pecho: '<path d="M120 92q8-10 16 0M140 92q8-10 16 0" fill="none" stroke="#d9703a" stroke-width="4" stroke-linecap="round"/>',
  giro: '<path d="M236 60q34 30 6 76" fill="none" stroke="#d9703a" stroke-width="5" stroke-linecap="round"/><path d="M234 126l7 12 10-10" fill="none" stroke="#d9703a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
  cabeza: '<path d="M40 86q-14 12 0 26" fill="none" stroke="#d9703a" stroke-width="4" stroke-linecap="round"/><path d="M28 80q-18 18 0 38" fill="none" stroke="#d9703a" stroke-width="3" stroke-linecap="round" opacity=".6"/>',
 }[mark] || '';
 return `<rect x="34" y="40" width="264" height="132" rx="12" fill="#3aa79d" stroke="#1f6f69" stroke-width="3"/>
  ${limb(nearLeg, false)}${limb(farLeg, mark === 'pierna-lejos' || index === 5)}
  <line x1="92" y1="${side ? 102 : 100}" x2="185" y2="${side ? 101 : 100}" stroke="${ink}" stroke-width="${side ? 20 : 26}" stroke-linecap="round"/>
  ${limb(nearArm, mark === 'brazo-cerca')}${limb(farArm, mark === 'brazo-lejos')}
  <circle cx="${head[0]}" cy="${head[1]}" r="17" fill="#e9b783" stroke="#463e28" stroke-width="3"/>${extras}${helper}`;
}
let turn = 0, latStep = 0;
function showRules() {
 $('lat-norms').innerHTML = NORMAS_LATERAL.map(line => `<li>${esc(line)}</li>`).join('');
 $('lat-real').textContent = DE_VERDAD;
 $('lat-rules').hidden = false; $('lat-play').hidden = true;
}
function showLateral() {
 const item = LATERAL[latStep], roles = papelesDe(turn);
 $('lat-count').textContent = `Turno ${turn + 1} de ${PAPELES.length} · Paso ${latStep + 1} de ${LATERAL.length}`;
 $('lat-roles').innerHTML = roles.map((role, person) => `<li><b>${'ABC'[person]}</b> ${esc(role.toLowerCase())}</li>`).join('');
 $('lat-figure').innerHTML = figure(latStep);
 $('lat-title').textContent = item.es; $('lat-en').textContent = item.en; $('lat-text').textContent = item.texto;
 $('lat-prev').disabled = latStep === 0;
 const lastStep = latStep === LATERAL.length - 1;
 $('lat-next').firstElementChild.textContent = !lastStep ? 'Siguiente' : turn < PAPELES.length - 1 ? 'Cambio de papel' : 'Terminar';
 $('lat-status').textContent = '';
}
$('lat-start').addEventListener('click', () => { turn = 0; latStep = 0; $('lat-rules').hidden = true; $('lat-play').hidden = false; showLateral(); $('lat-next').focus(); });
$('lat-prev').addEventListener('click', () => { if (latStep > 0) { latStep--; showLateral(); } });
$('lat-next').addEventListener('click', () => {
 if (latStep < LATERAL.length - 1) { latStep++; showLateral(); return; }
 if (turn < PAPELES.length - 1) { turn++; latStep = 0; showLateral(); $('lat-status').textContent = 'Cambiad de papel: mirad las letras de arriba.'; return; }
 record('botiquin', 'lateral', 'practica', {turnos: PAPELES.length});
 $('lat-status').textContent = '¡Hecho! Los tres habéis pasado por los tres papeles.';
 $('lat-next').disabled = true;
 setTimeout(() => { $('lat-next').disabled = false; showRules(); }, 2600);
});

// --- The call: in pairs, back to back -------------------------------------------------------
const CALL = 45;
let callCase = null, left = CALL, ticking = null, called = false;
const time = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
function stopClock() { clearInterval(ticking); ticking = null; }
function nextCall(swap) {
 // Having rehearsed a call is written down once the clock has been started.
 if (swap && called && callCase) record('botiquin', 'llamada', 'ronda', {caso: callCase.id});
 stopClock(); called = false; left = CALL;
 const others = CASOS.filter(item => item !== callCase);
 callCase = others[Math.floor(Math.random() * others.length)];
 $('call-title').textContent = callCase.titulo;
 $('call-scene').textContent = `${callCase.escena} Estáis en ${callCase.donde}.`;
 $('call-script').innerHTML = LLAMADA.map(line => `<li>${esc(line.es)}<span lang="en">${esc(line.en)}</span></li>`).join('');
 $('call-clock').textContent = time(left);
 $('call-clock-box').classList.remove('done');
 $('call-start').firstElementChild.textContent = 'Empezar';
}
$('call-start').addEventListener('click', () => {
 if (ticking) { stopClock(); $('call-start').firstElementChild.textContent = 'Seguir'; return; }
 if (left <= 0) { left = CALL; $('call-clock-box').classList.remove('done'); }
 called = true;
 $('call-clock').textContent = time(left);
 $('call-start').firstElementChild.textContent = 'Pausar';
 ticking = setInterval(() => {
  left--;
  $('call-clock').textContent = time(Math.max(0, left));
  if (left > 0) return;
  stopClock();
  $('call-clock-box').classList.add('done');
  $('call-start').firstElementChild.textContent = 'Repetir';
 }, 1000);
});
$('call-next').addEventListener('click', () => nextCall(true));

route();
