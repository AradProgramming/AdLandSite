/* AdLand Studio / low-cost scroll and 3D interaction engine */
(()=>{
 'use strict';
 const root=document.documentElement,body=document.body,motionQuery=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const low=()=>{try{return localStorage.getItem('adland-motion')==='low'}catch(_){return false}};
 const motionOff=()=>!!motionQuery?.matches||low(),$=s=>document.querySelector(s),$=s=>Array.from(document.querySelectorAll(s));
 const boot=$('#bootScreen'),finishBoot=()=>boot?.classList.add('is-done');
 if(document.readyState==='complete')setTimeout(finishBoot,380);else window.addEventListener('load',()=>setTimeout(finishBoot,350),{once:true});
 setTimeout(finishBoot,1800);
 $('#alYear')?.replaceChildren(String(new Date().getFullYear()));
 const menu=$('#menuToggle'),nav=$('#nav');
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')});
 $$('#primaryNav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}));
 const motionButton=$('#motionBtn');
 const applyMotion=()=>{
  const active=!motionOff();
  body.classList.toggle('al-motion-low',!active);
  window.dispatchEvent(new CustomEvent('adland:motionchange',{detail:{active}}));
  if(motionButton){
   motionButton.textContent=active?'MOTION: HIGH':'MOTION: LOW';
   motionButton.setAttribute('aria-pressed',String(active));
   motionButton.title=motionQuery?.matches?'Reduced motion is required by your device settings':'Toggle interface motion';
  }
 };
 applyMotion();
 motionButton?.addEventListener('click',()=>{try{localStorage.setItem('adland-motion',low()?'high':'low')}catch(_){}applyMotion()});
 motionQuery?.addEventListener?.('change',applyMotion);
 function setupReveal(){
  const items=$$('[data-reveal]');
  items.forEach((el,i)=>el.style.setProperty('--reveal-delay',((i%4)*75)+'ms'));
  if(!('IntersectionObserver'in window)||motionOff()){items.forEach(el=>el.classList.add('is-visible'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -45px 0px'});
  items.forEach(el=>observer.observe(el));
 }
 setupReveal();
 const generalTargets=$$('.app,.tool,.course,.project,.teamCard,.workspace,.feature,.featureCard,.glassCard,.faqItem,.story,.finalCard,.al-panel,.al-card,.toolCard');
 if(!body.classList.contains('al-home')&&'IntersectionObserver'in window&&!motionOff()){
  const globalObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('al-global-visible');globalObserver.unobserve(entry.target)}}),{threshold:.08});
  generalTargets.forEach((el,i)=>{el.classList.add('al-global-reveal');el.style.setProperty('--al-reveal-delay',((i%5)*55)+'ms');globalObserver.observe(el)});
 }else generalTargets.forEach(el=>el.classList.add('al-global-visible'));
 let scrollQueued=false;
 const updateScroll=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),progress=Math.max(0,Math.min(1,scrollY/max));root.style.setProperty('--al-scroll',progress.toFixed(4));const bar=$('#progress');if(bar)bar.style.width=(progress*100).toFixed(2)+'%';scrollQueued=false};
 window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
 if(!motionOff()&&matchMedia('(pointer:fine)').matches){
  let queued=false,lastX=innerWidth*.5,lastY=innerHeight*.4;
  window.addEventListener('pointermove',e=>{if(motionOff())return;lastX=e.clientX;lastY=e.clientY;if(!queued){queued=true;requestAnimationFrame(()=>{root.style.setProperty('--al-pointer-x',lastX+'px');root.style.setProperty('--al-pointer-y',lastY+'px');queued=false})}},{passive:true});
  $$('.al-tilt').forEach(el=>{
   el.addEventListener('pointermove',e=>{if(motionOff())return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--tilt-x',(x*100)+'%');el.style.setProperty('--tilt-y',(y*100)+'%');el.style.setProperty('--tilt-rx',((x-.5)*8)+'deg');el.style.setProperty('--tilt-ry',((.5-y)*8)+'deg')},{passive:true});
   el.addEventListener('pointerleave',()=>{el.style.setProperty('--tilt-rx','0deg');el.style.setProperty('--tilt-ry','0deg')},{passive:true});
  });
 }
 const sections=$$('#home,#studio,#apps,#worlds,#learn,#command'),links=$$('#primaryNav a');
 if('IntersectionObserver'in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-25% 0px -62% 0px',threshold:0});sections.forEach(s=>navObserver.observe(s))}
 const canvas=$('#space'),ctx=canvas?.getContext('2d',{alpha:true});
 if(canvas&&ctx&&!motionOff()){
  let w=0,h=0,dpr=1,particles=[],raf=0;
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const n=Math.min(64,Math.max(24,Math.round(w*h/26000)));particles=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+.35,v:Math.random()*.16+.035,a:Math.random()*.42+.12,p:Math.random()*6.28}))};
  const draw=()=>{ctx.clearRect(0,0,w,h);const time=performance.now()*.0004;for(let i=0;i<particles.length;i++){const p=particles[i];p.y-=p.v;if(p.y<-8){p.y=h+8;p.x=Math.random()*w}const alpha=p.a*(.65+.35*Math.sin(time+p.p));ctx.beginPath();ctx.fillStyle='rgba(166,190,255,'+alpha+')';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();if(i%3===0){for(let j=i+1;j<Math.min(i+5,particles.length);j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);if(dist<110){ctx.strokeStyle='rgba(142,155,231,'+((1-dist/110)*.045)+')';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}}}raf=requestAnimationFrame(draw)};
  resize();draw();
  window.addEventListener('adland:motionchange',event=>{if(!event.detail?.active){cancelAnimationFrame(raf);raf=0}else if(!document.hidden&&!raf)draw()});
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();if(!motionOff()&&!document.hidden)draw()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden||motionOff()){cancelAnimationFrame(raf);raf=0}else if(!raf)draw()});
 }
 body.classList.add('al-motion-ready');
 window.AdLandMotion=Object.freeze({version:'2026.11',refresh:setupReveal,lowMotion:motionOff()});
})();