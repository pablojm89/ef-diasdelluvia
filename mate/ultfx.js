// How each ultimate looks: what stays on a player, what the ball becomes, the burst when it is cast
// and the banner that announces it. Drawing only; the rules are in sim.js.
import {TEAM_COLORS, portrait} from './characters.js';
import {HEROES} from './roster.js';
import {FIELD, EFFECT, GIANT} from './sim.js';

const TAU = Math.PI * 2;
const INK = '#17233b';
const clamp01 = n => Math.max(0, Math.min(1, n));
const ease = n => 1 - (1 - clamp01(n)) ** 3;
// A repeatable "random" number from 0 to 1 for a given seed, so effects do not flicker between frames.
const rand = seed => { const x = Math.sin(seed * 127.1 + 11.7) * 43758.5453; return x - Math.floor(x); };
const idSeed = id => [...String(id)].reduce((sum, letter) => sum + letter.charCodeAt(0), 0);

function label(c, words, x, y, size, color) {
 c.font = `900 ${size}px "Trebuchet MS",system-ui,sans-serif`;
 c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
 c.lineWidth = Math.max(3, size / 5); c.strokeStyle = INK; c.strokeText(words, x, y);
 c.fillStyle = color; c.fillText(words, x, y);
}

// A jagged lightning line between two points.
function bolt(c, x1, y1, x2, y2, seed, width, color) {
 const steps = 7, dx = x2 - x1, dy = y2 - y1, length = Math.hypot(dx, dy) || 1;
 c.beginPath(); c.moveTo(x1, y1);
 for (let i = 1; i < steps; i++) {
  const off = (rand(seed + i) - .5) * length * .28;
  c.lineTo(x1 + dx * i / steps - dy / length * off, y1 + dy * i / steps + dx / length * off);
 }
 c.lineTo(x2, y2);
 c.lineCap = 'round'; c.lineJoin = 'round';
 c.strokeStyle = color; c.lineWidth = width; c.stroke();
}

function eye(c, x, y, width, height, alpha = 1) {
 c.save(); c.globalAlpha *= alpha;
 c.beginPath(); c.moveTo(x - width, y); c.quadraticCurveTo(x, y - height * 2, x + width, y); c.quadraticCurveTo(x, y + height * 2, x - width, y); c.closePath();
 c.fillStyle = '#f6ecff'; c.fill(); c.strokeStyle = INK; c.lineWidth = Math.max(1.5, width / 12); c.stroke();
 c.save(); c.clip();
 c.fillStyle = '#8d5be0'; c.beginPath(); c.arc(x, y, height * .95, 0, TAU); c.fill();
 c.fillStyle = INK; c.beginPath(); c.arc(x, y, height * .45, 0, TAU); c.fill();
 c.fillStyle = '#fff'; c.beginPath(); c.arc(x - height * .3, y - height * .3, height * .2, 0, TAU); c.fill();
 c.restore(); c.restore();
}

function smoke(c, x, y, age, seed) {
 for (let i = 0; i < 9; i++) {
  const angle = rand(seed + i) * TAU, far = 8 + age * (24 + rand(seed + i * 3) * 30), size = 14 * (1 - age * .5) * (.6 + rand(seed + i * 7));
  c.fillStyle = i % 2 ? '#f4f1e6' : '#c9d3dc';
  c.fillRect(Math.round(x + Math.cos(angle) * far - size / 2), Math.round(y - 18 + Math.sin(angle) * far * .7 - size / 2 - age * 14), size, size);
 }
}

// How the sprite itself changes: size, transparency and colour.
export function playerLook(p) {
 const look = {scale: 1, alpha: 1, tint: null};
 if (p.giant > 0) look.scale = 1 + (GIANT - 1) * ease(Math.min((EFFECT.giant - p.giant) / .3, p.giant / .3));
 if (p.frozen > 0) look.tint = 'rgba(150,215,255,.62)';
 else if (p.flash > 0) { look.tint = 'rgba(255,238,130,.4)'; look.alpha = .88; }
 return look;
}

