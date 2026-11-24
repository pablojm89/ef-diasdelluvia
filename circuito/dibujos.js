// El Circuito: the drawings. The plan of the gym seen from above, the gym seen from the floor facing each
// of its walls, and the control flag. Plain shapes in the colours of the school; the views from the floor
// are provisional until the paintings of arte/lotes/19-circuito.json arrive.
import {DIRS, OBJETOS, RECORRIDO, objeto} from './plano.js';

// --- The plan ---------------------------------------------------------------------------------------
// A square sheet of 120 with the room (100 × 76) in its middle, so that it can be turned on itself.
const X = x => 10 + 100 * x, Y = y => 22 + 76 * y;
const MAGENTA = '#c2185b';
// The sheet. `marcas` adds what each task needs: {controles: 'recorrido' | [objectId], tu: {x, y, mira}}.
export function planoSVG({marcas = {}} = {}) {
 const obj = id => objeto(id);
 const teeth = Array.from({length: 6}, (_, i) => `<line x1="${X(.015)}" y1="${Y(.43 + i * .036)}" x2="${X(.055)}" y2="${Y(.43 + i * .036)}"/>`).join('');
 let over = '';
 if (marcas.controles === 'recorrido') {
  const stops = [RECORRIDO.salida, ...RECORRIDO.controles.map(control => [obj(control.objeto).x, obj(control.objeto).y]), RECORRIDO.meta].map(([x, y]) => [X(x), Y(y)]);
  // The lines only say the order; they stop short of each symbol, as on a real course.
  for (let i = 0; i < stops.length - 1; i++) {
   const [x1, y1] = stops[i], [x2, y2] = stops[i + 1], d = Math.hypot(x2 - x1, y2 - y1) || 1, k = 6.2 / d;
   over += `<line x1="${(x1 + (x2 - x1) * k).toFixed(1)}" y1="${(y1 + (y2 - y1) * k).toFixed(1)}" x2="${(x2 - (x2 - x1) * k).toFixed(1)}" y2="${(y2 - (y2 - y1) * k).toFixed(1)}"/>`;
  }
  const [sx, sy] = stops[0], [mx, my] = stops.at(-1);
  over += `<path d="M${sx} ${sy - 6}L${sx + 5.4} ${sy + 3.6}L${sx - 5.4} ${sy + 3.6}Z"/><circle cx="${mx}" cy="${my}" r="5.4"/><circle cx="${mx}" cy="${my}" r="3.4"/>`;
  RECORRIDO.controles.forEach((control, index) => {
   const [cx, cy] = stops[index + 1];
   over += `<circle class="control${marcas.ahora === index ? ' ahora' : ''}${marcas.ahora > index ? ' hecho' : ''}" cx="${cx}" cy="${cy}" r="5.6"/><text class="numero" x="${cx + (cx > 90 ? -9.5 : 7.5)}" y="${cy + (cy < 34 ? 9 : -5)}">${index + 1}</text>`;
  });
 } else if (Array.isArray(marcas.controles)) {
  for (const id of marcas.controles) over += `<circle class="control ahora" cx="${X(obj(id).x)}" cy="${Y(obj(id).y)}" r="5.6"/>`;
 }
 let tu = '';
 if (marcas.tu) {
  const turn = DIRS.indexOf(marcas.tu.mira) * 90;
  tu = `<g class="tu" transform="translate(${X(marcas.tu.x)} ${Y(marcas.tu.y)}) rotate(${turn})"><circle r="3.4"/><path d="M0 -9L3.2 -3.6L-3.2 -3.6Z"/></g>`;
 }
 return `<g class="hoja">
  <rect class="papel" x="2" y="2" width="116" height="116" rx="3"/>
  <rect class="norte" x="2" y="2" width="116" height="5.5" rx="2"/>
  <g class="suelo"><rect x="${X(0)}" y="${Y(0)}" width="100" height="76"/>
   <line x1="${X(0)}" y1="${Y(.5)}" x2="${X(1)}" y2="${Y(.5)}"/><circle cx="${X(.5)}" cy="${Y(.5)}" r="9"/>
   <path d="M${X(.43)} ${Y(0)}V${Y(.2)}H${X(.67)}V${Y(0)}"/><path d="M${X(.38)} ${Y(1)}V${Y(.8)}H${X(.62)}V${Y(1)}"/></g>
  <rect class="muro" x="${X(0)}" y="${Y(0)}" width="100" height="76"/>
  <g class="hueco"><line x1="${X(.82)}" y1="${Y(0)}" x2="${X(.9)}" y2="${Y(0)}"/><line x1="${X(.44)}" y1="${Y(1)}" x2="${X(.56)}" y2="${Y(1)}"/></g>
  <g class="puerta"><path d="M${X(.82)} ${Y(0)}a8 8 0 0 0 8 8"/><path d="M${X(.44)} ${Y(1)}a6 6 0 0 1 6 -6M${X(.56)} ${Y(1)}a6 6 0 0 0 -6 -6"/></g>
  <line class="ventana" x1="${X(.004)}" y1="${Y(.08)}" x2="${X(.004)}" y2="${Y(.4)}"/>
  <g class="madera"><rect x="${X(.012)}" y="${Y(.42)}" width="4.6" height="${76 * .2}"/><g class="dientes">${teeth}</g>
   <rect x="${X(.06)}" y="${Y(.87)}" width="14" height="4"/><rect x="${X(.935)}" y="${Y(.3)}" width="4" height="${76 * .4}"/></g>
  <rect class="pizarra" x="${X(.012)}" y="${Y(.72)}" width="2.6" height="${76 * .18}"/>
  <rect class="colchon" x="${X(.28)}" y="${Y(.07)}" width="14" height="9"/>
  <g class="carro"><rect x="${X(.18)}" y="${Y(.08)}" width="8" height="8"/><circle cx="${X(.22)}" cy="${Y(.133)}" r="2.2"/></g>
  <g class="canasta"><line x1="${X(.5)}" y1="${Y(.03)}" x2="${X(.6)}" y2="${Y(.03)}"/><circle cx="${X(.55)}" cy="${Y(.075)}" r="2.3"/></g>
  <g class="recorrido">${over}</g>${tu}
  <g class="dianas">${OBJETOS.map(item => `<circle data-obj="${item.id}" cx="${X(item.x)}" cy="${Y(item.y)}" r="8.5"><title>${item.es}</title></circle>`).join('')}</g>
 </g>`;
}

