import test from 'node:test';
import assert from 'node:assert/strict';
import {makeGame,stepGame,setInput,imprison,rescue,throwBall,snapshot,normalizeRules,sanitizeInput,bounds} from '../mate/sim.js';
import {inputPacket,validCode,cleanProfile} from '../mate/protocol.js';
const controls=(extra={})=>({mx:0,my:0,ax:900,ay:390,fire:false,catch:false,dash:false,pass:false,...extra});

test('mate: el perfil descarta datos identificativos y sólo conserva el personaje',()=>{
 assert.deepEqual(cleanProfile({character:3,name:'PRUEBA',email:'prueba@example.test',school:'CENTRO DE PRUEBA',pupilId:'DEMO'}),{character:3});
});
function setup(rules={}) {
 const g=makeGame([{id:'a',team:0,name:'Vega'},{id:'b',team:1,name:'Kai'}],{teamSize:2,...rules});
 g.phase='playing';for(const p of g.players){p.bot=false;p.invulnerable=0;p.y=300;}g.players.find(p=>p.id==='a').x=500;g.players.find(p=>p.id==='b').x=800;
 g.players.filter(p=>!['a','b'].includes(p.id)).forEach(p=>p.y=600);
 return g;
}
function shotAt(g,target,owner,live=true){g.ball={x:target.x-20,y:target.y,vx:790,vy:0,holder:null,owner:owner.id,team:owner.team,live,age:.2,held:0,loose:0,pass:false};}

