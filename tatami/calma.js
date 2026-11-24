// Winding down in El Tatami: two short guided routines for the whole class, standing or seated.
// «Respira con la ola» is slow breathing with a longer way out and no holding of the breath; «Tensar y soltar»
// walks through the body tensing each part for a few seconds and letting it go. Why these two, and what the
// evidence says they are good for (winding down, not a wellbeing programme): docs/13-investigacion-contenidos.md.

export const RUTINAS = {
 ola: {es: 'Respira con la ola', en: 'Breathe with the wave', como: 'De pie o sentados, con las manos en las costillas para notar cómo se abren.'},
 tensar: {es: 'Tensar y soltar', en: 'Tense and let go', como: 'De pie o sentados. Se aprieta sin hacerse daño y sin aguantar el aire.'},
};
const RESPIRACIONES = 10, COGER = 4, SOLTAR = 6;
// One image from the gym for each part of the body.
const ZONAS = [
 {es: 'Manos', en: 'Hands', orden: 'Aprieta dos pelotas de espuma, una en cada mano.'},
 {es: 'Brazos', en: 'Arms', orden: 'Empuja una pared que tienes delante.'},
 {es: 'Hombros', en: 'Shoulders', orden: 'Súbelos hasta las orejas, como con una mochila que pesa.'},
 {es: 'Cara', en: 'Face', orden: 'Arruga la nariz y aprieta los ojos.'},
 {es: 'Barriga', en: 'Tummy', orden: 'Ponla dura, como si fuera a caerte un balón encima.'},
 {es: 'Piernas', en: 'Legs', orden: 'Empuja el suelo con los dos pies.'},
 {es: 'Pies', en: 'Feet', orden: 'Agarra la colchoneta con los dedos de los pies.'},
];
const TENSAR = 5, AFLOJAR = 10;

// The steps of a routine: {fase, segundos, es, en, orden, cuenta}. `fase` is 'in', 'out', 'tense' or 'release'.
export function plan(tipo) {
 if (tipo === 'ola') return Array.from({length: RESPIRACIONES}, (_, i) => [
  {fase: 'in', segundos: COGER, es: 'Coge aire', en: 'Breathe in', orden: 'Por la nariz, despacio.', cuenta: `Respiración ${i + 1} de ${RESPIRACIONES}`},
  {fase: 'out', segundos: SOLTAR, es: 'Suéltalo despacio', en: 'Breathe out slowly', orden: 'Más despacio de lo que lo has cogido.', cuenta: `Respiración ${i + 1} de ${RESPIRACIONES}`},
 ]).flat();
 if (tipo === 'tensar') return ZONAS.map((zona, i) => [
  {fase: 'tense', segundos: TENSAR, es: zona.es, en: zona.en, orden: zona.orden, cuenta: `${i + 1} de ${ZONAS.length} · Aprieta · Squeeze`},
  {fase: 'release', segundos: AFLOJAR, es: zona.es, en: zona.en, orden: 'Suelta de golpe y nota cómo se queda blando.', cuenta: `${i + 1} de ${ZONAS.length} · Suelta · Let go`},
 ]).flat();
 return [];
}
export const duracion = tipo => plan(tipo).reduce((total, paso) => total + paso.segundos, 0);
// How big the wave is (0 to 1) a fraction `avance` into a step: it grows while breathing in or letting go,
// and shrinks while breathing out or tensing.
export function tamano(fase, avance) {
 const t = Math.min(1, Math.max(0, avance)), suave = t * t * (3 - 2 * t);
 return fase === 'in' || fase === 'release' ? suave : 1 - suave;
}

// Wires the routines to the page. `alTerminar(tipo, segundos)` is called when one is done to the end.
export function iniciarCalma({alTerminar} = {}) {
 const $ = id => document.getElementById(id);
 const stage = $('calm'), wave = $('calm-wave');
 let pasos = [], at = 0, dentro = 0, tipoNow = null, last = 0, frame = 0, paused = false, hecho = 0;
 const quieto = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
 function pinta() {
  const paso = pasos[at];
  stage.dataset.phase = paso.fase;
  $('calm-es').textContent = paso.es; $('calm-en').textContent = paso.en;
  $('calm-order').textContent = paso.orden; $('calm-count').textContent = paso.cuenta;
 }
 function fin() {
  cancelAnimationFrame(frame); frame = 0;
  stage.dataset.phase = 'end';
  $('calm-es').textContent = 'Listo'; $('calm-en').textContent = 'Well done';
  $('calm-order').textContent = 'Abre los ojos despacio y estírate.'; $('calm-count').textContent = '';
  $('calm-pause').hidden = true; $('calm-left').textContent = '';
  wave.style.transform = 'scale(.75)';
  alTerminar?.(tipoNow, Math.round(hecho));
 }
 function tick(now) {
  frame = 0;
  const dt = Math.min(.1, (now - (last || now)) / 1000);
  last = now;
  if (!paused) { dentro += dt; hecho += dt; }
  while (dentro >= pasos[at].segundos) { dentro -= pasos[at].segundos; at++; if (at >= pasos.length) { fin(); return; } pinta(); }
  // With reduced motion the wave jumps between its two sizes instead of flowing.
  const size = tamano(pasos[at].fase, quieto() ? 1 : dentro / pasos[at].segundos);
  wave.style.transform = `scale(${(.45 + .55 * size).toFixed(3)})`;
  $('calm-left').textContent = Math.max(1, Math.ceil(pasos[at].segundos - dentro));
  frame = requestAnimationFrame(tick);
 }
 function abrir(tipo) {
  pasos = plan(tipo);
  if (!pasos.length) return;
  tipoNow = tipo; at = 0; dentro = 0; hecho = 0; last = 0; paused = false;
  $('calm-title').textContent = `${RUTINAS[tipo].es} · ${RUTINAS[tipo].en}`;
  $('calm-how').textContent = RUTINAS[tipo].como;
  $('calm-pause').hidden = false; $('calm-pause').firstElementChild.textContent = 'Pausa';
  stage.hidden = false; document.body.classList.add('practising');
  pinta();
  frame = requestAnimationFrame(tick);
  $('calm-close').focus();
 }
 function cerrar() {
  cancelAnimationFrame(frame); frame = 0;
  stage.hidden = true; document.body.classList.remove('practising');
 }
 $('calm-close').addEventListener('click', cerrar);
 $('calm-pause').addEventListener('click', () => { paused = !paused; $('calm-pause').firstElementChild.textContent = paused ? 'Seguir' : 'Pausa'; });
 addEventListener('keydown', event => { if (event.key === 'Escape' && !stage.hidden) cerrar(); });
 for (const button of document.querySelectorAll('[data-calma]')) button.addEventListener('click', () => abrir(button.dataset.calma));
}
