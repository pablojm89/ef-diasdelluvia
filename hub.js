// El Pabellón: who comes in (pupil, class screen or teacher), the corridor each one walks, its doors and its curiosities.
import {families} from './content.js';
import {eligibleChallenges} from './engine.js';
import {sideways} from './comun/lugar.js';
import {PINTADOS} from './assets/pasillo/pintados.js';
import {CURIOSIDADES, TEMAS, curiosidad, delPasillo, descubiertas, descubrir, borrarAlbumes} from './curiosidades.js';
import {AVATARS, COURSES, GROUPS, LAST_NUMBER, player, setPlayer, leave, playerCode, studentId, setMode, record, entries, clearEntries, summary, toSheet,
 sync, connection, lupaConnection, setConnection, forgetConnection, testConnection, resendAll, cloudState, recover, classPackage, aliasEntry, setAliasEntry} from './registro.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const face = index => `./gimnasio/assets/pupil-${index}.webp`;
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Places ------------------------------------------------------------------
// One entry per door of the corridor. `action` doors open something in the corridor itself.
const PLACES = {
 gimnasio: {name: 'El Gimnasio', kicker: 'Aventura: Equipment Rescue', art: 'door-gimnasio', href: './gimnasio/', modes: 'Alumno · Pantalla', state: 'open'},
 pista: {name: 'La Pista', kicker: 'Mate Arena: el mate del cole', art: 'door-mate', href: './mate/', modes: 'Alumno', state: 'open'},
 espalderas: {name: 'Las Espalderas', kicker: 'Ruleta de retos para toda la clase', art: 'door-espalderas', action: 'wheel', modes: 'Pantalla', state: 'open'},
 pizarra: {name: 'La Pizarra', kicker: 'Rosco de Educación Física', art: 'door-pizarra', href: './pizarra/', modes: 'Alumno · Pantalla', state: 'open'},
 tatami: {name: 'El Tatami', kicker: 'Yoga: posturas y secuencias', art: 'door-tatami', href: './tatami/', modes: 'Alumno · Pantalla', state: 'open'},
 grada: {name: 'La Grada', kicker: 'Partidos de mate en directo', art: 'door-grada', href: './grada/', modes: 'Pantalla', state: 'open'},
 aula: {name: 'El Aula', kicker: 'La oca y el bingo en movimiento', art: 'door-aula', href: './aula/', modes: 'Pantalla · Tabletas', state: 'open'},
 vestuario: {name: 'El Vestuario', kicker: 'Tu taquilla y tu álbum', art: 'door-vestuario', action: 'locker', modes: 'Alumno', state: 'open'},
};
const MAPS = {
 alumno: {title: '¿A dónde vamos hoy?', en: 'Where shall we go today?', places: ['gimnasio', 'pista', 'pizarra', 'tatami', 'vestuario']},
 pantalla: {title: 'Elegid una puerta… o un cuadro.', en: 'Pick a door… or a picture!', places: ['espalderas', 'aula', 'pizarra', 'gimnasio', 'tatami', 'grada']},
};
// Earlier experiments that no longer match the look of the school; only the teacher can still open them.
const REVIEW = [
 ['Misión Refugio', 'Seis retos con cronómetro', './patio.html#mision'],
 ['Pulso Lab', 'Secuencias de ritmo', './patio.html#pulso'],
 ['Liga Relámpago', 'Retos por equipos con rúbrica', './patio.html#liga'],
 ['Libro de retos', 'Los 24 retos de la ruleta', './patio.html#biblioteca'],
];

function progressNote(id) {
 const read = key => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
 if (id !== 'gimnasio') return '';
 const stage = read('ef-gym-mission-v1')?.state?.stage;
 return Number.isInteger(stage) && stage > 0 ? (stage >= 5 ? 'Misión completada' : `Fase ${stage + 1} de 5`) : '';
}
function doorMarkup(id) {
 const place = PLACES[id], note = progressNote(id);
 const inside = `<span class="plate"><strong>${esc(place.name)}</strong><small>${esc(place.kicker)}</small></span>
  <span class="arch"><img src="./assets/${place.art}.webp" alt="" width="480" height="640">${note ? `<span class="ribbon">${esc(note)}</span>` : ''}</span>`;
 if (place.action) return `<li><button type="button" class="door" data-place="${id}" data-action="${place.action}">${inside}</button></li>`;
 return `<li><a class="door" data-place="${id}" href="${place.href}">${inside}</a></li>`;
}
// Whose album it is: the pupil's, or the class screen's.
const albumOwner = () => kind === 'alumno' && player() ? studentId(player()) : 'pantalla';
// Each curiosity gets its own painting from arte/lotes/16-pasillo.json once it is integrated; until then
// its frame shows a drawing borrowed from another place.
const painted = item => PINTADOS.includes('cuadro-' + item.id);
const pictureArt = item => painted(item) ? `./assets/pasillo/cuadro-${item.id}.webp` : './' + item.arte;
function pictureMarkup(item, found) {
 return `<li><button type="button" class="cuadro${found ? ' found' : ''}${painted(item) ? ' painted' : ''}" data-curio="${item.id}" aria-label="Curiosidad${found ? ' descubierta' : ' por descubrir'}: ${esc(item.titulo)}"><img src="${pictureArt(item)}" alt="" width="240" height="240"><span class="tag" aria-hidden="true">${found ? '✓' : '?'}</span></button></li>`;
}

