// What every place of El Pabellón shares: the floating buttons with the way back, who is playing and the record.
import {AVATARS, player, playerCode, mode, record} from '../registro.js';

export {record, player, playerCode, mode};

// Back to the corridor the visitor came from: the pupil's or the class screen's.
export const backToHub = () => '../#' + (mode() === 'pantalla' ? 'pantalla' : player() ? 'alumno' : '');

// A button that fills the screen with the game. It hides itself where the browser cannot do it (iPhone).
export function fullscreenButton(button, target = document.documentElement) {
 if (!document.fullscreenEnabled) { button.hidden = true; return; }
 button.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen(); else target.requestFullscreen?.().catch(() => {});
 });
}

// A room wider than the screen is moved sideways: the wheel of a mouse turns sideways there and two round
// buttons (`.pasillo-nav`) go one screen left or right; each hides at its end. Returns a function that
// redraws the buttons, for when the content changes.
export function sideways(scroller, left, right) {
 const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
 const draw = () => {
  const room = scroller.scrollWidth - scroller.clientWidth;
  left.hidden = room < 8 || scroller.scrollLeft < 8;
  right.hidden = room < 8 || scroller.scrollLeft > room - 8;
 };
 const slide = direction => scroller.scrollBy({left: direction * scroller.clientWidth * .7, behavior: still() ? 'auto' : 'smooth'});
 scroller.addEventListener('scroll', draw, {passive: true});
 scroller.addEventListener('wheel', event => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || scroller.scrollWidth <= scroller.clientWidth + 8) return;
  scroller.scrollLeft += event.deltaY; event.preventDefault();
 }, {passive: false});
 left.addEventListener('click', () => slide(-1));
 right.addEventListener('click', () => slide(1));
 addEventListener('resize', draw);
 draw();
 return Object.assign(draw, {slide});
}

// Draws the floating buttons as the first thing in the page. `name` is the place, e.g. 'El Tatami'.
// `fullscreen: false` is for a place that already has its own full-screen button.
export function topBar(name, {fullscreen = true} = {}) {
 const bar = document.createElement('header'), current = mode() === 'pantalla' ? null : player();
 bar.className = 'hub-top';
 bar.innerHTML = `<a class="lockup" aria-label="El Pabellón, volver al pasillo"><img src="../gimnasio/assets/icon-home.webp" alt="" width="34" height="34"><span><small>EL PABELLÓN</small><strong></strong></span></a>
  <div class="who"><span class="player-tag" hidden><img alt="" width="38" height="38"><span><small></small><strong></strong></span></span><span class="mode-tag" hidden>PANTALLA DIGITAL</span><button type="button" class="hud-round" aria-label="Pantalla completa" hidden><img src="../gimnasio/assets/icon-fullscreen.webp" alt="" width="26" height="26"></button><a class="leave">Volver</a></div>`;
 bar.querySelector('.lockup').href = bar.querySelector('.leave').href = backToHub();
 bar.querySelector('.lockup strong').textContent = name.toUpperCase();
 if (current) {
  const tag = bar.querySelector('.player-tag');
  tag.hidden = false;
  tag.querySelector('img').src = `../gimnasio/assets/pupil-${current.avatar}.webp`;
  tag.querySelector('small').textContent = AVATARS[current.avatar].toUpperCase();
  tag.querySelector('strong').textContent = playerCode(current);
 } else if (mode() === 'pantalla') bar.querySelector('.mode-tag').hidden = false;
 if (fullscreen) { const button = bar.querySelector('.hud-round'); button.hidden = false; fullscreenButton(button); }
 document.body.prepend(bar);
 return bar;
}
