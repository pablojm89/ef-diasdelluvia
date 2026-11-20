// El Tatami: learn the poses, build a sequence (alone or taking turns) and practise it with the whole class.
import {topBar, record, mode} from '../comun/lugar.js';
import {POSES, CALM, BREATH, SIDES, SAMPLES, byId} from './posturas.js';
import * as S from './secuencia.js';
import {createFigure, sceneMarkup, painted, sheetUrl} from './figura.js';
import {PINTADAS} from './assets/pintadas.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const screen = mode() === 'pantalla';
const store = (() => { try { return localStorage; } catch { return {getItem: () => null, setItem() {}}; } })();

topBar('El Tatami');
if (screen) {
 document.body.classList.add('screen');
 $('lead').textContent = 'Aprended las posturas, cread la secuencia de la clase entre todos y hacedla juntos.';
 $('t-crear').textContent = 'Secuencia de la clase';
}

// Small static picture of a pose, painted or provisional.
const thumbs = new Map();
function thumb(id) {
 if (!thumbs.has(id)) thumbs.set(id, painted(id)
  ? `<span class="thumb painted" style="background-image:url('${sheetUrl(id)}')"></span>`
  : `<svg class="thumb" viewBox="16 150 480 470" aria-hidden="true">${sceneMarkup(id, 2)}</svg>`);
 return thumbs.get(id);
}
const name = id => byId(id) || CALM;

// --- Views --------------------------------------------------------------------------
const VIEWS = ['aprender', 'crear', 'practicar'];
function show(view) {
 for (const v of VIEWS) $('v-' + v).hidden = v !== view;
 for (const tab of document.querySelectorAll('.tab')) {
  if (tab.dataset.tab === view) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
 }
 if (view === 'practicar') renderChoices();
}
function route() {
 const shared = S.fromHash(location.hash);
 if (shared) {
  setSequence(shared);
  status(`Secuencia abierta: ${S.encode(shared)}.`);
  history.replaceState(null, '', '#crear');
  show('crear');
  return;
 }
 const view = location.hash.slice(1);
 show(VIEWS.includes(view) ? view : 'aprender');
}

// --- Learn ----------------------------------------------------------------------------
$('poses').innerHTML = POSES.map((pose, i) => `<li><button type="button" class="pose-card" data-i="${i}">
 <span class="pose-pic">${thumb(pose.id)}</span><span class="pose-names"><strong>${esc(pose.es)}</strong><span lang="en">${esc(pose.en)}</span></span></button></li>`).join('');
$('poses').addEventListener('click', event => {
 const card = event.target.closest('.pose-card');
 if (card) openCard(Number(card.dataset.i));
});

const cardFigure = createFigure($('card-figure'));
let cardIndex = 0, cardRun = 0;
const seen = new Set();
function drawCard(t) {
 const pose = POSES[cardIndex];
 cardFigure.set(pose.id, t, {chair: $('card-chair').checked, name: `${pose.es}, dibujo de la postura`});
}
function openCard(index) {
 cardIndex = (index + POSES.length) % POSES.length;
 const pose = POSES[cardIndex];
 $('card-num').textContent = `Postura ${cardIndex + 1} de ${POSES.length}`;
 $('card-es').textContent = pose.es;
 $('card-en').textContent = pose.en;
 $('card-steps').innerHTML = pose.steps.map(step => `<li>${esc(step.es)} <span lang="en">${esc(step.en)}</span></li>`).join('');
 $('card-exit').innerHTML = `${esc(pose.exit.es)} <span lang="en">${esc(pose.exit.en)}</span>`;
 $('card-feel').textContent = pose.feel;
 $('card-safety').textContent = pose.safety;
 $('card-breaths').textContent = `Respiraciones: ${pose.breaths}${pose.sides ? ' por cada lado' : ''}.`;
 $('card-chair-text').textContent = pose.chair;
 if (!$('card').open) $('card').showModal();
 playCard();
}
// Coming in, holding the pose, coming out. Seeing it through once counts as having seen the card.
function playCard() {
 const run = ++cardRun, pose = POSES[cardIndex], phases = [[0, 2, 2600, 'Entrada', 'Coming in'], [2, 2, 1600, 'Postura', 'Hold'], [2, 0, 2200, 'Salida', 'Coming out']];
 let phase = 0, start = performance.now();
 $('card-play').disabled = true;
 const tick = now => {
  if (run !== cardRun || !$('card').open) return;
  const [from, to, length, es, en] = phases[phase];
  let p = Math.min(1, (now - start) / length);
  if (still()) p = p < 1 ? 0 : 1;
  $('card-phase').innerHTML = `${es} · <span lang="en">${en}</span>`;
  drawCard(from + (to - from) * p);
  if (p >= 1) {
   phase++; start = now;
   if (phase === phases.length) {
    $('card-play').disabled = false;
    $('card-phase').textContent = '';
    drawCard(2);
    if (!seen.has(pose.id)) { seen.add(pose.id); record('tatami', 'yoga', 'postura', {id: pose.id}); }
    return;
   }
  }
  requestAnimationFrame(tick);
 };
 requestAnimationFrame(tick);
}
$('card-play').addEventListener('click', playCard);
$('card-chair').addEventListener('change', playCard);
$('card-prev').addEventListener('click', () => openCard(cardIndex - 1));
$('card-next').addEventListener('click', () => openCard(cardIndex + 1));
$('card-add').addEventListener('click', () => {
 addPose(POSES[cardIndex].id);
 $('card').close();
 location.hash = '#crear';
});
$('card').addEventListener('close', () => { cardRun++; });

