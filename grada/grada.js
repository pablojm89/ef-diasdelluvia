// La Grada: the class screen watches up to four Mate Arena rooms at once.
import {topBar} from '../comun/lugar.js';
import {ArenaRenderer} from '../mate/renderer.js';
import {resultsMarkup} from '../mate/hud.js';
import {TEAM_COLORS, portrait} from '../mate/characters.js';
import {RoomWatch, MAX_ROOMS, parseCodes, codesFromLocation} from './sala.js';

topBar('La Grada', {fullscreen: false});
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const tiles = new Map();

const TEXT = {
 searching: ['Buscando la sala…', 'Conectando con el ordenador que ha creado la sala.'],
 lobby: ['En el vestuario', 'Los equipos se están preparando. El partido aparece aquí en cuanto empiece.'],
 playing: ['En juego', ''],
 paused: ['Pausa', ''],
 over: ['Terminado', ''],
 lost: ['Conexión perdida', ''],
};
const CHIP = {searching: 'BUSCANDO', lobby: 'VESTUARIO', playing: 'EN JUEGO', paused: 'PAUSA', over: 'TERMINADO', lost: 'SIN SEÑAL'};

function clientKey(code) { return 'grada-cliente-' + code; }
function savedClient(code) { try { return sessionStorage.getItem(clientKey(code)); } catch { return null; } }
function saveClient(code, id) { try { sessionStorage.setItem(clientKey(code), id); } catch { /* Private mode: a new id on reload is fine. */ } }

function addRoom(code) {
 if (tiles.has(code)) return 'Esa sala ya está en la pantalla.';
 if (tiles.size >= MAX_ROOMS) return `Caben ${MAX_ROOMS} salas a la vez. Quita una para añadir otra.`;
 const node = $('tile-template').content.firstElementChild.cloneNode(true);
 node.querySelector('.room-code').textContent = 'SALA ' + code;
 node.querySelector('.remove').setAttribute('aria-label', 'Quitar la sala ' + code);
 node.querySelector('.remove').addEventListener('click', () => removeRoom(code));
 const canvas = node.querySelector('canvas');
 canvas.setAttribute('aria-label', 'Partido de la sala ' + code);
 $('mosaic').append(node);
 const tile = {code, node, renderer: new ArenaRenderer(canvas), key: '', resultsKey: '', drawnAt: 0, lineupKey: ''};
 tile.watch = new RoomWatch(code, {clientId: savedClient(code), saveClientId: id => saveClient(code, id), onChange: () => paintStatus(tile)});
 tiles.set(code, tile);
 paintStatus(tile);
 tile.watch.connect();
 layout();
 return '';
}

function removeRoom(code) {
 const tile = tiles.get(code);
 if (!tile) return;
 tile.watch.stop();
 tile.node.remove();
 tiles.delete(code);
 layout();
}

function layout() {
 document.body.dataset.count = tiles.size;
 $('empty').hidden = tiles.size > 0;
 $('mosaic').hidden = tiles.size === 0;
 const codes = [...tiles.keys()];
 history.replaceState(null, '', codes.length ? '#sala=' + codes.join(',') : location.pathname + location.search);
}

