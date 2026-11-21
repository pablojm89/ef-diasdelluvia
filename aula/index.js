// El Aula: the room with the two game tables.
import {topBar} from '../comun/lugar.js';
import * as oca from './oca-reglas.js';
import {pawn} from './dibujos.js';
import {cardFor} from './bingo-reglas.js';
import {byId, ZONAS} from './movimientos.js';
import {$, pintado} from './aula.js';

topBar('El Aula');
const room = pintado('aula');
if (room) { $('main').style.setProperty('--aula-bg', `url(${room}) 50% 100%`); $('main').style.setProperty('--aula-bg-size', 'cover'); }

// Each table shows its painted picture, or a small drawing of the game on it.
function miniBoard() {
 const tiles = oca.POINTS.map(([x, y], i) => {
  const tile = oca.TILES[i], s = i === oca.GOAL ? 176 : 144;
  const fill = tile.special === 'salida' ? '#f4e6c4' : tile.special === 'meta' ? '#f2bd57' : oca.FAMILY_COLOURS[tile.family];
  return `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="24" fill="${fill}" stroke="#3a2a14" stroke-width="10"/>`;
 }).join('');
 const pawns = [[150, 880, 0], [617, 150, 1], [1386, 578, 2], [871, 874, 3]].map(([x, y, t]) => `<g transform="translate(${x} ${y})">${pawn(oca.TEAMS[t], 52)}</g>`).join('');
 return `<svg viewBox="40 40 1456 944" aria-hidden="true">${tiles}${pawns}</svg>`;
}
function miniCard() {
 const card = cardFor(12, 3);
 const cells = card.map((id, i) => {
  const x = 30 + (i % 3) * 100, y = 30 + Math.floor(i / 3) * 100, marked = [0, 4, 5, 8].includes(i);
  return `<rect x="${x}" y="${y}" width="92" height="92" rx="10" fill="#fffdf6" stroke="#c9a769" stroke-width="3"/><rect x="${x}" y="${y}" width="12" height="92" rx="4" fill="${ZONAS[byId(id).zona].colour}"/>
   <rect x="${x + 28}" y="${y + 30}" width="50" height="8" rx="4" fill="#9a8a6a"/><rect x="${x + 34}" y="${y + 50}" width="38" height="6" rx="3" fill="#c9b48a"/>
   ${marked ? `<circle cx="${x + 50}" cy="${y + 46}" r="34" fill="none" stroke="#2c6b4a" stroke-width="7" opacity=".8"/>` : ''}`;
 }).join('');
 return `<svg viewBox="0 0 520 340" aria-hidden="true"><g transform="rotate(-5 160 170)"><rect x="14" y="14" width="324" height="324" rx="16" fill="#fff8e6" stroke="#463e28" stroke-width="5"/>${cells}</g>
  <g transform="translate(360 40) rotate(6)"><rect width="140" height="200" rx="16" fill="#2a2522"/><rect x="10" y="12" width="120" height="176" rx="6" fill="#fff3d9"/>
  ${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${18 + c * 36}" y="${46 + r * 36}" width="32" height="32" rx="4" fill="${Object.values(ZONAS)[(r * 3 + c) % 6].colour}" opacity=".85"/>`).join('')).join('')}</g></svg>`;
}
const art = (clave, fallback) => { const url = pintado(clave); return url ? `<img src="${url}" alt="" width="640" height="440">` : fallback(); };
$('table-oca').innerHTML = art('mesa-oca', miniBoard);
$('table-bingo').innerHTML = art('mesa-bingo', miniCard);