// Marks on the floor, under the sprite.
export function auraUnder(c, p, g) {
 const t = g.time;
 if (p.giant > 0) {
  c.strokeStyle = '#5b3a1c99'; c.lineWidth = 2; c.beginPath();
  for (let i = 0; i < 7; i++) { const a = i * TAU / 7 + .3, far = 30 + rand(i + 3) * 18; c.moveTo(p.x + Math.cos(a) * 16, p.y + 10 + Math.sin(a) * 6); c.lineTo(p.x + Math.cos(a) * far, p.y + 10 + Math.sin(a) * far * .4); }
  c.stroke();
 }
 if (p.turbo > 0) {
  const color = TEAM_COLORS[p.team].light;
  c.strokeStyle = color; c.lineWidth = 3; c.globalAlpha = .55 + Math.sin(t * 14) * .25;
  c.beginPath(); c.ellipse(p.x, p.y + 9, 27, 10, 0, 0, TAU); c.stroke(); c.globalAlpha = 1;
  c.fillStyle = '#ffe9a0';
  for (let i = 0; i < 4; i++) { const rise = (t * 2.2 + i / 4) % 1; c.fillRect(p.x - 24 + i * 15, p.y + 6 - rise * 26, 4, 7 * (1 - rise) + 2); }
 }
 if (p.slowed > 0) { c.strokeStyle = '#c7a1ff'; c.lineWidth = 2; c.beginPath(); c.ellipse(p.x, p.y + 8, 23, 8, 0, 0, TAU); c.stroke(); }
 if (p.frozen > 0) { c.fillStyle = '#bfe9ffaa'; c.beginPath(); c.ellipse(p.x, p.y + 10, 30, 10, 0, 0, TAU); c.fill(); }
 if (p.flash > 0) { c.strokeStyle = '#fff3a0'; c.lineWidth = 2; c.setLineDash([6, 5]); c.lineDashOffset = -t * 90; c.beginPath(); c.ellipse(p.x, p.y + 9, 26, 9, 0, 0, TAU); c.stroke(); c.setLineDash([]); }
}

// Marks around and above the sprite.
export function auraOver(c, p, g, now) {
 const t = g.time, top = p.y - 62 * (p.giant > 0 ? playerLook(p).scale : 1);
 if (p.frozen > 0) {
  // A block of ice that cracks as the freeze runs out.
  c.fillStyle = 'rgba(190,232,255,.34)'; c.strokeStyle = '#eaf8ff'; c.lineWidth = 2;
  c.beginPath(); c.roundRect(p.x - 24, p.y - 60, 48, 74, 6); c.fill(); c.stroke();
  c.strokeStyle = '#ffffffcc'; c.beginPath(); c.moveTo(p.x - 16, p.y - 50); c.lineTo(p.x - 4, p.y - 38); c.moveTo(p.x - 18, p.y - 36); c.lineTo(p.x - 12, p.y - 30); c.stroke();
  if (p.frozen < 1) { c.strokeStyle = '#3d7fa8'; c.beginPath(); c.moveTo(p.x + 4, p.y - 60); c.lineTo(p.x - 3, p.y - 34); c.lineTo(p.x + 9, p.y - 12); c.lineTo(p.x + 1, p.y + 14); c.stroke(); }
 }
 if (p.shield > 0 && (p.shield > 1.5 || Math.floor(now / 90) % 2)) {
  const r = 31 + Math.sin(t * 5 + p.slot) * 1.5, cy = p.y - 18;
  c.fillStyle = 'rgba(160,232,255,.16)'; c.strokeStyle = '#bff3ff'; c.lineWidth = 2.5;
  c.beginPath(); c.arc(p.x, cy, r, 0, TAU); c.fill(); c.stroke();
  c.strokeStyle = '#ffffffdd'; c.lineWidth = 3; c.beginPath(); c.arc(p.x, cy, r - 6, -2.5, -1.7); c.stroke();
  c.strokeStyle = '#ff9fd8aa'; c.lineWidth = 2; c.beginPath(); c.arc(p.x, cy, r - 4, .5, 1.3); c.stroke();
 }
 if (p.turbo > 0) {
  const color = TEAM_COLORS[p.team].light;
  for (let i = 0; i < 2; i++) {
   const rise = (t * 2 + i / 2) % 1, y = top + 4 - rise * 16;
   c.globalAlpha = 1 - rise; c.strokeStyle = INK; c.lineWidth = 6; c.lineJoin = 'round';
   c.beginPath(); c.moveTo(p.x - 9, y + 6); c.lineTo(p.x, y - 2); c.lineTo(p.x + 9, y + 6); c.stroke();
   c.strokeStyle = color; c.lineWidth = 3; c.stroke();
  }
  c.globalAlpha = 1;
 }
 if (p.slowed > 0) eye(c, p.x, top + 6 + Math.sin(t * 4 + p.slot) * 2, 11, 3.6);
 if (p.flash > 0) {
  const tickSeed = Math.floor(now / 70) + idSeed(p.id);
  for (let i = 0; i < 2; i++) {
   const a = rand(tickSeed + i * 9) * TAU, b = a + 1.6 + rand(tickSeed + i) * 1.5;
   bolt(c, p.x + Math.cos(a) * 26, p.y - 20 + Math.sin(a) * 30, p.x + Math.cos(b) * 26, p.y - 20 + Math.sin(b) * 30, tickSeed + i * 5, 4, '#fff7c0');
   bolt(c, p.x + Math.cos(a) * 26, p.y - 20 + Math.sin(a) * 30, p.x + Math.cos(b) * 26, p.y - 20 + Math.sin(b) * 30, tickSeed + i * 5, 1.5, '#ffffff');
  }
 }
}

