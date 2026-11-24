// El bingo en movimiento. The class screen calls, each tablet holds one card, and cards can be printed.
// Cards come from their number (bingo-reglas.js), so nothing has to travel between devices.
import {topBar, record, mode} from '../comun/lugar.js';
import * as bingo from './bingo-reglas.js';
import {ZONAS, byId} from './movimientos.js';
import {figureIcon} from './dibujos.js';
import {$, esc, pintado, load, save, forget, countdown, chime} from './aula.js';

topBar('El Aula');
const view = $('view');
const room = pintado('aula');
if (room) { $('main').style.setProperty('--aula-bg', `url(${room}) 50% 100%`); $('main').style.setProperty('--aula-bg-size', 'cover'); }

const picture = (id, alt = '') => { const url = pintado('mov-' + id); return url ? `<img src="${url}" alt="${esc(alt)}" width="360" height="360">` : figureIcon(byId(id).zona); };
const zoneColour = id => ZONAS[byId(id).zona].colour;
const sizeLabel = size => `${size}×${size}`;
const numbers = Array.from({length: bingo.LAST_CARD - bingo.FIRST_CARD + 1}, (_, i) => bingo.FIRST_CARD + i);
const numberOptions = selected => numbers.map(n => `<option value="${n}"${n === selected ? ' selected' : ''}>${n}</option>`).join('');
const choiceRow = (name, values, current, label) => `<div class="choices" data-choice="${name}">${values.map(value =>
 `<button type="button" class="choice" data-value="${value}" aria-pressed="${value === current}">${label(value)}</button>`).join('')}</div>`;
function onChoice(name, pick) {
 const box = view.querySelector(`[data-choice="${name}"]`);
 box.addEventListener('click', event => {
  const button = event.target.closest('.choice');
  if (!button) return;
  for (const other of box.children) other.setAttribute('aria-pressed', other === button);
  pick(Number(button.dataset.value));
 });
}

// A card as markup. `cell(id, index)` adds per-cell classes; tablets get buttons, the screen and paper get divs.
function cardMarkup(card, {tag = 'div', small = false, cls = () => ''} = {}) {
 const size = Math.round(Math.sqrt(card.length));
 return `<div class="card${small ? ' small' : ''}" style="--n:${size}">${card.map((id, index) => {
  const move = byId(id);
  return `<${tag}${tag === 'button' ? ' type="button"' : ''} class="cell ${cls(id, index)}" data-id="${id}" style="--zone:${zoneColour(id)}"${tag === 'button' ? ` aria-pressed="false"` : ''}>
   ${small ? '' : picture(id)}<strong>${esc(move.es)}</strong>${small ? '' : `<span lang="en">${esc(move.en)}</span>`}</${tag}>`;
 }).join('')}</div>`;
}

// --- Class screen: setup ---------------------------------------------------------------
let caller = null, clock = null;
function showCallerSetup() {
 const saved = load('bingo', bingo.validCaller), pick = {size: 3, goal: 10};
 view.className = 'view wall-inner';
 view.innerHTML = `<div class="setup paper">
   <header class="setup-head"><h1>El bingo en movimiento</h1>
   <p class="lead">La pantalla canta un movimiento y <b>toda la clase lo hace</b>. Quien lo tiene en su cartón, lo marca.</p></header>
   ${saved ? `<div class="start-row"><button type="button" id="resume" class="sign gold big"><strong>Seguir la partida guardada</strong><span class="fine">${saved.called.length} cantados · cartones de ${sizeLabel(saved.size)}</span></button></div>` : ''}
   <fieldset><legend class="field-label">Cartones</legend>${choiceRow('size', bingo.SIZES, pick.size, sizeLabel)}</fieldset>
   <fieldset><legend class="field-label">Meta de la clase: líneas entre todos</legend>${choiceRow('goal', bingo.GOALS, pick.goal, value => `${value}<small>líneas</small>`)}</fieldset>
   <p class="fine" style="text-align:center">Cada alumno o pareja abre su cartón en la tableta (El Aula → «Abrir mi cartón») con el número que le deis, o lo usa impreso. Los cartones van del ${bingo.FIRST_CARD} al ${bingo.LAST_CARD}.</p>
   <div class="start-row"><button type="button" id="start" class="sign gold big"><strong>Empezar a cantar</strong></button><a class="sign" href="#imprimir=1-12&amp;tam=3"><strong>Imprimir cartones</strong></a></div>
  </div>`;
 onChoice('size', value => { pick.size = value; view.querySelector('a.sign').href = `#imprimir=1-12&tam=${value}`; });
 onChoice('goal', value => { pick.goal = value; });
 $('start').addEventListener('click', () => { caller = bingo.newCaller(pick); save('bingo', caller); showCaller(); });
 $('resume')?.addEventListener('click', () => { caller = saved; showCaller(); });
}