// --- The gym seen from the floor ----------------------------------------------------------------------
// What hangs on each wall, as seen facing it: `u` from its left end to its right end, `v` from the top
// of the wall (0) to the floor (1).
const EN_PARED = {
 N: [{tipo: 'canasta', u: [.47, .63], v: [.12, .44]}, {tipo: 'puerta', u: [.82, .9], v: [.46, 1]}],
 E: [{tipo: 'percha', u: [.14, .27], v: [.42, .47]}, {tipo: 'banco', u: [.3, .7], v: [.82, .96]}],
 S: [{tipo: 'reloj', u: [.47, .53], v: [.14, .28]}, {tipo: 'entrada', u: [.42, .58], v: [.4, 1]}],
 O: [{tipo: 'pizarra', u: [.1, .28], v: [.3, .62]}, {tipo: 'espalderas', u: [.38, .58], v: [.2, .97]}, {tipo: 'ventana', u: [.6, .92], v: [.06, .36]}],
};
const EN_SUELO = [{tipo: 'colchon', x: .35, y: .13}, {tipo: 'carro', x: .22, y: .13}, {tipo: 'banquito', x: .13, y: .9}];
// Where a point of a wall falls in the picture (400 × 260): the wall in front is a rectangle, the side
// walls run away from the viewer.
function punto(lado, u, v) {
 if (lado === 'frente') return [90 + 220 * u, 50 + 120 * v];
 const lejos = lado === 'izquierda' ? u : 1 - u;                 // 0 beside the viewer, 1 at the far corner
 const x = lado === 'izquierda' ? 90 * lejos : 400 - 90 * lejos, top = 10 + 40 * lejos, bottom = 240 - 70 * lejos;
 return [x, top + (bottom - top) * v];
}
const poli = (lado, [u0, u1], [v0, v1], cls) => `<polygon class="${cls}" points="${[[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => punto(lado, u, v).map(n => n.toFixed(1)).join(',')).join(' ')}"/>`;
function cosa(lado, item, u) {
 const {tipo, v} = item;
 if (tipo === 'canasta') return poli(lado, u, v, 'tablero') + poli(lado, [u[0] + (u[1] - u[0]) * .32, u[0] + (u[1] - u[0]) * .68], [v[1] - .02, v[1] + .07], 'aro');
 if (tipo === 'espalderas') return poli(lado, u, v, 'madera') + Array.from({length: 7}, (_, i) => { const at = v[0] + (v[1] - v[0]) * (i + 1) / 8, a = punto(lado, u[0], at), b = punto(lado, u[1], at); return `<line class="liston" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`; }).join('');
 if (tipo === 'ventana') return poli(lado, u, v, 'cristal') + [1, 2].map(i => { const at = u[0] + (u[1] - u[0]) * i / 3, a = punto(lado, at, v[0]), b = punto(lado, at, v[1]); return `<line class="marco" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`; }).join('');
 if (tipo === 'entrada') { const mid = (u[0] + u[1]) / 2, a = punto(lado, mid, v[0]), b = punto(lado, mid, v[1]); return poli(lado, u, v, 'porton') + `<line class="marco" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`; }
 if (tipo === 'reloj') { const c = punto(lado, (u[0] + u[1]) / 2, (v[0] + v[1]) / 2); return `<circle class="reloj" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="8"/><path class="aguja" d="M${c[0].toFixed(1)} ${c[1].toFixed(1)}v-5M${c[0].toFixed(1)} ${c[1].toFixed(1)}h4"/>`; }
 return poli(lado, u, v, {puerta: 'puerta', pizarra: 'pizarra', banco: 'madera', percha: 'percha'}[tipo]);
}
// The gym as seen facing wall `mira`. From a wall you see the whole room; `centro` puts you in the
// centre circle, where only the half in front is seen: what is behind has to be read on the plan.
export function vistaSVG(mira, {centro = false} = {}) {
 const at = DIRS.indexOf(mira), lados = {frente: mira, izquierda: DIRS[(at + 3) % 4], derecha: DIRS[(at + 1) % 4]};
 let walls = '';
 for (const [lado, pared] of Object.entries(lados)) {
  walls += poli(lado, [0, 1], [0, 1], lado === 'frente' ? 'pared frente' : 'pared') + poli(lado, [0, 1], [.72, 1], 'zocalo') + poli(lado, [0, 1], [.7, .725], 'cenefa');
  for (const item of EN_PARED[pared]) {
   let [u0, u1] = item.u;
   if (centro && lado !== 'frente') {
    // Only the far half of each side wall is in sight from the centre.
    if (lado === 'izquierda') { if (u1 <= .5) continue; u0 = Math.max(0, (u0 - .5) * 2); u1 = (u1 - .5) * 2; }
    else { if (u0 >= .5) continue; u0 *= 2; u1 = Math.min(1, u1 * 2); }
   }
   walls += cosa(lado, item, [u0, u1]);
  }
 }
 let floor = '';
 const visto = [];
 for (const item of EN_SUELO) {
  // From plan to «left-right, near-far» for this viewer.
  let [a, b] = {N: [item.x, 1 - item.y], E: [item.y, item.x], S: [1 - item.x, item.y], O: [1 - item.y, 1 - item.x]}[mira];
  if (centro) { if (b < .56) continue; b = (b - .5) * 2; }
  visto.push({...item, a, b});
 }
 for (const {tipo, a, b} of visto.sort((p, q) => q.b - p.b)) {
  const x = (90 * b) + (400 - 180 * b) * a, y = 252 - 78 * b, s = 1.25 - .6 * b;
  if (tipo === 'colchon') floor += `<rect class="colchon" x="${(x - 26 * s).toFixed(1)}" y="${(y - 24 * s).toFixed(1)}" width="${(52 * s).toFixed(1)}" height="${(24 * s).toFixed(1)}" rx="2"/><line class="pliegue" x1="${(x - 26 * s).toFixed(1)}" y1="${(y - 12 * s).toFixed(1)}" x2="${(x + 26 * s).toFixed(1)}" y2="${(y - 12 * s).toFixed(1)}"/>`;
  if (tipo === 'carro') floor += `<rect class="jaula" x="${(x - 13 * s).toFixed(1)}" y="${(y - 30 * s).toFixed(1)}" width="${(26 * s).toFixed(1)}" height="${(30 * s).toFixed(1)}"/><circle class="balon" cx="${(x - 5 * s).toFixed(1)}" cy="${(y - 9 * s).toFixed(1)}" r="${(6 * s).toFixed(1)}"/><circle class="balon" cx="${(x + 5 * s).toFixed(1)}" cy="${(y - 19 * s).toFixed(1)}" r="${(6 * s).toFixed(1)}"/>`;
  if (tipo === 'banquito') floor += `<rect class="madera" x="${(x - 30 * s).toFixed(1)}" y="${(y - 12 * s).toFixed(1)}" width="${(60 * s).toFixed(1)}" height="${(5 * s).toFixed(1)}"/><path class="pata" d="M${(x - 24 * s).toFixed(1)} ${(y - 7 * s).toFixed(1)}v${(7 * s).toFixed(1)}M${(x + 24 * s).toFixed(1)} ${(y - 7 * s).toFixed(1)}v${(7 * s).toFixed(1)}"/>`;
 }
 const ring = centro ? '<ellipse class="linea" cx="200" cy="262" rx="150" ry="30"/>' : '<ellipse class="linea" cx="200" cy="212" rx="64" ry="14"/><line class="linea" x1="45" y1="212" x2="355" y2="212"/>';
 return `<polygon class="techo" points="0,0 400,0 400,10 310,50 90,50 0,10"/><polygon class="parque" points="0,240 90,170 310,170 400,240 400,260 0,260"/>${ring}${walls}${floor}`;
}

// The control flag: a square cut along its diagonal, white above and orange below.
export const balizaSVG = () => '<svg class="baliza" viewBox="0 0 40 40" aria-hidden="true"><path d="M3 3H37L3 37Z" fill="#fff"/><path d="M37 3V37H3Z" fill="#f28c28"/><rect x="3" y="3" width="34" height="34" fill="none" stroke="#463e28" stroke-width="2.5"/></svg>';
