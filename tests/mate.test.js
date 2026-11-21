import test from 'node:test';
import assert from 'node:assert/strict';
import {makeGame,stepGame,setInput,imprison,rescue,throwBall,passTarget,snapshot,normalizeRules,sanitizeInput,bounds} from '../mate/sim.js';
import {inputPacket,validCode,cleanProfile,PROTOCOL} from '../mate/protocol.js';
import {HEROES,STATS} from '../mate/roster.js';
// Hits are plain unless a test asks for the rebound, so every outcome here is repeatable.
const REBOUND=STATS.reboundChance;STATS.reboundChance=0;
const controls=(extra={})=>({mx:0,my:0,ax:900,ay:390,fire:false,catch:false,dash:false,pass:false,...extra});

test('mate: el perfil descarta datos identificativos y sólo conserva el personaje',()=>{
 assert.deepEqual(cleanProfile({character:3,name:'PRUEBA',email:'prueba@example.test',school:'CENTRO DE PRUEBA',pupilId:'DEMO'}),{character:3});
});
function setup(rules={}) {
 const g=makeGame([{id:'a',team:0,name:'Vega'},{id:'b',team:1,name:'Kai',character:1}],{teamSize:2,...rules});
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
 conn.emit('data',{type:'hello',v:PROTOCOL,clientId,profile:{character:3}});
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

// One hero of each team in the middle of their field, with a teammate each. Every ultimate starts charged.
function ultGame(character,rivalCharacter=0) {
 const g=makeGame([{id:'hero',team:0,character},{id:'ally',team:0,character:character===0?1:0},{id:'rival',team:1,character:rivalCharacter},{id:'other',team:1,character:rivalCharacter===1?2:1}],{teamSize:2});
 g.phase='playing';
 for(const p of g.players){p.bot=false;p.invulnerable=0;p.ultCooldown=0;}
 const by=id=>g.players.find(p=>p.id===id),hero=by('hero'),ally=by('ally'),rival=by('rival'),other=by('other');
 hero.x=420;hero.y=350;ally.x=220;ally.y=520;rival.x=800;rival.y=350;other.x=900;other.y=560;
 g.ball.holder=hero.id;
 return {g,hero,ally,rival,other};
}
const cast=(g,p,extra={})=>{setInput(g,p.id,controls({ult:true,...extra}));stepGame(g);};
const run=(g,steps)=>{for(let n=0;n<steps;n++)stepGame(g);};

test('definitivas: cada personaje tiene la suya, con su imagen, y empieza el partido a media carga',()=>{
 assert.equal(new Set(HEROES.map(hero=>hero.ult.id)).size,HEROES.length);
 assert.equal(HEROES.filter(hero=>hero.ult.id==='mirada').length,1);
 const g=makeGame([{id:'a',team:0,character:6}],{teamSize:1});
 assert.equal(g.players[0].ultCooldown,HEROES[6].ult.recharge/2);
 // Nothing charges during the countdown; it does once the round is being played.
 run(g,60);assert.equal(g.players[0].ultCooldown,HEROES[6].ult.recharge/2);
 g.phase='playing';run(g,60);assert.ok(g.players[0].ultCooldown<HEROES[6].ult.recharge/2);
});

test('definitivas: sin carga no se lanza, y lanzarla la gasta y lo anuncia',()=>{
 const {g,hero}=ultGame(3);
 hero.ultCooldown=5;cast(g,hero);
 assert.equal(hero.flash,0);assert.ok(!g.events.some(e=>e.type==='ult'));
 hero.ultCooldown=0;cast(g,hero);
 assert.ok(hero.flash>0);assert.ok(hero.ultCooldown>HEROES[3].ult.recharge-1);
 const event=g.events.find(e=>e.type==='ult');assert.deepEqual([event.player,event.ult,event.team],['hero','centella',0]);
 assert.equal(sanitizeInput(controls({ult:'yes'})).ult,false);
});

test('Vega: ¡A por ellos! acelera a todo el equipo y lo protege de la mirada y del pies quietos',()=>{
 const {g,hero,ally,rival,other}=ultGame(0,11);
 ally.catchCooldown=1;ally.dashCooldown=1;ally.slowed=5;
 cast(g,hero);
 assert.ok(hero.turbo>5.9&&ally.turbo>5.9);assert.equal(rival.turbo,0);
 assert.equal(ally.catchCooldown,0);assert.equal(ally.slowed,0);
 setInput(g,ally.id,controls({my:-1}));stepGame(g);
 assert.ok(Math.abs(ally.vy+225*1.45)<.001);
 cast(g,rival);assert.equal(hero.slowed,0);assert.equal(rival.ultCooldown,0); // Teo keeps his charge: nobody to slow.
 const lua=ultGame(0,2);cast(lua.g,lua.hero);cast(lua.g,lua.rival);
 assert.equal(lua.hero.frozen,0);assert.equal(lua.ally.frozen,0);assert.ok(lua.other.frozen>0);
});

test('Kai: Superimán le quita la pelota al rival que la tiene',()=>{
 const {g,hero,rival}=ultGame(1);
 g.ball.holder=rival.id;
 cast(g,hero);
 assert.equal(g.ball.holder,null);assert.equal(g.ball.magnet,hero.id);
 run(g,40);
 assert.equal(g.ball.holder,hero.id);assert.equal(g.ball.team,0);assert.equal(g.ball.magnet,null);
 // With the ball already in hand there is nothing to pull: the charge is kept.
 hero.ultCooldown=0;cast(g,hero);assert.equal(hero.ultCooldown,0);
});

test('Lúa: ¡Pies quietos! deja de estatua a todos menos a ella, compañeros incluidos',()=>{
 const {g,hero,ally,rival,other}=ultGame(2);
 rival.dashTime=.2;
 cast(g,hero);
 for(const p of [ally,rival,other])assert.ok(p.frozen>2.9,p.id);
 assert.equal(hero.frozen,0);assert.equal(rival.dashTime,0);
 const before={x:rival.x,y:rival.y};
 for(let n=0;n<30;n++){setInput(g,rival.id,controls({mx:-1,my:1,dash:true,catch:true,ult:true}));setInput(g,hero.id,controls({my:1}));stepGame(g);}
 assert.deepEqual({x:rival.x,y:rival.y},before);assert.equal(rival.catchTime,0);assert.equal(rival.ultCooldown,0);
 assert.ok(hero.y>350);
 // A statue cannot dodge or catch: the shot lands.
 hero.y=rival.y;setInput(g,hero.id,controls({fire:true,ax:rival.x,ay:rival.y}));run(g,40);
 assert.equal(rival.prison,true);
 run(g,160);assert.equal(other.frozen,0);
});

test('Neo: con Centella corre el doble, la pelota le atraviesa y sus tiros salen más rápidos',()=>{
 const {g,hero,rival}=ultGame(3);
 cast(g,hero);
 assert.equal(throwBall(g,hero,{x:900,y:350}),true);assert.ok(Math.abs(g.ball.vx-STATS.shotSpeed*1.35)<.001);
 shotAt(g,hero,rival);g.ball.vx=-790;g.ball.x=hero.x+20;
 setInput(g,hero.id,controls({my:1}));stepGame(g);
 assert.equal(hero.prison,false);assert.equal(hero.vy,450);assert.equal(hero.dodges,1);
 run(g,300);assert.equal(hero.flash,0);
});

test('Ada: la Teledirigida persigue a su objetivo, no se esquiva y sí se atrapa',()=>{
 const {g,hero,rival}=ultGame(4);
 cast(g,hero,{ax:rival.x,ay:rival.y});
 assert.equal(g.ball.kind,'homing');assert.equal(g.ball.target,rival.id);
 // The target runs away from the line of the shot and dashes when it arrives.
 for(let n=0;n<200&&!rival.prison;n++){setInput(g,rival.id,controls({my:1,dash:Math.hypot(g.ball.x-rival.x,g.ball.y-rival.y)<60}));stepGame(g);}
 assert.equal(rival.prison,true);assert.equal(rival.dodges,0);
 const again=ultGame(4);
 cast(again.g,again.hero,{ax:again.rival.x,ay:again.rival.y});
 for(let n=0;n<200&&again.g.ball.holder!==again.rival.id;n++){setInput(again.g,again.rival.id,controls({catch:Math.hypot(again.g.ball.x-again.rival.x,again.g.ball.y-again.rival.y)<60}));stepGame(again.g);}
 assert.equal(again.g.ball.holder,again.rival.id);assert.equal(again.rival.prison,false);assert.equal(again.g.ball.kind,null);
});

test('Max: las Burbujas paran un impacto a cada compañero del campo y luego estallan',()=>{
 const {g,hero,ally,rival}=ultGame(5);
 cast(g,hero);
 assert.ok(hero.shield>7.9&&ally.shield>7.9);assert.equal(rival.shield,0);
 shotAt(g,ally,rival);g.ball.vx=-790;g.ball.x=ally.x+20;stepGame(g);
 assert.equal(ally.prison,false);assert.equal(ally.shield,0);assert.equal(g.ball.live,false);assert.ok(g.events.some(e=>e.type==='pop'));
 ally.invulnerable=0;shotAt(g,ally,rival);g.ball.vx=-790;g.ball.x=ally.x+20;stepGame(g);
 assert.equal(ally.prison,true);
});

test('Nora: el Cometa imparable atraviesa una recepción y sólo se puede esquivar',()=>{
 const {g,hero,rival,other}=ultGame(6);
 rival.x=640;
 cast(g,hero,{ax:rival.x,ay:rival.y});
 assert.equal(g.ball.kind,'comet');assert.ok(g.ball.vx>STATS.shotSpeed*1.4);
 other.x=760;other.y=350;
 setInput(g,rival.id,controls({catch:true}));run(g,20);
 // It goes through the catch and through the first rival, and takes the one behind too.
 assert.equal(rival.prison,true);assert.equal(rival.catches,0);assert.equal(other.prison,true);assert.equal(hero.hits,2);
 const dodge=ultGame(6);dodge.rival.x=640;
 cast(dodge.g,dodge.hero,{ax:640,ay:350});
 for(let n=0;n<12;n++){setInput(dodge.g,dodge.rival.id,controls({my:1,dash:n===8}));stepGame(dodge.g);}
 assert.equal(dodge.rival.prison,false);
 // Without the ball the comet cannot be thrown and the charge stays.
 const empty=ultGame(6);empty.g.ball.holder=empty.rival.id;cast(empty.g,empty.hero);
 assert.equal(empty.hero.ultCooldown,0);
});

test('Leo: el Espejismo crea tres copias y la pelota que da a una copia se pierde',()=>{
 const {g,hero,rival}=ultGame(7);
 g.ball.holder=rival.id;
 cast(g,hero);
 assert.equal(g.decoys.length,3);assert.ok(g.decoys.every(copy=>copy.owner===hero.id&&copy.character===7&&copy.team===0));
 assert.equal(snapshot(g).decoys.length,3);assert.equal(snapshot(g).decoys[0].dx,undefined);
 const copy=g.decoys[0];
 g.ball={x:copy.x+20,y:copy.y,vx:-790,vy:0,holder:null,owner:rival.id,team:1,live:true,age:.3,held:0,loose:0,pass:false};
 hero.x=560;hero.y=600;stepGame(g);
 assert.equal(g.ball.live,false);assert.equal(hero.prison,false);assert.equal(hero.dodges,1);
 stepGame(g);assert.equal(g.decoys.length,2);
 run(g,430);assert.equal(g.decoys.length,0);
 for(const p of g.players){const area=bounds(p);assert.ok(p.x>=area.left&&p.x<=area.right);}
});

test('Iris: La Red devuelve las pelotas rivales en la línea central y deja pasar las propias',()=>{
 const {g,hero,rival}=ultGame(8);
 cast(g,hero);
 assert.ok(g.net[0]>4.9);assert.equal(g.net[1],0);
 g.ball={x:640,y:300,vx:-1050,vy:0,holder:null,owner:rival.id,team:1,live:true,kind:'comet',age:.3,held:0,loose:0,pass:false};
 run(g,6);
 assert.equal(g.ball.live,false);assert.ok(g.ball.x>600);assert.ok(g.events.some(e=>e.type==='net'));
 g.ball={x:560,y:200,vx:790,vy:0,holder:null,owner:hero.id,team:0,live:true,age:.3,held:0,loose:0,pass:false};
 run(g,6);assert.ok(g.ball.x>600);
 run(g,300);assert.equal(g.net[0],0);
});

test('Bruno: de Gigante atrapa lo que le toca, nada le encarcela y lanza balonazos',()=>{
 const {g,hero,rival}=ultGame(9);
 cast(g,hero);
 assert.equal(throwBall(g,hero,{x:900,y:350}),true);assert.equal(g.ball.big,true);
 shotAt(g,hero,rival);g.ball.vx=-790;g.ball.x=hero.x+30;stepGame(g);
 assert.equal(g.ball.holder,hero.id);assert.equal(hero.catches,1);assert.equal(hero.prison,false);
 g.ball={x:hero.x+30,y:hero.y,vx:-1050,vy:0,holder:null,owner:rival.id,team:1,live:true,kind:'comet',age:.3,held:0,loose:0,pass:false};
 stepGame(g);
 assert.equal(hero.prison,false);assert.equal(g.ball.live,false);assert.ok(g.events.some(e=>e.type==='clang'));
});

test('Sol: el Bumerán atraviesa al rival, da la vuelta y regresa a su mano',()=>{
 const {g,hero,rival,other}=ultGame(10);
 other.y=600;
 cast(g,hero,{ax:rival.x,ay:rival.y});
 assert.equal(g.ball.kind,'boomerang');
 let turned=false;
 for(let n=0;n<240&&g.ball.holder!==hero.id;n++){stepGame(g);turned||=g.ball.back===true;}
 assert.equal(rival.prison,true);assert.equal(turned,true);assert.equal(g.ball.holder,hero.id);assert.equal(hero.hits,1);
});

test('Teo: la Mirada frena al equipo rival diez segundos de juego y le quita la esquiva',()=>{
 const {g,hero,ally,rival,other}=ultGame(11);
 rival.dashTime=.2;
 setInput(g,hero.id,controls({ult:true}));
 setInput(g,rival.id,controls({mx:1,dash:true}));
 stepGame(g);
 assert.equal(rival.dashTime,0);assert.equal(rival.vx,112.5);
 assert.ok(hero.ultCooldown>59&&hero.ultCooldown<=60);
 assert.equal(hero.slowed,0);assert.equal(ally.slowed,0);assert.ok(rival.slowed>9.9&&other.slowed>9.9);
 g.paused=true;const remaining=rival.slowed;stepGame(g);assert.equal(rival.slowed,remaining);
 g.paused=false;
 // With every rival still slowed, casting again keeps the charge.
 hero.ultCooldown=0;cast(g,hero);assert.equal(hero.ultCooldown,0);
 run(g,601);assert.equal(rival.slowed,0);
 setInput(g,rival.id,controls({mx:1,dash:true}));stepGame(g);assert.ok(rival.dashTime>0);
});

test('Inés: ¡Fuga! devuelve al campo a todos los presos de su equipo, ella incluida',()=>{
 const {g,hero,ally,rival}=ultGame(12);
 cast(g,hero);assert.equal(hero.ultCooldown,0); // Nobody in prison: the charge is kept.
 imprison(g,ally);run(g,30);
 cast(g,hero);
 assert.equal(ally.prison,false);assert.equal(rival.prison,false);
 assert.equal(hero.rescues,1);assert.ok(ally.boostTime>0&&ally.invulnerable>1);
 assert.ok(hero.ultCooldown>59);
 // From prison she breaks out herself.
 const caged=ultGame(12);imprison(caged.g,caged.hero);run(caged.g,30);
 cast(caged.g,caged.hero);
 assert.equal(caged.hero.prison,false);assert.equal(caged.hero.rescues,1);
});

test('equilibrio: esquivar y atrapar tardan quince segundos en volver',()=>{
 const g=setup(),b=g.players.find(p=>p.id==='b');g.ball.holder='a';
 setInput(g,b.id,controls({dash:true,my:1,catch:true}));stepGame(g);
 assert.ok(b.dashCooldown>14.9&&b.catchCooldown>14.9);
 run(g,60*14);
 setInput(g,b.id,controls({dash:true,catch:true}));stepGame(g);
 assert.equal(b.dashTime,0);assert.equal(b.catchTime,0);
 run(g,70);
 setInput(g,b.id,controls({dash:true,catch:true}));stepGame(g);
 assert.ok(b.dashTime>0&&b.catchTime>0);
});

test('secreto: esquivar con la pelota y lanzar enseguida es un cañonazo que no se atrapa',()=>{
 const {g,hero,rival}=ultGame(0);
 rival.x=640;
 setInput(g,hero.id,controls({dash:true,mx:1}));stepGame(g);
 assert.ok(hero.surge>0);
 setInput(g,hero.id,controls({fire:true,ax:rival.x,ay:rival.y}));stepGame(g);
 assert.equal(g.ball.kind,'power');assert.ok(Math.abs(Math.hypot(g.ball.vx,g.ball.vy)-STATS.shotSpeed*STATS.powerBoost)<.001);
 assert.ok(g.events.some(e=>e.type==='trick'&&e.trick==='power'));
 setInput(g,rival.id,controls({catch:true}));run(g,12);
 assert.equal(rival.prison,true);assert.equal(rival.catches,0);
 // Too slow after the dodge, or dodging without the ball: a plain throw.
 const late=ultGame(0);
 setInput(late.g,late.hero.id,controls({dash:true,mx:1}));run(late.g,40);
 setInput(late.g,late.hero.id,controls({fire:true}));stepGame(late.g);assert.equal(late.g.ball.kind,null);
 const empty=ultGame(0);empty.g.ball.holder=empty.ally.id;
 setInput(empty.g,empty.hero.id,controls({dash:true,mx:1}));stepGame(empty.g);assert.equal(empty.hero.surge,0);
});

test('secreto: lanzar nada más atrapar es un contraataque más rápido que devuelve esquiva y atrapada',()=>{
 const {g,hero,rival}=ultGame(0);
 hero.dashCooldown=9;
 shotAt(g,hero,rival);g.ball.vx=-790;g.ball.x=hero.x+20;
 setInput(g,hero.id,controls({catch:true}));stepGame(g);
 assert.equal(g.ball.holder,hero.id);assert.ok(hero.counter>0&&hero.catchCooldown>14);
 run(g,10);
 setInput(g,hero.id,controls({fire:true,ax:rival.x,ay:rival.y}));stepGame(g);
 assert.equal(g.ball.kind,'counter');assert.ok(Math.abs(g.ball.vx-STATS.shotSpeed*STATS.counterBoost)<.001);
 assert.equal(hero.catchCooldown,0);assert.equal(hero.dashCooldown,0);
 const slow=ultGame(0);
 shotAt(slow.g,slow.hero,slow.rival);slow.g.ball.vx=-790;slow.g.ball.x=slow.hero.x+20;
 setInput(slow.g,slow.hero.id,controls({catch:true}));run(slow.g,45);
 setInput(slow.g,slow.hero.id,controls({fire:true}));stepGame(slow.g);
 assert.equal(slow.g.ball.kind,null);assert.ok(slow.hero.catchCooldown>13);
});

test('rebote: el tocado sólo va a la cárcel si nadie atrapa la pelota que rebota en él',()=>{
 STATS.reboundChance=1;
 try{
  const {g,hero,rival,other}=ultGame(0);
  other.x=rival.x;other.y=rival.y+90;
  shotAt(g,rival,hero);stepGame(g);
  assert.equal(rival.prison,false);assert.deepEqual(g.tagged,[{id:rival.id,by:hero.id}]);
  assert.equal(g.ball.kind,'rebound');assert.equal(g.ball.live,true);assert.equal(hero.hits,0);
  assert.deepEqual(snapshot(g).tagged,[rival.id]);
  // The teammate catches it on the way: nobody is out and the catch comes back.
  for(let n=0;n<60&&g.ball.holder!==other.id;n++){setInput(g,other.id,controls({catch:Math.hypot(g.ball.x-other.x,g.ball.y-other.y)<50}));stepGame(g);}
  assert.equal(g.ball.holder,other.id);assert.equal(rival.prison,false);assert.equal(g.tagged.length,0);
  assert.equal(other.catchCooldown,0);assert.equal(other.rescues,1);assert.ok(g.events.some(e=>e.type==='save'&&e.player===rival.id));
  // Nobody catches it: the rebound also takes the teammate it lands on, and both are out.
  const lost=ultGame(0);lost.other.x=lost.rival.x;lost.other.y=lost.rival.y+90;
  shotAt(lost.g,lost.rival,lost.hero);run(lost.g,70);
  assert.equal(lost.rival.prison,true);assert.equal(lost.other.prison,true);assert.equal(lost.hero.hits,2);assert.equal(lost.g.tagged.length,0);
  // Alone on the court, the rebound falls and the player is out.
  const alone=ultGame(0);imprison(alone.g,alone.other);
  shotAt(alone.g,alone.rival,alone.hero);run(alone.g,70);
  assert.equal(alone.rival.prison,true);
 }finally{STATS.reboundChance=0;}
});

test('pases: va al compañero más cercano a donde se apunta y vuela por encima de los rivales',()=>{
 const {g,hero,ally,rival,other}=ultGame(0);
 assert.equal(passTarget(g,hero,{x:ally.x,y:ally.y}).id,ally.id);
 // From prison, behind the rival field, the pass crosses it without a rival picking it up.
 imprison(g,hero);run(g,30);g.ball.holder=hero.id;
 ally.x=500;ally.y=hero.y;rival.x=800;rival.y=hero.y;other.x=700;other.y=hero.y;
 setInput(g,hero.id,controls({pass:true,ax:ally.x,ay:ally.y}));stepGame(g);
 assert.equal(g.ball.pass,true);assert.equal(g.ball.receiver,ally.id);
 run(g,80);
 assert.equal(g.ball.holder,ally.id);assert.equal(g.ball.team,0);
 // A rival who times a catch cuts the pass off.
 const cut=ultGame(0);imprison(cut.g,cut.hero);run(cut.g,30);cut.g.ball.holder=cut.hero.id;
 cut.ally.x=500;cut.ally.y=cut.hero.y;cut.rival.x=800;cut.rival.y=cut.hero.y;
 setInput(cut.g,cut.hero.id,controls({pass:true,ax:cut.ally.x,ay:cut.ally.y}));stepGame(cut.g);
 for(let n=0;n<80&&!cut.g.ball.holder;n++){setInput(cut.g,cut.rival.id,controls({catch:Math.abs(cut.g.ball.x-cut.rival.x)<60}));stepGame(cut.g);}
 assert.equal(cut.g.ball.holder,cut.rival.id);assert.equal(cut.rival.catches,1);
});

test('equilibrio: entre máquinas hay eliminaciones y rondas que acaban sin esperar al reloj',()=>{
 STATS.reboundChance=REBOUND;
 try{
  let hits=0,eliminations=0,saves=0,tricks=0;
  for(const seed of [99,7,31337,555]){
   const g=makeGame([],{teamSize:3,bestOf:3,roundSeconds:150},seed);let seen=0;
   for(let i=0;i<120000&&g.phase!=='matchOver';i++){stepGame(g);for(const e of g.events)if(e.id>seen){seen=e.id;if(e.type==='hit')hits++;if(e.type==='round'&&e.reason==='elimination')eliminations++;if(e.type==='trick')tricks++;if(e.type==='tagged')saves++;}}
   assert.equal(g.phase,'matchOver');
  }
  assert.ok(hits>=30,`dianas ${hits}`);assert.ok(eliminations>=4,`rondas por eliminación ${eliminations}`);assert.ok(tricks>0&&saves>0);
 }finally{STATS.reboundChance=0;}
});

test('definitivas: la ronda nueva limpia los efectos y conserva la carga',()=>{
 const {g,hero,rival,other}=ultGame(9);
 cast(g,hero);g.net=[3,3];g.decoys.push({id:'x',owner:hero.id,team:0,character:7,slot:0,prison:false,x:300,y:300,vx:0,vy:0,dx:1,dy:0,face:1,life:5,turn:1});
 const charge=hero.ultCooldown;
 imprison(g,rival);imprison(g,other);stepGame(g);
 assert.equal(g.phase,'roundOver');
 run(g,400);
 assert.equal(g.round,2);assert.equal(hero.giant,0);assert.deepEqual(g.net,[0,0]);assert.equal(g.decoys.length,0);
 assert.ok(hero.ultCooldown>0&&hero.ultCooldown<=charge);
});

test('definitivas: la máquina las usa durante un partido',()=>{
 const g=makeGame([],{teamSize:13,bestOf:1,roundSeconds:180},4242);
 const used=new Set();let seen=0;
 for(let i=0;i<40000&&g.phase!=='matchOver';i++){stepGame(g);for(const e of g.events)if(e.id>seen){seen=e.id;if(e.type==='ult')used.add(e.ult);}}
 assert.equal(g.phase,'matchOver');
 assert.ok(used.size>=8,[...used].join());
});
