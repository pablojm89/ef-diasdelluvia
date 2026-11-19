import {paintCharacter,TEAM_COLORS} from './characters.js';
import {FIELD} from './sim.js';
const TAU=Math.PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rounded=(c,x,y,w,h,r=12)=>{c.beginPath();c.roundRect(x,y,w,h,r);};
function text(c,s,x,y,size=20,color='#e5f1ee',align='center',weight=800){c.fillStyle=color;c.font=`${weight} ${size}px "Trebuchet MS",system-ui,sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);}
export class ArenaRenderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');canvas.width=FIELD.width;canvas.height=FIELD.height;this.ctx.imageSmoothingEnabled=false;this.background=document.createElement('canvas');this.background.width=1200;this.background.height=760;this.buildBackground();this.lastEvent=0;this.fx=[];this.trail=[];this.lastBallTick=-1;}
 buildBackground(){
  const c=this.background.getContext('2d');c.imageSmoothingEnabled=false;
  const bg=c.createLinearGradient(0,0,0,760);bg.addColorStop(0,'#18283f');bg.addColorStop(1,'#0e1c30');c.fillStyle=bg;c.fillRect(0,0,1200,760);
  // Stadium architecture, panels and spectator silhouettes, all drawn locally.
  c.fillStyle='#24364d';c.fillRect(0,86,1200,55);c.fillStyle='#34485a';c.fillRect(0,127,1200,8);
  for(let i=0;i<34;i++){const x=24+i*35;c.fillStyle=i%3===0?'#d6b87a':i%3===1?'#58acaa':'#997d85';c.fillRect(x,111+(i%2)*3,13,12);c.fillStyle='#182a3b';c.fillRect(x-2,121,18,10);}
  for(const x of [80,280,920,1120]){c.fillStyle='#56777e';c.fillRect(x-20,91,40,6);c.fillStyle='#fff0af';c.fillRect(x-16,92,32,3);}
  c.fillStyle='#514434';rounded(c,46,137,1108,513,15);c.fill();c.fillStyle='#cba56f';rounded(c,54,144,1092,500,10);c.fill();
  for(let y=145;y<644;y+=25){c.fillStyle=(y/25|0)%2?'#c39c69':'#d3ae78';c.fillRect(55,y,1090,24);for(let x=(y%50)*6;x<1145;x+=180){c.fillStyle='#ae875c';c.fillRect(x,y,2,24);}}
  c.fillStyle='#44a79caa';c.fillRect(159,145,441,499);c.fillStyle='#d57362aa';c.fillRect(600,145,441,499);
  c.fillStyle='#d76b5d';c.fillRect(60,150,90,489);c.fillStyle='#2b9b94';c.fillRect(1050,150,90,489);
  c.save();c.globalAlpha=.15;c.strokeStyle='#0b2232';c.lineWidth=7;for(let y=150;y<640;y+=34){c.beginPath();c.moveTo(65,y);c.lineTo(147,y+34);c.stroke();c.beginPath();c.moveTo(1052,y);c.lineTo(1138,y+34);c.stroke();}c.restore();
  c.strokeStyle='#fcf2c9';c.lineWidth=4;c.strokeRect(157,150,886,489);c.beginPath();c.moveTo(600,150);c.lineTo(600,640);c.stroke();c.lineWidth=3;c.beginPath();c.arc(600,394,88,0,TAU);c.stroke();c.beginPath();c.arc(600,394,34,0,TAU);c.stroke();
  c.save();c.globalAlpha=.16;c.fillStyle='#effad5';c.beginPath();c.moveTo(390,310);c.lineTo(340,388);c.lineTo(382,388);c.lineTo(357,460);c.lineTo(440,368);c.lineTo(397,368);c.closePath();c.fill();c.translate(405,0);c.beginPath();c.moveTo(390,310);c.lineTo(340,388);c.lineTo(382,388);c.lineTo(357,460);c.lineTo(440,368);c.lineTo(397,368);c.closePath();c.fill();c.restore();
  for(const x of [151,1045]){c.fillStyle='#152c3e';c.fillRect(x-3,144,6,503);c.fillStyle='#ffe9ac';for(let y=151;y<640;y+=34)c.fillRect(x-1,y,2,19);}
  c.save();c.translate(105,390);c.rotate(-Math.PI/2);text(c,'CÁRCEL RAYOS',0,0,14,'#ffddc4');c.restore();c.save();c.translate(1095,390);c.rotate(Math.PI/2);text(c,'CÁRCEL COMETAS',0,0,14,'#b0fff0');c.restore();
  for(const [x,label,color] of [[370,'COMETAS','#75efdf'],[830,'RAYOS','#ffb38e']]){c.fillStyle=color;rounded(c,x-85,654,170,26,7);c.fill();text(c,label,x,668,13,'#18323e');}
  c.fillStyle='#071627';c.fillRect(0,693,1200,67);c.fillStyle='#2d455c';c.fillRect(0,693,1200,2);
 }
 render(g,localId,controls={},latency=0,now=performance.now(),online=false) {
  const c=this.ctx;c.clearRect(0,0,1200,760);c.drawImage(this.background,0,0);
  if(!g)return;
  const local=g.players.find(p=>p.id===localId),active=[0,1].map(team=>g.players.filter(p=>p.team===team&&!p.prison).length);
  for(let team=0;team<2;team++){
   const x=team===0?55:845;c.fillStyle='#10263a';rounded(c,x,13,300,63,12);c.fill();c.strokeStyle=TEAM_COLORS[team].dark;c.lineWidth=2;c.stroke();
   text(c,TEAM_COLORS[team].name,x+20,34,17,TEAM_COLORS[team].light,'left');text(c,`${active[team]} EN CAMPO`,x+20,57,11,'#9cbacb','left');text(c,String(g.scores[team]),x+266,43,40,TEAM_COLORS[team].light);
  }
  const seconds=Math.max(0,Math.ceil(g.roundLeft));text(c,`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`,600,35,32,seconds<20?'#ffb183':'#fff0b7');text(c,`RONDA ${g.round} · MEJOR DE ${g.rules.bestOf}`,600,66,11,'#9bb3c9');
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
   if(p.catchTime>0){c.strokeStyle='#a7ffef';c.lineWidth=3;c.beginPath();c.arc(p.x,p.y-12,32,-2.7,.5);c.stroke();}
   if(p.dashTime>0){for(let i=1;i<4;i++){c.globalAlpha=.12*(4-i);c.save();c.translate(p.x-(p.dashX||0)*i*13,p.y-(p.dashY||0)*i*13);paintCharacter(c,p,{scale:1.1,time:g.time});c.restore();}c.globalAlpha=1;}
   if(p.invulnerable>0)c.globalAlpha=.72;
   c.translate(p.x,p.y+4);paintCharacter(c,p,{scale:1.22,time:g.time,selected:mine});c.restore();
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
  c.fillStyle=b.live?'#ffe67a':'#ffca64';c.strokeStyle='#6d4828';c.lineWidth=2;c.beginPath();c.arc(bx,by,9,0,TAU);c.fill();c.stroke();c.strokeStyle='#e07c3e';c.lineWidth=2;c.beginPath();c.arc(bx+5,by,9,1.9,4.3);c.stroke();c.fillStyle='#fff6c0';c.fillRect(bx-4,by-5,4,3);
  if(!b.holder&&!b.live){text(c,'RECOGE',bx,by-20,9,'#fff3ba');}
  this.drawEffects(g,now);
  if(local){
   const team=TEAM_COLORS[local.team];text(c,`${local.name.toUpperCase()} · ${team.name}`,25,714,13,team.light,'left');text(c,local.prison?'EN LA CÁRCEL: DA A UN RIVAL PARA VOLVER':b.holder===local.id?'TIENES LA PELOTA · APUNTA Y LANZA':'ESQUIVA, ATRAPA Y BUSCA LA PELOTA',25,738,11,'#a9c4d5','left');
   this.cooldown(c,620,'E  ATRAPAR',local.catchCooldown,1.05,local.catchTime>0,'#7eead7');this.cooldown(c,810,'SHIFT  ESQUIVAR',local.dashCooldown,1.4,local.dashTime>0,'#f4c779');
   text(c,latency?`${latency} ms`:online?'ONLINE':'LOCAL',1157,714,11,'#89abbd','right');text(c,'ESPACIO LANZA · Q PASA',1157,738,10,'#bdd0db','right');
  }
  if(g.phase!=='playing'||g.paused)this.overlay(g);
 }
 cooldown(c,x,label,left,total,active,color){c.fillStyle='#20364a';rounded(c,x,709,165,32,7);c.fill();c.fillStyle=active?color:left>0?'#6a796c':color;rounded(c,x+3,735,159*(1-clamp(left/total,0,1)),3,2);c.fill();text(c,left>0?`${label} ${left.toFixed(1)}`:label,x+82,724,11,active?'#fff5be':'#c9dde5');}
 drawEffects(g,now){
  for(const e of g.events||[])if(e.id>this.lastEvent){this.lastEvent=e.id;if(['impact','catch','rescue','hit','dodge'].includes(e.type))this.fx.push({...e,born:now});}
  this.fx=this.fx.filter(f=>now-f.born<850);
  for(const e of this.fx){const age=(now-e.born)/850,c=this.ctx,alpha=1-age;c.save();c.globalAlpha=alpha;
   const color=e.type==='catch'?'#b7fff1':e.type==='rescue'?'#d0f97e':e.type==='dodge'?'#bddfff':'#ffe49e';c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.arc(e.x,e.y-15,16+age*50,0,TAU);c.stroke();
   for(let i=0;i<9;i++){const a=i*TAU/9,d=15+age*70;c.fillStyle=color;c.fillRect(e.x+Math.cos(a)*d-3,e.y-15+Math.sin(a)*d-3,5,5);}
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