// --- Views -------------------------------------------------------------------
let view = 'title', kind = null;
function show(next) {
 view = next;
 document.body.dataset.view = next;
 for (const name of ['title', 'login', 'map', 'teacher']) $('view-' + name).hidden = name !== next;
 scrollTo(0, 0);
}
function showMap(which) {
 kind = which;
 const map = MAPS[kind], current = player(), pupil = kind === 'alumno' && current;
 $('map-title').textContent = map.title;
 $('map-en').textContent = map.en;
 // A picture before each door and one after the last: one curiosity more than doors.
 const found = descubiertas(albumOwner()), pictures = delPasillo(map.places.length + 1);
 $('doors').innerHTML = map.places.map((id, index) => pictureMarkup(pictures[index], found.includes(pictures[index].id)) + doorMarkup(id)).join('')
  + pictureMarkup(pictures[map.places.length], found.includes(pictures[map.places.length].id));
 $('locker-button').hidden = !pupil;
 $('mode-tag').hidden = kind !== 'pantalla';
 $('mode-tag').textContent = 'PANTALLA DIGITAL';
 if (pupil) { $('player-face').src = face(current.avatar); $('player-code').textContent = playerCode(current); }
 drawAlbumCount();
 show('map');
 enterCorridor(pupil ? current.avatar : null);
}
function route() {
 const where = location.hash.slice(1);
 for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
 if (where === 'alumno') {
  setMode('alumno');
  if (player()) showMap('alumno'); else showLogin();
 } else if (where === 'pantalla') {
  setMode('pantalla');
  showMap('pantalla');
 } else if (where === 'profe') {
  $('locker-button').hidden = true; $('mode-tag').hidden = false; $('mode-tag').textContent = 'PROFE';
  showTeacher();
 } else {
  setMode(null);
  show('title');
 }
}
addEventListener('hashchange', route);
addEventListener('pageshow', event => { if (event.persisted) route(); });
$('enter-student').addEventListener('click', () => { location.hash = 'alumno'; });
if (document.fullscreenEnabled) $('fullscreen').addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); });
else $('fullscreen').hidden = true;

