import {equipment,targets,find,request,fresh,valid,act} from './mission.js';
import {walkTo, enterRoom} from './walk.js?v=studio-4';
import {speakAndPoint} from './robles.js';
const icon = id => '<img alt="" draggable="false" src="assets/prop-' + id + '.webp">';
const $=id=>document.getElementById(id), key='ef-gym-mission-v1';
let state=fresh(),room='gym',selected=null,support=true,reduced=false;
try{const saved=JSON.parse(localStorage.getItem(key));if(valid(saved?.state)){state=saved.state;support=saved.support!==false;reduced=!!saved.reduced;}}catch{}
const steps=['Localiza el material','Despeja la puerta','Cada cosa en su lugar','Prepara el pedido','Revisa y explica'];
const prompts=()=>[
 [`Find a ${equipment.find(e=>e.id===find[state.found.length])?.en||'hoop'}.`,`Localiza: ${equipment.find(e=>e.id===find[state.found.length])?.es||'aro'}.`],
 ['Keep the doorway clear. Put the cone on the cone stand.','Despeja la puerta. Coloca el cono en su soporte.'],
 ['Put the equipment away. Choose an item, then its place.','Guarda el material. Selecciona un objeto y después su lugar.'],
 ['We need four cones, two hoops and one soft ball.','Necesitamos cuatro conos, dos aros y una pelota blanda.'],
 ['Find two safety problems. Then explain why we fix them.','Localiza dos riesgos y explica por qué los corregimos.'],
 ['The gym is ready. Thank you, team!','El gimnasio está listo. ¡Gracias, equipo!']
][state.stage];
const hints=[()=>`Busca ${equipment.find(e=>e.id===find[state.found.length])?.es}. Puedes mirar los nombres en los controles accesibles.`,()=> 'El cono naranja está delante del acceso. Selecciónalo y elige «Cone stand».',()=> 'Balones al rack; conos a su soporte; aros y raquetas al soporte de pared; cuerdas, petos y saquitos a las cajas; colchoneta a su zona baja.',()=> 'Toca cuatro veces el cono, dos veces el aro y una vez la pelota verde. Después comprueba el carro.',()=> 'Revisa la salida bloqueada y la colchoneta situada en alto. Toca ambos avisos y elige la razón relacionada con la seguridad.',()=> 'Explica a un compañero cómo prepararías una estación real y qué paso debe quedar libre.'];
function persist(){try{localStorage.setItem(key,JSON.stringify({state,support,reduced}));}catch{$('feedback').textContent+=' El navegador no permite guardar; puedes continuar sin cerrar esta pestaña.';}}
function dispatch(event){const result=act(state,event);state=result.state;if(result.ok)selected=null;persist();render();$('feedback').textContent=result.message||'Pedido actualizado.';}
function choose(id){
 if($('inventory-dialog').open)$('inventory-dialog').close();
 if(room!=='store'){room='store';render();}
 if(state.stage===0){dispatch({type:'find',id});return;}
 if(state.stage===3){dispatch({type:'add',id});return;}
 selected=id;render();$('feedback').textContent=`${equipment.find(e=>e.id===id).en}: elige dónde colocarlo.`;
}
function place(target){if($('inventory-dialog').open)$('inventory-dialog').close();if(!selected){$('feedback').textContent='Primero selecciona un material.';return;}dispatch({type:'place',id:selected,target});}
function button(text,fn,cls=''){const b=document.createElement('button');b.textContent=text;b.className=cls;b.onclick=fn;return b;}
function render(){
 const focused=document.activeElement;const focusText=focused?.tagName==='BUTTON'?focused.textContent:null;
 document.body.dataset.stage=state.stage;document.body.classList.toggle('reduced',reduced);$('translation').checked=support;$('motion').checked=reduced;
 $('scene').className=`scene ${room}`;$('room-title').textContent=room==='gym'?'El gimnasio':'El cuarto de materiales';$('location').textContent=room==='gym'?'THE GYM · TU PUNTO DE ENCUENTRO':'THE EQUIPMENT ROOM · MISIÓN EN CURSO';$('switch-room').textContent=room==='gym'?'Entrar al almacén':'Volver al gimnasio';
 $('prof').classList.toggle('hidden',room==='store');
 $('steps').innerHTML=steps.map((s,i)=>`<li class="${i<state.stage?'done':i===state.stage?'current':''}"><span>${i<state.stage?'✓':i+1}</span>${s}</li>`).join('');$('stage-count').textContent=state.stage===5?'COMPLETADA':`${state.stage+1} / 5`;
 const [en,es]=room==='gym'&&state.stage<5?['Meet me by the equipment room.','Camina hasta mí o toca la puerta del almacén.']:prompts();$('english').textContent=en;$('spanish').textContent=es;$('spanish').hidden=!support;
 $('selection').textContent=selected?`${equipment.find(e=>e.id===selected).en} seleccionado · Elige un destino`:room==='gym'?'Toca el suelo para caminar. Toca al profe para hablar.':state.stage===3?'Toca el material para añadir una unidad al carro.':'Selecciona un material · Después elige su lugar';
 $('objects').replaceChildren();$('destinations').replaceChildren();$('hotspots').replaceChildren();$('object-list').replaceChildren();$('target-list').replaceChildren();$('actions').replaceChildren();
 enterRoom(room);
 if(room==='gym'){
  const door=button('ALMACÉN',()=>{room='store';selected=null;render();},'scene-link door');$('hotspots').append(door);
  const board=button('PISTA · MATE',()=>{location.href='../mate/';},'scene-link board');$('hotspots').append(board);
  $('scene-caption').textContent=state.stage===5?'Todo listo para la próxima sesión.':'El profe necesita tu ayuda para preparar la sesión.';
 }else{
  $('hotspots').append(button('GIMNASIO',()=>{room='gym';selected=null;render();},'scene-link return-door'));
  $('scene-caption').textContent=state.stage===5?'¡Buen trabajo! El almacén está preparado.':state.stage===3?'Prepara el carro con el pedido del profe.':'Mira, selecciona y coloca. Cada cosa tiene su lugar.';
  if(state.stage<4){
   for(const [id,[en,es,x,y]] of Object.entries(targets)){
    const t=button(en,()=>place(id),'destination');t.style.left=x+'%';t.style.top=y+'%';t.disabled=!selected;t.setAttribute('aria-label',`${en} · ${es}`);$('destinations').append(t);
    $('target-list').append(button(`${en} · ${es}`,()=>place(id)));
   }
   equipment.forEach((e,i)=>{
    const stored=state.stored.includes(e.id);if(state.stage===3&&!['cone','hoop','softball'].includes(e.id))return;
    const b=button('',()=>choose(e.id),`equipment ${stored?'stored':''} ${selected===e.id?'selected':''}`);b.innerHTML=icon(e.id)+`<span>${e.en}</span>`;b.setAttribute('aria-label',`${e.en} · ${e.es}${stored?' · guardado':''}`);
    let x=e.id==='cone'?14:e.x,y=e.y;if(stored&&state.stage!==3){const home=targets[e.home];x=home[2]+(i%3-1)*3;y=home[3]+(e.home==='platform'?-1:12)+(i%2)*2;}if(state.stage===3){x=24+['cone','hoop','softball'].indexOf(e.id)*24;y=67;}
    b.dataset.item=e.id; b.style.left=x+'%';b.style.top=y+'%';b.disabled=stored&&state.stage===2;$('objects').append(b);
    const alt=button(`${e.en}${support?' · '+e.es:''}${stored?' ✓':''}`,()=>choose(e.id));alt.disabled=stored&&state.stage===2;$('object-list').append(alt);
   });
  }
  if(state.stage===4){
   const a=button(state.hazards.includes('door')?'✓ Salida despejada':'Revisar salida bloqueada',()=>dispatch({type:'hazard',id:'door'}),'hazard exit-risk');a.disabled=state.hazards.includes('door');$('objects').append(a);
   const b=button(state.hazards.includes('shelf')?'✓ Ayuda del profe solicitada':'Revisar colchoneta en alto',()=>dispatch({type:'hazard',id:'shelf'}),'hazard shelf-risk');b.disabled=state.hazards.includes('shelf');$('objects').append(b);
   const mat=document.createElement('div');mat.className='risk-mat';mat.innerHTML=icon('mat');if(!state.hazards.includes('shelf'))$('objects').append(mat);
   if(!state.hazards.includes('door')){const c=document.createElement('div');c.className='risk-cone';c.innerHTML=icon('cone');$('objects').append(c);}
  }
 }
 if(state.stage===3){
  const cart=document.createElement('div');cart.className='cart';cart.innerHTML='<strong>THE TROLLEY · PEDIDO</strong>';
  for(const [id,n]of Object.entries(request)){cart.append(button(`${equipment.find(e=>e.id===id).en}: ${state.cart[id]||0} / ${n} · quitar 1`,()=>dispatch({type:'remove',id})));}
  $('actions').append(cart,button('Comprobar pedido',()=>dispatch({type:'check'}),'primary'));
 }
 if(state.stage===4){
  const p=document.createElement('p');p.textContent='Why do we fix these problems?';$('actions').append(p);
  $('actions').append(button('To prevent trips and falling equipment.',()=>dispatch({type:'reason',id:'safe'}),'answer'),button('Only to make the room look pretty.',()=>dispatch({type:'reason',id:'pretty'}),'answer'));
 }
 if(state.stage===5){
  const p=document.createElement('div');p.className='completion';p.innerHTML='<strong>MISSION COMPLETE</strong><p>Has localizado material, preparado un pedido y revisado riesgos.</p><p lang="en">Tell your partner: where do the hoops go?</p><p>Ahora explica cómo dejarías libre un paso en el gimnasio real.</p><small>Esta misión comprueba comprensión. El profe observa la práctica real.</small>';$('actions').append(p,button('Volver al gimnasio',()=>{room='gym';render();},'primary'));
 }
 if(focusText){const replacement=[...document.querySelectorAll('button')].find(b=>b.textContent===focusText&&!b.disabled);if(replacement)replacement.focus({preventScroll:true});else if(selected){$('target-list').querySelector('button')?.focus({preventScroll:true});}else{$('object-list').querySelector('button:not(:disabled)')?.focus({preventScroll:true});}}
}
$('switch-room').onclick=()=>document.querySelector(room==='gym'?'.door':'.return-door').click();
$('prof').onclick=()=>{
 speakAndPoint();
 $('english').textContent=state.stage===5?'Thank you! The gym is ready.':'Can you help me get the equipment ready? Follow the equipment room sign.';
 $('spanish').textContent=state.stage===5?'¡Gracias! El gimnasio está listo.':'¿Me ayudas a preparar el material? Sigue el cartel del almacén.';
 $('feedback').textContent='Robles se gira hacia ti.';
};
$('hint').onclick=()=>{const msg=hints[state.stage]();state=act(state,{type:'hint'}).state;persist();$('feedback').textContent=msg;};
$('listen').onclick=()=>{if(!('speechSynthesis'in window)){$('feedback').textContent='Este navegador no ofrece voz. La instrucción está disponible por escrito.';return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance($('english').textContent);u.lang='en-GB';u.rate=.85;speechSynthesis.speak(u);};
$('settings').onclick=()=>$('settings-dialog').showModal();$('translation').onchange=e=>{support=e.target.checked;persist();render();};$('motion').onchange=e=>{reduced=e.target.checked;persist();render();};
$('reset').onclick=()=>{if(!confirm('¿Borrar el progreso de esta misión en este navegador?'))return;state=fresh();room='gym';selected=null;persist();render();$('settings-dialog').close();$('feedback').textContent='Nueva misión. Habla con el profe y entra al almacén.';};
render();

$('journal').onclick=()=>$('journal-dialog').showModal();
$('inventory').onclick=()=>$('inventory-dialog').showModal();
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('feedback').textContent='El navegador no permite activar pantalla completa. La escena sigue ocupando toda la ventana.';}};
const showFeedback=()=>{$('feedback').classList.add('visible');clearTimeout(showFeedback.timer);showFeedback.timer=setTimeout(()=>$('feedback').classList.remove('visible'),8500);};
new MutationObserver(showFeedback).observe($('feedback'),{childList:true,characterData:true,subtree:true});
showFeedback();

// Approach the clicked landmark before executing its room-specific action.
$('scene').addEventListener('click', event => {
 const target = event.target.closest('button');
 const bounds = $('world').getBoundingClientRect();
 if (target) {
  event.stopImmediatePropagation();
  const hit = target.getBoundingClientRect();
  const x = (hit.left + hit.width / 2 - bounds.left) / bounds.width;
  const y = (hit.bottom - bounds.top) / bounds.height;
  walkTo(x, y, () => { if (target.isConnected) target.onclick?.(); });
 } else {
  walkTo((event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height);
 }
}, true);