test('mate: normaliza reglas y rechaza controles no finitos o manipulados',()=>{
 assert.deepEqual(normalizeRules({teamSize:300,bestOf:-1,catchEliminates:'true'}),{teamSize:3,roundSeconds:150,bestOf:3,catchEliminates:false,catchRescues:false});
 assert.equal(sanitizeInput(controls({mx:NaN})),null);
 assert.equal(sanitizeInput(controls({ax:Infinity})),null);
 assert.equal(sanitizeInput({}),null);
 const clean=sanitizeInput(controls({mx:900,my:-900,score:100,fire:'yes'}));
 assert.equal(clean.mx,1);assert.equal(clean.my,-1);assert.equal(clean.score,undefined);assert.equal(clean.fire,false);
});
test('mate: entrada de red monotónica y códigos/perfiles acotados',()=>{
 assert.equal(inputPacket({type:'input',seq:4,input:controls()},4),null);
 assert.equal(inputPacket({type:'input',seq:3,input:controls()},4),null);
 assert.equal(inputPacket({type:'score',seq:5,input:controls()},4),null);
 assert.equal(inputPacket({type:'input',seq:5,input:controls()},4).seq,5);
 assert.equal(validCode('ABC234'),true);assert.equal(validCode('ABCIO1'),false);
 assert.deepEqual(cleanProfile({character:999,name:'<script>'}),{character:0});
});
test('mate: no se cruza la línea central ni se sale de la cárcel',()=>{
 const g=setup(),p=g.players[0];
 for(let i=0;i<240;i++){setInput(g,p.id,controls({mx:1}));stepGame(g);}
 assert.equal(p.x,bounds(p).right);
 imprison(g,p);assert.equal(p.prison,true);
 for(let i=0;i<120;i++){setInput(g,p.id,controls({mx:-1}));stepGame(g);}
 assert.ok(p.x>=1061);assert.ok(p.x<=1122);
 assert.equal(rescue(g,p),true);assert.equal(p.prison,false);assert.equal(p.x,235);
});
test('mate: un impacto en vuelo encarcela, una pelota que ha botado no',()=>{
 const g=setup(),a=g.players.find(p=>p.id==='a'),b=g.players.find(p=>p.id==='b');
 shotAt(g,b,a);stepGame(g);assert.equal(b.prison,true);
 const h=setup(),x=h.players.find(p=>p.id==='a'),y=h.players.find(p=>p.id==='b');
 shotAt(h,y,x,false);stepGame(h);assert.equal(y.prison,false);assert.equal(h.ball.holder,y.id);
});
test('mate: una recepción a tiempo salva y da posesión sin eliminar al lanzador por defecto',()=>{
 const g=setup(),a=g.players.find(p=>p.id==='a'),b=g.players.find(p=>p.id==='b');
 shotAt(g,b,a);setInput(g,b.id,controls({catch:true}));stepGame(g);
 assert.equal(b.prison,false);assert.equal(a.prison,false);assert.equal(g.ball.holder,b.id);assert.equal(g.ball.live,false);
 assert.ok(b.catchCooldown>0);assert.equal(b.catchTime,0);
});
test('mate: la ventana de recepción termina y no se puede renovar durante la recarga',()=>{
 const g=setup(),b=g.players.find(p=>p.id==='b');g.ball.holder=g.players.find(p=>p.id==='a').id;
 setInput(g,b.id,controls({catch:true}));stepGame(g);
 for(let i=0;i<25;i++){setInput(g,b.id,controls({catch:true}));stepGame(g);}
 assert.equal(b.catchTime,0);assert.ok(b.catchCooldown>0);
});
test('mate: la esquiva evita un impacto y tiene recarga',()=>{
 const g=setup(),a=g.players.find(p=>p.id==='a'),b=g.players.find(p=>p.id==='b');
 shotAt(g,b,a);setInput(g,b.id,controls({dash:true,my:1}));stepGame(g);
 assert.equal(b.prison,false);assert.ok(b.dashTime>0);assert.ok(b.dashCooldown>1);
 const first=b.dashCooldown;setInput(g,b.id,controls({dash:true}));stepGame(g);assert.ok(b.dashCooldown<first);
});
test('mate: un preso que alcanza a un rival vuelve a su campo',()=>{
 const g=setup(),a=g.players.find(p=>p.id==='a'),b=g.players.find(p=>p.id==='b');
 imprison(g,a);g.ball={x:b.x+20,y:b.y,vx:-790,vy:0,holder:null,owner:a.id,team:0,live:true,age:.3,held:0,loose:0,pass:false};
 stepGame(g);assert.equal(b.prison,true);assert.equal(a.prison,false);assert.ok(a.invulnerable>0);
});
test('mate: variantes opcionales de captura eliminan y rescatan sólo al activarlas',()=>{
 const g=setup({catchEliminates:true,catchRescues:true}),a=g.players.find(p=>p.id==='a'),b=g.players.find(p=>p.id==='b'),prisoner=g.players.find(p=>p.team===1&&p.id!==b.id);
 imprison(g,prisoner);shotAt(g,b,a);setInput(g,b.id,controls({catch:true}));stepGame(g);
 assert.equal(a.prison,true);assert.equal(prisoner.prison,false);assert.equal(g.ball.holder,b.id);
});
test('mate: no hay fuego amigo y el pase viaja sin eliminar',()=>{
 const g=setup(),a=g.players.find(p=>p.id==='a'),ally=g.players.find(p=>p.team===0&&p.id!==a.id);
 g.ball.holder=a.id;assert.equal(throwBall(g,a,{x:900,y:300},true),true);assert.equal(g.ball.live,false);assert.equal(g.ball.pass,true);
 g.ball={x:ally.x-15,y:ally.y,vx:790,vy:0,holder:null,owner:a.id,team:0,live:true,age:.3,held:0,loose:0,pass:false};stepGame(g);assert.equal(ally.prison,false);
});
test('mate: matar al último jugador termina la ronda y el partido de una victoria',()=>{
 const g=setup({teamSize:1,bestOf:1}),a=g.players.find(p=>p.id==='a'),b=g.players.find(p=>p.id==='b');
 shotAt(g,b,a);stepGame(g);assert.equal(g.phase,'roundOver');assert.deepEqual(g.scores,[1,0]);
 for(let i=0;i<220;i++)stepGame(g);assert.equal(g.phase,'matchOver');assert.equal(g.winner,0);
});
test('mate: pausa congela la ronda, el tiempo y los movimientos',()=>{
 const g=setup(),before=snapshot(g);g.paused=true;
 for(let i=0;i<90;i++){setInput(g,'a',controls({mx:1,fire:true}));stepGame(g);}
 assert.equal(g.time,before.time);assert.equal(g.roundLeft,before.roundLeft);assert.equal(g.players[0].x,before.players[0].x);assert.equal(g.ball.holder,before.ball.holder);
});
test('mate: un empate temporal no inventa una victoria',()=>{
 const g=setup({bestOf:1});g.roundLeft=.001;stepGame(g);assert.equal(g.roundWinner,null);assert.deepEqual(g.scores,[0,0]);
});
test('mate: controles caducados paran al jugador y las instantáneas excluyen entradas privadas',()=>{
 const g=setup();setInput(g,'a',controls({my:1}));for(let i=0;i<60;i++)stepGame(g);
 const p=g.players.find(p=>p.id==='a');assert.equal(p.vy,0);assert.equal(snapshot(g).players[0].input,undefined);assert.equal(snapshot(g).seed,undefined);
});
test('mate: la IA completa partidas sin atascar la pelota y mantiene límites del campo',()=>{
 for(const seed of [123,2500,9059]){
  const g=makeGame([],{teamSize:3,bestOf:1,roundSeconds:60},seed);
  for(let i=0;i<22000&&g.phase!=='matchOver';i++)stepGame(g);
  assert.equal(g.phase,'matchOver');assert.ok(g.events.some(e=>e.type==='match'));
  for(const p of g.players){const area=bounds(p);assert.ok(p.x>=area.left&&p.x<=area.right);assert.ok(p.y>=area.top&&p.y<=area.bottom);}
 }
});