// La Red: a mesh standing on the centre line.
export function drawNets(c, g) {
 for (const team of [0, 1]) {
  const left = g.net?.[team] || 0;
  if (left <= 0) continue;
  const rise = ease(Math.min((EFFECT.net - left) / .25, left / .25)), color = TEAM_COLORS[team];
  const x = FIELD.mid, top = 150, bottom = 640, half = 17 * rise;
  c.save();
  c.fillStyle = color.main + '33'; c.fillRect(x - half, top, half * 2, bottom - top);
  c.beginPath(); c.rect(x - half, top, half * 2, bottom - top); c.clip();
  c.strokeStyle = '#fff6da'; c.lineWidth = 2; c.beginPath();
  for (let y = top - 40; y < bottom + 30; y += 11) { c.moveTo(x - 18, y); c.lineTo(x + 18, y + 36); c.moveTo(x + 18, y); c.lineTo(x - 18, y + 36); }
  c.stroke();
  // A glint that runs down the net.
  const glint = top + ((g.time * 420) % (bottom - top));
  c.fillStyle = '#ffffff88'; c.fillRect(x - 18, glint, 36, 26);
  c.restore();
  c.strokeStyle = color.light; c.lineWidth = 3;
  c.beginPath(); c.moveTo(x - half, top); c.lineTo(x - half, bottom); c.moveTo(x + half, top); c.lineTo(x + half, bottom); c.stroke();
  for (const y of [top, bottom]) {
   c.fillStyle = '#8a5a2b'; c.strokeStyle = INK; c.lineWidth = 2;
   c.beginPath(); c.rect(x - 5, y - 30 * rise, 10, 30 * rise + 4); c.fill(); c.stroke();
   c.fillStyle = '#ffd36b'; c.fillRect(x - 5, y - 30 * rise, 10, 4);
  }
 }
 if (g.players.some(p => p.frozen > 0)) { c.fillStyle = 'rgba(150,215,255,.09)'; c.fillRect(55, 140, 1090, 505); }
}

