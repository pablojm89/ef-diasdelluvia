import {sanitizeInput} from './sim.js';
export const PROTOCOL=1;
export const validCode=code=>typeof code==='string'&&/^[A-HJ-NP-Z2-9]{6}$/.test(code);
export const validToken=value=>typeof value==='string'&&/^[a-zA-Z0-9-]{20,80}$/.test(value);
export function cleanProfile(raw={}) {
 return {character:Number.isInteger(raw.character)&&raw.character>=0&&raw.character<8?raw.character:0};
}
export function inputPacket(raw,lastSeq=-1) {
 if(raw?.type!=='input'||!Number.isSafeInteger(raw.seq)||raw.seq<=lastSeq||raw.seq>1e9)return null;
 const input=sanitizeInput(raw.input);return input?{seq:raw.seq,input}:null;
}
export function isSnapshot(raw) {
 return raw?.v===1&&Number.isSafeInteger(raw.tick)&&Array.isArray(raw.players)&&raw.players.length<=12&&['playing','countdown','roundOver','matchOver'].includes(raw.phase)&&raw.ball&&typeof raw.ball.x==='number'&&Number.isFinite(raw.ball.x);
}
