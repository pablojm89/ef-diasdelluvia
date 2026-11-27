import {atStoryMission} from '../comun/recorrido.js';
import {makeGame,stepGame,setInput,snapshot,normalizeRules,emit} from './sim.js';
import {HEROES,STATS} from './roster.js';
import {buildLineup} from './selection.js';
import {TEAM_COLORS,portrait} from './characters.js';
import {ArenaRenderer} from './renderer.js';
import {Room} from './network.js';
import {validCode} from './protocol.js';
import {buildBar,updateBar,attachStick,resultsMarkup} from './hud.js';
import {ultArt} from './abilities.js';
import {Prediction} from './predict.js';
import {record,topBar,player,mode as placeMode} from '../comun/lugar.js';
import {PINTADOS} from './assets/pista/pintados.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
topBar('La Pista');
for(const key of PINTADOS)document.body.classList.add('con-'+key);
// A pupil who came in from the hub already has a character: the menu starts on it and says so.
const hubHero=placeMode()==='pantalla'?null:player()?.avatar??null;
let selected=hubHero??0;
try{const saved=localStorage.getItem('mate-character'),n=Number(saved);if(saved!==null&&Number.isInteger(n)&&n>=0&&n<HEROES.length)selected=n;}catch{}
let lastLockerMarkup;
const slug=index=>HEROES[index].name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
// A painted portrait replaces the pixel one in the menus once it arrives (arte/lotes/15-pista.json).
function face(index){const key='retrato-'+slug(index);return PINTADOS.includes(key)?{src:new URL(`./assets/pista/${key}.webp`,import.meta.url).href,pixel:false}:{src:portrait(index),pixel:true};}
let view='menu',room=null,lobby=null,game=null,remote=null,previousRemote=null,remoteAt=0,localId='local',mode='training',busy=false,networkDisconnected=false;
let toastTimeout,lastFrame=performance.now(),accumulator=0,lastSend=0,lastBroadcast=0,lastAnnouncement=0,lastAudioEvent=0,latency=0,lastRemoteAt=0,lastUi=0;
let rules=normalizeRules(),manualAim=false,pointerAt=0,targetIndex=0,audio=null,lastDemo=0;
const keys=new Set(),actions={ult:false,fire:false,catch:false,dash:false,pass:false};
const aim={ax:900,ay:390},stick={x:0,y:0},prediction=new Prediction();
let shownPoints=0,resultsKey='',peeking=false,wantedFullscreen=false,matchRecorded=false,ultWasReady=true,readyChime=false;
// Fingers get a stick and ability circles; a keyboard gets the keys written under each circle.
function setInputMode(mode){if(document.body.dataset.input!==mode)document.body.dataset.input=mode;}
setInputMode(matchMedia('(pointer:coarse)').matches?'touch':'keys');
const renderer=new ArenaRenderer($('court')),demoRenderer=new ArenaRenderer($('preview'));
const demo=makeGame([],{teamSize:3,bestOf:3,roundSeconds:90},28473);demo.phase='playing';
function showView(next){if(next!=='game'&&view==='game')leaveFullscreen();view=next;for(const name of ['menu','lobby','game'])$(name+'-view').hidden=name!==next;document.body.dataset.view=next;if(next!=='game')clearKeys();window.scrollTo({top:0,behavior:'instant'});}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('show'),5500);}
function setBusy(value,message=''){busy=value;for(const id of ['host-button','train-button','join-button'])$(id).disabled=value;$('menu-status').textContent=message;}
function saveCharacter(){try{localStorage.setItem('mate-character',selected);}catch{}}
function heroCard(index, team = 0) {
 const hero = HEROES[index], {src, pixel} = face(index);
 return `<figure class="cromo team-${team}${pixel ? ' pixel' : ''}"><img src="${src}" alt="" width="96" height="96"></figure>
  <div class="bio"><p class="bio-name"><strong>${esc(hero.name)}</strong> <small>${esc(hero.tag)}</small></p>
  <h3><img class="ult-art" src="${ultArt(index)}" alt="" width="34" height="34"><span>Definitiva</span> ${esc(hero.ability)}</h3><p>${esc(hero.description)}</p>
  <p class="recharge">Se recarga en ${hero.ult.recharge} s de juego.</p>${index === hubHero ? '<p class="hub-badge">Tu personaje del Pabellón</p>' : ''}</div>`;
}
function drawChoices(){
 $('character-grid').innerHTML=HEROES.map((hero,index)=>
  `<button class="character-choice" data-character="${index}" aria-pressed="${index===selected}" aria-label="${esc(hero.name)}, ${esc(hero.ability)}">
   <img src="${portrait(index)}" alt="" width="64" height="64"><span>${esc(hero.name)}</span></button>`).join('');
 $('character-description').innerHTML = heroCard(selected);
}
function profile(){return {character:selected};}
function readRules(){return normalizeRules({teamSize:Number($('team-size').value),roundSeconds:Number($('round-seconds').value),bestOf:Number($('best-of').value),catchEliminates:$('catch-eliminates').checked,catchRescues:$('catch-rescues').checked});}
function fillRules(r,host){$('team-size').value=r.teamSize;$('round-seconds').value=r.roundSeconds;$('best-of').value=r.bestOf;$('catch-eliminates').checked=r.catchEliminates;$('catch-rescues').checked=r.catchRescues;for(const el of $('rules-form').elements)el.disabled=!host;}
function storageKey(code){return 'mate-resume-'+code;}
function resumeFor(code){try{return JSON.parse(sessionStorage.getItem(storageKey(code)))||{};}catch{return {};}}
function callbacks(){
 return {
  onStatus(message){$('connection-label').textContent=message;},
  onError(message){toast(message);if(busy)$('menu-status').textContent=message;},
  onWelcome(data){localId=data.id;try{sessionStorage.setItem(storageKey(data.code),JSON.stringify({clientId:data.clientId,resumeToken:data.resumeToken}));}catch{}},
  onLobby(data){
   lobby=data;rules=normalizeRules(data.rules);
   if(room?.isHost)localId=room.myId;
   if(!data.started){
    if(view==='game'){game=null;remote=null;previousRemote=null;room.started=false;}
    if(view!=='lobby')showView('lobby');
    renderLobby();
   }
  },
  onStart(data){
   clearKeys();networkDisconnected=false;$('connection-overlay').hidden=true;mode='online';localId=room.myId;targetIndex=0;manualAim=false;lastAnnouncement=0;lastAudioEvent=0;renderer.lastEvent=0;renderer.fx=[];
   if(room.isHost){game=makeGame(data.members,data.rules,crypto.getRandomValues(new Uint32Array(1))[0]);remote=null;}
   else {game=null;remote=null;previousRemote=null;lastRemoteAt=performance.now();}
   accumulator=0;showView('game');updateMatchUI();$('court').focus({preventScroll:true});
  },
  onInput(id,input){if(game&&room?.isHost)setInput(game,id,input);},
  onState(state){previousRemote=remote;remote=state;remoteAt=performance.now();lastRemoteAt=remoteAt;networkDisconnected=false;$('connection-overlay').hidden=true;if(view!=='game'){showView('game');updateMatchUI();}updateStateUI(state);},
  onLatency(ms){latency=ms;$('connection-label').textContent=`${room?.transport==='relay'?'Relevo WSS':'Conexión directa'} · ${ms} ms`;},
  onParticipant(id,connected){if(game&&room?.isHost){const p=game.players.find(p=>p.id===id);if(p){p.bot=!connected;p.input=null;emit(game,connected?'reconnect':'disconnect',{player:id});toast(connected?`${p.name} vuelve a la pista.`:`La IA cubre a ${p.name} mientras vuelve.`);}}},
  onDisconnect(message){
   if(room?.closed)return;
   networkDisconnected=true;clearKeys();$('connection-label').textContent='Conexión interrumpida';
   if(view==='game'){$('connection-message').textContent=message;$('connection-overlay').hidden=false;$('reconnect-button').hidden=false;}
   else {showView('menu');setBusy(false,message);$('room-code').value=room?.code||'';}
  },
 };
}
function renderLobby(){
 if(!lobby||!room)return;
 const roster=lobby.members.filter(m=>m.connected),me=roster.find(m=>m.id===room.myId),host=room.isHost;
 $('lobby-code').textContent=room.code;
 $('lobby-instruction').textContent=host?'Comparte el código. Puedes empezar cuando todos estén listos.':'Elige equipo y marca «Estoy listo». El anfitrión inicia la partida.';
 fillRules(lobby.rules,host);
 $('lobby-teams').innerHTML=[0,1].map(team=>{
  const members=roster.filter(m=>m.team===team);
  return `<article class="team-card team-${team}"><h2>${TEAM_COLORS[team].name}<small>${members.length} de ${lobby.rules.teamSize} en la sala</small></h2>${buildLineup(roster, team, lobby.rules.teamSize).map(({member:m,character})=>{
   return m?`<div class="player-slot ${m.id===room.myId?'mine':''}"><img src="${portrait(m.character,team)}" alt="" width="44" height="44"><div><strong>${esc(m.name)}${m.id===room.myId?' · TÚ':''}</strong><small>${m.host?'Anfitrión':'En la sala'} · ${esc(HEROES[m.character].ability)}</small></div><span class="${m.ready?'ready-tag':'wait-tag'}">${m.ready?'Listo':'Preparándose'}</span></div>`:`<div class="player-slot empty"><img src="${portrait(character,team)}" alt="" width="44" height="44"><div><strong>${esc(HEROES[character].name)}</strong><small>Plaza libre · la juega la máquina</small></div></div>`;
  }).join('')}</article>`;
 }).join('');
 const ownTeam = me?.team ?? 0, ownHero = me?.character ?? selected;
 if(me && selected!==ownHero){ selected=ownHero; saveCharacter(); drawChoices(); }
 const occupied = new Set(lobby.members.filter(m=>m.team===ownTeam && m.id!==room.myId).map(m=>m.character));
 const hadSelectFocus = document.activeElement?.id==='lobby-character';
 const lockerMarkup = `<div class="dossier">${heroCard(ownHero,ownTeam)}</div>
  <label for="lobby-character">Tu personaje en este equipo</label>
  <select id="lobby-character">${HEROES.map((hero,index)=>
   `<option value="${index}" ${index===ownHero?'selected':''} ${occupied.has(index)?'disabled':''}>${esc(hero.name)} · ${esc(hero.ability)}${occupied.has(index)?' (ocupado)':''}</option>`).join('')}</select>
  <p>Un personaje por equipo. El equipo rival puede elegir el mismo.</p>`;
 if (lastLockerMarkup !== lockerMarkup) {
  $('lobby-self').innerHTML = lockerMarkup;
  lastLockerMarkup = lockerMarkup;
  if (hadSelectFocus) $('lobby-character').focus({preventScroll:true});
 }
 $('lobby-character').value = String(ownHero);
 document.querySelectorAll('[data-team]').forEach(button=>{
  const team = Number(button.dataset.team);
  button.setAttribute('aria-pressed',String(team===ownTeam));
  button.disabled=team!==ownTeam && roster.filter(member=>member.team===team).length>=lobby.rules.teamSize;
 });
 $('ready-button').hidden=host;$('start-button').hidden=!host;$('copy-watch').hidden=!host;
 $('ready-button').textContent=me?.ready?'Listo ✓ · Cambiar':'Estoy listo';
 const waiting=roster.filter(m=>!m.ready).length;
 $('start-button').disabled=waiting>0;
 $('ready-status').textContent=waiting?`${waiting} compañero${waiting===1?'':'s'} preparándose. Las plazas libres se completan con IA.`:'Todos listos. Las plazas libres se completan con IA.';
}
async function hostRoom(){
 if(busy)return;stopRoom();mode='online';setBusy(true,'Conectando con el servicio de salas…');const next=new Room(callbacks());room=next;
 try{await next.host(profile(),rules);if(room===next){localId=next.myId;setBusy(false);}}catch(error){if(room===next){next.close();room=null;showView('menu');setBusy(false,error.message);}}
}
async function joinRoom(code){
 code=code.trim().toUpperCase();if(!validCode(code)){toast('Escribe el código de seis letras o números de tu compañero.');return;}
 if(busy)return;const resume=resumeFor(code);stopRoom();mode='online';setBusy(true,'Buscando la sala y conectando los ordenadores…');const next=new Room(callbacks());room=next;
 try{await next.join(code,profile(),resume);if(room===next){localId=next.myId;setBusy(false);}}catch(error){if(room===next){next.close();room=null;showView('menu');setBusy(false,error.message);$('room-code').value=code;}}
}
function stopRoom(){prediction.reset();room?.close();room=null;lobby=null;game=null;remote=null;previousRemote=null;networkDisconnected=false;latency=0;clearKeys();}
function training(){
 if(busy)return;enterFullscreen();stopRoom();mode='training';localId='local';targetIndex=0;manualAim=false;game=makeGame([{id:localId,team:0,character:selected,name:HEROES[selected].name}],rules,crypto.getRandomValues(new Uint32Array(1))[0]);lastAnnouncement=0;lastAudioEvent=0;renderer.lastEvent=0;renderer.fx=[];accumulator=0;$('connection-label').textContent='ENTRENAMIENTO LOCAL';$('connection-overlay').hidden=true;showView('game');updateMatchUI();$('court').focus({preventScroll:true});
}
// The match takes the whole screen. Browsers only allow it right after a tap or key press.
async function enterFullscreen(){
 if(document.fullscreenElement||!document.documentElement.requestFullscreen)return;
 try{await document.documentElement.requestFullscreen({navigationUI:'hide'});wantedFullscreen=true;await screen.orientation?.lock?.('landscape');}catch{}
}
function leaveFullscreen(){if(wantedFullscreen&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});wantedFullscreen=false;}
function controlHint(){return document.body.dataset.input==='touch'?'Palanca para moverte · Arrastra LANZAR para apuntar · El círculo dorado es tu definitiva.':'Espacio lanza · E atrapa al vuelo · Shift esquiva · F lanza tu definitiva cuando se cargue.';}
function updateMatchUI(){
 $('match-mode').textContent=mode==='online'?`SALA ${room?.code||''}`:'ENTRENAMIENTO';
 const member = lobby?.members.find(m=>m.id===localId);
 showMatchHero(member?.character ?? selected, member?.team ?? 0);
 $('pause-button').hidden=mode==='online'&&!room?.isHost;
 $('rematch-button').hidden=true;$('results').hidden=true;resultsKey='';peeking=false;shownPoints=0;matchRecorded=false;ultWasReady=true;$('match-points').textContent='0';
 $('match-announcement').textContent=controlHint();
}
function showMatchHero(index,team) {
 const hero = HEROES[index];
 $('match-player').textContent = hero.name + ' · ' + TEAM_COLORS[team].name;
 $('match-talent-name').textContent = hero.ability;
 $('match-talent-detail').textContent = hero.description;
 $('match-portrait').src = portrait(index,team);
 $('match-talent-art').src = ultArt(index);
 $('game-view').dataset.team = team;
 buildBar($('ability-bar'), index);
}
function currentState(){return game||remote;}
function updateStateUI(state){
 if(!state)return;
 const mine=state.players.find(p=>p.id===localId);
 $('pause-button').dataset.paused=String(!!state.paused);$('pause-button').setAttribute('aria-label',state.paused?'Reanudar':'Pausar');
 if(mine&&mine.points!==shownPoints){const chip=$('score-button');$('match-points').textContent=mine.points;if(mine.points>shownPoints){chip.classList.remove('bump');void chip.offsetWidth;chip.classList.add('bump');}shownPoints=mine.points;}
 showResults(state);
 $('game-view').dataset.phase=state.phase;
 $('rematch-button').hidden=state.phase!=='matchOver'||(mode==='online'&&!room?.isHost);
 $('rematch-button').textContent=mode==='online'?'Volver a la sala':'Jugar otra partida';
 if(mine && $('match-talent-name').textContent!==HEROES[mine.character].ability)showMatchHero(mine.character,mine.team);
 const event=state.events?.findLast(e=>e.id>lastAnnouncement&&['ult','save','catch','hit','rescue','round','match','referee'].includes(e.type));
 if(event){lastAnnouncement=event.id;const p=state.players.find(p=>p.id===event.player);const messages={save:`¡${state.players.find(q=>q.id===event.by)?.name||'Un compañero'} atrapa el rebote y salva a ${p?.name||'su compañero'}!`,ult:`¡${p?.name||'Un jugador'} desata ${p?HEROES[p.character].ability.replace(/[¡!]/g,''):'su definitiva'}!`,catch:`¡${p?.name||'Un jugador'} atrapa al vuelo!`,hit:`${p?.name||'Un jugador'} va a la cárcel. Puede volver si alcanza a un rival.`,rescue:`¡${p?.name||'Un jugador'} vuelve al campo!`,round:event.winner===null?'Ronda empatada.':`Ronda para ${TEAM_COLORS[event.winner??0].name}.`,match:event.winner===null?'¡Partido empatado! Buen juego.':`¡${TEAM_COLORS[event.winner??0].name} ganan el partido!`,referee:'El árbitro devuelve una pelota que había quedado fuera de alcance.'};$('match-announcement').textContent=messages[event.type];}
 if(mine?.prison&&!event)$('match-announcement').textContent='Estás en la cárcel detrás del rival. Si le das a un jugador de campo, vuelves a jugar.';
 // Tell the player the moment the ultimate is charged.
 const ultReady=!!mine&&mine.ultCooldown<=0;
 if(ultReady&&!ultWasReady){$('match-announcement').textContent=`¡${HEROES[mine.character].ability.replace(/[¡!]/g,'')} a punto! ${document.body.dataset.input==='touch'?'Toca el círculo dorado.':'Pulsa F.'}`;readyChime=true;}
 if(mine)ultWasReady=ultReady;}