// --- The corridor: it is walked sideways ----------------------------------------------
// The pupil's character walks to whatever is touched and the camera follows; on the class screen nobody
// walks. Dragging, the wheel, the arrow keys and the two round buttons all move along the corridor.
const camera = $('camera'), world = $('world'), walker = $('walker');
// The painted stretch of corridor repeats along the whole room; until it arrives, the room of base.css.
if (PINTADOS.includes('pasillo-tramo')) world.style.background = "url('./assets/pasillo/tramo.webp') 0 0/auto 100% repeat-x";
const WHERE = 'pabellon-pasillo';
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
let walkerX = 0, walkFrame = 0, stride = 0, heldKey = 0, lastTime = 0, target = null, avatarNow = null;
const centreOf = element => { const box = element.getBoundingClientRect(), base = world.getBoundingClientRect(); return box.left - base.left + box.width / 2; };
function drawWalker(walking) {
 walker.classList.toggle('walking', walking);
 walker.style.backgroundImage = `url('./gimnasio/assets/${walking ? 'walk' : 'pupil'}-${avatarNow}.webp')`;
 const cell = Math.floor(stride) % 8;
 walker.style.backgroundPosition = walking ? `${cell % 4 * 100 / 3}% ${Math.floor(cell / 4) * 100}%` : '';
 walker.style.left = walkerX + 'px';
}
function follow() {
 const seen = walkerX - camera.scrollLeft, width = camera.clientWidth;
 camera.scrollLeft += seen - clamp(seen, width * .3, width * .7);
}
function stopWalking() { cancelAnimationFrame(walkFrame); walkFrame = 0; lastTime = 0; target = null; if (avatarNow !== null) drawWalker(false); }
function step(now) {
 walkFrame = 0;
 const dt = Math.min(.05, (now - (lastTime || now - 16)) / 1000), body = walker.offsetHeight || 200;
 lastTime = now;
 const goal = target ? target.x : clamp(walkerX + heldKey * 9999, body * .4, world.scrollWidth - body * .4);
 const gap = goal - walkerX;
 // A touched door is never more than a second away, however long the corridor is.
 const speed = target ? Math.max(body * 2.2, target.distance / .9) : body * 2.4;
 const move = Math.sign(gap) * Math.min(Math.abs(gap), speed * dt);
 walkerX += move; stride += Math.abs(move) / body * 5;
 if (move) walker.classList.toggle('left', move < 0);
 drawWalker(true); follow();
 if (Math.abs(goal - walkerX) < 1) {
  const done = target?.then;
  stopWalking();
  if (heldKey) walkFrame = requestAnimationFrame(step); else done?.();
  return;
 }
 walkFrame = requestAnimationFrame(step);
}
// Walks to an element of the corridor and then does `then`. Without a character, or without motion, at once.
function walkTo(element, then) {
 if (avatarNow === null || still()) { then(); return; }
 const x = centreOf(element), width = camera.clientWidth;
 // A character left behind off the screen comes in from the nearest edge.
 walkerX = clamp(walkerX, camera.scrollLeft - 40, camera.scrollLeft + width + 40);
 target = {x, distance: Math.abs(x - walkerX), then};
 if (!walkFrame) walkFrame = requestAnimationFrame(step);
}
function remember(place) { try { sessionStorage.setItem(WHERE, JSON.stringify({kind, place})); } catch {} }
function enterCorridor(avatar) {
 stopWalking();
 avatarNow = avatar;
 walker.hidden = avatar === null;
 let back = null;
 try { back = JSON.parse(sessionStorage.getItem(WHERE)); } catch {}
 // Coming back from a place, you stand by its door.
 const door = back?.kind === kind && $('doors').querySelector(`[data-place="${CSS.escape(String(back.place))}"]`);
 walkerX = door ? centreOf(door) : centreOf(document.querySelector('.pasillo-host')) + (walker.offsetHeight || 200) * .78;
 camera.scrollLeft = door ? walkerX - camera.clientWidth / 2 : 0;
 if (avatar !== null) drawWalker(false);
 drawNav();
}
const drawNav = sideways(camera, $('go-left'), $('go-right')), slide = drawNav.slide;
addEventListener('resize', () => { if (view === 'map') { walkerX = clamp(walkerX, 0, world.scrollWidth); if (avatarNow !== null) drawWalker(false); } });
addEventListener('keydown', event => {
 if (view !== 'map' || document.querySelector('dialog[open]') || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
 event.preventDefault();
 const direction = event.key === 'ArrowLeft' ? -1 : 1;
 if (avatarNow === null || still()) { if (!event.repeat) slide(direction); return; }
 heldKey = direction; target = null;
 walkerX = clamp(walkerX, camera.scrollLeft, camera.scrollLeft + camera.clientWidth);
 if (!walkFrame) walkFrame = requestAnimationFrame(step);
});
addEventListener('keyup', event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { heldKey = 0; if (!target) stopWalking(); } });
$('doors').addEventListener('click', event => {
 const door = event.target.closest('.door'), picture = event.target.closest('.cuadro');
 if (picture) { walkTo(picture, () => openCurio(picture.dataset.curio)); return; }
 if (!door) return;
 event.preventDefault();
 remember(door.dataset.place);
 const action = door.dataset.action;
 walkTo(door, () => { if (action === 'wheel') openWheel(); else if (action === 'locker') openLocker(); else location.href = door.href; });
});

