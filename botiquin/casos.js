// El Botiquín: what is taught there. Three things, all for the whole class at once:
//  - PAS: in each case, what to do first, second and third: proteger, avisar, socorrer.
//  - The recovery position (posición lateral de seguridad), step by step, in threes.
//  - The call: one pupil explains what has happened and another asks what the emergency line would ask.
// Only PAS and the recovery position belong to the Primary curriculum (EFI.3.B.6); the call is a complement.
// Every instruction here was checked on 24/11/2026 against first-aid guidance (Cruz Roja Española, 061 Andalucía,
// AEPap, British Red Cross, St John Ambulance, NHS, Resuscitation Council UK 2025, ILCOR 2025): what was checked and
// what could not be confirmed is in docs/13-investigacion-contenidos.md. Change nothing here without a source.

// The three steps and the gesture the class makes for each one.
export const PAS = [
 {letra: 'P', es: 'Proteger', en: 'Protect', pregunta: '¿Qué haces primero?', gesto: 'Brazos en cruz, como una barrera: «¡Alto, cuidado!».', sentada: 'El mismo gesto desde la silla.'},
 {letra: 'A', es: 'Avisar', en: 'Call for help', pregunta: '¿A quién avisas?', gesto: 'Una mano en la oreja, como un teléfono, y la otra bien arriba.', sentada: 'El mismo gesto desde la silla.'},
 {letra: 'S', es: 'Socorrer', en: 'Give first aid', pregunta: '¿Cómo ayudas mientras llega la ayuda?', gesto: 'Una rodilla al suelo y las manos tranquilas hacia delante.', sentada: 'Manos tranquilas hacia delante, sin levantarte.'},
];

