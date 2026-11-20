// Front page: rain over the school, door filters, saved progress and the express challenge.
import {families} from './content.js';
import {eligibleChallenges} from './engine.js';

const $ = id => document.getElementById(id);
const still = matchMedia('(prefers-reduced-motion: reduce)');

// --- Rain -------------------------------------------------------------------
const sky = $('rain'), pen = sky.getContext('2d');
let drops = [], lastRain = 0, raining;
function sizeSky() {
 const scale = Math.min(2, devicePixelRatio || 1);
 sky.width = sky.clientWidth * scale;
 sky.height = sky.clientHeight * scale;
 pen.setTransform(scale, 0, 0, scale, 0, 0);
 const count = Math.round(sky.clientWidth * sky.clientHeight / 5200);
 drops = Array.from({length: count}, () => ({
  x: Math.random() * (sky.clientWidth + 80), y: Math.random() * sky.clientHeight,
  length: 9 + Math.random() * 16, speed: 420 + Math.random() * 380, light: .1 + Math.random() * .22,
 }));
 paintRain(0);
}
function paintRain(seconds) {
 const width = sky.clientWidth, height = sky.clientHeight;
 pen.clearRect(0, 0, width, height);
 pen.lineCap = 'round';
 for (const drop of drops) {
  drop.y += drop.speed * seconds;
  drop.x -= drop.speed * seconds * .18;
  if (drop.y > height) { drop.y = -drop.length; drop.x = Math.random() * (width + 80); }
  pen.strokeStyle = `rgba(214,234,240,${drop.light})`;
  pen.lineWidth = drop.length > 18 ? 1.5 : 1;
  pen.beginPath();
  pen.moveTo(drop.x, drop.y);
  pen.lineTo(drop.x - drop.length * .18, drop.y + drop.length);
  pen.stroke();
 }
}
function rain(now) {
 paintRain(Math.min(.05, (now - lastRain) / 1000));
 lastRain = now;
 raining = requestAnimationFrame(rain);
}
function startRain() {
 cancelAnimationFrame(raining);
 if (still.matches || document.hidden) return;
 lastRain = performance.now();
 raining = requestAnimationFrame(rain);
}
sizeSky();
startRain();
addEventListener('resize', sizeSky);
document.addEventListener('visibilitychange', startRain);
still.addEventListener('change', startRain);

// --- Doors ------------------------------------------------------------------
const doors = document.querySelector('.doors');
for (const button of document.querySelectorAll('[data-filter]')) {
 button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  for (const other of document.querySelectorAll('[data-filter]')) other.setAttribute('aria-pressed', String(other === button));
  doors.classList.toggle('filtered', filter !== 'all');
  for (const door of doors.querySelectorAll('.door')) door.classList.toggle('match', door.dataset.tags.split(' ').includes(filter));
 });
}
// Each room keeps its own progress in this browser; the door only reads it.
function saved(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function progress() {
 const mission = saved('patio-interior-v1')?.mission?.step, gym = saved('ef-gym-mission-v1')?.state?.stage;
 const notes = {
  mision: Number.isInteger(mission) && mission > 0 ? (mission >= 6 ? 'Refugio encendido' : `${mission} de 6 balizas`) : '',
  gimnasio: Number.isInteger(gym) && gym > 0 ? (gym >= 5 ? 'Misión completada' : `Fase ${gym + 1} de 5`) : '',
 };
 for (const door of document.querySelectorAll('[data-progress]')) {
  const ribbon = door.querySelector('.ribbon'), note = notes[door.dataset.progress];
  ribbon.textContent = note;
  ribbon.hidden = !note;
 }
}
progress();
addEventListener('pageshow', progress);

// --- Express challenge ------------------------------------------------------
const dialog = $('express'), clock = $('express-clock');
const kind = $('express-kind'), seated = $('express-seated');
for (const [id, name] of Object.entries(families)) kind.add(new Option(name, id));
let bag = [], current = null, left = 0, ticking = null, sound = null;
const time = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
function draw() {
 // Deal from a shuffled bag so a challenge does not come back until the others have been used.
 if (!bag.length) {
  bag = eligibleChallenges({family: kind.value});
  for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
  if (current && bag.length > 1 && bag.at(-1).id === current.id) bag.unshift(bag.pop());
 }
 return bag.pop();
}
function stop() { clearInterval(ticking); ticking = null; $('express-start').firstElementChild.textContent = left > 0 && left < current.seconds ? 'Seguir' : 'Empezar'; }
function show(challenge) {
 stop();
 current = challenge; left = challenge.seconds;
 $('express-family').textContent = families[challenge.family];
 $('express-players').textContent = challenge.minPlayers > 1 ? 'En parejas o grupos' : 'Cada uno en su sitio';
 $('express-title').textContent = challenge.title;
 $('express-text').textContent = seated.checked ? challenge.seated : challenge.standing;
 $('express-criterion').textContent = challenge.criterion;
 clock.textContent = time(left);
 clock.parentElement.classList.remove('done');
 $('express-status').textContent = '';
 $('express-start').firstElementChild.textContent = 'Empezar';
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
 clock.textContent = time(Math.max(0, left));
 if (left > 0) return;
 stop();
 clock.parentElement.classList.add('done');
 $('express-status').textContent = '¡Tiempo! Comentad el criterio y probad otro reto.';
 $('express-start').firstElementChild.textContent = 'Repetir';
 chime();
}
$('express-start').addEventListener('click', () => {
 if (ticking) { stop(); return; }
 if (left <= 0) { left = current.seconds; clock.textContent = time(left); clock.parentElement.classList.remove('done'); $('express-status').textContent = ''; }
 ticking = setInterval(tick, 1000);
 $('express-start').firstElementChild.textContent = 'Pausar';
});
$('express-next').addEventListener('click', () => show(draw()));
seated.addEventListener('change', () => { if (current) $('express-text').textContent = seated.checked ? current.seated : current.standing; });
kind.addEventListener('change', () => { bag = []; show(draw()); });
dialog.addEventListener('close', stop);
$('quick-challenge').addEventListener('click', () => { show(draw()); dialog.showModal(); });
