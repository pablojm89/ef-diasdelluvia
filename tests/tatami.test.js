import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

function storage(){const items=new Map();return {getItem:key=>items.has(key)?items.get(key):null,setItem:(key,value)=>{items.set(key,String(value));},removeItem:key=>{items.delete(key);}};}
const {POSES,FAMILIES,LEVELS,CALM,SAMPLES,byId}=await import('../tatami/posturas.js');
const S=await import('../tatami/secuencia.js');
const E=await import('../tatami/esqueleto.js');
const {sceneMarkup,frameCount,sheet,thumbMarkup}=await import('../tatami/figura.js');
const {PINTADAS}=await import('../tatami/assets/pintadas.js');
const root=fileURLToPath(new URL('..',import.meta.url));

test('tatami: catálogo de posturas completo, con nombre en los dos idiomas, familia, nivel y código único',()=>{
 // The first twelve keep their letter, so codes saved or shared before the catalogue grew still open.
 const first={mountain:'M',tree:'A',chair:'S',warrior1:'U',warrior2:'D',triangle:'T',cat:'G',cow:'V',downdog:'P',cobra:'C',butterfly:'B',child:'N'};
 for(const [id,code] of Object.entries(first))assert.equal(byId(id).code,code,id);
 assert.ok(POSES.length>=36);
 for(const key of ['id','code','es','en'])assert.equal(new Set(POSES.map(pose=>pose[key])).size,POSES.length,key);
 for(const family of FAMILIES)assert.ok(POSES.filter(pose=>pose.family===family.id).length>=4,family.id);
 assert.equal(new Set(POSES.map(pose=>pose.sa)).size,POSES.length);
 assert.deepEqual([byId('mountain').sa,byId('downdog').sa,byId('rest').sa,CALM.sa],['Tadasana','Adho Mukha Svanasana','Shavasana','Sukhasana']);
 // Poses come grouped by family, in the order of the family signs.
 assert.deepEqual([...new Set(POSES.map(pose=>pose.family))],FAMILIES.map(family=>family.id));
 for(const pose of POSES){
  assert.match(pose.code,/^[A-Z][2-9]?$/,pose.id);
  for(const key of ['es','en','feel','safety','chair'])assert.ok(typeof pose[key]==='string'&&pose[key].length>2,`${pose.id}.${key}`);
  assert.ok(pose.steps.length>=2&&pose.steps.length<=3,pose.id);
  for(const step of [...pose.steps,pose.exit])assert.ok(step.es.length>5&&step.en.length>3,pose.id);
  assert.ok(Number.isInteger(pose.breaths)&&pose.breaths>=3&&pose.breaths<=6,pose.id);
  assert.equal(typeof pose.sides,'boolean');
  assert.ok(LEVELS[pose.level]?.es,pose.id);
  assert.match(pose.chair,/^Sentad[oa]/,pose.id);
  // The original yoga name: Sanskrit without diacritics. Only the flamingo, a children's balance, has none.
  if(pose.id==='flamingo')assert.equal(pose.sa,'');else assert.match(pose.sa,/^[A-Z][a-z]+( [A-Z][a-z]+)*asana( I{1,3})?$/,pose.id);
 }
 // Prudent content: knees over ankles, no forcing, no head or neck loading.
 assert.match(byId('warrior1').safety,/tobillo/);
 assert.match(byId('tree').steps[1].es,/nunca en la rodilla/);
 assert.ok(POSES.every(pose=>!/sobre la cabeza|apoya la cabeza en el suelo|vela|pino/i.test(pose.steps.map(s=>s.es).join(' '))));
 for(const id of ['headstand','shoulderstand','plough','fish','wheel','camel','lotus','bow'])assert.equal(byId(id),undefined,id);
 assert.match(byId('bridge').safety,/nunca al cuello/);
 assert.match(byId('crab').safety,/No dejes caer la cabeza/);
 assert.match(byId('ragdoll').safety,/Rodillas siempre un poco dobladas/);
 // Every level-3 balance offers an easier way in its safety note; a class can start with level 1 in every family.
 for(const family of FAMILIES)assert.ok(POSES.some(pose=>pose.family===family.id&&pose.level===1),family.id);
 assert.ok(SAMPLES.length>=8);
 assert.equal(new Set(SAMPLES.map(sample=>sample.name)).size,SAMPLES.length);
 for(const sample of SAMPLES){
  assert.ok(sample.poses.every(byId)&&sample.poses.length>=5&&sample.poses.length<=S.MAX,sample.name);
  const minutes=S.seconds(S.plan(sample.poses))/60;
  assert.ok(minutes>=4&&minutes<=10,`${sample.name}: ${minutes.toFixed(1)} min`);
  // "No mat" sequences stay on the feet from beginning to end.
  if(sample.mat===false)assert.ok(sample.poses.every(id=>['pie','equilibrio'].includes(byId(id).family)),sample.name);
 }
 // Every pose is used by at least one ready-made sequence.
 const used=new Set(SAMPLES.flatMap(sample=>sample.poses));
 assert.deepEqual(POSES.filter(pose=>!used.has(pose.id)).map(pose=>pose.id),[]);
});

