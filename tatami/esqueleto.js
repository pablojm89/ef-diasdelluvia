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
// p runs from 0 (preparation) to 1 (the pose), through every keyframe in between.
export function frameAt(frames, p) {
 const at = Math.max(0, Math.min(1, p)) * (frames.length - 1), i = Math.min(frames.length - 2, Math.floor(at));
 return blend(frames[i], frames[i + 1], ease(at - i));
}

// --- Keyframes ---------------------------------------------------------------------
// Shared starting positions.
const STAND_FRONT = {view: 1, torso: 0, a1: [172, 176], a2: [188, 184], l1: [176, 180, 100], l2: [184, 180, 260]};
const STAND_SIDE = {torso: 0, a1: [182, 178], a2: [176, 182], l1: [180, 180, 90], l2: [180, 180, 90]};
const TABLE = {torso: 75, head: 96, a1: [180, 180], a2: [180, 180], l1: [180, 270, 270], l2: [180, 270, 270]};
export const SITTING = {seat: true, torso: 0, a1: [172, 112], a2: [168, 116], l1: [90, 180, 90], l2: [92, 182, 90]};
// Sitting on the heels, kneeling tall, sitting on the floor with the knees up, lying on the back and on the tummy.
const KNEEL = {torso: 0, a1: [176, 150], a2: [172, 148], l1: [106, 270, 270], l2: [106, 270, 270]};
const KNEEL_TALL = {torso: 0, a1: [182, 178], a2: [176, 182], l1: [180, 270, 270], l2: [180, 270, 270]};
const SIT_KNEES = {torso: 350, a1: [135, 90, 1, .8], a2: [131, 88, 1, .8], l1: [50, 143, 90], l2: [48, 141, 90]};
const LYING = {torso: 270, head: 270, a1: [94, 92], a2: [94, 92], l1: [35, 168, 90], l2: [33, 166, 90]};
const PRONE = {torso: 90, head: 80, a1: [300, 150], a2: [296, 148], l1: [266, 268, 270], l2: [266, 268, 270]};
const CROSS = {l1: [95, 262, 270, .62, 1], l2: [265, 98, 90, .62, 1]};

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
 // --- Standing ---
 star: {anchor: 'hip', frames: [
  STAND_FRONT,
  {...STAND_FRONT, a1: [110, 104], a2: [250, 256], l1: [166, 168, 100], l2: [194, 192, 260]},
  {...STAND_FRONT, a1: [56, 54], a2: [304, 306], l1: [157, 157, 100], l2: [203, 203, 260]},
 ], chair: {...SITTING, a1: [34, 32], a2: [22, 20], l1: [96, 145, 60], l2: [94, 143, 60]}},
 ragdoll: {anchor: 'a1', x: 236, frames: [
  STAND_SIDE,
  {torso: 70, head: 95, a1: [178, 180], a2: [182, 180], l1: [176, 183, 90], l2: [176, 183, 90]},
  {torso: 138, head: 160, a1: [172, 250], a2: [186, 110], l1: [174, 185, 90], l2: [174, 185, 90]},
 ], chair: {...SITTING, torso: 85, head: 125, a1: [150, 215], a2: [146, 211]}},
 crescent: {anchor: 'hip', frames: [
  STAND_FRONT,
  {...STAND_FRONT, a1: [12, 4], a2: [348, 356]},
  {...STAND_FRONT, torso: 20, head: 24, a1: [32, 26], a2: [10, 20]},
 ], chair: {...SITTING, torso: 12, head: 16, a1: [20, 24], a2: [200, 170]}},
 goddess: {anchor: 'hip', frames: [
  STAND_FRONT,
  {view: 1, torso: 0, a1: [120, 60], a2: [240, 300], l1: [150, 172, 100], l2: [210, 188, 260]},
  {view: 1, torso: 0, a1: [90, 0], a2: [270, 0], l1: [118, 180, 100], l2: [242, 180, 260]},
 ], chair: {...SITTING, a1: [80, 0], a2: [76, 356], l1: [84, 176, 90], l2: [92, 182, 90]}},
 peaceful: {anchor: 'hip', frames: [
  STAND_FRONT,
  {view: 1, torso: 0, head: 6, a1: [90, 90], a2: [270, 270], l1: [110, 180, 90], l2: [228, 228, 260]},
  {view: 1, torso: 346, head: 352, a1: [356, 344], a2: [200, 205], l1: [110, 180, 90], l2: [228, 228, 260]},
 ], chair: {...SITTING, torso: 352, head: 356, a1: [10, 350], a2: [200, 170]}},
 frog: {anchor: 'hip', frames: [
  {...STAND_FRONT, l1: [170, 174, 100], l2: [190, 186, 260]},
  {view: 1, torso: 0, a1: [158, 292], a2: [202, 68], l1: [135, 190, 105], l2: [225, 170, 255]},
  {view: 1, torso: 0, a1: [150, 300], a2: [210, 60], l1: [75, 200, 110, .85, 1], l2: [285, 160, 250, .85, 1]},
 ], chair: {...SITTING, torso: 10, a1: [150, 30], a2: [146, 28], l1: [84, 176, 90], l2: [92, 182, 90]}},
 // --- Balance ---
 flamingo: {anchor: 'a2', x: 250, frames: [
  STAND_SIDE,
  {torso: 0, a1: [200, 160], a2: [196, 158], l1: [140, 190, 110], l2: [180, 180, 90]},
  {torso: 0, a1: [200, 160], a2: [196, 158], l1: [92, 180, 110], l2: [180, 180, 90]},
 ], chair: {...SITTING, a1: [200, 160], a2: [196, 158], l1: [60, 170, 100]}},
 airplane: {anchor: 'a1', x: 270, frames: [
  STAND_SIDE,
  {torso: 32, head: 36, a1: [222, 226], a2: [218, 222], l1: [180, 180, 90], l2: [208, 208, 120]},
  {torso: 66, head: 62, a1: [254, 256], a2: [250, 252], l1: [180, 180, 90], l2: [246, 246, 150]},
 ], chair: {...SITTING, torso: 30, head: 36, a1: [228, 232], a2: [224, 228], l1: [92, 180, 90], l2: [96, 145, 60]}},
 eagle: {anchor: 'a2', frames: [
  {...STAND_FRONT, a1: [165, 292], a2: [195, 68]},
  {view: 1, torso: 0, a1: [170, 330, 1, .8], a2: [190, 30, 1, .8], l1: [176, 184, 100, .95, .95], l2: [184, 176, 260, .95, .95]},
  {view: 1, torso: 0, a1: [200, 355, .75, .85], a2: [160, 5, .75, .85], l1: [212, 186, 200, .95, .9], l2: [186, 174, 260, .93, .93]},
 ], chair: {...SITTING, a1: [150, 20], a2: [146, 16], l1: [80, 186, 90], l2: [92, 180, 90]}},
 dancer: {anchor: 'a1', x: 280, frames: [
  STAND_SIDE,
  {torso: 8, a1: [20, 14], a2: [210, 210], l1: [180, 180, 90], l2: [195, 345, 300]},
  {torso: 15, head: 10, a1: [34, 30], a2: [224, 224, 1.17, 1.17], l1: [180, 180, 90], l2: [205, 338, 300]},
 ], chair: {...SITTING, torso: 4, a1: [20, 14], a2: [210, 210, 1.08, 1.08], l2: [190, 335, 290]}, chairStart: {l2: [190, 335, 290]}},
 // --- Hands and knees ---
 birddog: {anchor: 'k1', x: 250, frames: [
  TABLE,
  {...TABLE, a1: [130, 110], l2: [215, 268, 270]},
  {...TABLE, head: 90, a1: [80, 78], l2: [264, 266, 262]},
 ], chair: {...SITTING, a1: [86, 84], l2: [96, 100, 30]}},
 plank: {anchor: 'w1', x: 392, frames: [
  TABLE,
  {torso: 73, head: 88, a1: [180, 180], a2: [180, 180], l1: [251, 251, 180], l2: [180, 270, 270]},
  {torso: 71, head: 84, a1: [180, 180], a2: [180, 180], l1: [251, 251, 180], l2: [251, 251, 180]},
 ], chair: {...SITTING, torso: 352, a1: [84, 84], a2: [80, 80], l1: [96, 145, 60], l2: [94, 143, 60]}},
 crab: {anchor: 'a1', x: 380, frames: [
  {torso: 340, head: 350, a1: [207, 207], a2: [203, 203], l1: [50, 143, 90], l2: [50, 143, 90]},
  {torso: 314, head: 330, a1: [194, 194], a2: [190, 190], l1: [70, 162, 90], l2: [70, 162, 90]},
  {torso: 288, head: 312, a1: [180, 180], a2: [178, 178], l1: [90, 180, 90], l2: [90, 180, 90]},
 ], chair: {...SITTING, torso: 348, head: 356, a1: [200, 176], a2: [196, 172], l1: [96, 145, 60], l2: [94, 143, 60]}},
 // --- Kneeling and sitting ---
 lunge: {anchor: 'k2', x: 170, frames: [
  KNEEL_TALL,
  {torso: 2, a1: [150, 110], a2: [146, 108], l1: [92, 182, 90], l2: [196, 268, 270]},
  {torso: 4, a1: [8, 4], a2: [4, 0], l1: [80, 180, 90], l2: [220, 268, 270]},
 ], chair: {...SITTING, a1: [150, 110], a2: [146, 108], l1: [92, 180, 90], l2: [241, 241, 100]}, chairStart: {l2: [241, 241, 100]}},
 gate: {anchor: 'k2', x: 226, frames: [
  {view: 1, torso: 0, a1: [172, 176], a2: [188, 184], l1: [180, 90, 90, 1, .2], l2: [180, 270, 270, 1, .2]},
  {view: 1, torso: 0, a1: [100, 96], a2: [260, 264], l1: [124, 124, 90], l2: [180, 270, 270, 1, .2]},
  {view: 1, torso: 24, head: 22, a1: [150, 136], a2: [22, 44], l1: [120, 120, 90], l2: [180, 270, 270, 1, .2]},
 ], chair: {...SITTING, torso: 14, head: 12, a1: [140, 120], a2: [14, 30], l1: [96, 145, 60]}},
 lion: {anchor: 'k1', x: 300, frames: [
  KNEEL,
  {...KNEEL, torso: 12, head: 14, a1: [166, 150], a2: [162, 148]},
  {...KNEEL, torso: 25, head: 34, a1: [160, 160, 1.05, 1.05], a2: [156, 158, 1.05, 1.05]},
 ], chair: {...SITTING, torso: 14, head: 24, a1: [150, 118], a2: [146, 116]}},
 pinza: {anchor: 'hip', x: 170, frames: [
  {torso: 0, a1: [150, 96, 1, .8], a2: [146, 94, 1, .8], l1: [88, 99, 10], l2: [88, 99, 10]},
  {torso: 8, a1: [20, 14], a2: [16, 10], l1: [88, 99, 10], l2: [88, 99, 10]},
  {torso: 52, head: 64, a1: [115, 118], a2: [113, 116], l1: [88, 99, 10], l2: [88, 99, 10]},
 ], chair: {...SITTING, torso: 48, head: 60, a1: [112, 118], a2: [110, 116], l1: [96, 145, 60], l2: [94, 143, 60]}},
 boat: {anchor: 'hip', x: 226, frames: [
  SIT_KNEES,
  {torso: 338, head: 350, a1: [112, 92, 1, .8], a2: [110, 90, 1, .8], l1: [50, 120, 70], l2: [50, 120, 70]},
  {torso: 332, head: 346, a1: [90, 88], a2: [88, 86], l1: [48, 92, 60], l2: [46, 90, 60]},
 ], chair: {...SITTING, torso: 346, head: 354, a1: [150, 176], a2: [146, 172], l1: [70, 150, 80], l2: [68, 148, 80]}},
 twist: {anchor: 'hip', frames: [
  {view: 1, torso: 0, a1: [168, 186], a2: [192, 174], ...CROSS},
  {view: .8, torso: 0, a1: [150, 176], a2: [170, 140], ...CROSS},
  {view: .45, torso: 0, head: 4, a1: [125, 172, 1, 1.2], a2: [146, 146, 1.08, 1.08], ...CROSS},
 ], chair: {...SITTING, head: 356, a1: [215, 200], a2: [150, 110]}},
 // --- Lying down ---
 sphinx: {anchor: 'p1', x: 250, frames: [
  PRONE,
  {torso: 80, head: 70, a1: [200, 100, .85, 1], a2: [196, 98, .85, 1], l1: [266, 268, 270], l2: [266, 268, 270]},
  {torso: 65, spine: -.35, head: 44, a1: [180, 90, .85, 1], a2: [178, 88, .85, 1], l1: [266, 268, 270], l2: [266, 268, 270]},
 ], chair: {...SITTING, torso: 14, spine: -.5, head: 20, a1: [150, 96], a2: [146, 94]}},
 locust: {anchor: 'p1', x: 270, frames: [
  {torso: 90, head: 84, a1: [268, 266], a2: [268, 266], l1: [266, 268, 270], l2: [266, 268, 270]},
  {torso: 84, head: 76, a1: [274, 274], a2: [272, 272], l1: [270, 272, 270], l2: [268, 270, 270]},
  {torso: 77, spine: -.3, head: 62, a1: [282, 284], a2: [280, 282], l1: [277, 279, 276], l2: [275, 277, 274]},
 ], chair: {...SITTING, torso: 18, head: 24, a1: [215, 225], a2: [211, 221]}},
 bridge: {anchor: 'a1', x: 404, frames: [
  LYING,
  {torso: 263, head: 270, a1: [96, 94], a2: [96, 94], l1: [48, 174, 90], l2: [48, 174, 90]},
  {torso: 257, head: 270, a1: [99, 99], a2: [99, 99], l1: [60, 180, 90], l2: [60, 180, 90]},
 ], chair: {...SITTING, torso: 356, spine: -.5, head: 8, a1: [190, 176], a2: [186, 172]}},
 happybaby: {anchor: 'hip', x: 330, frames: [
  LYING,
  {torso: 270, head: 270, a1: [40, 100], a2: [38, 98], l1: [300, 100, 90], l2: [298, 98, 90]},
  {torso: 270, head: 270, a1: [8, 8], a2: [6, 6], l1: [290, 0, 90], l2: [288, 358, 90]},
 ], chair: {...SITTING, torso: 15, head: 20, a1: [138, 138, 1.09, 1.09], a2: [134, 134, 1.09, 1.09], l1: [40, 140, 70]}},
 ball: {anchor: 'hip', x: 330, frames: [
  LYING,
  {torso: 270, head: 270, a1: [70, 96], a2: [68, 94], l1: [345, 130, 90], l2: [343, 128, 90]},
  {torso: 270, head: 270, a1: [40, 100], a2: [38, 98], l1: [300, 100, 90], l2: [298, 98, 90]},
 ], chair: {...SITTING, torso: 4, a1: [135, 80, 1, .5], a2: [131, 76, 1, .5], l1: [50, 160, 90]}},
 lyingtwist: {anchor: 'hip', x: 320, frames: [
  LYING,
  {torso: 270, head: 270, a1: [40, 20], a2: [94, 92], l1: [345, 130, 90], l2: [343, 128, 90]},
  {torso: 270, head: 270, a1: [10, 350, .8, .8], a2: [94, 92], l1: [62, 118, 100, .55, .9], l2: [56, 112, 100, .5, .9]},
 ], chair: {...SITTING, a1: [140, 100], a2: [136, 96], l1: [82, 168, 100]}},
 rest: {anchor: 'hip', x: 290, frames: [
  SIT_KNEES,
  {torso: 305, head: 300, a1: [200, 100], a2: [196, 98], l1: [70, 118, 60], l2: [70, 118, 60]},
  {torso: 270, head: 270, a1: [100, 96], a2: [100, 96], l1: [93, 94, 30], l2: [91, 92, 30]},
 ], chair: {...SITTING, torso: 356, head: 350, a1: [176, 100, 1, .8], a2: [172, 98, 1, .8], l1: [94, 160, 80], l2: [92, 162, 80]}},
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
 star: ['a1', 'a2'], ragdoll: ['a1', 'a2'], crescent: ['a1', 'a2'], goddess: ['a1', 'a2'], peaceful: ['a1', 'a2'], frog: ['a1', 'a2'],
 flamingo: ['a2'], airplane: ['a1'], eagle: ['a2'], dancer: ['a1'], birddog: ['w2', 'k1'], plank: ['w1', 't1'], crab: ['w1', 'a1'],
 lunge: ['a1', 'k2'], gate: ['k2', 'a1'], lion: ['k1'], pinza: ['hip', 'a1'], boat: ['hip'], twist: ['hip'],
 sphinx: ['hip', 'e1'], locust: ['hip'], bridge: ['a1', 'head'], happybaby: ['hip'], ball: ['hip'], lyingtwist: ['hip'], rest: ['hip', 'a1'],
};

// The chair variant starts from plain sitting, so it animates the same way: sit, half way, pose.
export function chairFrames(id) {
 const pose = FIGURES[id].chair, start = {...SITTING, ...FIGURES[id].chairStart};
 return [start, blend(start, pose, .5), pose];
}
export function figureAt(id, p, {chair = false} = {}) {
 const figure = FIGURES[id];
 if (chair) return place(frameAt(chairFrames(id), p), {anchor: 'hip', x: 236});
 return place(frameAt(figure.frames, p), {anchor: figure.anchor, x: figure.x ?? W / 2});
}
