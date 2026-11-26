import {PINTADOS} from './assets/pintados.js';
const names = ['Vega', 'Kai', 'Lúa', 'Neo', 'Ada', 'Max', 'Nora', 'Leo'];
const camera = document.getElementById('camera');
const scene = document.getElementById('world');
const stage = document.getElementById('scene');
const sprite = document.getElementById('walker');
const selector = document.getElementById('avatar');
const ctx = sprite.getContext('2d');
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const reduced = () => document.body.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const sheets = new Map();
const arrows = new Set();
let room, goal, frame, previousTime, speed = 0, phase = 0;
let x = .5, y = .85, facing = 1, walking = false, avatar = 0, bentUntil = 0, straighten;

function selectAvatar(index) {
 avatar = index;
 if (!sheets.has(index)) {
  const poses = {};
  sheets.set(index, poses);
  // The bend to pick something up comes with the painted set; without it the pupil stays upright.
  const types = PINTADOS.includes('pupil-' + index + '-reach') ? ['pupil', 'walk', 'reach'] : ['pupil', 'walk'];
  for (const type of types) {
   const image = new Image();
   poses[type] = image;
   image.onload = () => draw();
   image.src = type === 'reach' ? 'assets/pupil-' + index + '-reach.webp' : 'assets/' + type + '-' + index + '.webp';
  }
 }
 draw();
}

// Size the room picture for the screen. Floor and furniture sit in the lower 64 % of each picture,
// so a short screen may crop the ceiling but never them; a tall one scrolls sideways instead.
const BAND = .64;
const shortLandscape = matchMedia('(orientation: landscape) and (max-height: 520px)');
function fit() {
 const W = camera.clientWidth, C = camera.clientHeight;
 if (!W || !C) return;
 const portrait = W < C;
 // On a short landscape screen the game buttons live in the side margins.
 const side = shortLandscape.matches ? 60 : 0;
 const H = portrait ? Math.min(C, W * 4 / 3) : Math.min(Math.max(W / 1.5, C), C / BAND, (W - 2 * side) / 1.5);
 const width = H * 1.5, wide = Math.max(W, width);
 const top = H > C ? clamp(C - .97 * H, C - H, 0) : portrait ? C - H : (C - H) / 2;
 stage.style.width = wide + 'px';
 Object.assign(scene.style, {width: width + 'px', height: H + 'px', left: (wide - width) / 2 + 'px', top: top + 'px'});
 document.body.classList.toggle('scrolls', wide > W + 1);
}

function heightAt(depth) { return .26 + (depth - .79) * .48; }

