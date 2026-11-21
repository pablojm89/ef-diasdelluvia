import {paintCharacter,TEAM_COLORS} from './characters.js';
import {FIELD} from './sim.js';
const TAU=Math.PI*2;
const rounded=(c,x,y,w,h,r=12)=>{c.beginPath();c.roundRect(x,y,w,h,r);};
function text(c,s,x,y,size=20,color='#e5f1ee',align='center',weight=800){c.fillStyle=color;c.font=`${weight} ${size}px "Trebuchet MS",system-ui,sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
export class ArenaRenderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');canvas.width=FIELD.width;canvas.height=FIELD.height;this.ctx.imageSmoothingEnabled=false;this.background=document.createElement('canvas');this.background.width=1200;this.background.height=760;this.buildBackground();this.lastEvent=0;this.fx=[];this.trail=[];this.lastBallTick=-1;}
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
  const ordered=[...g.players].sort((a,b)=>a.y-b.y);
  for(const p of ordered){
   const mine=p.id===localId,team=TEAM_COLORS[p.team];
   c.save();c.fillStyle='#0c233b40';c.beginPath();c.ellipse(p.x,p.y+9,22,8,0,0,TAU);c.fill();
   if(mine){c.strokeStyle='#ffeab0';c.lineWidth=3;c.beginPath();c.ellipse(p.x,p.y+9,26,11,0,0,TAU);c.stroke();}
   if(p.boostTime>0){
    c.fillStyle='#feeda2';
    for(let i=0;i<3;i++){
     const phase=(g.time*3+i/3)%1;
     c.fillRect(p.x-p.face*(10+phase*25),p.y-7+i*5,Math.max(2,8*(1-phase)),2);
    }
   }
   if(p.slowed>0){
    c.strokeStyle='#c7a1ff';c.lineWidth=2;c.beginPath();
    c.ellipse(p.x,p.y+8,23,8,0,0,TAU);c.stroke();
    text(c,'◈',p.x,p.y-52,15,'#e6c6ff');
   }
   if(p.catchTime>0){c.strokeStyle='#a7ffef';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y-12,32,-2.7,.5);c.stroke();}
   if(p.dashTime>0){for(let i=1;i<4;i++){c.globalAlpha=.12*(4-i);c.save();c.translate(p.x-(p.dashX||0)*i*13,p.y-(p.dashY||0)*i*13);paintCharacter(c,p,{scale:.98,time:g.time});c.restore();}c.globalAlpha=1;}
   if(p.invulnerable>0)c.globalAlpha=.72;
   c.translate(p.x,p.y+4);paintCharacter(c,p,{scale:1,time:g.time,selected:mine,holding:g.ball.holder===p.id});c.restore();
   const name=mine?'TÚ':p.name+(p.bot?' · IA':'');
   c.fillStyle=mine?'#ffedac':'#112d3bcc';const width=Math.max(30,name.length*5.6+12);rounded(c,p.x-width/2,p.y+24,width,17,4);c.fill();text(c,name,p.x,p.y+33,10,mine?'#39453c':team.light);
  }
  const b=g.ball;
  let bx=b.x,by=b.y-13;
  if(b.holder){const owner=g.players.find(p=>p.id===b.holder);if(owner){bx=owner.x+owner.face*23;by=owner.y-20;}}
  else {
   if(g.tick!==this.lastBallTick){this.lastBallTick=g.tick;this.trail.push({x:bx,y:by});if(this.trail.length>7)this.trail.shift();}
   if(b.live){this.trail.forEach((p,i)=>{c.fillStyle=`rgba(255,229,151,${i/30})`;c.beginPath();c.arc(p.x,p.y,4+i*.5,0,TAU);c.fill();});by-=Math.sin(Math.min(b.age/1.25,1)*Math.PI)*13;}
   c.fillStyle='#0a24354d';c.beginPath();c.ellipse(b.x,b.y+5,10,4,0,0,TAU);c.fill();
  }
  if(b.counterReady && b.holder){
   c.strokeStyle='#ffeda6';c.lineWidth=2;c.beginPath();c.arc(bx,by,13+Math.sin(g.time*12)*2,0,TAU);c.stroke();
  }
  if(b.live && b.special){
   c.save();
   c.translate(bx,by);
   c.rotate(Math.atan2(b.vy,b.vx));
   for(const [length,radius,color] of [[100,16,'#ab38daaa'],[70,11,'#ff7299'],[43,7,'#fff0aa']]){
    c.fillStyle=color;
    c.beginPath();c.moveTo(-length,Math.sin(g.time*34)*4);
    c.quadraticCurveTo(-18,-radius*2,6,-radius/2);
    c.quadraticCurveTo(20,0,4,radius);
    c.closePath();c.fill();
   }
   c.restore();
  }
  c.fillStyle=b.live?'#ffe67a':'#ffca64';c.strokeStyle='#6d4828';c.lineWidth=2;c.beginPath();c.arc(bx,by,9,0,TAU);c.fill();c.stroke();c.strokeStyle='#e07c3e';c.lineWidth=2;c.beginPath();c.arc(bx+5,by,9,1.9,4.3);c.stroke();c.fillStyle='#fff6c0';c.fillRect(bx-4,by-5,4,3);
  if(!b.holder&&!b.live){text(c,'RECOGE',bx,by-20,9,'#fff3ba');}
  this.drawEffects(g,now);
  // Abilities, player and points live in the page overlay (hud.js); the canvas keeps the court.
  if(local)text(c,latency?`${latency} ms`:online?'ONLINE':'LOCAL',1180,744,10,'#6f8ea3','right');
  if(g.phase!=='playing'||g.paused)this.overlay(g);
 }
 drawEffects(g,now){
  for(const e of g.events||[])if(e.id>this.lastEvent){this.lastEvent=e.id;if(['gaze','special','impact','catch','rescue','hit','dodge','points'].includes(e.type))this.fx.push({...e,born:now,mine:e.player===this.localId});}
  this.fx=this.fx.filter(f=>now-f.born<(f.type==='points'?1100:850));
  for(const e of this.fx){const c=this.ctx;
   if(e.type==='points'){const age=(now-e.born)/1100;c.save();c.globalAlpha=Math.min(1,(1-age)*1.6);c.lineWidth=4;c.strokeStyle='#0b1b2e';c.lineJoin='round';c.font=`900 ${e.mine?24:15}px "Trebuchet MS",system-ui,sans-serif`;c.textAlign='center';c.textBaseline='middle';c.strokeText('+'+e.amount,e.x,e.y-78-age*34);c.fillStyle=e.mine?'#ffe18b':'#fff6da';c.fillText('+'+e.amount,e.x,e.y-78-age*34);c.restore();continue;}
   const age=(now-e.born)/850,alpha=1-age;c.save();c.globalAlpha=alpha;
   const color=e.type==='catch'?'#b7fff1':e.type==='rescue'?'#d0f97e':e.type==='dodge'?'#bddfff':'#ffe49e';c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.arc(e.x,e.y-15,16+age*50,0,TAU);c.stroke();
   for(let i=0;i<9;i++){const a=i*TAU/9,d=15+age*70;c.fillStyle=color;c.fillRect(e.x+Math.cos(a)*d-3,e.y-15+Math.sin(a)*d-3,5,5);}
   if(e.type==='gaze'){c.strokeStyle='#deb2ff';c.beginPath();c.ellipse(e.x,e.y-42,16+age*32,7+age*10,0,0,TAU);c.stroke();text(c,'MIRADA INTENSA',e.x,e.y-70,15,'#e6c6ff');}
   if(e.type==='special')text(c,'¡IMPARABLE!',e.x,e.y-55-age*30,19,'#ffa6dc');
   if(e.type==='catch'||e.type==='rescue'){text(c,e.type==='catch'?'¡ATRAPADA!':'¡LIBERADO!',e.x,e.y-65-age*30,16,color);}
   c.restore();
  }
 }
 overlay(g){const c=this.ctx;c.fillStyle='#071629a6';c.fillRect(55,140,1090,505);c.fillStyle='#11283bea';rounded(c,330,272,540,240,20);c.fill();c.strokeStyle='#c8a76d';c.lineWidth=3;c.stroke();
  if(g.paused){text(c,'PARTIDA EN PAUSA',600,350,32,'#ffe2a2');text(c,'El anfitrión reanuda cuando estéis preparados.',600,402,17,'#bbd4df');return;}
  if(g.phase==='countdown'){text(c,'¡PREPARADOS!',600,317,20,'#e5d09f');text(c,String(Math.max(1,Math.ceil(g.phaseTime))),600,388,82,'#ffe18b');text(c,'Mueve · Lanza · Atrapa · Esquiva',600,467,17,'#b6d8db');}
  else {const winner=g.phase==='matchOver'?g.winner:g.roundWinner;const team=winner===null?null:TEAM_COLORS[winner];text(c,g.phase==='matchOver'?'FIN DEL PARTIDO':'FIN DE RONDA',600,312,15,'#b4d0de');text(c,team?`¡${team.name} GANAN!`:'¡EMPATE!',600,368,36,team?.light||'#ffe19a');text(c,`${g.scores[0]}   —   ${g.scores[1]}`,600,424,33,'#ffebad');if(g.phase==='roundOver')text(c,`Siguiente en ${Math.ceil(g.phaseTime)}…`,600,475,15,'#c9d7e1');else text(c,'Buen juego. El próximo mate os espera.',600,476,15,'#c9d7e1');}
 }
}