test('mate: el relevo MQTT conserva tramas concatenadas y parciales',async()=>{
 const {mqttPacket,parseMqtt}=await import('../mate/relay.js');
 const first=mqttPacket(0x30,new Uint8Array([0,3,97,98,99,123,125]));
 const second=mqttPacket(0xc0);
 const joined=new Uint8Array(first.length+second.length);joined.set(first);joined.set(second,first.length);
 const result=parseMqtt(joined);assert.equal(result.packets.length,2);assert.equal(result.packets[0].type,0x30);assert.equal(result.rest.length,0);
 const partial=parseMqtt(first.slice(0,4));assert.equal(partial.packets.length,0);assert.equal(partial.rest.length,4);
 const repaired=new Uint8Array(first.length);repaired.set(partial.rest);repaired.set(first.slice(4),4);assert.equal(parseMqtt(repaired).packets.length,1);
 assert.throws(()=>parseMqtt(new Uint8Array([0x30,255,255,255,255,255])));
});

test('mate: la posesión caduca para impedir retener la pelota indefinidamente',()=>{
 const g=setup(),a=g.players.find(p=>p.id==='a');g.ball.holder=a.id;g.ball.held=5;stepGame(g);assert.equal(g.ball.holder,null);assert.equal(g.ball.live,false);assert.ok(g.events.some(e=>e.type==='release'));
});

test('mate: un invitado no inicia ni pausa la sala y sólo controla su propia plaza',async()=>{
 const {Room}=await import('../mate/network.js');
 const {EventEmitter}=await import('node:events');
 class Connection extends EventEmitter{constructor(){super();this.open=true;this.sent=[];}send(data){this.sent.push(structuredClone(data));}close(){this.open=false;this.emit('close');}}
 const calls=[],room=new Room({onInput:(id,input)=>calls.push({id,input})});
 room.isHost=true;room.code='ABC234';room.myId='host';room.rules=normalizeRules({teamSize:1});room.members.set('host',{id:'host',team:0,character:0,name:'Vega',host:true,connected:true,ready:true});
 const conn=new Connection(),clientId='12345678-1234-4123-8123-123456789abc';room.acceptConnection(conn);
 conn.emit('data',{type:'hello',v:1,clientId,profile:{character:3}});
 assert.equal(room.members.size,2);assert.ok(conn.sent.some(m=>m.type==='welcome'));
 const lobby=conn.sent.find(m=>m.type==='lobby');assert.ok(lobby.members.every(m=>m.resumeToken===undefined));
 conn.emit('data',{type:'start'});conn.emit('data',{type:'pause',paused:true});assert.equal(room.started,false);
 assert.equal(room.start(),false); // The guest has not marked ready.
 conn.emit('data',{type:'ready',ready:true});assert.equal(room.start(),true);
 conn.emit('data',{type:'input',seq:1,playerId:'host',input:controls({mx:1})});
 conn.emit('data',{type:'input',seq:1,input:controls({mx:-1})});
 assert.equal(calls.length,1);assert.equal(calls[0].id,'c-'+clientId);assert.equal(calls[0].input.mx,1);
 room.close();
});