// --- Curiosities: the pictures of the corridor and the album ---------------------------
let curioNow = null, curioLeft = 0, curioTicking = null;
function drawAlbumCount() { $('album-count').textContent = `${descubiertas(albumOwner()).length}/${CURIOSIDADES.length}`; }
function stopCurioClock() { clearInterval(curioTicking); curioTicking = null; }
function openCurio(id) {
 const item = curiosidad(id);
 if (!item) return;
 curioNow = item; stopCurioClock();
 const found = descubiertas(albumOwner()).includes(id);
 $('curio-art').src = pictureArt(item);
 $('curio-art').parentElement.classList.toggle('painted', painted(item));
 $('curio-theme').textContent = TEMAS[item.tema];
 $('curio-title').textContent = item.titulo;
 $('curio-en').textContent = item.en;
 $('curio-text').textContent = item.texto;
 $('curio-try').textContent = item.prueba;
 $('curio-seated').textContent = item.sentada;
 $('curio-source').textContent = item.fuente[0];
 $('curio-clock-box').hidden = !item.segundos;
 $('curio-clock-box').classList.remove('done');
 curioLeft = item.segundos || 0;
 $('curio-clock').textContent = time(curioLeft);
 $('curio-start').firstElementChild.textContent = 'Empezar';
 $('curio-done').hidden = found;
 $('curio-status').textContent = found ? 'Ya está en el álbum.' : '';
 if (!$('curio').open) $('curio').showModal();
}
$('curio-start').addEventListener('click', () => {
 if (curioTicking) { stopCurioClock(); $('curio-start').firstElementChild.textContent = 'Seguir'; return; }
 if (curioLeft <= 0) { curioLeft = curioNow.segundos; $('curio-clock-box').classList.remove('done'); }
 $('curio-clock').textContent = time(curioLeft);
 $('curio-start').firstElementChild.textContent = 'Pausar';
 curioTicking = setInterval(() => {
  curioLeft--;
  $('curio-clock').textContent = time(Math.max(0, curioLeft));
  if (curioLeft > 0) return;
  stopCurioClock(); chime();
  $('curio-clock-box').classList.add('done');
  $('curio-start').firstElementChild.textContent = 'Repetir';
 }, 1000);
});
$('curio-done').addEventListener('click', () => {
 if (!descubrir(curioNow.id, albumOwner())) return;
 record('pasillo', 'curiosidades', 'descubre', {id: curioNow.id, tema: curioNow.tema});
 const picture = $('doors').querySelector(`[data-curio="${curioNow.id}"]`);
 if (picture) { picture.classList.add('found'); picture.querySelector('.tag').textContent = '✓'; picture.setAttribute('aria-label', 'Curiosidad descubierta: ' + curioNow.titulo); }
 $('curio-done').hidden = true;
 $('curio-status').textContent = '¡Al álbum! Busca más cuadros por el pasillo.';
 drawAlbumCount();
});
$('curio').addEventListener('close', () => { stopCurioClock(); try { speechSynthesis.cancel(); } catch {} });
// The English sentence read aloud, as the teacher's instructions are in the gym.
if ('speechSynthesis' in window) $('curio-listen').addEventListener('click', () => {
 speechSynthesis.cancel();
 const voice = new SpeechSynthesisUtterance(curioNow.en);
 voice.lang = 'en-GB'; voice.rate = .85;
 speechSynthesis.speak(voice);
});
else $('curio-listen').hidden = true;
// The teacher keeps one for each day: the picture of this week that matches the day.
$('host').addEventListener('click', () => {
 const pictures = [...$('doors').querySelectorAll('.cuadro')];
 if (pictures.length) walkTo($('host'), () => openCurio(pictures[new Date().getDay() % pictures.length].dataset.curio));
});
function openAlbum() {
 const found = descubiertas(albumOwner());
 $('album-title').textContent = `${found.length} de ${CURIOSIDADES.length} descubiertas`;
 $('album-list').innerHTML = Object.entries(TEMAS).map(([tema, name]) => `<section><h3>${esc(name)}</h3><div class="album-row">${CURIOSIDADES.filter(item => item.tema === tema).map(item => found.includes(item.id)
  ? `<button type="button" class="album-item" data-curio="${item.id}"><img src="${pictureArt(item)}" alt="" width="64" height="64" loading="lazy">${esc(item.titulo)}</button>`
  : '<span class="album-item missing"><i aria-hidden="true">?</i>Por descubrir</span>').join('')}</div></section>`).join('');
 for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
 $('album').showModal();
}
$('album-button').addEventListener('click', openAlbum);
$('album-list').addEventListener('click', event => { const item = event.target.closest('[data-curio]'); if (item) { $('album').close(); openCurio(item.dataset.curio); } });

// --- Pupil: class, list number and a character. No names -------------------------
function fill(select, values, label) {
 select.replaceChildren(...values.map(value => new Option(label(value), value)));
}
fill($('login-course'), COURSES, value => value + '.º');
fill($('login-group'), GROUPS, value => value);
fill($('login-number'), Array.from({length: LAST_NUMBER}, (_, i) => i + 1), value => value);
$('login-avatars').innerHTML = AVATARS.map((name, index) =>
 `<label><input type="radio" name="avatar" value="${index}" ${index === 0 ? 'checked' : ''}><img src="${face(index)}" alt="" width="100" height="215" loading="lazy">${esc(name)}</label>`).join('');
