/* Shared reveal controller for all AdLand microsites */
(()=>{
 'use strict';
 const root=document.documentElement;
 let low=false;try{low=localStorage.getItem('adland-motion')==='low'}catch(_){}
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const targets=[...document.querySelectorAll('.app,.tool,.course,.project,.teamCard,.workspace,.feature,.featureCard,.glassCard,.faqItem,.story,.finalCard,.al-panel,.al-card,.toolCard')];
 if(!targets.length){root.classList.add('al-motion-ready');return}
 if(reduced||low||!('IntersectionObserver'in window)){targets.forEach(el=>el.classList.add('al-global-visible'));root.classList.add('al-motion-ready');return}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('al-global-visible');observer.unobserve(entry.target)}}),{threshold:.07,rootMargin:'0px 0px -35px 0px'});
 targets.forEach((el,i)=>{if(el.classList.contains('al-global-reveal'))return;el.classList.add('al-global-reveal');el.style.setProperty('--al-reveal-delay',((i%4)*65)+'ms');observer.observe(el)});
 root.classList.add('al-motion-ready');
})();