// --- Create ---------------------------------------------------------------------------
let sequence = S.loadDraft(store), turns = null;
const created = new Set();

$('palette').innerHTML = POSES.map(pose => `<li><button type="button" class="palette-item" data-id="${pose.id}" aria-label="Añadir ${esc(pose.es)}">
 ${thumb(pose.id)}<span><strong>${esc(pose.es)}</strong><span lang="en">${esc(pose.en)}</span></span></button></li>`).join('');
$('palette').addEventListener('click', event => {
 const item = event.target.closest('.palette-item');
 if (item) addPose(item.dataset.id);
});

function status(text) { $('seq-status').textContent = text; }
function setSequence(next) {
 sequence = next;
 S.saveDraft(store, sequence);
 renderSequence();
}
function addPose(id) {
 if (turns && S.turn(turns, sequence.length - turns.base).done) return status('La secuencia ya está completa.');
 if (sequence.length >= S.MAX) return status(`Como mucho ${S.MAX} posturas.`);
 setSequence(S.add(sequence, id));
 status(`${byId(id).es} añadida.`);
}
function noteCreated(list) {
 const code = S.encode(list);
 if (!code || created.has(code)) return;
 created.add(code);
 record('tatami', 'yoga', 'secuencia-creada', {posturas: list.join('-'), codigo: code, n: list.length});
}