// What the ball wears while an ultimate carries it. Returns the radius to draw the ball with.
export function ballLook(c, g, b, bx, by, now, trail) {
 const t = g.time, speed = Math.hypot(b.vx, b.vy);
 if (b.magnet) {
  const to = g.players.find(p => p.id === b.magnet);
  if (to) {
   c.setLineDash([10, 8]); c.lineDashOffset = t * 260; c.lineWidth = 5;
   c.strokeStyle = '#ff6b5c'; c.beginPath(); c.moveTo(bx, by); c.lineTo(to.x, to.y - 20); c.stroke();
   c.lineDashOffset = t * 260 + 9; c.strokeStyle = '#6bb8ff'; c.stroke(); c.setLineDash([]);
   magnet(c, to.x, to.y - 78, 1);
  }
  return 9;
 }
 if (!b.live) return 9;
 if (b.kind === 'comet') {
  c.save(); c.translate(bx, by); c.rotate(Math.atan2(b.vy, b.vx));
  for (const [length, radius, color] of [[124, 19, '#ab38daaa'], [86, 13, '#ff7299'], [52, 8, '#fff0aa']]) {
   c.fillStyle = color; c.beginPath(); c.moveTo(-length, Math.sin(t * 34) * 5);
   c.quadraticCurveTo(-18, -radius * 2, 6, -radius / 2); c.quadraticCurveTo(20, 0, 4, radius); c.closePath(); c.fill();
  }
  c.restore();
  trail.forEach((spot, i) => { if (i % 2) return; c.fillStyle = i % 4 ? '#fff0aa' : '#ff9fd8'; const size = 3 + rand(i + Math.floor(now / 80)) * 4; c.fillRect(spot.x - size / 2 + (rand(i) - .5) * 26, spot.y - size / 2 + (rand(i + 5) - .5) * 26, size, size); });
 }
 if (b.kind === 'homing') {
  const target = g.players.find(p => p.id === b.target);
  if (target) {
   c.setLineDash([3, 9]); c.lineDashOffset = -t * 120; c.strokeStyle = '#ff5a4dcc'; c.lineWidth = 3;
   c.beginPath(); c.moveTo(bx, by); c.lineTo(target.x, target.y - 18); c.stroke(); c.setLineDash([]);
   reticle(c, target.x, target.y - 18, 30 + Math.sin(t * 16) * 4, t * 2.4);
  }
  c.fillStyle = Math.floor(now / 110) % 2 ? '#ff5a4d88' : '#ffd36b66'; c.beginPath(); c.arc(bx, by, 17, 0, TAU); c.fill();
  c.save(); c.translate(bx, by); c.rotate(Math.atan2(b.vy, b.vx)); c.fillStyle = '#ff5a4d'; c.strokeStyle = INK; c.lineWidth = 2;
  for (const side of [-1, 1]) { c.beginPath(); c.moveTo(-6, side * 7); c.lineTo(-22, side * 15); c.lineTo(-13, side * 4); c.closePath(); c.fill(); c.stroke(); }
  c.restore();
 }
 if (b.kind === 'boomerang') {
  c.save(); c.translate(bx, by); c.rotate(t * 26);
  for (const [turn, color] of [[0, '#ffb03a'], [Math.PI, '#fff0aa']]) {
   c.strokeStyle = INK; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, 17, turn, turn + 1.9); c.stroke();
   c.strokeStyle = color; c.lineWidth = 5; c.stroke();
  }
  c.restore();
  c.strokeStyle = '#ffb03a55'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath();
  trail.forEach((spot, i) => i ? c.lineTo(spot.x, spot.y) : c.moveTo(spot.x, spot.y)); c.stroke();
 }
 // Neo's shots under Centella leave a spark.
 if (!b.kind && speed > 1000 && trail.length > 1) { bolt(c, trail[0].x, trail[0].y, bx, by, Math.floor(now / 50), 5, '#fff3a0'); bolt(c, trail[0].x, trail[0].y, bx, by, Math.floor(now / 50), 2, '#fff'); }
 return b.big ? 17 : 9;
}

function reticle(c, x, y, r, turn) {
 c.save(); c.translate(x, y); c.rotate(turn);
 for (const [width, color] of [[6, INK], [3, '#ff5a4d']]) {
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round';
  for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(0, 0, r, i * TAU / 4 + .25, (i + 1) * TAU / 4 - .25); c.stroke(); }
 }
 c.restore();
 c.fillStyle = '#ff5a4d'; c.fillRect(x - 2, y - 2, 4, 4);
}

function magnet(c, x, y, size) {
 c.save(); c.translate(x, y); c.scale(size, size); c.lineJoin = 'round';
 for (const [width, color] of [[14, INK], [9, '#ff6b5c']]) { c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'butt'; c.beginPath(); c.moveTo(-10, 12); c.lineTo(-10, 0); c.arc(0, 0, 10, Math.PI, 0); c.lineTo(10, 12); c.stroke(); }
 c.fillStyle = '#fff6da'; c.fillRect(-14.5, 8, 9, 6); c.fillRect(5.5, 8, 9, 6);
 c.restore();
}