// With the class package of La Lupa on this computer, and if the teacher wants it, pupils pick their alias
// from the list instead of class and number: then they are the same person in both games' sheet.
let roll = null;
async function showLogin() {
 $('locker-button').hidden = true; $('mode-tag').hidden = true;
 $('login-course').value = '5';
 roll = aliasEntry() ? await classPackage() : null;
 $('login-pickers').hidden = !!roll; $('login-class').hidden = !roll;
 $('login-text').textContent = roll ? 'Busca tu alias de la clase. No hace falta tu nombre.' : 'Elige tu clase y tu número de lista. No hace falta tu nombre.';
 if (roll) {
  $('login-class-title').textContent = `Tu alias de ${roll.clase || 'la clase'}`;
  $('login-aliases').innerHTML = roll.alumnos.map((pupil, index) => `<label><input type="radio" name="alias" value="${index}" required>${pupil.avatar ? `<img src="${pupil.avatar}" alt="" width="64" height="64">` : `<span class="initial" aria-hidden="true">${esc(pupil.alias.slice(0, 1).toUpperCase())}</span>`}<span>${esc(pupil.alias)}</span></label>`).join('');
 } else $('login-aliases').replaceChildren();
 show('login');
}
$('login-form').addEventListener('submit', event => {
 event.preventDefault();
 const form = new FormData(event.target), avatar = Number(form.get('avatar'));
 const pupil = roll?.alumnos[Number(form.get('alias'))];
 if (roll && !pupil) return;
 const chosen = pupil ? {course: roll.course, alias: pupil.alias, avatar}
  : {course: Number($('login-course').value), group: $('login-group').value, number: Number($('login-number').value), avatar};
 if (setPlayer(chosen)) { record('pabellon', 'entrada', 'entra'); showMap('alumno'); }
});
function drawLocker() {
 const current = player();
 if (!current) return false;
 const mine = summary(entries().filter(entry => entry.sid === studentId(current)))[0];
 $('locker-face').src = face(current.avatar);
 $('locker-title').textContent = `${AVATARS[current.avatar]} · ${playerCode(current)}`;
 const lines = [
  ['Aventura del gimnasio', mine?.gymDone ? 'Completada' : mine?.gymPhase ? `Fase ${mine.gymPhase} de 5 superada` : 'Sin empezar'],
  ['Partidos de mate', mine?.matches ? `${mine.matches} jugados · ${mine.wins} ganados` : 'Ninguno todavía'],
  ['Mejor puntuación en mate', mine?.bestPoints ? `${mine.bestPoints} puntos` : '—'],
  ['Yoga', mine?.poses.length || mine?.sequences || mine?.practices ? `${mine.poses.length} posturas vistas · ${mine.sequences} secuencias creadas · ${mine.practices} practicadas` : 'Sin empezar'],
  ['Rosco de EF', mine?.roscos ? `${mine.roscos} jugados · mejor: ${mine.bestRosco} aciertos` : 'Ninguno todavía'],
  ['Curiosidades', `${descubiertas(studentId(current)).length} de ${CURIOSIDADES.length} descubiertas`],
 ];
 $('locker-list').innerHTML = lines.map(([label, value]) => `<li><span>${esc(label)}</span><b>${esc(value)}</b></li>`).join('');
 $('locker-recover').hidden = !connection();
 return true;
}
function openLocker() { $('locker-status').textContent = ''; if (drawLocker()) $('locker').showModal(); }
$('locker-button').addEventListener('click', openLocker);
$('locker-album').addEventListener('click', openAlbum);
// Another computer: what the teacher's sheet holds for this player joins this record.
$('locker-recover').addEventListener('click', async () => {
 $('locker-recover').disabled = true; $('locker-status').textContent = 'Buscando en la hoja del profe…';
 const result = await recover();
 $('locker-recover').disabled = false;
 $('locker-status').textContent = !result.ok ? result.motivo : result.added ? `¡Recuperado! ${result.added} ${result.added === 1 ? 'cosa' : 'cosas'} de otro ordenador.` : 'Ya lo tenías todo en este ordenador.';
 drawLocker();
});
$('locker-leave').addEventListener('click', () => { leave(); $('locker').close(); showLogin(); });

// --- Teacher: a key for this computer and the desk behind it ---------------------
const PIN = 'pabellon-clave', OPEN = 'pabellon-despacho';
async function digest(text) {
 if (!crypto.subtle) { let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0).toString(16); }
 const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
 return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}