// --- Class screen: calling ---------------------------------------------------------------
function showCaller() {
 view.className = 'view caller';
 view.innerHTML = `<section class="call waiting" id="call" aria-live="polite"></section>
  <aside class="side" aria-label="Marcador de la clase">
   <p class="eyebrow">Cartones de ${sizeLabel(caller.size)}</p>
   <div class="goal"><span class="field-label">Entre todos</span><strong id="goal-count"></strong><div class="goal-bar"><span id="goal-bar"></span></div><span class="fine" id="goal-note"></span></div>
   <div><span class="field-label" id="called-label"></span><ul class="called-list" id="called"></ul></div>
   <div class="check">
    <div class="check-row"><label>Cartón<select id="check-number" class="number">${numberOptions(1)}</select></label><button type="button" id="check" class="sign"><strong>Comprobar</strong></button></div>
    <div class="check-result" id="check-result" role="status"></div>
   </div>
   <div class="side-links"><a class="quiet" href="#imprimir=1-12&amp;tam=${caller.size}">Imprimir</a><button type="button" id="end">Terminar partida</button></div>
  </aside>`;
 $('check').addEventListener('click', checkCard);
 $('end').addEventListener('click', endCaller);
 drawCall(caller.called.at(-1));
 drawScore();
}
function drawCall(id) {
 const box = $('call'), left = caller.order.length - caller.called.length;
 if (!id) {
  box.className = 'call waiting';
  box.innerHTML = `<p class="eyebrow">Preparad los cartones</p><h2>¿Listos?</h2><p class="challenge-text">Cada movimiento dura entre 15 y 20 segundos. Lo hace toda la clase, lo tenga o no.</p>
   <div class="call-actions"><button type="button" id="next" class="sign gold big"><strong>Cantar el primer movimiento</strong></button></div>`;
 } else {
  const move = byId(id);
  box.className = 'call';
  box.style.setProperty('--zone', zoneColour(id));
  box.innerHTML = `<div class="call-art">${picture(id, move.es)}</div>
   <div><p class="eyebrow">Movimiento ${caller.called.length} de ${caller.order.length} · ${esc(ZONAS[move.zona].name)}</p>
    <h2>${esc(move.es)}</h2><p class="en" lang="en">${esc(move.en)}</p>
    <p class="challenge-text">${esc(move.texto)}</p>
    <p class="seated-box"><strong>Variante sentada</strong><span>${esc(move.sentada)}</span></p>
    <div class="clock"><output id="call-clock"></output><button type="button" id="call-start" class="sign"><strong>Empezar</strong></button></div>
    <p class="status" id="call-status" role="status"></p>
    <div class="call-actions">${left ? `<button type="button" id="next" class="sign gold big"><strong>Cantar el siguiente</strong></button>` : '<p class="news">Ya se han cantado todos los movimientos.</p>'}</div></div>`;
  clock = countdown($('call-clock'), $('call-start'), () => { $('call-status').textContent = '¡Tiempo! Quien lo tenga, que lo marque.'; });
  clock.set(move.segundos);
 }
 $('next')?.addEventListener('click', () => {
  clock?.stop();
  const step = bingo.callNext(caller);
  caller = step.state; save('bingo', caller);
  drawCall(step.id); drawScore();
  chime([[0, 784], [.12, 988]]);
  clock?.start();
 });
}
function drawScore() {
 const lines = bingo.classLines(caller);
 $('goal-count').textContent = `${lines} de ${caller.goal} líneas`;
 $('goal-bar').style.width = Math.min(100, lines / caller.goal * 100) + '%';
 $('goal-note').textContent = lines >= caller.goal ? '¡Meta de clase conseguida!' : caller.bingos.length ? `Bingos: cartón ${caller.bingos.join(', ')}` : 'Cada línea comprobada suma para toda la clase.';
 $('called-label').textContent = `Cantados: ${caller.called.length} de ${caller.order.length}`;
 $('called').innerHTML = caller.called.map(id => `<li style="--zone:${zoneColour(id)}">${esc(byId(id).es)}</li>`).join('');
 $('called').scrollTop = $('called').scrollHeight;
}
function checkCard() {
 const number = Number($('check-number').value), before = bingo.classLines(caller);
 const result = bingo.checkCard(caller, number);
 caller = result.state; save('bingo', caller);
 const done = new Set(bingo.linesOf(caller.size).filter((_, i) => result.lines.includes(i)).flat());
 const verdict = result.bingo ? '¡Bingo! Todo el cartón está cantado.' : result.lines.length
  ? `${result.lines.length === 1 ? 'Una línea' : result.lines.length + ' líneas'} correcta${result.lines.length === 1 ? '' : 's'}${result.fresh.length ? ` · suma${result.fresh.length === 1 ? '' : 'n'} ${result.fresh.length} a la clase` : ' · ya estaba contada'}.`
  : 'Todavía no hay línea: faltan movimientos por cantar.';
 $('check-result').innerHTML = `<p><b>Cartón ${number}.</b> ${esc(verdict)}</p>${cardMarkup(result.card, {small: true, cls: (id, i) => `${caller.called.includes(id) ? 'called' : ''} ${done.has(i) ? 'in-line' : ''}`})}`;
 drawScore();
 if (bingo.classLines(caller) > before) chime([[0, 660], [.12, 880], [.24, 1047]]);
}
function endCaller() {
 if (!confirm('¿Terminar el bingo? Se borra la partida guardada.')) return;
 clock?.stop();
 record('aula', 'bingo', 'partida', {cantados: caller.called.length, tamano: sizeLabel(caller.size).replace('×', 'x')});
 forget('bingo'); caller = null;
 showCallerSetup();
}

