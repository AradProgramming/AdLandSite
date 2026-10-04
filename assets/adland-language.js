(()=> {
  const root=document.documentElement;
  const faNodes=()=>[...document.querySelectorAll('[data-fa][data-en]')];
  const hasBilingual=()=>faNodes().length>0;
  const key='adland-language-v2';
  function browserLang(){
    const l=(navigator.languages&&navigator.languages[0]||navigator.language||'fa').toLowerCase();
    return l.startsWith('en')?'en':'fa';
  }
  function save(lang){try{localStorage.setItem(key,lang)}catch(e){}}
  function stored(){try{return localStorage.getItem(key)}catch(e){return null}}
  function setAttrs(lang){
    root.lang=lang==='fa'?'fa':'en';
    root.dir=lang==='fa'?'rtl':'ltr';
    root.classList.toggle('lang-fa',lang==='fa');
    root.classList.toggle('lang-en',lang==='en');
    const btn=document.getElementById('lang');
    if(btn) btn.textContent=lang==='fa'?'FA → EN':'EN → FA';
  }
  function apply(lang,persist){
    if(!hasBilingual()){setAttrs((root.lang||'en').toLowerCase().startsWith('fa')?'fa':'en');return}
    faNodes().forEach(el=>{
      const html=lang==='fa'?el.dataset.fa:el.dataset.en;
      if(html!=null) el.innerHTML=html;
    });
    document.querySelectorAll('[data-fa-placeholder][data-en-placeholder]').forEach(el=>{
      el.placeholder=lang==='fa'?el.dataset.faPlaceholder:el.dataset.enPlaceholder;
    });
    setAttrs(lang);
    if(persist) save(lang);
    document.dispatchEvent(new CustomEvent('adland:language',{detail:{lang}}));
  }
  const initial=(stored()||browserLang());
  apply(hasBilingual()?initial:(root.lang||'en').startsWith('fa')?'fa':'en',false);
  const btn=document.getElementById('lang');
  if(btn){
    btn.onclick=()=>{
      const next=root.lang==='fa'?'en':'fa';
      apply(next,true);
    };
  }
  document.querySelectorAll('[data-lang-link]').forEach(a=>a.addEventListener('click',()=>save(a.dataset.langLink)));
})();