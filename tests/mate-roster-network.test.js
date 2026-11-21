import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Room} from '../mate/network.js';
import {PROTOCOL,cleanProfile,isSnapshot} from '../mate/protocol.js';
import {makeGame,normalizeRules,snapshot} from '../mate/sim.js';
import {NETWORK_CONFIG} from '../mate/config.js';
import {HEROES} from '../mate/roster.js';

class Link extends EventEmitter {
 open=true;
 sent=[];
 send(data){this.sent.push(structuredClone(data));}
 close(){this.open=false;this.emit('close');}
 request(data){this.emit('data',data);}
}

function host(t,size=13) {
 const room=new Room();
 room.isHost=true;
 room.myId='host';
 room.rules=normalizeRules({teamSize:size});
 room.members.set('host',{id:'host',name:HEROES[12].name,team:0,character:12,connected:true,ready:true,host:true});
 t.after(()=>room.close());
 return room;
}

function join(room,id,character=12,resumeToken) {
 const link=new Link();
 room.acceptConnection(link);
 link.request({type:'hello',v:PROTOCOL,clientId:id,profile:{character},resumeToken});
 return link;
}

function verifyDistinct(players,size) {
 for(const team of [0,1]) {
  const members=players.filter(p=>p.team===team);
  assert.equal(members.length,size);
  assert.equal(new Set(members.map(p=>p.character)).size,size);
  for(const p of members)assert.equal(p.name,HEROES[p.character].name);
 }
}

test('26 elecciones idénticas y simultáneas dan exactamente un ejemplar de cada héroe por equipo',async t=>{
 const room=host(t);
 const ids=Array.from({length:25},()=>crypto.randomUUID());
 const links=await Promise.all(ids.map(async id=>join(room,id)));
 verifyDistinct(room.publicRoster(),13);
 assert.equal(room.members.get('c-'+ids[0]).character,12); // Mismo héroe en el equipo contrario.
 assert.equal(links[1].sent.some(d=>d.type==='notice'),true);
 const full=join(room,crypto.randomUUID());
 assert.equal(full.sent.at(-1).type,'rejected');
 for(const link of links)link.request({type:'ready',ready:true});
 assert.equal(room.start(),true);
 const members=room.publicRoster();
 verifyDistinct(makeGame(members,{teamSize:13}).players,13);
 const id='c-'+ids[1],saved=room.members.get(id);
 const resumeToken=links[1].sent.find(d=>d.type==='welcome').resumeToken;
 links[1].close();
 const next=join(room,ids[1],9,resumeToken);
 assert.equal(next.sent.some(d=>d.type==='start'&&d.reconnecting),true);
 assert.equal(room.members.get(id),saved);
 verifyDistinct(room.publicRoster(),13);
});

test('el anfitrión resuelve dos peticiones del mismo héroe y restaura la elección tras reconectar',async t=>{
 const room=host(t,4);
 const a=crypto.randomUUID(),b=crypto.randomUUID(),c=crypto.randomUUID();
 const first=join(room,a,5);
 join(room,b,8);
 const second=join(room,c,2);
 await Promise.all([first,second].map(async link=>link.request({type:'profile',profile:{character:9}})));
 assert.equal(room.members.get('c-'+a).character,9);
 assert.equal(room.members.get('c-'+c).character,2);
 assert.equal(second.sent.some(d=>d.type==='notice'),true);
 const resumeToken=first.sent.find(d=>d.type==='welcome').resumeToken;
 const replacement=join(room,a,1,resumeToken);
 assert.equal(first.open,false);
 assert.equal(room.members.get('c-'+a).character,9);
 replacement.close();
 const reopened=join(room,a,1,resumeToken);
 assert.equal(room.members.get('c-'+a).character,9);
 assert.equal(room.members.get('c-'+a).team,1);
 reopened.request({type:'profile',profile:{character:12}});
 reopened.request({type:'team',team:0});
 assert.equal(room.members.get('c-'+a).team,0);
 assert.notEqual(room.members.get('c-'+a).character,12);
 assert.equal(reopened.sent.some(d=>d.type==='notice'),true);
 assert.equal(room.members.get('host').character,12);
 assert.ok(room.publicRoster().every(m=>!('resumeToken' in m)));
});

test('entrenamiento y entradas antiguas conservan las elecciones válidas y cubren las plazas con IA distinta',()=>{
 const players=makeGame([{id:'p',team:0,character:12},{id:'q',team:0,character:12},{id:'r',team:0,character:1},{id:'s',team:1,character:12}],{teamSize:13}).players;
 verifyDistinct(players,13);
 assert.equal(players.find(p=>p.id==='p').character,12);
 assert.equal(players.find(p=>p.id==='r').character,1);
 assert.equal(players.find(p=>p.id==='s').character,12);
 assert.deepEqual(cleanProfile({character:12}),{character:12});
 assert.deepEqual(cleanProfile({character:13}),{character:0});
 assert.deepEqual(cleanProfile(null),{character:0});
});

