import {paintCharacter,TEAM_COLORS} from './characters.js';
import {FIELD,passTarget} from './sim.js';
import {playerLook,auraUnder,auraOver,drawNets,ballLook,drawBurst,drawBanner,drawPips,drawPassMark,drawTagged,loadFaces,FX_EVENTS,BURST,BANNER} from './ultfx.js';
const TAU=Math.PI*2;
// Someone who asked their device for less motion gets no screen shake.
const calm=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const rounded=(c,x,y,w,h,r=12)=>{c.beginPath();c.roundRect(x,y,w,h,r);};
function text(c,s,x,y,size=20,color='#e5f1ee',align='center',weight=800){c.fillStyle=color;c.font=`${weight} ${size}px "Trebuchet MS",system-ui,sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
export class ArenaRenderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');canvas.width=FIELD.width;canvas.height=FIELD.height;this.ctx.imageSmoothingEnabled=false;this.background=document.createElement('canvas');this.background.width=1200;this.background.height=760;this.buildBackground();this.lastEvent=0;this.fx=[];this.trail=[];this.lastBallTick=-1;this.ghosts=new Map();this.shake=0;loadFaces();}
 buildBackground(){
  const c=this.background.getContext('2d');
  c.fillStyle='#172638';c.fillRect(0,0,FIELD.width,FIELD.height);
  const court = new Image();
  court.onload = () => {
   c.imageSmoothingEnabled=false;
   c.drawImage(court,0,0,FIELD.width,FIELD.height);
   for(const [x,label,color] of [[105,'CÁRCEL RAYOS','#ffead0'],[1095,'CÁRCEL COMETAS','#cdffef']]){
    c.save();c.translate(x,390);c.rotate(-Math.PI/2);text(c,label,0,0,14,color);c.restore();
   }
  };
  court.src = new URL('./assets/court.webp',import.meta.url).href;
 }
 render(g,localId,controls={},latency=0,now=performance.now(),online=false) {
  const c=this.ctx;this.localId=localId;c.clearRect(0,0,1200,760);c.drawImage(this.background,0,0);
  if(!g)return;
  for(const e of g.events||[])if(e.id>this.lastEvent&&e.type==='ult')this.shake=now+260;
  const shaking=!calm&&now<this.shake;
  if(shaking){c.save();c.translate(Math.round(Math.sin(now*.09)*5),Math.round(Math.cos(now*.13)*4));c.drawImage(this.background,0,0);}
  const local=g.players.find(p=>p.id===localId),active=[0,1].map(team=>g.players.filter(p=>p.team===team&&!p.prison).length);
  for(let team=0;team<2;team++){
   const x=team===0?272:658;c.fillStyle='#10263a';rounded(c,x,13,270,63,12);c.fill();c.strokeStyle=TEAM_COLORS[team].dark;c.lineWidth=2;c.stroke();
   text(c,TEAM_COLORS[team].name,x+20,34,17,TEAM_COLORS[team].light,'left');text(c,`${active[team]} EN CAMPO`,x+20,57,11,'#9cbacb','left');text(c,String(g.scores[team]),x+236,43,40,TEAM_COLORS[team].light);
  }
  const seconds=Math.max(0,Math.ceil(g.roundLeft));text(c,`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`,600,35,32,seconds<20?'#ffb183':'#fff0b7');text(c,`RONDA ${g.round}`,600,66,11,'#9bb3c9');
  // Aim aid is visual only; the host still validates the input and collision.
  if(local&&g.ball.holder===local.id&&g.phase==='playing'){
   const dx=(controls.ax??(local.team===0?1000:200))-local.x,dy=(controls.ay??local.y)-local.y,len=Math.hypot(dx,dy)||1;
   c.save();c.strokeStyle='#fff9c0aa';c.lineWidth=2;c.setLineDash([5,8]);c.beginPath();c.moveTo(local.x,local.y-16);c.lineTo(local.x+dx/len*Math.min(len,210),local.y+dy/len*Math.min(len,210)-16);c.stroke();c.restore();
  }
  drawNets(c,g);
  // Leo's copies stand among the players. Only his rivals see them as solid.
  const copies=(g.decoys||[]).map(copy=>({...copy,copy:true}));
  if(g.tick!==this.lastBallTick)this.remember(g);
  const ordered=[...g.players,...copies].sort((a,b)=>a.y-b.y);
  for(const p of ordered)this.drawPlayer(c,g,p,local,now);
  // With the ball in hand, show who would get the pass.
  if(local&&g.ball.holder===local.id&&g.phase==='playing'){const mate=passTarget(g,local,{x:controls.ax??local.x,y:controls.ay??local.y});if(mate)drawPassMark(c,mate,g);}
  const b=g.ball;
  let bx=b.x,by=b.y-13;
  if(b.holder){const owner=g.players.find(p=>p.id===b.holder);if(owner){bx=owner.x+owner.face*23*playerLook(owner).scale;by=owner.y-20*playerLook(owner).scale;}this.trail.length=0;}
  else {
   if(g.tick!==this.lastBallTick){this.trail.push({x:bx,y:by});if(this.trail.length>(b.kind?12:7))this.trail.shift();}
   if(b.live){if(!b.kind)this.trail.forEach((p,i)=>{c.fillStyle=`rgba(255,229,151,${i/30})`;c.beginPath();c.arc(p.x,p.y,4+i*.5,0,TAU);c.fill();});if(!b.kind)by-=Math.sin(Math.min(b.age/1.25,1)*Math.PI)*13;}
   // A pass is a lob: it rises over the players and comes down on its receiver.
   if(b.pass&&b.flight)by-=Math.sin(Math.min(b.age/b.flight,1)*Math.PI)*(30+b.flight*40);
   c.fillStyle='#0a24354d';c.beginPath();c.ellipse(b.x,b.y+5,b.big?18:10,b.big?7:4,0,0,TAU);c.fill();
  }
  this.lastBallTick=g.tick;
  const size=b.holder?9:ballLook(c,g,b,bx,by,now,this.trail);
  c.fillStyle=b.live?'#ffe67a':'#ffca64';c.strokeStyle='#6d4828';c.lineWidth=2;c.beginPath();c.arc(bx,by,size,0,TAU);c.fill();c.stroke();c.strokeStyle='#e07c3e';c.lineWidth=2;c.beginPath();c.arc(bx+size*.55,by,size,1.9,4.3);c.stroke();c.fillStyle='#fff6c0';c.fillRect(bx-size*.45,by-size*.55,size*.45,size*.35);
  if(!b.holder&&!b.live&&!b.magnet&&!b.pass){text(c,'RECOGE',bx,by-20,9,'#fff3ba');}
  this.drawEffects(g,now);
  if(shaking)c.restore();
  // Abilities, player and points live in the page overlay (hud.js); the canvas keeps the court.
  if(local)text(c,latency?`${latency} ms`:online?'ONLINE':'LOCAL',1180,744,10,'#6f8ea3','right');
  if(g.phase!=='playing'||g.paused)this.overlay(g);
  // Before the round starts the arrow goes on top of the dimmed court, so everyone finds themselves.
  if(local&&g.phase==='countdown'&&!g.paused)this.drawSelfMark(c,g,local,playerLook(local).scale,now);
 }
 // Where each player under Centella has just been, for the streak behind them.
 remember(g){
  for(const p of g.players){
   if(p.flash<=0){this.ghosts.delete(p.id);continue;}
   const past=this.ghosts.get(p.id)||[];past.push({x:p.x,y:p.y});if(past.length>6)past.shift();this.ghosts.set(p.id,past);
  }
 }
 drawPlayer(c,g,p,local,now){
  const mine=p.id===this.localId,team=TEAM_COLORS[p.team],look=playerLook(p),scale=look.scale;
  // Teammates and the stands see a copy as a see-through figure; rivals cannot tell.
  const hollow=p.copy&&(!local||local.team===p.team);
  c.save();c.fillStyle='#0c233b40';c.beginPath();c.ellipse(p.x,p.y+9,22*scale,8*scale,0,0,TAU);c.fill();
  if(mine){
   // A gold ring that breathes under the player's own character.
   const pulse=(Math.sin(now/170)+1)/2;
   c.strokeStyle='#ffd24a';c.lineWidth=4;c.beginPath();c.ellipse(p.x,p.y+9,27*scale,11*scale,0,0,TAU);c.stroke();
   c.strokeStyle=`rgba(255,233,160,${.75-pulse*.6})`;c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y+9,(31+pulse*9)*scale,(13+pulse*4)*scale,0,0,TAU);c.stroke();
  }
  if(!p.copy)auraUnder(c,p,g);
  if(p.boostTime>0||p.turbo>0){
   c.fillStyle='#feeda2';
   for(let i=0;i<3;i++){
    const phase=(g.time*3+i/3)%1;
    c.fillRect(p.x-p.face*(10+phase*25),p.y-7+i*5,Math.max(2,8*(1-phase)),2);
   }
  }
  if(p.catchTime>0){c.strokeStyle='#a7ffef';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y-12,32,-2.7,.5);c.stroke();}
  if(p.dashTime>0){for(let i=1;i<4;i++){c.globalAlpha=.12*(4-i);c.save();c.translate(p.x-(p.dashX||0)*i*13,p.y-(p.dashY||0)*i*13);paintCharacter(c,p,{scale:.98,time:g.time});c.restore();}c.globalAlpha=1;}
  (this.ghosts.get(p.id)||[]).forEach((spot,i,past)=>{c.globalAlpha=.1+.08*i;c.save();c.translate(spot.x,spot.y+4);paintCharacter(c,p,{time:g.time-(past.length-i)*.05,tint:'rgba(255,225,74,.85)'});c.restore();});
  const tagged=!p.copy&&g.tagged?.includes(p.id);
  c.globalAlpha=(p.invulnerable>0?.72:1)*look.alpha*(hollow?.45:1)*(tagged&&Math.floor(now/110)%2?.45:1);
  c.translate(p.x,p.y+4);paintCharacter(c,p,{scale,time:g.time,selected:mine,holding:g.ball.holder===p.id,tint:look.tint});c.restore();
  if(!p.copy){c.save();auraOver(c,p,g,now);if(tagged)drawTagged(c,p,now);c.restore();}
  if(mine&&g.phase!=='countdown')this.drawSelfMark(c,g,p,scale,now);
  const name=mine?'TÚ':p.name+(p.bot?' · IA':'')+(hollow?' · COPIA':'');
  const below=p.y+24+(scale-1)*10;
  c.fillStyle=mine?'#ffedac':'#112d3bcc';const width=Math.max(30,name.length*5.6+12);rounded(c,p.x-width/2,below,width,17,4);c.fill();text(c,name,p.x,below+9,10,mine?'#39453c':team.light);
  // A copy shows the same dots as the real one.
  const real=p.copy?g.players.find(q=>q.id===p.owner):p;
  if(real&&!real.prison)drawPips(c,{...real,x:p.x},below+23);
 }
 // A big gold arrow over the player's own character, larger still while the round is about to start.
 drawSelfMark(c,g,p,scale,now){
  const waiting=g.phase==='countdown',size=waiting?1.7:1,bob=Math.sin(now/150)*4;
  const tip=p.y-64*scale-(p.slowed>0||p.turbo>0?16:0)+bob,half=13*size,tall=17*size;
  c.save();c.lineJoin='round';
  if(waiting){const close=(now/900)%1;c.strokeStyle=`rgba(255,210,74,${1-close})`;c.lineWidth=5;c.beginPath();c.arc(p.x,p.y-22,130-close*90,0,TAU);c.stroke();}
  c.beginPath();c.moveTo(p.x-half,tip-tall);c.lineTo(p.x+half,tip-tall);c.lineTo(p.x,tip);c.closePath();
  c.strokeStyle='#17233b';c.lineWidth=5;c.stroke();c.fillStyle='#ffd24a';c.fill();
  c.fillStyle='#fff3cf';c.beginPath();c.moveTo(p.x-half*.45,tip-tall+3);c.lineTo(p.x+half*.1,tip-tall+3);c.lineTo(p.x-half*.12,tip-tall*.45);c.closePath();c.fill();
  c.font=`900 ${Math.round(15*size)}px "Trebuchet MS",system-ui,sans-serif`;c.textAlign='center';c.textBaseline='alphabetic';
  c.lineWidth=5;c.strokeStyle='#17233b';c.strokeText(waiting?'ERES TÚ':'TÚ',p.x,tip-tall-5);c.fillStyle='#ffd24a';c.fillText(waiting?'ERES TÚ':'TÚ',p.x,tip-tall-5);
  c.restore();
 }
 drawEffects(g,now){
  const kept=['impact','catch','rescue','hit','dodge','points',...FX_EVENTS];
  for(const e of g.events||[])if(e.id>this.lastEvent){this.lastEvent=e.id;if(kept.includes(e.type))this.fx.push({...e,born:now,mine:e.player===this.localId});}
  this.fx=this.fx.filter(f=>now-f.born<(f.type==='ult'?Math.max(BURST,BANNER):f.type==='points'?1100:850));
  const c=this.ctx;
  for(const e of this.fx){
   if(FX_EVENTS.includes(e.type)){drawBurst(c,e,g,now);continue;}
   if(e.type==='points'){const age=(now-e.born)/1100;c.save();c.globalAlpha=Math.min(1,(1-age)*1.6);c.lineWidth=4;c.strokeStyle='#0b1b2e';c.lineJoin='round';c.font=`900 ${e.mine?24:15}px "Trebuchet MS",system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.strokeText('+'+e.amount,e.x,e.y-78-age*34);c.fillStyle=e.mine?'#ffe18b':'#fff6da';c.fillText('+'+e.amount,e.x,e.y-78-age*34);c.restore();continue;}
   const age=(now-e.born)/850,alpha=1-age;c.save();c.globalAlpha=alpha;
   const color=e.type==='catch'?'#b7fff1':e.type==='rescue'?'#d0f97e':e.type==='dodge'?'#bddfff':'#ffe49e';c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.arc(e.x,e.y-15,16+age*50,0,TAU);c.stroke();
   for(let i=0;i<9;i++){const a=i*TAU/9,d=15+age*70;c.fillStyle=color;c.fillRect(e.x+Math.cos(a)*d-3,e.y-15+Math.sin(a)*d-3,5,5);}
   if(e.type==='catch'||e.type==='rescue'){text(c,e.type==='catch'?'¡ATRAPADA!':'¡LIBERADO!',e.x,e.y-65-age*30,16,color);}
   c.restore();
  }
  // The newest ultimates announce themselves in banners, at most three at a time.
  const banners=this.fx.filter(e=>e.type==='ult'&&now-e.born<BANNER).slice(-3);
  banners.forEach((e,row)=>drawBanner(c,e,g,now,row));
 }
 overlay(g){const c=this.ctx;c.fillStyle='#071629a6';c.fillRect(55,140,1090,505);c.fillStyle='#11283bea';rounded(c,330,272,540,240,20);c.fill();c.strokeStyle='#c8a76d';c.lineWidth=3;c.stroke();
  if(g.paused){text(c,'PARTIDA EN PAUSA',600,350,32,'#ffe2a2');text(c,'El anfitrión reanuda cuando estéis preparados.',600,402,17,'#bbd4df');return;}
  if(g.phase==='countdown'){text(c,'¡PREPARADOS!',600,317,20,'#e5d09f');text(c,String(Math.max(1,Math.ceil(g.phaseTime))),600,388,82,'#ffe18b');text(c,'Mueve · Lanza · Atrapa · Esquiva',600,467,17,'#b6d8db');}
  else {const winner=g.phase==='matchOver'?g.winner:g.roundWinner;const team=winner===null?null:TEAM_COLORS[winner];text(c,g.phase==='matchOver'?'FIN DEL PARTIDO':'FIN DE RONDA',600,312,15,'#b4d0de');text(c,team?`¡${team.name} GANAN!`:'¡EMPATE!',600,368,36,team?.light||'#ffe19a');text(c,`${g.scores[0]}   —   ${g.scores[1]}`,600,424,33,'#ffebad');if(g.phase==='roundOver')text(c,`Siguiente en ${Math.ceil(g.phaseTime)}…`,600,475,15,'#c9d7e1');else text(c,'Buen juego. El próximo mate os espera.',600,476,15,'#c9d7e1');}
 }
}
