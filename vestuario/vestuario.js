// El Vestuario: the pupil's locker, the album of stickers and El Neceser. On the class screen, only
// «Neceser en movimiento». Design: docs/12-descubrimiento.md, sections 2 and 5.1.
import {topBar, record, mode, player, playerCode} from '../comun/lugar.js';
import {AVATARS, entries, summary, studentId, connection, recover, leave} from '../registro.js';
import * as A from '../album.js';
import {objeto, DIAS, RUTINA, PREGUNTAS, CARTELES, CON_CROMO} from './neceser-banco.js';
import * as N from './neceser.js';
import {PINTADOS} from './assets/pintados.js';
import {PINTADOS as ALBUM_ARTE} from '../album/assets/pintados.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(done => setTimeout(done, still() ? 0 : ms));
const screen = mode() === 'pantalla', me = screen ? null : player();
const sid = me ? studentId(me) : null;
const away = !screen && !me;
// Without a player there is no locker nor album: back to «¿Quién eres?».
if (away) location.replace('../#alumno');
else topBar('El Vestuario');

// --- Pictures: painted as soon as it arrives, a paper label until then. -------------------------
const ROBLES = {calm: '../gimnasio/assets/teacher-robles.webp', happy: '../gimnasio/assets/teacher-robles-happy.webp', think: '../gimnasio/assets/teacher-robles-think.webp'};
const painted = key => PINTADOS.includes(key);
function picture(o) {
 if (painted('neceser-' + o.id)) return `<img class="obj-img" src="./assets/${o.id}.webp" alt="" width="256" height="256">`;
 return `<span class="obj-tag" aria-hidden="true"><i lang="en">${esc(o.en)}</i></span>`;
}
function targetArt(where) {
 if (where === 'neceser') return painted('neceser-abierto') ? '<img src="./assets/neceser-abierto.webp" alt="" width="900" height="620">' : '<span class="bag-shape" aria-hidden="true"></span>';
 if (where === 'mochila') return painted('neceser-mochila') ? '<img src="./assets/mochila.webp" alt="" width="700" height="700">' : '<span class="pack-shape" aria-hidden="true"></span>';
 return '<span class="home-shape" aria-hidden="true"></span>';
}
const stickerArt = c => {
 const art = A.arteDe(c);
 if (art) return `<img src="../${art}" alt="" loading="lazy">`;
 return `<span class="obj-tag big" aria-hidden="true"><i lang="en">${esc(c.en)}</i></span>`;
};
function stamp(n, on) {
 const s = A.SELLOS[n - 1], key = 'album-sello-' + ['zapatilla', 'silbato', 'naranja'][n - 1];
 const inside = on && ALBUM_ARTE.includes(key) ? `<img src="../album/assets/sello-${['zapatilla', 'silbato', 'naranja'][n - 1]}.webp" alt="" width="200" height="200">` : `<span>${esc(on ? s.nombre.replace(/^(La|El) /, '') : n)}</span>`;
 return `<span class="stamp${on ? ' on' : ''}" title="Sello ${n}: ${esc(s.nombre)}${on ? '' : ' (sin conseguir)'}">${inside}</span>`;
}

// English out loud, as in the gym.
function speak(text) {
 if (!('speechSynthesis' in window) || !text) return;
 speechSynthesis.cancel();
 const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = .85; speechSynthesis.speak(u);
}

// --- Views ---------------------------------------------------------------------------------------
const VIEWS = ['escena', 'album', 'neceser', 'clase'];
function show(view) {
 document.body.dataset.view = view;
 for (const name of VIEWS) $('view-' + name).hidden = name !== view;
 scrollTo(0, 0);
}
function route() {
 if (away) return;
 if (screen) { show('clase'); return; }
 const where = location.hash.slice(1);
 if ($('taquilla').open && where !== 'taquilla') $('taquilla').close();
 if (where === 'album') { drawAlbum(); show('album'); }
 else if (where === 'neceser') { drawLevels(); show('neceser'); }
 else {
  drawScene(); show('escena');
  if (where === 'taquilla' && !$('regalo').open && drawLocker() && !$('taquilla').open) $('taquilla').showModal();
 }
}
document.addEventListener('click', event => {
 const go = event.target.closest('[data-go]')?.dataset.go;
 if (!go) return;
 const hash = go === 'escena' ? '' : go;
 // The same place again (e.g. back to the levels from the end of one) does not change the hash.
 if (location.hash.slice(1) === hash) route(); else location.hash = hash;
});
addEventListener('hashchange', route);
$('taquilla').addEventListener('close', () => { if (location.hash === '#taquilla') history.replaceState(null, '', location.pathname); });

