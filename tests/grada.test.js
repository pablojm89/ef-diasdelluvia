// La Grada: a real client Room in spectator mode against a real host Room, joined by an in-memory PeerJS double.
import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Room} from '../mate/network.js';
import {NETWORK_CONFIG} from '../mate/config.js';
import {makeGame, normalizeRules, snapshot} from '../mate/sim.js';
import {HEROES} from '../mate/roster.js';
import {RoomWatch, parseCodes, codesFromLocation, STALL_MS} from '../grada/sala.js';

const hosts = new Map();
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

class Pipe extends EventEmitter {
 open = false;
 transport = 'direct';
 send(data) {
  if (!this.open) return;
  const other = this.other, copy = structuredClone(data);
  queueMicrotask(() => { if (other.open) other.emit('data', copy); });
 }
 close() {
  if (!this.open) return;
  this.open = false;
  this.emit('close');
  this.other.close();
 }
}

class FakePeer extends EventEmitter {
 pipes = [];
 destroyed = false;
 disconnected = false;
 constructor() { super(); queueMicrotask(() => this.emit('open', 'peer-' + crypto.randomUUID())); }
 connect(target) {
  const mine = new Pipe(), theirs = new Pipe();
  mine.other = theirs; theirs.other = mine;
  this.pipes.push(mine);
  queueMicrotask(() => {
   const host = hosts.get(target);
   if (!host || host.closed) { mine.emit('error', new Error('peer-unavailable')); return; }
   mine.open = theirs.open = true;
   host.acceptConnection(theirs);
   mine.emit('open');
  });
  return mine;
 }
 destroy() { this.destroyed = true; for (const pipe of this.pipes) pipe.close(); }
}
globalThis.window = {Peer: FakePeer};

function openHost(t, code, size = 2) {
 const room = new Room();
 Object.assign(room, {isHost: true, myId: NETWORK_CONFIG.roomPrefix + code, code, rules: normalizeRules({teamSize: size})});
 room.members.set(room.myId, {id: room.myId, name: HEROES[12].name, team: 0, character: 12, connected: true, ready: true, host: true});
 hosts.set(room.myId, room);
 t.after(() => room.close());
 return room;
}

function recorder() {
 const log = {welcome: [], lobby: [], start: [], state: [], disconnect: []};
 const cb = {
  onWelcome: d => log.welcome.push(d), onLobby: d => log.lobby.push(d), onStart: d => log.start.push(d),
  onState: s => log.state.push(s), onDisconnect: m => log.disconnect.push(m), onError: () => {},
 };
 return {log, cb};
}

test('el código de sala llega en la dirección o en un texto: únicos, válidos y como mucho cuatro', () => {
 assert.deepEqual(parseCodes('abc234, ABC234 k7m2pq  xx  IOO000'), ['ABC234', 'K7M2PQ']);
 assert.deepEqual(parseCodes('ABC234 BCD345 CDE456 DEF567 EFG678'), ['ABC234', 'BCD345', 'CDE456', 'DEF567']);
 assert.deepEqual(codesFromLocation({hash: '#sala=ABC234,K7M2PQ', search: ''}), ['ABC234', 'K7M2PQ']);
 assert.deepEqual(codesFromLocation({hash: '', search: '?sala=k7m2pq'}), ['K7M2PQ']);
 assert.deepEqual(codesFromLocation({hash: '', search: ''}), []);
});

test('un cliente espectador recibe el vestuario, el comienzo y las instantáneas sin ocupar plaza', async t => {
 const host = openHost(t, 'ABC234');
 const {log, cb} = recorder();
 const screen = new Room(cb);
 t.after(() => screen.close());
 await screen.watch('ABC234');
 assert.equal(log.welcome[0].role, 'spectator');
 assert.equal(screen.myId.startsWith('s-'), true);
 await tick();
 assert.ok(log.lobby.length >= 1);
 assert.equal(log.lobby.at(-1).spectators, 1);
 assert.equal(host.publicRoster().length, 1);
 assert.equal(host.spectators.size, 1);
 screen.input({mx: 1, my: 0, ax: 0, ay: 0, fire: true}); // A spectator Room never sends controls.
 screen.ready(true);
 await tick();
 assert.equal(host.members.size, 1);
 assert.equal(host.start(), true);
 await tick();
 assert.equal(log.start.length, 1);
 const game = makeGame(host.publicRoster(), host.rules);
 for (let i = 0; i < 3; i++) { game.tick++; host.broadcastState(snapshot(game)); }
 await tick();
 assert.deepEqual(log.state.map(s => s.tick), [1, 2, 3]);
 host.close();
 await tick();
 assert.equal(log.disconnect.length, 1);
});