// --- A pupil's tablet: one card --------------------------------------------------------------
function showCard(number, size) {
 const card = bingo.cardFor(number, size), key = `carton-${number}-${size}`;
 let marked = new Set((load(key, value => Array.isArray(value)) || []).filter(id => card.includes(id)));
 let shown = {lines: 0, bingo: false};
 const finished = () => record('aula', 'bingo', 'carton', {carton: number, lineas: bingo.completeLines(card, marked).length, bingo: bingo.isBingo(card, marked)});
 view.className = 'view wall-inner';
 view.innerHTML = `<div class="pupil">
  <div class="pupil-head"><div><p class="eyebrow" style="text-align:left">Bingo en movimiento · ${sizeLabel(size)}</p><h1>Cartón ${number}</h1></div><a class="quiet" href="#elegir">Cambiar de cartón</a></div>
  <p class="fine">Haz cada movimiento que cante la pantalla. Si lo tienes, tócalo para marcarlo.</p>
  <div id="card">${cardMarkup(card, {tag: 'button'})}</div>
  <p class="banner" id="banner" hidden></p>
  <p class="status" id="card-status" role="status"></p>
  <div class="start-row"><button type="button" id="clear" class="sign"><strong>Borrar marcas</strong></button><button type="button" id="finish" class="sign gold"><strong>He terminado</strong></button></div>
 </div>`;
 const paint = (celebrate = false) => {
  const lines = bingo.completeLines(card, marked), full = bingo.isBingo(card, marked);
  const inLine = new Set(bingo.linesOf(size).filter((_, i) => lines.includes(i)).flat());
  view.querySelectorAll('.cell').forEach((cell, index) => {
   const on = marked.has(cell.dataset.id);
   cell.classList.toggle('marked', on); cell.classList.toggle('in-line', inLine.has(index));
   cell.setAttribute('aria-pressed', on);
  });
  $('banner').hidden = !lines.length;
  $('banner').textContent = full ? `¡BINGO! Avisa a la pantalla: cartón ${number}.` : `¡${lines.length === 1 ? 'Línea' : lines.length + ' líneas'}! Avisa a la pantalla: cartón ${number}.`;
  $('card-status').textContent = `${marked.size} de ${card.length} marcados`;
  if (celebrate && (lines.length > shown.lines || (full && !shown.bingo))) chime(full ? [[0, 523], [.15, 659], [.3, 784], [.45, 1047]] : [[0, 660], [.14, 880]]);
  if (full && !shown.bingo) finished();
  shown = {lines: lines.length, bingo: full};
 };
 $('card').addEventListener('click', event => {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  if (marked.has(cell.dataset.id)) marked.delete(cell.dataset.id); else marked.add(cell.dataset.id);
  save(key, [...marked]);
  paint(true);
 });
 $('clear').addEventListener('click', () => { if (!marked.size || confirm('¿Borrar todas las marcas de este cartón?')) { marked = new Set(); save(key, []); paint(); } });
 $('finish').addEventListener('click', () => { finished(); $('card-status').textContent = '¡Bien hecho! Ya está anotado.'; });
 // A card reopened with a bingo already marked is not recorded twice.
 shown = {lines: bingo.completeLines(card, marked).length, bingo: bingo.isBingo(card, marked)};
 paint();
}

