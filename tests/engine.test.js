import test from 'node:test';
import assert from 'node:assert/strict';
import {challenges,families} from '../content.js';
import {eligibleChallenges,missionChallenge,criteriaScore,recordAssessment,standings,createSequence,validSequence,leagueChallenge} from '../engine.js';

test('el banco está completo, sin identificadores repetidos y con alternativas',()=>{
  assert.equal(challenges.length,24);
  assert.equal(new Set(challenges.map(c=>c.id)).size,24);
  for(const key of Object.keys(families))assert.equal(challenges.filter(c=>c.family===key).length,4);
  for(const c of challenges){
    assert.ok(c.title.length>=3);
    for(const field of ['standing','seated','goal','criterion'])assert.ok(c[field]?.length>10,`${c.id}: ${field}`);
    assert.ok(c.seconds>=30 && c.seconds<=90);
  }
});
test('la misión individual nunca exige pareja, incluida la señal de creación',()=>{
  for(let i=0;i<6;i++)for(let offset=0;offset<8;offset++)assert.equal(missionChallenge(i,true,offset).minPlayers,1);
  assert.ok(eligibleChallenges({solo:true}).length>0);
  assert.throws(()=>missionChallenge(6),RangeError);
});
test('el filtro combina participantes y familia',()=>{
  const bank=eligibleChallenges({solo:true,seated:true,family:'coordinacion'});
  assert.equal(bank.length,3);
  assert.ok(bank.every(c=>c.minPlayers===1 && c.family==='coordinacion' && c.seated));
});
test('la rúbrica rechaza puntos fuera de rango e incompletos',()=>{
  assert.equal(criteriaScore([0,1,2]),3);
  for(const invalid of [[3,0,0],[-1,1,1],[1,1],[1,1,1.5],['2',1,0]])assert.throws(()=>criteriaScore(invalid));
});
test('registrar una valoración no modifica el original y rechaza duplicados',()=>{
  const league={round:0,teams:[{name:'Lima',rounds:[]},{name:'Coral',rounds:[]}]};
  const next=recordAssessment(league,0,[2,1,2]);
  assert.equal(league.teams[0].rounds.length,0);
  assert.deepEqual(next.teams[0].rounds[0],[2,1,2]);
  assert.throws(()=>recordAssessment(next,0,[2,2,2]),/ya valorado/);
  assert.throws(()=>recordAssessment(league,9,[2,2,2]),RangeError);
  assert.throws(()=>recordAssessment({...league,round:6},0,[2,2,2]),RangeError);
});
test('la clasificación comparte empates y suma rondas sin bonificar velocidad',()=>{
  const result=standings([{name:'A',rounds:[[2,2,2],[1,1,1]]},{name:'B',rounds:[[2,2,2],[1,1,1]]},{name:'C',rounds:[[0,0,0]]}]);
  assert.deepEqual(result.map(t=>[t.rank,t.score]),[[1,9],[1,9],[3,0]]);
});
test('seis rondas de liga y secuencias compuestas por cartas válidas',()=>{
  for(let i=0;i<6;i++)assert.ok(leagueChallenge(i)?.minPlayers>=1);
  assert.equal(leagueChallenge(6),undefined);
  const sequence=createSequence(()=>0.5);
  assert.ok(validSequence(sequence));assert.equal(new Set(sequence).size,4);
  assert.equal(validSequence(['marcha']),false);
  assert.equal(validSequence(['marcha','abre','cruza','inventado']),false);
});

test('una liga completa conserva resultados tras serializar y no supera 36 puntos por equipo',()=>{
  let league={round:0,teams:['A','B','C','D','E','F'].map(name=>({name,rounds:[]}))};
  for(let round=0;round<6;round++){
    league.round=round;
    for(let team=0;team<6;team++)league=recordAssessment(league,team,[2,2,2]);
    league=JSON.parse(JSON.stringify(league));
    assert.throws(()=>recordAssessment(league,0,[0,0,0]),/ya valorado/);
  }
  const result=standings(league.teams);
  assert.ok(result.every(t=>t.score===36 && t.rank===1));
});
