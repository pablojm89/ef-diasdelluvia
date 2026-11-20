const names = ['Vega', 'Kai', 'Lúa', 'Neo', 'Ada', 'Max', 'Nora', 'Leo'];
const pupils = names.map((_, index) => {
 const image = new Image();
 image.src = 'assets/pupil-' + index + '.webp';
 image.onload = () => draw();
 return image;
});

const camera = document.getElementById('camera');
const scene = document.getElementById('world');
const sprite = document.getElementById('walker');
const selector = document.getElementById('avatar');
const ctx = sprite.getContext('2d');
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
let room, x = .5, y = .83, facing = 1, frame;
let avatar = 0;
try { avatar = clamp(Number(localStorage.getItem('gym-avatar')) || 0, 0, 7); } catch {}
names.forEach((name, index) => selector.add(new Option(name, index)));
selector.value = avatar;
selector.onchange = () => {
 avatar = selector.selectedIndex;
 try { localStorage.setItem('gym-avatar', String(avatar)); } catch {}
 draw();
};

function draw(moving = false, time = 0) {
 ctx.clearRect(0, 0, sprite.width, sprite.height);
 const image = pupils[avatar];
 if (image?.naturalWidth) {
  const stride = moving ? Math.sin(time / 110) : 0;
  const width = sprite.height * image.width / image.height;
  ctx.save();
  ctx.translate(sprite.width / 2, 0);
  ctx.scale(facing, 1);
  // Pivot the lower legs in opposite phases while keeping the upper silhouette intact.
  const knee = Math.floor(image.height * .73);
  const legY = sprite.height * knee / image.height;
  ctx.translate(0, -Math.abs(stride)*3);
  ctx.drawImage(image,0,0,image.width,knee,-width/2,0,width,legY);
  for (const side of [-1,1]) {
   ctx.save();
   const half = image.width / 2;
   ctx.translate(side * width / 4, legY);
   ctx.rotate(stride * side * .12);
   ctx.drawImage(image,side < 0 ? 0 : half,knee,half,image.height-knee,-width/4,-1,width/2,sprite.height-legY+1);
   ctx.restore();
  }
  ctx.restore();
 }
 sprite.style.left = x * 100 + '%';
 sprite.style.top = y * 100 + '%';
 sprite.style.height = (26 + (y - .79) * 48) + '%';
 sprite.style.zIndex = y < .79 ? 1 : 4;
 camera.scrollLeft = (camera.scrollWidth - scene.clientWidth) / 2 + x * scene.clientWidth - camera.clientWidth / 2;
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
