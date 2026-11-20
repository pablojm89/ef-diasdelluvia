import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// The record lives in the browser's storage; a small stand-in is enough here.
function storage(){const items=new Map();return {getItem:key=>items.has(key)?items.get(key):null,setItem:(key,value)=>{items.set(key,String(value));},removeItem:key=>{items.delete(key);},clear:()=>items.clear()};}
globalThis.localStorage=storage();globalThis.sessionStorage=storage();
const {challenges,families}=await import('../content.js');
const {eligibleChallenges}=await import('../engine.js');
const registro=await import('../registro.js');

const root=fileURLToPath(new URL('..',import.meta.url));
const read=file=>readFileSync(root+file,'utf8');
const local=value=>!/^(https?:|#|mailto:)/.test(value);
const target=(page,value)=>{
 const path=value.split('#')[0].split('?')[0];
 const base=page.includes('/')?page.slice(0,page.lastIndexOf('/')+1):'';
 const resolved=new URL(path,'https://hub.test/'+base).pathname.slice(1);
 return resolved===''||resolved.endsWith('/')?resolved+'index.html':resolved;
};

test('portada: todo lo enlazado existe y un niño sólo ve una forma de entrar',()=>{
 const page=read('index.html');
 const links=[...page.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(local);
 for(const link of links)assert.ok(existsSync(root+target('index.html',link)),link);
 for(const style of [...read('hub.css').matchAll(/url\('([^']+)'\)/g)])assert.ok(existsSync(root+target('hub.css',style[1])),style[1]);
 const start=page.slice(page.indexOf('id="view-title"'),page.indexOf('id="view-login"'));
 assert.equal((start.match(/class="sign/g)||[]).length,1);
 assert.equal((start.match(/class="quiet"/g)||[]).length,2);
 const script=read('hub.js');
 for(const art of [...script.matchAll(/art: '([^']+)'/g)])assert.ok(existsSync(`${root}assets/${art[1]}.webp`),art[1]);
});
test('portada: las salas llevan el nombre del hub y el camino de vuelta, sin restos de nombres anteriores',()=>{
 for(const [page,back] of [['mate/index.html','../'],['gimnasio/index.html','../']]){
  const html=read(page);
  assert.ok(html.includes(`href="${back}"`),page);
  assert.match(html,/El Pabellón|EL PABELLÓN/,page);
 }
 for(const page of ['index.html','mate/index.html','gimnasio/index.html','patio.html'])assert.equal(/Patio Interior|PATIO INTERIOR|D[IÍií]AS DE LLUVIA|Días de Lluvia/.test(read(page)),false,page);
});
test('ruleta: hay retos de cada tipo y todos tienen variante sentada y criterio',()=>{
 for(const family of Object.keys(families))assert.ok(eligibleChallenges({family}).length>=3,family);
 for(const challenge of challenges){
  assert.ok(challenge.seated&&challenge.standing&&challenge.criterion,challenge.id);
  assert.ok(challenge.seconds>=30&&challenge.seconds<=90,challenge.id);
 }
});
test('registro: el jugador es clase, número y personaje, nunca un nombre',()=>{
 localStorage.clear();sessionStorage.clear();
 assert.equal(registro.player(),null);
 for(const bad of [null,{},{course:5,group:'B',number:0,avatar:1},{course:9,group:'B',number:3,avatar:1},{course:5,group:'Z',number:3,avatar:1},{course:5,group:'B',number:3,avatar:8}])assert.equal(registro.setPlayer(bad),false);
 assert.equal(registro.setPlayer({course:5,group:'B',number:7,avatar:2,name:'DEMO'}),true);
 assert.deepEqual(registro.player(),{course:5,group:'B',number:7,avatar:2});
 assert.equal(registro.playerCode(registro.player()),'5B-07');
 assert.equal(localStorage.getItem('gym-avatar'),'2');assert.equal(localStorage.getItem('mate-character'),'2');
 registro.leave();assert.equal(registro.player(),null);
});
test('registro: anota por jugador, la pantalla de clase no suplanta a nadie y el resumen cuenta bien',()=>{
 localStorage.clear();sessionStorage.clear();
 registro.setPlayer({course:6,group:'A',number:12,avatar:0});
 registro.record('material','equipment-rescue','fase',{fase:2,intentos:9,pistas:1});
 registro.record('material','equipment-rescue','completada',{fase:5,intentos:30,pistas:2});
 registro.record('pista','mate','partido',{resultado:'victoria',puntos:350});
 registro.record('pista','mate','partido',{resultado:'derrota',puntos:125});
 registro.setMode('pantalla');
 registro.record('espalderas','ruleta','reto',{reto:'c1'});
 const list=registro.entries();
 assert.equal(list.length,5);assert.equal(list[0].who,'6A-12');assert.equal(list[4].who,null);
 assert.equal(new Set(list.map(entry=>entry.id)).size,5);
 const [mine,screen]=registro.summary();
 assert.deepEqual([mine.who,mine.gymPhase,mine.gymDone,mine.matches,mine.wins,mine.bestPoints],['6A-12',5,true,2,1,350]);
 assert.deepEqual([screen.who,screen.challenges],['Pantalla de clase',1]);
 const sheet=registro.toSheet().split('\n');
 assert.equal(sheet.length,6);assert.match(sheet[1],/;6A-12;material;equipment-rescue;fase;/);
 registro.clearEntries();assert.equal(registro.entries().length,0);
});
test('registro: sin hoja conectada nada sale del navegador y lo anotado antes se sigue entendiendo',async()=>{
 localStorage.clear();sessionStorage.clear();
 // An entry written by the first version of the record: no student id, no course.
 localStorage.setItem('pabellon-registro',JSON.stringify([{id:'lx0-aaaaaa',t:'2026-11-19T09:00:00.000Z',who:'5C-03',place:'pista',activity:'mate',event:'partido',data:{resultado:'empate',puntos:75},sent:false},{id:'lx1-bbbbbb',t:'2026-11-19T09:05:00.000Z',who:null,place:'espalderas',activity:'ruleta',event:'reto',data:{reto:'c1'},sent:false}]));
 assert.deepEqual(registro.entries().map(e=>[e.who,e.sid,e.curso]),[['5C-03','5c-03','5'],[null,'pantalla','']]);
 const calls=[];
 assert.deepEqual(await registro.sync({send:(...args)=>{calls.push(args);},now:true}),{ok:false,off:true});
 assert.equal(calls.length,0);assert.equal(registro.pending(),2);
 assert.equal(existsSync(root+'config.js'),false,'la dirección de la hoja no se escribe en el código público');
 assert.doesNotMatch(read('registro.js')+read('hub.js')+read('index.html'),/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}/);
});
test('registro: el resumen cuenta también yoga, rosco, oca y bingo',()=>{
 localStorage.clear();sessionStorage.clear();
 registro.setPlayer({course:5,group:'A',number:4,avatar:3});
 registro.record('tatami','yoga','postura',{id:'arbol'});
 registro.record('tatami','yoga','postura',{id:'arbol'});
 registro.record('tatami','yoga','postura',{id:'gato'});
 registro.record('tatami','yoga','secuencia-creada',{posturas:'arbol-gato',n:2});
 registro.record('tatami','yoga','secuencia-practicada',{posturas:'arbol-gato',segundos:90,silla:false});
 registro.record('pizarra','rosco','partida',{rosco:'5',aciertos:18,fallos:6,pasadas:3});
 registro.record('pizarra','rosco','partida',{rosco:'5',aciertos:21,fallos:4,pasadas:2});
 registro.record('aula','bingo','carton',{carton:12,lineas:2,bingo:false});
 registro.setMode('pantalla');
 registro.record('aula','oca','partida',{equipos:4,rondas:8,retos:11,completada:true});
 const [mine,screen]=registro.summary();
 assert.deepEqual([mine.poses.length,mine.sequences,mine.practices,mine.roscos,mine.bestRosco,mine.bingos],[2,1,1,2,21,1]);
 assert.equal(screen.boards,1);
});
