import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

function storage(){const items=new Map();return {getItem:key=>items.has(key)?items.get(key):null,setItem:(key,value)=>{items.set(key,String(value));},removeItem:key=>{items.delete(key);}};}
const {POSES,CALM,SAMPLES,byId}=await import('../tatami/posturas.js');
const S=await import('../tatami/secuencia.js');
const E=await import('../tatami/esqueleto.js');
const {sceneMarkup}=await import('../tatami/figura.js');
const {PINTADAS}=await import('../tatami/assets/pintadas.js');
const root=fileURLToPath(new URL('..',import.meta.url));

test('tatami: doce posturas completas, con nombre en los dos idiomas y letra única',()=>{
 const ids=['mountain','tree','chair','warrior1','warrior2','triangle','cat','cow','downdog','cobra','butterfly','child'];
 assert.deepEqual(POSES.map(pose=>pose.id),ids);
 assert.equal(new Set(POSES.map(pose=>pose.code)).size,12);
 assert.equal(new Set(POSES.map(pose=>pose.es)).size,12);
 for(const pose of POSES){
  assert.match(pose.code,/^[A-Z]$/,pose.id);
  for(const key of ['es','en','feel','safety','chair'])assert.ok(typeof pose[key]==='string'&&pose[key].length>2,`${pose.id}.${key}`);
  assert.ok(pose.steps.length>=2&&pose.steps.length<=3,pose.id);
  for(const step of [...pose.steps,pose.exit])assert.ok(step.es.length>5&&step.en.length>3,pose.id);
  assert.ok(Number.isInteger(pose.breaths)&&pose.breaths>=3&&pose.breaths<=6,pose.id);
  assert.equal(typeof pose.sides,'boolean');
 }
 // Prudent content: knees over ankles, no forcing, no head or neck loading.
 assert.match(byId('warrior1').safety,/tobillo/);
 assert.match(byId('tree').steps[1].es,/nunca en la rodilla/);
 assert.ok(POSES.every(pose=>!/sobre la cabeza|apoya la cabeza en el suelo|vela|pino/i.test(pose.steps.map(s=>s.es).join(' '))));
 for(const sample of SAMPLES)assert.ok(sample.poses.every(byId),sample.name);
});

test('tatami: cada postura tiene figura provisional apoyada en la esterilla y dentro del dibujo',()=>{
 for(const id of [...POSES.map(p=>p.id),CALM.id]){
  assert.ok(E.FIGURES[id]?.frames.length===3,id);
  for(const t of [0,.5,1,1.5,2])for(const chair of [false,true]){
   const j=E.figureAt(id,t,{chair});
   for(const [name,p] of Object.entries(j)){
    if(!Array.isArray(p))continue;
    assert.ok(p[0]>=0&&p[0]<=E.W&&p[1]>=0&&p[1]<=E.FLOOR+6,`${id} t=${t} silla=${chair} ${name} fuera`);
    if(!chair&&E.REACH[name])assert.ok(p[1]+E.REACH[name]<=E.FLOOR+.5,`${id} ${name} bajo el suelo`);
   }
   if(chair)assert.ok(Math.max(j.a1[1]+8,j.a2[1]+8)<=E.FLOOR+6,`${id} silla: pies bajo el suelo`);
  }
  const pose=E.figureAt(id,2);
  for(const joint of E.SUPPORTS[id])assert.ok(E.FLOOR-(pose[joint][1]+E.REACH[joint])<=12,`${id}: ${joint} no se apoya`);
 }
 // The tree really stands on one foot, and limbs keep their length while animating.
 const tree=E.figureAt('tree',2);
 assert.ok(E.FLOOR-(tree.a1[1]+8)>40);
 const lengths=t=>{const j=E.figureAt('warrior1',t);return [Math.hypot(j.k1[0]-j.p1[0],j.k1[1]-j.p1[1]),Math.hypot(j.w1[0]-j.e1[0],j.w1[1]-j.e1[1])];};
 for(const t of [0,.3,.7,1.2,2])assert.deepEqual(lengths(t).map(Math.round),[E.BONES.thigh,E.BONES.fore]);
 assert.match(sceneMarkup('cobra',1),/^<path/);
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
 assert.equal(S.figureTime({kind:'enter'},.5),1);
 assert.equal(S.figureTime({kind:'exit'},.25),1.5);
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
  const sheet=lote['pose-'+pose.id];
  assert.ok(sheet,pose.id);
  assert.deepEqual([sheet.ancho,sheet.alto,sheet.transparente,sheet.exacto,sheet.clave,sheet.destino],[1536,640,true,true,pose.id,`tatami/assets/pose-${pose.id}.webp`]);
  if(pose.id!=='calma')assert.equal(lote[`pose-${pose.id}-silla`].clave,pose.id+'-silla');
 }
 assert.equal(lote.room.destino,'tatami/assets/room.webp');
 assert.ok(Array.isArray(PINTADAS));
});
