(()=> {
  const page=location.pathname.split('/').filter(Boolean).slice(-2, -1)[0] || location.pathname.split('/').filter(Boolean)[0];
  const maps={
    atlas:{
      "LOCAL FILE INTELLIGENCE":["هوشمندی فایل محلی","LOCAL FILE INTELLIGENCE"],
      "STUDIO":["استودیو","STUDIO"],"FEATURES":["ویژگی‌ها","FEATURES"],"DOWNLOAD":["دانلود","DOWNLOAD"],
      "FILES / SEARCH / INTELLIGENCE":["فایل / جست‌وجو / هوشمندی","FILES / SEARCH / INTELLIGENCE"],
      "Know where everything":["بدان هر چیز کجا قرار دارد.","Know where everything"],
      "lives.":["است.","lives."],
      "Atlas turns a folder into a searchable local map of your files. Understand space, find the right asset and jump straight into it without uploading your workspace.":["Atlas یک پوشه را به نقشه‌ای محلی و قابل‌جست‌وجو از فایل‌ها تبدیل می‌کند؛ فضا را بهتر بشناس، فایل درست را پیدا کن و بدون آپلود فضای کاری مستقیماً سراغ آن برو.","Atlas turns a folder into a searchable local map of your files. Understand space, find the right asset and jump straight into it without uploading your workspace."],
      "DOWNLOAD FOR WINDOWS":["دانلود برای ویندوز","DOWNLOAD FOR WINDOWS"],"EXPLORE LIVE DEMO":["نمایش زنده","EXPLORE LIVE DEMO"],
      "INDEX CAP":["سقف ایندکس","INDEX CAP"],"DATA PATH":["مسیر داده","DATA PATH"],
      "INTERACTIVE PREVIEW":["پیش‌نمایش تعاملی","INTERACTIVE PREVIEW"],"Explore your file map.":["نقشه فایل‌ها را بررسی کن.","Explore your file map."],
      "Type into the filter and watch the mock index narrow in real time.":["در فیلتر تایپ کن و کوچک‌شدن فهرست را هم‌زمان ببین.","Type into the filter and watch the mock index narrow in real time."],
      "FILE":["فایل","FILE"],"SIZE":["حجم","SIZE"],"TYPE":["نوع","TYPE"],"FOLDER":["پوشه","FOLDER"],"IMAGE":["تصویر","IMAGE"],"ARCHIVE":["آرشیو","ARCHIVE"],"TEXT":["متن","TEXT"],
      "FILTER INDEX":["فیلتر ایندکس","FILTER INDEX"],"project, image, pdf...":["project, image, pdf...","project, image, pdf..."],
      "FEATURE SYSTEM":["سیستم قابلیت‌ها","FEATURE SYSTEM"],"Built for the local machine.":["برای دستگاه محلی ساخته شده.","Built for the local machine."],
      "Fast navigation, useful summaries and no cloud dashboard required.":["ناوبری سریع، خلاصه‌های کاربردی و بدون نیاز به داشبورد ابری.","Fast navigation, useful summaries and no cloud dashboard required."],
      "Folder intelligence":["هوشمندی پوشه","Folder intelligence"],"Fast search":["جست‌وجوی سریع","Fast search"],"Storage insight":["بینش فضای ذخیره‌سازی","Storage insight"],"Open / reveal":["باز کردن / نمایش","Open / reveal"],"Motion aware":["هماهنگ با حرکت","Motion aware"],"Windows x64":["Windows x64","Windows x64"],
      "Scan a selected folder and turn it into a clean file inventory.":["یک پوشه انتخابی را بررسی و به فهرستی مرتب از فایل‌ها تبدیل می‌کند.","Scan a selected folder and turn it into a clean file inventory."],
      "Search names and relative paths across the current local index.":["نام‌ها و مسیرهای نسبی را در ایندکس محلی فعلی جست‌وجو می‌کند.","Search names and relative paths across the current local index."],
      "See file totals and broad categories at a glance.":["تعداد فایل‌ها و دسته‌بندی‌های اصلی را یک‌جا می‌بینی.","See file totals and broad categories at a glance."],
      "Jump directly to the native file or reveal it in Explorer.":["مستقیماً فایل را باز کن یا آن را در Explorer نمایش بده.","Jump directly to the native file or reveal it in Explorer."],
      "The site and app respect reduced-motion preferences.":["سایت و برنامه تنظیمات reduced-motion را رعایت می‌کنند.","The site and app respect reduced-motion preferences."],
      "Installer and portable builds are made for modern Windows.":["نسخه Installer و Portable برای ویندوزهای جدید آماده شده‌اند.","Installer and portable builds are made for modern Windows."],
      "RELEASE / 1.0.1":["انتشار / 1.0.1","RELEASE / 1.0.1"],"Atlas is ready.":["Atlas آماده است.","Atlas is ready."],"INSTALLER":["نصاب","INSTALLER"],"PORTABLE":["پرتابل","PORTABLE"],"RELEASE":["انتشار","RELEASE"],
      "Back to Studio ↗":["بازگشت به استودیو ↗","Back to Studio ↗"],"10 PRODUCTS · ADLAND STUDIO":["۱۰ محصول · ADLAND STUDIO","10 PRODUCTS · ADLAND STUDIO"],
      "APP UNIVERSE":["جهان برنامه‌ها","APP UNIVERSE"]
    },
    forge:{
      "DEVELOPER WORKBENCH":["میزکار توسعه‌دهنده","DEVELOPER WORKBENCH"],"STUDIO":["استودیو","STUDIO"],"LAB":["آزمایشگاه","LAB"],"DOWNLOAD":["دانلود","DOWNLOAD"],
      "JSON / TEXT / ENCODE":["JSON / متن / Encode","JSON / TEXT / ENCODE"],"Shape data.":["داده را شکل بده.","Shape data."],"Ship faster.":["سریع‌تر منتشر کن.","Ship faster."],
      "Forge is a compact local developer workbench for transforming JSON, analyzing text and preparing encoded data without leaving your desktop.":["Forge یک میزکار جمع‌وجور و محلی برای تبدیل JSON، تحلیل متن و آماده‌سازی داده‌های کدگذاری‌شده است؛ بدون خروج از دسکتاپ.","Forge is a compact local developer workbench for transforming JSON, analyzing text and preparing encoded data without leaving your desktop."],
      "DOWNLOAD FOR WINDOWS":["دانلود برای ویندوز","DOWNLOAD FOR WINDOWS"],"OPEN LAB":["باز کردن آزمایشگاه","OPEN LAB"],
      "LIVE LOCAL LAB":["آزمایشگاه زنده محلی","LIVE LOCAL LAB"],"Transform something.":["یک چیز را تبدیل کن.","Transform something."],"Paste JSON and use the tools below.":["JSON را وارد کن و از ابزارهای زیر استفاده کن.","Paste JSON and use the tools below."],
      "INPUT / JSON":["ورودی / JSON","INPUT / JSON"],"OUTPUT":["خروجی","OUTPUT"],"PRETTY":["مرتب‌سازی","PRETTY"],"MINIFY":["فشرده‌سازی","MINIFY"],"COUNT":["شمارش","COUNT"],"Ready.":["آماده.","Ready."],
      "FEATURE SYSTEM":["سیستم قابلیت‌ها","FEATURE SYSTEM"],"A focused toolchain.":["یک زنجیره‌ابزار متمرکز.","A focused toolchain."],
      "JSON transform":["تبدیل JSON","JSON transform"],"Text analysis":["تحلیل متن","Text analysis"],"Encode utilities":["ابزارهای Encode","Encode utilities"],"Keyboard flow":["جریان کیبورد","Keyboard flow"],"No cloud dashboard":["بدون داشبورد ابری","No cloud dashboard"],"Minimal chrome":["رابط مینیمال","Minimal chrome"],
      "Format or minify structured data instantly.":["داده ساختاریافته را فوراً مرتب یا فشرده کن.","Format or minify structured data instantly."],
      "Get quick character and token-style counts.":["تعداد کاراکتر و شمارش شبیه توکن را سریع ببین.","Get quick character and token-style counts."],
      "Prepare local data for URLs and transport.":["داده محلی را برای URL و انتقال آماده کن.","Prepare local data for URLs and transport."],
      "Use Ctrl+Enter for a rapid transform loop.":["برای تبدیل سریع از Ctrl+Enter استفاده کن.","Use Ctrl+Enter for a rapid transform loop."],
      "The core toolchain is designed to run locally.":["هسته زنجیره‌ابزار برای اجرای محلی طراحی شده است.","The core toolchain is designed to run locally."],
      "A clean workspace keeps the content in focus.":["میزکار تمیز، محتوا را در مرکز توجه نگه می‌دارد.","A clean workspace keeps the content in focus."],
      "RELEASE / 1.0.1":["انتشار / 1.0.1","RELEASE / 1.0.1"],"Forge is ready.":["Forge آماده است.","Forge is ready."],"INSTALLER":["نصاب","INSTALLER"],"PORTABLE":["پرتابل","PORTABLE"],"RELEASE":["انتشار","RELEASE"],"Back to Studio ↗":["بازگشت به استودیو ↗","Back to Studio ↗"],"10 PRODUCTS · ADLAND STUDIO":["۱۰ محصول · ADLAND STUDIO","10 PRODUCTS · ADLAND STUDIO"],"APP UNIVERSE":["جهان برنامه‌ها","APP UNIVERSE"]
    },
    prism:{
      "COLOR INTELLIGENCE LAB":["آزمایشگاه هوشمندی رنگ","COLOR INTELLIGENCE LAB"],"STUDIO":["استودیو","STUDIO"],"LAB":["آزمایشگاه","LAB"],"DOWNLOAD":["دانلود","DOWNLOAD"],
      "COLOR / CONTRAST / GRADIENT":["رنگ / کنتراست / گرادیان","COLOR / CONTRAST / GRADIENT"],"Stop guessing.":["حدس نزن.","Stop guessing."],"Start seeing.":["شروع به دیدن کن.","Start seeing."],
      "Prism is a local color intelligence lab for building palettes, checking contrast and exploring gradients with precision.":["Prism یک آزمایشگاه محلی برای ساخت پالت، بررسی کنتراست و کاوش دقیق گرادیان‌هاست.","Prism is a local color intelligence lab for building palettes, checking contrast and exploring gradients with precision."],
      "DOWNLOAD FOR WINDOWS":["دانلود برای ویندوز","DOWNLOAD FOR WINDOWS"],"OPEN COLOR LAB":["باز کردن آزمایشگاه رنگ","OPEN COLOR LAB"],
      "LIVE COLOR LAB":["آزمایشگاه زنده رنگ","LIVE COLOR LAB"],"Build a palette.":["یک پالت بساز.","Build a palette."],"Enter a color and the lab updates immediately.":["یک رنگ وارد کن تا آزمایشگاه فوراً به‌روزرسانی شود.","Enter a color and the lab updates immediately."],
      "ACTIVE HEX":["HEX فعال","ACTIVE HEX"],"WHITE CONTRAST":["کنتراست روی سفید","WHITE CONTRAST"],"BLACK CONTRAST":["کنتراست روی مشکی","BLACK CONTRAST"],"RANDOM":["تصادفی","RANDOM"],"COPY HEX":["کپی HEX","COPY HEX"],
      "FEATURE SYSTEM":["سیستم قابلیت‌ها","FEATURE SYSTEM"],"Color with a purpose.":["رنگ با هدف.","Color with a purpose."],
      "Contrast ratio":["نسبت کنتراست","Contrast ratio"],"Palette generation":["ساخت پالت","Palette generation"],"Gradient lab":["آزمایشگاه گرادیان","Gradient lab"],"Instant copy":["کپی فوری","Instant copy"],"Responsive canvas":["بوم واکنش‌گرا","Responsive canvas"],"Local-first":["محلی‌محور","Local-first"],
      "See how the active color behaves on white and black.":["ببین رنگ فعال روی سفید و مشکی چه رفتاری دارد.","See how the active color behaves on white and black."],
      "Light, dark and complementary steps are generated locally.":["طیف‌های روشن، تیره و مکمل به‌صورت محلی ساخته می‌شوند.","Light, dark and complementary steps are generated locally."],
      "Explore a living gradient around the active color.":["یک گرادیان پویا پیرامون رنگ فعال را بررسی کن.","Explore a living gradient around the active color."],
      "Copy the active HEX value directly to the clipboard.":["مقدار HEX فعال را مستقیماً در کلیپ‌بورد کپی کن.","Copy the active HEX value directly to the clipboard."],
      "The lab remains usable from a compact viewport to wide screens.":["آزمایشگاه از صفحه‌های کوچک تا نمایشگرهای عریض قابل استفاده می‌ماند.","The lab remains usable from a compact viewport to wide screens."],
      "Core color calculations happen on the device.":["محاسبات اصلی رنگ روی خود دستگاه انجام می‌شوند.","Core color calculations happen on the device."],
      "RELEASE / 1.0.1":["انتشار / 1.0.1","RELEASE / 1.0.1"],"Prism is ready.":["Prism آماده است.","Prism is ready."],"INSTALLER":["نصاب","INSTALLER"],"PORTABLE":["پرتابل","PORTABLE"],"RELEASE":["انتشار","RELEASE"],"Back to Studio ↗":["بازگشت به استودیو ↗","Back to Studio ↗"],"10 PRODUCTS · ADLAND STUDIO":["۱۰ محصول · ADLAND STUDIO","10 PRODUCTS · ADLAND STUDIO"],"APP UNIVERSE":["جهان برنامه‌ها","APP UNIVERSE"]
    }
  };
  const map=maps[page];if(!map)return;
  const root=document.documentElement,key='adland-language-v2';
  const browser=()=>((navigator.languages&&navigator.languages[0]||navigator.language||'fa').toLowerCase().startsWith('en')?'en':'fa');
  const stored=()=>{try{return localStorage.getItem(key)}catch(e){return null}};
  const save=l=>{try{localStorage.setItem(key,l)}catch(e){}};
  const originals=new WeakMap();
  const nodes=[];
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
    const p=n.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
    const t=n.nodeValue.trim();if(map[t]){nodes.push(n);return NodeFilter.FILTER_ACCEPT}return NodeFilter.FILTER_SKIP;
  }});
  while(w.nextNode());
  nodes.forEach(n=>originals.set(n,n.nodeValue));
  const ph=[];
  document.querySelectorAll('input,textarea').forEach(el=>{const p=el.getAttribute('placeholder');if(p&&map[p])ph.push([el,p])});
  function addLangButton(){
    let b=document.getElementById('al-language');
    if(!b){const existing=document.getElementById('lang')||document.getElementById('langBtn');if(existing)return existing;const nav=document.querySelector('.nav');if(!nav)return;b=document.createElement('button');b.id='al-language';b.type='button';nav.insertBefore(b,nav.firstChild);
      const s=document.createElement('style');s.textContent='#al-language{height:33px;padding:0 10px;border:1px solid #ffffff12;border-radius:9px;background:transparent;color:#a8b0b5;font:800 11px/1 Manrope,Vazirmatn,sans-serif;cursor:pointer}#al-language:hover{border-color:#e6c96c44;color:#fff}';
      document.head.appendChild(s);
    }
    return b;
  }
  function set(lang,persist){
    nodes.forEach(n=>{const original=originals.get(n), pair=map[original];if(pair)n.nodeValue=n.nodeValue.replace(n.nodeValue.trim(),pair[lang==='fa'?0:1])});
    ph.forEach(([el,p])=>el.placeholder=map[p][lang==='fa'?0:1]);
    root.lang=lang==='fa'?'fa':'en';root.dir=lang==='fa'?'rtl':'ltr';root.classList.toggle('lang-fa',lang==='fa');root.classList.toggle('lang-en',lang==='en');
    const b=addLangButton();if(b)b.textContent=lang==='fa'?'FA → EN':'EN → FA';
    if(persist)save(lang);
  }
  let current=stored()||'fa';
  set(current,false);
  const b=addLangButton();if(b&&b.id==='al-language')b.onclick=()=>{current=root.lang==='fa'?'en':'fa';set(current,true)};document.addEventListener('adland:language',e=>{current=e.detail?.lang||current;set(current,false)});
})();