import {challenges, families, moves} from './content.js';

export function eligibleChallenges({seated = false, solo = false, family = 'all'} = {}) {
  return challenges.filter(c => (!seated || c.seated) && (!solo || c.minPlayers === 1) && (family === 'all' || c.family === family));
}

export function missionChallenge(index, solo = false, offset = 0) {
  const family = Object.keys(families)[index];
  if (!family) throw new RangeError('Hito fuera de rango');
  // En solitario, el hito de cooperación se transforma en creación personal.
  const bank = eligibleChallenges({solo, family: solo && family === 'cooperacion' ? 'coordinacion' : family});
  return bank[offset % bank.length];
}

export function criteriaScore(values) {
  if (!Array.isArray(values) || values.length !== 3 || !values.every(v => Number.isInteger(v) && v >= 0 && v <= 2)) {
    throw new TypeError('Se requieren tres criterios enteros entre 0 y 2');
  }
  return values.reduce((sum, value) => sum + value, 0);
}

export function recordAssessment(league, teamIndex, values) {
  criteriaScore(values);
  if (league.round < 0 || league.round >= 6 || !league.teams[teamIndex]) throw new RangeError('Ronda o equipo no válido');
  const next = structuredClone(league);
  if (next.teams[teamIndex].rounds[next.round] != null) throw new Error('Equipo ya valorado en esta ronda');
  next.teams[teamIndex].rounds[next.round] = [...values];
  return next;
}

export function standings(teams) {
  const sorted = teams.map(t => ({name:t.name, score:t.rounds.reduce((s,v) => s + (v ? criteriaScore(v) : 0),0)}))
    .sort((a,b) => b.score-a.score);
  return sorted.map((t,i) => ({...t, rank: sorted.findIndex(x => x.score === t.score)+1}));
}

export function createSequence(random = Math.random) {
  const result = ['marcha','abre','cruza','pose'];
  for (let i = result.length-1; i>0; i--) {
    const j = Math.floor(random() * (i+1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function validSequence(sequence) {
  return Array.isArray(sequence) && sequence.length === 4 && sequence.every(id => moves.some(m => m.id === id));
}

export function leagueChallenge(round) {
  return challenges.find(c => c.id === ['c2','e4','r3','x4','p1','p3'][round]);
}
