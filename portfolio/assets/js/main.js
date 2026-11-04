(()=>{
"use strict";
if(window.__claudePortfolio)return;window.__claudePortfolio=true;

const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
if(!window.gsap||!window.ScrollTrigger||!window.anime){window.finishPortfolioBoot?.();return;}
gsap.registerPlugin(ScrollTrigger);let vel=0,lvl=0;const tickers=[],cleanups=[];const tick=fn=>{tickers.push(fn);gsap.ticker.add(fn)};let particleLayer,typed;const motion=matchMedia('(prefers-reduced-motion:reduce)');
const changeMotion=()=>location.reload();motion.addEventListener('change',changeMotion);cleanups.push(()=>motion.removeEventListener('change',changeMotion));
try{const L=RM?null:new Lenis({lerp:.09});if(!L)throw new Error('native reduced motion');cleanups.push(()=>L.destroy());L.on('scroll',ScrollTrigger.update);tick(t=>L.raf(t*1000));gsap.ticker.lagSmoothing(0);$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(h.length>1){e.preventDefault();L.scrollTo(h)}}))}catch(e){}
$$('[data-s]').forEach(el=>{el.innerHTML=[...el.textContent].map(c=>'<span class="ch">'+c+'</span>').join('')});
$('#home h1 .ln').classList.add('gl');$('#home h1 .ln').dataset.t='ART2FCL';

/* scramble */
const CH='░▒▓█/<>#@%&0123456789';
function scr(el,txt){if(RM){el.textContent=txt||el.textContent;return;}if(el._scramble)el._scramble.pause();const t=txt||el._t||(el._t=el.textContent),o={p:0};el._scramble=anime({targets:o,p:1,duration:900,easing:'linear',update:()=>{const n=Math.floor(o.p*t.length);el.textContent=t.slice(0,n)+[...t.slice(n)].map(c=>c===' '?' ':CH[Math.random()*CH.length|0]).join('')},complete:()=>el.textContent=t})}
$$('[data-sc]').forEach(el=>{if(el.querySelector('i')){[...el.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).forEach(n=>{const span=document.createElement('span');span.textContent=n.textContent;n.replaceWith(span);ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>scr(span)})});const italic=el.querySelector('i');ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>scr(italic)});return;}ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>scr(el)})});

/* HUD */
const clockTimer=setInterval(()=>$('#ck').textContent=new Date().toLocaleTimeString('en-GB')+' LOCAL',1000);cleanups.push(()=>clearInterval(clockTimer));
$$('.sec').forEach(s=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:t=>{if(!t.isActive)return;$('#dn').textContent=s.dataset.d;const k=$('#dk');scr(k,s.dataset.k);if(!RM)anime({targets:'#dn',scale:[1.5,1],duration:500,easing:'easeOutBack'})}}));
gsap.to('#rf',{scaleY:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:.2}});
const mqT=RM?null:gsap.to('#mq',{xPercent:-50,ease:'none',duration:20,repeat:-1});
ScrollTrigger.create({onUpdate:s=>{vel=Math.min(Math.abs(s.getVelocity())/3000,1.4);$('#sp').textContent=String(Math.round(vel*260)).padStart(3,'0');if(RM)return;gsap.to(mqT,{timeScale:1+vel*8,duration:.3,overwrite:true});gsap.to(mqT,{timeScale:1,duration:1.2,delay:.3})}});


