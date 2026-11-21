// The order trolley: a low wooden trolley on the floor that shows every unit put on it.
import {PINTADOS} from './assets/pintados.js';

// Where each unit stands on the deck, in % of the trolley box: [centre x, bottom, width].
const slots = {
 hoop: [[31, 60, 30], [46, 59, 30]],
 cone: [[17, 66, 13], [29, 66, 13], [41, 66, 13], [53, 66, 13]],
 softball: [[71, 66, 15]],
};

// cart: {id: units}. names: {id: [en, es]}. remove(id) is called when a unit is touched; null for a static trolley.
// A finished order with nothing left to change can use the painted loaded trolley (lote 14) once it exists.
export function trolley(cart, names, remove, complete) {
 const box = document.createElement('div');
 const loaded = complete && !remove && PINTADOS.includes('trolley-loaded');
 box.className = 'trolley painted';
 box.innerHTML = loaded ? '<img class="trolley-art" alt="" draggable="false" src="assets/trolley-loaded.webp">' : '<img class="trolley-art" alt="" draggable="false" src="assets/trolley.webp">';
 const total = Object.values(cart).reduce((sum, n) => sum + n, 0);
 box.setAttribute('role', 'group');
 box.setAttribute('aria-label', total ? `El carro: ${Object.entries(cart).filter(([, n]) => n).map(([id, n]) => `${n} ${names[id][1]}`).join(', ')}` : 'El carro está vacío');
 if (loaded) return box;
 for (const [id, places] of Object.entries(slots)) {
  places.slice(0, cart[id] || 0).forEach(([x, bottom, width], index) => {
   const unit = document.createElement(remove ? 'button' : 'span');
   unit.className = 'unit';
   unit.dataset.item = id;
   unit.dataset.unit = index;
   unit.innerHTML = `<img alt="" draggable="false" src="assets/prop-${id}.webp">`;
   Object.assign(unit.style, {left: x + '%', bottom: 100 - bottom + '%', width: width + '%'});
   if (remove) {
    unit.dataset.focus = 'unit-' + id + '-' + index;
    unit.setAttribute('aria-label', `${names[id][0]} en el carro (${index + 1} de ${cart[id]}). Pulsa para devolverlo a su sitio`);
    unit.onclick = () => remove(id);
   }
   box.append(unit);
  });
 }
 return box;
}
// Where the next unit of `id` will land, so the flying item can aim at it.
export function slotOf(box, id, index) {
 return box.querySelector(`.unit[data-item="${id}"][data-unit="${index}"]`);
}
