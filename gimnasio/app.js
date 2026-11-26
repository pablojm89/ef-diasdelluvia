import {equipment,targets,find,request,fresh,valid,act} from './mission.js?v=touch-1';
import {walkTo, enterRoom, position, reach} from './walk.js?v=touch-1';
import {stored as parts} from './store-layout.js';
import {currentJourney} from '../comun/recorrido.js';
import {player,studentId,mode,record} from '../registro.js';
import {backToHub} from '../comun/lugar.js';
import {speakAndPoint, celebrate} from './robles.js';
import {trolley, slotOf} from './trolley.js?v=touch-1';
import {play, setSound} from './sound.js?v=touch-1';
import {PINTADOS} from './assets/pintados.js';
const icon = id => '<img alt="" draggable="false" src="assets/prop-' + id + '.webp">';
const $=id=>document.getElementById(id), key='ef-gym-mission-v1';
const pupil = mode()==='alumno' && player();
const saveKey = pupil ? key+'-'+studentId(pupil) : key;
const english = document.documentElement.classList.contains('con-ingles');
const label = e => english ? e.en : e.es;
const item=id=>equipment.find(e=>e.id===id);
let closer=null,state=fresh(),room='gym',selected=null,support=true,reduced=false,sound=true;
try{const saved=JSON.parse(localStorage.getItem(saveKey));if(valid(saved?.state)){state=saved.state;support=saved.support!==false;reduced=!!saved.reduced;sound=saved.sound!==false;}}catch{}
setSound(sound);
const steps=['Localiza el material','Despeja la puerta','Cada cosa en su lugar','Prepara el pedido','Revisa y explica'];
// Furniture of the store as tappable areas, in % of the room picture: left, top, width, height.
const furniture={balls:[20.8,51.3,13.7,17.1],rack:[37,43.5,9.2,24.9],bins:[47.4,41.5,16.7,26.9],hooks:[67.7,38,15.3,16.7],platform:[72.6,61.3,27.4,8.5]};
// The trolley stands on the store floor while the order is prepared and next to Robles before and after.
const trolleyAt={store:[56,95.5,24],gym:[37,79,13]};
// A second cone fits on the next peg of the stand once the cone by the door is put away.
const spareCone=[40.75,43.26,3.84,6.25];
const names=Object.fromEntries(equipment.map(e=>[e.id,[e.en,e.es]]));
const plural={cone:['cones','conos'],hoop:['hoops','aros'],softball:['soft ball','pelota blanda']};
const storePrompt=()=>{
 const next=item(find[state.found.length]);
 return [
  [`Find a ${next?.en||'hoop'}.`,`Busca y toca: ${next?.es||'aro'}.`],
  ['Look at the door. Keep the doorway clear: put the cone on the cone stand.','Mira la puerta. Despeja el paso: toca el cono y después su soporte.'],
  ['Now put the equipment away. Choose an item, then its place.','Ahora guarda el material. Toca un objeto y después su lugar.'],
  ['We need four cones, two hoops and one soft ball. Put them on the trolley.','Cuatro conos, dos aros y una pelota blanda: cógelos de su sitio y ponlos en el carro.'],
  state.hazards.length<2?['Look at the door and the shelves. Find two safety problems.','Mira la puerta y lo alto de las estanterías. Toca los dos riesgos.']:['Well spotted! Why do we fix these problems?','¡Bien visto! ¿Por qué los corregimos? Elige la razón.'],
  ['Mission complete! Tell your partner: where do the hoops go?','¡Misión cumplida! Explica a tu compañero dónde van los aros y qué paso dejarías libre en el gimnasio real.']
 ][state.stage];
};
const prompts=()=>{
 if(room==='gym'&&state.stage<5)return state.stage===0?['Can you help me get the equipment ready? Let’s go to the equipment room.','¿Me ayudas a preparar el material? Vamos al almacén.']:['Let’s go back to the equipment room. There is more to do.',`Volvamos al cuarto de materiales. Ahora toca: ${steps[state.stage].toLowerCase()}.`];
 return storePrompt();
};
const hints=[()=>`Busca ${item(find[state.found.length])?.es}. Si no lo ves, abre la mochila: tiene la lista de objetos.`,()=> 'El cono naranja está delante de la puerta. Tócalo y después toca el soporte de conos.',()=> 'Balones al rack; conos a su soporte; aros y raquetas al soporte de pared; cuerdas, petos y saquitos a las cajas; colchoneta a su zona baja.',()=> 'Coge del soporte cuatro conos, de la pared dos aros y del rack la pelota verde. Si sobra algo, toca esa unidad en el carro para devolverla. Después, «Comprobar el carro».',()=> state.hazards.length<2?'Mira el suelo delante de la puerta y lo alto de la estantería de las cajas. Toca el objeto que puede hacer daño.':'Piensa en tropiezos y en material que puede caer.',()=> 'Explica a un compañero cómo prepararías una estación real y qué paso debe quedar libre.'];
function persist(){try{localStorage.setItem(saveKey,JSON.stringify({state,support,reduced,sound}));}catch{say(' El navegador no permite guardar; puedes continuar sin cerrar esta pestaña.',false,true);}}
// The teacher's face in the dialogue follows what he says: pleased, encouraging or neutral.
const faces={ok:'teacher-robles-happy',retry:'teacher-robles-think'};
function say(text,ok,append){
 const f=$('feedback');f.dataset.tone=ok===true?'ok':ok===false?'retry':'';f.textContent=append?f.textContent+text:text;
 const face=PINTADOS.includes(faces[f.dataset.tone])?faces[f.dataset.tone]:'teacher-robles',image=$('portrait');
 if(!image.src.endsWith(face+'.webp'))image.src='assets/'+face+'.webp';
}
const rect=el=>el?.getBoundingClientRect();
function dispatch(event){
 const before=state.stage,from=event.type==='place'?rect(document.querySelector(`.equipment[data-item="${event.id}"]`)):event.type==='add'?rect(document.querySelector(`.pick[data-item="${event.id}"]`)):event.type==='remove'?rect([...document.querySelectorAll(`.trolley .unit[data-item="${event.id}"]`)].pop()):event.type==='hazard'&&event.id==='door'?rect(document.querySelector('.risk-cone')):null;
 const result=act(state,event);state=result.state;if(result.ok)selected=null;if(state.stage!==before)closer=null;persist();render();
 let message=result.message;
 if(event.type==='remove')message=result.ok?`${names[event.id][1][0].toUpperCase()+names[event.id][1].slice(1)} devuelto a su sitio.`:'No hay de eso en el carro.';
 if(event.type==='hazard'&&!result.ok)message=state.hazards.includes(event.id)?'Ese riesgo ya está revisado.':'Eso está bien guardado; busca otro riesgo.';
 say(message,result.ok);
 play(!result.ok?'wrong':state.stage===5&&before<5?'done':event.type==='add'?'pick':event.type==='remove'?'back':event.type==='place'?'place':'right');
 if(result.ok&&from&&!reduced&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  if(event.type==='place')fly(event.id,from,$('stored').querySelector(`[data-part="${event.id}"]`));
  if(event.type==='add')fly(event.id,from,slotOf(document.querySelector('.trolley'),event.id,state.cart[event.id]-1));
  if(event.type==='remove')fly(event.id,from,document.querySelector(`.pick[data-item="${event.id}"]`),true);
  if(event.type==='hazard')fly('cone',from,document.querySelector('.spare-cone'));
 }
 // Each finished phase goes to the player's record, with how many tries and hints it took so far.
 if(state.stage>before)record('material','equipment-rescue',state.stage===5?'completada':'fase',{fase:state.stage,intentos:state.attempts,pistas:state.hints});
 if(pupil && state.stage===1 && before===0){
  say('¡Has encontrado el material! Vuelve al gimnasio y acércate al cartel de la pista para jugar al mate.',true);
 }

}
// The room picture itself shows what is already put away: one painted part per item.
function showStored(){
 const layer=$('stored'),tidy=room==='store'&&state.stored.length===equipment.length;
 $('scene').classList.toggle('tidy',tidy);
 const wanted=room==='store'&&!tidy?state.stored:[];
 for(const part of [...layer.children])if(!wanted.includes(part.dataset.part))part.remove();
 for(const id of wanted){
  if(layer.querySelector(`[data-part="${id}"]`))continue;
  const [left,top,width,height]=parts[id],part=new Image();
  part.src=`assets/set-${id}.webp`;part.alt='';part.draggable=false;part.dataset.part=id;
  Object.assign(part.style,{left:left+'%',top:top+'%',width:width+'%',height:height+'%'});
  layer.append(part);
 }
}
// An item travels in an arc from where it was to where it lands; the landing spot waits hidden.
function fly(id,from,target,back){
 if(!target||!target.animate)return;
 const to=target.getBoundingClientRect(),ghost=new Image();
 ghost.src=`assets/prop-${id}.webp`;ghost.alt='';ghost.className='ghost';
 Object.assign(ghost.style,{left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px'});
 document.body.append(ghost);target.style.opacity=0;
 const dx=to.left+to.width/2-from.left-from.width/2,dy=to.top+to.height/2-from.top-from.height/2;
 const flight=ghost.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${dx*.6}px,${dy-34}px) scale(.94)`,opacity:1,offset:.62},{transform:`translate(${dx}px,${dy}px) scale(${Math.min(1.4,to.width/from.width)})`,opacity:back?.2:.6}],{duration:560,easing:'ease-in-out'});
 const land=()=>{ghost.remove();target.style.opacity='';};
 flight.onfinish=land;flight.oncancel=land;
}
function choose(id){
 if($('inventory-dialog').open)$('inventory-dialog').close();
 if(room!=='store'){room='store';render();}
 if(state.stage===0){dispatch({type:'find',id});return;}
 if(state.stage===3){dispatch({type:'add',id});return;}
 if(state.stage===4){dispatch({type:'hazard',id});return;}
 selected=selected===id?null:id;render();say(selected?`${label(item(id))}: ahora toca su lugar.`:'Nada seleccionado.');
}
function place(target){if($('inventory-dialog').open)$('inventory-dialog').close();if(!selected){say('Primero toca un material.',false);return;}dispatch({type:'place',id:selected,target});}
function button(text,fn,cls='',focus){const b=document.createElement('button');b.textContent=text;b.className=cls;b.onclick=fn;if(focus)b.dataset.focus=focus;return b;}
// Every action chosen from the backpack list closes it, so the change is seen in the room.
const fromBag=event=>()=>{$('inventory-dialog').close();dispatch(event);};
function go(next){if($('dialogue').open)$('dialogue').close();room=next;selected=null;closer=null;render();}
// Things kept close together are too small to touch apart on a phone: the shelf is shown up close in the bubble.
function touchPart(id){
 const home=item(id).home,group=equipment.filter(e=>e.home===home);
 if(group.length>1&&group.some(e=>(document.querySelector(`.pick[data-item="${e.id}"]`)?.getBoundingClientRect().width??99)<44)){closer=home;render();say(`${targets[home][english?0:1]}: ¿cuál? Tócalo aquí abajo.`);return;}
 choose(id);
}
// A small painted-looking thing placed on the room picture, anchored at its feet.
function anchor(el,[x,bottom,width]){Object.assign(el.style,{left:x+'%',top:bottom+'%',width:width+'%'});return el;}
function render(){
 document.querySelector('.menu-links a[href="../mate/"]').hidden = pupil && !currentJourney().unlocked.has('pista');
 const focusKey=document.activeElement?.dataset?.focus;
 document.body.dataset.stage=state.stage;document.body.dataset.room=room;document.body.classList.toggle('reduced',reduced);$('translation').checked=support;$('motion').checked=reduced;$('sound').checked=sound;
 $('scene').className=`scene ${room}`;$('room-title').textContent=room==='gym'?'El gimnasio':'El cuarto de materiales';$('location').textContent=room==='gym'?'THE GYM':'THE EQUIPMENT ROOM';
 $('prof').classList.toggle('hidden',room==='store');celebrate(state.stage===5);
 $('steps').innerHTML=steps.map((s,i)=>`<li class="${i<state.stage?'done':i===state.stage?'current':''}"><span>${i<state.stage?'✓':i+1}</span>${s}</li>`).join('');$('stage-count').textContent=state.stage===5?'COMPLETADA':`${state.stage+1} / 5`;
 const [en,es]=prompts();$('english').textContent=en;$('spanish').textContent=es;$('spanish').hidden=english&&!support;
 $('objective').textContent=es;

 for(const id of ['objects','destinations','hotspots','object-list','target-list','choices'])$(id).replaceChildren();
 enterRoom(room);showStored();
 const choices=$('choices');
 const list=$('object-list'),targetList=$('target-list');
 let help='Selecciona un objeto y después su destino. Puedes usar Tab y Enter; no necesitas arrastrar.',objectTitle='Material',targetTitle='Lugares';
 if(room==='gym'){
  $('hotspots').append(button('ALMACÉN',()=>go('store'),'scene-link door','door'),...(!pupil || currentJourney().unlocked.has('pista') ? [button('PISTA · MATE',()=>{location.href='../mate/';},'scene-link board','board')] : []));
  if(state.stage<3||state.stage===5)$('objects').append(anchor(trolley(state.stage===5?state.cart:{},names,null,state.stage===5),trolleyAt.gym));
  help=state.stage===5?'Misión completada.':'El material está en el cuarto de materiales.';objectTitle='';targetTitle='Ir a';
  if(state.stage<5)targetList.append(button('Ir a la puerta del almacén',()=>{$('inventory-dialog').close();$('hotspots').querySelector('[data-focus=door]').click();},'','list-go-store'));
 }else{
  $('hotspots').append(button('GIMNASIO',()=>go('gym'),'scene-link return-door','return-door'));
  if(state.stage<3){
   for(const [id,[en,es,x,y]] of Object.entries(targets)){
    const [left,top,width,height]=furniture[id];
    const t=button('',()=>place(id),'destination','to-'+id);t.innerHTML=`<span style="left:${(x-left)/width*100}%;top:${(y-top)/height*100}%">${english?en:es}</span>`;
    Object.assign(t.style,{left:left+'%',top:top+'%',width:width+'%',height:height+'%'});t.disabled=!selected;t.setAttribute('aria-label',english ? `${en} · ${es}` : es);$('destinations').append(t);
    if(state.stage>0)targetList.append(button(english ? `${en} · ${es}` : es,()=>place(id),'',`list-to-${id}`));
   }
   equipment.forEach(e=>{
    const stored=state.stored.includes(e.id);
    const alt=button(`${label(e)}${english&&support?' · '+e.es:''}${stored?' ✓':''}`,()=>choose(e.id),selected===e.id?'selected':'',`list-${e.id}`);alt.disabled=stored&&state.stage>0;list.append(alt);
    if(stored)return;
    const b=button('',()=>choose(e.id),`equipment ${selected===e.id?'selected':''}`,'item-'+e.id);b.innerHTML=icon(e.id)+`<span>${label(e)}</span>`;b.setAttribute('aria-label',`${label(e)} · ${e.es}`);b.setAttribute('aria-pressed',selected===e.id);
    b.dataset.item=e.id;b.style.left=(e.id==='cone'?14:e.x)+'%';b.style.top=e.y+'%';$('objects').append(b);
   });
   if(state.stage===0){help=storePrompt()[1];targetTitle='';}
  }
  if(state.stage>=3){
   // Everything put away can be touched: in the order to take a unit, in the review to inspect it.
   if(state.stage<5)equipment.forEach(e=>{
    const [left,top,width,height]=parts[e.id],have=state.cart[e.id]||0;
    const b=button('',()=>touchPart(e.id),'pick'+(closer===e.home?' looking':''),'pick-'+e.id);b.innerHTML=`<span>${label(e)}</span>`;b.dataset.item=e.id;
    b.setAttribute('aria-label',state.stage===3?`${label(e)} · ${e.es}: coger uno`+(e.id in request?` (en el carro: ${have})`:''):`${label(e)} · ${e.es}: revisar`);
    Object.assign(b.style,{left:left+width/2+'%',top:top+height/2+'%',width:width+'%',height:height+'%'});
    $('objects').append(b);
    list.append(button(state.stage===3?`Coger: ${label(e)}${english&&support?' · '+e.es:''}`:`Revisar: ${label(e)}${english&&support?' · '+e.es:''}`,()=>choose(e.id),'',`list-${e.id}`));
   });
   const cart=trolley(state.cart,names,state.stage===3?id=>dispatch({type:'remove',id}):null,state.stage>3);
   $('objects').append(anchor(cart,trolleyAt.store));
   if(state.stage>=4){
    const fixed=state.hazards.includes('door'),high=state.hazards.includes('shelf');
    if(fixed||state.stage===5){const c=new Image();c.src='assets/set-cone.webp';c.alt='';c.className='spare-cone';const [l,t,w,h]=spareCone;Object.assign(c.style,{left:l+'%',top:t+'%',width:w+'%',height:h+'%'});$('objects').append(c);}
    if(state.stage===4){
     if(!fixed){const c=button('',()=>dispatch({type:'hazard',id:'door'}),'risk risk-cone','risk-door');c.innerHTML='<img alt="" src="assets/risk-cone.webp">';c.setAttribute('aria-label','Cono en el suelo delante de la puerta');$('objects').append(c);}
     // Once it is reported, the teacher is the one who takes the mat down: he stands there holding it.
     const lowered=high&&PINTADOS.includes('robles-mat');
     if(lowered){const r=new Image();r.src='assets/robles-mat.webp';r.alt='El profe Robles ha bajado la colchoneta';r.className='prof-mat';$('objects').append(r);}
     else{const m=button('',()=>dispatch({type:'hazard',id:'shelf'}),'risk risk-mat'+(high?' flagged':''),'risk-shelf');m.innerHTML='<img alt="" src="assets/risk-mat.webp">';m.setAttribute('aria-label',high?'Colchoneta en lo alto: el profe la bajará':'Colchoneta en lo alto de la estantería');m.disabled=high;$('objects').append(m);}
     if(high){const s=document.createElement('p');s.className='help-sign';s.innerHTML='<b lang="en">Ask the teacher</b><span>La baja el profe</span>';$('objects').append(s);}
     if(!fixed)targetList.append(button('Revisar: cono delante de la puerta',fromBag({type:'hazard',id:'door'}),'',`list-risk-door`));
     if(!high)targetList.append(button('Revisar: colchoneta en lo alto',fromBag({type:'hazard',id:'shelf'}),'',`list-risk-shelf`));
    }
   }
   if(closer&&state.stage<5){
    const box=document.createElement('div');box.className='closer';box.setAttribute('role','group');box.setAttribute('aria-label',targets[closer][english?0:1]+' de cerca');
    box.append(Object.assign(document.createElement('b'),{textContent:targets[closer][english?0:1]}));
    for(const e of equipment.filter(e=>e.home===closer)){const b=button('',()=>choose(e.id),'look','look-'+e.id);b.innerHTML=icon(e.id)+`<span>${label(e)}</span>`;b.setAttribute('aria-label',`${label(e)} · ${e.es}`);box.append(b);}
    box.append(button('✕',()=>{closer=null;render();},'look-close','look-close'));box.lastChild.setAttribute('aria-label','Cerrar la vista de cerca');
    choices.append(box);
   }
   if(state.stage===3){
    help='Coge cada unidad de donde está guardada. Si sobra algo, devuélvelo desde el carro.';objectTitle='Coger del almacén';targetTitle='En el carro';
    for(const [id,n] of Object.entries(state.cart))if(n)targetList.append(button(`Devolver un ${names[id][english?0:1]} (${n} en el carro)`,fromBag({type:'remove',id}),'',`list-back-${id}`));
    const order=document.createElement('p');order.className='order';order.setAttribute('aria-label','Pedido: '+Object.entries(request).map(([id,n])=>`${plural[id][1]} ${state.cart[id]||0} de ${n}`).join(', '));
    order.innerHTML=Object.entries(request).map(([id,n])=>`<span class="chip${(state.cart[id]||0)===n?' enough':''}" aria-hidden="true">${icon(id)}<b>${state.cart[id]||0}/${n}</b></span>`).join('');
    if(!closer)choices.append(order,button('Comprobar el carro',()=>dispatch({type:'check'}),'choice primary','check'));
   }
   if(state.stage===4){
    help='Revisa el almacén: toca lo que sea un riesgo.';objectTitle='Revisar lo guardado';targetTitle='Revisar los riesgos';
    if(state.hazards.length===2)choices.append(button('Para evitar tropiezos y caídas de material.',()=>dispatch({type:'reason',id:'safe'}),'choice answer','reason-safe'),button('Solo para que el almacén quede bonito.',()=>dispatch({type:'reason',id:'pretty'}),'choice answer','reason-pretty'));
   }
   if(state.stage===5){help='Misión completada. Puedes volver al gimnasio o reiniciarla desde el menú.';objectTitle='';targetTitle='';}
  }
 }
 $('inventory-help').textContent=help;$('object-title').textContent=objectTitle;$('target-title').textContent=targetTitle;
 $('object-title').hidden=!list.childElementCount;$('target-title').hidden=!targetList.childElementCount;

 if(focusKey&&document.activeElement===document.body){const again=document.querySelector(`[data-focus="${focusKey}"]:not(:disabled)`);if(again)again.focus({preventScroll:true});else if(selected)$('destinations').querySelector('button')?.focus({preventScroll:true});else (choices.querySelector('button,a')||$('objects').querySelector('button:not(:disabled)'))?.focus({preventScroll:true});}
}
let pages=[], pageIndex=0, writing=0;
function showPage(instant=false){
 cancelAnimationFrame(writing);
 const [en,es]=pages[pageIndex];
 const lines=[];
 $('english').hidden=!en;
 $('spanish').hidden=!!en && english && !support;
 if(english && en)lines.push([$('english'),en]);
 if(!$('spanish').hidden)lines.push([$('spanish'),es]);
 const total=lines.reduce((n,[,line])=>n+line.length,0);
 const start=performance.now();
 const last=pageIndex===pages.length-1;
 $('accessible-line').textContent=lines.map(([,line])=>line).join(' ');
 $('advance').textContent='Ver frase ▸';
 function draw(now){
  let count=instant || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ? total : Math.floor((now-start)/28);
  const complete=count>=total;
  for(const [node,line] of lines){
   node.textContent=line.slice(0,Math.max(0,count));
   count-=line.length;
  }
  if(!complete){writing=requestAnimationFrame(draw);return;}
  writing=0;
  $('advance').textContent=last?'Cerrar ▾':'Siguiente ▸';
 }
 draw(start);
}
function advance(){
 if(writing)showPage(true);
 else if(pageIndex+1<pages.length){pageIndex++;showPage();}
 else $('dialogue').close();
}
$('advance').onclick=advance;
$('lines').onclick=advance;
$('prof').onclick=()=>{
 speakAndPoint();
 pages=state.stage===5 ? [prompts()] : [
  ['Let’s get the gym ready for class.',state.stage===0?'¡Qué bien que hayas venido! Hoy vamos a preparar el gimnasio.':'¡Ya estás aquí! Aún nos queda algo por preparar.'],
  state.stage===0 ? ['Let’s go to the equipment room. '+storePrompt()[0], 'Entra por la puerta del almacén y busca '+item(find[state.found.length]).es+'.'] : storePrompt()
 ];
 pageIndex=0;
 $('dialogue').showModal();
 showPage();
};
$('dialogue').addEventListener('close',()=>{
 cancelAnimationFrame(writing);writing=0;
 window.speechSynthesis?.cancel();
 if(room==='gym')$('prof').focus({preventScroll:true});
});
$('hint').onclick=()=>{
 $('journal-hint').textContent=hints[state.stage]();
 state=act(state,{type:'hint'}).state;persist();
};
$('listen').onclick=()=>{if(!('speechSynthesis'in window)){say('Este navegador no ofrece voz. La instrucción está disponible por escrito.');return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(prompts()[0]);u.lang='en-GB';u.rate=.85;speechSynthesis.speak(u);};
$('settings').onclick=()=>$('settings-dialog').showModal();$('translation').onchange=e=>{support=e.target.checked;persist();render();};$('motion').onchange=e=>{reduced=e.target.checked;persist();render();};
$('sound').onchange=e=>{sound=e.target.checked;setSound(sound);persist();play('pick');};
$('reset').onclick=()=>{if(!confirm('¿Borrar el progreso de esta misión en este navegador?'))return;state=fresh();room='gym';selected=null;persist();render();$('settings-dialog').close();say('Nueva misión. Habla con el profe y entra al almacén.');};
$('home').href=$('menu-home').href=backToHub();
// Painted pieces switch themselves on in style.css as they are delivered (arte/lotes/14-gimnasio.json).
for(const piece of PINTADOS)document.body.classList.add('con-'+piece);
// Painted icons replace the line drawings.
for(const el of document.querySelectorAll('[data-icon]'))if(PINTADOS.includes('icon-'+el.dataset.icon))el.querySelector('svg').outerHTML=`<img class="icon" alt="" draggable="false" src="assets/icon-${el.dataset.icon}.webp">`;
render();

$('journal').onclick=()=>{$('journal-hint').textContent='';$('journal-dialog').showModal();};
$('journal-dialog').addEventListener('close',()=>window.speechSynthesis?.cancel());
$('inventory').onclick=()=>$('inventory-dialog').showModal();
if(!document.fullscreenEnabled)$('fullscreen').hidden=true;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{say('El navegador no permite activar pantalla completa. La escena sigue ocupando toda la ventana.');}};
let rotateOk=false;try{rotateOk=sessionStorage.getItem('gym-rotate-ok')==='1';}catch{}
document.body.classList.toggle('rotate-ok',rotateOk);
$('rotate-close').onclick=()=>{document.body.classList.add('rotate-ok');try{sessionStorage.setItem('gym-rotate-ok','1');}catch{}};
const showFeedback=()=>{$('feedback').classList.add('visible');clearTimeout(showFeedback.timer);showFeedback.timer=setTimeout(()=>$('feedback').classList.remove('visible'),8500);};
new MutationObserver(showFeedback).observe($('feedback'),{childList:true,characterData:true,subtree:true});
say(state.stage===0?'':state.stage===5?'Misión completada.':'Continúas donde lo dejaste.');

// Things on the furniture and the trolley stay in sight: the pupil stops beside them, not in front,
// on the side it comes from and away from the trolley.
function standFor(target,bounds){
 let focus,gap=.085;
 if(target.classList.contains('destination')){if(!selected)return null;const [left,,width]=parts[selected];focus=(left+width/2)/100;}
 else if(target.classList.contains('unit')){focus=trolleyAt.store[0]/100;gap=trolleyAt.store[2]/200+.05;}
 else if(target.matches('.pick,.risk-mat,.equipment')){const hit=target.getBoundingClientRect();focus=(hit.left+hit.width/2-bounds.left)/bounds.width;}
 else return null;
 const from=position().x,cart=room==='store'&&state.stage>=3?[(trolleyAt.store[0]-trolleyAt.store[2]/2)/100-.04,(trolleyAt.store[0]+trolleyAt.store[2]/2)/100+.04]:null;
 const cost=x=>(x<.04||x>.96?9:0)+(cart&&x>cart[0]&&x<cart[1]?3:0)+Math.abs(x-from);
 return [[focus-gap,focus+gap].sort((a,b)=>cost(a)-cost(b))[0],.92];
}
// Approach the clicked landmark before executing its room-specific action.
$('scene').addEventListener('click', event => {
 const target = event.target.closest('button');
 const bounds = $('world').getBoundingClientRect();
 if (target) {
  event.stopImmediatePropagation();
  const hit = target.getBoundingClientRect();
  const isTeacher = target.id === 'prof';
  const stand = standFor(target, bounds);
  const approachFromLeft = position().x < (hit.left + hit.width/2 - bounds.left)/bounds.width;
  const footX = isTeacher ? (approachFromLeft ? hit.left-hit.width*.14 : hit.right+hit.width*.14) : hit.left + hit.width / 2;
  const x = stand ? stand[0] : (footX - bounds.left) / bounds.width;
  const y = stand ? stand[1] : (hit.bottom - bounds.top) / bounds.height;
  // The pupil turns to the thing and bends down for whatever is taken, left or checked.
  const handles = target.matches('.pick,.equipment,.risk,.unit,.destination');
  const side = handles ? ((hit.left + hit.width / 2 - bounds.left) / bounds.width >= x ? 1 : -1) : undefined;
  walkTo(x, y, () => { if (!target.isConnected) return; if (handles && !target.disabled) reach(); target.onclick?.(); }, isTeacher ? (approachFromLeft ? 1 : -1) : side);
 } else {
  walkTo((event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height);
 }
}, true);
