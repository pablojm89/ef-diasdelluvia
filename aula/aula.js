// Small pieces shared by the pages of El Aula: painted art when it exists, storage, clock and sound.
import {PINTADOS} from './assets/pintados.js';

const assets = new URL('./assets/', import.meta.url);
// URL of a painted image of arte/lotes/12-aula.json once integrated, otherwise null (the page draws its own).
export const pintado = clave => PINTADOS.includes(clave) ? new URL(clave + '.webp', assets).href : null;

export const $ = id => document.getElementById(id);
export const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
export const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const wait = ms => new Promise(resolve => setTimeout(resolve, still() ? 0 : ms));

// Everything El Aula keeps in the browser starts with `aula-`.
export function load(key, valid) {
 try { const value = JSON.parse(localStorage.getItem('aula-' + key)); return valid(value) ? value : null; } catch { return null; }
}
export function save(key, value) {
 try { localStorage.setItem('aula-' + key, JSON.stringify(value)); } catch {}
}
export function forget(key) {
 try { localStorage.removeItem('aula-' + key); } catch {}
}

export const time = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

let sound = null;
export function chime(notes = [[0, 660], [.16, 880]]) {
 try {
  sound ||= new (window.AudioContext || window.webkitAudioContext)();
  for (const [delay, pitch] of notes) {
   const tone = sound.createOscillator(), level = sound.createGain(), at = sound.currentTime + delay;
   tone.frequency.value = pitch;
   level.gain.setValueAtTime(.08, at);
   level.gain.exponentialRampToValueAtTime(.001, at + .3);
   tone.connect(level).connect(sound.destination);
   tone.start(at); tone.stop(at + .32);
  }
 } catch {}
}

// A countdown bound to an <output> and a start/pause button. `onEnd` runs when it reaches zero.
export function countdown(output, button, onEnd) {
 let left = 0, total = 0, ticking = null;
 const label = text => { button.firstElementChild.textContent = text; };
 const stop = () => { clearInterval(ticking); ticking = null; };
 const paint = () => { output.textContent = time(Math.max(0, left)); };
 const tick = () => {
  left--; paint();
  if (left > 0) return;
  stop(); output.parentElement.classList.add('done'); label('Repetir'); chime(); onEnd?.();
 };
 button.addEventListener('click', () => {
  if (ticking) { stop(); label('Seguir'); return; }
  if (left <= 0) { left = total; paint(); output.parentElement.classList.remove('done'); }
  ticking = setInterval(tick, 1000); label('Pausar');
 });
 return {
  set(seconds) { stop(); left = total = seconds; paint(); output.parentElement.classList.remove('done'); label('Empezar'); },
  start() { if (!ticking) button.click(); },
  stop,
  get running() { return !!ticking; },
 };
}
