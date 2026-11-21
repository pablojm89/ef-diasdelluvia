// Host-authoritative, fixed-step game simulation. No DOM, clocks or network APIs.
import {buildLineup} from './selection.js';
import {HEROES,STATS} from './roster.js';

export const FIELD={width:1200,height:760,top:145,bottom:640,mid:600,radius:17};
export const RULE_DEFAULTS={teamSize:3,roundSeconds:150,bestOf:3,catchEliminates:false,catchRescues:false};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const TAU=Math.PI*2;
// Shot speed of the ultimates that are a throw.
const SHOTS={comet:1050,homing:560,boomerang:880};
// Seconds each effect of an ultimate lasts.
export const EFFECT={turbo:6,frozen:3,flash:5,shield:8,giant:6,slowed:10,net:5,decoy:7};
// How many times bigger Bruno gets, in reach and on screen.
export const GIANT=1.85;
const TIMERS=['boostTime','catchTime','catchCooldown','dashTime','dashCooldown','invulnerable','stun','throwFlash','ultCooldown','slowed','turbo','frozen','flash','shield','giant'];
const ultOf=p=>HEROES[p.character].ult;
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function normalizeRules(raw={}) {
 return {teamSize:Number.isInteger(Number(raw.teamSize)) && Number(raw.teamSize)>=1 && Number(raw.teamSize)<=13?Number(raw.teamSize):3,
 roundSeconds:[60,90,150,180].includes(Number(raw.roundSeconds))?Number(raw.roundSeconds):150,
 bestOf:[1,3].includes(Number(raw.bestOf))?Number(raw.bestOf):3,
 catchEliminates:raw.catchEliminates===true,catchRescues:raw.catchRescues===true};
}
export function bounds(player) {
 const t=player.team;
 return {left:player.prison?(t===0?1061:78):(t===0?178:622),right:player.prison?(t===0?1122:139):(t===0?578:1022),top:170,bottom:615};
}
export function sanitizeInput(raw) {
 if(!raw||typeof raw!=='object')return null;
 for(const key of ['mx','my','ax','ay'])if(typeof raw[key]!=='number'||!Number.isFinite(raw[key]))return null;
 return {mx:clamp(raw.mx,-1,1),my:clamp(raw.my,-1,1),ax:clamp(raw.ax,0,1200),ay:clamp(raw.ay,100,680),ult:raw.ult===true,fire:raw.fire===true,catch:raw.catch===true,dash:raw.dash===true,pass:raw.pass===true};
}
export function makeGame(roster=[],rawRules={},seed=1234567) {
 const rules=normalizeRules(rawRules);
 const players=[];
 for(let team=0;team<2;team++) {
  const lineup=buildLineup(roster,team,rules.teamSize);
  for(const [slot,{member,character}] of lineup.entries()) {
   players.push({id:member?.id||`bot-${team}-${slot}`,name:HEROES[character].name,character,team,bot:!member||member.bot===true,slot,prison:false,x:0,y:0,vx:0,vy:0,face:team===0?1:-1,catchTime:0,catchCooldown:0,dashTime:0,dashCooldown:0,invulnerable:0,stun:0,throwFlash:0,boostTime:0,ultCooldown:HEROES[character].ult.recharge/2,slowed:0,turbo:0,frozen:0,flash:0,shield:0,giant:0,points:0,hits:0,catches:0,dodges:0,assists:0,rescues:0,input:null,lastInput:0,aiThink:0,aiAim:0});
  }
 }
 const g={v:1,rules,seed:seed>>>0||1,tick:0,time:0,phase:'countdown',phaseTime:2.7,paused:false,round:1,roundLeft:rules.roundSeconds,scores:[0,0],winner:null,roundWinner:null,players,ball:null,decoys:[],net:[0,0],events:[],eventId:0};
 resetRound(g);
 return g;
}
export function emit(g,type,data={}) {g.events.push({id:++g.eventId,t:g.time,type,...data});if(g.events.length>24)g.events.shift();}
// Points reward the plays that help a team: hitting, catching, dodging, assisting and freeing.
export const POINTS={hit:100,catch:75,rescue:50,assist:40,dodge:25,round:50};
const TALLY={hit:'hits',catch:'catches',rescue:'rescues',assist:'assists',dodge:'dodges'};
function award(g,p,play){p.points+=POINTS[play];p[TALLY[play]]++;emit(g,'points',{player:p.id,x:p.x,y:p.y,team:p.team,amount:POINTS[play],play});}
function random(g){let x=g.seed;x^=x<<13;x^=x>>>17;x^=x<<5;g.seed=x>>>0;return g.seed/4294967296;}
function spawn(g,p) {
 p.prison=false;p.slowed=0;p.boostTime=0;p.turbo=0;p.frozen=0;p.flash=0;p.shield=0;p.giant=0;
 const total=g.players.filter(x=>x.team===p.team).length;
 p.x=p.team===0?330-(p.slot%2)*70:870+(p.slot%2)*70;
 p.y=220+(p.slot+0.5)*(340/Math.max(total,1));
 if(total>6){
  const columns=3,rows=Math.ceil(total/columns);
  const left=250+(p.slot%columns)*120;
  p.x=p.team===0?left:FIELD.width-left;
  p.y=200+Math.floor(p.slot/columns)*380/Math.max(1,rows-1);
 }
 p.y=clamp(p.y,185,600);p.vx=0;p.vy=0;p.catchTime=0;p.catchCooldown=0;p.dashTime=0;p.dashCooldown=0;p.invulnerable=.25;p.stun=0;p.throwFlash=0;p.input=null;
}
function resetRound(g) {
 for(const p of g.players)spawn(g,p);
 const first=g.players.find(p=>p.team===(g.round-1)%2);
 g.ball={x:first.x,y:first.y,vx:0,vy:0,holder:first.id,owner:first.id,team:first.team,live:false,age:0,held:0,loose:0,pass:false};
 g.decoys=[];g.net=[0,0];
 g.roundLeft=g.rules.roundSeconds;
}
export function setInput(g,id,raw) {
 const p=g.players.find(p=>p.id===id), input=sanitizeInput(raw);
 if(!p||p.bot||!input)return false;
 const old=p.input;
 p.input={...input,ult:input.ult||old?.ult===true,fire:input.fire||old?.fire===true,catch:input.catch||old?.catch===true,dash:input.dash||old?.dash===true,pass:input.pass||old?.pass===true};
 if(g.paused||g.phase!=='playing')p.input.ult=p.input.fire=p.input.catch=p.input.dash=p.input.pass=false;
 p.lastInput=g.tick;
 return true;
}
function nearest(p,players){return players.reduce((best,q)=>!best||distance(p,q)<distance(p,best)?q:best,null);}
// When a machine-played hero spends the ultimate. chance is per step, so it reacts within about a second.
function aiUlt(g,p,firing) {
 if(p.ultCooldown>0||p.stun>0||p.frozen>0)return false;
 const b=g.ball,id=ultOf(p).id,carrier=g.players.find(q=>q.id===b.holder);
 const incoming=b.live&&b.team!==p.team,danger=incoming||(!!carrier&&carrier.team!==p.team&&b.held>.3);
 const due=chance=>random(g)<chance;
 if(['teledirigida','cometa','bumeran'].includes(id))return firing;
 if(id==='arenga'||id==='burbuja'||id==='espejismo')return danger&&due(.03);
 if(id==='iman')return b.holder!==p.id&&!b.magnet&&!!carrier&&carrier.team!==p.team&&b.held>.4&&due(.03);
 if(id==='quietos')return b.holder===p.id&&b.held>.3&&due(.05);
 if(id==='centella'||id==='gigante')return incoming&&!p.prison&&distance(p,b)<260&&due(.3);
 if(id==='red')return incoming&&(p.team===0?b.x>FIELD.mid&&b.vx<0:b.x<FIELD.mid&&b.vx>0)&&due(.4);
 if(id==='mirada')return !!carrier&&carrier.team===p.team&&due(.02);
 return g.players.some(q=>q.team===p.team&&q.prison)&&due(.012);
}
function aiInput(g,p) {
 const b=g.ball,opponents=[...g.players,...g.decoys].filter(q=>q.team!==p.team&&!q.prison),target=nearest(p,opponents);
 let mx=0,my=0,fire=false,catching=false,dash=false,pass=false,ax=target?.x??600,ay=target?.y??390;
 if(b.holder===p.id){
  p.aiThink-=1/60;
  const margin=p.team===0?545:655;
  mx=p.prison?0:Math.sign(margin-p.x)*0.45;
  if(target){ay=target.y+target.vy*0.16+p.aiAim;my=clamp((target.y-p.y)/160,-.65,.65);}
  if(b.held>0.65&&p.aiThink<=0){
   const ally=nearest(p,g.players.filter(q=>q.team===p.team && q.id!==p.id));
   // Use a forward pass if it puts a teammate closer to the target.
   pass=!!(ally && target && !ally.prison && !p.prison && distance(ally,target)+60<distance(p,target) && random(g)<.4);
   fire=!pass;p.aiThink=.8+random(g)*.8;p.aiAim=(random(g)-.5)*50;
  }
 } else if(!b.holder&&!b.live) {
  const zone=bounds(p),accessible=b.x>=zone.left-35&&b.x<=zone.right+35;
  const teammates=g.players.filter(q=>q.team===p.team&&q.prison===p.prison);
  if(accessible&&nearest(b,teammates)?.id===p.id){mx=clamp((b.x-p.x)/45,-1,1);my=clamp((b.y-p.y)/45,-1,1);}
  else {mx=clamp(((p.team===0?455:745)+(p.prison?(p.team===0?640:-640):0)-p.x)/140,-.3,.3);my=Math.sin(g.time*.8+p.slot*2)*.35;}
 } else {
  my=Math.sin(g.time*.9+p.slot*2+p.team)*.45;
  if(b.live&&b.team!==p.team&&distance(p,b)<180) {
   ax=b.x;ay=b.y;
   const approaching=(p.x-b.x)*b.vx+(p.y-b.y)*b.vy>0;
   if(approaching){my=p.y<b.y?-1:1;if(distance(p,b)<120&&p.catchCooldown<=0&&random(g)<.16)catching=true;if(distance(p,b)<85&&p.dashCooldown<=0&&random(g)<.1)dash=true;}
  }
 }
 if(target&&p.prison&&b.holder===p.id){ax=target.x;ay=target.y;}
 const ult=aiUlt(g,p,fire&&!!target);
 if(ult&&ultOf(p).ball==='held')fire=false;
 return {mx,my,ax,ay,ult,fire,catch:catching,dash,pass};
}
// The ball stops being a threat: it has bounced, been stopped or run out of flight.
function drop(b){b.live=false;b.pass=false;b.kind=null;b.big=false;b.target=null;b.back=false;b.struck=null;}
// kind: null for a normal throw, or 'comet', 'homing' or 'boomerang' for the ultimates that are a throw.
export function throwBall(g,p,aim,passing=false,kind=null) {
 const b=g.ball;if(b.holder!==p.id||p.stun>0||p.frozen>0)return false;
 let target=aim;
 if(passing){const ally=nearest(p,g.players.filter(q=>q.team===p.team&&q.id!==p.id));if(!ally)return false;target=ally;}
 let dx=target.x-p.x,dy=target.y-p.y,len=Math.hypot(dx,dy);
 if(len<1){dx=p.team===0?1:-1;dy=0;len=1;}
 const speed=passing?STATS.passSpeed:kind?SHOTS[kind]:STATS.shotSpeed*(p.flash>0?1.35:1);
 drop(b);
 b.dodged=null;
 if(!passing){b.kind=kind;b.big=p.giant>0;}
 if(kind==='homing')b.target=nearest(aim,g.players.filter(q=>q.team!==p.team&&!q.prison))?.id||null;
 b.holder=null;b.owner=p.id;b.team=p.team;b.live=!passing;b.pass=passing;b.age=0;b.loose=0;b.held=0;
 b.x=p.x+dx/len*25;b.y=p.y+dy/len*25;b.vx=dx/len*speed;b.vy=dy/len*speed;
 p.throwFlash=.22;p.face=dx>=0?1:-1;
 emit(g,passing?'pass':'throw',{player:p.id,x:p.x,y:p.y,team:p.team});return true;
}
function hold(g,p,type='pickup') {
 const b=g.ball;
 // A pass that leads to a hit earns the passer an assist.
 b.assist=type==='pickup'&&b.pass&&b.team===p.team&&b.owner!==p.id?b.owner:null;
 drop(b);b.magnet=null;
 b.holder=p.id;b.team=p.team;b.owner=p.id;b.x=p.x;b.y=p.y;b.vx=0;b.vy=0;b.held=0;b.loose=0;emit(g,type,{player:p.id,x:p.x,y:p.y,team:p.team});}
