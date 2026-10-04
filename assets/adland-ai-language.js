(()=> {
const pairs={
"ADLAND AI TOOLS":["ابزارهای هوش مصنوعی AdLand","ADLAND AI TOOLS"],
"CREATIVE UTILITY LAB / BY ADLAND STUDIO":["آزمایشگاه ابزارهای خلاق / توسط AdLand Studio","CREATIVE UTILITY LAB / BY ADLAND STUDIO"],
"TOOLS":["ابزارها","TOOLS"],"WORKSPACE":["میزکار","WORKSPACE"],"ABOUT":["درباره","ABOUT"],
"ADLAND CREATIVE UTILITY LAB":["آزمایشگاه ابزارهای خلاق AdLand","ADLAND CREATIVE UTILITY LAB"],
"Build faster.":["سریع‌تر بساز.","Build faster."],"Think sharper.":["دقیق‌تر فکر کن.","Think sharper."],
"یک جعبه‌ابزار سریع برای prompt، متن و توسعه‌دهنده‌ها؛ طراحی‌شده برای اینکه کار واقعی را سریع‌تر انجام بدهی و کم‌تر بین ابزارهای مختلف جابه‌جا شوی.":["A fast toolbox for prompts, text and developer workflows, designed to help you get real work done with less tool switching.","یک جعبه‌ابزار سریع برای prompt، متن و توسعه‌دهنده‌ها؛ طراحی‌شده برای اینکه کار واقعی را سریع‌تر انجام بدهی و کم‌تر بین ابزارهای مختلف جابه‌جا شوی."],
"OPEN WORKSPACE ↓":["باز کردن میزکار ↓","OPEN WORKSPACE ↓"],"ADLAND STUDIO ↗":["ADLAND STUDIO ↗","ADLAND STUDIO ↗"],
"LOCAL-FIRST UTILITIES":["ابزارهای محلی","LOCAL-FIRST UTILITIES"],"NO INSTALL":["بدون نصب","NO INSTALL"],"PWA READY":["آماده نصب به‌صورت PWA","PWA READY"],"BILINGUAL":["دو زبانه","BILINGUAL"],
"AI × CODE":["هوش مصنوعی × کد","AI × CODE"],"ONE CONTROL SURFACE":["یک سطح کنترل","ONE CONTROL SURFACE"],
"01 / TOOL UNIVERSE":["۰۱ / جهان ابزارها","01 / TOOL UNIVERSE"],
"ابزارهایی که واقعاً کاربرد دارند.":["Tools that are actually useful.","ابزارهایی که واقعاً کاربرد دارند."],
"هر ابزار برای یک کار مشخص ساخته شده؛ از ساخت prompt تا JSON، Base64، UUID و تست Regex. بدون دانلود و بدون شلوغی.":["Each tool has a clear purpose: prompts, JSON, Base64, UUID and Regex testing, without downloads or clutter.","هر ابزار برای یک کار مشخص ساخته شده؛ از ساخت prompt تا JSON، Base64، UUID و تست Regex. بدون دانلود و بدون شلوغی."],
"Prompt Architect":["معمار Prompt","Prompt Architect"],"AI / PROMPT ENGINEERING":["هوش مصنوعی / مهندسی Prompt","AI / PROMPT ENGINEERING"],
"یک brief خام را به prompt ساختاریافته، قابل‌تکرار و آماده برای ابزار AI تبدیل کن.":["Turn a raw brief into a structured, repeatable prompt ready for AI tools.","یک brief خام را به prompt ساختاریافته، قابل‌تکرار و آماده برای ابزار AI تبدیل کن."],
"OPEN TOOL →":["باز کردن ابزار →","OPEN TOOL →"],
"JSON Lab":["آزمایشگاه JSON","JSON Lab"],"FORMAT / MINIFY / VALIDATE":["قالب‌بندی / فشرده‌سازی / اعتبارسنجی","FORMAT / MINIFY / VALIDATE"],
"JSON را فرمت، فشرده یا اعتبارسنجی کن و خطای دقیق را سریع پیدا کن.":["Format, minify or validate JSON and spot errors quickly.","JSON را فرمت، فشرده یا اعتبارسنجی کن و خطای دقیق را سریع پیدا کن."],
"Text Studio":["استودیوی متن","Text Studio"],"COUNT / CLEAN / CASE":["شمارش / پاک‌سازی / حروف","COUNT / CLEAN / CASE"],
"آمار متن، تمیزکاری فاصله‌ها و تبدیل حروف را در یک پنل سبک انجام بده.":["Count text, clean whitespace and change case in one light panel.","آمار متن، تمیزکاری فاصله‌ها و تبدیل حروف را در یک پنل سبک انجام بده."],
"Base64 Lab":["آزمایشگاه Base64","Base64 Lab"],"ENCODE / DECODE":["Encode / Decode","ENCODE / DECODE"],
"رشته‌های متنی را سریع encode/decode کن، بدون ارسال داده به سرور.":["Encode and decode text quickly without sending data to a server.","رشته‌های متنی را سریع encode/decode کن، بدون ارسال داده به سرور."],
"Regex Tester":["تستر Regex","Regex Tester"],"TEST / MATCH / GROUPS":["تست / تطبیق / گروه‌ها","TEST / MATCH / GROUPS"],
"عبارت منظم خودت را روی متن واقعی تست کن و matchها را ببین.":["Test a regular expression against real text and inspect matches.","عبارت منظم خودت را روی متن واقعی تست کن و matchها را ببین."],
"Developer Lab":["آزمایشگاه توسعه‌دهنده","Developer Lab"],"UUID / QUICK DATA":["UUID / داده سریع","UUID / QUICK DATA"],
"UUID تصادفی و داده‌های آماده برای prototype و تست سریع تولید کن.":["Generate random UUIDs and ready-to-use test data for prototypes.","UUID تصادفی و داده‌های آماده برای prototype و تست سریع تولید کن."],
"02 / WORKSPACE":["۰۲ / میزکار","02 / WORKSPACE"],"یک میز کار، چند ابزار.":["One workspace, many tools.","یک میز کار، چند ابزار."],
"تمام عملیات این صفحه در مرورگر انجام می‌شوند. برای قابلیت‌های AI سمت سرور، یک gateway امن در نسخه‌های بعدی اضافه می‌شود.":["These tools run in your browser. A secure server-side AI gateway can be added in a future version.","تمام عملیات این صفحه در مرورگر انجام می‌شوند. برای قابلیت‌های AI سمت سرور، یک gateway امن در نسخه‌های بعدی اضافه می‌شود."],
"LOCAL TOOLS ONLINE":["ابزارهای محلی فعال‌اند","LOCAL TOOLS ONLINE"],
"Prompt شما اینجا ساخته می‌شود…":["Your prompt will be built here…","Prompt شما اینجا ساخته می‌شود…"],
"BUILD PROMPT":["ساخت Prompt","BUILD PROMPT"],"COPY":["کپی","COPY"],
"نتیجه…":["Result…","نتیجه…"],
"FORMAT":["قالب‌بندی","FORMAT"],"MINIFY":["فشرده‌سازی","MINIFY"],
"TEXT":["متن","TEXT"],"UPPER":["حروف بزرگ","UPPER"],"lower":["حروف کوچک","lower"],"Title":["عنوان","Title"],"CLEAN SPACES":["پاک‌سازی فاصله‌ها","CLEAN SPACES"],
"CHARACTERS":["کاراکترها","CHARACTERS"],"WORDS":["کلمات","WORDS"],"READING":["زمان مطالعه","READING"],
"آمار متن به صورت زنده اینجا نمایش داده می‌شود.":["Live text statistics appear here.","آمار متن به صورت زنده اینجا نمایش داده می‌شود."],
"ENCODE":["رمزگذاری","ENCODE"],"DECODE":["رمزگشایی","DECODE"],"Hello AdLand":["Hello AdLand","Hello AdLand"],
"REGEX":["عبارت Regex","REGEX"],"FLAGS":["پرچم‌ها","FLAGS"],"TEST":["تست","TEST"],"AdLand builds tools. AdLand AI Tools are part of AdLand Studio.":["AdLand builds tools. AdLand AI Tools are part of AdLand Studio.","AdLand builds tools. AdLand AI Tools are part of AdLand Studio."],
"UUID":["UUID","UUID"],"GENERATE UUID":["ساخت UUID","GENERATE UUID"],"RANDOM TEST DATA":["داده تست تصادفی","RANDOM TEST DATA"],"GENERATE":["تولید","GENERATE"],
"03 / ADLAND STANDARD":["۰۳ / استاندارد AdLand","03 / ADLAND STANDARD"],"Tools, not clutter.":["ابزار، بدون شلوغی.","Tools, not clutter."],
"نسخه اول عمداً سریع و بدون وابستگی سنگین ساخته شده. هسته ابزارها local-first است؛ این پایه بعداً می‌تواند به حساب کاربری، workspace ابری، AI Gateway، اعتبار مصرفی و امکانات حرفه‌ای تبدیل شود.":["The first release is intentionally fast and lightweight. Its local-first core can grow into accounts, cloud workspaces, an AI gateway, usage credits and pro features.","نسخه اول عمداً سریع و بدون وابستگی سنگین ساخته شده. هسته ابزارها local-first است؛ این پایه بعداً می‌تواند به حساب کاربری، workspace ابری، AI Gateway، اعتبار مصرفی و امکانات حرفه‌ای تبدیل شود."],
"جایی که خلاقیت هیچ مرزی نمی‌شناسد.":["Where creativity has no limits.","جایی که خلاقیت هیچ مرزی نمی‌شناسد."],
"ADLAND STUDIO":["ADLAND STUDIO","ADLAND STUDIO"]
};
const root=document.documentElement,key='adland-language-v2';
const browser=()=>((navigator.languages&&navigator.languages[0]||navigator.language||'fa').toLowerCase().startsWith('en')?'en':'fa');
const stored=()=>{try{return localStorage.getItem(key)}catch(e){return null}};
const save=l=>{try{localStorage.setItem(key,l)}catch(e){}};
const originals=new WeakMap(),nodes=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
 const p=n.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
 const t=n.nodeValue.trim();return pairs[t]?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;
}});
while(walker.nextNode()){nodes.push(walker.currentNode);originals.set(walker.currentNode,walker.currentNode.nodeValue)}
const ph=[];document.querySelectorAll('input,textarea').forEach(el=>{const p=el.getAttribute('placeholder');if(p&&pairs[p])ph.push([el,p])});
let current=stored()||'fa';
function addButton(){
 let b=document.getElementById('lang')||document.getElementById('al-ai-lang');
 if(!b){const actions=document.querySelector('.actions');if(!actions)return;b=document.createElement('button');b.id='al-ai-lang';b.className='iconBtn';b.type='button';actions.insertBefore(b,actions.firstChild)}
 return b;
}
function set(lang,persist){
 nodes.forEach(n=>{const o=originals.get(n);if(!o)return;const k=o.trim(),pair=pairs[k];if(pair)n.nodeValue=o.replace(k,pair[lang==='fa'?0:1])});
 ph.forEach(([el,p])=>el.placeholder=pairs[p][lang==='fa'?0:1]);
 root.lang=lang==='fa'?'fa':'en';root.dir=lang==='fa'?'rtl':'ltr';root.classList.toggle('lang-fa',lang==='fa');root.classList.toggle('lang-en',lang==='en');
 const b=addButton();if(b)b.textContent=lang==='fa'?'FA → EN':'EN → FA';if(persist)save(lang);
}
set(current,false);const b=addButton();if(b)b.onclick=()=>{current=root.lang==='fa'?'en':'fa';set(current,true)};
})();