function renderSequence(focus) {
 $('sequence').innerHTML = sequence.map((id, i) => `<li class="seq-item">
  <span class="num">${i + 1}</span>${thumb(id)}<span class="names"><strong>${esc(byId(id).es)}</strong><span lang="en">${esc(byId(id).en)}</span></span>
  <span class="tools"><button type="button" data-act="up" data-i="${i}" aria-label="Mover ${esc(byId(id).es)} antes" ${i === 0 ? 'disabled' : ''}>◀</button><button type="button" data-act="down" data-i="${i}" aria-label="Mover ${esc(byId(id).es)} después" ${i === sequence.length - 1 ? 'disabled' : ''}>▶</button><button type="button" data-act="remove" data-i="${i}" aria-label="Quitar ${esc(byId(id).es)}">✕</button></span></li>`).join('');
 $('seq-empty').hidden = sequence.length > 0;
 $('seq-help').hidden = sequence.length < 2;
 $('seq-count').textContent = sequence.length ? `${sequence.length} ${sequence.length === 1 ? 'postura' : 'posturas'}` : '';
 $('code').textContent = S.encode(sequence) || '—';
 for (const id of ['seq-practise', 'seq-save', 'seq-clear', 'copy-link']) $(id).disabled = !sequence.length;
 if (focus) $('sequence').querySelector(focus)?.focus();
 renderTurn();
}
$('sequence').addEventListener('click', event => {
 const button = event.target.closest('button[data-act]');
 if (!button) return;
 const i = Number(button.dataset.i), act = button.dataset.act;
 if (act === 'remove') {
  setSequence(S.removeAt(sequence, i));
  renderSequence(`[data-i="${Math.min(i, sequence.length - 1)}"][data-act="remove"]`);
  status('Postura quitada.');
 } else {
  const to = i + (act === 'up' ? -1 : 1);
  setSequence(S.move(sequence, i, act === 'up' ? -1 : 1));
  renderSequence(`[data-i="${to}"][data-act="${to === 0 || to === sequence.length - 1 ? 'remove' : act}"]`);
  status(`Ahora es la postura ${to + 1}.`);
 }
});
$('seq-save').addEventListener('click', () => {
 S.save(store, sequence);
 noteCreated(sequence);
 renderSaved();
 status(`Guardada en este ordenador con el código ${S.encode(sequence)}.`);
});
$('seq-clear').addEventListener('click', () => {
 turns = null;
 setSequence([]);
 status('Fila vacía: empieza otra secuencia.');
});
$('seq-practise').addEventListener('click', () => {
 noteCreated(sequence);
 startPractice(sequence);
});
$('copy-link').addEventListener('click', async () => {
 const link = location.href.split('#')[0] + S.hashFor(sequence);
 try { await navigator.clipboard.writeText(link); status('Enlace copiado. Ábrelo en la pantalla digital o escribe allí el código.'); }
 catch { status(`Escribe este código en la pantalla digital: ${S.encode(sequence)}`); }
});
$('code-form').addEventListener('submit', event => {
 event.preventDefault();
 const found = S.decode($('code-input').value);
 if (!found) return status('Ese código no es válido. Son las letras de las posturas, por ejemplo MSUD-TM.');
 const append = event.submitter?.value === 'append';
 setSequence(append ? S.append(sequence, found) : found);
 $('code-input').value = '';
 status(append ? `Añadidas ${found.length} posturas al final.` : `Secuencia abierta: ${S.encode(found)}.`);
});

// Taking turns on the class screen: whose turn it is, never who.
$('turn-kind').addEventListener('change', () => { $('turn-teams-label').hidden = $('turn-kind').value !== 'equipos'; });
$('turn-setup').addEventListener('submit', event => {
 event.preventDefault();
 turns = {kind: $('turn-kind').value, teams: Number($('turn-teams').value), total: Number($('turn-total').value), base: 0};
 setSequence([]);
 status('');
 $('turn').scrollIntoView({block: 'nearest', behavior: still() ? 'auto' : 'smooth'});
});
$('turn-undo').addEventListener('click', () => { if (sequence.length > turns.base) setSequence(sequence.slice(0, -1)); });
$('turn-stop').addEventListener('click', () => { turns = null; renderSequence(); });
function renderTurn() {
 $('turn').hidden = !turns;
 $('turn-setup').hidden = !!turns;
 if (!turns) return;
 const now = S.turn(turns, sequence.length - turns.base);
 $('turn-es').textContent = now.es;
 $('turn-en').textContent = now.en;
 $('turn-count').textContent = now.done ? `${now.total} posturas` : `Postura ${now.number} de ${now.total}`;
 $('turn').dataset.team = now.team || '';
 $('turn').classList.toggle('done', now.done);
 $('turn-undo').disabled = sequence.length <= turns.base;
 for (const button of $('palette').querySelectorAll('button')) button.disabled = now.done;
 if (now.done) noteCreated(sequence);
}

function renderSaved() {
 const list = S.savedList(store);
 $('saved').innerHTML = list.map(item => `<li><span class="saved-code">${esc(item.code)}</span><span class="saved-names">${S.decode(item.code).map(id => esc(byId(id).es)).join(' · ')}</span>
  <span class="saved-tools"><button type="button" class="sign" data-open="${esc(item.code)}"><strong>Abrir</strong></button><button type="button" class="sign danger" data-forget="${esc(item.code)}" aria-label="Borrar ${esc(item.code)}"><strong>Borrar</strong></button></span></li>`).join('');
 $('saved-empty').hidden = list.length > 0;
}
$('saved').addEventListener('click', event => {
 const open = event.target.closest('[data-open]'), drop = event.target.closest('[data-forget]');
 if (open) { turns = null; setSequence(S.decode(open.dataset.open)); status(`Secuencia abierta: ${open.dataset.open}.`); $('sequence').scrollIntoView({block: 'nearest'}); }
 if (drop) { S.forget(store, drop.dataset.forget); renderSaved(); }
});

