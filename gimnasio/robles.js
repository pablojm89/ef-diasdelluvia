// All four drawings share the same foot position so gestures stay planted.
const frames = ['rest', 'whistle', 'talk', 'point'].map(pose => {
  const image = new Image();
  image.src = 'assets/robles-' + pose + '.webp';
  return image;
});
const portrait = document.createElement('img');
portrait.alt = '';
portrait.draggable = false;
document.getElementById('prof').append(portrait);
let timer;
function pose(index) {
  portrait.src = frames[index].src;
}
function reduced() {
  return document.body.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function idle() {
  pose(0);
  timer = setTimeout(() => {
    if (!reduced() && !document.hidden) pose(1);
    timer = setTimeout(idle, 700);
  }, 3100);
}
export function speakAndPoint() {
  clearTimeout(timer);
  pose(2);
  if (reduced()) { timer = setTimeout(idle, 1800); return; }
  const poses = [0, 2, 3, 3, 2, 0];
  function next() {
    if (!poses.length) { idle(); return; }
    pose(poses.shift());
    timer = setTimeout(next, 360);
  }
  timer = setTimeout(next, 340);
}
idle();
