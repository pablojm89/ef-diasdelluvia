// The overlay around the court: ability bar, movement stick and the players' score table.
import {ACTIONS, abilityArt, talentArt, actionState} from './abilities.js';
import {HEROES} from './roster.js';
import {TEAM_COLORS, portrait} from './characters.js';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function buildBar(bar, character) {
 const hero = HEROES[character];
 bar.innerHTML = `<div class="ability passive" title="${esc(hero.ability)}: ${esc(hero.description)}">
   <span class="disc"><img src="${talentArt(character)}" alt=""></span><kbd>PASIVA</kbd><em>${esc(hero.ability)}</em></div>`
  + ACTIONS.map(action => `<button type="button" class="ability" data-command="${action.id}" tabindex="-1"
    aria-label="${esc(action.name)}, tecla ${esc(action.key)}. ${esc(action.detail)}" title="${esc(action.detail)}">
   <span class="disc"><img src="${abilityArt(action.id)}" alt="" draggable="false"><i class="sweep"></i><b class="count"></b></span>
   <kbd>${esc(action.key)}</kbd><em>${esc(action.name)}</em></button>`).join('');
 bar.dataset.character = character;
}

// Touch the page only when something changes: this runs on every frame.
function put(node, key, value) {
 if (node.dataset[key] !== value) node.dataset[key] = value;
}

export function updateBar(bar, me, ball) {
 if (!me || !ball) return;
 if (bar.dataset.character !== String(me.character)) buildBar(bar, me.character);
 for (const button of bar.querySelectorAll('[data-command]')) {
  const state = actionState(button.dataset.command, me, ball);
  const wait = state.wait || 0;
  const mode = state.locked ? 'locked' : state.active ? 'active' : wait > 0 ? 'wait' : state.off ? 'off' : 'ready';
  put(button, 'mode', mode);
  const share = wait > 0 ? Math.min(1, wait / state.total) : 0;
  const turn = (Math.round(share * 72) * 5) + 'deg';
  if (button.dataset.turn !== turn) { button.dataset.turn = turn; button.style.setProperty('--turn', turn); }
  const count = wait <= 0 ? '' : wait >= 9.95 ? String(Math.ceil(wait)) : wait.toFixed(1);
  const label = button.querySelector('.count');
  if (label.textContent !== count) label.textContent = count;
  if ('hold' in state) {
   const hold = (Math.round(state.hold * 36) * 10) + 'deg';
   if (button.dataset.hold !== hold) { button.dataset.hold = hold; button.style.setProperty('--hold', hold); }
  }
 }
}

// A stick that appears under the thumb. Reports a direction from -1 to 1 on each axis.
export function attachStick(zone, stick, report) {
 const knob = stick.firstElementChild;
 let pointer = null, originX = 0, originY = 0;
 const reach = () => stick.offsetWidth * .5;
 function place() {
  const box = zone.getBoundingClientRect();
  stick.style.left = originX - box.left + 'px';
  stick.style.top = originY - box.top + 'px';
  stick.style.bottom = 'auto';
 }
 function move(event) {
  const max = reach();
  let dx = event.clientX - originX, dy = event.clientY - originY;
  const length = Math.hypot(dx, dy);
  if (length > max) {
   // The base follows a thumb that slides past the rim, so the stick never gets lost.
   originX += dx * (1 - max / length); originY += dy * (1 - max / length);
   dx *= max / length; dy *= max / length;
   place();
  }
  knob.style.transform = `translate(${dx}px,${dy}px)`;
  const x = dx / max, y = dy / max, force = Math.hypot(x, y);
  if (force < .18) report(0, 0);
  else report(x / force * Math.min(1, (force - .18) / .6), y / force * Math.min(1, (force - .18) / .6));
 }
 function release(event) {
  if (event.pointerId !== pointer) return;
  pointer = null;
  stick.classList.remove('held');
  stick.style.left = stick.style.top = stick.style.bottom = '';
  knob.style.transform = '';
  report(0, 0);
 }
 zone.addEventListener('pointerdown', event => {
  if (pointer !== null || event.pointerType === 'mouse') return;
  event.preventDefault();
  pointer = event.pointerId;
  zone.setPointerCapture(pointer);
  originX = event.clientX; originY = event.clientY;
  stick.classList.add('held');
  place();
  move(event);
 });
 zone.addEventListener('pointermove', event => { if (event.pointerId === pointer) move(event); });
 for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) zone.addEventListener(type, release);
}

const PLAYS = [['hits', 'Dianas'], ['catches', 'Atrapadas'], ['dodges', 'Esquivas'], ['assists', 'Asistencias'], ['rescues', 'Rescates']];

export function resultsMarkup(state, localId) {
 const ranking = [...state.players].sort((a, b) => (b.points || 0) - (a.points || 0) || a.team - b.team || a.slot - b.slot);
 const best = ranking[0]?.points > 0 ? ranking[0].id : null;
 const totals = [0, 1].map(team => state.players.filter(p => p.team === team).reduce((sum, p) => sum + (p.points || 0), 0));
 const rows = ranking.map((p, index) => `<tr class="team-${p.team}${p.id === localId ? ' mine' : ''}">
   <td class="place">${index + 1}</td>
   <th scope="row"><img src="${portrait(p.character)}" alt="" width="34" height="34"><span>${esc(p.name)}${p.id === localId ? ' · TÚ' : p.bot ? ' · IA' : ''}${p.id === best ? ' <b class="mvp">MVP</b>' : ''}<small>${TEAM_COLORS[p.team].name}</small></span></th>
   ${PLAYS.map(([key]) => `<td>${p[key] || 0}</td>`).join('')}
   <td class="points">${p.points || 0}</td></tr>`).join('');
 return `<div class="results-teams">${[0, 1].map(team => `<div class="team-${team}"><span>${TEAM_COLORS[team].name}</span><strong>${state.scores[team]}</strong><small>${totals[team]} pts</small></div>`).join('<i>—</i>')}</div>
  <div class="results-scroll"><table><thead><tr><th scope="col">#</th><th scope="col">Jugador</th>${PLAYS.map(([, label]) => `<th scope="col">${label}</th>`).join('')}<th scope="col">Puntos</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
