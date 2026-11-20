// The provisional yoga figure: a jointed body defined by bone angles, so that limbs keep their length
// while a pose is animated. Pure module (no DOM) so the tests can check that every pose stands on the mat.
// Angles in degrees: 0 points up, 90 to the right of the screen, 180 down, 270 to the left.
// Side-view figures face right. In front view (view: 1) limb 1 is on the right of the screen.

export const W = 512, H = 640, FLOOR = 588, SEAT = 104;
export const BONES = {torso: 125, neck: 36, upper: 70, fore: 62, thigh: 100, shin: 96, foot: 36};
// How far each joint reaches below its centre: what touches the mat.
export const REACH = {head: 26, hip: 20, belly: 20, k1: 10, k2: 10, a1: 8, a2: 8, t1: 5, t2: 5, w1: 8, w2: 8, e1: 8, e2: 8};

const rad = d => d * Math.PI / 180;
const step = (p, angle, length) => [p[0] + Math.sin(rad(angle)) * length, p[1] - Math.cos(rad(angle)) * length];
const lerp = (a, b, t) => a + (b - a) * t;
const lerpAngle = (a, b, t) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;

// Joint positions of one frame, before it is placed on the mat.
function build(f) {
 const v = f.view || 0, hip = [0, 0];
 const neck = step(hip, f.torso, BONES.torso);
 const head = step(neck, f.head ?? f.torso, BONES.neck);
 const dir = [Math.sin(rad(f.torso)), -Math.cos(rad(f.torso))], side = [-dir[1], dir[0]];
 const mid = [neck[0] - dir[0] * 12, neck[1] - dir[1] * 12];
 const s1 = [mid[0] + side[0] * 26 * v, mid[1] + side[1] * 26 * v], s2 = [mid[0] - side[0] * 26 * v, mid[1] - side[1] * 26 * v];
 const p1 = [14 * v, 0], p2 = [-14 * v, 0];
 // The spine bends towards the back (cat) or the belly (cow): a quadratic curve through this point.
 const bend = (f.spine || 0) * 38, back = [-side[0], -side[1]];
 const ctrl = [(hip[0] + neck[0]) / 2 + back[0] * bend, (hip[1] + neck[1]) / 2 + back[1] * bend];
 const belly = [(hip[0] + neck[0]) / 4 + ctrl[0] / 2, (hip[1] + neck[1]) / 4 + ctrl[1] / 2];
 const arm = (s, [u, fo, su = 1, sf = 1]) => { const e = step(s, u, BONES.upper * su); return [e, step(e, fo, BONES.fore * sf)]; };
 const leg = (p, [th, sh, ft = 90, st = 1, ss = 1]) => {
  const k = step(p, th, BONES.thigh * st), a = step(k, sh, BONES.shin * ss);
  return [k, a, step(a, ft, BONES.foot * (1 - .6 * v))];
 };
 const [e1, w1] = arm(s1, f.a1), [e2, w2] = arm(s2, f.a2);
 const [k1, a1, t1] = leg(p1, f.l1), [k2, a2, t2] = leg(p2, f.l2);
 return {view: v, hip, neck, head, ctrl, belly, s1, s2, p1, p2, e1, w1, e2, w2, k1, a1, t1, k2, a2, t2};
}

const POINTS = ['hip', 'neck', 'head', 'ctrl', 'belly', 's1', 's2', 'p1', 'p2', 'e1', 'w1', 'e2', 'w2', 'k1', 'a1', 't1', 'k2', 'a2', 't2'];

// Joints of a frame placed on the mat: the lowest part rests on the floor (or the hips on the chair seat)
// and the pose's anchor joint keeps its place, so a foot that stays put does not slide.
export function place(f, {anchor = 'hip', x = W / 2} = {}) {
 const j = build(f);
 const dx = x - j[anchor][0];
 const dy = f.seat ? FLOOR - SEAT - j.hip[1] : FLOOR - Math.max(...Object.entries(REACH).map(([name, r]) => j[name][1] + r));
 for (const name of POINTS) j[name] = [j[name][0] + dx, j[name][1] + dy];
 return j;
}

// A frame between two keyframes: angles take the short way round, so limbs swing rather than stretch.
export function blend(a, b, t) {
 const out = {view: lerp(a.view || 0, b.view || 0, t), spine: lerp(a.spine || 0, b.spine || 0, t), seat: t < .5 ? a.seat : b.seat};
 out.torso = lerpAngle(a.torso, b.torso, t);
 out.head = lerpAngle(a.head ?? a.torso, b.head ?? b.torso, t);
 for (const limb of ['a1', 'a2', 'l1', 'l2']) {
  const n = Math.max(a[limb].length, b[limb].length), pad = limb[0] === 'a' ? [0, 0, 1, 1] : [0, 0, 90, 1, 1];
  out[limb] = Array.from({length: n}, (_, i) => i < 3 && !(limb[0] === 'a' && i === 2)
   ? lerpAngle(a[limb][i] ?? pad[i], b[limb][i] ?? pad[i], t) : lerp(a[limb][i] ?? pad[i], b[limb][i] ?? pad[i], t));
 }
 return out;
}

