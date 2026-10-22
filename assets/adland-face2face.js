/* Face2Face discovery panel + low-cost motion polish for the AdLand Studio homepage. */
(function(){
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function installStyle(){
    if(document.getElementById('adland-face2face-style'))return;
    var style=document.createElement('style');style.id='adland-face2face-style';
    style.textContent=
      '.f2f-highlight{--f2fx:50%;--f2fy:50%;position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(190px,.75fr);gap:22px;align-items:center;margin:4px 0 18px;padding:clamp(20px,3.2vw,34px);overflow:hidden;border:1px solid #b9a5ff30;border-radius:25px;background:radial-gradient(circle at var(--f2fx) var(--f2fy),#a99aff19,transparent 31%),linear-gradient(125deg,#a99aff0d,#7bf6df06 60%,#ffffff02);box-shadow:0 22px 85px #0005;transition:border-color .35s,box-shadow .35s,transform .35s}.f2f-highlight:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(120deg,transparent 18%,#ffffff06 42%,transparent 65%);transform:translateX(-70%);animation:f2f-sheen 8s ease-in-out infinite}.f2f-highlight:hover{border-color:#b9a5ff62;box-shadow:0 35px 110px #0008,0 0 55px #a99aff0c}.f2f-kicker{display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border:1px solid #a99aff37;border-radius:999px;background:#a99aff0c;color:#c9beff;font:800 10px/1.2 Manrope,Vazirmatn,sans-serif;letter-spacing:.1em}.f2f-kicker i{width:6px;height:6px;border-radius:50%;background:#7bf6df;box-shadow:0 0 15px #7bf6df;animation:f2f-pulse 1.8s ease-in-out infinite}.f2f-highlight h3{margin:15px 0 8px;color:#f5f0ff;font-size:clamp(25px,3.5vw,38px);letter-spacing:-.05em}.f2f-highlight p{max-width:680px;margin:0;color:#89959d;font-size:12px;line-height:1.95}.f2f-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.f2f-action{display:inline-flex;min-height:40px;align-items:center;justify-content:center;gap:7px;padding:0 13px;border:1px solid #b9a5ff3b;border-radius:11px;background:#a99aff0c;color:#d9d0ff;font:800 11px Manrope,Vazirmatn,sans-serif;transition:transform .25s,border-color .25s,background .25s}.f2f-action.primary{background:linear-gradient(135deg,#d6c6ff,#88dcf5);color:#131323;border-color:transparent}.f2f-action:hover{transform:translateY(-3px);border-color:#cfc2ff88;background-color:#ffffff0c}.f2f-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:17px}.f2f-tags span{padding:6px 9px;border:1px solid #ffffff10;border-radius:999px;background:#ffffff04;color:#88939e;font-size:10px}.f2f-stage{position:relative;min-height:190px;display:grid;place-items:center;overflow:hidden}.f2f-orbit{position:absolute;width:165px;aspect-ratio:1;border:1px solid #b9a5ff3b;border-radius:50%;animation:f2f-orbit 17s linear infinite}.f2f-orbit:before,.f2f-orbit:after{content:"";position:absolute;inset:17px;border:1px dashed #7bf6df28;border-radius:50%}.f2f-orbit:after{inset:36px;border-style:solid;border-color:#b9a5ff22;animation:f2f-orbit 12s linear infinite reverse}.f2f-device{position:relative;width:130px;height:92px;border:1px solid #d8ccff5c;border-radius:17px;background:linear-gradient(140deg,#ffffff1b,#ffffff04);backdrop-filter:blur(17px);box-shadow:0 18px 70px #a99aff17;display:grid;place-items:center;transform:perspective(500px) rotateY(-9deg);animation:f2f-float 4.5s ease-in-out infinite}.f2f-screen{width:84%;height:70%;border-radius:10px;background:linear-gradient(135deg,#b8a6ff38,#7bf6df14);border:1px solid #ffffff15;display:flex;align-items:center;justify-content:center;gap:8px}.f2f-person{width:28px;height:34px;position:relative;border-radius:12px 12px 9px 9px;background:linear-gradient(#d6c6ff,#987fff);box-shadow:0 0 26px #a99aff2c}.f2f-person:before{content:"";position:absolute;width:13px;height:13px;left:7px;top:-7px;border-radius:50%;background:#f0ddff;border:1px solid #fff8}.f2f-person.second{background:linear-gradient(#a4efff,#69cce8);transform:translateY(5px)}.f2f-dot{position:absolute;width:8px;height:8px;border-radius:50%;background:#7bf6df;box-shadow:0 0 17px #7bf6df;top:23%;right:23%;animation:f2f-pulse 2s infinite}.f2f-app-card{border-color:#b9a5ff2d;background:radial-gradient(circle at var(--cx,50%) var(--cy,50%),#a99aff15,transparent 42%),#ffffff02}.f2f-app-card:after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(130deg,#b9a5ff09,transparent 40%,#7bf6df08)}.f2f-app-card .appIcon{border-color:#b9a5ff55;box-shadow:0 0 30px #a99aff15}.f2f-app-card .appTag{color:#d8ccff;border-color:#b9a5ff42;background:#a99aff0c}.f2f-app-card .appLink{border-color:#b9a5ff40}.f2f-app-card .appLink:hover{background:#a99aff17;border-color:#cfc2ff85}.f2f-app-card .version{color:#c9beff}.f2f-ready{animation:f2f-enter .65s cubic-bezier(.2,.8,.2,1) both}@keyframes f2f-orbit{to{transform:rotate(360deg)}}@keyframes f2f-float{0%,100%{translate:0 0}50%{translate:0 -8px}}@keyframes f2f-pulse{0%,100%{opacity:.65;scale:.85}50%{opacity:1;scale:1.12}}@keyframes f2f-sheen{0%,35%{transform:translateX(-80%)}65%,100%{transform:translateX(100%)}}@keyframes f2f-enter{from{opacity:0;translate:0 14px;filter:blur(5px)}to{opacity:1;translate:0 0;filter:blur(0)}}@media(max-width:720px){.f2f-highlight{grid-template-columns:1fr}.f2f-stage{min-height:150px;grid-row:1}.f2f-orbit{width:135px}.f2f-device{scale:.9}.f2f-highlight p{font-size:11px}.f2f-actions .f2f-action{flex:1}}@media(prefers-reduced-motion:reduce){.f2f-highlight:before,.f2f-kicker i,.f2f-orbit,.f2f-orbit:after,.f2f-device,.f2f-dot,.f2f-ready{animation:none!important;transition:none!important;filter:none!important;translate:none!important}}';
    document.head.appendChild(style);
  }
  function text(fa,en){return (document.documentElement.lang||'fa').toLowerCase().indexOf('en')===0?en:fa;}
  function installHighlight(){
    var apps=document.querySelector('#apps');if(!apps||document.getElementById('face2face-highlight'))return;
    var header=apps.querySelector('.sectionHeader');if(!header)return;
    var band=document.createElement('div');band.id='face2face-highlight';band.className='f2f-highlight glass';
    band.setAttribute('aria-labelledby','f2f-highlight-title');
    band.innerHTML='<div class="f2f-copy"><span class="f2f-kicker"><i></i><span data-fa="محصول جدید · میزکار ویندوز" data-en="NEW PRODUCT · WINDOWS DESKTOP">محصول جدید · میزکار ویندوز</span></span><h3 id="f2f-highlight-title">Face2Face</h3><p data-fa="یک فضای جلسه‌ی زنده برای تیم‌ها و دوستان: گروه و اتاق بساز، با تصویر و صدا صحبت کن، فایل و کد به اشتراک بگذار و ورودی و خروجی دستگاه‌ها را خودت انتخاب کن." data-en="A live meeting space for teams and friends: create rooms and groups, talk with camera and audio, share files and code, and choose your own input and output devices.">یک فضای جلسه‌ی زنده برای تیم‌ها و دوستان: گروه و اتاق بساز، با تصویر و صدا صحبت کن، فایل و کد به اشتراک بگذار و ورودی و خروجی دستگاه‌ها را خودت انتخاب کن.</p><div class="f2f-tags"><span data-fa="تماس WebRTC" data-en="WebRTC calls">تماس WebRTC</span><span data-fa="اشتراک فایل و کد" data-en="File + code sharing">اشتراک فایل و کد</span><span data-fa="ویندوز ۱۰/۱۱" data-en="Windows 10/11">ویندوز ۱۰/۱۱</span></div><div class="f2f-actions"><a class="f2f-action primary" href="face2face/" data-fa="دیدن Face2Face ↗" data-en="EXPLORE FACE2FACE ↗">دیدن Face2Face ↗</a><a class="f2f-action" href="face2face/#setup" download data-fa="راهنمای ساخت" data-en="BUILD GUIDE">راهنمای ساخت</a></div></div><div class="f2f-stage" aria-hidden="true"><span class="f2f-orbit"></span><span class="f2f-dot"></span><span class="f2f-device"><span class="f2f-screen"><i class="f2f-person"></i><i class="f2f-person second"></i></span></span></div>';
    header.insertAdjacentElement('afterend',band);
    band.classList.add('f2f-ready');
  }
  function polishCards(){
    if(reduce)return;
    document.querySelectorAll('#apps .app').forEach(function(card){
      if(card.dataset.f2fMotion==='1')return;card.dataset.f2fMotion='1';
      card.addEventListener('pointermove',function(e){
        if(e.pointerType==='touch')return;
        var r=card.getBoundingClientRect(),x=((e.clientX-r.left)/Math.max(1,r.width))*100,y=((e.clientY-r.top)/Math.max(1,r.height))*100;
        card.style.setProperty('--cx',x+'%');card.style.setProperty('--cy',y+'%');
      },{passive:true});
    });
    var target=document.querySelector('#face2face-highlight');
    if(target){
      target.addEventListener('pointermove',function(e){
        if(e.pointerType==='touch')return;
        var r=target.getBoundingClientRect();
        target.style.setProperty('--f2fx',((e.clientX-r.left)/Math.max(1,r.width))*100+'%');
        target.style.setProperty('--f2fy',((e.clientY-r.top)/Math.max(1,r.height))*100+'%');
      },{passive:true});
    }
  }
  function sync(){
    var l=(document.documentElement.lang||'fa').toLowerCase().indexOf('en')===0?'en':'fa';
    document.querySelectorAll('#face2face-highlight [data-fa][data-en]').forEach(function(el){el.innerHTML=el.getAttribute('data-'+l);});
    if(document.querySelector('#face2face-highlight'))document.querySelector('#face2face-highlight').setAttribute('dir',l==='fa'?'rtl':'ltr');
  }
  function init(){installStyle();installHighlight();polishCards();sync();document.addEventListener('adland:language',sync);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();