// --- Scene ---------------------------------------------------------------------------------------
function say(es, en, mood = 'calm') {
 $('escena-es').textContent = es; $('escena-en').textContent = en;
 $('escena-say').innerHTML = `<span>${esc(es)}</span> <span lang="en">${esc(en)}</span>`;
 $('escena-robles').src = ROBLES[mood];
}
function drawScene() {
 const a = A.album(), fresh = A.nuevos(a).length;
 $('album-badge').hidden = !fresh;
 $('album-badge').textContent = fresh === 1 ? '¡1 cromo nuevo!' : `¡${fresh} cromos nuevos!`;
 const stamps = A.sellosDe(a, 'neceser');
 if (fresh) say('Tienes cromos nuevos en el álbum. ¡Ve a pegarlos!', 'You’ve got new stickers!', 'happy');
 else if (!stamps.includes(1)) say('¿Me ayudas a preparar la bolsa de aseo? Está en el banco.', 'Can you help me pack the wash bag?');
 else say('Mira tu álbum: todavía quedan huecos por llenar.', 'There are still some empty spaces in your album.', 'think');
}

// --- Album ---------------------------------------------------------------------------------------
let page = 'lugares';
function drawAlbum() {
 const a = A.album();
 $('album-who').textContent = `· ${AVATARS[me.avatar]} · ${playerCode(me)}`;
 $('album-tabs').innerHTML = A.PAGINAS.map(p => {
  const {tiene, de} = A.cuenta(a, p.id), fresh = A.CROMOS.some(c => c.pagina === p.id && A.nuevos(a).includes(c.id));
  return `<button type="button" class="tab" role="tab" data-page="${p.id}" aria-selected="${p.id === page}"><strong>${esc(p.titulo)}</strong><small lang="en">${esc(p.en)}</small><span class="tab-count">${tiene}/${de}${fresh ? ' · ¡nuevo!' : ''}</span></button>`;
 }).join('');
 const info = A.PAGINAS.find(p => p.id === page), {tiene, de} = A.cuenta(a, page), fresh = A.nuevos(a);
 $('page-title').innerHTML = `${esc(info.titulo)} <span lang="en">${esc(info.en)}</span>`;
 $('page-count').textContent = `${tiene} de ${de}`;
 $('page-grid').innerHTML = A.CROMOS.filter(c => c.pagina === page).map(c => sticker(c, a, fresh.includes(c.id))).join('');
 // The new ones of this page have been seen now; they glow this time only.
 A.marcarVistos(A.CROMOS.filter(c => c.pagina === page && fresh.includes(c.id)).map(c => c.id));
}
function sticker(c, a, fresh) {
 if (!A.tiene(a, c.id)) {
  const art = A.arteDe(c), shadow = c.pagina !== 'lugares' && art;
  return `<li class="sticker empty"><div class="face"><span class="slot">${shadow ? `<img class="shadow" src="../${art}" alt="" loading="lazy">` : '<span class="q" aria-hidden="true">?</span>'}</span><p class="clue"><span class="visually-hidden">Cromo sin descubrir. Pista: </span>${esc(c.pista)}</p></div></li>`;
 }
 const here = c.href === 'vestuario/', enter = c.href && !here ? `<a class="sign gold" href="../${c.href}"><strong>Entrar</strong></a>` : '';
 const stamps = c.juego ? `<span class="stamps">${[1, 2, 3].map(n => stamp(n, A.sellosDe(a, c.juego).includes(n))).join('')}</span>` : '';
 return `<li class="sticker${fresh ? ' fresh' : ''}"><button type="button" class="card" aria-pressed="false" aria-label="${esc(c.nombre)}: dar la vuelta">
  <span class="front"><span class="pic">${stickerArt(c)}</span><strong>${esc(c.nombre)}</strong><small lang="en">${esc(c.en)}</small>${fresh ? '<em class="ribbon">¡Nuevo!</em>' : ''}</span>
  <span class="back"><strong>${esc(c.nombre)}</strong><span>${esc(c.dorso)}</span>${stamps}</span></button>${enter ? `<div class="enter">${enter}</div>` : ''}</li>`;
}
$('album-tabs').addEventListener('click', event => {
 const tab = event.target.closest('[data-page]');
 if (tab) { page = tab.dataset.page; drawAlbum(); }
});
$('page-grid').addEventListener('click', event => {
 const card = event.target.closest('.card');
 if (card) card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'));
});

