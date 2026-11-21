// From a record entry to a mark: the single place that says which entries become a mark, and how.
// Everything that is not declared here still travels to the teacher's sheet as evidence, without a mark.
// The scale is La Lupa's (multiplicopolis/apps/la-lupa/motor.js): mark = right / tries over 10,
// never below 1, and the same IN/SU/BI/NT/SB grades. Pablo decides what counts: docs/10-registro-y-notas.md.
import {equipment, find, request} from './gimnasio/mission.js';

export const calificacion = n => (n < 5 ? 'IN' : n < 6 ? 'SU' : n < 7 ? 'BI' : n < 9 ? 'NT' : 'SB');
export const nota = (aciertos, intentos) => Math.max(1, Math.round(aciertos / Math.max(1, intentos) * 100) / 10);
// Third cycle only: the .a / .b suffix of the Andalusian criteria is 5.º / 6.º (as in La Lupa).
const LETRA = {5: 'a', 6: 'b'};

// Fewest actions that finish Equipment Rescue: every one of them is a right answer.
const RESCATE_MINIMO = find.length + 1 + (equipment.length - 1) + Object.values(request).reduce((a, b) => a + b, 0) + 1 + 2 + 1;

// One line per kind of entry that gives a mark. To add one: place, activity and event as `record()` writes
// them, the criterion (without the course letter), the courses it applies to and how to count right / tries.
export const NOTAS = [
 {place: 'material', activity: 'equipment-rescue', event: 'completada', criterio: '1.3', cursos: [5, 6],
  tipo: 'aventura', titulo: 'Equipment Rescue · almacén seguro',
  medir: data => ({aciertos: RESCATE_MINIMO, intentos: Number(data.intentos)})},
];

// The marks an entry gives, in the `notas` format of La Lupa's grade, or null if it is only evidence.
export function notasDe(entry, curso) {
 const rule = NOTAS.find(r => r.place === entry.place && r.activity === entry.activity && r.event === entry.event);
 const course = Number(curso);
 if (!rule || !rule.cursos.includes(course) || !LETRA[course]) return null;
 const {aciertos, intentos} = rule.medir(entry.data || {});
 if (!Number.isInteger(intentos) || intentos < 1 || !Number.isInteger(aciertos) || aciertos < 0) return null;
 const right = Math.min(aciertos, intentos), value = nota(right, intentos);
 return {rule, notas: [{criterio: `${rule.criterio}.${LETRA[course]}`, nota: value, calificacion: calificacion(value), aciertos: right, intentos}]};
}