// In each step the first option is the right one (the page shuffles them); every option says why.
const paso = (bien, porque, ...mal) => [{texto: bien, bien: true, porque}, ...mal.map(([texto, por]) => ({texto, bien: false, porque: por}))];
export const CASOS = [
 {id: 'espalderas', titulo: 'La caída de las espalderas', donde: 'el gimnasio del cole',
  escena: 'En el gimnasio, Nora resbala al bajar de las espalderas y cae de espaldas. Está despierta, pero dice que le duele mucho la espalda y no se levanta.',
  pasos: [
   paso('Paro el juego y pido que nadie salte ni corra cerca.', 'Lo primero es que no haya otro accidente: ni para ella ni para ti.',
    ['La ayudo a levantarse cuanto antes.', 'Con dolor de espalda o de cuello no se mueve a nadie: podría hacerse más daño.'],
    ['Le doy agua para que se le pase.', 'Ni agua ni comida: ahora no ayuda, y puede que tenga que verla un médico.']),
   paso('Aviso al profe y le digo qué ha pasado y dónde.', 'Con una caída así y dolor de espalda, el profe llamará al 112. Di qué ha pasado, dónde y cómo está.',
    ['Espero a ver si se le pasa sola.', 'Esperar hace perder tiempo. Avisar nunca está de más.'],
    ['Voy a buscar a su mejor amiga.', 'Quien tiene que saberlo ya es un adulto.']),
   paso('Me quedo a su lado, le hablo tranquilo y le pido que no se mueva.', 'Acompañar y tranquilizar también es socorrer. Que no mueva ni la cabeza. Si hace frío, se la tapa sin moverla.',
    ['La siento en un banco.', 'No se la mueve hasta que lo diga quien sabe.'],
    ['Le froto la espalda donde le duele.', 'No se toca ni se frota la zona que duele.']),
  ]},
 {id: 'nariz', titulo: 'El balonazo en la nariz', donde: 'la pista del cole',
  escena: 'Jugando al mate, a Kai le dan un balonazo en la cara y empieza a sangrar por la nariz. Está de pie y algo asustado.',
  pasos: [
   paso('Paro el partido y aparto los balones.', 'Nadie puede ayudar bien si siguen volando balones.',
    ['Sigo jugando: es sólo sangre.', 'Con el juego en marcha puede llevarse otro golpe.'],
    ['Le limpio la sangre con mi mano.', 'La sangre de otra persona no se toca con las manos.']),
   paso('Aviso al profe.', 'Aunque parezca poca cosa, ha sido un golpe en la cara: un adulto tiene que verlo.',
    ['Le llevo yo solo al baño.', 'Primero se avisa: el profe tiene que saber dónde estáis.'],
    ['No digo nada para que no se pare la clase.', 'Callarse un accidente nunca es buena idea.']),
   paso('Que se siente, incline la cabeza un poco hacia delante y se apriete la parte blanda de la nariz.', 'Diez minutos seguidos, sin soltar para mirar y respirando por la boca. Si sigue sangrando, decide el profe.',
    ['Que eche la cabeza hacia atrás.', 'Es un mito: hacia atrás la sangre se va a la garganta.'],
    ['Que se tumbe en el suelo.', 'Tumbado también se traga la sangre. Mejor sentado.']),
  ]},
 {id: 'calor', titulo: 'Mucho sol en la pista', donde: 'la pista del cole',
  escena: 'A última hora, en la pista y con mucho calor, Ada deja de correr. Está pálida y sudando mucho, dice que se marea y que le duele la cabeza.',
  pasos: [
   paso('La acompaño a la sombra, despacio.', 'Proteger aquí es quitarla del sol y del esfuerzo.',
    ['La animo a acabar la carrera.', 'Con mareo y calor hay que parar ya.'],
    ['La dejo sentada al sol y sigo.', 'Al sol irá a peor, y no se la deja sola.']),
   paso('Aviso al profe y le digo que se marea.', 'Un mareo con calor puede ser serio. Si está confusa, vomita o no mejora, el profe llama al 112.',
    ['Le digo que no es nada.', 'Eso no lo puedes saber tú: decide un adulto.'],
    ['Aviso cuando acabe la clase.', 'Se avisa en el momento.']),
   paso('A la sombra, tumbada con las piernas en alto, la refresco con agua y bebe a sorbos pequeños.', 'Se quita calor (agua en la piel, aire, menos ropa) y bebe despacio, sólo si está bien despierta.',
    ['Que se beba una botella entera de golpe.', 'A sorbos: de golpe puede sentarle mal.'],
    ['Le pongo mi sudadera para que sude.', 'Hay que quitar calor, no añadirlo.']),
  ]},
 {id: 'tobillo', titulo: 'El tobillo torcido', donde: 'el patio del cole',
  escena: 'Saltando a la comba, Max cae mal y se tuerce el tobillo. Se sienta en el suelo: le duele al apoyar el pie.',
  pasos: [
   paso('Paro la comba y hago sitio a su alrededor.', 'Con sitio y sin cuerdas girando nadie le pisa ni le cae encima.',
    ['Seguimos saltando a su lado.', 'Pueden pisarle o caerle encima.'],
    ['Le quito la zapatilla tirando fuerte.', 'Tirar del pie puede hacerle más daño.']),
   paso('Aviso al profe.', 'Un adulto tiene que mirarlo y decidir qué se hace.',
    ['Le digo que camine un poco para probar.', 'Probar a caminar no es avisar, y puede empeorarlo.'],
    ['Lo arreglamos entre los amigos.', 'Un adulto tiene que valorarlo.']),
   paso('Que no apoye el pie y lo tenga quieto y en alto; frío envuelto en un paño si el profe lo trae.', 'Reposo, pie en alto y frío envuelto, no más de 10 o 20 minutos. El hielo, nunca directo sobre la piel.',
    ['Le doy un masaje fuerte en el tobillo.', 'Recién torcido no se masajea.'],
    ['Que camine para que se le suelte.', 'Caminar sobre un tobillo torcido lo empeora.']),
  ]},
 {id: 'herida', titulo: 'La rodilla en el patio', donde: 'el patio del cole',
  escena: 'En el recreo, Vega se cae corriendo y se hace una herida en la rodilla que sangra bastante. Hay un cristal roto cerca.',
  pasos: [
   paso('Aviso de que hay un cristal y no dejo que nadie pase por ahí.', 'Primero, que nadie más se corte. El cristal lo recoge un adulto.',
    ['Recojo el cristal con la mano.', 'Te puedes cortar tú: eso lo recoge un adulto.'],
    ['Le toco la herida para ver cómo es.', 'Ni se toca la herida ni la sangre de otra persona.']),
   paso('Aviso al profe de guardia.', 'Sangra bastante: tiene que verla un adulto.',
    ['La llevo yo a lavarse y ya está.', 'Antes se avisa: la herida tiene que verla un adulto.'],
    ['Espero a que suene el timbre.', 'Se avisa en el momento.']),
   paso('Que ella misma apriete la herida con un pañuelo limpio hasta que llegue el profe.', 'Apretar fuerte y seguido con algo limpio frena la sangre, sin levantarlo para mirar. Tú no tocas la sangre.',
    ['Le soplo la herida.', 'Soplar no limpia ni para la sangre: lo que la frena es apretar con algo limpio.'],
    ['Le pongo tierra o saliva para que pare.', 'Ensucia la herida y puede infectarla.']),
  ]},
 {id: 'desmayo', titulo: 'No contesta', donde: 'la pista del cole',
  escena: 'Al acabar una carrera, Leo se sienta, se tumba en el suelo y cierra los ojos. Le llamas y no contesta.',
  pasos: [
   paso('Miro que no haya peligro alrededor y hago sitio.', 'Antes de acercarte, mira: ni balones, ni gente corriendo, ni nada que pueda caer.',
    ['Le sacudo fuerte para despertarle.', 'Se le habla alto y se le mueven los hombros con suavidad: nunca fuerte.'],
    ['Le echo agua en la cara.', 'No ayuda y hace perder tiempo.']),
   paso('Grito pidiendo ayuda y que alguien avise al profe: hay que llamar al 112.', 'Si alguien no responde, se pide ayuda a gritos y un adulto llama al 112 con el altavoz puesto.',
    ['Me quedo callado a su lado, esperando.', 'Si no responde, cada minuto cuenta: pide ayuda ya.'],
    ['Me voy yo solo a buscar a alguien y le dejo.', 'Mejor gritar o mandar a otro: no se le deja solo.']),
   paso('Si respira, le pongo de lado, en posición lateral de seguridad, y no le dejo solo.', 'De lado, ni la lengua ni un vómito le tapan el aire. Si deja de respirar bien, avisa ya: hace falta RCP.',
    ['Le siento contra la pared.', 'Sentado puede caerse y respirar peor.'],
    ['Le doy agua.', 'Nunca se da de beber a quien no responde: puede atragantarse.']),
  ]},
];
export const caso = id => CASOS.find(item => item.id === id) || null;