// --- Locker: what the pupil has done, the record from another computer and «No soy yo». ----------
function drawLocker() {
 if (!me) return false;
 const mine = summary(entries().filter(entry => entry.sid === sid))[0], a = A.album(), stamps = A.sellosDe(a, 'neceser').length;
 const total = A.CROMOS.filter(c => A.tiene(a, c.id)).length;
 $('taquilla-face').src = `../gimnasio/assets/pupil-${me.avatar}.webp`;
 $('taquilla-title').textContent = `${AVATARS[me.avatar]} · ${playerCode(me)}`;
 const lines = [
  ['Cromos del álbum', `${total} de ${A.CROMOS.length}`],
  ['El Neceser', stamps ? `${stamps} ${stamps === 1 ? 'sello' : 'sellos'} de 3` : 'Sin empezar'],
  ['Aventura del gimnasio', mine?.gymDone ? 'Completada' : mine?.gymPhase ? `Fase ${mine.gymPhase} de 5 superada` : 'Sin empezar'],
  ['Partidos de mate', mine?.matches ? `${mine.matches} jugados · ${mine.wins} ganados` : 'Ninguno todavía'],
  ['Mejor puntuación en mate', mine?.bestPoints ? `${mine.bestPoints} puntos` : '—'],
  ['Yoga', mine?.poses.length || mine?.sequences || mine?.practices ? `${mine.poses.length} posturas vistas · ${mine.sequences} secuencias creadas · ${mine.practices} practicadas` : 'Sin empezar'],
  ['Rosco de EF', mine?.roscos ? `${mine.roscos} jugados · mejor: ${mine.bestRosco} aciertos` : 'Ninguno todavía'],
 ];
 $('taquilla-list').innerHTML = lines.map(([label, value]) => `<li><span>${esc(label)}</span><b>${esc(value)}</b></li>`).join('');
 $('taquilla-recover').hidden = !connection();
 return true;
}
$('taquilla-recover').addEventListener('click', async () => {
 $('taquilla-recover').disabled = true; $('taquilla-status').textContent = 'Buscando en la hoja del profe…';
 const result = await recover();
 $('taquilla-recover').disabled = false;
 $('taquilla-status').textContent = !result.ok ? result.motivo : result.added ? `¡Recuperado! ${result.added} ${result.added === 1 ? 'cosa' : 'cosas'} de otro ordenador.` : 'Ya lo tenías todo en este ordenador.';
 drawLocker(); drawScene();
});
$('taquilla-leave').addEventListener('click', () => { leave(); location.href = '../#alumno'; });

