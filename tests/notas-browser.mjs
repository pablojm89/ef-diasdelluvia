// Browser walk through the teacher's sheet connection, against aula.gs running on simulated sheets.
// Needs the site served first:  python3 -m http.server 3106 --bind 127.0.0.1
// Then:  node tests/notas-browser.mjs   (screenshots in artifacts/notas-*.png). Synthetic data only; not Google.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {servidorHoja} from './servidor-hoja.mjs';

// Playwright is installed globally (as for tests/browser-smoke.cjs), which only `require` finds.
const {chromium} = createRequire(import.meta.url)('playwright');
const SITE = process.env.SITE || 'http://127.0.0.1:3106/', SHEET_PORT = 3107, EXEC = `http://127.0.0.1:${SHEET_PORT}/exec`;
const out = new URL('../artifacts/', import.meta.url).pathname;
await mkdir(out, {recursive: true});
const sheet = await servidorHoja(SHEET_PORT);
const rows = name => (sheet.doble.hoja(name)?.table() || []).slice(1);
// A 1×1 PNG stands in for the pictures of the class package.
const DOT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const PACKAGE = {tipo: 'lalupa-clase', version: 1, clase: '5.º B', curso: '5', alumnos: ['Agente Relámpago', 'Detective Lince', 'Agente Brisa', 'Inspectora Nube', 'Agente Cometa', 'Detective Faro'].map(alias => ({alias, avatar: DOT}))};