// The table of every player's points: fixed at the end of the match, or a peek while Tab is held.
function showResults(state){
 const over=state.phase==='matchOver';
 if(over&&!matchRecorded){
  // One line per finished match in the player's record.
  matchRecorded=true;
  const mine=state.players.find(p=>p.id===localId);
  if(mine)record('pista','mate','partido',{modo:mode==='online'?'online':'entrenamiento',resultado:state.winner===null?'empate':state.winner===mine.team?'victoria':'derrota',puntos:mine.points||0,dianas:mine.hits||0,atrapadas:mine.catches||0,esquivas:mine.dodges||0,asistencias:mine.assists||0,rescates:mine.rescues||0});
 }
 if(!over&&!peeking){if(!$('results').hidden){$('results').hidden=true;resultsKey='';}return;}
 const key=(over?'end':'peek')+state.players.map(p=>p.points||0).join()+state.scores.join();
 if(key===resultsKey)return;
 resultsKey=key;
 const winner=state.winner;
 $('results-kicker').textContent=over?'FIN DEL PARTIDO':'';
 $('results-title').textContent=!over?'Tabla de puntos':winner===null?'¡Empate! Buen juego':`¡${TEAM_COLORS[winner].name} ganan el partido!`;
 const nextIsTatami=over && atStoryMission(2);
 $('to-tatami').hidden=$('walk-off').hidden=!nextIsTatami;
 $('results-body').innerHTML=resultsMarkup(state,localId);
 $('results').classList.toggle('peek',!over);
 $('results').hidden=false;
}
function peek(on){if(peeking===on)return;peeking=on;const state=currentState();if(state)showResults(state);}
function clearKeys(){stick.x=stick.y=0;peek(false);keys.clear();for(const key of Object.keys(actions))actions[key]=false;}
function aimFor(state){
 const mine=state?.players.find(p=>p.id===localId);
 if(!mine)return {...aim};
 if(manualAim&&performance.now()-pointerAt<8000)return {...aim};
 // Leo's copies look real to the aim aid too.
 const candidates=[...state.players,...(state.decoys||[])].filter(p=>p.team!==mine.team&&!p.prison).sort((a,b)=>Math.hypot(a.x-mine.x,a.y-mine.y)-Math.hypot(b.x-mine.x,b.y-mine.y));
 const target=candidates[targetIndex%candidates.length];
 // Lead the target by the time the ball takes to reach it, so a rival walking in a straight line gets hit.
 const lead=target?Math.min(.45,Math.hypot(target.x-mine.x,target.y-mine.y)/STATS.shotSpeed):0;
 return target?{ax:target.x+target.vx*lead,ay:target.y+target.vy*lead}:{ax:mine.team===0?900:300,ay:390};
}
function controls(){const state=currentState();const kx=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),ky=(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0);return {mx:kx||stick.x,my:ky||stick.y,...aimFor(state),...actions};}
function consumeActions(){for(const key of Object.keys(actions))actions[key]=false;}
function togglePause(){
 if(!game||(mode==='online'&&!room?.isHost)||game.phase==='matchOver')return;
 game.paused=!game.paused;
 game.tick++;
 clearKeys();
 if(room?.isHost)room.broadcastState(snapshot(game));
 updateStateUI(game);
 if(!game.paused)$('court').focus({preventScroll:true});
}
// One short tone that slides from one pitch to another.
function sweep(type,from,to,seconds,volume,delay=0){
 const tone=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime+delay;
 tone.type=type;tone.frequency.setValueAtTime(from,t);tone.frequency.exponentialRampToValueAtTime(to,t+seconds*.8);
 gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.001,t+seconds);
 tone.connect(gain).connect(audio.destination);tone.start(t);tone.stop(t+seconds+.02);
}
function playSound(state){
 if(!$('sound-enabled').checked||!audio||audio.state!=='running'){readyChime=false;return;}
 for(const e of state.events||[])if(e.id>lastAudioEvent){lastAudioEvent=e.id;if(e.type==='ult'){sweep('sawtooth',180,900,.42,.05);sweep('square',90,45,.3,.03);continue;}
  if(e.type==='trick'){sweep('sawtooth',260,1100,.22,.05);continue;}
  if(e.type==='save'){sweep('sine',520,1040,.25,.05);continue;}
  if(!['throw','catch','hit','rescue','start','match'].includes(e.type))continue;
  const frequency={throw:320,catch:740,hit:130,rescue:880,start:520,match:660}[e.type];
  sweep(e.type==='throw'?'triangle':'sine',frequency,e.type==='throw'?150:frequency*1.35,.16,.04);
 }
 if(readyChime){readyChime=false;sweep('sine',660,990,.12,.04);sweep('sine',990,1320,.2,.04,.12);}
}
// What a guest draws: everyone else glides between the last two snapshots, and the guest's own
// player is placed where its controls have already taken it.
function interpolateRemote(now){
 if(!remote)return remote;
 const alpha=previousRemote?Math.min(1,Math.max(0,(now-remoteAt)/67)):1;
 const glide=(list,before)=>(list||[]).map(p=>{const prev=(before||[]).find(q=>q.id===p.id);if(!prev||prev.prison!==p.prison||Math.hypot(prev.x-p.x,prev.y-p.y)>180)return p;return {...p,x:prev.x+(p.x-prev.x)*alpha,y:prev.y+(p.y-prev.y)*alpha};});
 const players=glide(remote.players,previousRemote?.players);
 const mine=remote.players.find(p=>p.id===localId),index=remote.players.indexOf(mine);
 if(mine&&remote.phase==='playing'&&!remote.paused&&!networkDisconnected)players[index]={...mine,...prediction.place(mine,remote.ball.holder===localId,remoteAt,latency,now)};
 else prediction.reset();
 return {...remote,players,decoys:glide(remote.decoys,previousRemote?.decoys)};
}
function frame(now){
 const delta=Math.min((now-lastFrame)/1000,.1);lastFrame=now;
 if(view==='menu'){
  if(now-lastDemo>60){for(let i=0;i<2;i++)stepGame(demo);if(demo.phase==='matchOver'){demo.phase='countdown';demo.phaseTime=1;demo.round=0;demo.scores=[0,0];demo.phase='roundOver';demo.phaseTime=.1;}
   demoRenderer.render(demo,null,{},0,now);lastDemo=now;}
 } else if(view==='game'){
  const state=currentState();
  if(state)updateBar($('ability-bar'),state.players.find(p=>p.id===localId),state);
  if(game){
   accumulator+=delta;let steps=0;
   while(accumulator>=1/60&&steps<6){if(!game.paused){setInput(game,localId,controls());consumeActions();}stepGame(game);accumulator-=1/60;steps++;}
   if(room?.isHost&&now-lastBroadcast>=66){room.broadcastState(snapshot(game));lastBroadcast=now;}
   if(now-lastUi>100||$('game-view').dataset.phase!==game.phase){updateStateUI(game);lastUi=now;}playSound(game);renderer.render(game,localId,controls(),latency,now,mode==='online');
  } else if(remote){
   if(now-lastSend>=45&&!networkDisconnected){const sent=controls();room?.input(sent);prediction.record(sent,now);consumeActions();lastSend=now;}
   renderer.render(interpolateRemote(now),localId,controls(),latency,now,true);playSound(remote);
   if(now-lastRemoteAt>4500&&!networkDisconnected&&!remote.paused){networkDisconnected=true;$('connection-message').textContent='La partida ha dejado de responder. Espera unos segundos o intenta recuperar tu plaza.';$('connection-overlay').hidden=false;clearKeys();}
  } else renderer.render(demo,null,{},0,now);
 }
 requestAnimationFrame(frame);
}
$('character-grid').addEventListener('click',event=>{const b=event.target.closest('[data-character]');if(!b)return;selected=Number(b.dataset.character);saveCharacter();drawChoices();$('character-grid').querySelector(`[data-character="${selected}"]`).focus({preventScroll:true});});
$('train-button').addEventListener('click',training);$('host-button').addEventListener('click',hostRoom);
$('join-form').addEventListener('submit',event=>{event.preventDefault();joinRoom($('room-code').value);});
$('room-code').addEventListener('input',()=>{$('room-code').value=$('room-code').value.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,'');});
$('rules-form').addEventListener('change',()=>{if(room?.isHost)room.configure(readRules());});
$('lobby-self').addEventListener('change',event=>{if(event.target.id==='lobby-character'){room?.choose({character:Number(event.target.value)});}});
for(const b of document.querySelectorAll('[data-team]'))b.addEventListener('click',()=>room?.changeTeam(room.myId,Number(b.dataset.team)));
$('ready-button').addEventListener('click',()=>{if(document.body.dataset.input==='touch')enterFullscreen();const me=lobby?.members.find(m=>m.id===room?.myId);room?.ready(!me?.ready);});
$('start-button').addEventListener('click',()=>{enterFullscreen();room?.start();});
$('copy-invite').addEventListener('click',async()=>{if(!room)return;const invite=new URL(location.href);invite.search='';invite.searchParams.set('sala',room.code);try{await navigator.clipboard.writeText(invite.href);toast('Invitación copiada. Pásasela a tus compañeros.');}catch{toast(`Código de sala: ${room.code}. También puedes copiar la dirección de esta página.`);}});
// La Grada shows this room on the class screen as a spectator.
$('copy-watch').addEventListener('click',async()=>{if(!room)return;const link=new URL('../grada/#sala='+room.code,location.href).href;try{await navigator.clipboard.writeText(link);toast('Enlace de La Grada copiado. Ábrelo en la pantalla de clase.');}catch{toast(`Abre La Grada en la pantalla y escribe el código ${room.code}.`);}});
function leave(){if((view==='game'||view==='lobby')&&!confirm(room?.isHost?'¿Salir y cerrar la sala para todos?':'¿Salir de esta partida?'))return;stopRoom();setBusy(false);showView('menu');$('connection-label').textContent='';drawChoices();}
$('leave-lobby').addEventListener('click',leave);$('leave-game').addEventListener('click',leave);$('back-menu-button').addEventListener('click',()=>{stopRoom();showView('menu');setBusy(false);});
$('pause-button').addEventListener('click',togglePause);
$('rematch-button').addEventListener('click',()=>{if(mode==='online'&&room?.isHost){game=null;room.returnToLobby();}else training();});
$('reconnect-button').addEventListener('click',()=>{const code=room?.code;if(code){showView('menu');setBusy(false);joinRoom(code);}});
$('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement){wantedFullscreen=false;await document.exitFullscreen();}else{await document.documentElement.requestFullscreen({navigationUI:'hide'});wantedFullscreen=true;}}catch{toast('Este navegador no permite pantalla completa. El juego ya ocupa toda la ventana.');}$('court').focus({preventScroll:true});});
$('results-leave').addEventListener('click',()=>$('leave-game').click());
$('score-button').addEventListener('click',()=>peek(!peeking));
$('sound-enabled').addEventListener('change',async()=>{if($('sound-enabled').checked){try{audio ||= new (window.AudioContext||window.webkitAudioContext)();await audio.resume();lastAudioEvent=currentState()?.eventId||currentState()?.events?.at(-1)?.id||0;}catch{$('sound-enabled').checked=false;toast('El audio no está disponible en este navegador.');}}});
window.addEventListener('keydown',event=>{
 if(view!=='game'||networkDisconnected||event.target.matches('input,select,textarea'))return;
 if(event.code==='Tab'){event.preventDefault();peek(true);return;}
 const used=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','KeyE','ShiftLeft','ShiftRight','KeyQ','KeyR','KeyP','KeyF'];
 if(event.code==='Space' && event.target.closest('summary,button'))return;
 if(!used.includes(event.code))return;event.preventDefault();keys.add(event.code);setInputMode('keys');
 if(event.repeat)return;
 if(event.code==='KeyF')actions.ult=true;if(event.code==='Space')actions.fire=true;if(event.code==='KeyE')actions.catch=true;if(event.code.startsWith('Shift'))actions.dash=true;if(event.code==='KeyQ')actions.pass=true;if(event.code==='KeyR'){targetIndex++;manualAim=false;}if(event.code==='KeyP')togglePause();
});
window.addEventListener('keyup',event=>{keys.delete(event.code);if(event.code==='Tab')peek(false);});window.addEventListener('blur',clearKeys);
function pointerAim(event){const rect=$('court').getBoundingClientRect();aim.ax=(event.clientX-rect.left)/rect.width*1200;aim.ay=(event.clientY-rect.top)/rect.height*760+16;manualAim=true;pointerAt=performance.now();}
$('court').addEventListener('pointermove',event=>{if(view==='game'&&event.pointerType!=='touch')pointerAim(event);});
$('court').addEventListener('pointerdown',event=>{if(view!=='game'||networkDisconnected)return;event.preventDefault();$('court').focus({preventScroll:true});if(event.pointerType==='touch'){setInputMode('touch');return;}pointerAim(event);if(event.button===2)actions.catch=true;else actions.fire=true;});
$('court').addEventListener('contextmenu',event=>event.preventDefault());
attachStick($('stick-zone'),$('stick'),(x,y)=>{stick.x=x;stick.y=y;});
window.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')setInputMode('touch');},true);
// Ability circles. A finger can drag the throw circle to aim; letting go throws.
let drag=null;
function dragAim(event){
 const dx=event.clientX-drag.x,dy=event.clientY-drag.y,length=Math.hypot(dx,dy);
 if(length<18)return;
 const mine=currentState()?.players.find(p=>p.id===localId);
 if(!mine)return;
 drag.aimed=true;aim.ax=mine.x+dx/length*420;aim.ay=mine.y+dy/length*420;manualAim=true;pointerAt=performance.now();
}
$('ability-bar').addEventListener('pointerdown',event=>{
 const button=event.target.closest('[data-command]');
 if(!button||view!=='game'||networkDisconnected)return;
 event.preventDefault();
 const command=button.dataset.command;
 if(command==='fire'&&event.pointerType!=='mouse'){drag={id:event.pointerId,x:event.clientX,y:event.clientY,aimed:false};button.setPointerCapture(event.pointerId);return;}
 if(event.pointerType==='mouse'){manualAim=false;$('court').focus({preventScroll:true});}
 actions[command]=true;
});
$('ability-bar').addEventListener('pointermove',event=>{if(drag&&event.pointerId===drag.id)dragAim(event);});
$('ability-bar').addEventListener('pointerup',event=>{
 if(!drag||event.pointerId!==drag.id)return;
 // Keep a dragged aim just long enough for this throw; otherwise aim at the nearest rival.
 if(drag.aimed)pointerAt=performance.now()-7400;else manualAim=false;
 drag=null;actions.fire=true;
});
$('ability-bar').addEventListener('pointercancel',event=>{if(drag&&event.pointerId===drag.id){drag=null;manualAim=false;}});
$('ability-bar').addEventListener('contextmenu',event=>event.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearKeys();if(game&&!game.paused&&game.phase!=='matchOver'){game.paused=true;game.tick++;room?.broadcastState(snapshot(game));updateStateUI(game);}}});
window.addEventListener('pagehide',()=>room?.close());
// Read-only diagnostics expose public match state for repeatable network/browser checks.
Object.defineProperty(window,'mateDiagnostics',{value:()=>({view,role:mode==='training'?'training':room?.isHost?'host':'guest',code:room?.code||null,myId:localId,transport:room?(room.isHost?'WebRTC / WSS':room.transport==='relay'?'MQTT / WSS':'WebRTC DataChannel'):'local',connected:!networkDisconnected,network:room?{started:room.started,matchId:room.matchId}:null,latency,input:controls(),state:currentState()?snapshotLike(currentState()):null,roster:lobby?.members||[]}),writable:false});
function snapshotLike(s){return {tick:s.tick,phase:s.phase,paused:s.paused,round:s.round,scores:[...s.scores],players:s.players.map(p=>({id:p.id,x:p.x,y:p.y,prison:p.prison,bot:p.bot,team:p.team,character:p.character})),ball:{...s.ball}};}
drawChoices();showView('menu');
const inviteCode=new URLSearchParams(location.search).get('sala');if(inviteCode&&validCode(inviteCode.toUpperCase())){$('room-code').value=inviteCode.toUpperCase();$('menu-status').textContent='Invitación preparada. Elige tu personaje y pulsa «Entrar».';}
requestAnimationFrame(frame);