// --- Practise: choosing ------------------------------------------------------------------
const settings = S.loadSettings(store);
$('opt-chair').checked = settings.chair;
$('opt-beat').value = String(settings.beat);
const keepSettings = () => S.saveSettings(store, {chair: $('opt-chair').checked, beat: Number($('opt-beat').value)});
$('opt-chair').addEventListener('change', keepSettings);
$('opt-beat').addEventListener('change', keepSettings);

function renderChoices() {
 const choices = [];
 if (sequence.length) choices.push({name: screen ? 'La secuencia de la clase' : 'Mi secuencia', detail: 'La que está en Crear', poses: sequence});
 choices.push(...SAMPLES);
 for (const item of S.savedList(store)) choices.push({name: `Guardada · ${item.code}`, detail: 'En este ordenador', poses: S.decode(item.code)});
 $('choices').innerHTML = choices.map((choice, i) => `<li class="choice"><div class="choice-text"><strong>${esc(choice.name)}</strong><span class="fine">${esc(choice.detail)} · ${choice.poses.length} posturas · unos ${Math.round(S.seconds(S.plan(choice.poses, {beat: Number($('opt-beat').value)})) / 60)} min</span></div>
  <div class="strip" aria-label="${esc(choice.poses.map(id => byId(id).es).join(', '))}">${choice.poses.map(thumb).join('')}</div>
  <button type="button" class="sign gold" data-choice="${i}"><strong>Practicar</strong></button></li>`).join('');
 $('choices').onclick = event => {
  const button = event.target.closest('[data-choice]');
  if (button) startPractice(choices[Number(button.dataset.choice)].poses);
 };
}
$('opt-beat').addEventListener('change', renderChoices);

// --- Practise: the guided session ----------------------------------------------------------
const stageFigure = createFigure($('st-figure'));
const room = PINTADAS.includes('room') ? './assets/room.webp' : '../gimnasio/assets/gym.webp';
$('stage').style.setProperty('--room', `url('${room}')`);
if (PINTADAS.includes('robles-yoga')) $('st-host').src = './assets/robles-yoga.webp';

