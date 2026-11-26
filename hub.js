import {missions,currentJourney} from './comun/recorrido.js';
// El Pabellón: who comes in (pupil, class screen or teacher) and the doors each one sees.
import {families} from './content.js';
import {eligibleChallenges} from './engine.js';
import {AVATARS, COURSES, GROUPS, LAST_NUMBER, player, setPlayer, leave, playerCode, studentId, setMode, record, entries, clearEntries, summary, toSheet,
 sync, connection, lupaConnection, setConnection, forgetConnection, testConnection, resendAll, cloudState, recover, classPackage, aliasEntry, setAliasEntry} from './registro.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const face = index => `./gimnasio/assets/pupil-${index}.webp`;
const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Places ------------------------------------------------------------------
// One entry per place of the school. `soon` places are painted on the wall but still closed.
const PLACES = {
 gimnasio: {name: 'El Gimnasio', kicker: 'Rescate del material', art: 'door-gimnasio', href: './gimnasio/', modes: 'Alumno · Pantalla', state: 'open'},
 pista: {name: 'La Pista', kicker: 'Mate Arena: balón prisionero', art: 'door-mate', href: './mate/', modes: 'Alumno', state: 'open'},
 espalderas: {name: 'Las Espalderas', kicker: 'Ruleta de retos para toda la clase', art: 'door-espalderas', action: 'wheel', modes: 'Pantalla', state: 'open'},
 pizarra: {name: 'La Pizarra', kicker: 'Rosco de Educación Física', art: 'door-pizarra', href: './pizarra/', modes: 'Alumno · Pantalla', state: 'open'},
 tatami: {name: 'El Tatami', kicker: 'Yoga: posturas y secuencias', art: 'door-tatami', href: './tatami/', modes: 'Alumno · Pantalla', state: 'open'},
 grada: {name: 'La Grada', kicker: 'Partidos de mate en directo', art: 'door-grada', href: './grada/', modes: 'Pantalla', state: 'open'},
 aula: {name: 'El Aula', kicker: 'La oca y el bingo en movimiento', art: 'door-aula', href: './aula/', modes: 'Pantalla · Tabletas', state: 'open'},
};
const MAPS = {
 alumno: {title: '¿A dónde vamos hoy?', places: ['gimnasio', 'pista', 'pizarra', 'tatami']},
 pantalla: {title: 'Pantalla digital: elegid un lugar', places: ['espalderas', 'aula', 'pizarra', 'gimnasio', 'tatami', 'grada']},
};
// Earlier experiments that no longer match the look of the school; only the teacher can still open them.
const REVIEW = [
 ['Misión Refugio', 'Seis retos con cronómetro', './patio.html#mision'],
 ['Pulso Lab', 'Secuencias de ritmo', './patio.html#pulso'],
 ['Liga Relámpago', 'Retos por equipos con rúbrica', './patio.html#liga'],
 ['Libro de retos', 'Los 24 retos de la ruleta', './patio.html#biblioteca'],
];

function doorMarkup(id) {
 const place = PLACES[id], soon = place.state === 'soon';
 const note = soon ? 'PRÓXIMAMENTE' : '';
 const inside = `<span class="arch${place.pixel ? ' pixel' : ''}"><img src="./assets/${place.art}.webp" alt="" width="480" height="640">${note ? `<span class="ribbon">${esc(note)}</span>` : ''}</span>
  <span class="plate">${esc(place.name)}</span><span class="kicker">${esc(place.kicker)}</span>`;
 if (soon) return `<li><div class="door soon" aria-label="${esc(place.name)}, próximamente">${inside}</div></li>`;
 if (place.action) return `<li><button type="button" class="door" data-action="${place.action}">${inside}</button></li>`;
 return `<li><a class="door" href="${place.href}">${inside}</a></li>`;
}