/* intro */
let on=false;
function intro(){if(on||RM)return;on=true;
 anime.timeline({easing:'easeOutExpo'})
  .add({targets:'.k,.role,.lead',opacity:[0,1],translateY:[30,0],delay:anime.stagger(100),duration:800})
  .add({targets:'#home .ch',translateY:['115%',0],rotate:()=>[anime.random(-12,12),0],opacity:[0,1],duration:1100,delay:anime.stagger(90)},'-=700')
  .add({targets:'#open,.btns',opacity:[0,1],translateY:[24,0],delay:anime.stagger(120)},'-=500');
 anime({targets:'#open',opacity:[{value:.3,duration:70},{value:1,duration:70},{value:.5,duration:50},{value:1,duration:300}],delay:()=>anime.random(1500,4000),endDelay:()=>anime.random(500,3500),loop:true});
 anime({targets:'.disc',scale:[1,1.3],direction:'alternate',loop:6,duration:450,easing:'easeInOutSine'});anime({targets:'#lp',points:[{value:'100,10 190,100 150,190 100,160 50,190 10,100'},{value:'100,30 150,10 190,100 150,190 100,170 40,190'},{value:'100,10 180,55 180,145 100,190 20,145 20,55'}],duration:4200,easing:'easeInOutQuad',loop:true});
}
const pre=$('#pre');
if(RM){pre.remove();$('#pn').remove();window.finishPortfolioBoot?.()}else{
 const o={v:0},end=()=>{if(pre.isConnected){pre.remove();$('#pn')?.remove();intro();window.finishPortfolioBoot?.()}};
 anime.timeline({easing:'easeInOutQuart'})
  .add({targets:o,v:100,round:1,duration:1800,easing:'easeInOutExpo',update:()=>$('#pn').textContent=String(o.v).padStart(3,'0')})
  .add({targets:'#pn',opacity:0,scale:1.3,duration:300},'+=100')
  .add({targets:'#pre i',translateX:'101%',duration:800,delay:anime.stagger(70),easing:'easeInOutExpo',complete:end},'-=100');
 setTimeout(end,7000);
}

