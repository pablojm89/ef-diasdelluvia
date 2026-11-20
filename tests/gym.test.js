import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,valid,act,equipment,request} from '../gimnasio/mission.js';
const step=(s,e)=>act(s,e).state;
test('Mission supports recovery and all five phases with corrections',()=>{
 let s=fresh();assert.ok(valid(JSON.parse(JSON.stringify(s))));
 const wrong=act(s,{type:'find',id:'cone'});assert.equal(wrong.ok,false);assert.equal(wrong.state.stage,0);
 for(const id of ['hoop','cone','rope'])s=step(s,{type:'find',id});
 assert.equal(s.stage,1);
 s=step(s,{type:'place',id:'cone',target:'rack'});assert.equal(s.stage,2);
 for(const e of [...equipment].reverse())if(e.id!=='cone')s=step(s,{type:'place',id:e.id,target:e.home});
 assert.equal(s.stage,3);assert.equal(new Set(s.stored).size,10);
 const missing=act(s,{type:'check'});assert.equal(missing.ok,false);
 for(const[id,n]of Object.entries(request))for(let i=0;i<n;i++)s=step(s,{type:'add',id});
 const extra=act(s,{type:'add',id:'cone'});assert.equal(extra.ok,false);assert.equal(extra.state.cart.cone,4);
 s=step(s,{type:'remove',id:'cone'});assert.equal(s.cart.cone,3);s=step(s,{type:'add',id:'cone'});
 s=step(s,{type:'check'});assert.equal(s.stage,4);
 assert.equal(act(s,{type:'reason',id:'safe'}).ok,false);
 for(const id of ['shelf','door'])s=step(s,{type:'hazard',id});
 assert.equal(act(s,{type:'reason',id:'pretty'}).ok,false);
 s=step(s,{type:'reason',id:'safe'});assert.equal(s.stage,5);assert.ok(valid(s));assert.ok(valid(JSON.parse(JSON.stringify(s))));
});
test('Wrong locations never remove objects; state input is immutable',()=>{
 let s=fresh();for(const id of ['hoop','cone','rope'])s=step(s,{type:'find',id});s=step(s,{type:'place',id:'cone',target:'rack'});
 const before=JSON.stringify(s);const r=act(s,{type:'place',id:'mat',target:'hooks'});assert.equal(r.ok,false);assert.equal(JSON.stringify(s),before);assert.deepEqual(r.state.stored,['cone']);
});
test('Saved progress rejects invalid and unrelated data',()=>{
 assert.equal(valid(null),false);assert.equal(valid({}),false);assert.equal(valid({...fresh(),stage:90}),false);assert.equal(valid({...fresh(),cart:{cone:99}}),false);assert.equal(valid({...fresh(),stored:['unknown']}),false);
});