function clock(seconds) {
 const s = Math.max(0, Math.ceil(seconds || 0));
 return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function paintStatus(tile) {
 const {watch, node} = tile, status = watch.status;
 node.dataset.status = status;
 const chip = node.querySelector('.chip');
 chip.textContent = CHIP[status];
 chip.dataset.retry = '';
 const [title, text] = TEXT[status];
 node.querySelector('.notice-title').textContent = title;
 node.querySelector('.notice-text').textContent = status === 'lost' ? (watch.message || 'Se ha cortado la conexión con la sala.') : text;
 paintLineup(tile);
 if (status !== 'over') { node.querySelector('.results').hidden = true; tile.resultsKey = ''; }
}

// The changing room: who is in each team and whether they are ready. Hero names only, never pupils.
function paintLineup(tile) {
 const lobby = tile.watch.lobby, box = tile.node.querySelector('.lineup');
 const members = tile.watch.status === 'lobby' && lobby ? lobby.members.filter(m => m.connected) : [];
 const key = members.map(m => `${m.team}${m.character}${m.ready}`).join() + (lobby?.rules?.teamSize ?? '');
 if (key === tile.lineupKey) return;
 tile.lineupKey = key;
 if (!members.length) { box.innerHTML = ''; return; }
 box.innerHTML = [0, 1].map(team => {
  const list = members.filter(m => m.team === team);
  return `<div class="team team-${team}"><h3>${TEAM_COLORS[team].name} <small>${list.length}/${lobby.rules.teamSize}</small></h3><ul>${list.map(m =>
   `<li class="${m.ready ? 'ready' : ''}"><img src="${portrait(m.character)}" alt="" width="34" height="34"><span>${esc(m.name)}</span><b>${m.ready ? 'LISTO' : '…'}</b></li>`).join('')}</ul></div>`;
 }).join('');
}

function paintBoard(tile, state) {
 const rules = state?.rules || tile.watch.lobby?.rules;
 const scores = state?.scores || [0, 0];
 const over = state?.phase === 'matchOver';
 const key = state ? `${scores}|${over ? 'end' : clock(state.roundLeft)}|${state.round}|${rules?.bestOf}` : 'none' + (rules?.bestOf ?? '');
 if (key === tile.key) return;
 tile.key = key;
 const sides = tile.node.querySelectorAll('.score');
 sides[0].textContent = scores[0];
 sides[1].textContent = scores[1];
 tile.node.querySelector('.timer').textContent = over ? 'FINAL' : state ? clock(state.roundLeft) : '–:––';
 tile.node.querySelector('.round').textContent = state ? `RONDA ${state.round}${rules?.bestOf === 3 ? ' · AL MEJOR DE 3' : ''}` : rules ? (rules.bestOf === 3 ? 'AL MEJOR DE 3' : 'UNA RONDA') : '';
}

function paintResults(tile, state) {
 const box = tile.node.querySelector('.results');
 if (state?.phase !== 'matchOver') return;
 const key = state.players.map(p => p.points || 0).join() + state.scores.join();
 if (key === tile.resultsKey) return;
 tile.resultsKey = key;
 box.querySelector('.results-title').textContent = state.winner === null ? '¡Empate! Buen juego' : `¡${TEAM_COLORS[state.winner].name} ganan el partido!`;
 box.querySelector('.results-body').innerHTML = resultsMarkup(state, null);
 box.hidden = false;
}

// Smooth player movement between two snapshots, as the players' own screens do.
function interpolate(watch, now) {
 const {state, previous} = watch;
 if (!state || !previous) return state;
 const alpha = Math.min(1, Math.max(0, (now - watch.stateAt) / 67));
 return {...state, players: state.players.map(p => {
  const before = previous.players.find(q => q.id === p.id);
  if (!before || before.prison !== p.prison || Math.hypot(before.x - p.x, before.y - p.y) > 180) return p;
  return {...p, x: before.x + (p.x - before.x) * alpha, y: before.y + (p.y - before.y) * alpha};
 })};
}

function frame(now) {
 for (const tile of tiles.values()) {
  const {watch} = tile;
  watch.check();
  if (watch.status === 'lost' && watch.retryAt) {
   const left = Math.ceil((watch.retryAt - now) / 1000);
   const text = left > 0 ? `Reintentando en ${left} s…` : 'Reintentando…';
   const chip = tile.node.querySelector('.chip');
   if (chip.dataset.retry !== text) { chip.dataset.retry = text; tile.node.querySelector('.notice-title').textContent = 'Conexión perdida · ' + text; }
  }
  paintLineup(tile);
  paintBoard(tile, watch.state);
  paintResults(tile, watch.state);
  if (now - tile.drawnAt > 32) {
   tile.renderer.render(watch.state ? interpolate(watch, now) : null, null, {}, 0, now, true);
   tile.drawnAt = now;
  }
 }
 requestAnimationFrame(frame);
}

$('add-code').addEventListener('input', event => { event.target.value = event.target.value.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, ''); });
$('add-form').addEventListener('submit', event => {
 event.preventDefault();
 const codes = parseCodes($('add-code').value);
 if (!codes.length) { $('add-status').textContent = 'El código tiene seis letras o números, como aparece en el vestuario.'; return; }
 const problem = codes.map(addRoom).find(Boolean) || '';
 $('add-status').textContent = problem;
 if (!problem) $('add-code').value = '';
});
$('fullscreen').addEventListener('click', async () => {
 try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen({navigationUI: 'hide'}); }
 catch { $('add-status').textContent = 'Este navegador no permite la pantalla completa. Prueba con F11.'; }
});
document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa'; });
window.addEventListener('hashchange', () => {
 const wanted = codesFromLocation(location);
 for (const code of [...tiles.keys()]) if (!wanted.includes(code)) removeRoom(code);
 for (const code of wanted) if (!tiles.has(code)) addRoom(code);
});
window.addEventListener('pagehide', () => { for (const tile of tiles.values()) tile.watch.room?.close(); });

// Read-only view of what each tile shows, for browser checks.
Object.defineProperty(window, 'gradaDiagnostics', {value: () => [...tiles.values()].map(({code, watch}) => ({code, status: watch.status, message: watch.message, transport: watch.room?.transport || null, tick: watch.state?.tick ?? null, phase: watch.state?.phase ?? null, scores: watch.state?.scores ?? null, players: watch.state?.players.map(p => ({id: p.id, x: p.x, y: p.y})) ?? null}))});

for (const code of codesFromLocation(location)) addRoom(code);
layout();
requestAnimationFrame(frame);
