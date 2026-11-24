// El Circuito: orienteering in a place every pupil knows, the painted gym, and its plan.
// This file is the gym as data and the rules of the four sheets, without any page.
// What is taught, in which order and why (orientating the plan comes first; walls and objects are the
// reference, not the compass points): docs/13-investigacion-contenidos.md, sections 8 and 9.

// The four walls, clockwise. Each is named after what hangs on it: that is how pupils find it.
export const DIRS = ['N', 'E', 'S', 'O'];
export const PAREDES = {
 N: {es: 'la pared de la canasta', en: 'the basket wall'},
 E: {es: 'la pared del banco largo', en: 'the long bench wall'},
 S: {es: 'la pared de la entrada', en: 'the entrance wall'},
 O: {es: 'la pared de las espalderas', en: 'the wall bars wall'},
};

// What is in the gym. `x`, `y` place it on the plan (0 to 1, from the basket wall down and from the wall
// bars to the right); `pared` is the wall it hangs on; `cuadro` is where it is in the painting
// gimnasio/assets/gym.webp (fractions of its width and height); `codigo` is the code of its control flag,
// never under 31, as in the rules of the sport.
export const OBJETOS = [
 {id: 'canasta', es: 'La canasta', en: 'Basket', x: .55, y: .04, pared: 'N', cuadro: [.62, .36], codigo: 52},
 {id: 'almacen', es: 'La puerta del almacén', en: 'Store room door', x: .86, y: .02, pared: 'N', cuadro: [.84, .56], codigo: 63},
 {id: 'ventanales', es: 'Los ventanales', en: 'Windows', x: .03, y: .24, pared: 'O', cuadro: [.2, .2], codigo: 44},
 {id: 'espalderas', es: 'Las espalderas', en: 'Wall bars', x: .04, y: .52, pared: 'O', cuadro: [.24, .55], codigo: 41},
 {id: 'pizarra', es: 'La pizarra', en: 'Blackboard', x: .03, y: .81, pared: 'O', cuadro: [.08, .5], codigo: 45},
 {id: 'banco', es: 'El banco', en: 'Bench', x: .13, y: .9, cuadro: [.08, .71], codigo: 34},
 {id: 'colchonetas', es: 'Las colchonetas', en: 'Mats', x: .35, y: .13, cuadro: [.42, .62], codigo: 47},
 {id: 'carro', es: 'El carro de balones', en: 'Ball cage', x: .22, y: .13, cuadro: [.36, .62], codigo: 59},
 {id: 'circulo', es: 'El círculo central', en: 'Centre circle', x: .5, y: .5, cuadro: [.6, .79], codigo: 31},
 {id: 'entrada', es: 'La puerta de entrada', en: 'Entrance', x: .5, y: .98, pared: 'S', codigo: 38},
 {id: 'bancolargo', es: 'El banco largo', en: 'Long bench', x: .96, y: .5, pared: 'E', codigo: 36},
];
export const objeto = id => OBJETOS.find(item => item.id === id) || null;
const mezclar = (lista, azar) => { const out = [...lista]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; };

// --- Turning the plan -----------------------------------------------------------------------------
// `giro` counts quarter turns clockwise from «basket wall up». The plan never turns by itself.
const cuartos = giro => ((giro % 4) + 4) % 4;
// The wall drawn at the top of the plan after `giro` quarter turns.
export const arriba = giro => DIRS[(4 - cuartos(giro)) % 4];
// The plan is orientated when the wall you are facing is the one at the top.
export const orientado = (giro, mira) => arriba(giro) === mira;
// Where something on wall `pared` is for somebody facing `mira`: 0 in front, 1 right, 2 behind, 3 left.
export const RELATIVAS = [
 {id: 'delante', es: 'Delante', en: 'In front'},
 {id: 'derecha', es: 'A la derecha', en: 'On your right'},
 {id: 'detras', es: 'Detrás', en: 'Behind you'},
 {id: 'izquierda', es: 'A la izquierda', en: 'On your left'},
];
export const relativa = (mira, pared) => (DIRS.indexOf(pared) - DIRS.indexOf(mira) + 4) % 4;