/* reveals, counters, draw, chips */
if(!RM)$$('.rv').forEach(el=>gsap.from(el,{y:70,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
$$('[data-n]').forEach(n=>{if(RM){n.textContent=n.dataset.n;return;}const o={v:0};ScrollTrigger.create({trigger:n,start:'top 92%',once:true,onEnter:()=>anime({targets:o,v:+n.dataset.n,round:1,duration:1600,easing:'easeOutExpo',update:()=>n.textContent=o.v})})});
ScrollTrigger.create({trigger:'.dr',start:'top 90%',once:true,onEnter:()=>RM||anime({targets:'.dr path',strokeDashoffset:[anime.setDashoffset,0],duration:1400,easing:'easeInOutSine'})});
ScrollTrigger.create({trigger:'#stack',start:'top 60%',once:true,onEnter:()=>RM?0:anime({targets:'.chip',opacity:[0,1],translateY:[30,0],rotate:()=>[anime.random(-8,8),0],delay:anime.stagger(60),duration:700,easing:'easeOutBack'})});

/* libs */
if(!RM&&window.Typed){$('#ty').textContent='';typed=new Typed('#ty',{strings:['Web <b>Developer</b>','Mobile <b>Developer</b>','Laravel <b>Builder</b>','Motion UI <b>Enthusiast</b>'],typeSpeed:40,backSpeed:20,backDelay:1400,loop:true,contentType:'html'});cleanups.push(()=>typed.destroy());}
if(!RM&&matchMedia('(pointer:fine)').matches&&window.VanillaTilt)VanillaTilt.init($$('.pj'),{max:12,speed:400,glare:true,'max-glare':.2,perspective:900});
try{if(!RM&&window.tsParticles)tsParticles.load({id:'fx',options:{fullScreen:{enable:false},fpsLimit:innerWidth<700?30:60,pauseOnBlur:true,pauseOnOutsideViewport:true,particles:{number:{value:innerWidth<700?30:70},color:{value:['#00e5ff','#ff2bd6','#f4ff3d']},shape:{type:'square'},size:{value:{min:1,max:2.2}},opacity:{value:{min:.15,max:.6}},move:{enable:!RM,direction:'bottom',straight:true,speed:{min:1,max:4},outModes:'out'}},interactivity:{detectsOn:'window',events:{onHover:{enable:true,mode:'repulse'}},modes:{repulse:{distance:90}}}}}).then(c=>{particleLayer=c}).catch(()=>{})}catch(e){}
if(!RM&&matchMedia('(pointer:fine)').matches)$$('.mag').forEach(b=>{const xt=gsap.quickTo(b,'x',{duration:.4,ease:'power3'}),yt=gsap.quickTo(b,'y',{duration:.4,ease:'power3'});b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();xt((e.clientX-r.left-r.width/2)*.3);yt((e.clientY-r.top-r.height/2)*.3)});b.addEventListener('pointerleave',()=>{xt(0);yt(0)})});
const cu=$('.cur');if(!RM&&matchMedia('(pointer:fine)').matches){document.body.classList.add('custom-cursor');const qx=gsap.quickTo(cu,'x',{duration:.18}),qy=gsap.quickTo(cu,'y',{duration:.18});addEventListener('pointermove',e=>{qx(e.clientX);qy(e.clientY)});$$('a,.pj,.chip,.mp button').forEach(el=>{el.addEventListener('pointerenter',()=>cu.classList.add('h'));el.addEventListener('pointerleave',()=>cu.classList.remove('h'))})}

/* Supplied recording: shared local and production player. */
const au=$('#au'),mp=$('#mp'),pp=$('#pp'),sk=$('#sk'),mu=$('#mu'),ec=$('#eq').getContext('2d'),status=$('#audio-status');
let ac,an,fd,source,ready=false;au.volume=.6;
const timeLabel=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function setup(){if(ready)return;ready=true;try{ac=new(window.AudioContext||window.webkitAudioContext)();source=ac.createMediaElementSource(au);an=ac.createAnalyser();an.fftSize=64;source.connect(an);an.connect(ac.destination);fd=new Uint8Array(an.frequencyBinCount)}catch{an=null;if(source&&ac)source.connect(ac.destination)}}
$('#mpd').addEventListener('click',()=>{const open=mp.classList.toggle('open');$('#music-panel').hidden=!open;$('#mpd').setAttribute('aria-expanded',String(open));$('#mpd').setAttribute('aria-label',open?'Tutup pemutar musik':'Buka pemutar musik')});
pp.addEventListener('click',async()=>{setup();try{if(ac?.state==='suspended')await ac.resume();if(au.paused)await au.play();else au.pause();status.textContent='';}catch{status.textContent='Pemutaran belum tersedia. Coba lagi.'}});
au.addEventListener('play',()=>{mp.classList.add('playing');pp.setAttribute('aria-label','Jeda musik');$('#ml').textContent='NOW PLAYING'});
au.addEventListener('pause',()=>{mp.classList.remove('playing');pp.setAttribute('aria-label','Putar musik');$('#ml').textContent='PAUSED';drawIdle()});
const unavailable=()=>{status.textContent='Audio belum tersedia untuk publikasi.';$('#ml').textContent='UNAVAILABLE';pp.disabled=sk.disabled=mu.disabled=$('#volume').disabled=true;mp.dataset.audio='unavailable';};
au.addEventListener('error',unavailable);if(!au.hasAttribute('src')||au.error)unavailable();
// Try audible autoplay; browser policy may require the first genuine gesture.
let awaitingGesture=true;
function removeMusicGesture(){awaitingGesture=false;document.removeEventListener('pointerdown',firstMusicGesture);document.removeEventListener('keydown',firstMusicGesture)}
async function firstMusicGesture(event){
 if(!awaitingGesture||event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
 // Explicit player controls own their play/pause state and must not double-toggle.
 if(event.target.closest?.('#mp'))return;
 removeMusicGesture();if(au.error||!au.hasAttribute('src'))return;
 setup();try{if(ac?.state==='suspended')await ac.resume();await au.play();status.textContent='';}catch{status.textContent='Klik tombol play untuk memulai musik.';}
}
document.addEventListener('pointerdown',firstMusicGesture);document.addEventListener('keydown',firstMusicGesture);
pp.addEventListener('click',removeMusicGesture);cleanups.push(removeMusicGesture);
if(au.hasAttribute('src')&&!au.error)au.play().catch(error=>{if(error.name==='NotAllowedError'&&au.paused){$('#ml').textContent='TAP TO PLAY';status.textContent='Musik akan mulai setelah interaksi pertama.';}});

const volume=$('#volume');
const fill=el=>el.style.setProperty('--fill',Number(el.value)/Number(el.max)*100+'%');
function syncTime(){if(Number.isFinite(au.duration)){sk.value=au.currentTime/au.duration*1000;sk.setAttribute('aria-valuetext',timeLabel(au.currentTime)+' dari '+timeLabel(au.duration));$('#audio-time').textContent=timeLabel(au.currentTime);$('#audio-duration').textContent=timeLabel(au.duration);fill(sk)}}
au.addEventListener('timeupdate',syncTime);au.addEventListener('loadedmetadata',syncTime);syncTime();
sk.addEventListener('input',()=>{if(Number.isFinite(au.duration)){au.currentTime=Number(sk.value)/1000*au.duration;syncTime()}});
function syncVolume(){const muted=au.muted||au.volume===0;mp.classList.toggle('muted',muted);mu.setAttribute('aria-pressed',String(muted));mu.setAttribute('aria-label',muted?'Aktifkan suara':'Bisukan');volume.value=au.muted?0:Math.round(au.volume*100);volume.setAttribute('aria-valuetext',volume.value+'%');fill(volume)}
mu.addEventListener('click',()=>{if(au.muted||au.volume===0){au.muted=false;if(au.volume===0)au.volume=.6}else au.muted=true;syncVolume()});
volume.addEventListener('input',()=>{au.volume=Number(volume.value)/100;au.muted=false;syncVolume()});au.addEventListener('volumechange',syncVolume);syncVolume();
function drawIdle(){ec.clearRect(0,0,72,26);ec.fillStyle='#b9df51';for(let i=0;i<30;i++)ec.fillRect(2+i*2.3,24,1,1)}drawIdle();
tick(()=>{if(document.hidden||au.paused){lvl*=.9;return;}let a=0;if(an){an.getByteFrequencyData(fd);for(let i=0;i<fd.length;i++)a+=fd[i];a/=fd.length*255}else a=.25;lvl+=(a-lvl)*.2;
 if(RM)return;ec.clearRect(0,0,72,26);ec.fillStyle='#b9df51';for(let i=0;i<30;i++){const v=an?fd[i]/255:0,h=Math.max(1,v*18);ec.fillRect(2+i*2.3,25-h,1,h)}});
cleanups.push(()=>{au.pause();source?.disconnect();an?.disconnect();ac?.close()});

/* Three.js: neon Tokyo night city flythrough */
try{
const R=new THREE.WebGLRenderer({canvas:$('#gl'),alpha:true,antialias:innerWidth>700});R.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.5));
const S=new THREE.Scene();S.fog=new THREE.FogExp2(0x020309,.026);
const C=new THREE.PerspectiveCamera(60,1,.1,260);
const cols=[0x00e5ff,0xff2bd6,0xf4ff3d,0x7a3cff],N=innerWidth<700?150:280,Z0=30,ZL=250,rnd=(a,b)=>a+Math.random()*(b-a);
const inst=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0x04050d}),N),sg=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff}),N),D=new THREE.Object3D(),P=[],K=[];let sn=0;
for(let i=0;i<N;i++){const w=rnd(2,6),h=rnd(5,40),d=rnd(2,6),sd=i%2?1:-1,x=sd*(6+w/2+rnd(0,20)),z=Z0-i/N*ZL+rnd(-3,3),c=new THREE.Color(cols[i%4]);
 D.position.set(x,h/2,z);D.scale.set(w,h,d);D.updateMatrix();inst.setMatrixAt(i,D.matrix);
 const cs=[];for(let a=0;a<8;a++)cs.push([x+((a&1)-.5)*w,((a&2)>>1)*h,z+(((a&4)>>2)-.5)*d]);
 for(let a=0;a<8;a++)[1,2,4].forEach(b=>{if(!(a&b)){P.push(...cs[a],...cs[a|b]);K.push(c.r,c.g,c.b,c.r,c.g,c.b)}});
 if(i%3===0){D.position.set(x-sd*(w/2+.1),rnd(3,h),z+rnd(-1,1));D.scale.set(.25,rnd(2,7),.5);D.updateMatrix();sg.setMatrixAt(sn,D.matrix);sg.setColorAt(sn,new THREE.Color(cols[(i+1)%4]));sn++}}