const savedPin = () => { try { return JSON.parse(localStorage.getItem(PIN)); } catch { return null; } };
const deskOpen = () => { try { return sessionStorage.getItem(OPEN) === '1'; } catch { return false; } };
function showTeacher() {
 const hasPin = !!savedPin()?.hash, open = hasPin && deskOpen();
 $('gate').hidden = open; $('desk').hidden = !open;
 if (open) drawDesk();
 else {
  $('gate-text').textContent = hasPin ? 'Escribe tu clave para entrar.' : 'Es la primera vez en este ordenador: crea una clave de 4 a 8 números.';
  $('gate-label').textContent = hasPin ? 'Clave' : 'Clave nueva';
  $('gate-button').textContent = hasPin ? 'Entrar' : 'Guardar y entrar';
  $('gate-pin').value = ''; $('gate-status').textContent = '';
 }
 show('teacher');
 if (!open) $('gate-pin').focus();
}
$('gate').addEventListener('submit', async event => {
 event.preventDefault();
 const pin = $('gate-pin').value, saved = savedPin();
 if (!/^\d{4,8}$/.test(pin)) { $('gate-status').textContent = 'La clave tiene de 4 a 8 números.'; return; }
 if (!saved?.hash) {
  const salt = crypto.getRandomValues(new Uint32Array(2)).join('-');
  try { localStorage.setItem(PIN, JSON.stringify({salt, hash: await digest(salt + pin)})); }
  catch { $('gate-status').textContent = 'Este navegador no permite guardar la clave.'; return; }
 } else if (await digest(saved.salt + pin) !== saved.hash) {
  $('gate-status').textContent = 'Esa no es la clave.'; $('gate-pin').value = ''; return;
 }
 try { sessionStorage.setItem(OPEN, '1'); } catch {}
 showTeacher();
});
const when = iso => new Date(iso).toLocaleString('es-ES', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});
function drawDesk() {
 const rows = summary();
 const marks = row => row.marks.length ? row.marks.map(m => `${m.criterio} · ${String(m.nota).replace('.', ',')} ${m.calificacion}`).join('<br>') : '—';
 $('desk-summary').innerHTML = rows.length ? `<table><thead><tr><th>Jugador</th><th>Última vez</th><th>Aventura del gimnasio</th><th>Mate: partidos · ganados · mejor</th><th>Yoga: posturas · creadas · practicadas</th><th>Rosco: jugados · mejor</th><th>Ruleta · oca · bingo</th><th>Curiosidades</th><th>Nota orientativa</th></tr></thead><tbody>${rows.map(row =>
  `<tr><th scope="row">${esc(row.who)}</th><td>${esc(when(row.last))}</td><td>${row.gymDone ? 'Completada' : row.gymPhase ? `Fase ${row.gymPhase} de 5` : '—'}</td><td>${row.matches ? `${row.matches} · ${row.wins} · ${row.bestPoints}` : '—'}</td><td>${row.poses.length || row.sequences || row.practices ? `${row.poses.length} · ${row.sequences} · ${row.practices}` : '—'}</td><td>${row.roscos ? `${row.roscos} · ${row.bestRosco}` : '—'}</td><td>${row.challenges || row.boards || row.bingos ? `${row.challenges} · ${row.boards} · ${row.bingos}` : '—'}</td><td>${row.curiosities.length || '—'}</td><td>${marks(row)}</td></tr>`).join('')}</tbody></table>`
  : '<p>Todavía no se ha jugado nada en este ordenador.</p>';
 $('desk-download').disabled = $('desk-clear').disabled = !entries().length;
 drawCloud();
 const places = Object.values(PLACES).map(place => `<tr><th scope="row">${esc(place.name)}</th><td class="wrap">${esc(place.kicker)}</td><td>${esc(place.modes)}</td><td><span class="state ${place.state}">${place.state === 'open' ? 'Abierto' : 'Próximamente'}</span></td><td>${place.href ? `<a href="${place.href}"><u>Abrir</u></a>` : ''}</td></tr>`);
 const old = REVIEW.map(([name, what, href]) => `<tr><th scope="row">${esc(name)}</th><td class="wrap">${esc(what)}</td><td>Pantalla</td><td><span class="state review">Estética anterior</span></td><td><a href="${href}"><u>Abrir</u></a></td></tr>`);
 $('desk-catalogue').innerHTML = `<table><thead><tr><th>Lugar</th><th>Actividad</th><th>Se juega como</th><th>Estado</th><th></th></tr></thead><tbody>${places.join('')}${old.join('')}</tbody></table>`;
}
$('desk-download').addEventListener('click', () => {
 const link = document.createElement('a');
 link.href = URL.createObjectURL(new Blob(['﻿' + toSheet()], {type: 'text/csv;charset=utf-8'}));
 link.download = `registro-pabellon-${new Date().toISOString().slice(0, 10)}.csv`;
 link.click();
 setTimeout(() => URL.revokeObjectURL(link.href), 2000);
});