let run = null;
function startPractice(ids) {
 if (!ids.length) return;
 const beat = Number($('opt-beat').value) || 4;
 run = {ids: [...ids], steps: S.plan(ids, {beat}), at: 0, elapsed: 0, practised: 0, paused: false, last: performance.now(), done: false, frame: 0};
 $('st-chair').checked = $('opt-chair').checked;
 $('st-chips').innerHTML = ids.map((id, i) => `<li data-i="${i}">${i + 1}</li>`).join('');
 $('stage').hidden = false;
 document.body.classList.add('practising');
 $('st-pause').focus();
 setPaused(false);
 enterStep();
 run.frame = requestAnimationFrame(loop);
}
function stopPractice() {
 if (!run) return;
 cancelAnimationFrame(run.frame);
 run = null;
 $('stage').hidden = true;
 document.body.classList.remove('practising');
 if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
}
function setPaused(paused) {
 run.paused = paused;
 $('st-pause').textContent = paused ? 'Seguir' : 'Pausa';
 $('st-pause').setAttribute('aria-pressed', String(paused));
 $('stage').classList.toggle('paused', paused);
}
function enterStep() {
 const step = run.steps[run.at], pose = name(step.pose), calm = step.pose === CALM.id;
 $('st-progress').textContent = calm ? 'Vuelta a la calma' : `Postura ${step.index + 1} de ${run.ids.length}`;
 for (const chip of $('st-chips').children) {
  const i = Number(chip.dataset.i);
  chip.className = i < step.index ? 'past' : i === step.index ? 'now' : '';
 }
 $('st-es').textContent = pose.es;
 $('st-en').textContent = pose.en;
 $('st-side').textContent = step.side === null ? '' : `${SIDES[step.side].es} · ${SIDES[step.side].en}`;
 $('st-side').hidden = step.side === null;
 $('st-breath').hidden = step.kind !== 'breathe';
 $('st-end').hidden = step.kind !== 'end';
 $('st-cue').hidden = false;
 $('stage').dataset.kind = step.kind;
 if (step.kind === 'end' && !run.done) {
  run.done = true;
  record('tatami', 'yoga', 'secuencia-practicada', {posturas: run.ids.join('-'), segundos: Math.round(run.practised), silla: $('st-chair').checked});
 }
}
function cue(step, progress) {
 const pose = name(step.pose), chair = $('st-chair').checked && step.pose !== CALM.id;
 if (step.kind === 'announce') return step.pose === CALM.id ? [CALM.steps[0].es, CALM.steps[0].en] : ['Prepárate para la siguiente postura.', 'Get ready.'];
 if (step.kind === 'enter') {
  if (chair) return [pose.chair, 'Chair version.'];
  const line = pose.steps[Math.min(pose.steps.length - 1, Math.floor(progress * pose.steps.length))];
  return [line.es, line.en];
 }
 if (step.kind === 'breathe') return step.pose === CALM.id ? [CALM.steps[1].es, CALM.steps[1].en] : ['Quédate en la postura y respira.', 'Stay and breathe.'];
 if (step.kind === 'exit') return [pose.exit.es, pose.exit.en];
 return [CALM.end.es, CALM.end.en];
}
function draw(progress) {
 const step = run.steps[run.at];
 const chair = $('st-chair').checked && step.pose !== CALM.id;
 stageFigure.set(step.pose, S.figureTime(step, still() ? Math.round(progress) : progress), {chair, mirror: step.side === 1, name: `${name(step.pose).es}, dibujo de la postura`});
 const [es, en] = cue(step, progress);
 if ($('st-cue-es').textContent !== es) { $('st-cue-es').textContent = es; $('st-cue-en').textContent = en; }
 if (step.kind === 'breathe') {
  const breath = BREATH[step.phase];
  $('st-breath-es').textContent = breath.es;
  $('st-breath-en').textContent = breath.en;
  $('st-breath-n').textContent = `${step.breath} / ${step.of}`;
  const size = step.phase === 'in' ? .5 + .5 * progress : 1 - .5 * progress;
  $('st-ball').style.transform = `scale(${(still() ? (step.phase === 'in' ? 1 : .5) : size).toFixed(3)})`;
  $('stage').dataset.phase = step.phase;
 }
}
function loop(now) {
 if (!run) return;
 const dt = Math.min(.25, (now - run.last) / 1000);
 run.last = now;
 if (!run.paused) {
  run.elapsed += dt;
  run.practised += dt;
  const step = run.steps[run.at];
  if (run.elapsed >= step.duration && run.at < run.steps.length - 1) {
   run.elapsed = 0;
   run.at++;
   enterStep();
  }
 }
 const step = run.steps[run.at];
 draw(Math.min(1, run.elapsed / step.duration));
 run.frame = requestAnimationFrame(loop);
}
function goTo(delta) {
 run.at = S.jump(run.steps, run.at, delta);
 run.elapsed = 0;
 enterStep();
}
$('st-pause').addEventListener('click', () => setPaused(!run.paused));
$('st-prev').addEventListener('click', () => goTo(-1));
$('st-next').addEventListener('click', () => goTo(1));
$('st-close').addEventListener('click', stopPractice);
$('st-done').addEventListener('click', stopPractice);
$('st-again').addEventListener('click', () => { const ids = run.ids; stopPractice(); startPractice(ids); });
$('st-full').addEventListener('click', () => {
 if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
 else $('stage').requestFullscreen?.().catch(() => {});
});
document.addEventListener('fullscreenchange', () => { $('st-full').textContent = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa'; });
document.addEventListener('keydown', event => {
 if (!run || event.target.closest?.('input,select')) return;
 if (event.key === ' ' && !event.target.closest?.('button')) { event.preventDefault(); setPaused(!run.paused); }
 else if (event.key === 'ArrowRight') goTo(1);
 else if (event.key === 'ArrowLeft') goTo(-1);
 else if (event.key === 'Escape' && !document.fullscreenElement) stopPractice();
});

renderSequence();
renderSaved();
route();
addEventListener('hashchange', route);