// --- El Neceser ----------------------------------------------------------------------------------
const THEORY = 'vestuario-carteles';
let game = null; // {n, r, selected, quiz}
const asked = [];
function part(name) {
 for (const id of ['nc-levels', 'nc-theory', 'nc-play', 'nc-quiz', 'nc-end']) $(id).hidden = id !== name;
 scrollTo(0, 0);
}
function drawLevels() {
 const stamps = A.sellosDe(A.album(), 'neceser');
 $('level-list').innerHTML = N.NIVELES.map(l => {
  const open = l.n === 1 || stamps.includes(l.n - 1), done = stamps.includes(l.n);
  const lock = open ? '' : `<p class="lock">Se abre con el sello de «${esc(N.NIVELES[l.n - 2].titulo)}».</p>`;
  return `<li class="level${open ? '' : ' closed'}"><span class="level-n">${l.n}</span><div><h2>${esc(l.titulo)} <span lang="en">${esc(l.en)}</span></h2><p>${esc(l.texto)}</p>${lock}</div>
   ${stamp(l.n, done)}<button type="button" class="sign${open && !done ? ' gold' : ''}" data-level="${l.n}" ${open ? '' : 'disabled'}><strong>${done ? 'Otra vez' : 'Jugar'}</strong></button></li>`;
 }).join('');
 part('nc-levels');
}
$('level-list').addEventListener('click', event => {
 const n = Number(event.target.closest('[data-level]')?.dataset.level);
 if (n) begin(n);
});
function seenTheory() { try { return JSON.parse(localStorage.getItem(THEORY) || '[]').includes(sid); } catch { return false; } }
function begin(n) {
 if (n === 1 && !seenTheory()) {
  $('theory-list').innerHTML = CARTELES.map(c => `<li class="poster"><h3>${esc(c.titulo)} <span lang="en">${esc(c.en)}</span></h3><p>${esc(c.texto)}</p></li>`).join('');
  part('nc-theory');
  return;
 }
 const a = A.album(), faltan = new Set(CON_CROMO.map(o => o.id).filter(id => !A.tiene(a, id)));
 game = {n, r: n === 3 ? N.rutina() : N.ronda(n, {faltan}), selected: null};
 drawPlay();
 part('nc-play');
 const day = DIAS.find(d => d.id === game.r.dia);
 if (n === 3) talk('Has terminado la clase. ¿Qué va primero? Toca los pasos en orden.', 'What comes first?');
 else if (day) talk('Lee la nota del corcho: según el día, unas cosas van y otras no.', 'Read the note first.');
 else talk('Toca un objeto y luego dónde va: al neceser o se queda en casa.', 'What goes in the wash bag?');
}
$('theory-go').addEventListener('click', () => {
 try { const seen = JSON.parse(localStorage.getItem(THEORY) || '[]'); localStorage.setItem(THEORY, JSON.stringify([...new Set([...seen, sid])])); } catch {}
 begin(1);
});
function talk(es, en, mood = 'calm', listen = false) {
 $('play-es').textContent = es; $('play-en').textContent = en || '';
 $('play-listen').hidden = !listen;
 $('play-robles').src = ROBLES[mood];
}
$('play-listen').addEventListener('click', () => speak($('play-en').textContent));
// The board is drawn again after every move: keep the focus on the bench, not lost at the top of the page.
const focus = selector => document.querySelector(selector)?.focus({preventScroll: true});