export function imprison(g,p,thrower=null) {
 if(p.prison)return false;
 p.boostTime=0;p.prison=true;p.x=p.team===0?1090:110;p.y=clamp(p.y,185,600);p.invulnerable=.9;p.catchTime=0;p.dashTime=0;p.stun=.35;
 emit(g,'hit',{player:p.id,x:p.x,y:p.y,team:p.team,by:thrower?.id});
 if(thrower&&thrower.team!==p.team){
  award(g,thrower,'hit');
  const passer=g.players.find(q=>q.id===g.ball?.assist&&q.id!==thrower.id&&q.team===thrower.team);
  if(passer)award(g,passer,'assist');
 }
 if(thrower?.prison)rescue(g,thrower);
 return true;
}
export function rescue(g,p,by=p) {
 if(!p?.prison)return false;
 if(by)award(g,by,'rescue');
 p.prison=false;p.x=p.team===0?235:965;p.y=clamp(p.y,185,600);p.invulnerable=1.2;p.stun=.25;
 emit(g,'rescue',{player:p.id,x:p.x,y:p.y,team:p.team});return true;
}
// What each ultimate does. Returning false means it could not be used and keeps its charge.
const CAST={
 arenga(g,p){for(const q of g.players)if(q.team===p.team){q.turbo=EFFECT.turbo;q.slowed=0;q.catchCooldown=0;q.dashCooldown=0;}},
 iman(g,p){
  const b=g.ball;if(b.holder===p.id||b.magnet===p.id)return false;
  drop(b);b.holder=null;b.magnet=p.id;b.loose=0;
 },
 // Everyone but the caster stands still, teammates included.
 quietos(g,p){for(const q of g.players)if(q.id!==p.id&&q.turbo<=0){q.frozen=EFFECT.frozen;q.dashTime=0;q.catchTime=0;}},
 centella(g,p){p.flash=EFFECT.flash;p.slowed=0;},
 teledirigida:(g,p,aim)=>throwBall(g,p,aim,false,'homing'),
 burbuja(g,p){for(const q of g.players)if(q.team===p.team&&!q.prison)q.shield=EFFECT.shield;},
 cometa:(g,p,aim)=>throwBall(g,p,aim,false,'comet'),
 espejismo(g,p){
  g.decoys=g.decoys.filter(d=>d.owner!==p.id);
  const start=random(g)*TAU;
  for(let i=0;i<3;i++){
   const angle=start+i*TAU/3;
   g.decoys.push({id:`${p.id}-copy-${i}`,owner:p.id,name:p.name,bot:p.bot,team:p.team,character:p.character,slot:p.slot+i+1,prison:p.prison,x:p.x,y:p.y,vx:0,vy:0,dx:Math.cos(angle),dy:Math.sin(angle),face:p.face,life:EFFECT.decoy,turn:.5});
  }
 },
 red(g,p){g.net[p.team]=EFFECT.net;},
 gigante(g,p){p.giant=EFFECT.giant;},
 bumeran:(g,p,aim)=>throwBall(g,p,aim,false,'boomerang'),
 mirada(g,p){
  const rivals=g.players.filter(q=>q.team!==p.team&&q.turbo<=0);
  if(rivals.every(q=>q.slowed>0))return false;
  for(const q of rivals){if(q.slowed<=0)q.slowed=EFFECT.slowed;q.dashTime=0;}
 },
 fuga(g,p){
  const caged=g.players.filter(q=>q.team===p.team&&q.prison);
  if(!caged.length)return false;
  for(const q of caged){rescue(g,q,p);q.boostTime=3;q.invulnerable=1.5;}
 },
};
export function castUlt(g,p,aim={x:p.x+p.face*300,y:p.y}) {
 const ult=ultOf(p);
 if(p.ultCooldown>0||p.stun>0||p.frozen>0||CAST[ult.id](g,p,aim)===false)return false;
 p.ultCooldown=ult.recharge;
 emit(g,'ult',{player:p.id,x:p.x,y:p.y,team:p.team,ult:ult.id});
 return true;
}
function endRound(g,winner,reason) {
 g.roundWinner=winner;g.phase='roundOver';g.phaseTime=3.5;
 if(winner!==null){g.scores[winner]++;for(const p of g.players)if(p.team===winner)p.points+=POINTS.round;}
 emit(g,'round',{winner,reason});
}
function checkWin(g) {
 for(let team=0;team<2;team++)if(g.players.filter(p=>p.team===team&&!p.prison).length===0){endRound(g,1-team,'elimination');return;}
 if(g.roundLeft<=0){const counts=[0,1].map(t=>g.players.filter(p=>p.team===t&&!p.prison).length);endRound(g,counts[0]===counts[1]?null:counts[0]>counts[1]?0:1,'time');}
}
function sweptDistance(p,ax,ay,bx,by) {
 const dx=bx-ax,dy=by-ay,d=dx*dx+dy*dy,t=d?clamp(((p.x-ax)*dx+(p.y-ay)*dy)/d,0,1):0;
 return Math.hypot(p.x-(ax+dx*t),p.y-(ay+dy*t));
}
// Turn the ball towards a point by at most `turn` radians, keeping its speed.
function steer(b,to,speed,turn) {
 const now=Math.atan2(b.vy,b.vx),wanted=Math.atan2(to.y-b.y,to.x-b.x)-now;
 const angle=now+clamp(Math.atan2(Math.sin(wanted),Math.cos(wanted)),-turn,turn);
 b.vx=Math.cos(angle)*speed;b.vy=Math.sin(angle)*speed;
}
function stepBall(g,dt) {
 const b=g.ball;
 if(b.holder){const p=g.players.find(p=>p.id===b.holder);if(!p){b.holder=null;return;}b.x=p.x;b.y=p.y;b.held+=dt;if(b.held>5){b.holder=null;b.live=false;b.vx=(p.team===0?1:-1)*80;b.vy=0;b.x=p.x+(p.team===0?28:-28);b.loose=0;emit(g,'release',{player:p.id});}return;}
 if(b.magnet){
  // Superimán: straight to its caster, through everything.
  const to=g.players.find(p=>p.id===b.magnet);
  if(!to){b.magnet=null;return;}
  const dx=to.x-b.x,dy=to.y-b.y,len=Math.hypot(dx,dy),move=1500*dt;
  if(len<=move+20){hold(g,to,'magnet');return;}
  b.vx=dx/len*1500;b.vy=dy/len*1500;b.x+=dx/len*move;b.y+=dy/len*move;return;
 }
 const guided=b.live&&(b.kind==='homing'||b.kind==='boomerang');
 if(b.live&&b.kind==='homing'){
  let target=g.players.find(p=>p.id===b.target&&!p.prison);
  if(!target){target=nearest(b,g.players.filter(p=>p.team!==b.team&&!p.prison));b.target=target?.id||null;}
  if(target)steer(b,target,SHOTS.homing,7*dt);
 }
 if(b.live&&b.kind==='boomerang'){
  if(b.age>.5)b.back=true;
  const owner=g.players.find(p=>p.id===b.owner);
  if(b.back&&owner)steer(b,owner,SHOTS.boomerang,9*dt);
 }
 const ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.age+=dt;
 for(const team of [0,1]){
  // La Red: nothing thrown by the other team crosses the centre line.
  if(g.net[team]<=0||b.team===team)continue;
  if(team===0?ox>=FIELD.mid&&b.x<FIELD.mid:ox<=FIELD.mid&&b.x>FIELD.mid){
   b.x=FIELD.mid+(team===0?14:-14);b.vx*=-.5;b.vy*=.5;drop(b);b.loose=0;emit(g,'net',{x:FIELD.mid,y:b.y,team});
  }
 }
 if(b.x<62||b.x>1138){b.x=clamp(b.x,62,1138);if(guided){b.vx*=-1;b.back=true;}else{b.vx*=-.45;drop(b);}}
 if(b.y<148||b.y>638){b.y=clamp(b.y,148,638);if(guided){b.vy*=-1;b.back=true;}else{b.vy*=-.45;drop(b);}}
 if(b.age>(b.kind==='homing'?3.5:b.kind==='boomerang'?3:1.25))drop(b);
 const ordered=[...g.players].sort((a,c)=>Math.hypot(a.x-ox,a.y-oy)-Math.hypot(c.x-ox,c.y-oy));
 for(const p of ordered) {
  if(p.id===b.owner&&b.age<.2)continue;
  const d=sweptDistance(p,ox,oy,b.x,b.y);
  if(b.live&&p.team!==b.team){
   if(b.struck?.includes(p.id))continue;
   const reach=(FIELD.radius+7+(b.big?12:0))*(p.giant>0?GIANT:1);
   // A giant catches whatever touches him; nobody catches a comet.
   const grabs=b.kind!=='comet'&&p.stun<=0&&p.frozen<=0&&(p.giant>0&&!p.prison?d<reach:p.catchTime>0&&d<STATS.catchRadius);
   if(grabs){
    const sender=g.players.find(q=>q.id===b.owner);hold(g,p,'catch');p.catchTime=0;award(g,p,'catch');
    if(g.rules.catchEliminates&&sender&&!sender.prison)imprison(g,sender);
    if(g.rules.catchRescues){const prisoner=g.players.find(q=>q.team===p.team&&q.prison&&q.id!==p.id);if(prisoner)rescue(g,prisoner,p);}
    return;
   }
   if(d>=reach||p.prison||p.invulnerable>0||p.stun>0)continue;
   // A dash does not get away from a guided shot; Centella lets every ball through.
   if(p.flash>0||(p.dashTime>0&&b.kind!=='homing')){if(!b.dodged?.includes(p.id)){(b.dodged||=[]).push(p.id);award(g,p,'dodge');}continue;}
   if(p.giant>0||p.shield>0){
    if(p.giant<=0){p.shield=0;p.invulnerable=.4;}
    emit(g,p.giant>0?'clang':'pop',{player:p.id,x:p.x,y:p.y,team:p.team});
    b.vx*=-.35;b.vy*=-.35;drop(b);b.loose=0;return;
   }
   imprison(g,p,g.players.find(q=>q.id===b.owner));emit(g,'impact',{x:ox,y:oy,team:p.team});
   // A boomerang carries on through whoever it hits.
   if(b.kind==='boomerang'){(b.struck||=[]).push(p.id);continue;}
   b.vx*=.28;b.vy*=.28;drop(b);b.loose=0;return;
  }
  else if(b.kind==='boomerang'&&b.back&&p.id===b.owner&&d<STATS.pickupRadius+6&&p.frozen<=0){hold(g,p);return;}
  else if(!b.live&&d<STATS.pickupRadius&&p.stun<=0&&p.frozen<=0){hold(g,p);return;}
 }
 if(b.live)for(const copy of g.decoys){
  if(copy.team===b.team||copy.prison||copy.life<=0||sweptDistance(copy,ox,oy,b.x,b.y)>=FIELD.radius+7)continue;
  // The ball fell for a copy: it counts as a dodge for the real one.
  copy.life=0;
  const real=g.players.find(p=>p.id===copy.owner);if(real)award(g,real,'dodge');
  if(b.kind!=='boomerang'){b.vx*=.28;b.vy*=.28;drop(b);b.loose=0;}
  break;
 }
 if(!b.live&&!b.pass){
  const friction=Math.exp(-4*dt);b.vx*=friction;b.vy*=friction;b.loose+=dt;
  // A ball outside the reachable lanes is returned by the referee, not left stuck.
  if(b.loose>3){const team=b.x<600?0:1,candidates=g.players.filter(p=>p.team===team&&!p.prison);const p=nearest(b,candidates);if(p){hold(g,p,'referee');}}
 }
}
function stepDecoys(g,dt) {
 for(const copy of g.decoys){
  copy.life-=dt;copy.turn-=dt;
  if(copy.turn<=0){const angle=random(g)*TAU;copy.dx=Math.cos(angle);copy.dy=Math.sin(angle);copy.turn=.35+random(g)*.6;}
  const area=bounds(copy),x=copy.x+copy.dx*STATS.runSpeed*dt,y=copy.y+copy.dy*STATS.runSpeed*dt;
  if(x<area.left||x>area.right)copy.dx*=-1;
  if(y<area.top||y>area.bottom)copy.dy*=-1;
  copy.vx=copy.dx*STATS.runSpeed;copy.vy=copy.dy*STATS.runSpeed;
  copy.x=clamp(x,area.left,area.right);copy.y=clamp(y,area.top,area.bottom);
  if(copy.life<=0)emit(g,'poof',{x:copy.x,y:copy.y,team:copy.team});
 }
 g.decoys=g.decoys.filter(copy=>copy.life>0);
}
export function stepGame(g,dt=1/60) {
 dt=clamp(dt,0,1/30);g.tick++;
 if(g.paused||g.phase==='matchOver')return g;
 g.time+=dt;
 if(g.phase!=='playing') {
  g.phaseTime-=dt;
  if(g.phaseTime<=0){
   if(g.phase==='countdown'){g.phase='playing';emit(g,'start',{round:g.round});}
   else if(g.phase==='roundOver'){
    const needed=Math.ceil(g.rules.bestOf/2);
    if(g.scores.some(s=>s>=needed)||g.round>=g.rules.bestOf+2){g.phase='matchOver';g.winner=g.scores[0]===g.scores[1]?null:g.scores[0]>g.scores[1]?0:1;emit(g,'match',{winner:g.winner});}
    else{g.round++;resetRound(g);g.phase='countdown';g.phaseTime=2.7;}
   }
  }
  return g;
 }
 g.roundLeft=Math.max(0,g.roundLeft-dt);
 for(const team of [0,1])g.net[team]=Math.max(0,g.net[team]-dt);
 const inputs=new Map();
 for(const p of g.players){
  const input=p.bot?aiInput(g,p):p.input;
  inputs.set(p,!input||(!p.bot&&g.tick-p.lastInput>22)?null:input);
 }
 // Resolve the ultimates before movement so the roster order cannot grant a free dodge.
 for(const p of g.players){const input=inputs.get(p);if(input?.ult)castUlt(g,p,{x:input.ax,y:input.ay});}
 for(const p of g.players) {
  for(const key of TIMERS)p[key]=Math.max(0,p[key]-dt);
  if(p.turbo>0){p.catchCooldown=Math.max(0,p.catchCooldown-2*dt);p.dashCooldown=Math.max(0,p.dashCooldown-2*dt);}
  const input=(p.frozen<=0&&inputs.get(p))||{mx:0,my:0,ax:p.x+p.face*100,ay:p.y};
  p.face=input.ax>=p.x?1:-1;
  if(input.catch&&p.catchCooldown<=0&&g.ball.holder!==p.id&&p.stun<=0){p.catchTime=STATS.catchWindow;p.catchCooldown=STATS.catchRecovery;emit(g,'guard',{player:p.id,x:p.x,y:p.y});}
  if(input.dash&&p.slowed<=0&&p.dashCooldown<=0&&p.stun<=0){p.dashTime=.2;p.dashCooldown=STATS.dashRecovery;p.dashX=input.mx||0;p.dashY=input.my||0;if(!p.dashX&&!p.dashY)p.dashY=p.y>390?-1:1;emit(g,'dodge',{player:p.id,x:p.x,y:p.y});}
  if(input.fire)throwBall(g,p,{x:input.ax,y:input.ay});
  if(input.pass)throwBall(g,p,{x:input.ax,y:input.ay},true);
  let mx=p.dashTime>0?p.dashX:input.mx||0,my=p.dashTime>0?p.dashY:input.my||0;
  const len=Math.hypot(mx,my);if(len>1){mx/=len;my/=len;}
  const run=(g.ball.holder===p.id?STATS.carrySpeed:STATS.runSpeed)*(p.boostTime>0?1.25:1)*(p.turbo>0?1.45:1)*(p.flash>0?2:1);
  const speed=p.stun>0||p.frozen>0?0:p.dashTime>0?STATS.dashSpeed:run;
  const pace=p.slowed>0?speed*.5:speed;
  p.vx=mx*pace;p.vy=my*pace;
  const area=bounds(p);p.x=clamp(p.x+p.vx*dt,area.left,area.right);p.y=clamp(p.y+p.vy*dt,area.top,area.bottom);
  if(p.input)p.input.ult=p.input.fire=p.input.catch=p.input.dash=p.input.pass=false;
 }
 // Separate teammates gently; collisions never push anyone across a line.
 for(let i=0;i<g.players.length;i++)for(let j=i+1;j<g.players.length;j++){
  const a=g.players[i],b=g.players[j];if(a.team!==b.team||a.prison!==b.prison)continue;
  const d=distance(a,b);if(d<33){const dx=d?(a.x-b.x)/d:1,dy=d?(a.y-b.y)/d:0,push=(33-d)*.5;for(const [p,sign] of [[a,1],[b,-1]]){const r=bounds(p);p.x=clamp(p.x+dx*push*sign,r.left,r.right);p.y=clamp(p.y+dy*push*sign,r.top,r.bottom);}}
 }
 stepDecoys(g,dt);stepBall(g,dt);checkWin(g);return g;
}
const tenth=n=>Math.round(n*10)/10;
export function snapshot(g) {
 // Only public game state, not command mailboxes, RNG or connection credentials.
 return {v:1,tick:g.tick,time:g.time,phase:g.phase,phaseTime:g.phaseTime,paused:g.paused,round:g.round,roundLeft:g.roundLeft,scores:[...g.scores],winner:g.winner,roundWinner:g.roundWinner,rules:g.rules,
 players:g.players.map(({input,lastInput,aiThink,aiAim,...p})=>({...p,x:tenth(p.x),y:tenth(p.y)})),
 decoys:g.decoys.map(({dx,dy,turn,...copy})=>({...copy,x:tenth(copy.x),y:tenth(copy.y)})),net:[...g.net],ball:{...g.ball},events:g.events};
}
