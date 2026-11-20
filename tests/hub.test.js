import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {challenges,families} from '../content.js';
import {eligibleChallenges} from '../engine.js';

const root=fileURLToPath(new URL('..',import.meta.url));
const read=file=>readFileSync(root+file,'utf8');
const local=value=>!/^(https?:|#|mailto:)/.test(value);
const target=(page,value)=>{
 const path=value.split('#')[0].split('?')[0];
 const base=page.includes('/')?page.slice(0,page.lastIndexOf('/')+1):'';
 const resolved=new URL(path,'https://hub.test/'+base).pathname.slice(1);
 return resolved===''||resolved.endsWith('/')?resolved+'index.html':resolved;
};

test('portada: cada puerta, imagen y hoja de estilo enlazada existe',()=>{
 const page=read('index.html');
 const links=[...page.matchAll(/(?:href|src)="([^"]+)"/g)].map(match=>match[1]).filter(local);
 assert.ok(links.length>15);
 for(const link of links)assert.ok(existsSync(root+target('index.html',link)),link);
 assert.equal((page.match(/class="door"/g)||[]).length,5);
 for(const style of [...read('hub.css').matchAll(/url\('([^']+)'\)/g)])assert.ok(existsSync(root+target('hub.css',style[1])),style[1]);
});
test('portada: todas las salas enlazan de vuelta a la portada con el mismo nombre',()=>{
 for(const [page,back] of [['patio.html','./'],['mate/index.html','../'],['gimnasio/index.html','../']]){
  const html=read(page);
  assert.ok(html.includes(`href="${back}"`),page);
  assert.match(html,/D[ií]as de Lluvia|DÍAS DE LLUVIA/,page);
  assert.equal(/Patio Interior|PATIO INTERIOR/.test(html),false,page);
 }
});
test('reto exprés: hay retos de cada tipo y todos tienen variante sentada y criterio',()=>{
 for(const family of Object.keys(families))assert.ok(eligibleChallenges({family}).length>=3,family);
 for(const challenge of challenges){
  assert.ok(challenge.seated&&challenge.standing&&challenge.criterion,challenge.id);
  assert.ok(challenge.seconds>=30&&challenge.seconds<=90,challenge.id);
 }
});