// How many cases make a round: about five minutes for the whole class.
export const RONDA = 3;
// The cases of the next round. `vistos` are the ids already played: nothing comes back until all have been seen.
export function siguienteRonda(vistos = [], azar = Math.random) {
 const quedan = CASOS.filter(item => !vistos.includes(item.id));
 const bolsa = (quedan.length >= RONDA ? quedan : [...quedan, ...CASOS.filter(item => vistos.includes(item.id))]).slice();
 const elegidos = quedan.length >= RONDA ? [] : bolsa.splice(0, quedan.length);
 while (elegidos.length < RONDA && bolsa.length) elegidos.push(bolsa.splice(Math.floor(azar() * bolsa.length), 1)[0]);
 return elegidos;
}

// The recovery position, for someone who does not answer but breathes. `marca` is what the drawing highlights.
export const LATERAL = [
 {es: '¿Responde? ¿Respira?', en: 'Check: response and breathing', texto: 'Arrodíllate a su lado. Háblale alto y muévele los hombros con suavidad. Si no responde, mira hasta 10 segundos si se le mueve el pecho.', marca: 'pecho'},
 {es: 'El brazo cercano, en ángulo', en: 'Near arm out', texto: 'Quítale las gafas si lleva y estírale las piernas. Coloca el brazo que tienes más cerca en ángulo recto, con la palma hacia arriba.', marca: 'brazo-cerca'},
 {es: 'La otra mano, a la mejilla', en: 'Far hand to the cheek', texto: 'Cruza su otro brazo sobre el pecho y apoya el dorso de esa mano en la mejilla que tienes más cerca. Sujétala ahí.', marca: 'brazo-lejos'},
 {es: 'La rodilla lejana, arriba', en: 'Far knee up', texto: 'Con tu otra mano, dobla la rodilla más alejada hasta que el pie quede apoyado en el suelo.', marca: 'pierna-lejos'},
 {es: 'Gira hacia ti', en: 'Roll towards you', texto: 'Tira despacio de esa rodilla hacia ti. Rueda de lado sin que sueltes la mano de la mejilla.', marca: 'giro'},
 {es: 'Pierna en ángulo y cabeza atrás', en: 'Top leg bent, head back', texto: 'Deja la pierna de arriba doblada en ángulo recto. Inclina un poco su cabeza hacia atrás para que el aire pase bien.', marca: 'cabeza'},
 {es: 'Quédate y vigila', en: 'Stay and watch', texto: 'Que un adulto llame al 112 si aún no lo ha hecho. Mira todo el rato que respira y no te vayas. Si deja de respirar, avisa: hace falta RCP.', marca: 'pecho'},
];
export const PAPELES = ['Se tumba', 'Coloca', 'Lee y comprueba'];
// Who does what in each of the three turns: everybody plays every part once.
export const papelesDe = turno => PAPELES.map((_, persona) => PAPELES[(persona + turno) % PAPELES.length]);
export const NORMAS_LATERAL = [
 'Sobre una colchoneta, con sitio alrededor y con el profe mirando.',
 'Es un ensayo: quien se tumba está despierto y, si algo molesta, dice «para».',
 'Fuera gafas y bolsillos vacíos: ni móvil, ni llaves, ni bolis.',
 'Despacio y sin tirones: no se tira del brazo ni del cuello, y nadie se apoya encima.',
 'Quien tenga dolor de cuello, espalda u hombro, no quiera que le toquen o no pueda tumbarse lee y comprueba: se puede hacer sentado.',
];
// What must be clear before practising: when it is done for real, and when it is not.
export const DE_VERDAD = 'De verdad, lo primero es avisar a un adulto y al 112. Y sólo se pone de lado a quien no responde y respira, y no se ha caído ni golpeado: tras una caída no se mueve a nadie.';

// What the emergency line asks, for the call in pairs. In Spain the number is 112.
export const LLAMADA = [
 {es: 'Emergencias, ¿qué ha pasado?', en: 'Emergency. What has happened?'},
 {es: '¿Dónde estáis?', en: 'Where are you?'},
 {es: '¿Cuántas personas están heridas?', en: 'How many people are hurt?'},
 {es: '¿Está despierta? ¿Respira?', en: 'Is the person awake? Breathing?'},
 {es: '¿Hay algún peligro cerca?', en: 'Is there any danger nearby?'},
 {es: 'Pon el altavoz y no cuelgues hasta que yo te lo diga.', en: 'Put me on speaker and stay on the line.'},
];
