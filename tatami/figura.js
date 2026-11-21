// Draws a pose on its mat: the painted sheet when it exists (tatami/assets/pose-<id>.webp, three
// drawings in a row), otherwise the provisional jointed figure of esqueleto.js in the kit's colours.
import {W, H, FLOOR, SEAT, figureAt} from './esqueleto.js';
import {PINTADAS} from './assets/pintadas.js';

const LINE = '#4a3422';
// Lúa's clothes (gimnasio/assets/pupil-2.webp): lilac hoodie, plum joggers, white trainers, copper curls.
const C = {hood: '#a88dd2', hoodFar: '#8f76bb', legs: '#5d4985', legsFar: '#4b3a6e', skin: '#f2c39d', skinFar: '#ddab85',
 hair: '#c4622b', hairDark: '#a24e20', band: '#7756b3', shoe: '#f5f1fa', sole: '#b7a5d8', stripe: '#efe3cf'};

export const painted = (id, chair = false) => PINTADAS.includes(chair ? id + '-silla' : id);
export const sheetUrl = (id, chair = false) => new URL(`./assets/pose-${id}${chair ? '-silla' : ''}.webp`, import.meta.url).href;

const f1 = n => Math.round(n * 10) / 10;
const pt = p => `${f1(p[0])} ${f1(p[1])}`;
const seg = (a, b, w, colour) => `<path d="M${pt(a)}L${pt(b)}" stroke="${colour}" stroke-width="${w}"/>`;
const curve = (a, c, b, w, colour) => `<path d="M${pt(a)}Q${pt(c)} ${pt(b)}" stroke="${colour}" stroke-width="${w}"/>`;
const dot = (p, r, colour) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="${r}" fill="${colour}"/>`;
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
const along = (p, u, d) => [p[0] + u[0] * d, p[1] + u[1] * d];

// Each part is a list of strokes; the outline of the whole part is drawn first, so joints do not show seams.
function part(strokes) {
 const outline = strokes.map(([kind, ...args]) => kind === 'dot' ? dot(args[0], args[1] + 2.5, LINE)
  : kind === 'curve' ? curve(args[0], args[1], args[2], args[3] + 5, LINE) : seg(args[0], args[1], args[2] + 5, LINE));
 const fill = strokes.map(([kind, ...args]) => kind === 'dot' ? dot(args[0], args[1], args[2])
  : kind === 'curve' ? curve(args[0], args[1], args[2], args[3], args[4]) : seg(args[0], args[1], args[2], args[3]));
 return `<g>${outline.join('')}</g><g>${fill.join('')}</g>`;
}
function arm(s, e, w, far) {
 const u = unit(e, w);
 return part([['seg', s, e, 21, far ? C.hoodFar : C.hood], ['seg', e, along(w, u, -4), 18, far ? C.hoodFar : C.hood],
  ['seg', along(w, u, -2), along(w, u, 7), 13, far ? C.skinFar : C.skin]]);
}
function leg(p, k, a, t, far) {
 const u = unit(a, t), heel = along(a, u, -9);
 return part([['seg', p, k, 29, far ? C.legsFar : C.legs], ['seg', k, a, 23, far ? C.legsFar : C.legs],
  ['seg', heel, t, 15, far ? C.sole : C.shoe]]);
}
function head(j) {
 const up = unit(j.neck, j.head), front = [-up[1], up[0]], v = j.view;
 const back = along(j.head, front, -9 * (1 - v)), crown = along(back, up, 6);
 const curls = v > .5
  ? [[-22, 4], [22, 4], [-16, 18], [16, 18], [0, 22], [-24, -10], [24, -10]]
  : [[-20, 2], [-14, 16], [-22, -12], [-6, 20], [4, 22]];
 const hair = [['dot', crown, 27, C.hair], ...curls.map(([s, u]) => ['dot', along(along(back, front, s), up, u), 12, C.hair])];
 const neck = along(j.neck, up, 4);
 let out = part([['seg', j.neck, neck, 14, C.skin]]) + part(hair) + part([['dot', j.head, 24, C.skin]]);
 // Headband over the crown, then the face: one eye in profile, two from the front.
 const bandA = along(along(j.head, up, 13), front, -16), bandB = along(along(j.head, up, 13), front, 15 * v);
 out += `<path d="M${pt(bandA)}Q${pt(along(j.head, up, 30))} ${pt(bandB)}" fill="none" stroke="${C.band}" stroke-width="6" stroke-linecap="round"/>`;
 if (v > .5) out += dot(along(along(j.head, front, -8), up, 2), 2.6, LINE) + dot(along(along(j.head, front, 8), up, 2), 2.6, LINE);
 else out += dot(along(along(j.head, front, 14), up, 3), 2.6, LINE) + dot(along(along(j.head, front, 23), up, -3), 2, '#d99a77');
 return out;
}
function torso(j) {
 const up = unit(j.hip, j.neck), top = along(j.neck, up, -4), bottom = along(j.hip, up, 10);
 const strokes = [['seg', j.p1, j.p2, 30, C.legs], ['dot', j.hip, 17, C.legs],
  ['curve', bottom, j.ctrl, top, 40 + 6 * j.view, C.hood]];
 if (j.view > .3) strokes.push(['seg', j.s1, j.s2, 26, C.hood]);
 return part(strokes);
}

export function bodyMarkup(j) {
 const front = j.view > .5;
 const farArm = arm(j.s2, j.e2, j.w2, !front), nearArm = arm(j.s1, j.e1, j.w1, false);
 const farLeg = leg(j.p2, j.k2, j.a2, j.t2, !front), nearLeg = leg(j.p1, j.k1, j.a1, j.t1, false);
 if (front) return farArm + nearArm + farLeg + nearLeg + torso(j) + head(j);
 // In profile an arm raised beside the ear passes behind the face, not over it.
 const raised = j.e1[1] < j.s1[1] - 30;
 return farArm + farLeg + torso(j) + (raised ? nearArm + head(j) + nearLeg : head(j) + nearLeg + nearArm);
}

const MAT = `<path d="M44 ${FLOOR + 12}L72 ${FLOOR - 6}H440L468 ${FLOOR + 12}Z" fill="#2a9d93" stroke="#1d6d66" stroke-width="3" stroke-linejoin="round"/><path d="M44 ${FLOOR + 12}H468V${FLOOR + 19}H44Z" fill="#1f7a72"/>`;
function chairMarkup(x) {
 const seat = FLOOR - SEAT + 20;
 return `<g stroke-linecap="round" fill="none"><path d="M${x - 58} ${seat - 8}V${seat - 150}" stroke="#2c6b66" stroke-width="9"/>
  <path d="M${x - 58} ${seat - 140}V${seat - 96}" stroke="#c98a4a" stroke-width="15"/>
  <path d="M${x - 50} ${seat + 10}L${x - 54} ${FLOOR + 8}M${x + 36} ${seat + 10}L${x + 40} ${FLOOR + 8}" stroke="#2c6b66" stroke-width="8"/>
  <path d="M${x - 62} ${seat}H${x + 46}" stroke="${LINE}" stroke-width="15"/><path d="M${x - 62} ${seat}H${x + 46}" stroke="#d29455" stroke-width="10"/></g>`;
}

// Everything inside the 512×640 frame for one moment of a pose. t: 0 preparation, 1 half way, 2 pose.
export function sceneMarkup(id, t, {chair = false} = {}) {
 const j = figureAt(id, t, {chair});
 const shadow = `<ellipse cx="${f1(chair ? 236 : (Math.min(j.a1[0], j.a2[0], j.w1[0], j.hip[0]) + Math.max(j.a1[0], j.a2[0], j.w1[0], j.hip[0])) / 2)}" cy="${FLOOR + 2}" rx="${chair ? 96 : 120}" ry="7" fill="#123f3b" opacity=".28"/>`;
 return (chair ? `<path d="M120 ${FLOOR + 12}H360" stroke="#7a5a34" stroke-width="3" opacity=".5"/>` : MAT) + shadow
  + (chair ? chairMarkup(236) : '') + `<g stroke-linecap="round" stroke-linejoin="round" fill="none">${bodyMarkup(j)}</g>`;
}

// A live drawing inside `host`. set(id, t, options) redraws it; it chooses painted art or the figure by itself.
export function createFigure(host, {label = ''} = {}) {
 host.innerHTML = `<svg class="pose-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><g class="pose-flip"></g></svg>`;
 const svg = host.firstElementChild, layer = svg.firstElementChild;
 let current = '';
 return {
  svg,
  set(id, t, {chair = false, mirror = false, name = ''} = {}) {
   layer.setAttribute('transform', mirror ? `translate(${W} 0) scale(-1 1)` : '');
   if (name) svg.setAttribute('aria-label', name);
   if (painted(id, chair)) {
    const key = id + chair;
    if (current !== key) {
     current = key;
     layer.innerHTML = chair
      ? `<image href="${sheetUrl(id, true)}" width="${W}" height="${H}"/>`
      : [0, 1, 2].map(i => `<svg x="0" y="0" width="${W}" height="${H}" viewBox="${i * W} 0 ${W} ${H}"><image href="${sheetUrl(id)}" width="${W * 3}" height="${H}"/></svg>`).join('');
    }
    // Blend adjacent drawings during the transition and show only the held pose at rest.
    if (!chair) [...layer.children].forEach((frame, i) => {
     frame.setAttribute('opacity', f1(Math.max(0, 1 - Math.abs(t - i))));
    });
    return;
   }
   current = '';
   layer.innerHTML = sceneMarkup(id, t, {chair});
  },
 };
}
