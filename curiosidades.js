// Curiosities of El Pabellón: the framed pictures that hang between the doors of the corridor.
// Each one is a fact told in two languages plus a short movement to try on the spot, with a seated variant.
// The pictures change every week, and what a player has found stays in their album.
// How they are chosen, checked and where they will hang next: docs/12-curiosidades.md.

export const TEMAS = {cuerpo: 'El cuerpo', salud: 'Salud', deportes: 'Deportes', juegos: 'Juegos', historia: 'Historia'};

// `arte` is existing painted art used as the provisional picture; `segundos` adds a countdown to the try-it;
// `fuente` is who says so and where: every fact was checked against it (docs/13-investigacion-contenidos.md).
export const CURIOSIDADES = [
 {id: 'corazon', tema: 'cuerpo', arte: 'aula/assets/mov-marcha.webp', titulo: 'Tu corazón es un músculo', en: 'Your heart is a muscle.',
  texto: 'Tiene más o menos el tamaño de tu puño y late unas 100.000 veces al día. Cuando te mueves, late más deprisa para llevar oxígeno a los músculos.',
  prueba: 'Busca tu pulso en la muñeca o en el cuello. Después marcha con energía hasta que suene el reloj y búscalo otra vez: ¿va más rápido?',
  sentada: 'Sin levantarte: marcha con los brazos y los talones hasta que suene el reloj y busca tu pulso otra vez.', segundos: 20,
  fuente: ['British Heart Foundation', 'https://www.bhf.org.uk/informationsupport/how-a-healthy-heart-works']},
 {id: 'huesos', tema: 'cuerpo', arte: 'aula/assets/mov-codorodilla.webp', titulo: 'Naces con más huesos de los que tendrás', en: 'An adult has 206 bones.',
  texto: 'Un bebé tiene entre 270 y 300 piezas de hueso y cartílago, según cómo se cuenten. Al crecer, muchas se sueldan y quedan 206. El hueso más largo es el fémur, en el muslo; el más pequeño es el estribo, dentro del oído.',
  prueba: 'Toca y di en inglés, cada vez más rápido: skull, shoulder, elbow, knee, ankle.',
  sentada: 'Igual desde la silla: skull, shoulder, elbow, knee, ankle.',
  fuente: ['Cleveland Clinic', 'https://my.clevelandclinic.org/health/body/25176-bones']},
 {id: 'equilibrio', tema: 'cuerpo', arte: 'aula/assets/mov-flamenco.webp', titulo: 'El equilibrio empieza en el oído', en: 'Your inner ear helps you keep your balance.',
  texto: 'Dentro del oído hay unos canales con líquido que avisan al cerebro de cómo se mueve la cabeza. Los ojos, los músculos y el tacto de piernas y pies le ayudan.',
  prueba: 'Aguanta a la pata coja hasta que suene el reloj. Luego prueba con los ojos cerrados, cerca de tu mesa: cuesta bastante más.',
  sentada: 'Sentado, levanta los dos pies del suelo y cierra los ojos hasta que suene el reloj.', segundos: 10,
  fuente: ['Institutos Nacionales de Salud de EE. UU. (NIDCD)', 'https://www.nidcd.nih.gov/health/balance-disorders']},
 {id: 'musculos', tema: 'cuerpo', arte: 'aula/assets/mov-boxeo.webp', titulo: 'Los músculos trabajan por parejas', en: 'Muscles work in pairs.',
  texto: 'Un músculo sólo sabe tirar, no empujar. Para doblar el codo tira el bíceps; para estirarlo tira el tríceps, que está detrás. Tienes más de 600 músculos.',
  prueba: 'Dobla el codo despacio tocándote el bíceps con la otra mano: nota cómo se endurece. Estira el brazo y busca el tríceps.',
  sentada: 'Se hace igual sentado.',
  fuente: ['KidsHealth, Nemours', 'https://kidshealth.org/en/kids/muscles.html']},
 {id: 'agua', tema: 'salud', arte: 'aula/assets/mov-sacudida.webp', titulo: 'Más de la mitad de tu cuerpo es agua', en: 'More than half of your body is water.',
  texto: 'Al moverte pierdes agua con el sudor, que sirve para enfriarte. Por eso conviene beber antes, durante y después del ejercicio, sin esperar a tener mucha sed.',
  prueba: 'Sacude brazos y piernas hasta que suene el reloj. Al acabar, bebe un trago de agua si tienes la botella cerca.',
  sentada: 'Sacude manos, brazos y pies desde la silla hasta que suene el reloj.', segundos: 15,
  fuente: ['Servicio Geológico de EE. UU. (USGS)', 'https://www.usgs.gov/water-science-school/science/water-you-water-and-human-body']},
 {id: 'dormir', tema: 'salud', arte: 'tatami/assets/pose-rest-silla.webp', titulo: 'Dormir también es entrenar', en: 'Sleep is part of your training.',
  texto: 'Mientras duermes, el cuerpo repara los músculos y el cerebro ordena y guarda lo aprendido durante el día. De los 6 a los 12 años hacen falta entre 9 y 12 horas de sueño al día.',
  prueba: 'Tres respiraciones lentas: coge aire por la nariz contando hasta cuatro y suéltalo contando hasta seis.',
  sentada: 'Se hace igual sentado, con la espalda larga.',
  fuente: ['American Academy of Sleep Medicine', 'https://aasm.org/advocacy/position-statements/child-sleep-duration-health-advisory/']},
 {id: 'sesenta', tema: 'salud', arte: 'aula/assets/mov-patinador.webp', titulo: 'Sesenta minutos al día', en: 'Aim for an average of sixty active minutes a day.',
  texto: 'La Organización Mundial de la Salud recomienda que niñas y niños hagan, de media, al menos 60 minutos al día de actividad que acelere el pulso. Todo movimiento cuenta: ir andando al cole, el recreo, jugar, bailar…',
  prueba: 'Suma ahora mismo: elige el movimiento que más te guste y no pares hasta que suene el reloj.',
  sentada: 'Elige un movimiento de brazos o de pies y no pares hasta que suene el reloj.', segundos: 20,
  fuente: ['Organización Mundial de la Salud', 'https://www.who.int/es/news/item/25-11-2020-every-move-counts-towards-better-health-says-who']},
 {id: 'calentar', tema: 'salud', arte: 'aula/assets/mov-hombros.webp', titulo: 'Calentar es calentar de verdad', en: 'A warm-up really warms your muscles.',
  texto: 'Al moverse, los músculos producen calor y su temperatura sube. Un músculo templado se estira mejor y responde más rápido; por eso se empieza suave y se sube poco a poco.',
  prueba: 'Calentamiento exprés: círculos lentos de tobillos, rodillas, cadera y hombros hasta que suene el reloj.',
  sentada: 'Círculos lentos de tobillos, muñecas y hombros desde la silla.', segundos: 20,
  fuente: ['Revisión científica en PubMed Central', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7675624/']},
 {id: 'baloncesto', tema: 'historia', arte: 'gimnasio/assets/prop-basketball.webp', titulo: 'El baloncesto nació con cestas de melocotones', en: 'Basketball began with peach baskets.',
  texto: 'Lo inventó el profesor James Naismith en 1891 para que su clase pudiera jugar bajo techo en invierno. Las primeras canastas eran cestas de fruta con fondo: había que sacar el balón después de cada punto.',
  prueba: 'Cinco tiros imaginarios: flexiona las rodillas, estira el brazo y deja la muñeca floja al soltar.',
  sentada: 'Cinco tiros desde la silla: codo bajo el balón, estira el brazo y muñeca floja.',
  fuente: ['Springfield College', 'https://springfield.edu/about/birthplace-of-basketball']},
 {id: 'maraton', tema: 'historia', arte: 'aula/assets/mov-piesrapidos.webp', titulo: '42 kilómetros y 195 metros', en: 'A marathon is 42.195 kilometres long.',
  texto: 'Esa distancia tan rara se corrió en los Juegos de Londres de 1908 y quedó como la oficial en 1921. Quienes más corren del mundo tardan alrededor de dos horas.',
  prueba: 'Corre en el sitio, hasta que suene el reloj, a un ritmo al que podrías seguir hablando: así se aguanta una distancia larga.',
  sentada: 'Brazos de carrera y talones arriba y abajo, a ritmo tranquilo, hasta que suene el reloj.', segundos: 20,
  fuente: ['World Athletics', 'https://worldathletics.org/disciplines/road-running/marathon']},
 {id: 'olimpia', tema: 'historia', arte: 'mate/assets/pista/copa.webp', titulo: 'Los primeros Juegos tenían una sola carrera', en: 'The first Olympic Games had only one race.',
  texto: 'Se celebraron en Olimpia, en Grecia, hace unos 2.800 años y, según la tradición, sólo se corría el largo del estadio: unos 192 metros. Los Juegos modernos empezaron en Atenas en 1896.',
  prueba: 'En sus marcas: colócate como en una salida de velocidad y sal tres veces a cámara lenta.',
  sentada: 'Desde la silla: inclínate, prepara los brazos y sal tres veces moviendo sólo los brazos.',
  fuente: ['Comité Olímpico Internacional', 'https://www.olympics.com/ioc/ancient-olympic-games/running']},
 {id: 'yoga', tema: 'historia', arte: 'aula/assets/mov-arbol.webp', titulo: 'Yoga quiere decir unión', en: 'The word yoga means union.',
  texto: 'Viene del sánscrito, una lengua antigua de la India, donde el yoga se practica desde hace miles de años. Muchas posturas llevan nombres de animales y de la naturaleza.',
  prueba: 'El árbol: apoya un pie en el tobillo o en la pierna contraria, nunca en la rodilla, y junta las manos. Cinco respiraciones y cambia.',
  sentada: 'El árbol en la silla: abre una rodilla hacia fuera y sube las manos juntas. Cinco respiraciones y cambia.',
  fuente: ['Organización Mundial de la Salud', 'https://www.who.int/india/campaigns/international-yoga-day-2020']},
 {id: 'balon', tema: 'deportes', arte: 'gimnasio/assets/prop-football.webp', titulo: 'El balón clásico tiene 32 piezas', en: 'A classic football has 32 panels.',
  texto: 'Son 20 hexágonos blancos y 12 pentágonos negros. El del Mundial de 1970 se pintó así para que se viera bien en los televisores en blanco y negro.',
  prueba: 'Diez toques imaginarios alternando los pies, con los brazos abiertos para equilibrarte.',
  sentada: 'Sentado, toca el balón imaginario alternando las puntas de los pies.',
  fuente: ['FIFA', 'https://inside.fifa.com/news/telstar-story-fifa-world-cup-ball-3073424']},
 {id: 'volante', tema: 'deportes', arte: 'gimnasio/assets/prop-racket.webp', titulo: 'Lo más rápido que sale de una raqueta', en: 'The shuttlecock is the fastest object in racket sports.',
  texto: 'El volante de bádminton puede salir de la raqueta a más de 400 kilómetros por hora, más que un tren de alta velocidad. Su faldilla lo frena enseguida.',
  prueba: 'Cinco remates imaginarios con cada brazo: codo arriba, golpea alto y acaba con el brazo cruzado.',
  sentada: 'Los mismos remates desde la silla, con la espalda larga.',
  fuente: ['Guinness World Records', 'https://www.guinnessworldrecords.com/world-records/fastest-badminton-hit-in-competition-male']},
 {id: 'comba', tema: 'deportes', arte: 'gimnasio/assets/prop-rope.webp', titulo: 'Saltar a la comba es un deporte', en: 'Rope skipping is a sport.',
  texto: 'Tiene campeonatos del mundo, con pruebas de velocidad y de estilo libre, llenas de acrobacias. Entrena el corazón, la coordinación y el ritmo.',
  prueba: 'Comba imaginaria hasta que suene el reloj: saltos bajitos, muñecas que giran y caer de puntillas sin hacer ruido.',
  sentada: 'Gira las muñecas y sube los talones al ritmo hasta que suene el reloj.', segundos: 20,
  fuente: ['International Jump Rope Union', 'https://ijru.sport/events']},
 {id: 'goalball', tema: 'deportes', arte: 'aula/assets/mov-eco.webp', titulo: 'Un deporte que se juega con el oído', en: 'Goalball is played by listening.',
  texto: 'El goalball es un deporte paralímpico para personas ciegas o con baja visión. El balón lleva cascabeles dentro y todos juegan con los ojos tapados; por eso el público guarda silencio mientras se juega.',
  prueba: 'Por parejas: uno cierra los ojos y señala de dónde viene la palmada del otro. Tres intentos y cambio.',
  sentada: 'Se juega igual sentados.',
  fuente: ['Comité Paralímpico Internacional', 'https://www.paralympic.org/goalball']},
 {id: 'rayuela', tema: 'juegos', arte: 'aula/assets/mov-talones.webp', titulo: 'La rayuela se juega en medio mundo', en: 'In English, rayuela is called hopscotch.',
  texto: 'Según el lugar se llama también tejo (en partes de España), avión (en México) o golosa (en Colombia). Cambia el dibujo del suelo, pero en todas partes se salta a la pata coja.',
  prueba: 'Salta una rayuela imaginaria: pata coja, pata coja, dos pies, pata coja, dos pies y media vuelta.',
  sentada: 'Con los pies desde la silla: un pie, un pie, los dos, un pie, los dos.',
  fuente: ['Diccionario de americanismos', 'https://www.asale.org/damer/golosa']},
 {id: 'mate', tema: 'juegos', arte: 'mate/assets/pista/peto-cometas.webp', titulo: 'El balón prisionero tiene muchos nombres', en: 'In English, it is called dodgeball.',
  texto: 'Según el sitio se le llama mate, matar, balón tiro o brilé. «Dodge» significa esquivar: lo importante no es dar, es que no te den.',
  prueba: 'Esquiva tres balones imaginarios: agáchate, salta a un lado y gira.',
  sentada: 'Esquiva con el tronco: a un lado, al otro y agáchate sobre las rodillas.',
  fuente: ['Universidad de La Laguna', 'https://riull.ull.es/xmlui/bitstream/handle/915/5231/ESTUDIO%20DE%20LAS%20VOCES%20CANARIAS%20DE%20SEIS%20JUEGOS%20INFANTILES%20TRADICIONALES.pdf']},
];

export const curiosidad = id => CURIOSIDADES.find(item => item.id === id) || null;

// Weeks start on Monday. Week 0 began on Monday 5 January 2026.
export function semana(fecha = new Date()) {
 const dia = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
 return Math.floor((dia - Date.UTC(2026, 0, 5)) / 6048e5);
}
// The `cuantas` pictures that hang in the corridor this week. Next week it is the following ones,
// so the whole bank goes by in a few weeks and there is something new to find every Monday.
export function delPasillo(cuantas, fecha = new Date()) {
 const total = CURIOSIDADES.length, n = Math.min(cuantas, total);
 const desde = (((semana(fecha) * n) % total) + total) % total;
 return Array.from({length: n}, (_, i) => CURIOSIDADES[(desde + i) % total]);
}

// --- Album: what each player has found on this device ------------------------------------
// Kept apart from the record, whose oldest lines are dropped when it fills up. `sid` is the student id
// of registro.js, or 'pantalla' for the class screen.
const ALBUM = 'pabellon-curiosidades';
function leer() {
 try { const saved = JSON.parse(localStorage.getItem(ALBUM)); return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}; } catch { return {}; }
}
export function descubiertas(sid) {
 const ids = leer()[sid];
 return Array.isArray(ids) ? ids.filter(id => curiosidad(id)) : [];
}
// True the first time this player finds it.
export function descubrir(id, sid) {
 if (!curiosidad(id) || typeof sid !== 'string' || !sid) return false;
 const album = leer(), mine = Array.isArray(album[sid]) ? album[sid] : [];
 if (mine.includes(id)) return false;
 album[sid] = [...mine, id];
 try { localStorage.setItem(ALBUM, JSON.stringify(album)); } catch {}
 return true;
}
// The teacher's «Borrar registro» wipes the albums too: they are keyed by the same player codes.
export function borrarAlbumes() {
 try { localStorage.removeItem(ALBUM); } catch {}
}
