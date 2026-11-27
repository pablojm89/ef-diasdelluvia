import {entries, mode, player, studentId, summary} from '../registro.js';

export const missions = [
 {place:'gimnasio', title:'Una pelota para el primer partido', task:'Hoy toca mate y falta la pelota. Entra al gimnasio y habla con Robles para preparar el partido.', done:r=>r.ballDelivered || r.gymPhase >= 1 || r.gymDone},
 {place:'pista', title:'Estrena la pista de mate', task:'La pista está preparada. Pulsa «Entrenar» y juega tu primer partido de mate hasta el final. Tanto si ganas como si pierdes, después toca volver a la calma.', done:r=>r.matches > 0},
 {place:'tatami', title:'Vuelve a la calma', task:'Acaba de sonar el silbato. Robles te espera en el tatami para recuperar el aliento con la postura de la montaña.', done:r=>r.poses?.length > 0},
 {place:'pizarra', title:'La nota para la siguiente clase', task:'Deja en la pizarra tres palabras que ayuden al siguiente grupo a recordar el partido y la vuelta a la calma.', done:r=>r.notaEscrita || r.roscos > 0},
 {place:'tatami', title:'Diseña la vuelta a la calma', task:'Ahora te toca guiar la vuelta a la calma. En Crear, combina la postura que aprendiste con otra y guarda tu secuencia. Después practícala hasta el final para poder enseñársela a la clase.', done:r=>r.sequences > 0 && r.practices > 0},
 {place:'gimnasio', title:'Deja listo el gimnasio', task:'Vuelve al almacén. Guarda el material, prepara el carro y localiza los dos riesgos para que la siguiente clase pueda jugar.', done:r=>r.gymDone}
];
export function journey(row = {}, checkpoint = 0) {
 const next = missions.findIndex((m,i) => i >= checkpoint && !m.done(row));
 const index = next < 0 ? missions.length : next;
 return {index, unlocked:new Set(missions.slice(0,index + 1).map(m=>m.place))};
}
export function currentJourney() {
 const sid = studentId(player());
 const key = 'pabellon-historia-v1-' + sid;
 const saved = Number(localStorage.getItem(key));
 const result = journey(summary(entries().filter(e=>e.sid===sid))[0], Number.isInteger(saved) && saved <= missions.length ? saved : 0);
 if (result.index !== saved) localStorage.setItem(key,String(result.index));
 return result;
}

export function atStoryMission(index) {
 return mode()==='alumno' && !!player() && sessionStorage.getItem('pabellon-vuelta')==='alumno' && currentJourney().index===index;
}