test('tatami: cada postura tiene figura provisional apoyada en la esterilla y dentro del dibujo',()=>{
 for(const id of [...POSES.map(p=>p.id),CALM.id]){
  assert.ok(E.FIGURES[id]?.frames.length>=3,id);
  for(const t of [0,.2,.4,.5,.6,.8,1])for(const chair of [false,true]){
   const j=E.figureAt(id,t,{chair});
   for(const [name,p] of Object.entries(j)){
    if(!Array.isArray(p))continue;
    assert.ok(p[0]>=0&&p[0]<=E.W&&p[1]>=0&&p[1]<=E.FLOOR+6,`${id} t=${t} silla=${chair} ${name} fuera`);
    if(!chair&&E.REACH[name])assert.ok(p[1]+E.REACH[name]<=E.FLOOR+.5,`${id} ${name} bajo el suelo`);
   }
   if(chair)assert.ok(Math.max(j.a1[1]+8,j.a2[1]+8)<=E.FLOOR+6,`${id} silla: pies bajo el suelo`);
  }
  const pose=E.figureAt(id,1);
  for(const joint of E.SUPPORTS[id])assert.ok(E.FLOOR-(pose[joint][1]+E.REACH[joint])<=12,`${id}: ${joint} no se apoya`);
 }
 // The tree really stands on one foot, and limbs keep their length while animating.
 const tree=E.figureAt('tree',1);
 assert.ok(E.FLOOR-(tree.a1[1]+8)>40);
 const lengths=t=>{const j=E.figureAt('warrior1',t);return [Math.hypot(j.k1[0]-j.p1[0],j.k1[1]-j.p1[1]),Math.hypot(j.w1[0]-j.e1[0],j.w1[1]-j.e1[1])];};
 for(const t of [0,.15,.35,.6,1])assert.deepEqual(lengths(t).map(Math.round),[E.BONES.thigh,E.BONES.fore]);
 assert.match(sceneMarkup('cobra',.5),/^<path/);
 assert.deepEqual(Object.keys(E.FIGURES).sort(),[...POSES.map(p=>p.id),CALM.id].sort());
 assert.deepEqual(Object.keys(E.SUPPORTS).sort(),Object.keys(E.FIGURES).sort());
});