// --- The four sheets ------------------------------------------------------------------------------
export const HOJAS = [
 {id: 'plano', es: 'El plano', en: 'The plan', que: 'Del gimnasio a su plano'},
 {id: 'orienta', es: 'Orienta el plano', en: 'Set the map', que: 'Gíralo hasta que cuadre con lo que ves'},
 {id: 'senala', es: 'Señala la baliza', en: 'Point to the control', que: '¿Delante, detrás, izquierda o derecha?'},
 {id: 'recorrido', es: 'El recorrido', en: 'The course', que: 'De la salida a la meta, picando cada control'},
];

// Sheet 1: seven things of the painting to find on the plan.
export function rondasPlano(azar = Math.random) {
 return mezclar(OBJETOS.filter(item => item.cuadro), azar).slice(0, 7).map(item => item.id);
}
// Sheet 2: you stand against a wall looking at the opposite one, and the plan comes turned. Every wall
// comes up, and the plan never starts already orientated.
export function rondasOrienta(azar = Math.random) {
 const miradas = [...mezclar(DIRS, azar), ...mezclar(DIRS, azar).slice(0, 2)];
 return miradas.map(mira => {
  const bueno = (4 - DIRS.indexOf(mira)) % 4;
  return {mira, giro: (bueno + 1 + Math.floor(azar() * 3)) % 4};
 });
}
// What a pupil may have looked at to orientate the plan, asked after a miss: no free text.
export function pistasDe(mira, azar = Math.random) {
 const marca = {N: 'canasta', E: 'bancolargo', S: 'entrada', O: 'espalderas'};
 const otra = marca[mezclar(DIRS.filter(dir => dir !== mira), azar)[0]];
 return mezclar([
  {id: 'referencia', objeto: marca[mira], es: `En ${objeto(marca[mira]).es.toLowerCase()}, que la tengo delante`},
  {id: 'otra', objeto: otra, es: `En ${objeto(otra).es.toLowerCase()}`},
  {id: 'azar', objeto: null, es: 'Lo he girado a ver si acertaba'},
 ], azar);
}
// Sheet 3: you stand in the centre circle; a control hangs on one of the walls. The plan comes turned.
export function rondasSenala(azar = Math.random) {
 const colgados = OBJETOS.filter(item => item.pared);
 const rondas = [];
 // Each answer (in front, right, behind, left) comes up at least once.
 for (const donde of mezclar([0, 1, 2, 3, 1, 3], azar)) {
  const mira = DIRS[Math.floor(azar() * 4)], pared = DIRS[(DIRS.indexOf(mira) + donde) % 4];
  const posibles = colgados.filter(item => item.pared === pared);
  rondas.push({mira, objeto: posibles[Math.floor(azar() * posibles.length)].id, giro: Math.floor(azar() * 4)});
 }
 return rondas;
}
// Sheet 4: a line course. At each control three flags hang nearby: only one is at the centre of the circle.
export const RECORRIDO = {
 salida: [.5, .86], meta: [.64, .86],
 controles: [
  {objeto: 'banco', cerca: ['pizarra', 'espalderas']},
  {objeto: 'espalderas', cerca: ['ventanales', 'pizarra']},
  {objeto: 'colchonetas', cerca: ['carro', 'canasta']},
  {objeto: 'canasta', cerca: ['almacen', 'colchonetas']},
  {objeto: 'bancolargo', cerca: ['almacen', 'entrada']},
 ],
};
export const CARRERA = 8;   // seconds of running on the spot between controls: think first, then run
export function balizasDe(indice, azar = Math.random) {
 const control = RECORRIDO.controles[indice];
 return mezclar([control.objeto, ...control.cerca], azar).map(id => objeto(id));
}