// The burst when an ultimate is cast. age runs from 0 to 1 over BURST milliseconds.
export const BURST = 1200;
const BURSTS = {
 arenga(c, e, age) {
  const color = TEAM_COLORS[e.team];
  for (let i = 0; i < 3; i++) { const grow = age * 1.25 - i * .14; if (grow <= 0) continue; c.strokeStyle = i % 2 ? '#fff6da' : color.light; c.lineWidth = 9 * (1 - age) + 1; c.beginPath(); c.arc(e.x, e.y - 15, grow * 460, 0, TAU); c.stroke(); }
  c.strokeStyle = '#ffe9a0'; c.lineWidth = 5; c.lineCap = 'round';
  for (let i = -2; i <= 2; i++) { const a = (e.team === 0 ? 0 : Math.PI) + i * .26, near = 34 + age * 70, far = near + 46 * (1 - age); c.beginPath(); c.moveTo(e.x + Math.cos(a) * near, e.y - 34 + Math.sin(a) * near); c.lineTo(e.x + Math.cos(a) * far, e.y - 34 + Math.sin(a) * far); c.stroke(); }
 },
 iman(c, e, age, g) {
  const at = g.players.find(p => p.id === e.player) || e;
  for (let i = 0; i < 4; i++) { const r = (1 - ((age * 1.6 + i / 4) % 1)) * 300; c.strokeStyle = i % 2 ? '#6bb8ff' : '#ff6b5c'; c.lineWidth = 5; c.beginPath(); c.arc(at.x, at.y - 18, r + 20, 0, TAU); c.stroke(); }
  magnet(c, at.x, at.y - 78 - Math.sin(age * Math.PI) * 10, 1.4);
 },
 quietos(c, e, age) {
  c.fillStyle = `rgba(214,240,255,${.55 * (1 - clamp01(age * 2.5))})`; c.fillRect(0, 0, FIELD.width, FIELD.height);
  for (let i = 0; i < 3; i++) { const grow = age * 1.3 - i * .12; if (grow <= 0) continue; c.strokeStyle = i % 2 ? '#8fd2ff' : '#f2fbff'; c.lineWidth = 10 * (1 - age) + 2; c.beginPath(); c.arc(e.x, e.y - 15, grow * 900, 0, TAU); c.stroke(); }
  c.strokeStyle = '#f2fbff'; c.lineWidth = 3; c.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
   const x = 70 + rand(i) * 1060, y = 150 + rand(i + 40) * 480 + age * 30, size = 5 + rand(i + 9) * 6;
   c.beginPath(); for (let arm = 0; arm < 3; arm++) { const a = arm * Math.PI / 3; c.moveTo(x - Math.cos(a) * size, y - Math.sin(a) * size); c.lineTo(x + Math.cos(a) * size, y + Math.sin(a) * size); } c.stroke();
  }
 },
 centella(c, e, age, g, now) {
  if (age < .1) { c.fillStyle = `rgba(255,250,210,${.5 * (1 - age / .1)})`; c.fillRect(0, 0, FIELD.width, FIELD.height); }
  if (age < .5) {
   const seed = Math.floor(now / 60);
   c.globalAlpha *= 1 - age / .5;
   bolt(c, e.x + 90, 96, e.x, e.y - 30, seed, 16, '#ffe14a'); bolt(c, e.x + 90, 96, e.x, e.y - 30, seed, 7, '#fff7c0'); bolt(c, e.x + 90, 96, e.x, e.y - 30, seed, 3, '#fff');
   bolt(c, e.x - 60, 150, e.x, e.y - 30, seed + 30, 5, '#fff7c0');
  }
  c.strokeStyle = '#ffe14a'; c.lineWidth = 6 * (1 - age); c.beginPath(); c.ellipse(e.x, e.y + 8, age * 150, age * 52, 0, 0, TAU); c.stroke();
 },
 teledirigida(c, e, age, g) {
  const target = g.players.find(p => p.id === g.ball.target);
  if (target && g.ball.kind === 'homing') reticle(c, target.x, target.y - 18, 34 + (1 - ease(age * 1.6)) * 190, age * 7);
  c.strokeStyle = '#ff5a4d'; c.lineWidth = 6 * (1 - age); c.beginPath(); c.arc(e.x, e.y - 15, 20 + age * 70, 0, TAU); c.stroke();
 },
 burbuja(c, e, age) {
  for (let i = 0; i < 16; i++) {
   const a = rand(i) * TAU, far = age * (90 + rand(i + 20) * 200), r = 4 + rand(i + 7) * 9;
   c.strokeStyle = '#bff3ff'; c.fillStyle = 'rgba(160,232,255,.25)'; c.lineWidth = 2;
   c.beginPath(); c.arc(e.x + Math.cos(a) * far, e.y - 20 + Math.sin(a) * far * .6 - age * 50, r, 0, TAU); c.fill(); c.stroke();
  }
 },
 cometa(c, e, age) {
  for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + .2, near = 18 + age * 60, far = near + 60 * (1 - age); c.strokeStyle = i % 2 ? '#ff7299' : '#fff0aa'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(e.x + Math.cos(a) * near, e.y - 18 + Math.sin(a) * near); c.lineTo(e.x + Math.cos(a) * far, e.y - 18 + Math.sin(a) * far); c.stroke(); }
  c.strokeStyle = '#ab38da'; c.lineWidth = 8 * (1 - age); c.beginPath(); c.arc(e.x, e.y - 18, age * 150, 0, TAU); c.stroke();
 },
 espejismo(c, e, age) { smoke(c, e.x, e.y, age, 3); smoke(c, e.x, e.y, clamp01(age * 1.4), 17); },
 red(c, e, age) {
  const reach = ease(age * 1.5) * 245;
  c.fillStyle = '#ffffff'; c.globalAlpha *= .8;
  for (const sign of [-1, 1]) c.fillRect(FIELD.mid - 16, 395 + sign * reach - 5, 32, 10);
 },
 gigante(c, e, age, g) {
  const at = g.players.find(p => p.id === e.player) || e;
  c.strokeStyle = '#f4e2b8'; c.lineWidth = 9 * (1 - age) + 1; c.beginPath(); c.ellipse(at.x, at.y + 10, 20 + age * 170, 8 + age * 58, 0, 0, TAU); c.stroke();
  c.fillStyle = '#c79a5a';
  for (let i = 0; i < 10; i++) { const a = i * TAU / 10, far = 30 + age * 130, lift = Math.sin(age * Math.PI) * (26 + rand(i) * 30); c.fillRect(at.x + Math.cos(a) * far - 4, at.y + 10 + Math.sin(a) * far * .35 - lift - 4, 8, 8); }
 },
 bumeran(c, e, age) {
  c.save(); c.translate(e.x, e.y - 18); c.rotate(age * 14);
  for (const turn of [0, Math.PI]) { c.strokeStyle = turn ? '#fff0aa' : '#ffb03a'; c.lineWidth = 8 * (1 - age) + 1; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, 24 + age * 70, turn, turn + 2); c.stroke(); }
  c.restore();
 },
 mirada(c, e, age) {
  // A huge eye opens over the rival half.
  const x = e.team === 0 ? 822 : 378, open = ease(age * 4) * (age > .7 ? (1 - age) / .3 : 1);
  if (open > .02) eye(c, x, 392, 180, 74 * open, .6);
  c.strokeStyle = '#deb2ff'; c.lineWidth = 5 * (1 - age) + 1;
  for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(x, 392, 190 + age * 70 + i * 22, (110 + age * 40 + i * 14) * open, 0, 0, TAU); c.stroke(); }
 },
 fuga(c, e, age) {
  // The bars of the team's prison fly apart.
  const x = e.team === 0 ? 1090 : 110;
  for (let i = 0; i < 6; i++) {
   const side = i < 3 ? -1 : 1, away = side * ease(age) * (40 + (i % 3) * 26), tilt = side * age * (.5 + (i % 3) * .2);
   c.save(); c.translate(x + (i - 2.5) * 13 + away, 392 + age * age * 120); c.rotate(tilt);
   c.fillStyle = '#9aa7b5'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.rect(-5, -150, 10, 300); c.fill(); c.stroke(); c.restore();
  }
  c.fillStyle = '#d0f97e';
  for (let i = 0; i < 18; i++) { const size = 4 + rand(i) * 5; c.fillRect(x - 40 + rand(i + 30) * 80 + (rand(i + 9) - .5) * age * 160, 600 - rand(i + 60) * 420 - age * 90, size, size); }
 },
};

