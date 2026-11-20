import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {makeGame,stepGame,setInput,imprison,snapshot,POINTS} from '../mate/sim.js';
import {HEROES} from '../mate/roster.js';
import {ACTIONS,TALENT_ART,actionState} from '../mate/abilities.js';
import {equipment} from '../gimnasio/mission.js';
import {stored} from '../gimnasio/store-layout.js';

const controls=(extra={})=>({mx:0,my:0,ax:900,ay:390,fire:false,catch:false,dash:false,pass:false,...extra});
function setup(rules={}) {
 const g=makeGame([{id:'a',team:0},{id:'b',team:1,character:1}],{teamSize:2,...rules});
 g.phase='playing';
 for(const p of g.players){p.bot=false;p.invulnerable=0;p.y=300;}
 g.players.find(p=>p.id==='a').x=500;g.players.find(p=>p.id==='b').x=800;
 g.players.filter(p=>!['a','b'].includes(p.id)).forEach(p=>p.y=600);
 return g;
}
const shotAt=(g,target,owner)=>{g.ball={x:target.x-20,y:target.y,vx:790,vy:0,holder:null,owner:owner.id,team:owner.team,live:true,age:.2,held:0,loose:0,pass:false};};
const player=(g,id)=>g.players.find(p=>p.id===id);

test('puntos: una diana suma al lanzador y queda en la instantánea de red',()=>{
 const g=setup(),a=player(g,'a'),b=player(g,'b');
 shotAt(g,b,a);stepGame(g);
 assert.equal(b.prison,true);assert.equal(a.points,POINTS.hit);assert.equal(a.hits,1);assert.equal(b.points,0);
 assert.equal(snapshot(g).players.find(p=>p.id==='a').points,POINTS.hit);
 const scored=g.events.find(e=>e.type==='points');
 assert.deepEqual([scored.player,scored.amount,scored.play],['a',POINTS.hit,'hit']);
});
test('puntos: atrapar y esquivar premian a quien defiende, una sola vez por tiro',()=>{
 const g=setup(),a=player(g,'a'),b=player(g,'b');
 shotAt(g,b,a);setInput(g,'b',controls({catch:true}));stepGame(g);
 assert.equal(b.points,POINTS.catch);assert.equal(b.catches,1);assert.equal(a.points,0);
 const h=setup(),x=player(h,'a'),y=player(h,'b');
 shotAt(h,y,x);setInput(h,'b',controls({dash:true,my:1}));stepGame(h);
 assert.equal(y.prison,false);assert.equal(y.points,POINTS.dodge);assert.equal(y.dodges,1);
 // The same ball grazing the same dodge again does not pay twice.
 h.ball.x=y.x-20;h.ball.y=y.y;h.ball.live=true;h.ball.age=.2;y.dashTime=.2;stepGame(h);
 assert.equal(y.points,POINTS.dodge);
});
test('puntos: el pase que acaba en diana da asistencia y el preso que acierta suma el rescate',()=>{
 const g=setup(),a=player(g,'a'),b=player(g,'b'),mate=g.players.find(p=>p.team===0&&p.id!=='a');
 shotAt(g,b,a);g.ball.assist=mate.id;stepGame(g);
 assert.equal(a.points,POINTS.hit);assert.equal(mate.points,POINTS.assist);assert.equal(mate.assists,1);
 const h=setup(),x=player(h,'a'),y=player(h,'b');
 imprison(h,x);
 h.ball={x:y.x+20,y:y.y,vx:-790,vy:0,holder:null,owner:x.id,team:0,live:true,age:.3,held:0,loose:0,pass:false};
 stepGame(h);
 assert.equal(x.prison,false);assert.equal(x.points,POINTS.hit+POINTS.rescue);assert.equal(x.rescues,1);
});
test('puntos: ganar la ronda premia a todo el equipo',()=>{
 const g=setup({teamSize:1,bestOf:1}),a=player(g,'a'),b=player(g,'b');
 shotAt(g,b,a);stepGame(g);
 assert.equal(g.phase,'roundOver');assert.equal(a.points,POINTS.hit+POINTS.round);assert.equal(b.points,0);
});
test('habilidades: cada acción y cada talento tiene su imagen, y el estado refleja la jugada',()=>{
 const art=name=>fileURLToPath(new URL(`../mate/assets/abilities/${name}.svg`,import.meta.url));
 assert.equal(TALENT_ART.length,HEROES.length);
 for(const name of [...ACTIONS.map(action=>action.id),...TALENT_ART])assert.ok(existsSync(art(name)),name);
 const g=setup(),a=player(g,'a');
 g.ball.holder='b';
 assert.equal(actionState('fire',a,g.ball).off,true);assert.equal(actionState('catch',a,g.ball).off,false);
 g.ball.holder='a';g.ball.held=2.5;
 assert.equal(actionState('fire',a,g.ball).off,false);assert.equal(actionState('fire',a,g.ball).hold,.5);assert.equal(actionState('catch',a,g.ball).off,true);
 a.slowed=4;assert.deepEqual(actionState('dash',a,g.ball),{wait:4,total:10,locked:true});
 a.specialCooldown=30;assert.equal(actionState('special',a,g.ball).wait,30);
});
test('almacén: cada material tiene su parte pintada del cuarto ordenado',()=>{
 const art=name=>fileURLToPath(new URL(`../gimnasio/assets/${name}.webp`,import.meta.url));
 assert.ok(existsSync(art('store-tidy')));
 for(const item of equipment){
  assert.ok(existsSync(art('set-'+item.id)),item.id);
  const [left,top,width,height]=stored[item.id];
  assert.ok(left>=0&&top>=0&&width>0&&height>0&&left+width<=100&&top+height<=100,item.id);
 }
});
