import {challenges, families, moves} from './content.js';
import {eligibleChallenges, missionChallenge, createSequence, validSequence, recordAssessment, standings, leagueChallenge} from './engine.js';

const root = document.querySelector('#main');
const KEY = 'patio-interior-v1';
const fresh = () => ({seated:false, solo:false, mission:{step:0,offset:0}, dance:{sequence:createSequence(),phase:0,bpm:96}, league:null});
let state = fresh();
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && typeof saved.seated === 'boolean' && typeof saved.solo === 'boolean' &&
      Number.isInteger(saved.mission?.step) && saved.mission.step >= 0 && saved.mission.step <= 6 &&
      Number.isInteger(saved.mission.offset) && saved.mission.offset >= 0 && validSequence(saved.dance?.sequence) &&
      Number.isInteger(saved.dance.phase) && saved.dance.phase >= 0 && saved.dance.phase <= 2 &&
      [80,96,112,120].includes(saved.dance.bpm) && validLeague(saved.league)) state = saved;
} catch { /* El juego sigue disponible sin almacenamiento local. */ }
function validLeague(league) {
  if (league === null) return true;
  if (!Number.isInteger(league?.round) || league.round < 0 || league.round > 6 ||
      !Array.isArray(league.teams) || league.teams.length < 2 || league.teams.length > 6) return false;
  return league.teams.every(t => typeof t.name === 'string' && t.name.length < 30 &&
    Array.isArray(t.rounds) && t.rounds.length <= 6 && t.rounds.every(v => v === null ||
      (Array.isArray(v) && v.length === 3 && v.every(n => Number.isInteger(n) && n >= 0 && n <= 2))));
}
let storageWarning = false;
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { if(!storageWarning) { storageWarning = true; toast('Puedes jugar, pero este navegador no guardará el progreso.'); } } }
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastTimeout;
function toast(message) {
  const node = document.querySelector('#toast'); node.textContent = message;
  node.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(()=>node.classList.remove('show'),4500);
}

