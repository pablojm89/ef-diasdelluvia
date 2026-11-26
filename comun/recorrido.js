import {entries, player, studentId, summary} from '../registro.js';

export const missions = [
 {place:'gimnasio', title:'Encuentra el material', task:'Robles necesita un aro, un cono y una cuerda para preparar la pista. Entra al almacén y localízalos en ese orden.', done:r=>r.gymPhase >= 1 || r.gymDone},
 {place:'pista', title:'Estrena la pista de mate', task:'Ya tienes el material. Juega un partido de balón prisionero hasta el final. Tanto si ganas como si pierdes, después toca volver a la calma.', done:r=>r.matches > 0},
 {place:'tatami', title:'Vuelve a la calma', task:'Después del partido, entra en Aprender y abre la ficha de una postura de yoga. Pulsa «Ver cómo se entra y se sale» y acompaña la demostración hasta el final.', done:r=>r.poses?.length > 0},
 {place:'pizarra', title:'Completa el rosco', task:'Pon a prueba lo que sabes sobre Educación Física. Termina un rosco y vuelve para preparar la próxima sesión.', done:r=>r.roscos > 0},
 {place:'tatami', title:'Diseña la vuelta a la calma', task:'En Crear, combina tus posturas favoritas y guarda la secuencia. Después practícala hasta el final para poder enseñársela a la clase.', done:r=>r.sequences > 0 && r.practices > 0},
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
