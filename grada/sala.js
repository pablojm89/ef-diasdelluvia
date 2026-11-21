// One watched room: joins as a spectator, keeps the latest snapshots and reconnects on its own.
// No DOM here, so the state machine can be tested in Node with a fake Room.
import {Room} from '../mate/network.js';
import {validCode} from '../mate/protocol.js';

export const MAX_ROOMS = 4;
const RETRY_MS = [2000, 4000, 8000, 15000];
// Without snapshots for this long during a running, unpaused match the link is treated as lost.
export const STALL_MS = 7000;

// Codes from '#sala=ABC234,DEF567', '?sala=ABC234' or free text. Unique, valid, at most four.
export function parseCodes(text = '') {
 const found = String(text).toUpperCase().match(/[A-Z0-9]{6}/g) || [];
 return [...new Set(found.filter(validCode))].slice(0, MAX_ROOMS);
}

export function codesFromLocation(loc) {
 const hash = new URLSearchParams(String(loc.hash || '').replace(/^#/, '')).get('sala') || '';
 const query = new URLSearchParams(loc.search || '').get('sala') || '';
 return parseCodes(hash + ',' + query);
}

/* status:
   searching  looking for the room for the first time
   lobby      connected, players are in the changing room
   playing    match running (also before the first snapshot arrives)
   paused     the host paused the match
   over       final whistle, results are shown
   lost       the link dropped; `retryAt` says when the next attempt starts */
export class RoomWatch {
 constructor(code, {createRoom = cb => new Room(cb), onChange = () => {}, clientId = null, saveClientId = () => {}, now = () => performance.now(), timers = globalThis} = {}) {
  this.code = code;
  this.createRoom = createRoom;
  this.onChange = onChange;
  this.clientId = clientId;
  this.saveClientId = saveClientId;
  this.now = now;
  this.timers = timers;
  this.status = 'searching';
  this.message = '';
  this.lobby = null;
  this.state = null;
  this.previous = null;
  this.stateAt = 0;
  this.attempts = 0;
  this.retryAt = 0;
  this.room = null;
  this.retryTimer = null;
  this.stopped = false;
  this.everConnected = false;
 }

 set(status, message = this.message) {
  const changed = status !== this.status || message !== this.message;
  this.status = status;
  this.message = message;
  if (changed) this.onChange(this);
 }

 async connect() {
  if (this.stopped) return;
  this.room?.close();
  const room = this.createRoom(this.callbacks());
  this.room = room;
  this.state = this.previous = null;
  if (this.status !== 'lost') this.set('searching', '');
  try {
   await room.watch(this.code, {clientId: this.clientId});
   if (room !== this.room || this.stopped) return;
   this.attempts = 0;
   this.everConnected = true;
  } catch (error) {
   if (room !== this.room || this.stopped) return;
   room.close();
   this.lose(error?.message || 'No se ha podido conectar con esa sala.');
  }
 }

 callbacks() {
  // Late events from a room that was already replaced are ignored.
  const mine = fn => (...args) => { if (!this.stopped && this.room?.cb === current) fn(...args); };
  const current = {
   onWelcome: data => {
    if (data.clientId && data.clientId !== this.clientId) { this.clientId = data.clientId; this.saveClientId(data.clientId); }
    if (!data.started) this.set('lobby', '');
   },
   onLobby: data => {
    this.lobby = data;
    if (!data.started) { this.state = this.previous = null; this.set('lobby', ''); }
   },
   onStart: () => { this.state = this.previous = null; this.stateAt = this.now(); this.set('playing', ''); },
   onState: state => {
    this.previous = this.state;
    this.state = state;
    this.stateAt = this.now();
    this.set(state.phase === 'matchOver' ? 'over' : state.paused ? 'paused' : 'playing', '');
   },
   onDisconnect: message => this.lose(message),
   onError: message => { this.message = String(message || ''); },
  };
  for (const key of Object.keys(current)) current[key] = mine(current[key]);
  return current;
 }

 lose(message) {
  if (this.stopped) return;
  this.room?.close();
  this.room = null;
  const wait = RETRY_MS[Math.min(this.attempts, RETRY_MS.length - 1)];
  this.attempts++;
  this.retryAt = this.now() + wait;
  this.set('lost', message);
  this.timers.clearTimeout(this.retryTimer);
  this.retryTimer = this.timers.setTimeout(() => this.connect(), wait);
 }

 // Called every frame: a silent host during a live match means the link is gone.
 check() {
  if (this.stopped || !this.room) return;
  const live = (this.status === 'playing' || this.status === 'over') && !this.state?.paused;
  if (live && this.now() - this.stateAt > STALL_MS) this.lose('La sala ha dejado de enviar el partido.');
 }

 stop() {
  this.stopped = true;
  this.timers.clearTimeout(this.retryTimer);
  this.room?.close();
  this.room = null;
 }
}
