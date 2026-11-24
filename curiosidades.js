// Curiosities of El Pabellón: the framed pictures that hang between the doors of the corridor.
// Each one is a fact told in two languages plus a short movement to try on the spot, with a seated variant.
// The pictures change every week, and what a player has found stays in their album.
// How they are chosen, checked and where they will hang next: docs/12-curiosidades.md.

export const TEMAS = {cuerpo: 'El cuerpo', salud: 'Salud', deportes: 'Deportes', juegos: 'Juegos', historia: 'Historia'};

// `pregunta`, `opciones` and `correcta` come first: the picture asks, the class bets with the body and only then
// it opens (what is guessed first is remembered better). `arte` is existing painted art used as the provisional
// picture; `segundos` adds a countdown to the try-it;
// `fuente` is who says so and where: every fact was checked against it (docs/13-investigacion-contenidos.md).
export const CURIOSIDADES = [
 {id: 'corazon', tema: 'cuerpo', arte: 'aula/assets/mov-marcha.webp', pregunta: '¿Cuántas veces late tu corazón en un día?', opciones: ['Unas 10.000', 'Unas 100.000'], correcta: 1,
  titulo: 'Tu corazón es un músculo', en: 'Your heart is a muscle.',
  texto: 'Tiene más o menos el tamaño de tu puño y late unas 100.000 veces al día. Cuando te mueves, late más deprisa para llevar oxígeno a los músculos.',
  prueba: 'Busca tu pulso en la muñeca o en el cuello. Después marcha con energía hasta que suene el reloj y búscalo otra vez: ¿va más rápido?',
  sentada: 'Sin levantarte: marcha con los brazos y los talones hasta que suene el reloj y busca tu pulso otra vez.', segundos: 20,
  fuente: ['British Heart Foundation', 'https://www.bhf.org.uk/informationsupport/how-a-healthy-heart-works']},
 {id: 'huesos', tema: 'cuerpo', arte: 'aula/assets/mov-codorodilla.webp', pregunta: '¿Quién tiene más huesos?', opciones: ['Un bebé', 'Una persona adulta'], correcta: 0,
  titulo: 'Naces con más huesos de los que tendrás', en: 'An adult has 206 bones.',
  texto: 'Un bebé tiene entre 270 y 300 piezas de hueso y cartílago, según cómo se cuenten. Al crecer, muchas se sueldan y quedan 206. El hueso más largo es el fémur, en el muslo; el más pequeño es el estribo, dentro del oído.',
  prueba: 'Toca y di en inglés, cada vez más rápido: skull, shoulder, elbow, knee, ankle.',
  sentada: 'Igual desde la silla: skull, shoulder, elbow, knee, ankle.',
  fuente: ['Cleveland Clinic', 'https://my.clevelandclinic.org/health/body/25176-bones']},
 {id: 'equilibrio', tema: 'cuerpo', arte: 'aula/assets/mov-flamenco.webp', pregunta: '¿Dónde está el sensor que te ayuda a no caerte?', opciones: ['En el oído', 'En las rodillas'], correcta: 0,
  titulo: 'El equilibrio empieza en el oído', en: 'Your inner ear helps you keep your balance.',
  texto: 'Dentro del oído hay unos canales con líquido que avisan al cerebro de cómo se mueve la cabeza. Los ojos, los músculos y el tacto de piernas y pies le ayudan.',
  prueba: 'Aguanta a la pata coja hasta que suene el reloj. Luego prueba con los ojos cerrados, cerca de tu mesa: cuesta bastante más.',
  sentada: 'Sentado, levanta los dos pies del suelo y cierra los ojos hasta que suene el reloj.', segundos: 10,
  fuente: ['Institutos Nacionales de Salud de EE. UU. (NIDCD)', 'https://www.nidcd.nih.gov/health/balance-disorders']},
 {id: 'musculos', tema: 'cuerpo', arte: 'aula/assets/mov-boxeo.webp', pregunta: '¿Puede un músculo empujar?', opciones: ['Sí, empuja y tira', 'No, sólo sabe tirar'], correcta: 1,
  titulo: 'Los músculos trabajan por parejas', en: 'Muscles work in pairs.',
  texto: 'Un músculo sólo sabe tirar, no empujar. Para doblar el codo tira el bíceps; para estirarlo tira el tríceps, que está detrás. Tienes más de 600 músculos.',
  prueba: 'Dobla el codo despacio tocándote el bíceps con la otra mano: nota cómo se endurece. Estira el brazo y busca el tríceps.',
  sentada: 'Se hace igual sentado.',
  fuente: ['KidsHealth, Nemours', 'https://kidshealth.org/en/kids/muscles.html']},
 {id: 'agua', tema: 'salud', arte: 'aula/assets/mov-sacudida.webp', pregunta: '¿Cuánta parte de tu cuerpo es agua?', opciones: ['Menos de la mitad', 'Más de la mitad'], correcta: 1,
  titulo: 'Más de la mitad de tu cuerpo es agua', en: 'More than half of your body is water.',
  texto: 'Al moverte pierdes agua con el sudor, que sirve para enfriarte. Por eso conviene beber antes, durante y después del ejercicio, sin esperar a tener mucha sed.',
  prueba: 'Sacude brazos y piernas hasta que suene el reloj. Al acabar, bebe un trago de agua si tienes la botella cerca.',
  sentada: 'Sacude manos, brazos y pies desde la silla hasta que suene el reloj.', segundos: 15,
  fuente: ['Servicio Geológico de EE. UU. (USGS)', 'https://www.usgs.gov/water-science-school/science/water-you-water-and-human-body']},
 {id: 'dormir', tema: 'salud', arte: 'tatami/assets/pose-rest-silla.webp', pregunta: '¿Cuánto necesita dormir alguien de tu edad?', opciones: ['De 9 a 12 horas', 'De 6 a 8 horas'], correcta: 0,
  titulo: 'Dormir también es entrenar', en: 'Sleep is part of your training.',
  texto: 'Mientras duermes, el cuerpo repara los músculos y el cerebro ordena y guarda lo aprendido durante el día. De los 6 a los 12 años hacen falta entre 9 y 12 horas de sueño al día.',
  prueba: 'Tres respiraciones lentas: coge aire por la nariz contando hasta cuatro y suéltalo contando hasta seis.',
  sentada: 'Se hace igual sentado, con la espalda larga.',
  fuente: ['American Academy of Sleep Medicine', 'https://aasm.org/advocacy/position-statements/child-sleep-duration-health-advisory/']},
 {id: 'sesenta', tema: 'salud', arte: 'aula/assets/mov-patinador.webp', pregunta: '¿Cuánto recomienda moverse cada día la Organización Mundial de la Salud?', opciones: ['Unos 20 minutos', 'Unos 60 minutos'], correcta: 1,
  titulo: 'Sesenta minutos al día', en: 'Aim for an average of sixty active minutes a day.',
  texto: 'La Organización Mundial de la Salud recomienda que niñas y niños hagan, de media, al menos 60 minutos al día de actividad que acelere el pulso. Todo movimiento cuenta: ir andando al cole, el recreo, jugar, bailar…',
  prueba: 'Suma ahora mismo: elige el movimiento que más te guste y no pares hasta que suene el reloj.',
  sentada: 'Elige un movimiento de brazos o de pies y no pares hasta que suene el reloj.', segundos: 20,
  fuente: ['Organización Mundial de la Salud', 'https://www.who.int/es/news/item/25-11-2020-every-move-counts-towards-better-health-says-who']},
 {id: 'calentar', tema: 'salud', arte: 'aula/assets/mov-hombros.webp', pregunta: 'Al calentar, ¿sube de verdad la temperatura de los músculos?', opciones: ['Sí', 'No, es una forma de hablar'], correcta: 0,
  titulo: 'Calentar es calentar de verdad', en: 'A warm-up really warms your muscles.',
  texto: 'Al moverse, los músculos producen calor y su temperatura sube. Un músculo templado se estira mejor y responde más rápido; por eso se empieza suave y se sube poco a poco.',
  prueba: 'Calentamiento exprés: círculos lentos de tobillos, rodillas, cadera y hombros hasta que suene el reloj.',
  sentada: 'Círculos lentos de tobillos, muñecas y hombros desde la silla.', segundos: 20,
  fuente: ['Revisión científica en PubMed Central', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7675624/']},
 {id: 'baloncesto', tema: 'historia', arte: 'gimnasio/assets/prop-basketball.webp', pregunta: '¿Con qué se hicieron las primeras canastas?', opciones: ['Con cestas de fruta', 'Con aros de barril'], correcta: 0,
  titulo: 'El baloncesto nació con cestas de melocotones', en: 'Basketball began with peach baskets.',
  texto: 'Lo inventó el profesor James Naismith en 1891 para que su clase pudiera jugar bajo techo en invierno. Las primeras canastas eran cestas de fruta con fondo: había que sacar el balón después de cada punto.',
  prueba: 'Cinco tiros imaginarios: flexiona las rodillas, estira el brazo y deja la muñeca floja al soltar.',
  sentada: 'Cinco tiros desde la silla: codo bajo el balón, estira el brazo y muñeca floja.',
  fuente: ['Springfield College', 'https://springfield.edu/about/birthplace-of-basketball']},
 {id: 'maraton', tema: 'historia', arte: 'aula/assets/mov-piesrapidos.webp', pregunta: '¿Cuánto mide un maratón?', opciones: ['Algo más de 42 kilómetros', 'Justo 50 kilómetros'], correcta: 0,
  titulo: '42 kilómetros y 195 metros', en: 'A marathon is 42.195 kilometres long.',
  texto: 'Esa distancia tan rara se corrió en los Juegos de Londres de 1908 y quedó como la oficial en 1921. Quienes más corren del mundo tardan alrededor de dos horas.',
  prueba: 'Corre en el sitio, hasta que suene el reloj, a un ritmo al que podrías seguir hablando: así se aguanta una distancia larga.',
  sentada: 'Brazos de carrera y talones arriba y abajo, a ritmo tranquilo, hasta que suene el reloj.', segundos: 20,
  fuente: ['World Athletics', 'https://worldathletics.org/disciplines/road-running/marathon']},
 {id: 'olimpia', tema: 'historia', arte: 'mate/assets/pista/copa.webp', pregunta: '¿Cuántas pruebas había en los primeros Juegos de Olimpia?', opciones: ['Una sola carrera', 'Más de veinte'], correcta: 0,
  titulo: 'Los primeros Juegos tenían una sola carrera', en: 'The first Olympic Games had only one race.',
  texto: 'Se celebraron en Olimpia, en Grecia, hace unos 2.800 años y, según la tradición, sólo se corría el largo del estadio: unos 192 metros. Los Juegos modernos empezaron en Atenas en 1896.',
  prueba: 'En sus marcas: colócate como en una salida de velocidad y sal tres veces a cámara lenta.',
  sentada: 'Desde la silla: inclínate, prepara los brazos y sal tres veces moviendo sólo los brazos.',
  fuente: ['Comité Olímpico Internacional', 'https://www.olympics.com/ioc/ancient-olympic-games/running']},
 {id: 'yoga', tema: 'historia', arte: 'aula/assets/mov-arbol.webp', pregunta: '¿Qué quiere decir la palabra «yoga»?', opciones: ['Calma', 'Unión'], correcta: 1,
  titulo: 'Yoga quiere decir unión', en: 'The word yoga means union.',
  texto: 'Viene del sánscrito, una lengua antigua de la India, donde el yoga se practica desde hace miles de años. Muchas posturas llevan nombres de animales y de la naturaleza.',
  prueba: 'El árbol: apoya un pie en el tobillo o en la pierna contraria, nunca en la rodilla, y junta las manos. Cinco respiraciones y cambia.',
  sentada: 'El árbol en la silla: abre una rodilla hacia fuera y sube las manos juntas. Cinco respiraciones y cambia.',
  fuente: ['Organización Mundial de la Salud', 'https://www.who.int/india/campaigns/international-yoga-day-2020']},
 {id: 'balon', tema: 'deportes', arte: 'gimnasio/assets/prop-football.webp', pregunta: '¿Por qué el balón clásico es blanco y negro?', opciones: ['Para verse bien en la tele', 'Porque el cuero era así'], correcta: 0,
  titulo: 'El balón clásico tiene 32 piezas', en: 'A classic football has 32 panels.',
  texto: 'Son 20 hexágonos blancos y 12 pentágonos negros. El del Mundial de 1970 se pintó así para que se viera bien en los televisores en blanco y negro.',
  prueba: 'Diez toques imaginarios alternando los pies, con los brazos abiertos para equilibrarte.',
  sentada: 'Sentado, toca el balón imaginario alternando las puntas de los pies.',
  fuente: ['FIFA', 'https://inside.fifa.com/news/telstar-story-fifa-world-cup-ball-3073424']},
 {id: 'volante', tema: 'deportes', arte: 'gimnasio/assets/prop-racket.webp', pregunta: '¿Qué va más rápido?', opciones: ['Un tren de alta velocidad', 'Un volante de bádminton'], correcta: 1,
  titulo: 'Lo más rápido que sale de una raqueta', en: 'The shuttlecock is the fastest object in racket sports.',
  texto: 'El volante de bádminton puede salir de la raqueta a más de 400 kilómetros por hora, más que un tren de alta velocidad. Su faldilla lo frena enseguida.',
  prueba: 'Cinco remates imaginarios con cada brazo: codo arriba, golpea alto y acaba con el brazo cruzado.',
  sentada: 'Los mismos remates desde la silla, con la espalda larga.',
  fuente: ['Guinness World Records', 'https://www.guinnessworldrecords.com/world-records/fastest-badminton-hit-in-competition-male']},
 {id: 'comba', tema: 'deportes', arte: 'gimnasio/assets/prop-rope.webp', pregunta: '¿Hay campeonatos del mundo de saltar a la comba?', opciones: ['Sí', 'No'], correcta: 0,
  titulo: 'Saltar a la comba es un deporte', en: 'Rope skipping is a sport.',
  texto: 'Tiene campeonatos del mundo, con pruebas de velocidad y de estilo libre, llenas de acrobacias. Entrena el corazón, la coordinación y el ritmo.',
  prueba: 'Comba imaginaria hasta que suene el reloj: saltos bajitos, muñecas que giran y caer de puntillas sin hacer ruido.',
  sentada: 'Gira las muñecas y sube los talones al ritmo hasta que suene el reloj.', segundos: 20,
  fuente: ['International Jump Rope Union', 'https://ijru.sport/events']},
 {id: 'goalball', tema: 'deportes', arte: 'aula/assets/mov-eco.webp', pregunta: '¿Se puede jugar a un deporte de balón sin verlo?', opciones: ['No', 'Sí, escuchándolo'], correcta: 1,
  titulo: 'Un deporte que se juega con el oído', en: 'Goalball is played by listening.',
  texto: 'El goalball es un deporte paralímpico para personas ciegas o con baja visión. El balón lleva cascabeles dentro y todos juegan con los ojos tapados; por eso el público guarda silencio mientras se juega.',
  prueba: 'Por parejas: uno cierra los ojos y señala de dónde viene la palmada del otro. Tres intentos y cambio.',
  sentada: 'Se juega igual sentados.',
  fuente: ['Comité Paralímpico Internacional', 'https://www.paralympic.org/goalball']},
 {id: 'rayuela', tema: 'juegos', arte: 'aula/assets/mov-talones.webp', pregunta: '¿Cómo se llama la rayuela en inglés?', opciones: ['Hopscotch', 'Jumpsquare'], correcta: 0,
  titulo: 'La rayuela se juega en medio mundo', en: 'In English, rayuela is called hopscotch.',
  texto: 'Según el lugar se llama también tejo (en partes de España), avión (en México) o golosa (en Colombia). Cambia el dibujo del suelo, pero en todas partes se salta a la pata coja.',
  prueba: 'Salta una rayuela imaginaria: pata coja, pata coja, dos pies, pata coja, dos pies y media vuelta.',
  sentada: 'Con los pies desde la silla: un pie, un pie, los dos, un pie, los dos.',
  fuente: ['Diccionario de americanismos', 'https://www.asale.org/damer/golosa']},
 {id: 'mate', tema: 'juegos', arte: 'mate/assets/pista/peto-cometas.webp', pregunta: '¿Cómo se llama el mate en inglés?', opciones: ['Dodgeball', 'Prisonball'], correcta: 0,
  titulo: 'El mate tiene muchos nombres', en: 'In English, it is called dodgeball.',
  texto: 'Aquí lo llamamos el mate. En otros sitios es balón prisionero, matar, balón tiro o brilé. «Dodge» significa esquivar: lo importante no es dar, es que no te den.',
  prueba: 'Esquiva tres balones imaginarios: agáchate, salta a un lado y gira.',
  sentada: 'Esquiva con el tronco: a un lado, al otro y agáchate sobre las rodillas.',
  fuente: ['Universidad de La Laguna', 'https://riull.ull.es/xmlui/bitstream/handle/915/5231/ESTUDIO%20DE%20LAS%20VOCES%20CANARIAS%20DE%20SEIS%20JUEGOS%20INFANTILES%20TRADICIONALES.pdf']},
 // Second batch (24/11/2026): chosen in docs/13-investigacion-contenidos.md among the candidates whose source was read.
 {id: 'bolos', tema: 'juegos', arte: 'gimnasio/assets/prop-softball.webp', pregunta: 'En los bolos serranos de Jaén, ¿qué es lo que cuenta?', opciones: ['Tumbar el bolo y ya', 'Lo lejos que sale el bolo'], correcta: 1,
  titulo: 'En Jaén los bolos salen volando', en: 'In the mountains of Jaén, the skittles are sent flying.',
  texto: 'Los bolos serranos se juegan en las sierras de Cazorla, Segura y Las Villas y son Bien de Interés Cultural de Andalucía. No basta con tumbar el bolo, que se llama mingo: cuenta lo lejos que sale. Ya se hablaba de ellos hace cuatro siglos.',
  prueba: 'Cinco bolazos imaginarios: un paso adelante, brazo atrás, balanceo bajo y suelta a ras de suelo.',
  sentada: 'El mismo balanceo de brazo desde la silla, soltando hacia delante.',
  fuente: ['Boletín Oficial de la Junta de Andalucía', 'https://www.juntadeandalucia.es/eboja/2026/171/BOJA26-171-00013-11424-01_00342654.pdf']},
 {id: 'pinfuvote', tema: 'deportes', arte: 'aula/assets/mov-palmadarodilla.webp', pregunta: '¿Dónde se inventó el pinfuvote?', opciones: ['En un colegio de Sevilla', 'En una playa de Brasil'], correcta: 0,
  titulo: 'Un deporte inventado en Dos Hermanas', en: 'Pinfuvote mixes four sports in one.',
  texto: 'El pinfuvote nació en 1992 en un colegio de Dos Hermanas, en Sevilla, durante una clase de voleibol. Su nombre junta ping-pong, fútbol, voleibol y tenis. El balón se pasa sobre una red con cualquier parte del cuerpo, con tres toques como máximo.',
  prueba: 'Tres toques imaginarios con tres partes del cuerpo: rodilla, pie y mano. Cinco series.',
  sentada: 'Desde la silla: mano, antebrazo y pie. Cinco series.',
  fuente: ['EFDeportes, artículo de su creador', 'https://efdeportes.com/efd211/pinfuvote-un-nuevo-deporte-fusion.htm']},
 {id: 'huelva', tema: 'historia', arte: 'mate/assets/pista/peto-rayos.webp', pregunta: '¿En qué ciudad nació el club de fútbol más antiguo de España?', opciones: ['En Madrid', 'En Huelva'], correcta: 1,
  titulo: 'El club de fútbol más antiguo es de Huelva', en: 'Spain\'s oldest football club was founded in Huelva.',
  texto: 'El 23 de diciembre de 1889 se fundó en Huelva el Huelva Recreation Club, el primer club de fútbol legalmente establecido en España. No ha dejado de existir, y su actividad está protegida como Bien de Interés Cultural de Andalucía.',
  prueba: 'Diez pases imaginarios con el interior del pie, alternando, y un control con la planta.',
  sentada: 'Lo mismo desde la silla, con la espalda larga.',
  fuente: ['Boletín Oficial de la Junta de Andalucía', 'https://www.juntadeandalucia.es/boja/2016/148/BOJA16-148-00006-14100-01_00096459.pdf']},
 {id: 'flamenco', tema: 'historia', arte: 'aula/assets/mov-tamborilero.webp', pregunta: '¿Qué tres cosas forman el flamenco?', opciones: ['Cante, baile y guitarra', 'Baile, castañuelas y piano'], correcta: 0,
  titulo: 'El flamenco es Patrimonio de la Humanidad', en: 'Flamenco is song, dance and guitar.',
  texto: 'La UNESCO lo declaró Patrimonio Cultural Inmaterial de la Humanidad en 2010. Une cante, baile y toque de guitarra, y se acompaña con palmas y taconeo. Su cuna es Andalucía.',
  prueba: 'Compás de cuatro: palmas 1-2-3-4 marcando fuerte el 1 y, después, lo mismo con los pies, planta y tacón, hasta que suene el reloj.',
  sentada: 'Palmas y tacones desde la silla hasta que suene el reloj.', segundos: 20,
  fuente: ['UNESCO', 'https://ich.unesco.org/es/RL/el-flamenco-00363']},
 {id: 'senderos', tema: 'deportes', arte: 'aula/assets/mov-trepar.webp', pregunta: 'En un sendero ves dos rayas pintadas en aspa. ¿Qué significan?', opciones: ['Vas bien, sigue', 'Por aquí no'], correcta: 1,
  titulo: 'Blanco y rojo: vas por buen camino', en: 'White and red marks show the way.',
  texto: 'Los senderos señalizados de España se marcan con dos rayas pintadas: blanco y rojo en los de más de 50 kilómetros, blanco y amarillo entre 10 y 50, y blanco y verde en los más cortos. Dos rayas en aspa quieren decir «por aquí no».',
  prueba: 'Alguien canta la señal: «rayas», marcha en el sitio; «giro», cuarto de vuelta; «aspa», brazos cruzados y media vuelta. Hasta que suene el reloj.',
  sentada: 'Con los brazos: marcha, señala el giro y cruza en aspa.', segundos: 20,
  fuente: ['Federación Española de Deportes de Montaña y Escalada', 'https://fmm.es/wp-content/uploads/2023/05/ManualSenderosFEDME_18.pdf']},
 {id: 'sol', tema: 'salud', arte: 'aula/assets/mov-girasol.webp', pregunta: 'Un día nublado, ¿puede quemarte el sol?', opciones: ['No, las nubes lo paran', 'Sí'], correcta: 1,
  titulo: 'El sol tiene nota: el índice UV', en: 'The UV index tells you how strong the sun is.',
  texto: 'La agencia de meteorología publica cada día el índice ultravioleta: de 0 a 2 es bajo y por encima de 11, extremo. Con nubes también puede ser alto. Para hacer deporte al aire libre: sombra en las horas centrales, gorra, gafas y crema.',
  prueba: 'Prepárate con mímica antes de que suene el reloj: gorra, gafas y crema en nariz, orejas, nuca, hombros y empeines.',
  sentada: 'Se hace igual desde la silla.', segundos: 20,
  fuente: ['Agencia Estatal de Meteorología', 'https://www.aemet.es/ca/eltiempo/prediccion/radiacionuv/ayuda']},
 {id: 'agujetas', tema: 'cuerpo', arte: 'aula/assets/mov-sentadilla.webp', pregunta: '¿Qué son las agujetas?', opciones: ['Cristales que pinchan el músculo', 'Roturas muy pequeñas del músculo'], correcta: 1,
  titulo: '¿Mito o verdad? Las agujetas', en: 'Sore muscles are not caused by lactic acid.',
  texto: 'Se decía que las agujetas eran cristales de ácido láctico. Es un mito: ese ácido desaparece más o menos en una hora y las agujetas llegan uno o dos días después. Son roturas muy pequeñas del músculo, que al repararse queda más fuerte.',
  prueba: 'Cinco sentadillas bajando en cuatro tiempos y subiendo en uno.',
  sentada: 'Sube los brazos rápido y bájalos en cuatro tiempos, como si pesaran. Cinco veces.',
  fuente: ['Houston Methodist', 'https://www.houstonmethodist.org/blog/articles/2021/oct/is-lactic-acid-buildup-really-what-causes-muscle-soreness-after-a-workout/']},
 {id: 'flato', tema: 'cuerpo', arte: 'aula/assets/mov-laterales.webp', pregunta: '¿Sabe la ciencia por qué da flato?', opciones: ['Sí, desde hace siglos', 'Todavía no del todo'], correcta: 1,
  titulo: 'Nadie sabe del todo qué es el flato', en: 'Scientists are still not sure what causes a stitch.',
  texto: 'Ese pinchazo en el costado al correr le pasa cada año a unas siete de cada diez personas que corren. Aparece más si has comido o tomado bebidas azucaradas justo antes. La ciencia aún no tiene clara la causa.',
  prueba: 'Mano en el costado: cinco respiraciones lentas y hondas, sin aguantar el aire, inclinándote un poco hacia delante.',
  sentada: 'Se hace igual sentado.',
  fuente: ['Revista Sports Medicine', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4281377/']},
 {id: 'voleysentado', tema: 'deportes', arte: 'tatami/assets/pose-star-silla.webp', pregunta: 'En el voleibol sentado, ¿qué pasa si te levantas para golpear?', opciones: ['Nada, vale todo', 'Es falta'], correcta: 1,
  titulo: 'Aquí está prohibido levantarse', en: 'In sitting volleyball, you must stay on the floor.',
  texto: 'El voleibol sentado nació en los Países Bajos en 1956 y es deporte paralímpico. La pista es más pequeña y la red está a poco más de un metro. Al golpear el balón hay que seguir sentado en el suelo: levantarse es falta.',
  prueba: 'Sin despegarte de la silla: cinco toques de dedos y cinco de antebrazos, llegando lejos a un lado y al otro.',
  sentada: 'Así se juega: es la misma.',
  fuente: ['Comité Paralímpico Internacional', 'https://www.paralympic.org/sitting-volleyball']},
 {id: 'voy', tema: 'deportes', arte: 'aula/assets/mov-estatua.webp', pregunta: 'En el fútbol para ciegos, ¿en qué idioma se avisa de que vas a por el balón?', opciones: ['En inglés', 'En español'], correcta: 1,
  titulo: '«¡Voy!», la palabra obligatoria', en: 'Blind footballers shout "voy" before going for the ball.',
  texto: 'En el fútbol para ciegos el balón suena por dentro y los jugadores de campo llevan antifaz. Antes de ir a por el balón dicen «¡voy!», en español, en todo el mundo. El portero sí ve.',
  prueba: 'Junto a tu mesa, con los ojos cerrados y los pies quietos: cuando oigas una palmada, di «¡voy!» y señala de dónde viene. Tres veces.',
  sentada: 'Se hace igual sentado.',
  fuente: ['Comité Paralímpico Internacional', 'https://www.paralympic.org/blind-football']},
 {id: 'zurdos', tema: 'cuerpo', arte: 'aula/assets/mov-director.webp', pregunta: 'De cada diez personas, ¿cuántas son zurdas?', opciones: ['Más o menos una', 'Más o menos cuatro'], correcta: 0,
  titulo: 'Una de cada diez personas es zurda', en: 'About one person in ten is left-handed.',
  texto: 'El mayor estudio hecho hasta ahora calcula que algo más del 10 % de la gente es zurda. También tenemos un pie y un ojo preferidos, y no siempre son del mismo lado que la mano.',
  prueba: 'Descúbrete: lanza una pelota imaginaria, chuta y mira por un catalejo hecho con la mano. Ahora hazlo todo con el otro lado.',
  sentada: 'Las tres pruebas se hacen igual desde la silla.',
  fuente: ['Revista Psychological Bulletin', 'https://research-portal.st-andrews.ac.uk/en/publications/human-handedness-a-meta-analysis/']},
 {id: 'soccer', tema: 'historia', arte: 'gimnasio/assets/prop-cone.webp', pregunta: '¿Dónde se inventó la palabra «soccer»?', opciones: ['En Estados Unidos', 'En Inglaterra'], correcta: 1,
  titulo: '«Soccer» es una palabra inglesa', en: 'The word soccer was invented in England.',
  texto: 'Mucha gente cree que «soccer» es una palabra americana. Nació en Inglaterra en el siglo XIX: es «Association football» acortado, igual que «rugger» para el rugby.',
  prueba: 'British or American? Si oyes la palabra británica, salto a la derecha; si es la americana, a la izquierda: football, soccer, pitch, field.',
  sentada: 'Brazo derecho o brazo izquierdo arriba.',
  fuente: ['Oxford University Press', 'https://blog.oup.com/2014/07/football-soccer-vocabulary/']},
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
