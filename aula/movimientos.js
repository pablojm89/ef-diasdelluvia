// The calls of the movement bingo. Original content, safe next to the desk: no jumping between tables,
// no races and no maximum repetitions. Each one is done for 15–20 seconds at one's own pace.
// `zona` groups them and gives each its colour (the six colours of the challenge wheel).
export const ZONAS = {
 brazos: {name: 'Brazos', colour: '#d9703a'},
 piernas: {name: 'Piernas', colour: '#2f7f78'},
 ritmo: {name: 'Ritmo', colour: '#e2a63b'},
 tronco: {name: 'Tronco', colour: '#c9524a'},
 equilibrio: {name: 'Equilibrio', colour: '#4f8a4b'},
 calma: {name: 'Calma', colour: '#3f6fa8'},
};

const rows = [
 ['molino', 'brazos', 'Brazos de molino', 'Windmill arms', 'Círculos lentos con los brazos estirados, primero hacia delante y luego hacia atrás.', 'Igual, con la espalda apoyada y los brazos a los lados.', 20],
 ['crol', 'brazos', 'Nadar a crol', 'Front crawl', 'Brazos como si nadaras: uno entra delante mientras el otro sale por detrás.', 'Igual, sentado y con la espalda recta.', 20],
 ['remar', 'brazos', 'Remar', 'Rowing', 'Agarra unos remos imaginarios y tira hacia ti con los dos brazos a la vez.', 'Igual: es un ejercicio de silla.', 20],
 ['limpiaparabrisas', 'brazos', 'Limpiaparabrisas', 'Windscreen wipers', 'Codos doblados y manos a la altura de la cara: muévelas juntas de lado a lado.', 'Igual, sentado.', 15],
 ['tijeras', 'brazos', 'Tijeras', 'Arm scissors', 'Brazos estirados delante: crúzalos y descrúzalos, uno arriba y otro abajo.', 'Igual, sentado.', 15],
 ['trepar', 'brazos', 'Trepar la cuerda', 'Rope climb', 'Manos alternas trepando una cuerda imaginaria, mirando hacia arriba.', 'Igual, sentado: sólo los brazos trepan.', 20],
 ['boxeo', 'brazos', 'Boxeo en el aire', 'Shadow boxing', 'Golpes suaves al aire hacia delante, sin tocar a nadie. Pies quietos.', 'Igual, sentado y con golpes cortos.', 15],
 ['director', 'brazos', 'Director de orquesta', 'Orchestra conductor', 'Dirige una orquesta con los dos brazos, marcando el compás de una música que imaginas.', 'Igual, sentado.', 20],
 ['marcha', 'piernas', 'Marcha en el sitio', 'Marching on the spot', 'Sube las rodillas por turnos sin moverte de tu sitio y acompaña con los brazos.', 'Levanta los pies del suelo por turnos.', 20],
 ['talones', 'piernas', 'De puntillas', 'Heel raises', 'Sube despacio a puntillas y baja. Apóyate en la mesa si lo necesitas.', 'Puntas apoyadas: sube y baja los talones.', 15],
 ['sentadilla', 'piernas', 'Casi me siento', 'Chair squat', 'Baja como para sentarte en la silla y sube antes de tocarla, despacio.', 'Inclínate hacia delante con la espalda recta y vuelve.', 15],
 ['laterales', 'piernas', 'Paso al lado', 'Side steps', 'Un paso a la derecha y vuelve; un paso a la izquierda y vuelve. Junto a tu mesa.', 'Separa un pie hacia el lado y vuelve; luego el otro.', 20],
 ['piesrapidos', 'piernas', 'Pies rápidos', 'Fast feet', 'Pisadas cortitas y rápidas en el sitio, como si el suelo quemara. Sin salir de tu sitio.', 'Igual, sentado: los pies tamborilean en el suelo.', 15],
 ['patinador', 'piernas', 'Patinador', 'Speed skater', 'Pasa el peso de una pierna a la otra balanceando los brazos, sin desplazarte.', 'Desliza un pie y luego el otro hacia los lados.', 20],
 ['estrella', 'piernas', 'Estrella', 'Star shape', 'Abre brazos y piernas como una estrella y vuelve a cerrar. Sin saltar.', 'Abre los brazos en estrella y separa las rodillas.', 15],
 ['palmadarodilla', 'piernas', 'Palmada bajo la rodilla', 'Clap under your knee', 'Sube una rodilla y da una palmada por debajo. Cambia de pierna.', 'Igual, sentado.', 20],
 ['tamborilero', 'ritmo', 'Tamborilero', 'Drum roll', 'Tamborilea en los muslos: rápido, lento y otra vez rápido.', 'Igual, sentado.', 15],
 ['hombros', 'ritmo', 'Toque de hombros', 'Shoulder taps', 'Toca el hombro contrario con cada mano, alternando a un ritmo regular.', 'Igual, sentado.', 15],
 ['codorodilla', 'ritmo', 'Codo a la rodilla', 'Elbow to knee', 'Lleva un codo hacia la rodilla contraria, despacio, y cambia.', 'Igual, sentado: la rodilla sube un poco.', 20],
 ['eco', 'ritmo', 'Palmas y muslos', 'Clap and tap', 'Dos palmas suaves y dos toques en los muslos. Repite sin perder el pulso.', 'Igual, sentado.', 15],
 ['giro', 'tronco', 'Torre que gira', 'Trunk twists', 'Gira el tronco a un lado y al otro con los brazos sueltos. Los pies no se mueven.', 'Gira el tronco con las manos en los hombros.', 15],
 ['girasol', 'tronco', 'Girasol', 'Sunflower stretch', 'Estírate hacia el techo y abre los brazos hacia los lados como pétalos.', 'Igual, sentado y bien alto.', 20],
 ['cielosuelo', 'tronco', 'Cielo y suelo', 'Reach high, reach low', 'Brazos al techo y después dobla las rodillas para acercar las manos al suelo.', 'Brazos arriba y después manos hacia los tobillos.', 20],
 ['gato', 'tronco', 'Espalda de gato', 'Cat stretch', 'Manos en las rodillas: redondea la espalda y después estírala.', 'Igual, sentado en el borde de la silla.', 20],
 ['rayos', 'tronco', 'Alcanzar el techo', 'Sky reaches', 'Estira un brazo hacia el techo y luego el otro, como cogiendo fruta de un naranjo.', 'Igual, sentado.', 15],
 ['flamenco', 'equilibrio', 'Flamenco', 'Flamingo balance', 'Sobre un pie, con una mano cerca de la mesa. A mitad, cambia de pie.', 'Levanta un pie del suelo unos segundos y cambia.', 20],
 ['arbol', 'equilibrio', 'Árbol', 'Tree pose', 'Apoya un pie en el tobillo contrario y junta las manos arriba. Cambia a mitad.', 'Manos juntas arriba y la espalda muy alta.', 20],
 ['avion', 'equilibrio', 'Avión', 'Aeroplane', 'Brazos en cruz: inclínate a un lado y al otro como un avión que gira.', 'Igual, sentado.', 15],
 ['estatua', 'equilibrio', 'Estatua', 'Freeze', 'Muévete en tu sitio y, cuando quieras, congélate en una pose divertida. Repite.', 'Igual, con brazos y cara.', 15],
 ['globo', 'calma', 'Respiración de globo', 'Balloon breathing', 'Manos en la tripa: al coger aire se hincha el globo; al soltarlo, se deshincha despacio.', 'Igual, sentado.', 20],
 ['sacudida', 'calma', 'Sacudir y soltar', 'Shake it out', 'Sacude las manos, luego los brazos y luego una pierna y la otra. Termina quieto.', 'Sacude manos, brazos y hombros.', 15],
];

export const MOVIMIENTOS = rows.map(([id, zona, es, en, texto, sentada, segundos]) => ({id, zona, es, en, texto, sentada, segundos}));
export const byId = id => MOVIMIENTOS.find(move => move.id === id);
