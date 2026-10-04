(()=>{
  const root=document.documentElement;
  const KEY='adland-language-v2';
  const TG='https://t.me/Arad_unk';
  const BALE='https://ble.ir/AdLandStudio';
  const products={
    'ai-tools':{name:'AdLand AI Tools',fa:'ابزارهای هوش مصنوعی AdLand',kind:'web',file:'AdLand-AI-Tools'},
    nexus:{name:'Nexus',fa:'Nexus',version:'1.4.4',file:'AdLand-Nexus'},canvas:{name:'Canvas',fa:'Canvas',version:'1.1.1',file:'AdLand-Canvas'},pulse:{name:'Pulse',fa:'Pulse',version:'1.0.3',file:'AdLand-Pulse'},frame:{name:'Frame',fa:'Frame',version:'1.1.3',file:'AdLand-Frame'},atlas:{name:'Atlas',fa:'Atlas',version:'1.0.1',file:'AdLand-Atlas'},forge:{name:'Forge',fa:'Forge',version:'1.0.1',file:'AdLand-Forge'},prism:{name:'Prism',fa:'Prism',version:'1.0.1',file:'AdLand-Prism'},relay:{name:'Relay',fa:'Relay',version:'1.0.0',file:'AdLand-Relay'},echo:{name:'Echo',fa:'Echo',version:'1.0.0',file:'AdLand-Echo'},chrono:{name:'Chrono',fa:'Chrono',version:'1.0.0',file:'AdLand-Chrono'},orbit:{name:'Orbit',fa:'Orbit',version:'1.0.2',file:'AdLand-Orbit'}
  };
  const path=location.pathname.split('/').filter(Boolean);
  const slug=path[path.length-1]&&path[path.length-1]!=='index.html'?path[path.length-1]:(path[path.length-2]||'home');
  const product=products[slug]||null;
  const lang=()=>((localStorage.getItem(KEY)||root.lang||'fa').toLowerCase().startsWith('en')?'en':'fa');
  const text=(fa,en)=>lang()==='fa'?fa:en;
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function style(){
    if(document.getElementById('al-ecosystem-style'))return;
    const s=document.createElement('style');s.id='al-ecosystem-style';s.textContent=`
      .al-platform-rail{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0;align-items:stretch}.al-platform{min-width:190px;flex:1;padding:13px 14px;border:1px solid #ffffff10;border-radius:15px;background:linear-gradient(145deg,#ffffff07,#ffffff02);box-shadow:0 14px 45px #0005}.al-platform b{display:block;font-size:13px;line-height:1.5;color:#f1ede3}.al-platform small{display:block;margin-top:4px;font-size:11px;line-height:1.6;color:#7e898f}.al-platform.mac{border-color:#e7d59c28;background:linear-gradient(145deg,#d9b55d10,#ffffff02)}.al-platform .al-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-inline-end:7px;background:#8ff9dc;box-shadow:0 0 12px #8ff9dc66}.al-platform.mac .al-dot{background:#d9b55d;box-shadow:0 0 12px #d9b55d66}.al-mac-action{height:40px!important;min-height:40px!important;padding:0 13px;border:1px solid #d9b55d35;border-radius:11px;background:#d9b55d08;color:#d9b55d;font:800 12px/1.2 Manrope,Vazirmatn,sans-serif;cursor:pointer;opacity:.95}.al-mac-action.disabled,.al-mac-card.disabled{cursor:not-allowed;opacity:.55;pointer-events:none}.al-mac-action:disabled{cursor:not-allowed}.al-mac-panel{margin-top:18px;padding:22px;border-radius:24px;border:1px solid #d9b55d25;background:radial-gradient(circle at 78% 25%,#d9b55d16,transparent 34%),linear-gradient(145deg,#ffffff08,#ffffff02);box-shadow:0 30px 100px #0009;position:relative;overflow:hidden}.al-mac-panel:after{content:'⌘';position:absolute;inset:auto 22px 6px auto;font-size:110px;line-height:1;color:#d9b55d0b;pointer-events:none}.al-mac-panel small{color:#d9b55d;font-weight:800;font-size:10px;letter-spacing:.12em}.al-mac-panel h3{margin:6px 0 7px;font-size:25px;line-height:1.35}.al-mac-panel p{margin:0;max-width:820px;color:#7e898f;font-size:13px;line-height:1.9}.al-mac-panel .al-mac-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.al-mac-pill{padding:7px 9px;border:1px solid #ffffff10;border-radius:999px;color:#a2abb0;background:#ffffff03;font-size:11px}.al-card-platforms{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.al-card-platform{padding:6px 8px;border-radius:999px;border:1px solid #ffffff0d;background:#ffffff03;color:#78858c;font:700 10px/1.2 Manrope,Vazirmatn,sans-serif}.al-card-platform.mac{border-color:#d9b55d22;color:#d9b55d}
      #al-support-launcher{position:fixed;right:18px;bottom:18px;z-index:99998;border:1px solid #d9b55d42;border-radius:15px;background:#090d12ef;color:#e6cf91;backdrop-filter:blur(22px);box-shadow:0 22px 80px #000b;padding:11px 14px;display:flex;align-items:center;gap:9px;font:900 12px/1.1 Manrope,Vazirmatn,sans-serif;cursor:pointer;transition:.25s}#al-support-launcher:hover{transform:translateY(-3px);box-shadow:0 30px 100px #000c}#al-support-launcher i{width:7px;height:7px;border-radius:50%;background:#8ff9dc;box-shadow:0 0 13px #8ff9dc;display:block}#al-support{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:#020305c7;backdrop-filter:blur(18px);opacity:0;visibility:hidden;transition:.25s}#al-support.open{opacity:1;visibility:visible}.al-support-card{width:min(920px,calc(100% - 24px));max-height:min(86vh,860px);overflow:auto;border:1px solid #d9b55d35;border-radius:26px;background:#090e14fa;box-shadow:0 40px 140px #000d;padding:20px}.al-support-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.al-support-kicker{color:#d9b55d;font-size:10px;font-weight:900;letter-spacing:.14em}.al-support-head h2{margin:5px 0 4px;font-size:30px;line-height:1.25}.al-support-head p{margin:0;color:#7f8b92;font-size:13px;line-height:1.75}.al-support-close{width:36px;height:36px;border:1px solid #ffffff12;border-radius:10px;background:#ffffff05;color:#a8b0b4;font-size:20px;cursor:pointer}.al-support-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px;margin-top:16px}.al-support-section{padding:16px;border:1px solid #ffffff0d;border-radius:19px;background:#ffffff03}.al-support-section h3{margin:0 0 10px;font-size:17px}.al-support-section p{color:#7f8b92;font-size:12px;line-height:1.8}.al-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px}.al-field{display:grid;gap:6px}.al-field.full{grid-column:1/-1}.al-field label{color:#a2abb0;font-size:11px;font-weight:800}.al-field input,.al-field textarea,.al-field select{width:100%;border:1px solid #ffffff10;border-radius:11px;background:#05080c;color:#f0ede6;padding:10px 11px;outline:0;font-size:13px;line-height:1.6}.al-field textarea{min-height:150px;resize:vertical}.al-field input:focus,.al-field textarea:focus,.al-field select:focus{border-color:#d9b55d55;box-shadow:0 0 0 3px #d9b55d0b}.al-support-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.al-support-btn{min-height:40px;padding:0 13px;border:1px solid #ffffff11;border-radius:10px;background:#ffffff04;color:#acb4b8;font:800 12px/1 Manrope,Vazirmatn,sans-serif;cursor:pointer}.al-support-btn.primary{background:linear-gradient(135deg,#d9b55d,#aa7c2b);color:#151005;border:0}.al-support-btn.link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.al-support-status{margin-top:9px;min-height:22px;color:#8c989e;font-size:11px;line-height:1.7}.al-support-ref{margin-top:9px;padding:9px 11px;border-radius:10px;border:1px dashed #d9b55d25;color:#d2bc7a;background:#d9b55d06;font:800 11px/1.5 ui-monospace,monospace}.al-support-note{margin-top:10px;padding:10px 11px;border-radius:11px;background:#8ff9dc08;border:1px solid #8ff9dc18;color:#82a9a1;font-size:11px;line-height:1.75}@media(max-width:760px){.al-support-grid{grid-template-columns:1fr}.al-fields{grid-template-columns:1fr}.al-field.full{grid-column:auto}.al-support-head h2{font-size:24px}.al-support-card{padding:14px}.al-platform{min-width:0}.al-mac-panel h3{font-size:21px}#al-support-launcher{right:10px;bottom:10px}}@media(prefers-reduced-motion:reduce){#al-support-launcher,.al-platform,.al-mac-panel{transition:none!important}}
    `;document.head.appendChild(s);
  }
  function setLocalized(scope=document){const l=lang();scope.querySelectorAll?.('[data-fa][data-en]').forEach(el=>el.innerHTML=l==='fa'?el.dataset.fa:el.dataset.en);scope.querySelectorAll?.('[data-fa-placeholder][data-en-placeholder]').forEach(el=>el.placeholder=l==='fa'?el.dataset.faPlaceholder:el.dataset.enPlaceholder);const title=scope.querySelector?.('[data-al-support-title]');if(title)title.textContent=text('پشتیبانی AdLand','AdLand Support Center')}
  function support(){
    if(document.getElementById('al-support-launcher'))return;style();
    const launcher=document.createElement('button');launcher.id='al-support-launcher';launcher.type='button';launcher.innerHTML='<i></i><span data-fa="ارتباط با پشتیبانی" data-en="Contact support">ارتباط با پشتیبانی</span>';document.body.appendChild(launcher);
    const panel=document.createElement('div');panel.id='al-support';panel.setAttribute('aria-hidden','true');panel.innerHTML=`<div class="al-support-card" role="dialog" aria-modal="true" aria-labelledby="al-support-title"><div class="al-support-head"><div><div class="al-support-kicker">ADLAND / SUPPORT</div><h2 id="al-support-title" data-al-support-title>پشتیبانی AdLand</h2><p data-fa="پیام خودت را بنویس، متن آماده می‌شود و بعد می‌توانی آن را از کانال رسمی برای AdLand بفرستی." data-en="Write your message, then copy the prepared text and send it through an official AdLand channel.">پیام خودت را بنویس، متن آماده می‌شود و بعد می‌توانی آن را از کانال رسمی برای AdLand بفرستی.</p></div><button class="al-support-close" id="al-support-close" type="button" aria-label="Close">×</button></div><div class="al-support-grid"><section class="al-support-section"><h3 data-fa="پیام کاربر" data-en="Visitor message">پیام کاربر</h3><div class="al-fields"><div class="al-field"><label data-fa="نام یا نام کاربری" data-en="Name or username">نام یا نام کاربری</label><input id="al-name" autocomplete="name" data-fa-placeholder="نام شما" data-en-placeholder="Your name" placeholder="نام شما"></div><div class="al-field full"><label data-fa="موضوع" data-en="Subject">موضوع</label><input id="al-subject" data-fa-placeholder="مثلاً مشکل دانلود Nexus" data-en-placeholder="e.g. Nexus download issue" placeholder="مثلاً مشکل دانلود Nexus"></div><div class="al-field full"><label data-fa="پیام" data-en="Message">پیام</label><textarea id="al-message" data-fa-placeholder="جزئیات را بنویس..." data-en-placeholder="Describe the issue or idea..."></textarea></div></div><div class="al-support-actions"><button id="al-copy-message" class="al-support-btn primary" type="button" data-fa="کپی پیام آماده" data-en="Copy prepared message">کپی پیام آماده</button><a class="al-support-btn link" href="https://t.me/Arad_unk" target="_blank" rel="noreferrer" data-fa="Telegram ↗" data-en="Telegram ↗">Telegram ↗</a><a class="al-support-btn link" href="https://ble.ir/AdLandStudio" target="_blank" rel="noreferrer" data-fa="Bale ↗" data-en="Bale ↗">Bale ↗</a></div><div id="al-status" class="al-support-status" aria-live="polite"></div><div class="al-support-note" data-fa="پیام‌های بازدیدکنندگان همیشه به‌عنوان پیام کاربر باقی می‌مانند؛ هیچ گزینه‌ای برای ارسال «به نام ادمین» وجود ندارد." data-en="Visitor messages stay visitor messages; there is no option to post or send “as admin”.">پیام‌های بازدیدکنندگان همیشه به‌عنوان پیام کاربر باقی می‌مانند؛ هیچ گزینه‌ای برای ارسال «به نام ادمین» وجود ندارد.</div></section><section class="al-support-section"><h3 data-fa="هویت رسمی" data-en="Official identity">هویت رسمی</h3><p data-fa="پیام‌های رسمی AdLand فقط از محتوای منتشرشدهٔ خود استودیو می‌آیند. کاربران از داخل این پنل نمی‌توانند نقش ادمین را انتخاب کنند." data-en="Official AdLand announcements come only from studio-published content. Visitors cannot choose or impersonate the admin role from this panel.">پیام‌های رسمی AdLand فقط از محتوای منتشرشدهٔ خود استودیو می‌آیند. کاربران از داخل این پنل نمی‌توانند نقش ادمین را انتخاب کنند.</p><div class="secureRows"><div class="secureRow" data-fa="✓ بدون فیلد Admin" data-en="✓ No Admin field">✓ بدون فیلد Admin</div><div class="secureRow" data-fa="✓ بدون نمایش ایمیل خصوصی" data-en="✓ Private email is not exposed">✓ بدون نمایش ایمیل خصوصی</div><div class="secureRow" data-fa="✓ ارتباط از کانال رسمی" data-en="✓ Official-channel contact">✓ ارتباط از کانال رسمی</div></div></section></div></div>`;
    document.body.appendChild(panel);const open=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');document.getElementById('al-message')?.focus()};const close=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')};launcher.onclick=open;document.getElementById('al-support-close').onclick=close;panel.addEventListener('pointerdown',e=>{if(e.target===panel)close()},{passive:true});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    document.getElementById('al-copy-message').onclick=async()=>{const name=document.getElementById('al-name').value.trim()||text('بدون نام','No name'),subject=document.getElementById('al-subject').value.trim()||text('پیام AdLand','AdLand message'),message=document.getElementById('al-message').value.trim();if(!message){document.getElementById('al-status').textContent=text('لطفاً پیام را بنویس.','Please write a message first.');return}const ref='AL-'+Date.now().toString(36).slice(-7).toUpperCase();const body=[text('شناسه پیگیری','Reference')+': '+ref,text('نام','Name')+': '+name,text('موضوع','Subject')+': '+subject,'',message].join('\\n');try{await navigator.clipboard.writeText(body);document.getElementById('al-status').textContent=text('پیام آماده و کپی شد؛ حالا آن را در Telegram یا Bale بفرست.','Message prepared and copied; paste it into Telegram or Bale.')}catch(e){document.getElementById('al-status').textContent=body}const refEl=document.createElement('div');refEl.className='al-support-ref';refEl.textContent=text('شناسه پیگیری: ','Reference: ')+ref;document.getElementById('al-status').appendChild(refEl)};
    setLocalized(panel);setLocalized(launcher);
  }

  const MAC_RELEASE='mac-v1.0.0';
  const MAC_RELEASE_URL='https://github.com/AradProgramming/AdLandSite/releases/tag/'+MAC_RELEASE;
  const macAsset=file=> 'https://github.com/AradProgramming/AdLandSite/releases/download/'+MAC_RELEASE+'/'+file+'-1.0.0-universal';
  const slugFromHref=href=>{try{const p=new URL(href,location.href).pathname.split('/').filter(Boolean);return p[p.length-1]==='index.html'?p[p.length-2]||'':p[p.length-1]||''}catch(e){return ''}};
  function normalizeDownloads(){
    if(!product||product.kind==='web')return;
    const host=document.querySelector('#download');
    const downloadBlock=host?.closest('.download,.release,.panel')||host;
    const actions=(host?.classList.contains('actions')?host:host?.querySelector('.actions'))||(downloadBlock?.querySelector('.actions'));
    if(!downloadBlock||!actions||downloadBlock.querySelector('.al-platform-download-grid'))return;
    const links=[...actions.querySelectorAll('a[href]')];
    const installer=links.find(a=>/setup|installer/i.test((a.textContent||'')+' '+(a.href||'')))||links[0];
    const portable=links.find(a=>/portable/i.test((a.textContent||'')+' '+(a.href||'')))||links[1];
    const release=links.find(a=>/release/i.test((a.textContent||'')+' '+(a.href||'')))||null;
    if(!installer)return;
    const card=(cls,title,sub,items)=>'<div class="al-platform-download '+cls+'"><div class="al-platform-download-head"><span class="al-platform-icon">'+(cls==='windows'?'▣':'⌘')+'</span><div><strong>'+title+'</strong><small>'+sub+'</small></div><span class="al-live-dot"></span></div><div class="al-platform-download-actions">'+items.map((it,i)=>'<a class="al-release-btn '+(i===0?'primary':'')+'" href="'+it.href+'" target="_blank" rel="noopener noreferrer">'+it.label+'</a>').join('')+'</div></div>';
    const macDmg=macAsset(product.file)+'.dmg', macZip=macAsset(product.file)+'.zip';
    const grid=document.createElement('div');
    grid.className='al-platform-download-grid';
    grid.innerHTML=card('windows','Windows 10 / 11','x64 · desktop release',[
      {href:installer.href,label:text('نصاب Windows','Windows Installer')},
      ...(portable?[{href:portable.href,label:text('نسخه Portable','Portable')}]:[])
    ])+card('macos','macOS','Universal · Apple Silicon + Intel',[
      {href:macDmg,label:text('DMG مک','macOS DMG')},
      {href:macZip,label:text('ZIP مک','macOS ZIP')}
    ]);
    actions.style.display='none';
    actions.setAttribute('aria-hidden','true');
    downloadBlock.appendChild(grid);
    if(release){
      const foot=document.createElement('div');
      foot.className='al-release-footer';
      foot.innerHTML='<a href="'+release.href+'" target="_blank" rel="noopener noreferrer">'+text('مشاهده صفحه Release ↗','Open release page ↗')+'</a><span>'+text('دانلودها از نسخه رسمی محصول','Downloads from the official product release')+'</span>';
      downloadBlock.appendChild(foot);
    }
  }
  function productPlatform(){
    if(!product)return;
    style();
    let anchor=document.querySelector('.hero-meta,.heroMeta');
    const actions=document.querySelector('#download .actions,#download .heroActions,.hero .actions,.hero .heroActions,.release .actions,.actions');
    if(!anchor&&actions){anchor=document.createElement('div');anchor.className='al-platform-anchor';actions.parentElement.appendChild(anchor)}
    if(anchor){
      let rail=anchor.querySelector('.al-platform-rail');
      if(!rail){
        rail=document.createElement('div');
        rail.className='al-platform-rail';
        rail.innerHTML='<div class="al-platform live"><b><span class="al-dot"></span><span data-fa="Windows 10 / 11 · x64" data-en="Windows 10 / 11 · x64">Windows 10 / 11 · x64</span></b><small data-fa="نسخه دسکتاپ آماده است" data-en="Desktop release is live">نسخه دسکتاپ آماده است</small></div><div class="al-platform mac live"><b><span class="al-dot"></span><span data-fa="macOS · نسخه native منتشر شد" data-en="macOS · native edition is live">macOS · نسخه native منتشر شد</span></b><small data-fa="Apple Silicon + Intel · Universal" data-en="Apple Silicon + Intel · Universal">Apple Silicon + Intel · Universal</small></div>';
        anchor.appendChild(rail);
      }
      setLocalized(rail);
    }
    if(actions&&product.file){
      let b=actions.querySelector('.al-mac-action');
      if(!b){b=document.createElement('a');b.className='al-mac-action';actions.appendChild(b)}
      b.classList.remove('disabled');
      b.removeAttribute('aria-disabled');
      b.href=macAsset(product.file)+'.dmg';
      b.target='_blank';
      b.rel='noopener noreferrer';
      b.textContent=text('⌘ دانلود برای macOS','⌘ Download for macOS');
      b.title=text('نسخه Universal برای Apple Silicon و Intel','Universal build for Apple Silicon and Intel');
      let z=actions.querySelector('.al-mac-zip');
      if(!z){z=document.createElement('a');z.className='al-mac-action al-mac-zip';actions.appendChild(z)}
      z.href=macAsset(product.file)+'.zip';
      z.target='_blank';
      z.rel='noopener noreferrer';
      z.textContent=text('ZIP · macOS','ZIP · macOS');
      z.title=text('نسخه ZIP برای macOS','ZIP package for macOS');
    }
    if(slug==='ai-tools'){
      const meta=document.querySelector('.heroMeta,.hero-meta');
      if(meta&&!meta.querySelector('.al-web-mac-live')){
        const s=document.createElement('span');
        s.className='pill al-web-mac-live';
        s.textContent='⌘ macOS / Web · LIVE';
        meta.appendChild(s);
      }
    }
  }
  function homeMac(){
    if(product)return;
    style();
    const grid=document.querySelector('.appsGrid');
    if(grid){
      [...grid.querySelectorAll('.app')].forEach(card=>{
        const href=card.querySelector('a[href]')?.getAttribute('href')||'';
        const key=slugFromHref(href)||(card.getAttribute('data-app')||'').toLowerCase();
        const meta=products[key];
        const file=meta?.file;
        if(!file)return;
        let row=card.querySelector('.al-card-platforms');
        if(!row){
          row=document.createElement('div');
          row.className='al-card-platforms';
          const bottom=card.querySelector('.appBottom');
          if(bottom)bottom.parentElement.insertBefore(row,bottom); else card.appendChild(row);
        }
        row.innerHTML='<span class="al-card-platform">Windows 10/11</span><a class="al-card-platform mac mac-download" href="'+macAsset(file)+'.dmg" target="_blank" rel="noopener noreferrer">⌘ macOS · '+esc(text('دانلود','Download'))+'</a>';
      });
    }
    const anchor=document.querySelector('#apps .appsGrid')||grid;
    if(anchor&&!document.getElementById('al-mac-panel')){
      const p=document.createElement('div');
      p.id='al-mac-panel';
      p.className='al-mac-panel live';
      p.innerHTML='<div class="al-release-live"><span class="al-live-dot"></span><strong data-fa="macOS LIVE" data-en="macOS LIVE">macOS LIVE</strong><span>mac-v1.0.0</span></div><h3 data-fa="نسخه مک اکوسیستم AdLand منتشر شد." data-en="The AdLand macOS ecosystem is now live.">نسخه مک اکوسیستم AdLand منتشر شد.</h3><p data-fa="نسخه Universal همهٔ ۱۲ محصول/ابزار AdLand اکنون برای Mac با پردازنده‌های Apple Silicon و Intel آماده دانلود است. هر کارت محصول لینک مستقیم DMG دارد و فایل ZIP هم از صفحهٔ Release در دسترس است." data-en="The Universal build of all 12 AdLand products and tools is now available for Macs with Apple Silicon and Intel. Every product card has a direct DMG download, with ZIP packages also available from the release page.">نسخه Universal همهٔ ۱۲ محصول/ابزار AdLand اکنون برای Mac با پردازنده‌های Apple Silicon و Intel آماده دانلود است. هر کارت محصول لینک مستقیم DMG دارد و فایل ZIP هم از صفحهٔ Release در دسترس است.</p><div class="al-mac-meta"><span class="al-mac-pill">Apple Silicon</span><span class="al-mac-pill">Intel Mac</span><span class="al-mac-pill" data-fa="Universal · نسخه ۱.۰.۰" data-en="Universal · v1.0.0">Universal · نسخه ۱.۰.۰</span></div><div class="al-release-actions"><a class="al-release-btn primary" href="'+MAC_RELEASE_URL+'" target="_blank" rel="noopener noreferrer" data-fa="مشاهده Release ↗" data-en="Open Release ↗">مشاهده Release ↗</a><span class="al-release-note" data-fa="DMG مستقیم از کارت هر محصول" data-en="Direct DMG from every product card">DMG مستقیم از کارت هر محصول</span></div>';
      anchor.insertAdjacentElement('afterend',p);
      setLocalized(p);
    }
  }
  function heroHome(){
    if(product)return;
    const meta=document.querySelector('.heroMeta');
    if(meta&&!meta.querySelector('.al-home-mac')){
      const p=document.createElement('span');
      p.className='pill al-home-mac live';
      p.innerHTML='<span data-fa="macOS · نسخه native منتشر شد" data-en="macOS · native edition is live">macOS · نسخه native منتشر شد</span>';
      meta.appendChild(p);
      setLocalized(p);
    }
  }
  function activateMac(){}
  function adminFeed(){if(document.querySelector('script[data-al-admin]'))return;const s=document.createElement('script');s.src=new URL('../assets/adland-admin.js',document.currentScript?.src||location.href).href;s.defer=true;s.dataset.alAdmin='1';document.head.appendChild(s)}
  function sync(){setLocalized();productPlatform();homeMac();heroHome();upgradeUniverse();adminFeed();activateMac()}
  document.addEventListener('adland:language',sync);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{support();sync()});else{support();sync()}
})();