const browser = await chromium.launch();
const errors = [];
const watch = page => { page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); }); };
try {
 const context = await browser.newContext({viewport: {width: 1280, height: 720}});
 const page = await context.newPage();
 watch(page);
 // What La Lupa leaves in this browser: its connection in lalupa-ajustes and its class package in IndexedDB.
 await page.goto(SITE + 'index.html');
 await page.evaluate(async ({EXEC, PACKAGE}) => {
  localStorage.setItem('lalupa-ajustes', JSON.stringify({libreta: 'papel', codigoSello: 'LUPA', nube: {url: EXEC, aula: '5B-PRUEBA'}}));
  await new Promise((resolve, reject) => {
   const open = indexedDB.open('lalupa-clase', 1);
   open.onupgradeneeded = () => open.result.createObjectStore('paquete');
   open.onsuccess = () => { const tx = open.result.transaction('paquete', 'readwrite'); tx.objectStore('paquete').put(PACKAGE, 'actual'); tx.oncomplete = () => { open.result.close(); resolve(); }; tx.onerror = reject; };
   open.onerror = reject;
  });
 }, {EXEC, PACKAGE});

 // Teacher: create the key, see La Lupa's connection offered, take it and test it.
 await page.goto(SITE + 'index.html#profe');
 await page.fill('#gate-pin', '2468'); await page.locator('#gate button').click();
 await page.waitForSelector('#desk:not([hidden])');
 await page.waitForSelector('#cloud-lupa:not([hidden])');
 assert.match(await page.locator('#cloud-lupa-text').textContent(), /Agencia La Lupa.*5B-PRUEBA/);
 assert.match(await page.locator('#cloud-state').textContent(), /Sin conectar/);
 await page.waitForSelector('#alias-entry-label:not([hidden])');
 assert.match(await page.locator('#cloud-package').textContent(), /5\.º B, 6 alias/);
 await page.screenshot({path: out + 'notas-despacho-ofrece-1280.png', fullPage: true});
 await page.locator('#cloud-use-lupa').click();
 await page.waitForFunction(() => /Conexión correcta/.test(document.getElementById('cloud-test-result').textContent));
 assert.equal(await page.locator('#cloud-lupa').isHidden(), true);
 assert.deepEqual(await page.evaluate(() => { const v = JSON.parse(localStorage.getItem('aula-nube')); return [v.classCode, v.app]; }), ['5B-PRUEBA', 'pabellon']);
 assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('lalupa-ajustes')).nube.aula), '5B-PRUEBA', 'no toca lo de La Lupa');
 await page.locator('#alias-entry').check();
 await page.locator('#desk-lock').click();

 // Pupil: picks an alias of the class (no typing) and a character.
 await page.goto(SITE + 'index.html#alumno');
 await page.waitForSelector('#login-class:not([hidden])');
 assert.equal(await page.locator('#login-pickers').isHidden(), true);
 assert.equal(await page.locator('#login-form input[type=text], #login-form textarea').count(), 0);
 await page.locator('#login-aliases label', {hasText: 'Agente Relámpago'}).click();
 await page.locator('#login-avatars label').nth(2).click();
 await page.screenshot({path: out + 'notas-entrada-alias-1280.png', fullPage: true});
 await page.locator('#login-form button').click();
 assert.equal(await page.locator('#player-code').textContent(), 'Agente Relámpago');

 // Play: the last phase of Equipment Rescue (earlier phases already done on this computer).
 await page.evaluate(() => localStorage.setItem('ef-gym-mission-v1', JSON.stringify({support: true, reduced: true, state: {version: 1, stage: 4, found: ['hoop', 'cone', 'rope'],
  stored: ['cone', 'hoop', 'rope', 'racket', 'bib', 'mat', 'beanbag', 'basketball', 'football', 'softball'], cart: {cone: 4, hoop: 2, softball: 1}, hazards: [], reason: false, attempts: 22, hints: 1}})));
 await page.goto(SITE + 'gimnasio/');
 await page.locator('#switch-room').click();
 await page.locator('.exit-risk').click();
 await page.locator('.shelf-risk').click();
 await page.locator('#actions .answer').first().click();
 await page.waitForFunction(() => JSON.parse(localStorage.getItem('pabellon-registro')).some(e => e.event === 'completada'));
 await page.waitForFunction(() => JSON.parse(localStorage.getItem('pabellon-registro')).every(e => e.sent), null, {timeout: 10000});

 // Teacher again: nothing pending; the sheet has one pupil, one mark and the evidence.
 await page.goto(SITE + 'index.html#profe');
 await page.fill('#gate-pin', '2468'); await page.locator('#gate button').click();
 await page.waitForSelector('#desk:not([hidden])');
 assert.equal(await page.locator('#cloud-pending').textContent(), '0');
 assert.match(await page.locator('#desk-summary').textContent(), /Agente Relámpago.*1\.3\.a · 9,6 SB/);
 assert.deepEqual(rows('Alumnos').map(r => [r[1], r[2], r[3], r[4], r[5]]), [['5B-PRUEBA', 'agente-relampago', 'Agente Relámpago', '5', 'pabellon']]);
 assert.deepEqual(rows('Notas').map(r => [r[2], r[8], r[9], r[12], r[13], r[14], r[17]]), [['agente-relampago', '1.3.a', 'SB', 9.6, 24, 25, 'pabellon']]);
 assert.deepEqual(rows('Registro EF').map(r => [r[2], r[6], r[7]]), [['agente-relampago', 'entrada', 'entra'], ['agente-relampago', 'equipment-rescue', 'completada']]);
 const posts = sheet.log.filter(x => x.method === 'POST');
 assert.ok(posts.every(x => /^text\/plain/.test(x.type)), 'POST text/plain');
 // Send everything again twice: no new rows.
 for (let i = 0; i < 2; i++) { await page.locator('#cloud-resend').click(); await page.waitForFunction(() => document.getElementById('cloud-pending')?.textContent === '0'); }
 assert.deepEqual([rows('Alumnos').length, rows('Notas').length, rows('Registro EF').length], [1, 1, 2]);
 assert.ok(sheet.log.filter(x => x.method === 'POST').length >= posts.length + 2);
 await page.screenshot({path: out + 'notas-despacho-1280.png', fullPage: true});

 // A failing sheet: the desk says it and keeps everything.
 await page.route(EXEC, route => route.fulfill({status: 200, contentType: 'text/html', body: '<html>Inicia sesión</html>'}));
 await page.evaluate(() => import('./registro.js').then(r => r.record('pista', 'mate', 'partido', {resultado: 'victoria', puntos: 100})));
 await page.locator('#desk-sync').click();
 await page.waitForFunction(() => /No se ha podido confirmar/.test(document.getElementById('cloud-state').textContent));
 assert.equal(await page.locator('#cloud-pending').textContent(), '1');
 await page.screenshot({path: out + 'notas-despacho-fallo-1280.png', fullPage: true});
 await page.unroute(EXEC);
 await page.locator('#desk-sync').click();
 await page.waitForFunction(() => document.getElementById('cloud-pending')?.textContent === '0');
 assert.equal(rows('Registro EF').length, 3);

 // Another computer: a fresh browser with the same connection recovers the pupil's progress.
 const other = await browser.newContext({viewport: {width: 390, height: 844}});
 const phone = await other.newPage();
 watch(phone);
 await phone.goto(SITE + 'index.html');
 await phone.evaluate(EXEC => localStorage.setItem('aula-nube', JSON.stringify({v: 1, url: EXEC, classCode: '5b-prueba', app: 'pabellon'})), EXEC);
 await phone.goto(SITE + 'index.html#alumno');
 await phone.waitForSelector('#login-pickers:not([hidden])');
 await phone.screenshot({path: out + 'notas-entrada-lista-390.png', fullPage: true});
 await phone.evaluate(() => import('./registro.js').then(r => r.setPlayer({course: 5, alias: 'Agente Relámpago', avatar: 2})));
 await phone.reload();
 await phone.locator('#locker-button').click();
 assert.equal(await phone.locator('#locker-recover').isVisible(), true);
 await phone.locator('#locker-recover').click();
 await phone.waitForFunction(() => /Recuperado/.test(document.getElementById('locker-status').textContent));
 assert.match(await phone.locator('#locker-list').textContent(), /Completada/);
 await phone.screenshot({path: out + 'notas-taquilla-390.png', fullPage: true});
 await phone.locator('#locker .close').click();
 await phone.goto(SITE + 'index.html#profe');
 await phone.fill('#gate-pin', '1357'); await phone.locator('#gate button').click();
 await phone.waitForSelector('#desk:not([hidden])');
 await phone.waitForFunction(() => document.getElementById('cloud-pending')?.textContent === '0');
 assert.equal(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'sin desbordamiento horizontal a 390');
 await phone.screenshot({path: out + 'notas-despacho-390.png', fullPage: true});
 await page.setViewportSize({width: 390, height: 844});
 await page.goto(SITE + 'index.html#alumno');
 await page.locator('#locker-button').click();
 await page.locator('#locker-leave').click();
 await page.waitForSelector('#login-class:not([hidden])');
 await page.screenshot({path: out + 'notas-entrada-alias-390.png', fullPage: true});
 assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

 assert.deepEqual(errors.filter(e => !/Failed to load resource/.test(e)), [], 'sin errores de consola');
 console.log(`Recorrido correcto. Peticiones a la hoja simulada: ${sheet.log.length}. Avisos de red esperados: ${errors.length}.`);
} finally {
 await browser.close();
 await sheet.close();
}
