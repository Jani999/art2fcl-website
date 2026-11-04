import {test,expect,chromium} from '@playwright/test';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
test('canonical portfolio, complete intro, city and five responsive layouts',async({page})=>{
 test.setTimeout(180000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 for(const viewport of [{width:1920,height:1080},{width:1440,height:900},{width:1366,height:768},{width:390,height:844},{width:375,height:812}]){
  await page.setViewportSize(viewport);await page.goto('/');await expect(page.locator('#pre')).toHaveCount(0,{timeout:10000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1800);
  await expect(page.locator('#gl')).toHaveAttribute('data-ready','true');await expect(page.locator('.pj')).toHaveCount(3);
  for(const id of ['home','about','work','stack','contact']){await page.locator(`nav a[href="#${id}"]`).click();await page.waitForTimeout(1600);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await expect(page.locator('#'+id)).toBeInViewport();await page.screenshot({path:`.local/claude/screenshots/${viewport.width}-${id}.png`});}
  await expect(page.locator('#about [data-n]')).toHaveText(['3','3','2']);
 }
 expect(errors).toEqual([]);
});
test('contact destinations, overlay passthrough and accessible mobile music layout',async({page})=>{
 await page.setViewportSize({width:375,height:812});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('#pre')).toHaveCount(0);
 await expect(page.locator('.mail')).toHaveAttribute('href','https://wa.me/6289652447077');await expect(page.locator('.soc a').first()).toHaveAttribute('href','https://github.com/Jani999');await expect(page.locator('.soc a').last()).toHaveAttribute('href','mailto:celesfrieg@gmail.com');await expect(page.locator('.unavailable')).toHaveAttribute('aria-disabled','true');
 await expect(page.locator('#fx')).toHaveCSS('pointer-events','none');await page.locator('#mpd').click();await expect(page.locator('#mpd')).toHaveAttribute('aria-expanded','true');const box=await page.locator('#mp').boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(375);
 await page.screenshot({path:'.local/claude/screenshots/player-mobile.png'});await page.locator('#mpd').click();await page.keyboard.press('Tab');await expect(page.locator(':focus')).toHaveCount(1);
});
test('real music controls work when autoplay is blocked',async({page})=>{
await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(first){first=false;return Promise.reject(new DOMException('Test autoplay policy','NotAllowedError'));}return play.call(this);};});

 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');const audio=page.locator('#au');await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.readyState)).toBeGreaterThan(0);expect(await audio.evaluate((a:HTMLAudioElement)=>a.paused)).toBeTruthy();
 await page.locator('#mpd').click();await page.getByRole('button',{name:'Putar musik',exact:true}).click();await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(.1);await expect(page.locator('#ml')).toHaveText('NOW PLAYING');
 await page.locator('#volume').fill('25');expect(await audio.evaluate((a:HTMLAudioElement)=>a.volume)).toBe(.25);await page.locator('#sk').fill('500');await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(30);await page.getByRole('button',{name:'Bisukan',exact:true}).click();expect(await audio.evaluate((a:HTMLAudioElement)=>a.muted)).toBeTruthy();await page.getByRole('button',{name:'Aktifkan suara'}).click();
 await page.locator('nav a[href="#work"]').click();expect(await audio.evaluate((a:HTMLAudioElement)=>a.paused)).toBeFalsy();await page.getByRole('button',{name:'Jeda musik'}).click();expect(await audio.evaluate((a:HTMLAudioElement)=>a.paused)).toBeTruthy();
});
test('actual analyser paints the lime signal while playing',async({page})=>{
await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(first){first=false;return Promise.reject(new DOMException('Test autoplay policy','NotAllowedError'));}return play.call(this);};});
await page.goto('/');await expect(page.locator('#pre')).toHaveCount(0,{timeout:10000});await page.locator('#mpd').click();await page.locator('#pp').click();await expect.poll(()=>page.locator('#eq').evaluate((c:HTMLCanvasElement)=>Array.from(c.getContext('2d')!.getImageData(0,0,72,20).data).some(v=>v>0))).toBeTruthy();
});
test('missing audio, WebGL failure and no-JS remain usable',async({page,browser})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;Object.defineProperty(HTMLCanvasElement.prototype,'getContext',{value:function(this:HTMLCanvasElement,...args:unknown[]){if(String(args[0]).includes('webgl'))return null;return Reflect.apply(original,this,args);}});});
 await page.route('**/assets/audio/*.mp3',r=>r.abort());await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('#mp')).toHaveAttribute('data-audio','unavailable');await expect(page.locator('#pp')).toBeDisabled();await expect(page.locator('#home h1')).toBeVisible();await page.locator('nav a[href="#stack"]').click();await expect(page.locator('#stack')).toBeInViewport();
 const context=await browser.newContext({javaScriptEnabled:false});const staticPage=await context.newPage();await staticPage.goto('/');await expect(staticPage.locator('#pre')).toBeHidden();await expect(staticPage.locator('#home h1')).toBeVisible();await expect(staticPage.locator('.chip').first()).toHaveCSS('opacity','1');await context.close();
});
test('production build includes the supplied audio without embedding base64',async()=>{
 const html=await readFile('dist/index.html','utf8');expect(html).not.toContain('base64,');expect(html).toContain('src="assets/audio/demons-shot.mp3"');expect(html).not.toContain('data-audio-unavailable');expect((await readFile('dist/assets/audio/demons-shot.mp3')).length).toBeGreaterThan(1000000);
});
test('compare canonical source geometry and palette',async({page,browser})=>{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const ref=await context.newPage();
 const source=await readFile('references/claude-design/index.html','utf8');
 await ref.route('https://cdnjs.cloudflare.com/**',async route=>route.fulfill({body:await readFile('portfolio/assets/vendor/'+new URL(route.request().url()).pathname.split('/').pop()),contentType:'text/javascript'}));
 await ref.route('https://cdn.jsdelivr.net/**',async route=>route.fulfill({body:await readFile('portfolio/assets/vendor/'+new URL(route.request().url()).pathname.split('/').pop()),contentType:'text/javascript'}));
 await ref.route('https://fonts.googleapis.com/**',async r=>r.fulfill({body:await readFile('portfolio/assets/css/fonts.css'),contentType:'text/css'}));
 await ref.route('**/assets/fonts/**',async r=>r.fulfill({body:await readFile('portfolio'+new URL(r.request().url()).pathname),contentType:'font/ttf'}));
 await ref.route('**/__reference',r=>r.fulfill({body:source,contentType:'text/html'}));await ref.goto('/__reference');await ref.evaluate(()=>document.fonts.ready);await ref.waitForTimeout(1500);
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const collect=()=>({palette:['--bg','--ink','--c','--m','--y','--v','--paper'].map(k=>getComputedStyle(document.documentElement).getPropertyValue(k)),sections:[...document.querySelectorAll('main section')].map(e=>e.id),titles:[...document.querySelectorAll('.pj h3')].map(e=>e.textContent),heroFont:getComputedStyle(document.querySelector('h1')!).fontFamily,heroSize:getComputedStyle(document.querySelector('h1')!).fontSize,aboutBackground:getComputedStyle(document.querySelector('.pn.w')!).backgroundColor});
 const reference=await ref.evaluate(collect),actual=await page.evaluate(collect);expect(actual).toEqual(reference);await mkdir('.local/claude',{recursive:true});await writeFile('.local/claude/design-comparison.json',JSON.stringify({reference,actual},null,2));await ref.screenshot({path:'.local/claude/screenshots/canonical-hero.png'});await page.screenshot({path:'.local/claude/screenshots/integrated-hero.png'});await context.close();
});

