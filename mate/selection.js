import {HEROES} from './roster.js';

export function validCharacter(value) {
 return Number.isInteger(value) && value >= 0 && value < HEROES.length;
}

export function availableCharacter(preferred, occupied) {
 if (validCharacter(preferred) && !occupied.has(preferred)) return preferred;
 return HEROES.findIndex((_, index) => !occupied.has(index));
}

export function buildLineup(members, team, size) {
 const teamMembers = members.filter(member => member.team === team).slice(0, size);
 const occupied = new Set();
 // Reserve all valid human picks before resolving missing or duplicate legacy entries.
 const lineup = Array.from({length: size}, (_, slot) => {
  const member = teamMembers[slot];
  const choice = member?.character;
  const character = validCharacter(choice) && !occupied.has(choice) ? choice : -1;
  if (character !== -1) occupied.add(character);
  return {member, character};
 });
 lineup.forEach((place, slot) => {
  if (place.character !== -1) return;
  place.character = availableCharacter((team * 3 + slot) % HEROES.length, occupied);
  occupied.add(place.character);
 });
 return lineup;
}
