export const equipment = [
 ['cone','cone','cono','rack',18,81],['hoop','hoop','aro','hooks',45,80],['rope','skipping rope','cuerda','bins',72,84],['racket','racket','raqueta','hooks',59,76],['bib','bib','peto','bins',31,85],['mat','mat','colchoneta','platform',81,79],['beanbag','beanbag','saquito','bins',38,74],['basketball','basketball','balón de baloncesto','balls',23,70],['football','football','balón de fútbol','balls',65,88],['softball','soft ball','pelota blanda','balls',52,88]
].map(([id,en,es,home,x,y])=>({id,en,es,home,x,y}));
export const targets={rack:['Cone stand','Soporte de conos',41.6,56.9],balls:['Ball rack','Rack de balones',27.5,53],bins:['Storage bins','Cajas de material',55.6,41.3],hooks:['Wall rack','Soporte de pared',76,40],platform:['Mat area','Zona de colchonetas',86,67]};
export const find=['hoop','cone','rope'];
export const request={cone:4,hoop:2,softball:1};
export function fresh(){return {version:1,stage:0,found:[],stored:[],cart:{},hazards:[],reason:false,attempts:0,hints:0};}
export function valid(s){
 if(!s||s.version!==1||!Number.isInteger(s.stage)||s.stage<0||s.stage>5)return false;
 if(!Number.isInteger(s.attempts)||s.attempts<0||!Number.isInteger(s.hints)||s.hints<0)return false;
 if(!Array.isArray(s.found)||!s.found.every((x,i)=>find[i]===x)||s.found.length>3)return false;
 if(!Array.isArray(s.stored)||new Set(s.stored).size!==s.stored.length||!s.stored.every(x=>equipment.some(e=>e.id===x)))return false;
 if(!s.cart||typeof s.cart!=='object'||Array.isArray(s.cart)||!Object.entries(s.cart).every(([k,v])=>Object.hasOwn(request,k)&&Number.isInteger(v)&&v>=0&&v<=request[k]))return false;
 if(!Array.isArray(s.hazards)||new Set(s.hazards).size!==s.hazards.length||!s.hazards.every(x=>['door','shelf'].includes(x))||typeof s.reason!=='boolean')return false;
 if(s.stage===0&&s.found.length===3||s.stage>=1&&s.found.length!==3)return false;
 if(s.stage>=2&&!s.stored.includes('cone')||s.stage>=3&&s.stored.length!==equipment.length)return false;
 if(s.stage>=4&&!Object.entries(request).every(([id,n])=>s.cart[id]===n))return false;
 if(s.stage===5&&(!s.reason||s.hazards.length!==2))return false;
 return true;
}
export function act(state,event){
 const s=structuredClone(state);let ok=false,message='';const item=equipment.find(e=>e.id===event.id);
 if(event.type==='hint'){s.hints++;return {state:s,ok:true,message:'La pista está abierta. Puedes volver a intentarlo.'};}
 s.attempts++;
 if(s.stage===0&&event.type==='find'){
  ok=event.id===find[s.found.length];if(ok){s.found.push(event.id);message='That’s it! Bien localizado.';if(s.found.length===3)s.stage=1;}else message='Escucha la consigna y mira la forma del material. Try again.';
 }else if(s.stage===1&&event.type==='place'){
  ok=event.id==='cone'&&event.target==='rack';if(ok){s.stored.push('cone');s.stage=2;message='Keep the doorway clear. ¡Ahora podemos pasar!';}else message='Primero despeja la puerta: coloca el cono en su soporte.';
 }else if(s.stage===2&&event.type==='place'){
  ok=!!item&&item.home===event.target&&!s.stored.includes(item.id);if(ok){s.stored.push(item.id);message=`Good! Put the ${item.en} away.`;if(s.stored.length===equipment.length)s.stage=3;}else message='Ese material necesita otro lugar. Mira los soportes o consulta la pista.';
 }else if(s.stage===3&&event.type==='add'){
  ok=event.id in request&&(s.cart[event.id]||0)<request[event.id];if(ok){s.cart[event.id]=(s.cart[event.id]||0)+1;message='Added to the trolley. Puedes retirar una unidad tocando su contador.';}else message='Revisa el pedido: necesitamos cuatro conos, dos aros y una pelota blanda.';
 }else if(s.stage===3&&event.type==='remove'){
  ok=(s.cart[event.id]||0)>0;if(ok)s.cart[event.id]--;
 }else if(s.stage===3&&event.type==='check'){
  ok=Object.entries(request).every(([id,n])=>s.cart[id]===n);if(ok){s.stage=4;message='Order ready! Ahora revisa una situación nueva.';}else message='Aún falta material. Compara las cantidades con el pedido.';
 }else if(s.stage===4&&event.type==='hazard'){
  ok=['door','shelf'].includes(event.id)&&!s.hazards.includes(event.id);if(ok){s.hazards.push(event.id);message=event.id==='door'?'Correct: keep the exit clear.':'Correct: ask the teacher for help. Una colchoneta no debe quedar en alto.';}
 }else if(s.stage===4&&event.type==='reason'){
  ok=s.hazards.length===2&&event.id==='safe';if(ok){s.reason=true;s.stage=5;message='Mission complete! El gimnasio está listo.';}else message=s.hazards.length<2?'Primero localiza los dos riesgos.':'Piensa en cómo evitar tropiezos y caídas de material.';
 }
 return {state:s,ok,message};
}
