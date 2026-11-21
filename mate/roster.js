// Arena units and seconds. Everyone plays the same basics; the ultimate sets each hero apart.
export const STATS = {
  pickupRadius: 29, catchWindow: .35, runSpeed: 225,
  shotSpeed: 860, catchRadius: 32, dashSpeed: 620, carrySpeed: 180,
  // Dodging and catching are scarce: each one is a decision, not a reflex for every throw.
  dashRecovery: 15, catchRecovery: 15,
  // Secret plays. A throw right after a dodge with the ball is a power shot nobody can catch;
  // a throw right after a catch is a counter that gives the dodge and the catch back.
  surgeWindow: .5, powerBoost: 1.4, counterWindow: .6, counterBoost: 1.45,
  // Share of hits that bounce off the player, who is only out if nobody catches the rebound.
  reboundChance: .3,
};

// id: the effect in sim.js. art: the icon in assets/abilities. recharge: seconds of play.
// ball: 'held' needs the ball in hand, 'free' needs not to have it.
function hero(name, tag, id, ability, description, recharge, art = id, ball = null) {
  return {name, tag, ability, description, ult: {id, art, recharge, ball}};
}

export const HEROES = [
  hero('Vega', 'La capitana', 'arenga', '¡A por ellos!', 'Todo tu equipo corre mucho más rápido durante 6 s, recupera al instante atrapar y esquivar, y ni la mirada ni el pies quietos le afectan.', 45, 'pase-expres'),
  hero('Kai', 'Radar', 'iman', 'Superimán', 'La pelota vuela a tus manos esté donde esté: en el suelo, en el aire o en las manos de un rival.', 35, 'iman', 'free'),
  hero('Lúa', 'La estratega', 'quietos', '¡Pies quietos!', 'Todos los demás, rivales y compañeros, se quedan de estatua 3 s. Solo tú te mueves.', 55),
  hero('Neo', 'Centella', 'centella', 'Centella', 'Durante 5 s corres el doble, la pelota te atraviesa sin tocarte y tus tiros salen como rayos.', 40, 'zancada'),
  hero('Ada', 'Puntería', 'teledirigida', 'Teledirigida', 'Un tiro que persigue a su objetivo por todo el campo. No se puede esquivar: solo atraparlo.', 45, 'teledirigida', 'held'),
  hero('Max', 'El guardián', 'burbuja', 'Burbujas', 'Cada compañero del campo recibe una burbuja que para un impacto. Duran 8 s.', 50),
  hero('Nora', 'Cometa', 'cometa', 'Cometa imparable', 'Un tiro en llamas que nadie puede atrapar y que atraviesa a quien alcanza. Solo se puede esquivar.', 40, 'special', 'held'),
  hero('Leo', 'El soñador', 'espejismo', 'Espejismo', 'Aparecen tres copias tuyas durante 7 s. El rival no sabe cuál eres y la pelota que da a una copia se pierde.', 40),
  hero('Iris', 'La portera', 'red', 'La Red', 'Levanta una red en la línea central durante 5 s: ninguna pelota rival la cruza.', 50),
  hero('Bruno', 'El pívot', 'gigante', 'Gigante', 'Creces durante 6 s: nada te manda a la cárcel, atrapas todo lo que te toca y lanzas balonazos enormes.', 50),
  hero('Sol', 'La contraatacante', 'bumeran', 'Bumerán', 'Un tiro que atraviesa a los rivales, da la vuelta y regresa a tu mano. Puede dar a la ida y a la vuelta.', 40, 'contraataque', 'held'),
  hero('Teo', 'El de la mirada', 'mirada', 'Mirada intensa', 'Todos los rivales se mueven a la mitad de velocidad y se quedan sin esquiva durante 10 s.', 60, 'gaze'),
  hero('Inés', 'La remontadora', 'fuga', '¡Fuga!', 'Abre la cárcel: todos los presos de tu equipo, tú incluida, vuelven al campo.', 60, 'salida'),
];

export {HEROES as CHARACTERS};