// --- A pupil picks a card ----------------------------------------------------------------------
function showPicker() {
 const pick = {size: 3};
 view.className = 'view wall-inner';
 view.innerHTML = `<div class="picker paper"><p class="eyebrow">Bingo en movimiento</p><h1>Elige tu cartón</h1>
  <p>Usa el número que te ha dado tu profe.</p>
  <fieldset><legend class="field-label">Tamaño</legend>${choiceRow('size', bingo.SIZES, pick.size, sizeLabel)}</fieldset>
  <label class="field-label" for="pick-number">Número de cartón</label>
  <div class="start-row"><select id="pick-number" class="number">${numberOptions(1)}</select></div>
  <div class="start-row"><button type="button" id="open" class="sign gold big"><strong>Abrir mi cartón</strong></button></div></div>`;
 onChoice('size', value => { pick.size = value; });
 $('open').addEventListener('click', () => { location.hash = `carton=${$('pick-number').value}&tam=${pick.size}`; });
}

// --- Printing ----------------------------------------------------------------------------------
function showPrint(from, to, size) {
 view.className = 'view wall-inner';
 view.innerHTML = `<div class="print-tools paper no-print">
   <label class="field-label">Del cartón <select id="from" class="number">${numberOptions(from)}</select></label>
   <label class="field-label">al <select id="to" class="number">${numberOptions(to)}</select></label>
   ${choiceRow('size', bingo.SIZES, size, sizeLabel)}
   <button type="button" id="print" class="sign gold"><strong>Imprimir</strong></button>
   <a class="quiet" href="${mode() === 'pantalla' ? '#cantar' : './'}">Volver</a>
   <p class="fine" style="width:100%;text-align:center">${size === 3 ? 'Seis' : 'Cuatro'} cartones por hoja, en blanco y negro.</p></div>
  <div class="print-sheet n${size}">${Array.from({length: to - from + 1}, (_, i) => from + i).map(n =>
   `<article class="print-card"><header><span>Cartón ${n}</span><small>Bingo en movimiento · ${sizeLabel(size)}</small></header>${cardMarkup(bingo.cardFor(n, size))}</article>`).join('')}</div>`;
 const go = (a, b, s) => { location.hash = `imprimir=${Math.min(a, b)}-${Math.max(a, b)}&tam=${s}`; };
 $('from').addEventListener('change', () => go(Number($('from').value), to, size));
 $('to').addEventListener('change', () => go(from, Number($('to').value), size));
 onChoice('size', value => go(from, to, value));
 $('print').addEventListener('click', () => print());
}

// --- Routes -----------------------------------------------------------------------------------
function route() {
 clock?.stop();
 const hash = location.hash.slice(1), params = new URLSearchParams(hash);
 const size = bingo.SIZES.includes(Number(params.get('tam'))) ? Number(params.get('tam')) : 3;
 if (params.has('carton')) {
  const number = Number(params.get('carton'));
  if (bingo.validCard(number, size)) return showCard(number, size);
  return showPicker();
 }
 if (params.has('imprimir')) {
  const [a, b] = (params.get('imprimir') || '').split('-').map(Number);
  const from = bingo.validCard(a, size) ? a : 1, to = bingo.validCard(b, size) ? Math.max(from, Math.min(b, from + 47)) : from + 11;
  return showPrint(from, Math.min(to, bingo.LAST_CARD), size);
 }
 if (hash === 'elegir') return showPicker();
 if (hash === 'cantar' || mode() === 'pantalla') {
  caller = load('bingo', bingo.validCaller);
  return caller && hash === 'cantar' && caller.called.length ? showCaller() : showCallerSetup();
 }
 showPicker();
}
addEventListener('hashchange', () => { route(); scrollTo(0, 0); });
route();