// --- Views -------------------------------------------------------------------
let view = 'title';
function show(next) {
 view = next;
 document.body.dataset.view = next;
 for (const name of ['title', 'login', 'map', 'teacher']) $('view-' + name).hidden = name !== next;
 scrollTo(0, 0);
}
function showMap(kind) {
 const map = MAPS[kind], current = player();
 $('map-title').textContent = map.title;
 const pupil = kind === 'alumno' && current;
 let places = map.places;
 $('switch-mode').hidden = !pupil;
 $('mission').textContent = '';
 if (pupil) {
  const direct = location.hash === '#directo';
  sessionStorage.setItem('pabellon-vuelta', direct ? 'directo' : 'alumno');
  const {index, unlocked} = currentJourney(), mission = missions[index];
  const catalogue = direct || !mission;
  places = catalogue ? [...unlocked] : [mission.place];
  $('map-title').textContent = direct ? 'Mis actividades' : mission ? mission.title : '¡El pabellón está listo!';
  $('mission').textContent = direct ? (unlocked.size === 4 ? 'Ya conoces todos los lugares. Elige qué quieres jugar.' : 'Elige un juego. En tu historia descubrirás más actividades.') : mission ? 'Misión ' + (index+1) + ' de ' + missions.length + '. ' + mission.task : 'Has preparado una sesión completa con Robles. Elige qué quieres volver a jugar.';
  $('switch-mode').href = direct ? '#alumno' : '#directo';
  $('switch-mode').textContent = direct ? 'Continuar mi historia' : 'Ver mis actividades';
 }
 $('doors').innerHTML = places.map(doorMarkup).join('');
 $('doors').classList.toggle('many', places.length > 4);
 $('locker-button').hidden = !pupil;
 $('mode-tag').hidden = kind !== 'pantalla';
 $('mode-tag').textContent = 'PANTALLA DIGITAL';
 if (pupil) { $('player-face').src = face(current.avatar); $('player-code').textContent = playerCode(current); }
 show('map');
}
function route() {
 const where = location.hash.slice(1);
 for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
 if (where === 'alumno' || where === 'directo') {
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
$('doors').addEventListener('click', event => { if (event.target.closest('[data-action="wheel"]')) openWheel(); });

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
 ];
 $('locker-list').innerHTML = lines.map(([label, value]) => `<li><span>${esc(label)}</span><b>${esc(value)}</b></li>`).join('');
 $('locker-recover').hidden = !connection();
 return true;
}
$('locker-button').addEventListener('click', () => { $('locker-status').textContent = ''; if (drawLocker()) $('locker').showModal(); });
// Another computer: what the teacher's sheet holds for this player joins this record.
$('locker-recover').addEventListener('click', async () => {
 $('locker-recover').disabled = true; $('locker-status').textContent = 'Buscando en la hoja del profe…';
 const result = await recover();
 $('locker-recover').disabled = false;
 $('locker-status').textContent = !result.ok ? result.motivo : result.added ? `¡Recuperado! ${result.added} ${result.added === 1 ? 'cosa' : 'cosas'} de otro ordenador.` : 'Ya lo tenías todo en este ordenador.';
 drawLocker(); showMap('alumno');
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
$('english-setting').onchange = e => {
 localStorage.setItem('pabellon-ingles',String(e.target.checked));
 document.documentElement.classList.toggle('con-ingles',e.target.checked);
};
function drawDesk() {
 $('english-setting').checked = localStorage.getItem('pabellon-ingles') === 'true';
 const rows = summary();
 const marks = row => row.marks.length ? row.marks.map(m => `${m.criterio} · ${String(m.nota).replace('.', ',')} ${m.calificacion}`).join('<br>') : '—';
 $('desk-summary').innerHTML = rows.length ? `<table><thead><tr><th>Jugador</th><th>Última vez</th><th>Aventura del gimnasio</th><th>Mate: partidos · ganados · mejor</th><th>Yoga: posturas · creadas · practicadas</th><th>Rosco: jugados · mejor</th><th>Ruleta · oca · bingo</th><th>Nota orientativa</th></tr></thead><tbody>${rows.map(row =>
  `<tr><th scope="row">${esc(row.who)}</th><td>${esc(when(row.last))}</td><td>${row.gymDone ? 'Completada' : row.gymPhase ? `Fase ${row.gymPhase} de 5` : '—'}</td><td>${row.matches ? `${row.matches} · ${row.wins} · ${row.bestPoints}` : '—'}</td><td>${row.poses.length || row.sequences || row.practices ? `${row.poses.length} · ${row.sequences} · ${row.practices}` : '—'}</td><td>${row.roscos ? `${row.roscos} · ${row.bestRosco}` : '—'}</td><td>${row.challenges || row.boards || row.bingos ? `${row.challenges} · ${row.boards} · ${row.bingos}` : '—'}</td><td>${marks(row)}</td></tr>`).join('')}</tbody></table>`
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
$('desk-clear').addEventListener('click', () => { if (confirm('¿Borrar todo el registro guardado en este ordenador? Descárgalo antes si lo necesitas.')) { clearEntries(); drawDesk(); } });
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
const time = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
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
