// What every place of El Pabellón shares: the top bar with the way back, who is playing and the record.
import {AVATARS, player, playerCode, mode, record} from '../registro.js';

export {record, player, playerCode, mode};

// Back to the doors the visitor came from: the pupil's or the class screen's.
export const backToHub = () => '../#' + (mode() === 'pantalla' ? 'pantalla' : player() ? 'alumno' : '');

// Draws the top bar as the first thing in the page. `name` is the place, e.g. 'El Tatami'.
export function topBar(name) {
 const bar = document.createElement('header'), current = mode() === 'pantalla' ? null : player();
 bar.className = 'hub-top';
 bar.innerHTML = `<a class="lockup" aria-label="El Pabellón, volver a las puertas"><img src="../assets/mark.svg" alt="" width="40" height="40"><span><small>EL PABELLÓN</small><strong></strong></span></a>
  <div class="who"><span class="player-tag" hidden><img alt="" width="40" height="40"><span><small></small><strong></strong></span></span><span class="mode-tag" hidden>PANTALLA DIGITAL</span><a class="leave">Volver</a></div>`;
 bar.querySelector('.lockup').href = bar.querySelector('.leave').href = backToHub();
 bar.querySelector('.lockup strong').textContent = name.toUpperCase();
 if (current) {
  const tag = bar.querySelector('.player-tag');
  tag.hidden = false;
  tag.querySelector('img').src = `../gimnasio/assets/pupil-${current.avatar}.webp`;
  tag.querySelector('small').textContent = AVATARS[current.avatar].toUpperCase();
  tag.querySelector('strong').textContent = playerCode(current);
 } else if (mode() === 'pantalla') bar.querySelector('.mode-tag').hidden = false;
 document.body.prepend(bar);
 return bar;
}