function drawPlay() {
 const {n, r} = game, routine = n === 3;
 const level = N.NIVELES[n - 1];
 $('play-level').textContent = `Nivel ${n} · ${level.titulo}`;
 const day = DIAS.find(d => d.id === r.dia);
 $('play-note').hidden = !day;
 if (day) { $('note-es').textContent = day.es; $('note-en').textContent = day.en; }
 $('play-bench').hidden = routine; $('play-steps').hidden = !routine; $('bench-title').textContent = routine ? 'Los pasos, desordenados' : 'En el banco';
 if (routine) {
  $('play-left').textContent = `${r.hechos.length} de ${RUTINA.length}`;
  $('play-targets').innerHTML = `<ol class="line">${RUTINA.map((p, i) => {
   const done = r.hechos[i];
   return `<li class="${done ? 'done' : ''}"><span class="num">${i + 1}</span>${done ? `<strong>${esc(p.es)}</strong><small lang="en">${esc(p.en)}</small>` : '<span class="blank"></span>'}</li>`;
  }).join('')}</ol>`;
  $('play-steps').innerHTML = r.orden.filter(id => !r.hechos.includes(id)).map(id => {
   const p = RUTINA.find(x => x.id === id);
   return `<li><button type="button" class="step" data-step="${id}"><strong>${esc(p.es)}</strong><small lang="en">${esc(p.en)}</small></button></li>`;
  }).join('');
  return;
 }
 const left = r.objetos.filter(id => !r.puestos[id]);
 $('play-left').textContent = left.length ? `Quedan ${left.length} en el banco` : '¡Banco vacío!';
 $('play-targets').innerHTML = N.destinos(n).map(where => {
  const inside = r.objetos.filter(id => r.puestos[id] === where).map(id => `<li title="${esc(objeto(id).es)}">${painted('neceser-' + id) ? `<img src="./assets/${id}.webp" alt="" width="64" height="64">` : ''}<span>${esc(objeto(id).es)}</span></li>`).join('');
  return `<button type="button" class="target target-${where}" data-where="${where}" ${game.selected ? '' : 'aria-disabled="true"'}>
   <span class="target-art">${targetArt(where)}</span><span class="target-name"><strong>${esc(N.DESTINOS[where].es)}</strong><small lang="en">${esc(N.DESTINOS[where].en)}</small></span><ul class="inside">${inside}</ul></button>`;
 }).join('');
 $('play-targets').classList.toggle('ready', !!game.selected);
 $('play-bench').innerHTML = left.map(id => {
  const o = objeto(id);
  return `<li><button type="button" class="item${game.selected === id ? ' picked' : ''}" data-item="${id}" aria-pressed="${game.selected === id}"><span class="pic">${picture(o)}</span><strong>${esc(o.es)}</strong></button></li>`;
 }).join('');
}
$('play-bench').addEventListener('click', event => {
 const id = event.target.closest('[data-item]')?.dataset.item;
 if (!id) return;
 game.selected = game.selected === id ? null : id;
 drawPlay();
 if (game.selected) talk(`¿Dónde va? ${objeto(id).es}.`, objeto(id).en, 'think', true);
 focus(`[data-item="${id}"]`);
});
$('play-targets').addEventListener('click', event => {
 const where = event.target.closest('[data-where]')?.dataset.where;
 if (!where || !game?.selected) return;
 const id = game.selected, {r, ok, texto} = N.poner(game.r, id, where);
 game.r = r; game.selected = null;
 drawPlay();
 if (ok) { talk(texto, objeto(id).en, 'happy', true); focus('#play-bench [data-item]'); }
 else {
  talk(texto, 'Try again!', 'think');
  document.querySelector(`[data-item="${id}"]`)?.classList.add('nope');
  focus(`[data-item="${id}"]`);
 }
 if (N.hecha(game.r)) finishBoard();
});
$('play-steps').addEventListener('click', event => {
 const id = event.target.closest('[data-step]')?.dataset.step;
 if (!id) return;
 const {r, ok, texto} = N.elegir(game.r, id);
 game.r = r;
 drawPlay();
 if (ok) { const p = RUTINA.find(x => x.id === id); talk(`¡Eso es! ${p.es}.`, p.en, 'happy', true); focus('#play-steps [data-step]'); }
 else { talk(texto, 'Not yet!', 'think'); document.querySelector(`[data-step="${id}"]`)?.classList.add('nope'); focus(`[data-step="${id}"]`); }
 if (N.rutinaHecha(game.r)) finishBoard();
});
async function finishBoard() {
 talk(game.n === 3 ? '¡Rutina completa! Ahora, dos preguntas.' : '¡Banco vacío! Ahora, dos preguntas.', 'Well done!', 'happy');
 await wait(900);
 const list = N.preguntas(Math.random, 2, asked);
 asked.push(...list); if (asked.length > 8) asked.splice(0, asked.length - 8);
 game.quiz = {list, i: 0, bien: 0};
 drawQuestion();
 part('nc-quiz');
}
function drawQuestion() {
 const {list, i} = game.quiz, q = PREGUNTAS[list[i]];
 $('quiz-count').textContent = `Pregunta ${i + 1} de ${list.length}`;
 $('quiz-q').textContent = q.p;
 $('quiz-options').innerHTML = q.o.map((text, k) => `<button type="button" class="option" data-option="${k}">${esc(text)}</button>`).join('');
 $('quiz-why').textContent = '';
 $('quiz-next').hidden = true;
}
$('quiz-options').addEventListener('click', event => {
 const button = event.target.closest('[data-option]');
 if (!button || [...$('quiz-options').children].some(b => b.disabled)) return;
 const q = PREGUNTAS[game.quiz.list[game.quiz.i]], k = Number(button.dataset.option), right = k === q.bien;
 if (right) game.quiz.bien++;
 [...$('quiz-options').children].forEach((b, index) => { b.disabled = true; if (index === q.bien) b.classList.add('right'); });
 if (!right) button.classList.add('wrong');
 $('quiz-why').textContent = (right ? '¡Bien! ' : 'No es esa. ') + q.por;
 $('quiz-next').hidden = false; $('quiz-next').focus();
});
$('quiz-next').addEventListener('click', () => {
 if (++game.quiz.i < game.quiz.list.length) { drawQuestion(); return; }
 finishLevel();
});
function finishLevel() {
 const {n, r, quiz} = game, before = A.album(), stampsBefore = A.sellosDe(before, 'neceser');
 record('vestuario', 'neceser', 'nivel', N.resultado(r, quiz.bien, quiz.list.length));
 const fresh = n === 3 ? [] : N.guardados(r).filter(id => A.pegar(id));
 const after = A.album();
 if (!A.tiene(before, 'juego-neceser') && A.tiene(after, 'juego-neceser')) fresh.unshift('juego-neceser');
 const newStamp = !stampsBefore.includes(n);
 $('end-title').textContent = n === 3 ? '¡Listo para salir!' : '¡Bolsa lista!';
 $('end-text').textContent = r.fallos ? `Lo has terminado. ${r.fallos === 1 ? 'Una cosa' : `${r.fallos} cosas`} volvieron al banco por el camino, y así se aprende.` : 'Todo a la primera. ¡Así da gusto!';
 $('end-art').innerHTML = n === 3 ? '' : painted('neceser-cerrado') ? '<img src="./assets/neceser-cerrado.webp" alt="" width="900" height="620">' : '<span class="bag-shape closed" aria-hidden="true"></span>';
 $('end-stamp').hidden = !newStamp;
 $('end-stamp').innerHTML = newStamp ? `${stamp(n, true)}<p>Nuevo sello: <b>${esc(A.SELLOS[n - 1].nombre)}</b></p>` : '';
 $('end-new').innerHTML = fresh.map(id => { const c = A.cromo(id); return `<li><span class="pic">${stickerArt(c)}</span><span>${esc(c.nombre)}</span></li>`; }).join('');
 $('end-new').hidden = !fresh.length;
 $('end-next').hidden = n === 3;
 part('nc-end');
}
$('end-again').addEventListener('click', () => begin(game.n));
$('end-next').addEventListener('click', () => begin(game.n + 1));

