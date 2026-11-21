// What the player can do, in the order of the ability bar, and the picture of each ability.
import {HEROES, STATS} from './roster.js';

import {PINTADOS} from './assets/abilities/pintados.js';

const art = new URL('./assets/abilities/', import.meta.url);
// Painted icons replace the vector ones one by one as scripts/integrar_arte.py brings them in.
export const abilityArt = id => new URL(id + (PINTADOS.includes(id) ? '.webp' : '.svg'), art).href;

export const ACTIONS = [
 {id: 'pass', key: 'Q', name: 'Pasar', detail: 'Pasa la pelota al compañero más cercano.'},
 {id: 'catch', key: 'E', name: 'Atrapar', detail: 'Atrapa al vuelo un tiro rival.'},
 {id: 'dash', key: 'SHIFT', name: 'Esquivar', detail: 'Esquiva rápida: la pelota no te toca.'},
 {id: 'fire', key: 'ESPACIO', name: 'Lanzar', detail: 'Lanza hacia donde apuntas.'},
];
export const ULT_KEY = 'F';

export const ultArt = character => abilityArt((HEROES[character] || HEROES[0]).ult.art);

// Whether the hero's ultimate is happening right now.
function ultActive(id, me, game) {
 const ball = game.ball;
 if (id === 'arenga') return me.turbo > 0;
 if (id === 'centella') return me.flash > 0;
 if (id === 'gigante') return me.giant > 0;
 if (id === 'burbuja') return me.shield > 0;
 if (id === 'red') return game.net?.[me.team] > 0;
 if (id === 'espejismo') return !!game.decoys?.some(copy => copy.owner === me.id);
 if (id === 'iman') return ball.magnet === me.id;
 if (id === 'quietos') return game.players.some(p => p.id !== me.id && p.frozen > 0);
 if (id === 'mirada') return game.players.some(p => p.team !== me.team && p.slowed > 0);
 const shot = {teledirigida: 'homing', cometa: 'comet', bumeran: 'boomerang'}[id];
 return !!shot && ball.live && ball.kind === shot && ball.owner === me.id;
}

// wait/total: seconds left of a recharge. off: cannot be used now. active: happening now.
export function actionState(id, me, game) {
 const ball = game.ball, holding = ball.holder === me.id;
 if (id === 'fire') return {off: !holding, active: me.throwFlash > 0, hold: holding ? Math.min(1, ball.held / 5) : 0};
 if (id === 'pass') return {off: !holding};
 if (id === 'catch') return {off: holding, wait: me.catchCooldown, total: STATS.catchRecovery, active: me.catchTime > 0};
 if (id === 'dash') return me.slowed > 0 ? {wait: me.slowed, total: 10, locked: true}
  : {wait: me.dashCooldown, total: STATS.dashRecovery, active: me.dashTime > 0};
 const ult = HEROES[me.character].ult;
 const off = me.frozen > 0 || (ult.ball === 'held' && !holding) || (ult.ball === 'free' && holding)
  || (ult.id === 'fuga' && !game.players.some(p => p.team === me.team && p.prison));
 return {off, wait: me.ultCooldown, total: ult.recharge, active: ultActive(ult.id, me, game)};
}
