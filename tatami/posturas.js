// The twelve poses of El Tatami: names in Spanish and British English, how to come in and out,
// what you feel, how to stay safe at 10–12 and the chair version. No inversions and no weight on the neck.
// `code` is the letter used in the short sequence codes; `sides` poses are done on the right and on the left.

export const POSES = [
 {id: 'mountain', code: 'M', es: 'La montaña', en: 'Mountain', sides: false, breaths: 5,
  steps: [
   {es: 'De pie, con los pies juntos o un poco separados y el peso repartido en las dos plantas.', en: 'Stand tall, feet together.'},
   {es: 'Crece hacia el techo: hombros lejos de las orejas y mirada al frente.', en: 'Grow tall like a mountain.'},
   {es: 'Sube los brazos por los lados hasta arriba, con las palmas mirándose.', en: 'Reach your arms up high.'},
  ],
  exit: {es: 'Baja los brazos despacio por los lados.', en: 'Arms down slowly.'},
  feel: 'Los pies bien apoyados, las piernas firmes y la espalda larga, como si un hilo tirara de tu cabeza hacia arriba.',
  safety: 'No bloquees las rodillas: déjalas un poquito blandas. Si te mareas, baja los brazos y respira normal.',
  chair: 'Sentado al borde de la silla, con los pies en el suelo, la espalda larga y los brazos arriba.'},
 {id: 'tree', code: 'A', es: 'El árbol', en: 'Tree', sides: true, breaths: 4,
  steps: [
   {es: 'Desde la montaña, pasa el peso a un pie y junta las manos en el pecho.', en: 'Stand on one foot.'},
   {es: 'Apoya la planta del otro pie en el tobillo o en la pantorrilla, nunca en la rodilla. La rodilla mira hacia fuera.', en: 'Foot on your ankle or calf, not your knee.'},
   {es: 'Mira un punto fijo y sube los brazos como ramas.', en: 'Look at one spot and grow your branches.'},
  ],
  exit: {es: 'Baja los brazos y el pie con control.', en: 'Foot down, arms down.'},
  feel: 'La pierna de apoyo trabaja y el cuerpo hace pequeños ajustes para no caerse: así se entrena el equilibrio.',
  safety: 'Perder el equilibrio es normal: baja el pie y vuelve a empezar. Deja sitio con quien tengas al lado y no empujes la rodilla.',
  chair: 'Sentado, apoya un talón junto al tobillo contrario con la rodilla hacia fuera y sube los brazos como ramas.'},
 {id: 'chair', code: 'S', es: 'La silla', en: 'Chair', sides: false, breaths: 4,
  steps: [
   {es: 'De pie, con los pies separados a la anchura de las caderas.', en: 'Feet hip-width apart.'},
   {es: 'Dobla las rodillas y lleva la cadera atrás, como si te sentaras en una silla invisible.', en: 'Sit back on an invisible chair.'},
   {es: 'Sube los brazos junto a las orejas, con la espalda larga.', en: 'Arms up, long back.'},
  ],
  exit: {es: 'Estira las piernas y baja los brazos.', en: 'Stand up, arms down.'},
  feel: 'Calor y fuerza en los muslos; la espalda se alarga desde la cadera hasta las manos.',
  safety: 'Las rodillas miran al frente y no pasan de la punta de los pies. Baja sólo hasta donde puedas aguantar sin dolor.',
  chair: 'Sentado al borde, inclínate un poco hacia delante con la espalda recta y sube los brazos junto a las orejas.'},
 {id: 'warrior1', code: 'U', es: 'El guerrero I', en: 'Warrior I', sides: true, breaths: 3,
  steps: [
   {es: 'Desde la montaña, da un paso largo atrás. El pie de atrás, un poco girado hacia fuera.', en: 'Step one foot back.'},
   {es: 'Dobla la rodilla de delante hasta que quede encima del tobillo. La pierna de atrás, estirada.', en: 'Front knee over your ankle.'},
   {es: 'Caderas mirando al frente y brazos arriba.', en: 'Hips forward, arms up.'},
  ],
  exit: {es: 'Baja los brazos y junta los pies.', en: 'Arms down, feet together.'},
  feel: 'Fuerza en la pierna de delante y estiramiento en la parte delantera de la cadera de atrás.',
  safety: 'La rodilla de delante va encima del tobillo, nunca por delante de los dedos. Si cuesta, acorta el paso.',
  chair: 'Sentado al borde, deja una pierna doblada delante y estira la otra hacia atrás por el lado de la silla; brazos arriba.'},
 {id: 'warrior2', code: 'D', es: 'El guerrero II', en: 'Warrior II', sides: true, breaths: 3,
  steps: [
   {es: 'Separa mucho los pies. El pie de delante apunta al frente y el de atrás, de lado.', en: 'Step your feet wide apart.'},
   {es: 'Dobla la rodilla de delante encima del tobillo.', en: 'Bend your front knee.'},
   {es: 'Abre los brazos a la altura de los hombros y mira por encima de la mano de delante.', en: 'Arms out, look over your hand.'},
  ],
  exit: {es: 'Estira la pierna, baja los brazos y junta los pies.', en: 'Straighten up, feet together.'},
  feel: 'Las piernas trabajan, el pecho se abre y los brazos se alargan hacia los dos lados.',
  safety: 'La rodilla de delante, encima del tobillo. Hombros relajados, lejos de las orejas.',
  chair: 'Sentado al borde con las piernas abiertas, abre los brazos en cruz y mira por encima de una mano.'},
 {id: 'triangle', code: 'T', es: 'El triángulo', en: 'Triangle', sides: true, breaths: 3,
  steps: [
   {es: 'Piernas separadas y estiradas. El pie de delante apunta al frente.', en: 'Feet wide, legs straight.'},
   {es: 'Abre los brazos y alarga el cuerpo hacia el pie de delante.', en: 'Reach forward and tilt.'},
   {es: 'Apoya la mano en la espinilla y sube la otra hacia el techo.', en: 'Hand on your shin, other arm up.'},
  ],
  exit: {es: 'Sube con la espalda larga y baja los brazos.', en: 'Come up slowly.'},
  feel: 'Se estira el costado que mira al techo y la parte de atrás de la pierna de delante.',
  safety: 'La mano descansa en la espinilla, no sobre la rodilla. No fuerces para llegar al suelo.',
  chair: 'Sentado con las piernas abiertas, apoya un antebrazo en el muslo, inclínate hacia ese lado y sube el otro brazo.'},
 {id: 'cat', code: 'G', es: 'El gato', en: 'Cat', sides: false, breaths: 4,
  steps: [
   {es: 'En cuatro patas: manos debajo de los hombros y rodillas debajo de las caderas.', en: 'Hands and knees.'},
   {es: 'Al soltar el aire, redondea la espalda hacia el techo, como un gato que se estira.', en: 'Round your back like a cat.'},
   {es: 'Deja caer la cabeza con suavidad y mira hacia el ombligo.', en: 'Look at your tummy.'},
  ],
  exit: {es: 'Vuelve a la espalda plana.', en: 'Flat back.'},
  feel: 'La espalda se estira entre los omóplatos y la tripa se recoge.',
  safety: 'Mueve la espalda despacio; el cuello acompaña sin tirar. Si te molestan las rodillas, pon una toalla doblada debajo.',
  chair: 'Sentado, con las manos en las rodillas, redondea la espalda y mira hacia el ombligo.'},
 {id: 'cow', code: 'V', es: 'La vaca', en: 'Cow', sides: false, breaths: 4,
  steps: [
   {es: 'En cuatro patas: manos debajo de los hombros y rodillas debajo de las caderas.', en: 'Hands and knees.'},
   {es: 'Al tomar aire, baja la tripa con suavidad y lleva el pecho hacia delante.', en: 'Tummy down, chest forward.'},
   {es: 'Mira al frente, sin echar la cabeza hacia atrás.', en: 'Look ahead.'},
  ],
  exit: {es: 'Vuelve a la espalda plana.', en: 'Flat back.'},
  feel: 'El pecho se abre y la espalda se arquea un poco, sin esfuerzo.',
  safety: 'No hundas la zona lumbar con fuerza ni eches la cabeza atrás: el cuello sigue largo y la mirada, al frente.',
  chair: 'Sentado, con las manos en las rodillas, lleva el pecho hacia delante y mira al frente.'},
 {id: 'downdog', code: 'P', es: 'El perro boca abajo', en: 'Downward dog', sides: false, breaths: 4,
  steps: [
   {es: 'Desde cuatro patas, apoya los dedos de los pies en el suelo.', en: 'Tuck your toes.'},
   {es: 'Empuja el suelo con las manos y sube la cadera hacia el techo.', en: 'Hips up high.'},
   {es: 'Rodillas un poco dobladas si hace falta; los talones bajan hacia el suelo sin forzar.', en: 'Soft knees, heels down.'},
  ],
  exit: {es: 'Baja las rodillas al suelo.', en: 'Knees down.'},
  feel: 'Se estiran la espalda y la parte de atrás de las piernas; los brazos y los hombros trabajan.',
  safety: 'La cabeza cuelga relajada y no se apoya en el suelo. Si te mareas o te cansas, baja a la postura del niño.',
  chair: 'Sentado al borde, estira los brazos hacia delante y alarga la espalda inclinándote desde la cadera.'},
 {id: 'cobra', code: 'C', es: 'La cobra', en: 'Cobra', sides: false, breaths: 3,
  steps: [
   {es: 'Túmbate boca abajo, con las piernas estiradas y las manos debajo de los hombros.', en: 'Lie on your tummy.'},
   {es: 'Codos pegados al cuerpo. Al tomar aire, despega un poco el pecho del suelo.', en: 'Lift your chest a little.'},
   {es: 'Hombros lejos de las orejas y mirada al frente.', en: 'Shoulders down, look ahead.'},
  ],
  exit: {es: 'Baja el pecho despacio y apoya la frente.', en: 'Lower down slowly.'},
  feel: 'Se estira la parte de delante del cuerpo y la espalda trabaja suave.',
  safety: 'Es una cobra pequeña: la cadera sigue en el suelo y los codos, doblados. El cuello largo, sin echar la cabeza atrás. Si molesta la espalda, sube menos.',
  chair: 'Sentado, agarra los lados del asiento por detrás, abre el pecho y lleva los hombros atrás mirando al frente.'},
 {id: 'butterfly', code: 'B', es: 'La mariposa', en: 'Butterfly', sides: false, breaths: 4,
  steps: [
   {es: 'Siéntate en el suelo con la espalda larga y las rodillas dobladas.', en: 'Sit up tall.'},
   {es: 'Junta las plantas de los pies y deja caer las rodillas hacia los lados.', en: 'Soles together, knees out.'},
   {es: 'Sujeta los pies con las manos y mueve las rodillas despacio, como alas.', en: 'Flap your wings gently.'},
  ],
  exit: {es: 'Junta las rodillas y estira las piernas.', en: 'Knees together.'},
  feel: 'Se estira la parte de dentro de los muslos y la espalda se mantiene larga.',
  safety: 'No empujes las rodillas hacia abajo con las manos: bajan solas con el tiempo. Si molesta, aleja un poco los pies.',
  chair: 'Sentado al borde, junta los talones en el suelo y abre las rodillas suavemente hacia los lados.'},
 {id: 'child', code: 'N', es: 'La postura del niño', en: 'Child’s pose', sides: false, breaths: 5,
  steps: [
   {es: 'De rodillas, siéntate sobre los talones.', en: 'Sit back on your heels.'},
   {es: 'Inclina el cuerpo hacia delante y apoya la frente en el suelo.', en: 'Forehead to the floor.'},
   {es: 'Brazos estirados delante o junto al cuerpo. Respira tranquilo.', en: 'Arms forward, breathe slowly.'},
  ],
  exit: {es: 'Sube despacio, enrollando la espalda.', en: 'Roll up slowly.'},
  feel: 'La espalda se relaja y notas la respiración moverse en la espalda.',
  safety: 'Si molestan las rodillas, sepáralas un poco o pon un cojín entre los talones y la cadera.',
  chair: 'Sentado, inclínate hacia delante, apoya el pecho en los muslos y deja colgar los brazos.'},
];

