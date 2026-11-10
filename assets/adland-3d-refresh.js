
/* AdLand Studio — multi-stage scroll triggers and subtle 3D pointer response */
(()=>{'use strict';
 const root=document.documentElement,body=document.body;
 if(!body||body.dataset.alRefreshReady==='1')return;
 body.dataset.alRefreshReady='1';body.classList.add('adland-refresh');
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const selector=['#hero .heroCopy','#hero .heroCore','.heroCopy','.visual','.sectionHeader','.sectionHeadMain','.app','.project','.tool','.course','.teamCard','.workspace','.signal','.story','.faqItem','.finalCard','.skillCard','.feedbackCard','.feedbackSecure','.contactPanel','.feature','.step','.callout','.grid > *','.steps > *','.contactGrid > *','.feedbackLayout > *'].join(',');
 const nodes=[...new Set(document.querySelectorAll(selector))];
 const reveal=(el)=>el.classList.add('al-in-view');
 if(reduced||!('IntersectionObserver'in window))nodes.forEach(reveal);
 else{
  nodes.forEach((el,i)=>{el.classList.add('al-scroll-reveal');if(i%3===1)el.classList.add('al-from-left');if(i%3===2)el.classList.add('al-from-right');el.style.setProperty('--al-stagger',Math.min(i%6,5)*65+'ms')});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){reveal(entry.target);observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});
  nodes.forEach(el=>observer.observe(el));
  setTimeout(()=>nodes.forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.96)reveal(el)}),1500);
 }
 const tiltSelector='.app,.project,.tool,.course,.teamCard,.workspace,.feature,.step,.contactPanel,.feedbackCard,.feedbackSecure,.glassDevice,.f2f-highlight';
 const tilts=[...document.querySelectorAll(tiltSelector)];
 if(!reduced&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  tilts.forEach(el=>{el.classList.add('al-tilt');el.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=el.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/Math.max(1,r.width))),y=Math.max(0,Math.min(1,(e.clientY-r.top)/Math.max(1,r.height)));el.style.setProperty('--al-spot-x',(x*100)+'%');el.style.setProperty('--al-spot-y',(y*100)+'%');el.style.setProperty('--al-tilt-x',((x-.5)*8)+'deg');el.style.setProperty('--al-tilt-y',((.5-y)*7)+'deg');el.classList.add('al-tilting')},{passive:true});el.addEventListener('pointerleave',()=>{el.style.setProperty('--al-tilt-x','0deg');el.style.setProperty('--al-tilt-y','0deg');el.classList.remove('al-tilting')},{passive:true})});
  body.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;root.style.setProperty('--mx',e.clientX+'px');root.style.setProperty('--my',e.clientY+'px')},{passive:true});
 }
 let frame=0;function scrollFX(){frame=0;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),progress=Math.max(0,Math.min(1,scrollY/max));root.style.setProperty('--al-scroll-progress',progress.toFixed(4));const bar=document.getElementById('progress');if(bar)bar.style.width=(progress*100).toFixed(2)+'%';let active='';document.querySelectorAll('main section[id],section[id]').forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.42)active=s.id});if(active)document.querySelectorAll('#nav .navlinks a[href^="#"]').forEach(a=>{const yes=a.getAttribute('href')==='#'+active;a.classList.toggle('active',yes);if(yes)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(scrollFX)},{passive:true});scrollFX();
 document.addEventListener('pointerdown',e=>{const b=e.target.closest('button,.btn,.appLink,.openTool,.f2f-action,.al-release-btn');if(!b)return;b.classList.add('al-clicked');setTimeout(()=>b.classList.remove('al-clicked'),170)},{passive:true});
 window.__adlandVisualRefresh={version:'2026.11-3d',ready:true,revealTargets:nodes.length,tiltTargets:reduced?0:tilts.length,reducedMotion:reduced};
 document.dispatchEvent(new CustomEvent('adland:visual-refresh-ready',{detail:window.__adlandVisualRefresh}));
})();