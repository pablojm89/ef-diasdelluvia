import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Room} from '../mate/network.js';
import {PROTOCOL,cleanProfile} from '../mate/protocol.js';
import {makeGame,normalizeRules} from '../mate/sim.js';
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