// The cool-down at the end of every practice.
export const CALM = {id: 'calma', es: 'Vuelta a la calma', en: 'Cool down',
 steps: [{es: 'Siéntate cómodo, cierra los ojos si quieres y pon las manos en la tripa.', en: 'Hands on your tummy.'},
  {es: 'Nota cómo sube al tomar aire y baja al soltarlo.', en: 'Feel it rise and fall.'}],
 end: {es: '¡Bien hecho! Abrid los ojos despacio.', en: 'Well done!'}, breaths: 3};

export const BREATH = {in: {es: 'Inhala', en: 'Breathe in'}, out: {es: 'Exhala', en: 'Breathe out'}};
export const SIDES = [{es: 'Lado derecho', en: 'Right side'}, {es: 'Lado izquierdo', en: 'Left side'}];

export const byId = id => POSES.find(pose => pose.id === id);
export const byCode = code => POSES.find(pose => pose.code === code);

// Ready-made sequences for a first session.
export const SAMPLES = [
 {name: 'Despertar', detail: 'De pie, para empezar la clase', poses: ['mountain', 'chair', 'warrior1', 'warrior2', 'triangle', 'mountain']},
 {name: 'Equilibrio', detail: 'Árbol y guerreros', poses: ['mountain', 'tree', 'warrior2', 'tree', 'mountain']},
 {name: 'Suelo tranquilo', detail: 'Para volver a la calma', poses: ['cat', 'cow', 'downdog', 'child', 'cobra', 'child', 'butterfly']},
];
