// What the player can do, in the order of the ability bar, and the picture of each ability.
import {HEROES} from './roster.js';

const art = new URL('./assets/abilities/', import.meta.url);
// Change to 'webp' once the painted icons described in docs/arte/peticiones-imagenes.md are in place.
const ART_FORMAT = 'svg';
export const abilityArt = id => new URL(id + '.' + ART_FORMAT, art).href;

export const ACTIONS = [
 {id: 'pass', key: 'Q', name: 'Pasar', detail: 'Pasa la pelota al compañero más cercano.'},
 {id: 'catch', key: 'E', name: 'Atrapar', detail: 'Atrapa al vuelo un tiro rival.'},
 {id: 'dash', key: 'SHIFT', name: 'Esquivar', detail: 'Esquiva rápida: la pelota no te toca.'},
 {id: 'fire', key: 'ESPACIO', name: 'Lanzar', detail: 'Lanza hacia donde apuntas.'},
 {id: 'special', key: 'F', name: 'Imparable', detail: 'Tiro que nadie puede atrapar. Recarga de 60 s.'},
 {id: 'gaze', key: 'G', name: 'Mirada', detail: 'Ralentiza al rival y bloquea su esquiva 10 s. Recarga de 60 s.'},
];

// One icon per hero talent, in roster order.
export const TALENT_ART = ['pase-expres', 'iman', 'lectura', 'zancada', 'tirachinas', 'guante', 'cometa',
 'finta', 'manos', 'avance', 'contraataque', 'relevo', 'salida'];
export const talentArt = character => abilityArt(TALENT_ART[character] || TALENT_ART[0]);

// wait/total: seconds left of a recharge. off: cannot be used now. active: happening now.
export function actionState(id, me, ball) {
 const stats = HEROES[me.character].stats, holding = ball.holder === me.id;
 if (id === 'fire') return {off: !holding, active: me.throwFlash > 0, hold: holding ? Math.min(1, ball.held / 5) : 0};
 if (id === 'pass') return {off: !holding};
 if (id === 'catch') return {off: holding, wait: me.catchCooldown, total: stats.catchRecovery, active: me.catchTime > 0};
 if (id === 'dash') return me.slowed > 0 ? {wait: me.slowed, total: 10, locked: true}
  : {wait: me.dashCooldown, total: stats.dashRecovery, active: me.dashTime > 0};
 if (id === 'special') return {off: !holding, wait: me.specialCooldown, total: 60, active: ball.live && ball.special && ball.owner === me.id};
 return {wait: me.gazeCooldown, total: 60};
}