let timer = {remaining:0, end:0, running:false, interval:null};
let beatInterval = null, audioContext = null, beatNumber = 0;
function stopTimer() { clearInterval(timer.interval); timer.running = false; }
function timerMarkup(seconds) {
  return `<div class="timer-box" data-duration="${seconds}"><div><span class="eyebrow">Tiempo de práctica</span><output id="clock" aria-label="Tiempo restante">${formatTime(seconds)}</output></div><div class="timer-actions"><button class="button dark" data-action="timer">Iniciar</button><button class="button ghost" data-action="timer-reset">Reiniciar reloj</button></div><p id="timer-status" role="status">Puedes pausar o terminar el intento cuando lo necesites.</p></div>`;
}
function formatTime(n) { return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; }
function initTimer() { stopTimer(); timer.remaining = Number(root.querySelector('[data-duration]')?.dataset.duration || 0); }
function updateClock() {
  const clock = root.querySelector('#clock');
  if(clock) clock.textContent = formatTime(timer.remaining);
  const b = root.querySelector('[data-action="timer"]');
  if(b) b.textContent = timer.running ? 'Pausar' : timer.remaining === 0 ? 'Repetir tiempo' : 'Continuar';
}
function toggleTimer() {
  if(timer.running) {
    timer.remaining = Math.max(0,Math.ceil((timer.end-Date.now())/1000)); stopTimer();
    root.querySelector('#timer-status').textContent = 'En pausa. Retoma cuando el grupo esté preparado.';
  } else {
    if(timer.remaining === 0) timer.remaining = Number(root.querySelector('[data-duration]').dataset.duration);
    timer.end = Date.now()+timer.remaining*1000; timer.running = true;
    root.querySelector('#timer-status').textContent = 'Práctica en marcha. Elige una amplitud cómoda.';
    timer.interval = setInterval(()=>{
      timer.remaining = Math.max(0,Math.ceil((timer.end-Date.now())/1000));
      if(timer.remaining === 0) {stopTimer(); root.querySelector('#timer-status').textContent = 'Tiempo terminado. Observa el criterio antes de avanzar.';}
      updateClock();
    },200);
  }
  updateClock();
}
function stopBeat() {
  clearInterval(beatInterval); beatInterval=null;
  root.querySelector('.dance-stage')?.classList.remove('playing');
  root.querySelectorAll('.move-card').forEach(node=>node.classList.remove('playing'));
}
function preferences() {
  return `<div class="preferences"><span>Tu forma de jugar</span><label class="switch"><input id="seated" type="checkbox" ${state.seated?'checked':''}> Variante sentada</label><span class="note">Mismo objetivo, otra forma de moverse.</span></div>`;
}
function heading(tag,title,description) {
  return `<div class="page-heading"><a class="back" href="#inicio">Volver al patio</a><p class="eyebrow">${tag}</p><h1>${title}</h1><p>${description}</p></div>`;
}
function challengeCard(c, compact = false) {
  return `<article class="challenge ${compact?'compact':''}"><div class="card-meta"><span class="pill">${families[c.family]}</span><span>${c.seconds} s · ${c.minPlayers===1?'Individual o grupo':'En pareja o grupo'}</span></div><h${compact?'3':'2'}>${c.title}</h${compact?'3':'2'}><p class="instruction">${state.seated?c.seated:c.standing}</p><div class="criterion"><span class="eyebrow">Qué observar</span><p>${c.criterion}</p></div>${compact?`<details><summary>Objetivo y otra variante</summary><p>${c.goal}</p><p>${state.seated?c.standing:c.seated}</p></details>`:''}</article>`;
}
const iconPaths = {
  star:'M12 3 15 9l6 3-6 3-3 6-3-6-6-3 6-3Z',
  bolt:'M14 2 5 14h6l-1 8 9-12h-6Z',
  music:'M9 18V5l11-2v13M9 8l11-2M9 18c0 2-6 4-6 1s6-4 6-1Zm11-2c0 2-6 4-6 1s6-4 6-1Z',
  flag:'M5 22V3m0 1c5-5 9 5 15 0v10c-6 5-10-5-15 0',
  crown:'m3 7 4 4 5-7 5 7 4-4-2 12H5Z',
  cloud:'M6 16h12a4 4 0 0 0 0-8 6 6 0 0 0-11-2 5 5 0 0 0-1 10Zm2 4-1 2m6-2-1 2m6-2-1 2',
  map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16',
  book:'M12 5C8 2 5 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15',
  check:'m5 12 5 5L20 6',
};
function icon(name,extra='') {return `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${iconPaths[name]||iconPaths.star}"/></svg>`;}
function mascot(extra='') {return `<img class="chispa ${extra}" src="./assets/chispa.webp" alt="Chispa, un pequeño robot explorador con capa amarilla" width="1235" height="1274">`;}
function home() {
  const collected=state.mission.step;
  return `<section class="world-screen" aria-label="Mapa de aventuras"><img class="world-backdrop" src="./assets/world.webp" alt="Tres islas flotantes conectadas por puentes: un refugio luminoso, una pista de baile y una arena deportiva."><div class="world-shade"></div><div class="world-intro"><p class="eyebrow">Bienvenido a tu otro patio</p><h1>Fuera llueve.<br><span>Aquí empieza <br>la aventura.</span></h1><p>Elige una isla. Reúne a tu equipo.<br>El siguiente movimiento es vuestro.</p></div><div class="world-status"><span class="status-medal">${icon('star')}</span><div><strong>${collected} <span>/ 6</span></strong><small>Balizas encendidas</small></div></div>
  <a class="world-location refuge-location" href="#mision"><span class="location-pin">${icon('flag')}</span><span class="location-label"><small>AVENTURA COOPERATIVA</small><strong>Misión Refugio</strong><span class="location-cta">${collected>0&&collected<6?'Continuar aventura':'Jugar'} <span>12–20 min</span></span></span></a>
  <a class="world-location pulse-location" href="#pulso"><span class="location-pin">${icon('music')}</span><span class="location-label"><small>CREA TU PROPIO RITMO</small><strong>Pulso Lab</strong><span class="location-cta">Entrar al estudio <span>15–25 min</span></span></span></a>
  <a class="world-location arena-location" href="#liga"><span class="location-pin">${icon('bolt')}</span><span class="location-label"><small>EL RETO ES EN EQUIPO</small><strong>Liga Relámpago</strong><span class="location-cta">Entrar a la arena <span>2–6 equipos</span></span></span></a>
  <div class="world-companion">${mascot()}<div class="speech-bubble"><strong>¡Ey! Soy Chispa.</strong><p>La tormenta ha apagado el refugio. <br>¿Lo encendemos con vuestro movimiento?</p></div></div><div class="world-tools"><a href="#biblioteca">${icon('book')}<span>Libro de retos<small>24 movimientos por descubrir</small></span></a><a href="#guia">${icon('map')}<span>Rincón del profe<small>Prepara la sesión</small></span></a></div><span class="world-caption">EDUCACIÓN FÍSICA · 5.º Y 6.º · PANTALLA COMÚN</span></section>`;
}
const beacons=[{name:'El cruce',x:15,y:75,icon:'bolt'},{name:'El equilibrio',x:29,y:52,icon:'star'},{name:'El pulso',x:44,y:69,icon:'music'},{name:'La expresión',x:59,y:43,icon:'flag'},{name:'La unión',x:74,y:59,icon:'crown'},{name:'La calma',x:86,y:28,icon:'cloud'}];
function journeyMap(step) {
  return `<div class="journey-map"><div class="journey-map-art"></div><svg class="journey-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M15 75 Q18 48 29 52 T44 69 Q54 76 59 43 T74 59 Q85 65 86 28"/></svg><ol class="beacon-list" aria-label="Ruta de las seis balizas">${beacons.map((b,i)=>`<li style="--x:${b.x}%;--y:${b.y}%" class="beacon ${i<step?'lit':i===step?'current':'waiting'}" ${i===step?'aria-current="step"':''}><span class="beacon-orb">${i<step?icon('check'):icon(b.icon)}</span><span class="beacon-label">${i===4&&state.solo?'La creación':b.name}</span><span class="sr-only">${i<step?'Encendida':i===step?'Reto actual':'Pendiente'}</span></li>`).join('')}</ol><div class="journey-map-title"><span class="eyebrow">Las islas del refugio</span><strong>Tu ruta de aventura</strong></div><div class="map-companion">${mascot()}<span>${step===6?'¡Lo habéis conseguido!':step===0?'¡Vamos a por la primera!':'¡Una señal más cerca!'}</span></div></div>`;
}
function mission() {
  const m=state.mission;
  const names=['Coordinación','Control corporal','Ritmo','Expresión',state.solo?'Creación':'Cooperación','Calma'];
  const hud=`<div class="game-hud"><a class="back-game" href="#inicio">${icon('map')} Volver al mundo</a><div class="hud-title"><small>LA AVENTURA DE CHISPA</small><h1>Misión Refugio</h1></div><div class="hud-counter">${icon('star')}<strong>${m.step}<span> / 6</span></strong><small>balizas</small></div></div>`;
  if(m.step===6)return `<section class="mission-screen completed">${hud}<div class="victory-scene"><div class="victory-rays"></div>${mascot('victory-mascot')}<div class="victory-content"><div class="victory-stars">${icon('star')}${icon('star')}${icon('star')}</div><p class="eyebrow">MISIÓN COMPLETADA</p><h2>¡El refugio<br>vuelve a brillar!</h2><p>Seis balizas. Un montón de movimientos.<br>Elegid dos gestos y cread vuestro saludo de victoria.</p><div class="play-actions"><button class="button gold" data-action="mission-reset">Volver a la aventura</button><a class="button ghost" href="#pulso">Celebrarlo con ritmo</a></div><p class="victory-reflection">¿Qué habéis adaptado para que todos pudieran jugar?</p></div></div></section>`;
  const c=missionChallenge(m.step,state.solo,m.offset);
  return `<section class="mission-screen">${hud}<div class="adventure-layout"><div class="adventure-left">${journeyMap(m.step)}<div class="companion-brief"><span class="brief-medal">${icon(beacons[m.step].icon)}</span><div><strong>Baliza ${m.step+1}: ${names[m.step]}</strong><p>${m.step===0?'La primera señal necesita coordinación. ¡Poned el cuerpo en marcha!':'Cada reto enciende una nueva parte del refugio. Elegid vuestra forma de moveros.'}</p></div></div><div class="adventure-settings"><div class="mode-tabs" role="group" aria-label="Modalidad de misión"><button data-action="solo" data-value="false" aria-pressed="${!state.solo}">En equipo</button><button data-action="solo" data-value="true" aria-pressed="${state.solo}">Individual</button></div><label class="switch"><input id="seated" type="checkbox" ${state.seated?'checked':''}> Jugar sentado</label></div></div><div class="quest-panel"><div class="quest-topline"><span>RETO ${m.step+1} DE 6</span><span class="quest-family">${names[m.step]}</span></div>${challengeCard(c)}${timerMarkup(c.seconds)}<div class="quest-actions"><button class="button gold" data-action="mission-next">${icon('bolt')} Encender baliza</button><button class="button ghost" data-action="mission-swap">Cambiar reto</button></div><p class="quest-note">${state.solo?'Practica y observa el criterio antes de encenderla.':'Practicad y pedid a un compañero o al profe que observe el criterio.'} Adaptar el gesto también cuenta.</p></div></div></section>`;
}
const phases = [{name:'Crear',seconds:90,help:'Ordena las cuatro cartas. Cada una dura ocho pulsos. Decide qué emoción contará tu secuencia.'},{name:'Ensayar',seconds:60,help:'Repite la frase de 32 pulsos. Cambiad de guía y ajustad cualquier gesto que resulte incómodo.'},{name:'Compartir',seconds:30,help:'Mostrad la secuencia por turnos. Quien observa reconoce una idea y propone una mejora.'}];
function pulse() {
  const d=state.dance, phase=phases[d.phase];
  return heading('Creación · Ritmo · Expresión','Pulso Lab','Crea una frase de cuatro movimientos. Ocho pulsos por carta. Vuestra firma está en cómo los combináis.')+preferences()+
    `<section class="dance-stage"><div class="stage-spotlight spot-a"></div><div class="stage-spotlight spot-b"></div><div class="stage-ring"></div>${mascot('dance-mascot')}<div class="stage-display"><span class="eyebrow">Estudio Pulso</span><strong id="live-move">Vuestra próxima gran idea</strong><span>4 movimientos · 32 pulsos · vuestro estilo</span></div><div class="stage-speaker speaker-left"><i></i><i></i></div><div class="stage-speaker speaker-right"><i></i><i></i></div></section><div class="phase-tabs" role="group" aria-label="Fase de baile">${phases.map((p,i)=>`<button data-action="phase" data-index="${i}" aria-pressed="${d.phase===i}">${p.name}</button>`).join('')}</div><section class="pulse-workspace"><div class="section-heading"><h2>Vuestra secuencia</h2><button class="button ghost" data-action="shuffle">Mezclar cartas</button></div><div class="move-grid">${d.sequence.map((id,i)=>{const m=moves.find(x=>x.id===id);return `<article class="move-card"><span class="move-symbol" aria-hidden="true">${m.symbol}</span><label for="move-${i}">Movimiento ${i+1} · 8 pulsos</label><select id="move-${i}" data-move="${i}">${moves.map(x=>`<option value="${x.id}" ${x.id===id?'selected':''}>${x.name}</option>`).join('')}</select><p>${state.seated?m.seated:m.standing}</p></article>`;}).join('')}</div></section><div class="play-layout"><section class="beat-panel"><div class="section-heading"><div><p class="eyebrow">Una base común</p><h2>Encuentra el pulso</h2></div><label>Velocidad<select id="bpm">${[80,96,112,120].map(n=>`<option ${d.bpm===n?'selected':''} value="${n}">${n} BPM</option>`).join('')}</select></label></div><div class="beats" aria-label="Ocho pulsos visuales">${Array.from({length:8},(_,i)=>`<span data-beat="${i}">${i+1}</span>`).join('')}</div><div class="play-actions"><button class="button dark" data-action="beat" aria-pressed="false">Activar pulso</button><label class="switch"><input type="checkbox" id="sound"> Con sonido suave</label></div><p class="note">El pulso guía la práctica. La app no mide ni puntúa vuestro baile.</p></section><aside><div class="phase-description"><p class="eyebrow">Ahora: ${phase.name}</p><p>${phase.help}</p></div>${timerMarkup(phase.seconds)}</aside></div>`;
}
const teamNames=['Lima','Coral','Cielo','Violeta','Ámbar','Menta'];
function league() {
  let html=heading('Equipos · Retos simultáneos','Liga Relámpago','Todos practican el mismo reto. El docente observa y registra los criterios en esta pantalla.');
  if(!state.league) return html+`<div class="arena-lobby"><div class="arena-emblem">${icon('bolt')}</div><section class="setup-panel"><h2>Reúne a tu tripulación</h2><p>De 2 a 6 equipos. Una persona guía, otra observa y todos prueban. Cambiad los roles en cada ronda.</p><form id="league-setup"><label for="team-count">Número de equipos</label><select id="team-count">${[2,3,4,5,6].map(n=>`<option ${n===4?'selected':''}>${n}</option>`).join('')}</select><button class="button dark">Preparar la liga</button></form><p class="note">Modo presencial con pantalla común. Cada equipo necesita al menos dos participantes. No hay conexión entre dispositivos.</p></section><div class="arena-crew">${mascot()}<span>Que gane el juego en equipo.</span></div></div>`;
  const l=state.league;
  if(l.round===6) return html+`<section class="celebration"><p class="eyebrow">Seis rondas compartidas</p><h2>Celebramos cómo hemos jugado.</h2><div class="ranking">${standings(l.teams).map(t=>`<div><span class="rank">${t.rank}</span><strong>${esc(t.name)}</strong><span>${t.score} / 36 puntos</span></div>`).join('')}</div><p>Los empates comparten puesto. Reconoced una aportación de otro equipo antes de terminar.</p><button class="button dark" data-action="league-reset">Preparar otra liga</button></section>`;
  const c=leagueChallenge(l.round), all=l.teams.every(t=>t.rounds[l.round]!=null);
  html+=`<div class="arena-round-banner"><span class="arena-round-medal">${icon('bolt')}</span><div><small>ARENA RELÁMPAGO</small><strong>Ronda ${l.round+1}<span> / 6</span></strong></div><div class="arena-roster">${l.teams.map((t,i)=>`<span class="arena-team t${i}">${icon('flag')}<strong>${esc(t.name)}</strong></span>`).join('')}</div></div>`+preferences()+`<p class="round-label">Ronda ${l.round+1} de 6 · ${families[c.family]}</p><div class="play-layout"><div>${challengeCard(c)}<div class="section-heading score-heading"><h2>Observación docente</h2><span class="small-label">0 · por construir / 1 · en proceso / 2 · observado</span></div><p class="note">Control: gesto cómodo y regulado. Consigna: patrón o mensaje reconocible. Cooperación: turnos y escucha. Registra sólo lo observado.</p><div class="team-forms">${l.teams.map((t,i)=>{const values=t.rounds[l.round];return `<form class="team-form" data-team="${i}"><h3><span class="team-chip t${i}"></span>Equipo ${esc(t.name)}</h3>${values?`<p class="recorded">✓ Registrado · ${values.reduce((a,b)=>a+b,0)} / 6</p>`:`<div class="criteria-inputs">${['Control','Consigna','Cooperación'].map((name,j)=>`<label>${name}<select name="criterion${j}" required><option value="">Elegir</option><option value="0">0</option><option value="1">1</option><option value="2">2</option></select></label>`).join('')}</div><button class="button small dark">Registrar equipo</button>`}</form>`;}).join('')}</div><div class="play-actions"><button class="button dark" data-action="league-next" ${all?'':'disabled'}>${l.round===5?'Ver cierre de liga':'Siguiente ronda'}</button><button class="button ghost" data-action="league-reset">Reiniciar liga</button></div><p class="note" id="league-status" role="status">${all?'Todos los equipos están registrados.':'Registra a todos los equipos antes de avanzar.'} La clasificación se muestra al final.</p></div><aside>${timerMarkup(c.seconds)}<div class="aside-note"><h3>Participar sin prisa</h3><p>No hay puntos extra por terminar antes. Una adaptación cómoda tiene el mismo valor.</p></div></aside></div>`;
  return html;
}
function library() {
  return heading('24 ideas originales','Los retos del patio','Elige un objetivo y una forma de participar. Cada carta incluye un criterio para observar.')+preferences()+`<div class="library-filters"><label>Contenido<select id="family-filter"><option value="all">Todas las familias</option>${Object.entries(families).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>Participantes<select id="players-filter"><option value="all">Individual y grupo</option><option value="solo">Una persona</option></select></label><p id="result-count" role="status"></p></div><div id="challenge-grid" class="challenge-grid"></div>`;
}
function filterLibrary() {
  const bank=eligibleChallenges({seated:state.seated, solo:root.querySelector('#players-filter').value==='solo',family:root.querySelector('#family-filter').value});
  root.querySelector('#result-count').textContent=`${bank.length} retos disponibles`;
  root.querySelector('#challenge-grid').innerHTML=bank.map(c=>challengeCard(c,true)).join('');
}
function guide() {
  const current=location.hash.split('-')[1] || '20';
  const schedules={20:[['3 min','Prepara y activa','Busca una zona propia. Prueba un gesto pequeño y una variante cómoda.'],['11 min','Misión Refugio','Recupera seis señales. Lee, practica, observa y adapta.'],['3 min','Crea una variación','Combina dos gestos y enseña tu cambio a una pareja.'],['3 min','Vuelve a la calma','Respira con naturalidad y explica qué has adaptado.']],35:[['8 min','Prepara la liga','Zonas, activación, equipos y una ronda de ensayo sin puntos.'],['16 min','Seis rondas','Práctica simultánea, muestras breves y registro docente.'],['6 min','Un final común','Mezcla ideas de dos equipos en una secuencia compartida.'],['5 min','Cierra la sesión','Baja el ritmo y reconoce una mejora de otro equipo.']],50:[['10 min','Activa y descubre','Prueba ocho pulsos y cuatro cartas de movimiento.'],['15 min','Crea y ensaya','Cada equipo compone 4 × 8 tiempos y prepara una adaptación.'],['10 min','Comparte las muestras','Turnos de 30 segundos; los demás observan y dan feedback oral.'],['8 min','Baila una mezcla','Combina propuestas y practica con toda la clase.'],['7 min','Calma y reflexión','Mi aportación, nuestra mejora y el próximo intento.']]};
  const selected=schedules[current]?current:'20';
  return heading('Para el docente','Un día de lluvia, preparado.','Un proyector basta para empezar. Elige la sesión y ajusta el ritmo a tu grupo.')+`<div class="session-tabs">${['20','35','50'].map(n=>`<a href="#guia-${n}" ${n===selected?'aria-current="page"':''}>${n} minutos</a>`).join('')}</div><div class="guide-layout"><section><h2>Tu sesión de ${selected} minutos</h2><ol class="schedule">${schedules[selected].map(([time,title,desc])=>`<li><span>${time}</span><div><h3>${title}</h3><p>${desc}</p></div></li>`).join('')}</ol><a class="button dark" href="#${selected==='20'?'mision':selected==='35'?'liga':'pulso'}">Abrir el juego de esta sesión</a></section><aside class="teacher-notes"><h2>Antes de jugar</h2><p>Dispositivos apoyados, zona propia y gestos pequeños. Activa la variante sentada si el espacio o el grupo lo necesitan.</p><h3>Lo que cuenta</h3><p>Control, decisiones, expresión y cooperación. Adaptar y pedir una pausa también forman parte del juego.</p><h3>Lo que observa la app</h3><p>Registra tus decisiones y tiempos. La ejecución se observa en clase; no se mide con cámara.</p><h3>Próxima fase</h3><p>Salas por código y votaciones desde tablets. Esta versión funciona en un único dispositivo.</p></aside></div><section class="reset-panel"><div><h2>Un nuevo comienzo</h2><p>Borra el progreso de Misión, Pulso y Liga guardado en este navegador.</p></div><button class="button ghost" data-action="reset-all">Borrar progreso local</button></section>`;
}