test('touch device uses native cursor and permits navigation',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});const page=await context.newPage();await page.goto('/');await expect(page.locator('#pre')).toHaveCount(0,{timeout:10000});await expect(page.locator('body')).not.toHaveClass(/custom-cursor/);await page.locator('nav a[href="#contact"]').tap();await expect(page.locator('#contact')).toBeInViewport({timeout:10000});await page.locator('#mpd').tap();await expect(page.locator('#mpd')).toHaveAttribute('aria-expanded','true');await page.screenshot({path:'.local/claude/screenshots/touch-contact.png'});await context.close();
});


test('blocked autoplay starts on first page gesture and respects pause',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLMediaElement.prototype.play;let first=true;HTMLMediaElement.prototype.play=function(){if(first){first=false;return Promise.reject(new DOMException('Test policy','NotAllowedError'));}return original.call(this);};});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('#ml')).toHaveText('TAP TO PLAY');await page.locator('#home h1').click();await expect.poll(()=>page.locator('#au').evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(.1);await page.locator('#pp').click();await page.locator('#home h1').click();expect(await page.locator('#au').evaluate((a:HTMLAudioElement)=>a.paused)).toBeTruthy();
});

test('music starts at load when browser autoplay policy permits',async()=>{
 const browser=await chromium.launch({channel:process.env.CI?undefined:'msedge',args:['--autoplay-policy=no-user-gesture-required']});
 try{const page=await browser.newPage({baseURL:String(test.info().project.use.baseURL),reducedMotion:'reduce'});await page.goto('/');await expect.poll(()=>page.locator('#au').evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(.1);await expect(page.locator('#ml')).toHaveText('NOW PLAYING');await page.locator('#pp').click();expect(await page.locator('#au').evaluate((a:HTMLAudioElement)=>a.paused)).toBeTruthy();}finally{await browser.close();}
});
