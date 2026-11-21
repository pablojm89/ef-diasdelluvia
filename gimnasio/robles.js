// All the drawings share the same foot position so gestures stay planted.
import {PINTADOS} from './assets/pintados.js';
// The last two arrive with the painted set (arte/lotes/14-gimnasio.json); without them he keeps his usual gestures.
const frames = Object.fromEntries(['rest', 'whistle', 'talk', 'point', 'cheer', 'think']
  .filter(pose => !['cheer', 'think'].includes(pose) || PINTADOS.includes('robles-' + pose))
  .map(pose => {
    const image = new Image();
    image.src = 'assets/robles-' + pose + '.webp';
    return [pose, image];
  }));
const portrait = document.createElement('img');
portrait.alt = '';
portrait.draggable = false;
document.getElementById('prof').append(portrait);
let timer, happy = false;
function pose(name) {
  portrait.src = (frames[name] || frames.rest).src;
}
function reduced() {
  return document.body.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function idle() {
  pose(happy ? 'cheer' : 'rest');
  timer = setTimeout(() => {
    if (!reduced() && !document.hidden) pose(happy ? 'rest' : 'whistle');
    timer = setTimeout(idle, 700);
  }, 3100);
}
export function speakAndPoint() {
  clearTimeout(timer);
  pose('talk');
  if (reduced()) { timer = setTimeout(idle, 1800); return; }
  const poses = ['rest', 'talk', 'point', 'point', 'talk', 'rest'];
  function next() {
    if (!poses.length) { idle(); return; }
    pose(poses.shift());
    timer = setTimeout(next, 360);
  }
  timer = setTimeout(next, 340);
}
// With the mission done he waits with his thumb up instead of at rest.
export function celebrate(done) {
  if (happy === done) return;
  happy = done;
  clearTimeout(timer);
  idle();
}
// A hint: hand on chin for a moment.
export function ponder() {
  clearTimeout(timer);
  pose('think');
  timer = setTimeout(idle, 1800);
}
idle();