// --- Teacher: the sheet where the marks of every computer meet ------------------------
// The address and the class code live in this browser (key `aula-nube`, shared with La Lupa), never in the code.
const same = (a, b) => !!a && !!b && a.url === b.url && a.classCode.toUpperCase() === b.classCode.toUpperCase();
function drawCloudState() {
 const on = connection(), {pending: waiting, last, state, dropped} = cloudState();
 const lines = [];
 if (!on) lines.push(`<b>Sin conectar:</b> el registro se queda en este ordenador${waiting ? ` (${waiting} anotaciones esperan a la hoja)` : ''}.`);
 else {
  lines.push(`Aula <b>${esc(on.classCode)}</b> · Pendientes de enviar: <b id="cloud-pending">${waiting}</b> · ${last ? `último envío confirmado: ${esc(when(last))}` : 'todavía no se ha confirmado ningún envío'}`);
  if (state?.ok === false) lines.push(`<span class="warn">No se ha podido confirmar el último envío (${esc(when(state.at))}): ${esc(state.motivo || '')} No se ha borrado nada; se reintenta solo.</span>`);
  if (state?.ok && state.rechazados) lines.push(`<span class="warn">La hoja ha rechazado ${Number(state.rechazados)} elemento(s) del último envío: ${esc(state.motivo || '')}</span>`);
 }
 if (dropped) lines.push(`<span class="warn">El registro de este ordenador se llenó y se soltaron ${dropped} anotaciones sin enviar.</span>`);
 $('cloud-state').innerHTML = lines.map(line => `<p>${line}</p>`).join('');
 $('desk-sync').disabled = $('cloud-resend').disabled = !on || !entries().length;
}
async function drawCloud() {
 const on = connection(), lupa = lupaConnection();
 if (document.activeElement !== $('cloud-url') && document.activeElement !== $('cloud-code')) { $('cloud-url').value = on?.url || ''; $('cloud-code').value = on?.classCode || ''; }
 $('cloud-forget').hidden = $('cloud-test').hidden = !on;
 $('cloud-lupa').hidden = !lupa || same(on, lupa);
 if (lupa) $('cloud-lupa-text').innerHTML = `En este navegador, <b>Agencia La Lupa</b> ya envía sus notas a una hoja, con el código de aula <b>${esc(lupa.classCode)}</b>. Usa la misma y todo quedará junto. Para que esa hoja acepte también a El Pabellón, su Apps Script tiene que ser <code>aula.gs</code>: «Probar conexión» lo comprueba.`;
 drawCloudState();
 const found = await classPackage();
 $('cloud-package').textContent = found ? `Hay un paquete de clase de La Lupa en este navegador: ${found.clase || 'clase'}, ${found.alumnos.length} alias.` : 'No hay paquete de clase de La Lupa en este navegador: el alumnado entra con curso, grupo y número de lista. Si importas el paquete en La Lupa, aquí podrás usar los mismos alias.';
 $('alias-entry-label').hidden = !found;
 $('alias-entry').checked = aliasEntry();
}
function saveConnection(next) {
 const result = setConnection(next);
 $('cloud-test-result').textContent = result.ok ? 'Guardado en este navegador. Prueba la conexión.' : result.motivo;
 drawCloud();
 return result.ok;
}
$('cloud-form').addEventListener('submit', event => { event.preventDefault(); saveConnection({url: $('cloud-url').value, classCode: $('cloud-code').value}); });
$('cloud-use-lupa').addEventListener('click', () => { if (saveConnection(lupaConnection())) runTest(); });
async function runTest() {
 $('cloud-test-result').textContent = 'Probando…';
 const result = await testConnection();
 $('cloud-test-result').textContent = result.ok ? 'Conexión correcta: la hoja confirma los envíos.' : result.motivo;
 if (result.ok) { await sync({now: true}); drawCloudState(); }
}
$('cloud-test').addEventListener('click', runTest);
$('cloud-forget').addEventListener('click', () => { if (confirm('¿Quitar la conexión con la hoja en este navegador? Lo pendiente se queda en este ordenador; la hoja no se borra.')) { forgetConnection(); $('cloud-test-result').textContent = ''; drawCloud(); } });
$('desk-sync').addEventListener('click', async () => { $('desk-sync').disabled = true; await sync({now: true}); drawCloudState(); });
$('cloud-resend').addEventListener('click', async () => { resendAll(); await sync({now: true}); drawCloudState(); });
$('alias-entry').addEventListener('change', event => setAliasEntry(event.target.checked));
// What is sent while the desk is open shows up without reloading.
setInterval(() => { if (view === 'teacher' && !$('desk').hidden) drawCloudState(); }, 4000);
$('desk-clear').addEventListener('click', () => { if (confirm('¿Borrar todo el registro y los álbumes de curiosidades guardados en este ordenador? Descarga antes el registro si lo necesitas.')) { clearEntries(); borrarAlbumes(); drawDesk(); } });
$('desk-lock').addEventListener('click', () => { try { sessionStorage.removeItem(OPEN); } catch {} location.hash = ''; });
$('desk-forget').addEventListener('click', () => { if (confirm('¿Borrar la clave de este ordenador para crear otra?')) { try { localStorage.removeItem(PIN); sessionStorage.removeItem(OPEN); } catch {} showTeacher(); } });

