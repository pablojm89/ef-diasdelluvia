// Real browser + real external room broker. No fake sockets or shared-tab transport.
// Requires Playwright, installed Chromium and internet. MATE_CLIENTS=26 tests a full room.
const {chromium}=require('playwright');
const fs=require('node:fs/promises'),nativeFs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..'),out=path.join(base,'artifacts');
const count=Math.max(2,Math.min(26,Number(process.env.MATE_CLIENTS)||4));
const full=process.env.MATE_FULL_MATCH!=='0';
function checkTeams(players) {
 for(const team of [0,1]){
  const picks=players.filter(p=>p.team===team).map(p=>p.character);
  assert.ok(picks.every(c=>Number.isInteger(c)&&c>=0&&c<13));
  assert.equal(new Set(picks).size,picks.length,'Repeated character on team '+team);
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(nativeFs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const contexts=[],pages=[],errors=[];
 const diag=p=>p.evaluate(()=>window.mateDiagnostics());
 try{
  await fs.mkdir(out,{recursive:true});
  async function openPlayer(i){
   const context=await browser.newContext({viewport:{width:1366,height:900},reducedMotion:'reduce'});contexts.push(context);
   if(i>1)await context.addInitScript(()=>{window.MATE_FORCE_RELAY=true;});
   await context.route('https://patio.test/**',async route=>{
    let name=decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\//,'');if(!name||name.endsWith('/'))name+='index.html';
    const file=path.resolve(base,name);if(!file.startsWith(base+'/'))return route.fulfill({status:403,body:''});
    try{await route.fulfill({status:200,body:await fs.readFile(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'}[path.extname(file)]||'application/octet-stream')});}catch{await route.fulfill({status:404,body:''});}
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));pages.push(page);await page.goto('https://patio.test/mate/');await page.waitForSelector('.character-choice');
   return page;
  }
  const host=await openPlayer(0);await host.screenshot({path:path.join(out,'mate-menu.png'),fullPage:true});
  const heroCards=host.locator('.character-choice');
  assert.equal(await heroCards.count(),13);
  const portraitSources=await heroCards.locator('img').evaluateAll(images=>images.map(image=>image.src));
  assert.equal(new Set(portraitSources).size,13,'Every hero has an individual portrait');
  await heroCards.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await host.setViewportSize({width:390,height:844});
  await host.click('[data-character="12"]');
  assert.match(await host.locator('#character-description').innerText(),/Salida veloz/);
  assert.ok(await host.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await host.evaluate(()=>window.scrollTo(0,0));
  await host.screenshot({path:path.join(out,'mate-mobile-roster.png'),fullPage:true});
  await host.setViewportSize({width:1366,height:900});
  // Exercise offline training first: movement, throw, pause, and touch layout.
  await host.click('[data-character="12"]');await host.click('#train-button');await host.waitForFunction(()=>mateDiagnostics().state?.phase==='playing');
  assert.equal(await host.locator('#match-talent-name').textContent(),'Salida veloz');
  checkTeams((await diag(host)).state.players);
  const y0=(await diag(host)).state.players.find(p=>p.id==='local').y;
  await host.keyboard.down('ArrowDown');await host.waitForTimeout(450);await host.keyboard.up('ArrowDown');assert.ok((await diag(host)).state.players.find(p=>p.id==='local').y>y0+35);
  await host.keyboard.press('Space');
  await host.waitForFunction(()=>mateDiagnostics().state.ball.holder!=='local',{},{timeout:4000});
  await host.click('#pause-button');const t=(await diag(host)).state.tick,roundLeft=(await host.evaluate(()=>document.getElementById('game-view').dataset.phase));await host.waitForTimeout(250);assert.equal((await diag(host)).state.paused,true);
  await host.screenshot({path:path.join(out,'mate-training.png'),fullPage:true});
  host.once('dialog',d=>d.accept());await host.click('#leave-game');
  // Open a real online room; the first guest exercises automatic WebRTC -> WSS fallback.
  await host.click('#host-button');await host.waitForSelector('#lobby-view:not([hidden])',{timeout:30000});const code=await host.locator('#lobby-code').textContent();
  const size=Math.ceil(count/2);await host.selectOption('#team-size',String(size));await host.selectOption('#round-seconds','60');await host.selectOption('#best-of','1');
  for(let i=1;i<count;i++){
   const p=await openPlayer(i);await p.click('[data-character="12"]');await p.fill('#room-code',code);await p.click('#join-button');try{await p.waitForSelector('#lobby-view:not([hidden])',{timeout:30000});}catch(e){console.log('JOIN FAILED',i,'STATUS',await p.locator('#menu-status').textContent(),'HOST',await diag(host));throw e;}
   console.log(`Joined ${i+1}/${count}`);await p.click('#ready-button');
  }
  await host.waitForFunction(n=>mateDiagnostics().roster.filter(m=>m.connected).length===n,count,{timeout:15000});
  assert.equal(await host.locator('.player-slot:not(.empty)').count(),count);
  const roster=(await diag(host)).roster;
  checkTeams(roster);
  assert.deepEqual([0,1].map(team=>roster.filter(p=>p.team===team&&p.character===12).length),[1,1]);
  const teammates=roster.filter(p=>p.team===0&&!p.host);
  for(const teammate of teammates)assert.equal(await host.locator('#lobby-character option[value="'+teammate.character+'"]').isDisabled(),true);
  await host.screenshot({path:path.join(out,'mate-lobby.png'),mask:[host.locator('#lobby-code')],fullPage:true});
  await host.click('#start-button');
  await Promise.all(pages.map(p=>p.waitForFunction(()=>mateDiagnostics().state?.phase==='playing',{},{timeout:15000})));
  const guest=pages[1],guestId=(await diag(guest)).myId;
  assert.ok(['MQTT / WSS','WebRTC DataChannel'].includes((await diag(guest)).transport));
  assert.equal((await diag(host)).state.players.length,size*2);
  checkTeams((await diag(host)).state.players);
  const guestBefore=(await diag(guest)).state.players.find(p=>p.id===guestId);
  const talentBefore=await guest.locator('#match-talent-name').textContent();
  assert.equal(guestBefore.character,12);assert.equal(talentBefore,'Salida veloz');
  console.log(`Connected ${count} independent browser contexts. Transport: ${(await diag(guest)).transport}`);
  // A remote key press must change the host-authoritative player's position.
  const before=(await diag(host)).state.players.find(p=>p.id===guestId).y;
  await guest.keyboard.down('ArrowDown');
  try{
   await host.waitForFunction(({id,y})=>mateDiagnostics().state.players.find(p=>p.id===id).y>y+25,{id:guestId,y:before},{timeout:8000});
  }finally{await guest.keyboard.up('ArrowDown');}
  const after=(await diag(host)).state.players.find(p=>p.id===guestId).y;assert.ok(after>before+25,`Remote movement not received: ${before} -> ${after}`);
  // Stop and synchronize. Guests cannot use P to pause the host.
  await guest.keyboard.press('KeyP');await guest.waitForTimeout(200);assert.equal((await diag(host)).state.paused,false);
  await host.click('#pause-button');await guest.waitForFunction(()=>mateDiagnostics().state?.paused===true,{},{timeout:6000});
  const frozen=(await diag(guest)).state.players.find(p=>p.id===guestId).y;await guest.keyboard.down('ArrowUp');await guest.waitForTimeout(200);await guest.keyboard.up('ArrowUp');assert.ok(Math.abs((await diag(host)).state.players.find(p=>p.id===guestId).y-frozen)<.2);
  // Reload and recover the same place; the host's IA covers the disconnect.
  await guest.reload();await guest.waitForSelector('#join-button');
  await host.waitForFunction(id=>mateDiagnostics().state.players.find(p=>p.id===id)?.bot===true,guestId,{timeout:10000});
  await guest.fill('#room-code',code);await guest.click('#join-button');try{await guest.waitForSelector('#game-view:not([hidden])',{timeout:30000});}catch(e){console.log('RECONNECT HOST',await diag(host));console.log('RECONNECT GUEST',await diag(guest),await guest.locator('#menu-status').textContent());throw e;}
  assert.equal((await diag(guest)).myId,guestId);
  await host.waitForFunction(id=>mateDiagnostics().state.players.find(p=>p.id===id)?.bot===false,guestId,{timeout:10000});
  await guest.waitForFunction(({guestId,character})=>mateDiagnostics().state?.players.find(p=>p.id===guestId)?.character===character,{guestId,character:guestBefore.character});
  assert.equal(await guest.locator('#match-talent-name').textContent(),talentBefore);
  await host.click('#pause-button');await guest.waitForFunction(()=>mateDiagnostics().state?.paused===false,{},{timeout:7000});
  // Actual throw travels from the host and is visible in a different browser.
  assert.equal(await host.evaluate(()=>document.activeElement.id),'court');
  const hostId=(await diag(host)).myId;
  await host.keyboard.press('Space');
  await guest.waitForFunction(id=>mateDiagnostics().state.ball.holder!==id,hostId,{timeout:8000});
  await host.screenshot({path:path.join(out,'mate-online-host.png'),mask:[host.locator('#match-mode')],fullPage:true});await guest.screenshot({path:path.join(out,'mate-online-guest.png'),mask:[guest.locator('#match-mode')],fullPage:true});
  console.log('Remote movement, host-only pause, reconnect and shared throw passed.');
  if(full){
   console.log('Playing a complete online round (60 seconds maximum per round).');
   await host.waitForFunction(()=>mateDiagnostics().state?.phase==='matchOver',{},{timeout:220000});
   await guest.waitForFunction(()=>mateDiagnostics().state?.phase==='matchOver',{},{timeout:7000});
   assert.deepEqual((await diag(host)).state.scores,(await diag(guest)).state.scores);
   await host.screenshot({path:path.join(out,'mate-result.png'),mask:[host.locator('#match-mode')],fullPage:true});
   await host.click('#rematch-button');await Promise.all(pages.map(p=>p.waitForSelector('#lobby-view:not([hidden])',{timeout:12000})));
   console.log('Full online match and shared result passed; all clients returned to the room.');
  }
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(out,`mate-network-result-${count}.json`),JSON.stringify({clients:count,realExternalBroker:true,fullMatch:full,errors,checkedAt:new Date().toISOString()},null,2));
  console.log('PASS: Mate Arena real network/browser integration.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