// Smaller bursts for what happens to an ultimate afterwards.
const AFTER = {
 pop(c, e, age) {
  c.strokeStyle = '#bff3ff'; c.lineWidth = 3 * (1 - age) + 1; c.beginPath(); c.arc(e.x, e.y - 18, 31 + age * 34, 0, TAU); c.stroke();
  c.fillStyle = '#e8fbff'; for (let i = 0; i < 10; i++) { const a = i * TAU / 10, far = 34 + age * 60; c.beginPath(); c.arc(e.x + Math.cos(a) * far, e.y - 18 + Math.sin(a) * far, 4 * (1 - age) + 1, 0, TAU); c.fill(); }
  label(c, '¡POP!', e.x, e.y - 70 - age * 24, 18, '#bff3ff');
 },
 clang(c, e, age) {
  c.fillStyle = '#fff6da'; c.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8, far = (i % 2 ? 14 : 44) * (1 - age * .4); c.lineTo(e.x + Math.cos(a) * far, e.y - 30 + Math.sin(a) * far); }
  c.closePath(); c.fill();
  label(c, '¡CLONC!', e.x, e.y - 86 - age * 24, 20, '#ffd36b');
 },
 net(c, e, age) {
  c.strokeStyle = '#fff'; c.lineWidth = 4 * (1 - age) + 1;
  for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(e.x, e.y - 12, 10 + age * 30 + i * 8, 26 + age * 80 + i * 20, 0, 0, TAU); c.stroke(); }
  label(c, '¡A LA RED!', e.x, e.y - 60 - age * 24, 17, '#fff6da');
 },
 poof(c, e, age) { smoke(c, e.x, e.y, age, idSeed(e.id)); },
 magnet(c, e, age) { for (const [i, color] of ['#ff6b5c', '#6bb8ff'].entries()) { c.strokeStyle = color; c.lineWidth = 4 * (1 - age) + 1; c.beginPath(); c.arc(e.x, e.y - 18, 14 + age * 50 + i * 9, 0, TAU); c.stroke(); } },
};
export const FX_EVENTS = ['ult', ...Object.keys(AFTER)];

