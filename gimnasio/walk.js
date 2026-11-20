const names = ['Vega', 'Kai', 'Lúa', 'Neo', 'Ada', 'Max', 'Nora', 'Leo'];
const camera = document.getElementById('camera');
const scene = document.getElementById('world');
const sprite = document.getElementById('walker');
const selector = document.getElementById('avatar');
const ctx = sprite.getContext('2d');
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const reduced = () => document.body.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const sheets = new Map();
const arrows = new Set();
let room, goal, frame, previousTime, speed = 0, phase = 0;
let x = .5, y = .85, facing = 1, walking = false, avatar = 0;

function selectAvatar(index) {
 avatar = index;
 if (!sheets.has(index)) {
  const poses = {};
  sheets.set(index, poses);
  for (const type of ['pupil', 'walk']) {
   const image = new Image();
   poses[type] = image;
   image.onload = () => draw();
   image.src = 'assets/' + type + '-' + index + '.webp';
  }
 }
 draw();
}

function heightAt(depth) { return .26 + (depth - .79) * .48; }

function draw(centerCamera = false) {
 const poses = sheets.get(avatar);
 const moving = walking && poses?.walk.naturalWidth && !reduced();
 const image = moving ? poses.walk : poses?.pupil;
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
 sprite.style.left = x * 100 + '%';
 sprite.style.top = y * 100 + '%';
 sprite.style.height = heightAt(y) * 100 + '%';
 sprite.style.zIndex = y < .79 ? 1 : 4;
 const relative = x * scene.clientWidth - camera.scrollLeft;
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

export function walkTo(nextX, nextY, arrived, faceOnArrival) {
 arrows.clear();
 goal = {x: nextX, y: nextY, arrived, faceOnArrival};
 start();
}

export function enterRoom(next) {
 if (room === next) return;
 stop();
 x = next === 'store' ? .08 : room ? .78 : .48;
 facing = next === 'gym' && room ? -1 : 1;
 room = next;
 y = .85;
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
window.addEventListener('resize', () => draw(true));
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