// --- Class screen: «Neceser en movimiento» ---------------------------------------------------------
const POSES = {
 va: {es: 'Salto con palmada', seated: 'Brazos arriba y palmada', en: 'Jump and clap!',
  svg: '<circle cx="50" cy="16" r="9"/><path d="M50 26V70L40 104L34 112M50 70L60 104L66 112M50 34L38 6M50 34L62 6"/><path class="faint" d="M30 128H70"/>',
  sit: '<path class="faint" d="M30 92V50H70V92M24 92H76M28 92L26 134M72 92L74 134"/><circle cx="50" cy="24" r="9"/><path d="M50 34V86M50 86L40 92V132L34 133M50 86L60 92V132L66 133M50 42L40 10M50 42L60 10"/>'},
 no: {es: 'Giro con brazos cruzados', seated: 'Brazos cruzados y giro de tronco', en: 'Turn around!',
  svg: '<circle cx="50" cy="20" r="9"/><path d="M50 30V80L40 128L33 129M50 80L60 128L67 129M50 40L64 54L36 54M50 40L36 52L64 56"/><path class="faint" d="M24 70Q50 88 76 70"/>',
  sit: '<path class="faint" d="M30 92V50H70V92M24 92H76M28 92L26 134M72 92L74 134"/><circle cx="50" cy="24" r="9"/><path d="M50 34V86M50 86L40 92V132L34 133M50 86L60 92V132L66 133M50 44L64 58L36 58M50 44L36 56L64 60"/><path class="faint" d="M28 70Q50 84 72 70"/>'},
};
let lesson = null; // {list, i, phase}
function drawKey(highlight) {
 const seated = $('clase-seated').checked;
 $('clase-key').innerHTML = ['va', 'no'].map(k => `<li class="pose ${k}${highlight === k ? ' lit' : ''}"><p class="pose-q">${k === 'va' ? 'Sí, va en el neceser' : 'No va en el neceser'}</p><svg viewBox="0 0 100 140" aria-hidden="true">${seated ? POSES[k].sit : POSES[k].svg}</svg><strong>${esc(seated ? POSES[k].seated : POSES[k].es)}</strong><small lang="en">${esc(POSES[k].en)}</small></li>`).join('');
}
function drawCard() {
 const {list, i} = lesson, item = list[i], o = objeto(item.id);
 $('clase-count').textContent = `Objeto ${i + 1} de ${list.length}`;
 $('clase-object').innerHTML = picture(o);
 $('clase-name').textContent = o.es; $('clase-en').textContent = o.en;
 $('clase-q').hidden = false; $('clase-answer').textContent = ''; $('clase-clock').hidden = true;
 $('clase-go').firstElementChild.textContent = '¡Ya!';
 $('clase-card').className = 'clase-card';
 drawKey();
}
function newLesson() { lesson = {list: N.rondaClase(), i: 0, phase: 'ask'}; drawCard(); }
$('clase-go').addEventListener('click', async () => {
 if (lesson.phase === 'count') return;
 if (lesson.phase === 'end') { newLesson(); return; }
 if (lesson.phase === 'shown') {
  if (++lesson.i >= lesson.list.length) {
   lesson.phase = 'end';
   record('vestuario', 'neceser-movimiento', 'ronda', {objetos: lesson.list.length, sentado: $('clase-seated').checked});
   $('clase-object').innerHTML = painted('neceser-cerrado') ? '<img class="obj-img" src="./assets/neceser-cerrado.webp" alt="" width="900" height="620">' : '<span class="bag-shape closed" aria-hidden="true"></span>';
   $('clase-count').textContent = ''; $('clase-name').textContent = '¡Ronda terminada!'; $('clase-en').textContent = 'Well done, everybody!';
   $('clase-q').hidden = true; $('clase-answer').textContent = `${lesson.list.length} objetos, toda la clase a la vez.`;
   $('clase-go').firstElementChild.textContent = 'Otra ronda';
   drawKey();
   return;
  }
  lesson.phase = 'ask'; drawCard(); return;
 }
 lesson.phase = 'count';
 $('clase-clock').hidden = false;
 for (const n of [3, 2, 1]) { $('clase-clock').value = n; $('clase-clock').textContent = n; await wait(900); }
 $('clase-clock').hidden = true;
 const item = lesson.list[lesson.i], o = objeto(item.id), k = item.va ? 'va' : 'no';
 $('clase-answer').textContent = item.va ? `¡Sí! ${o.si}` : o.donde === 'mochila' ? 'No: no es de aseo, va en la mochila.' : `No. ${o.por}`;
 $('clase-card').className = 'clase-card ' + k;
 drawKey(k);
 lesson.phase = 'shown';
 $('clase-go').firstElementChild.textContent = lesson.i + 1 < lesson.list.length ? 'Siguiente' : 'Terminar';
});
$('clase-seated').addEventListener('change', () => drawKey(lesson?.phase === 'shown' ? (lesson.list[lesson.i].va ? 'va' : 'no') : null));

// --- Start ---------------------------------------------------------------------------------------
if (screen) newLesson();
else if (me) {
 // The first visit sticks the changing room itself, and Robles hands over the album.
 if (A.pegar('vestuario')) {
  const owned = A.CROMOS.filter(c => A.tiene(A.album(), c.id)).length - 1;
  $('regalo-ya').hidden = owned < 1;
  $('regalo-ya').textContent = `Ya tienes ${owned + 1} cromos: lo que has jugado hasta hoy cuenta.`;
  $('regalo').showModal();
  $('regalo').addEventListener('close', () => { location.hash = 'album'; }, {once: true});
 }
}
route();