test('el espectador que llega con la partida empezada la ve en cuanto entra', async t => {
 const host = openHost(t, 'BCD345', 1);
 host.start();
 const {log, cb} = recorder();
 const screen = new Room(cb);
 t.after(() => screen.close());
 await screen.watch('BCD345');
 await tick();
 assert.equal(log.start.length, 1);
 assert.equal(screen.matchId, host.matchId);
 const game = makeGame(host.publicRoster(), host.rules);
 game.tick = 40;
 host.broadcastState(snapshot(game));
 await tick();
 assert.equal(log.state.at(-1).tick, 40);
});

test('la grada pasa por vestuario, juego, pausa y final, y vuelve sola si se pierde la sala', async t => {
 let now = 0;
 const pending = [];
 const timers = {setTimeout: (fn, ms) => { pending.push({fn, ms}); return pending.length; }, clearTimeout: () => {}};
 let host = openHost(t, 'CDE456');
 const seen = [];
 let saved = null;
 const watch = new RoomWatch('CDE456', {now: () => now, timers, saveClientId: id => { saved = id; }, onChange: w => seen.push(w.status)});
 t.after(() => watch.stop());
 await watch.connect();
 await tick();
 assert.equal(watch.status, 'lobby');
 assert.ok(saved);
 host.start();
 await tick();
 assert.equal(watch.status, 'playing');
 const game = makeGame(host.publicRoster(), host.rules);
 game.tick = 1; host.broadcastState(snapshot(game));
 await tick();
 assert.equal(watch.state.tick, 1);
 game.tick = 2; game.paused = true; host.broadcastState(snapshot(game));
 await tick();
 assert.equal(watch.status, 'paused');
 now += STALL_MS * 2;
 watch.check();
 assert.equal(watch.status, 'paused', 'A paused match may stay silent');
 game.tick = 3; game.paused = false; game.phase = 'matchOver'; game.winner = 0; host.broadcastState(snapshot(game));
 await tick();
 assert.equal(watch.status, 'over');
 host.returnToLobby();
 await tick();
 assert.equal(watch.status, 'lobby');
 assert.equal(watch.state, null);
 host.close();
 await tick();
 assert.equal(watch.status, 'lost');
 assert.equal(pending.length, 1);
 // The room opens again with the same code: the retry finds it and keeps the same spectator id.
 host = openHost(t, 'CDE456');
 await pending.shift().fn();
 await tick();
 assert.equal(watch.status, 'lobby');
 assert.equal([...host.spectators.keys()][0], 's-' + saved);
 assert.deepEqual(seen, ['lobby', 'playing', 'paused', 'over', 'lobby', 'lost', 'lobby']);
});

test('una sala que deja de enviar el partido se da por perdida y se reintenta', async t => {
 let now = 0;
 const pending = [];
 const timers = {setTimeout: (fn, ms) => { pending.push({fn, ms}); return pending.length; }, clearTimeout: () => {}};
 const host = openHost(t, 'DEF567');
 host.start();
 const watch = new RoomWatch('DEF567', {now: () => now, timers});
 t.after(() => watch.stop());
 await watch.connect();
 await tick();
 assert.equal(watch.status, 'playing');
 now += STALL_MS + 1;
 watch.check();
 assert.equal(watch.status, 'lost');
 assert.equal(pending.length, 1);
 await pending.shift().fn();
 await tick();
 assert.equal(watch.status, 'playing');
 assert.equal(host.spectators.size, 1);
});

test('una sala que no existe deja la grada en «conexión perdida» con reintentos cada vez más espaciados', async t => {
 const pending = [];
 const timers = {setTimeout: (fn, ms) => { pending.push({fn, ms}); return pending.length; }, clearTimeout: () => {}};
 const saved = NETWORK_CONFIG.connectTimeoutMs;
 NETWORK_CONFIG.connectTimeoutMs = 30;
 t.after(() => { NETWORK_CONFIG.connectTimeoutMs = saved; });
 const watch = new RoomWatch('EFG678', {timers});
 t.after(() => watch.stop());
 window.MATE_FORCE_RELAY = false;
 // No host and no relay in Node: the direct attempt fails, the relay cannot open a WebSocket.
 globalThis.WebSocket = class { static OPEN = 1; readyState = 3; constructor() { setTimeout(() => this.onerror?.(), 0); } send() {} close() {} };
 t.after(() => { delete globalThis.WebSocket; });
 await watch.connect();
 assert.equal(watch.status, 'lost');
 assert.ok(watch.message.length > 0);
 await pending.shift().fn();
 assert.equal(watch.status, 'lost');
 assert.deepEqual(pending.map(p => p.ms), [4000]);
});
