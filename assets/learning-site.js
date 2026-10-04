(()=>{const root=document.documentElement;let lang=(localStorage.getItem('adland-language-v2')||((navigator.language||'fa').toLowerCase().startsWith('en')?'en':'fa')).toLowerCase().startsWith('en')?'en':'fa';
const apply=()=>{
  root.lang=lang;root.dir=lang==='fa'?'rtl':'ltr';
  document.querySelectorAll('[data-fa]').forEach(el=>{const v=lang==='fa'?el.dataset.fa:el.dataset.en;if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=v;else el.innerHTML=v});
  const b=document.querySelector('#langToggle');if(b)b.textContent=lang==='fa'?'FA → EN':'EN → FA';
  const top=document.querySelector('#learnBackTop');if(top)top.setAttribute('aria-label',lang==='fa'?'بازگشت به بالا':'Back to top');
};
document.querySelector('#langToggle')?.addEventListener('click',()=>{lang=lang==='fa'?'en':'fa';localStorage.setItem('adland-language-v2',lang);apply()});
document.addEventListener('pointermove',e=>{root.style.setProperty('--mx',e.clientX+'px');root.style.setProperty('--my',e.clientY+'px')},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.08});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));
const style=document.createElement('style');style.textContent='#learnProgress{position:fixed;top:0;left:0;width:0;height:3px;background:linear-gradient(90deg,#d9b55d,#f6df9a,#8ff9dc);z-index:9999;box-shadow:0 0 16px #d9b55d66}#learnBackTop{position:fixed;left:18px;bottom:18px;width:43px;height:43px;border:1px solid #ffffff14;border-radius:13px;background:#091016e8;color:#d9b55d;opacity:0;visibility:hidden;transform:translateY(10px);transition:.25s;z-index:9998;cursor:pointer;font-size:17px;font-weight:900;backdrop-filter:blur(18px)}#learnBackTop.show{opacity:1;visibility:visible;transform:none}#learnBackTop:hover{transform:translateY(-3px);border-color:#d9b55d44}@media(max-width:650px){#learnBackTop{left:10px;bottom:10px;width:40px;height:40px}}';document.head.appendChild(style);
const progress=document.createElement('div');progress.id='learnProgress';document.body.appendChild(progress);
const top=document.createElement('button');top.id='learnBackTop';top.type='button';top.textContent='↑';document.body.appendChild(top);top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';top.classList.toggle('show',scrollY>520)};addEventListener('scroll',update,{passive:true});update();
apply()})();