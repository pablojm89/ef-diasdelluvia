import {CHARACTERS, paintCharacter} from '../mate/characters.js';

const camera = document.getElementById('camera');
const scene = document.getElementById('scene');
const sprite = document.getElementById('walker');
const selector = document.getElementById('avatar');
const ctx = sprite.getContext('2d');
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
let room, x = .5, y = .83, facing = 1, frame;
let avatar = 0;
try { avatar = clamp(Number(localStorage.getItem('gym-avatar')) || 0, 0, 7); } catch {}
CHARACTERS.forEach(({name}, index) => selector.add(new Option(name, index)));
selector.value = avatar;
selector.onchange = () => {
 avatar = selector.selectedIndex;
 try { localStorage.setItem('gym-avatar', String(avatar)); } catch {}
 draw();
};

function draw(moving = false, time = 0) {
 ctx.clearRect(0, 0, sprite.width, sprite.height);
 ctx.save();
 ctx.translate(24, 46);
 paintCharacter(ctx, {character:avatar, team:0, vx:moving ? 20 : 0}, {face:facing, time:time / 1000});
 ctx.restore();
 sprite.style.left = x * 100 + '%';
 sprite.style.top = y * 100 + '%';
 sprite.style.height = (21 + (y - .7) * 40) + '%';
 camera.scrollLeft = x * scene.clientWidth - camera.clientWidth / 2;
}

export function walkTo(nextX, nextY, arrived) {
 cancelAnimationFrame(frame);
 const endX = clamp(nextX, .035, .965);
 const endY = clamp(nextY, room === 'store' ? .84 : .73, .94);
 const startX = x, startY = y;
 const duration = Math.hypot((endX-x)*scene.clientWidth,(endY-y)*scene.clientHeight) / (scene.clientHeight * .0013);
 if (endX !== x) facing = endX > x ? 1 : -1;
 const start = performance.now();
 const instant = document.body.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
 function advance(now) {
  const t = instant || !duration ? 1 : Math.min(1, (now-start)/duration);
  x = startX + (endX-startX)*t;
  y = startY + (endY-startY)*t;
  draw(t < 1, now);
  if (t < 1) frame = requestAnimationFrame(advance);
  else arrived?.();
 }
 frame = requestAnimationFrame(advance);
}

export function enterRoom(next) {
 if (room === next) return;
 cancelAnimationFrame(frame);
 x = next === 'store' ? .08 : room ? .78 : .48;
 room = next;
 y = .85;
 draw();
}
window.addEventListener('resize', () => draw());
window.addEventListener('keydown', event => {
 if (document.querySelector('dialog[open]')) return;
 const delta = {ArrowLeft:[-.055,0],ArrowRight:[.055,0],ArrowUp:[0,-.035],ArrowDown:[0,.035]}[event.key];
 if (!delta) return;
 event.preventDefault();
 walkTo(x + delta[0], y + delta[1]);
});