// --- Las Espalderas: challenge wheel for the whole class -------------------------
const KINDS = Object.keys(families);
const COLOURS = ['#d9703a', '#2f7f78', '#e2a63b', '#c9524a', '#4f8a4b', '#3f6fa8'];
const SHORT = {coordinacion: 'Coordinación', equilibrio: 'Control', ritmo: 'Ritmo', expresion: 'Expresión', cooperacion: 'Cooperación', calma: 'Calma'};
const disc = $('wheel-disc'), dial = $('wheel-clock'), seated = $('wheel-seated');
const point = (angle, radius) => [Math.sin(angle * Math.PI / 180) * radius, -Math.cos(angle * Math.PI / 180) * radius];
disc.innerHTML = `<circle r="103" fill="#463e28"/>` + KINDS.map((kind, index) => {
 const [x1, y1] = point(index * 60, 98), [x2, y2] = point(index * 60 + 60, 98), [tx, ty] = point(index * 60 + 30, 62);
 return `<path d="M0 0L${x1.toFixed(2)} ${y1.toFixed(2)}A98 98 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z" fill="${COLOURS[index]}" stroke="#fff3d9" stroke-width="1.5"/>
  <text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" transform="rotate(${index * 60 + 30} ${tx.toFixed(2)} ${ty.toFixed(2)})" text-anchor="middle" dominant-baseline="middle" font-family="Trebuchet MS,sans-serif" font-size="10.5" font-weight="800" fill="#fff">${SHORT[kind]}</text>`;
}).join('') + `<circle r="17" fill="#fff3d9" stroke="#463e28" stroke-width="4"/>`;
const bags = {};
let turned = 0, spinning = false, current = null, left = 0, ticking = null, sound = null;
function time(seconds) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; }
function draw(kind) {
 // A shuffled bag per kind, so a challenge does not come back until the others have been used.
 if (!bags[kind]?.length) {
  const bag = eligibleChallenges({family: kind});
  for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
  bags[kind] = bag;
 }
 return bags[kind].pop();
}
function stopClock() { clearInterval(ticking); ticking = null; }
function reveal(challenge) {
 current = challenge; left = challenge.seconds;
 $('wheel-family').textContent = families[challenge.family];
 $('wheel-players').textContent = challenge.minPlayers > 1 ? ' · En parejas o grupos' : ' · Cada uno en su sitio';
 $('wheel-title').textContent = challenge.title;
 $('wheel-text').textContent = seated.checked ? challenge.seated : challenge.standing;
 $('wheel-criterion').textContent = challenge.criterion;
 $('wheel-observe').hidden = $('wheel-clock-box').hidden = false;
 $('wheel-clock-box').classList.remove('done');
 dial.textContent = time(left);
 $('wheel-start').firstElementChild.textContent = 'Empezar';
 $('wheel-status').textContent = '';
 $('wheel-spin').firstElementChild.textContent = 'Girar otra vez';
}
function spin() {
 if (spinning) return;
 stopClock();
 const index = Math.floor(Math.random() * KINDS.length), challenge = draw(KINDS[index]);
 // Stop with the middle of the chosen sector under the pin.
 turned = Math.ceil(turned / 360) * 360 + 360 * 4 - (index * 60 + 30) + (Math.random() * 36 - 18);
 disc.style.transform = `rotate(${turned}deg)`;
 if (still()) { reveal(challenge); return; }
 spinning = true; $('wheel-spin').disabled = true;
 $('wheel-title').textContent = '…'; $('wheel-status').textContent = '';
 const land = () => { if (!spinning) return; spinning = false; $('wheel-spin').disabled = false; reveal(challenge); };
 disc.addEventListener('transitionend', land, {once: true});
 setTimeout(land, 3200);
}
function chime() {
 try {
  sound ||= new (window.AudioContext || window.webkitAudioContext)();
  for (const [delay, pitch] of [[0, 660], [.16, 880]]) {
   const tone = sound.createOscillator(), level = sound.createGain(), at = sound.currentTime + delay;
   tone.frequency.value = pitch;
   level.gain.setValueAtTime(.08, at);
   level.gain.exponentialRampToValueAtTime(.001, at + .3);
   tone.connect(level).connect(sound.destination);
   tone.start(at); tone.stop(at + .32);
  }
 } catch {}
}
function tick() {
 left--;
 dial.textContent = time(Math.max(0, left));
 if (left > 0) return;
 stopClock();
 $('wheel-clock-box').classList.add('done');
 $('wheel-status').textContent = '¡Tiempo! Comentad el criterio y girad otra vez.';
 $('wheel-start').firstElementChild.textContent = 'Repetir';
 record('espalderas', 'ruleta', 'reto', {reto: current.id, tipo: current.family, sentado: seated.checked});
 chime();
}
$('wheel-start').addEventListener('click', () => {
 if (ticking) { stopClock(); $('wheel-start').firstElementChild.textContent = 'Seguir'; return; }
 if (left <= 0) { left = current.seconds; dial.textContent = time(left); $('wheel-clock-box').classList.remove('done'); $('wheel-status').textContent = ''; }
 ticking = setInterval(tick, 1000);
 $('wheel-start').firstElementChild.textContent = 'Pausar';
});
$('wheel-spin').addEventListener('click', spin);
seated.addEventListener('change', () => { if (current) $('wheel-text').textContent = seated.checked ? current.seated : current.standing; });
$('wheel').addEventListener('close', stopClock);
function openWheel() { $('wheel').showModal(); }

route();