export const ease = t => t * t * (3 - 2 * t);
// t runs from 0 (preparation) through 1 (half way) to 2 (the pose).
export function frameAt(frames, t) {
 const clamped = Math.max(0, Math.min(frames.length - 1, t)), i = Math.min(frames.length - 2, Math.floor(clamped));
 return blend(frames[i], frames[i + 1], ease(clamped - i));
}

// --- Keyframes ---------------------------------------------------------------------
// Shared starting positions.
const STAND_FRONT = {view: 1, torso: 0, a1: [172, 176], a2: [188, 184], l1: [176, 180, 100], l2: [184, 180, 260]};
const STAND_SIDE = {torso: 0, a1: [182, 178], a2: [176, 182], l1: [180, 180, 90], l2: [180, 180, 90]};
const TABLE = {torso: 75, head: 96, a1: [180, 180], a2: [180, 180], l1: [180, 270, 270], l2: [180, 270, 270]};
export const SITTING = {seat: true, torso: 0, a1: [172, 112], a2: [168, 116], l1: [90, 180, 90], l2: [92, 182, 90]};

export const FIGURES = {
 mountain: {anchor: 'hip', frames: [
  STAND_FRONT,
  {...STAND_FRONT, a1: [100, 92], a2: [260, 268]},
  {...STAND_FRONT, a1: [12, 4], a2: [348, 356]},
 ], chair: {...SITTING, a1: [4, 0], a2: [8, 2]}},
 tree: {anchor: 'a2', frames: [
  {...STAND_FRONT, a1: [165, 292], a2: [195, 68]},
  {...STAND_FRONT, a1: [165, 292], a2: [195, 68], l1: [165, 200, 150], l2: [181, 180, 260]},
  {...STAND_FRONT, a1: [30, 14], a2: [330, 346], l1: [132, 236, 200], l2: [181, 180, 260]},
 ], chair: {...SITTING, a1: [12, 4], a2: [352, 356], l1: [84, 196, 110]}},
 chair: {anchor: 'a1', frames: [
  STAND_SIDE,
  {torso: 15, a1: [92, 90], a2: [88, 88], l1: [148, 192, 90], l2: [148, 192, 90]},
  {torso: 30, a1: [28, 26], a2: [24, 22], l1: [116, 196, 90], l2: [116, 196, 90]},
 ], chair: {...SITTING, torso: 22, a1: [24, 20], a2: [20, 16]}},
 warrior1: {anchor: 'a1', x: 340, frames: [
  STAND_SIDE,
  {torso: 2, a1: [150, 30], a2: [148, 28], l1: [168, 182, 90], l2: [204, 206, 110]},
  {torso: 4, a1: [6, 2], a2: [2, 358], l1: [114, 180, 90], l2: [225, 225, 96]},
 ], chair: {...SITTING, a1: [6, 2], a2: [2, 358], l1: [92, 180, 90], l2: [241, 241, 100]},
  // Sitting, the back leg cannot swing through the floor: it is placed before the arms rise.
  chairStart: {l2: [241, 241, 100]}},
 warrior2: {anchor: 'hip', frames: [
  STAND_FRONT,
  {view: 1, torso: 0, a1: [135, 128], a2: [225, 232], l1: [150, 162, 90], l2: [210, 198, 260]},
  {view: 1, torso: 0, head: 6, a1: [90, 90], a2: [270, 270], l1: [110, 180, 90], l2: [228, 228, 260]},
 ], chair: {...SITTING, a1: [90, 90], a2: [270, 270]}},
 triangle: {anchor: 'hip', x: 236, frames: [
  STAND_FRONT,
  {view: 1, torso: 8, a1: [92, 90], a2: [268, 270], l1: [142, 142, 90], l2: [218, 218, 260]},
  {view: 1, torso: 70, head: 62, a1: [180, 180], a2: [0, 0], l1: [140, 140, 90], l2: [220, 220, 260]},
 ], chair: {...SITTING, torso: 56, head: 70, a1: [180, 180], a2: [4, 0]}},
 cat: {anchor: 'k1', x: 190, frames: [
  TABLE,
  {...TABLE, spine: .6, head: 130},
  {...TABLE, spine: 1.25, head: 168},
 ], chair: {...SITTING, torso: 8, spine: 1.2, head: 160, a1: [160, 108], a2: [156, 110]}},
 cow: {anchor: 'k1', x: 190, frames: [
  TABLE,
  {...TABLE, spine: -.5, head: 70},
  {...TABLE, spine: -1, head: 48},
 ], chair: {...SITTING, torso: 4, spine: -.9, head: 40, a1: [178, 116], a2: [174, 118]}},
 downdog: {anchor: 'w1', x: 400, frames: [
  {...TABLE, l1: [180, 270, 245], l2: [180, 270, 245]},
  {torso: 108, head: 140, a1: [146, 146], a2: [146, 146], l1: [180, 240, 160], l2: [180, 240, 160]},
  {torso: 140, head: 160, a1: [142, 142], a2: [142, 142], l1: [208, 204, 120], l2: [208, 204, 120]},
 ], chair: {...SITTING, torso: 56, head: 70, a1: [70, 72], a2: [66, 68]}},
 cobra: {anchor: 'p1', x: 260, frames: [
  {torso: 90, head: 80, a1: [300, 150], a2: [296, 148], l1: [266, 268, 270], l2: [266, 268, 270]},
  {torso: 78, head: 72, a1: [276, 136], a2: [272, 134], l1: [266, 268, 270], l2: [266, 268, 270]},
  {torso: 66, spine: -.4, head: 52, a1: [250, 120], a2: [246, 118], l1: [266, 268, 270], l2: [266, 268, 270]},
 ], chair: {...SITTING, torso: 356, spine: -.7, head: 20, a1: [206, 196], a2: [202, 194]}},
 butterfly: {anchor: 'hip', frames: [
  {view: 1, torso: 0, a1: [170, 160], a2: [190, 200], l1: [30, 176, 180, .55, .78], l2: [330, 184, 180, .55, .78]},
  {view: 1, torso: 0, a1: [168, 176], a2: [192, 184], l1: [70, 222, 180, .8, .9], l2: [290, 138, 180, .8, .9]},
  {view: 1, torso: 0, a1: [168, 188], a2: [192, 172], l1: [97, 266, 270, .96, 1], l2: [263, 94, 90, .96, 1]},
 ], chair: {...SITTING, a1: [172, 118], a2: [168, 120], l1: [84, 186, 90], l2: [92, 182, 90]}},
 child: {anchor: 'k1', x: 300, frames: [
  {torso: 0, a1: [176, 150], a2: [172, 148], l1: [106, 270, 270], l2: [106, 270, 270]},
  {torso: 48, head: 70, a1: [150, 120], a2: [146, 118], l1: [106, 270, 270], l2: [106, 270, 270]},
  {torso: 96, head: 100, a1: [100, 92], a2: [98, 92], l1: [106, 270, 270], l2: [106, 270, 270]},
 ], chair: {...SITTING, torso: 95, head: 150, a1: [178, 262], a2: [174, 258]}},
 // Cool-down at the end of a practice: sitting cross-legged, hands to the tummy.
 calma: {anchor: 'hip', frames: [
  {view: 1, torso: 0, a1: [168, 186], a2: [192, 174], l1: [95, 262, 270, .62, 1], l2: [265, 98, 90, .62, 1]},
  {view: 1, torso: 0, a1: [172, 236], a2: [188, 124], l1: [95, 262, 270, .62, 1], l2: [265, 98, 90, .62, 1]},
  {view: 1, torso: 0, head: 4, a1: [176, 262], a2: [184, 98], l1: [95, 262, 270, .62, 1], l2: [265, 98, 90, .62, 1]},
 ], chair: {...SITTING, a1: [176, 262], a2: [184, 98]}},
};

// Which joints rest on the floor in the finished pose: the tests check them.
export const SUPPORTS = {
 mountain: ['a1', 'a2'], tree: ['a2'], chair: ['a1', 'a2'], warrior1: ['a1', 'a2'], warrior2: ['a1', 'a2'], triangle: ['a1', 'a2'],
 cat: ['w1', 'k1'], cow: ['w1', 'k1'], downdog: ['w1', 't1'], cobra: ['hip', 't1', 'w1'], butterfly: ['hip', 'a1', 'a2'], child: ['k1', 'head', 'w1'], calma: ['hip'],
};

// The chair variant starts from plain sitting, so it animates the same way: sit, half way, pose.
export function chairFrames(id) {
 const pose = FIGURES[id].chair, start = {...SITTING, ...FIGURES[id].chairStart};
 return [start, blend(start, pose, .5), pose];
}
export function figureAt(id, t, {chair = false} = {}) {
 const figure = FIGURES[id];
 if (chair) return place(frameAt(chairFrames(id), t), {anchor: 'hip', x: 236});
 return place(frameAt(figure.frames, t), {anchor: figure.anchor, x: figure.x ?? W / 2});
}