export function drawBurst(c, e, g, now) {
 const draw = e.type === 'ult' ? BURSTS[e.ult] : AFTER[e.type];
 const age = clamp01((now - e.born) / (e.type === 'ult' ? BURST : 700));
 if (!draw || age >= 1) return;
 c.save(); c.globalAlpha = Math.min(1, (1 - age) * 2.2);
 draw(c, e, age, g, now);
 c.restore();
}

// The banner that slides in from the caster's side with the portrait and the name of the ultimate.
export const BANNER = 1500;
const faces = new Map();
function face(character) {
 if (!faces.has(character)) { const image = new Image(); image.src = portrait(character); faces.set(character, image); }
 return faces.get(character);
}
// Fetch every portrait before the first banner needs one.
export function loadFaces() { HEROES.forEach((hero, character) => face(character)); }
export function drawBanner(c, e, g, now, row) {
 const age = (now - e.born) / BANNER, caster = g.players.find(p => p.id === e.player);
 if (!caster || age >= 1) return;
 const hero = HEROES[caster.character], color = TEAM_COLORS[e.team], right = e.team === 1;
 const width = 470, height = 60, slant = 20, y = 154 + row * 66;
 const slide = (1 - ease(age / .14)) + (age > .86 ? ease((age - .86) / .14) : 0);
 const x = right ? FIELD.width - 62 - width + slide * 560 : 62 - slide * 560;
 c.save(); c.translate(x, y);
 const shape = () => { c.beginPath(); c.moveTo(slant, 0); c.lineTo(width, 0); c.lineTo(width - slant, height); c.lineTo(0, height); c.closePath(); };
 shape(); c.fillStyle = '#0b1b2eee'; c.fill();
 c.save(); shape(); c.clip();
 // Speed lines racing along the banner.
 c.fillStyle = color.main + '55';
 for (let i = 0; i < 7; i++) { const lineX = ((now * .9 * (right ? -1 : 1) + i * 97) % (width + 120) + width + 120) % (width + 120) - 60; c.fillRect(lineX, 6 + i * 8, 70, 3); }
 c.fillStyle = color.main; c.fillRect(right ? width - 92 : 0, 0, 92, height);
 const picture = face(caster.character);
 if (picture.naturalWidth) { c.imageSmoothingEnabled = false; c.drawImage(picture, right ? width - 84 : 18, -4, 68, 68); }
 c.restore();
 shape(); c.strokeStyle = '#ffe9a8'; c.lineWidth = 3; c.stroke();
 const textX = right ? width - 104 : 104;
 c.textAlign = right ? 'right' : 'left'; c.textBaseline = 'middle';
 c.font = '800 12px "Trebuchet MS",system-ui,sans-serif'; c.fillStyle = color.light;
 c.fillText(`${hero.name.toUpperCase()} · DEFINITIVA`, textX, 17);
 c.font = '900 27px "Trebuchet MS",system-ui,sans-serif'; c.lineWidth = 5; c.lineJoin = 'round'; c.strokeStyle = INK;
 c.strokeText(hero.ability.toUpperCase(), textX, 40); c.fillStyle = '#fff3cf'; c.fillText(hero.ability.toUpperCase(), textX, 40);
 c.restore();
}