test('tatami: cada postura se ve paso a paso, con la hoja de seis dibujos, la de tres o la figura provisional',()=>{
 for(const pose of [...POSES,CALM]){
  const expected=PINTADAS.includes(pose.id+'-pasos')?6:PINTADAS.includes(pose.id)?3:6;
  assert.equal(frameCount(pose.id),expected,pose.id);
  const art=sheet(pose.id);
  if(art)assert.match(art.url,expected===6?/pasos-[a-z0-9]+\.webp$/:/pose-[a-z0-9]+\.webp$/);
  assert.equal(frameCount(pose.id,true),PINTADAS.includes(pose.id+'-silla')?1:3,pose.id);
  assert.match(thumbMarkup(pose.id),/class="thumb/);
 }
 // The first twelve are painted: their approved three-drawing sheets keep working until the six-drawing ones arrive.
 assert.equal(sheet('mountain')?.frames>=3,true);
});

test('tatami: el código de una secuencia va y vuelve, también por el enlace',()=>{
 const ids=['mountain','tree','warrior2','triangle','child','child'];
 const code=S.encode(ids);
 assert.equal(code,'MADT-NN');
 assert.deepEqual(S.decode(code),ids);
 assert.deepEqual(S.decode(' madt nn '),ids);
 assert.deepEqual(S.fromHash(S.hashFor(ids)),ids);
 assert.equal(S.decode('MXZ'),null);
 assert.equal(S.decode(''),null);
 assert.equal(S.decode('M'.repeat(S.MAX+1)),null);
 for(const pose of POSES)assert.deepEqual(S.decode(S.encode([pose.id])),[pose.id]);
 // Poses beyond the alphabet carry a digit; a code is still grouped by four poses and read back without doubt.
 const mixed=['star','airplane','frog','crescent','child','mountain'];
 assert.equal(S.encode(mixed),'EA2RL2-NM');
 assert.deepEqual(S.decode('ea2r l2-nm'),mixed);
 assert.deepEqual(S.fromHash(S.hashFor(mixed)),mixed);
 assert.equal(S.hashFor(mixed),'#s=EA2RL2NM');
 for(const bad of ['2M','M9','M22','A2-'.repeat(S.MAX+1)])assert.equal(S.decode(bad),null,bad);
 assert.deepEqual(S.decode(S.encode(POSES.slice(0,S.MAX).map(pose=>pose.id))),POSES.slice(0,S.MAX).map(pose=>pose.id));
});

test('tatami: añadir, quitar y reordenar sin pasar del máximo',()=>{
 let list=[];
 for(let i=0;i<S.MAX+3;i++)list=S.add(list,'cat');
 assert.equal(list.length,S.MAX);
 assert.deepEqual(S.add([],'nope'),[]);
 assert.deepEqual(S.move(['cat','cow','child'],0,1),['cow','cat','child']);
 assert.deepEqual(S.move(['cat','cow'],0,-1),['cat','cow']);
 assert.deepEqual(S.removeAt(['cat','cow','child'],1),['cat','child']);
 assert.equal(S.append(list,['cow']).length,S.MAX);
});

test('tatami: turnos por equipos o persona a persona, sin nombres',()=>{
 const teams={kind:'equipos',teams:3,total:5};
 assert.deepEqual([0,1,2,3,4].map(n=>S.turn(teams,n).team),[1,2,3,1,2]);
 assert.equal(S.turn(teams,0).es,'Le toca al equipo 1');
 assert.equal(S.turn(teams,5).done,true);
 const people=S.turn({kind:'personas',total:4},2);
 assert.equal(people.team,null);
 assert.equal(people.number,3);
 assert.match(people.es,/siguiente persona/);
});

test('tatami: la práctica entra, respira, sale, hace los dos lados y acaba con la vuelta a la calma',()=>{
 const steps=S.plan(['mountain','tree'],{beat:4});
 const mountain=steps.filter(s=>s.pose==='mountain');
 assert.deepEqual(mountain.map(s=>s.kind).filter((k,i,a)=>k!==a[i-1]),['announce','enter','breathe','exit']);
 assert.equal(mountain.filter(s=>s.kind==='breathe').length,byId('mountain').breaths*2);
 assert.deepEqual([...new Set(steps.filter(s=>s.pose==='tree').map(s=>s.side))],[0,1]);
 assert.equal(steps.at(-1).kind,'end');
 assert.equal(steps.at(-2).pose,'calma');
 assert.ok(S.seconds(steps)>60&&S.seconds(steps)<240);
 assert.equal(S.figureTime({kind:'enter'},.5),.5);
 assert.equal(S.figureTime({kind:'exit'},.25),.75);
 assert.equal(S.figureTime({kind:'breathe'},.3),1);
 assert.equal(S.figureTime({kind:'announce'},.3),0);
 const second=S.jump(steps,0,1);
 assert.equal(steps[second].pose,'tree');
 assert.equal(S.jump(steps,second,-1),0);
});

test('tatami: guarda en este ordenador con el prefijo tatami-',()=>{
 const store=storage();
 S.save(store,['cat','cow']);S.save(store,['child']);S.save(store,['cat','cow']);
 assert.deepEqual(S.savedList(store).map(item=>item.code),['GV','N']);
 assert.deepEqual(S.forget(store,'N').map(item=>item.code),['GV']);
 S.saveDraft(store,['cobra']);
 assert.deepEqual(S.loadDraft(store),['cobra']);
 assert.deepEqual(S.loadSettings(store),{beat:4,chair:false});
 store.setItem(S.KEY,'{roto');
 assert.deepEqual(S.savedList(store),[]);
 for(const key of [S.KEY,S.DRAFT,S.SETTINGS])assert.match(key,/^tatami-/);
});

test('tatami: la página enlaza lo que existe y el pedido de arte cubre cada postura',()=>{
 const page=readFileSync(root+'tatami/index.html','utf8');
 for(const [,link] of page.matchAll(/(?:href|src)="(\.{1,2}\/[^"#]+)"/g))assert.ok(existsSync(new URL(link,'file://'+root+'tatami/').pathname),link);
 const lote=JSON.parse(readFileSync(root+'arte/lotes/10-tatami.json','utf8'));
 assert.equal(lote._indice.archivo,'tatami/assets/pintadas.js');
 for(const pose of [...POSES,CALM]){
  const steps=lote['pasos-'+pose.id];
  assert.ok(steps,pose.id);
  assert.deepEqual([steps.ancho,steps.alto,steps.transparente,steps.exacto,steps.clave,steps.destino],[1536,1280,true,true,pose.id+'-pasos',`tatami/assets/pasos-${pose.id}.webp`]);
  assert.equal(steps.prompt.match(/Dibujo \d:/g).length,6,pose.id);
  const strip=lote['pose-'+pose.id];
  if(strip)assert.deepEqual([strip.ancho,strip.alto,strip.clave,strip.destino],[1536,640,pose.id,`tatami/assets/pose-${pose.id}.webp`]);
  else assert.ok(!PINTADAS.includes(pose.id),pose.id);
  if(pose.id!=='calma')assert.deepEqual([lote[`pose-${pose.id}-silla`].clave,lote[`pose-${pose.id}-silla`].ancho],[pose.id+'-silla',512]);
 }
 // What the index says is painted exists on disk.
 for(const key of PINTADAS){
  const file=key.endsWith('-pasos')?`pasos-${key.slice(0,-6)}`:['room','robles-yoga'].includes(key)?key:`pose-${key}`;
  assert.ok(existsSync(root+`tatami/assets/${file}.webp`),key);
 }
 assert.equal(lote.room.destino,'tatami/assets/room.webp');
 assert.ok(Array.isArray(PINTADAS));
});

test('calma: la ola no pide retener el aire y suelta más despacio de lo que coge; tensar y soltar recorre el cuerpo en dos idiomas',async()=>{
 const calma=await import('../tatami/calma.js');
 const ola=calma.plan('ola');
 assert.equal(ola.length%2,0);
 assert.deepEqual([...new Set(ola.map(paso=>paso.fase))],['in','out'],'sólo coger y soltar: sin apneas');
 for(let i=0;i<ola.length;i+=2)assert.ok(ola[i+1].segundos>ola[i].segundos,'la salida es más larga');
 const tensar=calma.plan('tensar');
 assert.ok(tensar.length>=12);
 for(let i=0;i<tensar.length;i+=2){
  assert.equal(tensar[i].fase,'tense');assert.equal(tensar[i+1].fase,'release');
  assert.ok(tensar[i].segundos<=6&&tensar[i+1].segundos>tensar[i].segundos,'se aprieta poco y se suelta más');
  assert.ok(tensar[i].es&&tensar[i].en&&tensar[i].orden);
 }
 for(const tipo of Object.keys(calma.RUTINAS)){
  assert.ok(calma.duracion(tipo)>=90&&calma.duracion(tipo)<=150,`${tipo}: unos dos minutos`);
  assert.match(calma.RUTINAS[tipo].como,/sentados/,'variante sentada a la vista');
 }
 assert.deepEqual(calma.plan('otra'),[]);
 assert.equal(calma.tamano('in',0),0);assert.equal(calma.tamano('in',1),1);
 assert.equal(calma.tamano('out',1),0);assert.equal(calma.tamano('tense',1),0);assert.equal(calma.tamano('release',1),1);
 assert.ok(calma.tamano('in',.5)>0&&calma.tamano('in',.5)<1);
});
