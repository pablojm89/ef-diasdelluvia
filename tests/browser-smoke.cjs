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
 await page.goto('https://patio.test/');
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
 await page.goto('https://patio.test/#pulso');
 await page.locator('[data-action="beat"]').click();
 await page.waitForTimeout(750);
 assert.equal(await page.locator('.dance-stage.playing').count(),1);
 assert.match(await page.locator('#live-move').textContent(),/de 8/);
 await page.screenshot({path:path.join(out,'pulse-desktop.png'),fullPage:true});
 await page.locator('[data-action="beat"]').click();
 assert.equal(await page.locator('.dance-stage.playing').count(),0);
 await page.goto('https://patio.test/#liga');
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
 await page.goto('https://patio.test/#biblioteca');
 await page.selectOption('#players-filter','solo');
 await page.selectOption('#family-filter','coordinacion');
 assert.equal(await page.locator('.challenge-grid .challenge').count(),3);
 // New context state is reset before responsive captures to show the first mission.
 await page.evaluate(()=>localStorage.clear());
 await page.reload();
 for(const [width,height,name] of [[390,844,'mobile'],[768,1024,'tablet'],[320,740,'small-mobile'],[1024,768,'small-desktop']]){
  await page.setViewportSize({width,height});
  for(const [hash,screen] of [['inicio','world'],['mision','mission'],['pulso','pulse'],['liga','arena']]){
   await page.goto(`https://patio.test/#${hash}`);
   await page.waitForTimeout(150);
   await page.evaluate(()=>window.scrollTo(0,0));
   const sizes=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(sizes.content<=sizes.viewport,`${hash} at ${width}: horizontal overflow ${sizes.content}`);
   await page.screenshot({path:path.join(out,`${screen}-${name}.png`),fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: world navigation, mission, pause/resume, persistence, animated pulse, full league, filters and 320/390/768/1024px layout without horizontal overflow.');
 console.log('Screenshots: '+out);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
