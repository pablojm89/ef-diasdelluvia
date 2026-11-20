import {HEROES} from './roster.js';

export {HEROES as CHARACTERS};
export const TEAM_COLORS = [
 {main:'#39cdbb', light:'#9cffee', dark:'#197c86', name:'COMETAS'},
 {main:'#f78561', light:'#ffd295', dark:'#a6454a', name:'RAYOS'},
];

const art = new URL('./assets/roster/', import.meta.url);
const sheets = new Map();
const FRAME_WIDTH = 60, FRAME_HEIGHT = 68;
const FRAME = {ready:0, breathe:1, run:2, catch:6, throw:7, dash:8, hold:9, stun:10};

export function portrait(character) {
 const hero = HEROES[character] || HEROES[0];
 const filename = hero.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
 return new URL(filename + '.png', art).href;
}

function teamSheet(team) {
 if (!sheets.has(team)) {
  const image = new Image();
  image.src = new URL('court-' + team + '.png', art).href;
  sheets.set(team, image);
 }
 return sheets.get(team);
}

function actionFrame(p, time, holding) {
 if (p.stun > 0) return FRAME.stun;
 if (p.dashTime > 0) return FRAME.dash;
 if (p.throwFlash > 0) return FRAME.throw;
 if (p.catchTime > 0) return FRAME.catch;
 const speed = Math.hypot(p.vx || 0, p.vy || 0);
 const offset = p.slot || 0;
 if (speed > 10) {
  // Steady cadence across network snapshots. Keep a brief cradle pose on each
  // planted step while carrying, with the other frames showing running feet.
  const step = Math.floor(time * (p.slowed > 0 ? 4 : 8) + offset) % 4;
  return holding && step === 1 ? FRAME.hold : FRAME.run + step;
 }
 if (holding) return FRAME.hold;
 return Math.floor(time * 1.4 + offset) % 2 ? FRAME.breathe : FRAME.ready;
}

export function paintCharacter(ctx, p, {scale=1, face=p.face || 1, time=0, selected=false, holding=false}={}) {
 const sheet = teamSheet(p.team === 1 ? 1 : 0);
 if (!sheet.naturalWidth) return;
 const row = HEROES[p.character] ? p.character : 0;
 const frame = actionFrame(p, time, holding);
 ctx.save();
 ctx.scale(face * scale, scale);
 ctx.imageSmoothingEnabled = false;
 ctx.drawImage(sheet, frame * FRAME_WIDTH, row * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT,
  -28, -60, FRAME_WIDTH, FRAME_HEIGHT);
 if (selected) {
  ctx.fillStyle = '#ffeaaa';
  ctx.fillRect(-4, -63, 9, 2);
  ctx.fillRect(-2, -61, 5, 2);
  ctx.fillRect(0, -59, 1, 1);
 }
 ctx.restore();
}
