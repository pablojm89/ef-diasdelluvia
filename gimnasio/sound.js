// Quiet, optional sounds made with Web Audio: no files to load.
let context, on = true;
export const setSound = value => { on = !!value; };
const notes = {
 place: [[392, 0, .09], [523, .07, .14]],
 pick: [[587, 0, .08]],
 back: [[523, 0, .08], [392, .06, .12]],
 right: [[523, 0, .1], [659, .09, .1], [784, .18, .18]],
 wrong: [[220, 0, .16]],
 done: [[523, 0, .12], [659, .11, .12], [784, .22, .12], [1047, .33, .32]],
};
export function play(kind) {
 if (!on || !notes[kind]) return;
 try {
  context ??= new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === 'suspended') context.resume();
  const now = context.currentTime;
  for (const [frequency, start, length] of notes[kind]) {
   const tone = context.createOscillator(), gain = context.createGain();
   tone.type = kind === 'wrong' ? 'triangle' : 'sine';
   tone.frequency.value = frequency;
   gain.gain.setValueAtTime(0, now + start);
   gain.gain.linearRampToValueAtTime(kind === 'wrong' ? .05 : .07, now + start + .015);
   gain.gain.exponentialRampToValueAtTime(.0001, now + start + length + .12);
   tone.connect(gain).connect(context.destination);
   tone.start(now + start);
   tone.stop(now + start + length + .15);
  }
 } catch {}
}
