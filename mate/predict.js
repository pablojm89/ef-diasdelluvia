// A guest sees its own player move at once, instead of waiting for the host to answer.
// The host stays in charge: this only draws where the player will be once the controls
// already sent have arrived. No DOM or clocks: times come in as milliseconds.
import {STATS} from './roster.js';
import {bounds} from './sim.js';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export class Prediction {
 constructor() { this.sent = []; this.shown = null; this.at = 0; }
 // Remember each direction sent to the host and when it left.
 record(input, now) {
  this.sent.push({mx: input.mx || 0, my: input.my || 0, at: now});
  while (this.sent.length > 2 && this.sent[1].at < now - 1500) this.sent.shift();
 }
 // me: the player as the host last described it. received: when that description arrived.
 // trip: milliseconds a message takes each way. Returns where to draw the player now.
 place(me, holding, received, trip, now) {
  const target = {x: me.x, y: me.y, vx: me.vx, vy: me.vy};
  // What the host has not seen yet: controls sent after the ones behind this snapshot.
  const from = Math.max(received - 2 * trip, now - 500);
  // While the host moves the player by itself (dodging, stunned, frozen), follow the host.
  if (me.stun <= 0 && me.frozen <= 0 && me.dashTime <= 0) {
   const speed = (holding ? STATS.carrySpeed : STATS.runSpeed) * (me.boostTime > 0 ? 1.25 : 1) * (me.turbo > 0 ? 1.45 : 1) * (me.flash > 0 ? 2 : 1) * (me.slowed > 0 ? .5 : 1);
   const area = bounds(me);
   this.sent.forEach((entry, index) => {
    const start = Math.max(entry.at, from), end = Math.min(this.sent[index + 1]?.at ?? now, now);
    if (end <= start) return;
    const length = Math.hypot(entry.mx, entry.my), scale = length > 1 ? 1 / length : 1, seconds = (end - start) / 1000;
    target.x = clamp(target.x + entry.mx * scale * speed * seconds, area.left, area.right);
    target.y = clamp(target.y + entry.my * scale * speed * seconds, area.top, area.bottom);
   });
   const last = this.sent.at(-1);
   if (last) { const length = Math.hypot(last.mx, last.my), scale = length > 1 ? 1 / length : 1; target.vx = last.mx * scale * speed; target.vy = last.my * scale * speed; }
  }
  // Glide towards the target so small timing differences do not make the player tremble.
  const far = !this.shown || Math.hypot(this.shown.x - target.x, this.shown.y - target.y) > 90;
  const blend = far ? 1 : 1 - Math.exp(-Math.max(0, now - this.at) / 1000 * 22);
  this.shown = far ? {x: target.x, y: target.y} : {x: this.shown.x + (target.x - this.shown.x) * blend, y: this.shown.y + (target.y - this.shown.y) * blend};
  this.at = now;
  return {...this.shown, vx: target.vx, vy: target.vy};
 }
 reset() { this.sent = []; this.shown = null; }
}