function draw(centerCamera = false) {
 const poses = sheets.get(avatar);
 const moving = walking && poses?.walk.naturalWidth && !reduced();
 const bent = !moving && performance.now() < bentUntil && poses?.reach?.naturalWidth;
 const image = moving ? poses.walk : bent ? poses.reach : poses?.pupil;
 const w = sprite.width, h = sprite.height;
 ctx.clearRect(0, 0, w, h);
 if (image?.naturalWidth) {
  ctx.save();
  ctx.translate(w / 2, h - 3);
  ctx.fillStyle = 'rgba(62,41,34,.23)';
  ctx.beginPath();
  ctx.ellipse(0, -2, w * .22, h * .017, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.scale(facing, 1);
  if (moving) {
   const cell = Math.floor(phase * 8) % 8;
   const cw = image.width / 4, ch = image.height / 2;
   ctx.drawImage(image, cell % 4 * cw, Math.floor(cell / 4) * ch, cw, ch, -w/2, -h+3, w, h);
  } else {
   const width = (h - 10) * image.width / image.height;
   ctx.drawImage(image, -width / 2, -h + 10, width, h - 10);
  }
  ctx.restore();
 }
 // Robles stands at 62% in the gym and at 80% while carrying the mat.
 scene.style.setProperty('--robles-facing', x < (room === 'store' ? .80 : .62) ? '-1' : '1');
 sprite.style.left = x * 100 + '%';
 sprite.style.top = y * 100 + '%';
 sprite.style.height = heightAt(y) * 100 + '%';
 sprite.style.zIndex = y < .79 ? 1 : 4;
 const relative = scene.offsetLeft + x * scene.clientWidth - camera.scrollLeft;
 if (centerCamera) camera.scrollLeft += relative - camera.clientWidth / 2;
 else camera.scrollLeft += relative - clamp(relative, camera.clientWidth * .35, camera.clientWidth * .65);
}

function stop() {
 cancelAnimationFrame(frame);
 frame = undefined;
 previousTime = undefined;
 goal = null;
 walking = false;
 speed = 0;
 arrows.clear();
}

function tick(now) {
 frame = undefined;
 const dt = Math.min(.045, (now - (previousTime ?? now - 16)) / 1000);
 previousTime = now;
 if (document.querySelector('dialog[open]')) { stop(); draw(); return; }
 const width = scene.clientWidth, height = scene.clientHeight;
 const leftRight = Number(arrows.has('ArrowRight')) - Number(arrows.has('ArrowLeft'));
 const upDown = Number(arrows.has('ArrowDown')) - Number(arrows.has('ArrowUp'));
 const manual = arrows.size > 0;
 const minY = room === 'store' ? .84 : .73;
 const endX = clamp(manual ? x + leftRight / width * 100 : goal.x, .035, .965);
 const endY = clamp(manual ? y + upDown / height * 60 : goal.y, minY, .94);
 const dx = endX - x, dy = endY - y;
 // Distances on the floor are foreshortened along the depth axis.
 const distance = Math.hypot(dx * width, dy * height / .6);
 const body = heightAt(y) * height;
 const cruise = body * 1.02;
 const desired = manual ? cruise : Math.min(cruise, Math.sqrt(2 * cruise * 6 * distance));
 speed += clamp(desired - speed, -cruise * 6 * dt, cruise * 6 * dt);
 const step = !manual && reduced() ? distance : Math.min(distance, speed * dt);
 if (distance > 0) {
  x += dx * step / distance;
  y += dy * step / distance;
  if (Math.abs(dx * width) > .4) facing = dx > 0 ? 1 : -1;
 }
 walking = step > 0 && (manual || step < distance);
 // Advance the drawing by ground covered so a slower step holds its pose.
 phase = (phase + step / (body * 1.06)) % 1;
 if (!manual && step >= distance) {
  const arrived = goal.arrived;
  facing = goal.faceOnArrival ?? facing;
  stop();
  draw();
  arrived?.();
  return;
 }
 draw();
 frame = requestAnimationFrame(tick);
}

function start() {
 if (frame === undefined) frame = requestAnimationFrame(tick);
}

export const position = () => ({x, y});

// Bend the knees to take or leave something, then stand up again.
export function reach() {
 if (reduced()) return;
 bentUntil = performance.now() + 620;
 clearTimeout(straighten);
 straighten = setTimeout(() => draw(), 640);
 draw();
}

export function walkTo(nextX, nextY, arrived, faceOnArrival) {
 arrows.clear();
 goal = {x: nextX, y: nextY, arrived, faceOnArrival};
 start();
}

export function enterRoom(next) {
 if (room === next) return;
 stop();
 // In the store the pupil steps in by the front corner, clear of the cone that blocks the door.
 x = next === 'store' ? .06 : room ? .78 : .5;
 facing = next === 'gym' && room ? -1 : 1;
 room = next;
 y = next === 'store' ? .94 : .85;
 phase = 0;
 draw(true);
}

names.forEach((name, index) => selector.add(new Option(name, index)));
try { avatar = clamp(parseInt(localStorage.getItem('gym-avatar'), 10) || 0, 0, 7); } catch {}
selector.selectedIndex = avatar;
selectAvatar(avatar);
selector.onchange = () => {
 selectAvatar(selector.selectedIndex);
 try { localStorage.setItem('gym-avatar', String(avatar)); } catch {}
};
fit();
new ResizeObserver(() => { fit(); draw(true); }).observe(camera);
window.addEventListener('keydown', event => {
 if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key) || document.querySelector('dialog[open]')) return;
 event.preventDefault();
 goal = null;
 arrows.add(event.key);
 start();
});
window.addEventListener('keyup', event => {
 if (!arrows.delete(event.key) || arrows.size) return;
 // A quick tap still takes a small step. A held arrow eases to a halt.
 const coast = heightAt(y) * Math.max(.035, speed / scene.clientHeight * .25);
 const horizontal = ({ArrowRight:1, ArrowLeft:-1})[event.key] || 0;
 const vertical = ({ArrowDown:1, ArrowUp:-1})[event.key] || 0;
 walkTo(x + horizontal * coast * scene.clientHeight / scene.clientWidth, y + vertical * coast * .6);
});
window.addEventListener('blur', () => { stop(); draw(); });