// La Grada: a spectator watches a room without a seat and without controls.
function watch(room,id=crypto.randomUUID()) {
 const link=new Link();
 room.acceptConnection(link);
 link.request({type:'hello',v:PROTOCOL,clientId:id,role:'spectator'});
 return link;
}

test('un espectador no ocupa plaza, no cuenta para «todos listos» y sus controles se descartan',t=>{
 const room=host(t,1),inputs=[];
 room.cb={onInput:id=>inputs.push(id)};
 const guest=join(room,crypto.randomUUID(),3);
 const screen=watch(room);
 const welcome=screen.sent.find(d=>d.type==='welcome');
 assert.equal(welcome.role,'spectator');
 assert.equal('resumeToken' in welcome,false);
 assert.equal(room.publicRoster().length,2);
 assert.ok(room.publicRoster().every(m=>!m.id.startsWith('s-')));
 assert.equal(room.lobbyPacket().spectators,1);
 assert.equal(join(room,crypto.randomUUID()).sent.at(-1).type,'rejected'); // 1 contra 1: no quedan plazas de jugador.
 screen.request({type:'ready',ready:false});
 screen.request({type:'team',team:1});
 screen.request({type:'profile',profile:{character:4}});
 guest.request({type:'ready',ready:true});
 assert.equal(room.start(),true);
 assert.equal(screen.sent.some(d=>d.type==='start'),true);
 screen.request({type:'input',seq:1,input:{mx:1,my:0,ax:0,ay:0,fire:true}});
 guest.request({type:'input',seq:1,input:{mx:1,my:0,ax:0,ay:0}});
 assert.deepEqual(inputs,[room.publicRoster().find(m=>!m.host).id]);
 assert.equal(room.publicRoster().length,2);
 room.broadcastState(snapshot(makeGame(room.publicRoster(),room.rules)));
 const received=screen.sent.filter(d=>d.type==='state');
 assert.equal(received.length,1);
 assert.equal(received[0].matchId,room.matchId);
 assert.equal(isSnapshot(received[0].state),true);
});

test('un espectador entra con la partida empezada, se reconecta con su identificador y libera su sitio al irse',t=>{
 const room=host(t,2);
 const guest=join(room,crypto.randomUUID());
 guest.request({type:'ready',ready:true});
 room.start();
 const id=crypto.randomUUID(),first=watch(room,id);
 const welcome=first.sent.find(d=>d.type==='welcome');
 assert.equal(welcome.started,true);
 assert.equal(welcome.matchId,room.matchId);
 assert.equal(first.sent.some(d=>d.type==='start'&&d.reconnecting&&d.matchId===room.matchId),true);
 const second=watch(room,id);
 assert.equal(first.open,false);
 assert.equal(room.spectators.size,1);
 assert.equal(second.sent.some(d=>d.type==='start'&&d.reconnecting),true);
 second.request({type:'ping',at:5,lobbyRevision:-1});
 assert.equal(second.sent.some(d=>d.type==='pong'&&d.at===5),true);
 second.close();
 assert.equal(room.spectators.size,0);
 assert.equal(room.lobbyPacket().spectators,0);
 assert.equal(room.publicRoster().length,2);
 assert.ok(room.publicRoster().every(m=>m.connected));
 room.returnToLobby();
 const later=watch(room);
 assert.equal(later.sent.find(d=>d.type==='welcome').started,false);
 assert.equal(later.sent.some(d=>d.type==='lobby'&&d.started===false),true);
});

test('una sala llena de jugadores sigue admitiendo espectadores hasta su límite',t=>{
 const room=host(t,13);
 const links=Array.from({length:25},()=>join(room,crypto.randomUUID()));
 assert.equal(room.publicRoster().length,26);
 assert.equal(join(room,crypto.randomUUID()).sent.at(-1).type,'rejected');
 const screens=Array.from({length:NETWORK_CONFIG.maxSpectators},()=>watch(room));
 assert.ok(screens.every(s=>s.sent.some(d=>d.type==='welcome')));
 const extra=watch(room);
 assert.equal(extra.sent.at(-1).type,'rejected');
 assert.equal(extra.sent.some(d=>d.type==='welcome'),false);
 assert.equal(room.spectators.size,NETWORK_CONFIG.maxSpectators);
 for(const link of links)link.request({type:'ready',ready:true});
 assert.equal(room.start(),true);
 assert.equal(room.publicRoster().length,26);
});

test('un saludo de espectador de otra versión se rechaza sin darle plaza',t=>{
 const room=host(t,3);
 const link=new Link();
 room.acceptConnection(link);
 link.request({type:'hello',v:PROTOCOL-1,clientId:crypto.randomUUID(),role:'spectator'});
 assert.equal(link.sent.at(-1).type,'rejected');
 assert.equal(room.spectators.size,0);
 assert.equal(room.publicRoster().length,1);
});
