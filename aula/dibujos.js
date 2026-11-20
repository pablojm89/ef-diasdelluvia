// Vector drawings used until the painted ones arrive: team pawns, the symbols of the special squares
// and one stick figure per bingo zone. All return SVG markup centred on 0,0.

const SHAPES = {
 circle: '<circle r="11"/>',
 star: '<polygon points="0,-15 4.4,-5 15,-4.6 6.8,2.6 9.3,13.4 0,7.6 -9.3,13.4 -6.8,2.6 -15,-4.6 -4.4,-5"/>',
 triangle: '<polygon points="0,-14 13,10 -13,10"/>',
 square: '<rect x="-10.5" y="-10.5" width="21" height="21" rx="2"/>',
 diamond: '<polygon points="0,-15 12,0 0,15 -12,0"/>',
 heart: '<path d="M0 13C-14 3-15-4-12-9-9-14-2-13 0-7 2-13 9-14 12-9 15-4 14 3 0 13Z"/>',
};
const light = colour => ['#f2c12e', '#f7f1e3'].includes(colour);

// A team pawn: a thick painted wooden disc with the team's shape on top.
export function pawn(team, r = 30) {
 const mark = light(team.colour) ? '#2a2522' : '#fff6e0', k = r / 30;
 return `<g transform="scale(${k})"><ellipse cy="14" rx="31" ry="12" fill="#2a1a0a" opacity=".35"/>
  <circle cy="3" r="35" fill="#fff6e0"/><circle cy="6" r="30" fill="#2a1d0e"/><circle r="30" fill="${team.colour}" stroke="#2a1d0e" stroke-width="4"/>
  <circle r="22" fill="none" stroke="${mark}" stroke-opacity=".45" stroke-width="2.5"/>
  <ellipse cx="-10" cy="-14" rx="10" ry="5" fill="#fff" opacity=".28"/>
  <g fill="${mark}">${SHAPES[team.shape]}</g></g>`;
}
export const pawnIcon = team => `<svg viewBox="-34 -34 68 72" aria-hidden="true">${pawn(team)}</svg>`;

const ink = 'stroke="#3a2a14" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
export const SYMBOLS = {
 oca: `<g ${ink} fill="#fff6e0"><path d="M-30 4C-10 6 8 2 18-4L34-12 28 4C26 22 6 30-12 28-26 26-34 16-30 4Z"/>
  <path d="M-16 6C-20-6-22-18-18-28" fill="none" stroke-width="11"/><path d="M-16 6C-20-6-22-18-18-28" fill="none" stroke="#fff6e0" stroke-width="3"/>
  <circle cx="-17" cy="-31" r="9"/><path d="M-6 10C4 18 16 14 22 6" fill="none"/></g>
  <path d="M-25-33-38-29-25-25Z" fill="#e8862a" ${ink} stroke-width="3"/><circle cx="-16" cy="-33" r="2" fill="#3a2a14"/>`,
 puente: `<g ${ink} fill="none"><path d="M-40 18Q0-30 40 18" stroke-width="13"/><path d="M-40 18Q0-30 40 18" stroke="#fff6e0" stroke-width="5"/>
  <path d="M-42 26H42" stroke-width="12"/><path d="M-42 26H42" stroke="#fff6e0" stroke-width="4"/>
  <path d="M-22 26V4M0 26V-6M22 26V4" stroke-width="4"/></g>`,
 calma: `<g ${ink} fill="#fff6e0"><path d="M-30 32C-34-6-6-30 32-32 34 6 10 32-30 32Z"/><path d="M-30 32 18-18M-6 8 2-8M6-4 18-2M-14 16-14 2M-14 16 2 18" fill="none" stroke-width="3.5"/></g>`,
 salida: `<g ${ink} fill="#fff6e0"><path d="M-8-34 26 0-8 34V14H-34V-14H-8Z"/></g>`,
 meta: `<g ${ink}><path d="M-26 38V-38" stroke-width="7" fill="none"/><path d="M-24-36H30V8H-24Z" fill="#fff6e0"/></g>
  <g fill="#3a2a14"><rect x="-24" y="-36" width="13.5" height="11"/><rect x="3" y="-36" width="13.5" height="11"/><rect x="-10.5" y="-25" width="13.5" height="11"/><rect x="16.5" y="-25" width="13.5" height="11"/><rect x="-24" y="-14" width="13.5" height="11"/><rect x="3" y="-14" width="13.5" height="11"/><rect x="-10.5" y="-3" width="13.5" height="11"/><rect x="16.5" y="-3" width="13.5" height="11"/></g>`,
};
export const symbolIcon = name => `<svg viewBox="-50 -50 100 100" aria-hidden="true">${SYMBOLS[name]}</svg>`;

// Stick figures for the six bingo zones.
const body = limbs => `<g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><circle cx="0" cy="-33" r="9" fill="currentColor" stroke="none"/><path d="M0-22V10"/>${limbs}</g>`;
export const FIGURES = {
 brazos: body('<path d="M0-16-20-38M0-16 20-38M0 10-12 40M0 10 12 40"/><path d="M-30-30A10 10 0 0 1-22-46M30-30A10 10 0 0 0 22-46" stroke-width="3"/>'),
 piernas: body('<path d="M0-16-20-2M0-16 20-2M0 10-10 40M0 10 18 14 14 36"/>'),
 ritmo: body('<path d="M0-16-14-4-2-6M0-16 14-4 2-6M0 10-10 40M0 10 10 40"/><path d="M-24-14A12 12 0 0 1-24-30M24-14A12 12 0 0 0 24-30" stroke-width="3"/>'),
 tronco: `<g transform="rotate(14)">${body('<path d="M0-16-22-10M0-16 22-24M0 10-12 40M0 10 12 40"/>')}</g><path d="M-30 24A34 14 0 0 0 30 24" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="5 5"/>`,
 equilibrio: body('<path d="M0-16-30-18M0-16 30-18M0 10 0 42M0 10 18 18 4 24"/>'),
 calma: body('<path d="M0-16-12 0 0 2M0-16 12 0 0 2M0 10-12 40M0 10 12 40"/><path d="M-30-6A30 30 0 0 1-30-44M30-6A30 30 0 0 0 30-44" stroke-width="3" opacity=".6"/>'),
};
export const figureIcon = zona => `<svg viewBox="-50 -50 100 100" aria-hidden="true">${FIGURES[zona]}</svg>`;
