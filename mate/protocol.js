import {sanitizeInput} from './sim.js';
import {validCharacter} from './selection.js';
// 3 added the spectator role. 4 replaces the shared abilities with one ultimate per hero: its controls and state differ.
export const PROTOCOL=4;
export const validCode=code=>typeof code==='string'&&/^[A-HJ-NP-Z2-9]{6}$/.test(code);
export const validToken=value=>typeof value==='string'&&/^[a-zA-Z0-9-]{20,80}$/.test(value);
export const isSpectatorHello=raw=>raw?.type==='hello'&&raw.role==='spectator';
export function cleanProfile(raw={}) {
 return {character:validCharacter(raw?.character)?raw.character:0};
}
export function inputPacket(raw,lastSeq=-1) {
 if(raw?.type!=='input'||!Number.isSafeInteger(raw.seq)||raw.seq<=lastSeq||raw.seq>1e9)return null;
 const input=sanitizeInput(raw.input);return input?{seq:raw.seq,input}:null;
}
export function isSnapshot(raw) {
 return raw?.v===1&&Number.isSafeInteger(raw.tick)&&Array.isArray(raw.players)&&raw.players.length<=26&&['playing','countdown','roundOver','matchOver'].includes(raw.phase)&&raw.ball&&typeof raw.ball.x==='number'&&Number.isFinite(raw.ball.x);
}
