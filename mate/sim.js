// Host-authoritative, fixed-step game simulation. No DOM, clocks or network APIs.
import {buildLineup} from './selection.js';
import {HEROES} from './roster.js';

export const FIELD={width:1200,height:760,top:145,bottom:640,mid:600,radius:17};
export const RULE_DEFAULTS={teamSize:3,roundSeconds:150,bestOf:3,catchEliminates:false,catchRescues:false};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
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
 return {mx:clamp(raw.mx,-1,1),my:clamp(raw.my,-1,1),ax:clamp(raw.ax,0,1200),ay:clamp(raw.ay,100,680),gaze:raw.gaze===true,special:raw.special===true,fire:raw.fire===true,catch:raw.catch===true,dash:raw.dash===true,pass:raw.pass===true};
}
export function makeGame(roster=[],rawRules={},seed=1234567) {
 const rules=normalizeRules(rawRules);
 const players=[];
 for(let team=0;team<2;team++) {
  const lineup=buildLineup(roster,team,rules.teamSize);
  for(const [slot,{member,character}] of lineup.entries()) {
   players.push({id:member?.id||`bot-${team}-${slot}`,name:HEROES[character].name,character,team,bot:!member||member.bot===true,slot,prison:false,x:0,y:0,vx:0,vy:0,face:team===0?1:-1,catchTime:0,catchCooldown:0,dashTime:0,dashCooldown:0,invulnerable:0,stun:0,throwFlash:0,specialCooldown:0,gazeCooldown:0,slowed:0,points:0,hits:0,catches:0,dodges:0,assists:0,rescues:0,input:null,lastInput:0,aiThink:0,aiAim:0});
  }
 }
 const g={v:1,rules,seed:seed>>>0||1,tick:0,time:0,phase:'countdown',phaseTime:2.7,paused:false,round:1,roundLeft:rules.roundSeconds,scores:[0,0],winner:null,roundWinner:null,players,ball:null,events:[],eventId:0};
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
 p.prison=false;p.slowed=0;p.boostTime=0;
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
 g.roundLeft=g.rules.roundSeconds;
}
export function setInput(g,id,raw) {
 const p=g.players.find(p=>p.id===id), input=sanitizeInput(raw);
 if(!p||p.bot||!input)return false;
 const old=p.input;
 p.input={...input,gaze:input.gaze||old?.gaze===true,special:input.special||old?.special===true,fire:input.fire||old?.fire===true,catch:input.catch||old?.catch===true,dash:input.dash||old?.dash===true,pass:input.pass||old?.pass===true};
 if(g.paused||g.phase!=='playing')p.input.gaze=p.input.special=p.input.fire=p.input.catch=p.input.dash=p.input.pass=false;
 p.lastInput=g.tick;
 return true;
}
function nearest(p,players){return players.reduce((best,q)=>!best||distance(p,q)<distance(p,best)?q:best,null);}
function aiInput(g,p) {
 const b=g.ball,opponents=g.players.filter(q=>q.team!==p.team&&!q.prison),target=nearest(p,opponents);
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
 return {mx,my,ax,ay,fire,catch:catching,dash,pass};
}
export function throwBall(g,p,aim,passing=false,special=false) {
 const b=g.ball;if(b.holder!==p.id||p.stun>0||(special && p.specialCooldown>0))return false;
 let target=aim;
 if(passing){const ally=nearest(p,g.players.filter(q=>q.team===p.team&&q.id!==p.id));if(!ally)return false;target=ally;}
 let dx=target.x-p.x,dy=target.y-p.y,len=Math.hypot(dx,dy);
 if(len<1){dx=p.team===0?1:-1;dy=0;len=1;}
 const stats=HEROES[p.character].stats;
 const shotSpeed=b.counterReady ? stats.counterSpeed : stats.shotSpeed;
 const speed=special?1050:passing?stats.passSpeed:shotSpeed;
 b.counterReady=false;
 b.dodged=null;
 b.special=special;
 if(special)p.specialCooldown=60;
 b.holder=null;b.owner=p.id;b.team=p.team;b.live=!passing;b.pass=passing;b.age=0;b.loose=0;b.held=0;
 b.x=p.x+dx/len*25;b.y=p.y+dy/len*25;b.vx=dx/len*speed;b.vy=dy/len*speed;
 p.throwFlash=.22;p.face=dx>=0?1:-1;
 emit(g,special?'special':passing?'pass':'throw',{player:p.id,x:p.x,y:p.y,team:p.team});return true;
}
function hold(g,p,type='pickup') {
 const b=g.ball;
 const stats=HEROES[p.character].stats;
 const receivedPass=type==='pickup' && b.pass && b.team===p.team && b.owner!==p.id;
 if(receivedPass && stats.relaySeconds) p.boostTime=stats.relaySeconds;
 b.counterReady=type==='catch' && stats.counterSpeed>stats.shotSpeed;
 // A pass that leads to a hit earns the passer an assist.
 b.assist=receivedPass?b.owner:null;
 b.special=false;
 b.holder=p.id;b.team=p.team;b.owner=p.id;b.x=p.x;b.y=p.y;b.vx=0;b.vy=0;b.live=false;b.pass=false;b.held=0;b.loose=0;emit(g,type,{player:p.id,x:p.x,y:p.y,team:p.team});}
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
 p.boostTime=HEROES[p.character].stats.rescueSeconds;
 p.prison=false;p.x=p.team===0?235:965;p.y=clamp(p.y,185,600);p.invulnerable=1.2;p.stun=.25;
 emit(g,'rescue',{player:p.id,x:p.x,y:p.y,team:p.team});return true;
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
function stepBall(g,dt) {
 const b=g.ball;
 if(b.holder){const p=g.players.find(p=>p.id===b.holder);if(!p){b.holder=null;return;}b.x=p.x;b.y=p.y;b.held+=dt;if(b.held>5){b.counterReady=false;b.holder=null;b.live=false;b.vx=(p.team===0?1:-1)*80;b.vy=0;b.x=p.x+(p.team===0?28:-28);b.loose=0;emit(g,'release',{player:p.id});}return;}
 const ox=b.x,oy=b.y;b.x+=b.vx*dt;b.y+=b.vy*dt;b.age+=dt;
 if(b.x<62||b.x>1138){b.x=clamp(b.x,62,1138);b.vx*=-.45;b.live=false;b.pass=false;}
 if(b.y<148||b.y>638){b.y=clamp(b.y,148,638);b.vy*=-.45;b.live=false;b.pass=false;}
 if(b.age>1.25){b.live=false;b.pass=false;}
 const ordered=[...g.players].sort((a,c)=>Math.hypot(a.x-ox,a.y-oy)-Math.hypot(c.x-ox,c.y-oy));
 for(const p of ordered) {
  if(p.id===b.owner&&b.age<.2)continue;
  const d=sweptDistance(p,ox,oy,b.x,b.y);
  if(b.live&&p.team!==b.team){
   if(!b.special&&d<HEROES[p.character].stats.catchRadius&&p.catchTime>0&&p.stun<=0){
    const sender=g.players.find(q=>q.id===b.owner);hold(g,p,'catch');p.catchTime=0;award(g,p,'catch');
    if(g.rules.catchEliminates&&sender&&!sender.prison)imprison(g,sender);
    if(g.rules.catchRescues){const prisoner=g.players.find(q=>q.team===p.team&&q.prison&&q.id!==p.id);if(prisoner)rescue(g,prisoner,p);}
    return;
   }
   if(d<FIELD.radius+7&&p.invulnerable<=0&&p.dashTime<=0&&p.stun<=0&&!p.prison){
    const thrower=g.players.find(q=>q.id===b.owner);imprison(g,p,thrower);b.live=false;b.vx*=.28;b.vy*=.28;b.loose=0;
    emit(g,'impact',{x:ox,y:oy,team:p.team});return;
   }
   if(d<FIELD.radius+7&&p.dashTime>0&&!p.prison&&!b.dodged?.includes(p.id)){(b.dodged||=[]).push(p.id);award(g,p,'dodge');}
  } else if(!b.live&&d<HEROES[p.character].stats.pickupRadius&&p.stun<=0){hold(g,p);return;}
 }
 if(!b.live&&!b.pass){
  const friction=Math.exp(-4*dt);b.vx*=friction;b.vy*=friction;b.loose+=dt;
  // A ball outside the reachable lanes is returned by the referee, not left stuck.
  if(b.loose>3){const team=b.x<600?0:1,candidates=g.players.filter(p=>p.team===team&&!p.prison);const p=nearest(b,candidates);if(p){hold(g,p,'referee');}}
 }
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
 // Resolve the team effect before movement so the roster order cannot grant a free dodge.
 for(const caster of g.players){
  if(!caster.input?.gaze || g.tick-caster.lastInput>22 || caster.gazeCooldown>0 || caster.stun>0)continue;
  const rivals=g.players.filter(player=>player.team!==caster.team);
  if(rivals.every(player=>player.slowed>0))continue;
  caster.gazeCooldown=60;
  for(const rival of rivals){
   if(rival.slowed<=0)rival.slowed=10;
   rival.dashTime=0;
  }
  emit(g,'gaze',{player:caster.id,x:caster.x,y:caster.y,team:caster.team});
 }
 for(const p of g.players) {
  const stats=HEROES[p.character].stats;
  for(const key of ['boostTime','catchTime','catchCooldown','dashTime','dashCooldown','invulnerable','stun','throwFlash','specialCooldown','gazeCooldown','slowed'])p[key]=Math.max(0,p[key]-dt);
  let input=p.bot?aiInput(g,p):p.input;
  if(!input||(!p.bot&&g.tick-p.lastInput>22))input={mx:0,my:0,ax:p.x+p.face*100,ay:p.y};
  p.face=input.ax>=p.x?1:-1;
  if(input.catch&&p.catchCooldown<=0&&g.ball.holder!==p.id&&p.stun<=0){p.catchTime=stats.catchWindow;p.catchCooldown=stats.catchRecovery;emit(g,'guard',{player:p.id,x:p.x,y:p.y});}
  if(input.dash&&p.slowed<=0&&p.dashCooldown<=0&&p.stun<=0){p.dashTime=.2;p.dashCooldown=stats.dashRecovery;p.dashX=input.mx||0;p.dashY=input.my||0;if(!p.dashX&&!p.dashY)p.dashY=p.y>390?-1:1;emit(g,'dodge',{player:p.id,x:p.x,y:p.y});}
  if(input.special)throwBall(g,p,{x:input.ax,y:input.ay},false,true);
  if(input.fire)throwBall(g,p,{x:input.ax,y:input.ay});
  if(input.pass)throwBall(g,p,{x:input.ax,y:input.ay},true);
  let mx=p.dashTime>0?p.dashX:input.mx||0,my=p.dashTime>0?p.dashY:input.my||0;
  const len=Math.hypot(mx,my);if(len>1){mx/=len;my/=len;}
  const runSpeed=g.ball.holder===p.id?stats.carrySpeed:stats.runSpeed;
  const speed=p.stun>0?0:p.dashTime>0?stats.dashSpeed:runSpeed*(p.boostTime>0?1.25:1);
  const pace=p.slowed>0?speed*.5:speed;
  p.vx=mx*pace;p.vy=my*pace;
  const area=bounds(p);p.x=clamp(p.x+p.vx*dt,area.left,area.right);p.y=clamp(p.y+p.vy*dt,area.top,area.bottom);
  if(p.input)p.input.gaze=p.input.special=p.input.fire=p.input.catch=p.input.dash=p.input.pass=false;
 }
 // Separate teammates gently; collisions never push anyone across a line.
 for(let i=0;i<g.players.length;i++)for(let j=i+1;j<g.players.length;j++){
  const a=g.players[i],b=g.players[j];if(a.team!==b.team||a.prison!==b.prison)continue;
  const d=distance(a,b);if(d<33){const dx=d?(a.x-b.x)/d:1,dy=d?(a.y-b.y)/d:0,push=(33-d)*.5;for(const [p,sign] of [[a,1],[b,-1]]){const r=bounds(p);p.x=clamp(p.x+dx*push*sign,r.left,r.right);p.y=clamp(p.y+dy*push*sign,r.top,r.bottom);}}
 }
 stepBall(g,dt);checkWin(g);return g;
}
export function snapshot(g) {
 // Only public game state, not command mailboxes, RNG or connection credentials.
 return {v:1,tick:g.tick,time:g.time,phase:g.phase,phaseTime:g.phaseTime,paused:g.paused,round:g.round,roundLeft:g.roundLeft,scores:[...g.scores],winner:g.winner,roundWinner:g.roundWinner,rules:g.rules,
 players:g.players.map(({input,lastInput,aiThink,aiAim,...p})=>({...p,x:Math.round(p.x*10)/10,y:Math.round(p.y*10)/10})),ball:{...g.ball},events:g.events};
}
