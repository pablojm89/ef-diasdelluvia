// Optional browser checks: requires Playwright and an installed Chromium.
const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=path.resolve(__dirname,'..');
const out=path.join(base,'artifacts');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||require('node:fs').existsSync('/usr/bin/chromium')&&'/usr/bin/chromium'||undefined,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.route('https://patio.test/**',async route=>{
  const name=decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\//,'')||'index.html';
  const file=path.resolve(base,name);
  if(!file.startsWith(base+'/'))return route.fulfill({status:403,body:''});
  try{const body=await fs.readFile(file);const ext=path.extname(file);await route.fulfill({status:200,contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp'}[ext]||'application/octet-stream'),body});}
  catch{await route.fulfill({status:404,body:'Not found'});}
 });
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await fs.mkdir(out,{recursive:true});
 // Start screen: one way in for pupils, who pick class, list number and character.
 await page.goto('https://patio.test/index.html');
 assert.equal(await page.locator('#view-title .sign').count(),2);
 await page.locator('#enter-student').click();
 await page.selectOption('#login-group','B');
 await page.selectOption('#login-number','12');
 await page.locator('#login-avatars label').nth(2).click();
 await page.locator('#login-form button').click();
 assert.equal(await page.locator('#player-code').textContent(),'5B-12');
 assert.ok(await page.locator('#doors .door').count()<=4,'pocas puertas para el alumnado');
 assert.equal(await page.locator('#doors a.door').count(),1);
 assert.match(await page.locator('#mission').textContent(),/pelota/);
 assert.equal(await page.locator('#doors img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)),true);
 await page.reload();
 assert.equal(await page.locator('#player-code').textContent(),'5B-12');
 await page.screenshot({path:path.join(out,'hub-pupil.png'),fullPage:true});
 // Class screen: the challenge wheel runs its clock and writes to the record without a player.
 await page.goto('https://patio.test/index.html#pantalla');
 await page.locator('[data-action="wheel"]').click();
 await page.locator('#wheel-spin').click();
 assert.ok((await page.locator('#wheel-title').textContent()).length>3);
 const before=await page.locator('#wheel-clock').textContent();
 await page.locator('#wheel-start').click();
 await page.waitForTimeout(1250);
 assert.notEqual(await page.locator('#wheel-clock').textContent(),before);
 await page.screenshot({path:path.join(out,'hub-wheel.png'),fullPage:true});
 await page.locator('#wheel .close').click();
 // Teacher: a key for this computer opens the desk, which shows who has played here.
 await page.goto('https://patio.test/index.html#profe');
 assert.equal(await page.locator('#desk').isHidden(),true);
 await page.fill('#gate-pin','2468');await page.locator('#gate button').click();
 await page.waitForSelector('#desk:not([hidden])');
 assert.match(await page.locator('#desk-summary').textContent(),/5B-12/);
 await page.locator('#desk-lock').click();
 await page.goto('https://patio.test/index.html#profe');
 await page.fill('#gate-pin','1111');await page.locator('#gate button').click();
 await page.waitForFunction(()=>document.getElementById('gate-status').textContent.length>0);
 assert.equal(await page.locator('#desk').isHidden(),true);
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:800});
  for(const hash of ['','#alumno','#pantalla']){
   await page.goto('https://patio.test/index.html'+hash);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`inicio ${hash} at ${width}: horizontal overflow`);
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('https://patio.test/patio.html');
 await page.waitForSelector('.world-location');
 assert.equal(await page.locator('.world-location').count(),3);
 assert.equal(await page.locator('.world-backdrop').evaluate(i=>i.complete&&i.naturalWidth>0),true);
 await page.screenshot({path:path.join(out,'world-desktop.png'),fullPage:true});
 await page.locator('.refuge-location').click();
 await page.waitForSelector('.journey-map');
 assert.equal(await page.locator('.beacon.current').count(),1);
 await page.locator('[data-action="solo"][data-value="true"]').click();
 await page.locator('#seated').check();
 await page.locator('[data-action="timer"]').click();
 await page.waitForTimeout(1150);
 assert.notEqual(await page.locator('#clock').textContent(),'0:40');
 await page.locator('[data-action="timer"]').click();
 const paused=await page.locator('#clock').textContent();
 await page.waitForTimeout(450);
 assert.equal(await page.locator('#clock').textContent(),paused);
 await page.screenshot({path:path.join(out,'mission-desktop.png'),fullPage:true});
 for(let i=0;i<6;i++)await page.locator('[data-action="mission-next"]').click();
 await page.waitForSelector('.victory-content');
 await page.reload();
 await page.waitForSelector('.victory-content');
 await page.screenshot({path:path.join(out,'victory-desktop.png'),fullPage:true});
 await page.goto('https://patio.test/patio.html#pulso');
 await page.locator('[data-action="beat"]').click();
 await page.waitForTimeout(750);
 assert.equal(await page.locator('.dance-stage.playing').count(),1);
 assert.match(await page.locator('#live-move').textContent(),/de 8/);
 await page.screenshot({path:path.join(out,'pulse-desktop.png'),fullPage:true});
 await page.locator('[data-action="beat"]').click();
 assert.equal(await page.locator('.dance-stage.playing').count(),0);
 await page.goto('https://patio.test/patio.html#liga');
 await page.selectOption('#team-count','2');
 await page.locator('#league-setup button').click();
 for(let round=0;round<6;round++){
  assert.equal(await page.locator('[data-action="league-next"]').isDisabled(),true);
  for(let team=0;team<2;team++){
   const form=page.locator(`form[data-team="${team}"]`);
   for(let criterion=0;criterion<3;criterion++)await form.locator(`[name="criterion${criterion}"]`).selectOption('2');
   await form.locator('button').click();
  }
  assert.equal(await page.locator('[data-action="league-next"]').isEnabled(),true);
  await page.locator('[data-action="league-next"]').click();
 }
 assert.equal(await page.locator('.ranking>div').count(),2);
 assert.match(await page.locator('.ranking').textContent(),/36 \/ 36/);
 await page.goto('https://patio.test/patio.html#biblioteca');
 await page.selectOption('#players-filter','solo');
 await page.selectOption('#family-filter','coordinacion');
 assert.equal(await page.locator('.challenge-grid .challenge').count(),3);
 // New context state is reset before responsive captures to show the first mission.
 await page.evaluate(()=>localStorage.clear());
 await page.reload();
 for(const [width,height,name] of [[390,844,'mobile'],[768,1024,'tablet'],[320,740,'small-mobile'],[1024,768,'small-desktop']]){
  await page.setViewportSize({width,height});
  for(const [hash,screen] of [['inicio','world'],['mision','mission'],['pulso','pulse'],['liga','arena']]){
   await page.goto(`https://patio.test/patio.html#${hash}`);
   await page.waitForTimeout(150);
   await page.evaluate(()=>window.scrollTo(0,0));
   const sizes=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(sizes.content<=sizes.viewport,`${hash} at ${width}: horizontal overflow ${sizes.content}`);
   await page.screenshot({path:path.join(out,`${screen}-${name}.png`),fullPage:true});
  }
 }
 // El Tatami: poses by family, the way into a pose step by step, and sequence codes with and without digits.
 await page.setViewportSize({width:1280,height:720});
 await page.goto('https://patio.test/tatami/index.html');
 const allPoses=await page.locator('.pose-card').count();
 assert.ok(allPoses>=36);
 await page.locator('#families .family').nth(2).click();
 assert.ok(await page.locator('.pose-card').count()<allPoses);
 await page.locator('.pose-card').first().click();
 await page.waitForSelector('#card[open]');
 assert.ok(await page.locator('#card-dots button').count()>=3);
 await page.locator('#card-dots button').nth(1).click();
 assert.match(await page.locator('#card-phase').textContent(),/Paso 2 de \d/);
 await page.locator('#card-add').click();
 assert.equal(await page.locator('#sequence li').count(),1);
 await page.fill('#code-input','msud-tm');
 await page.locator('#code-form button[value=open]').click();
 assert.equal(await page.locator('#code').textContent(),'MSUD-TM');
 await page.fill('#code-input','ea2r');
 await page.locator('#code-form button[value=append]').click();
 assert.equal(await page.locator('#code').textContent(),'MSUD-TMEA2-R');
 await page.locator('#seq-practise').click();
 await page.waitForSelector('#stage:not([hidden])');
 assert.equal(await page.locator('#st-chips li').count(),9);
 await page.screenshot({path:path.join(out,'tatami-stage.png')});
 await page.locator('#st-close').click();
 for(const width of [320,390]){
  await page.setViewportSize({width,height:800});
  for(const hash of ['#aprender','#crear','#practicar']){
   await page.goto('https://patio.test/tatami/index.html'+hash);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`tatami ${hash} at ${width}: horizontal overflow`);
  }
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: world navigation, mission, pause/resume, persistence, animated pulse, full league, filters and 320/390/768/1024px layout without horizontal overflow.');
 console.log('Screenshots: '+out);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
