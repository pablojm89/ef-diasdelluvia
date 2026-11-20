// The order trolley: a low wooden trolley on the floor that shows every unit put on it.
// Until the painted gimnasio/assets/trolley.webp exists (arte/lotes/02-almacen.json, "trolley"),
// a sober drawing in the room's palette stands in for it. Set PAINTED to true once it is delivered.
export const PAINTED = false;
import {PINTADOS} from './assets/pintados.js';

const drawing = `<svg class="trolley-art" viewBox="0 0 420 380" aria-hidden="true">
<g stroke="#4a3520" stroke-width="3" stroke-linejoin="round">
<path d="M352 238V96q0-14 14-14h16q14 0 14 14v118" fill="none" stroke="#5d656a" stroke-width="10" stroke-linecap="round"/>
<path d="M352 238V96q0-14 14-14h16q14 0 14 14v118" fill="none" stroke="#9aa3a8" stroke-width="4" stroke-linecap="round"/>
<path d="M58 232h282l48-32H106z" fill="#e2ad68"/>
<path d="M58 232h282v22H58z" fill="#b97a3c"/>
<path d="M340 232l48-32v22l-48 32z" fill="#9a6431"/>
<path d="M98 222h276M80 212h274" fill="none" stroke="#c48d4e" stroke-width="2"/>
<path d="M58 254h282l48-32" fill="none" stroke="#5d656a" stroke-width="5"/>
</g>
<ellipse cx="226" cy="300" rx="190" ry="14" fill="#3e2922" opacity=".22"/>
<g fill="none" stroke="#4d5458" stroke-width="5" stroke-linecap="round"><path d="M80 254v20M92 254v20M306 254v20M318 254v20M364 226v16M374 222v16"/></g>
<g fill="#33383b" stroke="#1d2123" stroke-width="2"><circle cx="86" cy="284" r="13"/><circle cx="312" cy="284" r="13"/><circle cx="369" cy="248" r="10"/></g>
<g fill="#5d656a"><circle cx="86" cy="284" r="4"/><circle cx="312" cy="284" r="4"/><circle cx="369" cy="248" r="3"/></g>
</svg>`;

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
 box.className = 'trolley' + (PAINTED || loaded ? ' painted' : '');
 box.innerHTML = loaded ? '<img class="trolley-art" alt="" draggable="false" src="assets/trolley-loaded.webp">' : PAINTED ? '<img class="trolley-art" alt="" draggable="false" src="assets/trolley.webp">' : drawing;
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