sg.count=sn;
const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));lg.setAttribute('color',new THREE.Float32BufferAttribute(K,3));
S.add(inst,sg,new THREE.LineSegments(lg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9})));
const gr=new THREE.GridHelper(400,160,0x7a3cff,0x14183a);gr.position.z=-90;S.add(gr);
const gates=[];for(let i=0;i<7;i++){const g=new THREE.Mesh(new THREE.TorusGeometry(7.5,.07,6,6),new THREE.MeshBasicMaterial({color:cols[i%4]}));g.position.set(0,6,Z0-8-i*36);S.add(g);gates.push(g)}
const bb=[];
document.fonts.ready.then(()=>{if(cityDisposed)return;[['電脳街','SYSTEM ONLINE'],['渋谷','NEON DISTRICT'],['未来','FUTURE//DEV'],['起動','BOOT SEQUENCE'],['夜','ABYSS']].forEach((t,i)=>{const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d'),col='#'+cols[i%4].toString(16).padStart(6,'0');x.strokeStyle=x.fillStyle=col;x.lineWidth=8;x.strokeRect(8,8,496,240);x.textAlign='center';x.font="900 120px 'Noto Sans JP',sans-serif";x.fillText(t[0],256,140);x.font="700 34px monospace";x.fillText(t[1],256,205);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(10,5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));m.position.set((i%2?1:-1)*13,rnd(10,16),Z0-20-i*45);m.rotation.y=(i%2?-1:1)*.5;S.add(m);bb.push(m)});painted=false;});
$('#gl').dataset.ready='true';let cityDisposed=false;const rs=()=>{R.setSize(innerWidth,innerHeight,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()};rs();addEventListener('resize',rs);cleanups.push(()=>{cityDisposed=true;removeEventListener('resize',rs);S.traverse(o=>{o.geometry?.dispose();const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];ms.forEach(m=>{m.map?.dispose();m.dispose()})});R.dispose()});$('#gl').addEventListener('webglcontextlost',e=>{e.preventDefault();cityDisposed=true;$('#gl').style.opacity='0';$('#gl').dataset.failed='true'});
let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
const st={p:0};gsap.to(st,{p:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:1.2}});
let lastDraw=0,painted=false;tick(t=>{if(cityDisposed||document.hidden||RM&&painted)return;if(t-lastDraw<1/(innerWidth<700?30:60))return;lastDraw=t;painted=true;const k=RM?0:1,p=st.p,z=22-p*215;
 C.position.set(Math.sin(p*14)*2.2+mx*2,5+Math.sin(t*.8)*.15*k-my*1.2,z);C.lookAt(Math.sin(p*14+.4)*2+mx*4,4.5-my*2,z-20);
 C.fov+=(60+vel*16+lvl*2-C.fov)*.12;C.updateProjectionMatrix();
 gates.forEach((g,i)=>{g.rotation.z=t*.25*k*(i%2?1:-1);g.scale.setScalar(1+lvl*.08)});
 bb.forEach((m,i)=>m.material.opacity=.75+Math.sin(t*3+i*2)*.2*k-(k&&Math.random()<.02?.4:0));
 R.render(S,C)});
}catch(e){}

addEventListener('pagehide',()=>{tickers.forEach(fn=>gsap.ticker.remove(fn));cleanups.forEach(fn=>fn());particleLayer?.destroy();$$('.pj').forEach(el=>el.vanillaTilt?.destroy());ScrollTrigger.getAll().forEach(t=>t.kill());gsap.globalTimeline.clear();anime.running.slice().forEach(a=>a.pause());});addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
})();
