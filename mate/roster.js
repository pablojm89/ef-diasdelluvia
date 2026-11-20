// These values use arena units and seconds. Each hero changes one part of normal play.
const standard = {
  passSpeed: 530, pickupRadius: 29, catchWindow: .3, runSpeed: 225,
  shotSpeed: 790, catchRadius: 32, dashSpeed: 620, dashRecovery: 1.4,
  catchRecovery: 1.05, carrySpeed: 180, counterSpeed: 790,
  relaySeconds: 0, rescueSeconds: 0,
};

function hero(name, tag, ability, description, change) {
  return {name, tag, ability, description, stats: {...standard, ...change}};
}

export const HEROES = [
  hero('Vega', 'La capitana', 'Pase exprés', 'Sus pases viajan un 35 % más rápido.', {passSpeed: 715}),
  hero('Kai', 'Radar', 'Imán', 'Recoge pelotas sueltas desde un 45 % más lejos.', {pickupRadius: 42}),
  hero('Lúa', 'La estratega', 'Lectura de juego', 'Mantiene la recepción abierta medio segundo.', {catchWindow: .5}),
  hero('Neo', 'Centella', 'Zancada', 'Corre un 20 % más rápido cuando va sin balón.', {runSpeed: 270}),
  hero('Ada', 'Puntería', 'Tirachinas', 'Su lanzamiento normal viaja un 15 % más rápido.', {shotSpeed: 910}),
  hero('Max', 'El guardián', 'Guante largo', 'Atrapa tiros en vuelo desde un 38 % más lejos.', {catchRadius: 44}),
  hero('Nora', 'Cometa', 'Paso de cometa', 'Su esquiva recorre un 25 % más de distancia.', {dashSpeed: 775}),
  hero('Leo', 'El soñador', 'Segunda finta', 'Recupera la esquiva en un segundo.', {dashRecovery: 1}),
  hero('Iris', 'La portera', 'Manos listas', 'Puede volver a intentar la recepción a los 0,7 segundos.', {catchRecovery: .7}),
  hero('Bruno', 'El pívot', 'Avance firme', 'Corre un 25 % más rápido de lo habitual con el balón.', {carrySpeed: 225}),
  hero('Sol', 'La contraatacante', 'Contraataque', 'Al atrapar un tiro rival, su siguiente tiro normal gana un 25 % de velocidad mientras conserve el balón.', {counterSpeed: 990}),
  hero('Teo', 'El relevista', 'Relevo', 'Al recibir un pase aliado, gana un 25 % de velocidad de carrera durante tres segundos.', {relaySeconds: 3}),
  hero('Inés', 'La remontadora', 'Salida veloz', 'Al salir de prisión, gana un 25 % de velocidad de carrera durante cuatro segundos.', {rescueSeconds: 4}),
];

export {HEROES as CHARACTERS};