function render({focus=false}={}) {
  stopTimer(); stopBeat();
  const route=location.hash.slice(1)||'inicio';
  document.body.dataset.screen=['mision','pulso','liga','biblioteca'].includes(route)?route:route.startsWith('guia')?'guia':'inicio';
  document.title=({mision:'Misión Refugio',pulso:'Pulso Lab',liga:'Liga Relámpago',biblioteca:'Libro de retos'}[route]||'El mundo de Chispa')+' · Patio Interior';
  root.innerHTML=route==='mision'?mission():route==='pulso'?pulse():route==='liga'?league():route==='biblioteca'?library():route.startsWith('guia')?guide():home();
  document.querySelectorAll('nav a').forEach(a=>{if(a.hash===`#${route}` || (route.startsWith('guia') && a.hash==='#guia'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  initTimer();
  if(route==='biblioteca')filterLibrary();
  if(focus) {root.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}

root.addEventListener('change',event=>{
  const t=event.target;
  if(t.id==='seated') {
    state.seated=t.checked; save();
    if(location.hash==='#biblioteca')filterLibrary();
    else {render();root.querySelector('#seated')?.focus();}
  } else if(t.id==='family-filter'||t.id==='players-filter') filterLibrary();
  else if(t.dataset.move!==undefined) {
    state.dance.sequence[Number(t.dataset.move)]=t.value;save();render();root.querySelector(`#${t.id}`)?.focus();
  } else if(t.id==='bpm') {state.dance.bpm=Number(t.value);save();if(beatInterval)startBeat();}
});

function startBeat() {
  stopBeat(); beatNumber=0;
  const tick=()=>{
    root.querySelectorAll('[data-beat]').forEach((node,i)=>node.classList.toggle('active',i===beatNumber%8));
    if(root.querySelector('#sound')?.checked && audioContext?.state==='running') {
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.frequency.value=beatNumber%8===0?660:440; gain.gain.setValueAtTime(0.035,audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,audioContext.currentTime+0.07);
      osc.connect(gain).connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+0.08);
    }
    const moveIndex=Math.floor(beatNumber/8)%4;
    const activeMove=moves.find(m=>m.id===state.dance.sequence[moveIndex]);
    const live=root.querySelector('#live-move');
    if(live)live.textContent=`${activeMove.name} · ${beatNumber%8+1} de 8`;
    root.querySelector('.dance-stage')?.classList.add('playing');
    root.querySelector('.dance-stage')?.style.setProperty('--beat-duration',`${60000/state.dance.bpm}ms`);
    root.querySelectorAll('.move-card').forEach((node,i)=>node.classList.toggle('playing',i===moveIndex));
    beatNumber++;
  };
  tick();beatInterval=setInterval(tick,60000/state.dance.bpm);
}
root.addEventListener('click',async event=>{
  const b=event.target.closest('[data-action]');if(!b)return;
  const action=b.dataset.action;
  if(action==='timer')return toggleTimer();
  if(action==='timer-reset') {initTimer();updateClock();root.querySelector('#timer-status').textContent='Reloj reiniciado. Inicia cuando el grupo esté listo.';return;}
  if(action==='beat') {
    if(beatInterval){stopBeat();root.querySelectorAll('[data-beat]').forEach(n=>n.classList.remove('active'));b.textContent='Activar pulso';b.setAttribute('aria-pressed','false');}
    else {
      try {const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audioContext ||= new Audio();await audioContext.resume();}} catch {toast('El pulso visual sigue disponible aunque no haya audio.');}
      if(!b.isConnected)return;
      startBeat();b.textContent='Detener pulso';b.setAttribute('aria-pressed','true');
    }return;
  }
  if(action==='solo') {state.solo=b.dataset.value==='true';state.mission.offset=0;}
  if(action==='mission-next') {state.mission.step=Math.min(6,state.mission.step+1);state.mission.offset=0;}
  if(action==='mission-swap')state.mission.offset++;
  if(action==='mission-reset')state.mission={step:0,offset:0};
  if(action==='phase')state.dance.phase=Number(b.dataset.index);
  if(action==='shuffle')state.dance.sequence=createSequence();
  if(action==='league-next' && state.league?.teams.every(t=>t.rounds[state.league.round]!=null))state.league.round++;
  if(action==='league-reset') {if(!confirm('¿Reiniciar la liga? Se borrarán sus resultados en este navegador.'))return;state.league=null;}
  if(action==='reset-all') {if(!confirm('¿Borrar todo el progreso local y empezar de nuevo?'))return;state=fresh();}
  save();render({focus:true});
  if(action==='mission-next') {
    toast(state.mission.step===6?'¡Las seis balizas están encendidas!':'¡Baliza encendida! El refugio recupera su luz.');
    root.classList.remove('signal-unlocked');
    void root.offsetWidth;
    root.classList.add('signal-unlocked');
    setTimeout(()=>root.classList.remove('signal-unlocked'),1800);
  }
});
root.addEventListener('submit',event=>{
  event.preventDefault();const form=event.target;
  if(form.id==='league-setup')state.league={round:0,teams:teamNames.slice(0,Number(root.querySelector('#team-count').value)).map(name=>({name,rounds:[]}))};
  else if(form.dataset.team!==undefined) {
    const values=[0,1,2].map(i=>Number(new FormData(form).get(`criterion${i}`)));
    const teamIndex=Number(form.dataset.team);
    try{state.league=recordAssessment(state.league,teamIndex,values);}catch(error){toast(error.message);return;}
    save();
    const team=state.league.teams[teamIndex];
    form.innerHTML=`<h3><span class="team-chip t${teamIndex}"></span>Equipo ${esc(team.name)}</h3><p class="recorded">✓ Registrado · ${values.reduce((a,b)=>a+b,0)} / 6</p>`;
    const all=state.league.teams.every(t=>t.rounds[state.league.round]!=null);
    root.querySelector('[data-action="league-next"]').disabled=!all;
    root.querySelector('#league-status').textContent=all?'Todos los equipos están registrados. Puedes avanzar.':'Resultado registrado. Faltan equipos por observar.';
    const next=root.querySelector('.team-form select') || root.querySelector('[data-action="league-next"]');
    next.focus({preventScroll:true});
    return;
  } else return;
  save();render();
  const next=root.querySelector('.team-form select') || root.querySelector('[data-action="league-next"]') || root;
  next.focus({preventScroll:true});
});
window.addEventListener('hashchange',()=>render({focus:true}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopBeat();const b=root.querySelector('[data-action="beat"]');if(b){b.textContent='Activar pulso';b.setAttribute('aria-pressed','false');}}});
render();
