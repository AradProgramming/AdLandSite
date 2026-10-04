(()=>{
  const root=document.documentElement;
  const KEY='adland-language-v2';
  const TG='https://t.me/Arad_unk';
  const BALE='https://ble.ir/AdLandStudio';
  const products={
    'ai-tools':{name:'AdLand AI Tools',fa:'ابزارهای هوش مصنوعی AdLand',kind:'web',file:'AdLand-AI-Tools'},
    nexus:{name:'Nexus',fa:'Nexus',version:'1.4.4',file:'AdLand-Nexus'},canvas:{name:'Canvas',fa:'Canvas',version:'1.1.1',file:'AdLand-Canvas'},pulse:{name:'Pulse',fa:'Pulse',version:'1.0.3',file:'AdLand-Pulse'},frame:{name:'Frame',fa:'Frame',version:'1.1.3',file:'AdLand-Frame'},atlas:{name:'Atlas',fa:'Atlas',version:'1.0.1',file:'AdLand-Atlas'},forge:{name:'Forge',fa:'Forge',version:'1.0.1',file:'AdLand-Forge'},prism:{name:'Prism',fa:'Prism',version:'1.0.1',file:'AdLand-Prism'},relay:{name:'Relay',fa:'Relay',version:'1.0.0',file:'AdLand-Relay'},echo:{name:'Echo',fa:'Echo',version:'1.0.0',file:'AdLand-Echo'},chrono:{name:'Chrono',fa:'Chrono',version:'1.0.0',file:'AdLand-Chrono'},orbit:{name:'Orbit',fa:'Orbit',version:'1.0.2',file:'AdLand-Orbit'},anidiary:{name:'AniDiary',fa:'AniDiary',version:'1.0.0',file:'AniDiary'}
  };
  const path=location.pathname.split('/').filter(Boolean);
  const slug=path[path.length-1]&&path[path.length-1]!=='index.html'?path[path.length-1]:(path[path.length-2]||'home');
  const product=products[slug]||null;
  const lang=()=>((localStorage.getItem(KEY)||root.lang||'fa').toLowerCase().startsWith('en')?'en':'fa');
  const text=(fa,en)=>lang()==='fa'?fa:en;
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const SFX_KEY='adland-sfx';
  const sfxState={ctx:null,busy:false};
  const sfxEnabled=()=>localStorage.getItem(SFX_KEY)!=='off';
  function sfxTone(kind='tap'){
    if(!sfxEnabled()||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    try{
      const C=sfxState.ctx||(sfxState.ctx=new(window.AudioContext||window.webkitAudioContext)());
      if(C.state==='suspended')C.resume();
      const now=C.currentTime;
      const sets={tap:[390,560,.055,.009,'sine'],nav:[480,700,.065,.007,'triangle'],open:[420,780,.12,.014,'sine'],close:[300,210,.09,.012,'sine'],success:[460,920,.18,.014,'triangle'],error:[210,120,.16,.012,'sawtooth'],toggle:[330,520,.07,.008,'square'],tick:[620,620,.035,.005,'sine']};
      const q=sets[kind]||sets.tap;
      const o=C.createOscillator(),g=C.createGain(),f=C.createBiquadFilter();
      o.type=q[4];o.frequency.setValueAtTime(q[0],now);o.frequency.exponentialRampToValueAtTime(Math.max(70,q[1]),now+q[2]*.72);
      f.type='lowpass';f.frequency.setValueAtTime(2600,now);
      g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(q[3],now+.008);g.gain.exponentialRampToValueAtTime(.0001,now+q[2]);
      o.connect(f).connect(g).connect(C.destination);o.start(now);o.stop(now+q[2]+.015);
    }catch(e){}
  }
  function smartSfx(el){
    if(!el)return 'tap';
    if(el.dataset.sfx) return el.dataset.sfx;
    const id=(el.id||'').toLowerCase(),txt=(el.textContent||'').toLowerCase(),cls=(el.className||'').toString().toLowerCase();
    if(id.includes('sound')||id.includes('lang')||txt.includes('sfx'))return 'toggle';
    if(/close|cancel|back|بستن|لغو|بازگشت/.test(id+' '+txt))return 'close';
    if(/delete|remove|error|wrong|fail|حذف|خطا|اشتباه/.test(id+' '+txt))return 'error';
    if(/save|success|done|copy|ذخیره|کپی|انجام/.test(id+' '+txt))return 'success';
    if(/open|download|install|start|launch|view|شروع|باز|دانلود|نصب|ورود/.test(id+' '+txt))return 'open';
    if(cls.includes('nav')||el.closest('.nav,.navlinks,.top,.navactions'))return 'nav';
    return 'tap';
  }
  function wireSfx(){
    const nodes=[...document.querySelectorAll('button,a,[role="button"],summary,input[type="button"],input[type="submit"]')];
    nodes.forEach(el=>{
      if(el.dataset.alSfxBound==='1'||el.dataset.sfxIgnore==='1'||el.closest('.arcadeSection,.arcadeGrid,.memoryBoard,#reflexStage,#meteorCanvas'))return;
      el.dataset.alSfxBound='1';
      el.addEventListener('pointerdown',()=>{if(window.tone)window.tone(smartSfx(el));else sfxTone(smartSfx(el))},{passive:true});
    });
  }
  function observeSfx(){
    wireSfx();
    if(window.__alSfxObserver)return;
    window.__alSfxObserver=new MutationObserver(()=>wireSfx());window.__alSfxObserver.observe(document.body,{subtree:true,childList:true});
  }

  function style(){
    if(document.getElementById('al-ecosystem-style'))return;
    const s=document.createElement('style');s.id='al-ecosystem-style';s.textContent=`
      .al-platform-rail{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0;align-items:stretch}.al-platform{min-width:190px;flex:1;padding:13px 14px;border:1px solid #ffffff10;border-radius:15px;background:linear-gradient(145deg,#ffffff07,#ffffff02);box-shadow:0 14px 45px #0005}.al-platform b{display:block;font-size:13px;line-height:1.5;color:#f1ede3}.al-platform small{display:block;margin-top:4px;font-size:11px;line-height:1.6;color:#7e898f}.al-platform.mac{border-color:#e7d59c28;background:linear-gradient(145deg,#d9b55d10,#ffffff02)}.al-platform .al-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-inline-end:7px;background:#8ff9dc;box-shadow:0 0 12px #8ff9dc66}.al-platform.mac .al-dot{background:#d9b55d;box-shadow:0 0 12px #d9b55d66}.al-mac-action{height:40px!important;min-height:40px!important;padding:0 13px;border:1px solid #d9b55d35;border-radius:11px;background:#d9b55d08;color:#d9b55d;font:800 12px/1.2 Manrope,Vazirmatn,sans-serif;cursor:pointer;opacity:.95}.al-mac-action.disabled,.al-mac-card.disabled{cursor:not-allowed;opacity:.55;pointer-events:none}.al-mac-action:disabled{cursor:not-allowed}.al-mac-panel{margin-top:18px;padding:22px;border-radius:24px;border:1px solid #d9b55d25;background:radial-gradient(circle at 78% 25%,#d9b55d16,transparent 34%),linear-gradient(145deg,#ffffff08,#ffffff02);box-shadow:0 30px 100px #0009;position:relative;overflow:hidden}.al-mac-panel:after{content:'⌘';position:absolute;inset:auto 22px 6px auto;font-size:110px;line-height:1;color:#d9b55d0b;pointer-events:none}.al-mac-panel small{color:#d9b55d;font-weight:800;font-size:10px;letter-spacing:.12em}.al-mac-panel h3{margin:6px 0 7px;font-size:25px;line-height:1.35}.al-mac-panel p{margin:0;max-width:820px;color:#7e898f;font-size:13px;line-height:1.9}.al-mac-panel .al-mac-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.al-mac-pill{padding:7px 9px;border:1px solid #ffffff10;border-radius:999px;color:#a2abb0;background:#ffffff03;font-size:11px}.al-card-platforms{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.al-card-platform{padding:6px 8px;border-radius:999px;border:1px solid #ffffff0d;background:#ffffff03;color:#78858c;font:700 10px/1.2 Manrope,Vazirmatn,sans-serif}.al-card-platform.mac{border-color:#d9b55d22;color:#d9b55d}
      #al-support-launcher{position:fixed;right:18px;bottom:18px;z-index:99998;border:1px solid #d9b55d42;border-radius:15px;background:#090d12ef;color:#e6cf91;backdrop-filter:blur(22px);box-shadow:0 22px 80px #000b;padding:11px 14px;display:flex;align-items:center;gap:9px;font:900 12px/1.1 Manrope,Vazirmatn,sans-serif;cursor:pointer;transition:.25s}#al-support-launcher:hover{transform:translateY(-3px);box-shadow:0 30px 100px #000c}#al-support-launcher i{width:7px;height:7px;border-radius:50%;background:#8ff9dc;box-shadow:0 0 13px #8ff9dc;display:block}#al-support{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:#020305c7;backdrop-filter:blur(18px);opacity:0;visibility:hidden;transition:.25s}#al-support.open{opacity:1;visibility:visible}.al-support-card{width:min(920px,calc(100% - 24px));max-height:min(86vh,860px);overflow:auto;border:1px solid #d9b55d35;border-radius:26px;background:#090e14fa;box-shadow:0 40px 140px #000d;padding:20px}.al-support-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.al-support-kicker{color:#d9b55d;font-size:10px;font-weight:900;letter-spacing:.14em}.al-support-head h2{margin:5px 0 4px;font-size:30px;line-height:1.25}.al-support-head p{margin:0;color:#7f8b92;font-size:13px;line-height:1.75}.al-support-close{width:36px;height:36px;border:1px solid #ffffff12;border-radius:10px;background:#ffffff05;color:#a8b0b4;font-size:20px;cursor:pointer}.al-support-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px;margin-top:16px}.al-support-section{padding:16px;border:1px solid #ffffff0d;border-radius:19px;background:#ffffff03}.al-support-section h3{margin:0 0 10px;font-size:17px}.al-support-section p{color:#7f8b92;font-size:12px;line-height:1.8}.al-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px}.al-field{display:grid;gap:6px}.al-field.full{grid-column:1/-1}.al-field label{color:#a2abb0;font-size:11px;font-weight:800}.al-field input,.al-field textarea,.al-field select{width:100%;border:1px solid #ffffff10;border-radius:11px;background:#05080c;color:#f0ede6;padding:10px 11px;outline:0;font-size:13px;line-height:1.6}.al-field textarea{min-height:150px;resize:vertical}.al-field input:focus,.al-field textarea:focus,.al-field select:focus{border-color:#d9b55d55;box-shadow:0 0 0 3px #d9b55d0b}.al-support-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.al-support-btn{min-height:40px;padding:0 13px;border:1px solid #ffffff11;border-radius:10px;background:#ffffff04;color:#acb4b8;font:800 12px/1 Manrope,Vazirmatn,sans-serif;cursor:pointer}.al-support-btn.primary{background:linear-gradient(135deg,#d9b55d,#aa7c2b);color:#151005;border:0}.al-support-btn.link{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.al-support-status{margin-top:9px;min-height:22px;color:#8c989e;font-size:11px;line-height:1.7}.al-support-ref{margin-top:9px;padding:9px 11px;border-radius:10px;border:1px dashed #d9b55d25;color:#d2bc7a;background:#d9b55d06;font:800 11px/1.5 ui-monospace,monospace}.al-support-note{margin-top:10px;padding:10px 11px;border-radius:11px;background:#8ff9dc08;border:1px solid #8ff9dc18;color:#82a9a1;font-size:11px;line-height:1.75}@media(max-width:760px){.al-support-grid{grid-template-columns:1fr}.al-fields{grid-template-columns:1fr}.al-field.full{grid-column:auto}.al-support-head h2{font-size:24px}.al-support-card{padding:14px}.al-platform{min-width:0}.al-mac-panel h3{font-size:21px}#al-support-launcher{right:10px;bottom:10px}}@media(prefers-reduced-motion:reduce){#al-support-launcher,.al-platform,.al-mac-panel{transition:none!important}}
      #al-page-progress{position:fixed;top:0;left:0;width:0;height:3px;background:linear-gradient(90deg,#d9b55d,#f6df9a,#8ff9dc);z-index:100001;box-shadow:0 0 18px #d9b55d66;transition:width .12s linear}
      #al-backtop{position:fixed;left:18px;bottom:18px;width:43px;height:43px;z-index:99997;border:1px solid #ffffff16;border-radius:13px;background:#090d12e8;color:#d9b55d;backdrop-filter:blur(18px);box-shadow:0 18px 60px #0009;opacity:0;visibility:hidden;transform:translateY(10px);transition:.28s;cursor:pointer;font-size:17px;font-weight:900}
      #al-backtop.show{opacity:1;visibility:visible;transform:none}
      #al-backtop:hover{transform:translateY(-3px);border-color:#d9b55d45;box-shadow:0 24px 75px #000b}
      #al-share{position:fixed;left:18px;top:134px;width:34px;height:34px;z-index:99996;border:1px solid #ffffff12;border-radius:10px;background:#090d12dd;color:#8d999f;backdrop-filter:blur(16px);cursor:pointer;font-weight:900;font-size:14px;transition:.22s}
      #al-share:hover{color:#d9b55d;border-color:#d9b55d45;transform:translateY(-2px)}
      #al-sfx-toggle{position:fixed;left:60px;top:134px;width:74px;height:34px;z-index:99996;border:1px solid #ffffff12;border-radius:10px;background:#090d12dd;color:#8d999f;backdrop-filter:blur(16px);cursor:pointer;font:800 10px/1 Manrope,Vazirmatn,sans-serif;transition:.22s}
      #al-sfx-toggle.on{color:#d9b55d;border-color:#d9b55d35;background:#d9b55d09}
      #al-sfx-toggle:hover{transform:translateY(-2px);border-color:#d9b55d45}

      #al-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,16px);z-index:100005;max-width:min(520px,calc(100% - 30px));padding:10px 14px;border:1px solid #d9b55d35;border-radius:12px;background:#080d12f4;color:#e9e3d5;backdrop-filter:blur(18px);box-shadow:0 20px 80px #000b;font-size:12px;line-height:1.5;opacity:0;visibility:hidden;transition:.25s}
      #al-toast.show{opacity:1;visibility:visible;transform:translate(-50%,0)}

      .al-enhance-card{position:relative;overflow:hidden}
      .al-enhance-card:after{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at var(--alx,50%) var(--aly,50%),#d9b55d0c,transparent 28%);pointer-events:none;opacity:0;transition:.35s}
      .al-enhance-card:hover:after{opacity:1}
      .al-spark{position:fixed;pointer-events:none;z-index:100002;width:5px;height:5px;border-radius:50%;background:#f6df9a;box-shadow:0 0 16px #d9b55d;animation:alSpark .65s ease-out forwards}
      @keyframes alSpark{to{transform:translate(var(--dx),var(--dy)) scale(.1);opacity:0}}
      @media(max-width:700px){#al-backtop{left:10px;bottom:10px;width:40px;height:40px}#al-page-progress{height:2px}}
      .al-update-cockpit{margin-top:18px;padding:20px;border:1px solid #d9b55d24;border-radius:22px;background:radial-gradient(circle at 8% 10%,#8ff9dc0a,transparent 30%),radial-gradient(circle at 90% 0%,#d9b55d12,transparent 35%),linear-gradient(145deg,#ffffff08,#ffffff02);box-shadow:0 25px 95px #0008;position:relative;overflow:hidden}
      .al-update-cockpit:before{content:"UPDATE";position:absolute;inset:-8px 16px auto auto;color:#d9b55d08;font:900 78px/1 Manrope,sans-serif;letter-spacing:.08em;pointer-events:none}
      .al-update-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;position:relative}.al-update-kicker{color:#d9b55d;font-size:10px;font-weight:900;letter-spacing:.16em}.al-update-head h3{margin:5px 0 4px;font-size:24px;line-height:1.3}.al-update-head p{margin:0;color:#7f8b92;font-size:12px;line-height:1.8;max-width:760px}
      .al-update-version{display:flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid #ffffff10;border-radius:11px;background:#ffffff04;color:#e9e0cc;white-space:nowrap}.al-update-version small{color:#6f7b82;font-size:9px}.al-update-version b{color:#d9b55d;font-size:14px}
      .al-update-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:15px;position:relative}.al-update-os{padding:14px;border:1px solid #ffffff0d;border-radius:16px;background:#05080c8c}.al-update-os-head{display:flex;align-items:center;gap:9px}.al-update-os-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;border:1px solid #ffffff10;background:#ffffff06;font-size:16px}.al-update-os strong{display:block;font-size:13px}.al-update-os small{display:block;margin-top:2px;color:#748188;font-size:10px}
      .al-update-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:11px}.al-update-btn{min-height:38px;display:flex;align-items:center;justify-content:center;border:1px solid #ffffff10;border-radius:10px;background:#ffffff04;color:#aab3b7;font-size:11px;font-weight:800}.al-update-btn.primary{border-color:#d9b55d40;background:#d9b55d0b;color:#e6ce8c}.al-update-btn:hover{transform:translateY(-2px);border-color:#d9b55d45}.al-update-foot{margin-top:12px;padding-top:11px;border-top:1px solid #ffffff0b;color:#66747b;font-size:10px;line-height:1.7}
      @media(max-width:700px){.al-update-grid{grid-template-columns:1fr}.al-update-head{display:block}.al-update-version{display:inline-flex;margin-top:10px}.al-update-actions{grid-template-columns:1fr}}

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
  function experience(){
    style();
    observeSfx();
    if(!window.alToast){
      window.alToast=(msg)=>{
        let box=document.getElementById('al-toast');
        if(!box){box=document.createElement('div');box.id='al-toast';document.body.appendChild(box)}
        box.textContent=msg;box.classList.add('show');clearTimeout(box._timer);box._timer=setTimeout(()=>box.classList.remove('show'),2300);
      };
    }
    if(!document.getElementById('al-page-progress')){
      const p=document.createElement('div');p.id='al-page-progress';document.body.appendChild(p);
      const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;p.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%'};
      addEventListener('scroll',update,{passive:true});update();
    }
    if(!document.getElementById('al-backtop')){
      const b=document.createElement('button');b.id='al-backtop';b.type='button';b.setAttribute('aria-label',text('بازگشت به بالا','Back to top'));b.textContent='↑';document.body.appendChild(b);
      const toggle=()=>b.classList.toggle('show',scrollY>520);
      addEventListener('scroll',toggle,{passive:true});toggle();
      b.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});tone?.('open')});
    }
    document.querySelectorAll('.app,.project,.course,.teamCard,.tool,.feature,.step,.workspace,.panel,.release,.download,.demo').forEach(card=>{
      if(card.dataset.alEnhanced)return;card.dataset.alEnhanced='1';card.classList.add('al-enhance-card');
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--alx',((e.clientX-r.left)/r.width*100)+'%');card.style.setProperty('--aly',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});
    });
    document.querySelectorAll('button.btn,button.miniBtn,.appLink,a.btn,.openTool,.tab').forEach(btn=>{
      if(btn.dataset.alSpark)return;btn.dataset.alSpark='1';
      btn.addEventListener('pointerdown',e=>{
        if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
        for(let i=0;i<3;i++){const s=document.createElement('i');s.className='al-spark';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--dx',(Math.random()*34-17)+'px');s.style.setProperty('--dy',(Math.random()*-34-8)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),700)}
      },{passive:true});
    });
    if(!document.getElementById('al-sfx-toggle')){
      const b=document.createElement('button');b.id='al-sfx-toggle';b.type='button';
      const render=()=>{const on=sfxEnabled();b.classList.toggle('on',on);b.textContent='SFX '+(on?'ON':'OFF');b.setAttribute('aria-label',text(on?'خاموش کردن صداهای سایت':'روشن کردن صداهای سایت',on?'Turn site sounds off':'Turn site sounds on'))};
      b.onclick=()=>{const on=!sfxEnabled();localStorage.setItem(SFX_KEY,on?'on':'off');render();if(on)sfxTone('success')};document.body.appendChild(b);render();
    }
    if(product && !document.getElementById('al-share')){
      const s=document.createElement('button');s.id='al-share';s.type='button';s.textContent='↗';s.title=text('اشتراک‌گذاری صفحه','Share this page');s.setAttribute('aria-label',s.title);
      s.onclick=async()=>{
        try{
          if(navigator.share){await navigator.share({title:document.title,url:location.href});}
          else {await navigator.clipboard.writeText(location.href);alToast(text('لینک صفحه کپی شد.','Page link copied.'));}
        }catch(e){}
      };
      document.body.appendChild(s);
    }
    if(!document.getElementById('al-keyhelp') && product){
      const b=document.createElement('button');b.id='al-keyhelp';b.type='button';b.title=text('میانبرهای صفحه','Page shortcuts');b.setAttribute('aria-label',b.title);b.textContent='?';
      Object.assign(b.style,{position:'fixed',left:'18px',top:'94px',zIndex:'99996',width:'34px',height:'34px',border:'1px solid #ffffff12',borderRadius:'10px',background:'#090d12dd',color:'#89959b',cursor:'pointer',fontWeight:'900',fontSize:'14px',backdropFilter:'blur(16px)'});
      b.onclick=()=>{const d=text('میانبرهای مفید: Home = بالای صفحه · End = پایین صفحه · / = اولین ورودی','Useful shortcuts: Home = top · End = bottom · / = focus the first input');alToast(d)};
      document.body.appendChild(b);
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
    if(product.file && !document.getElementById('al-update-cockpit')){
      const downloadHost=document.querySelector('#download,.download,.release,.panel');
      const mount=downloadHost||actions?.parentElement||document.querySelector('.hero');
      if(mount){
        const box=document.createElement('section');box.id='al-update-cockpit';box.className='al-update-cockpit';
        const version=product.version||'1.0.0';
        const win=actions?.querySelector('a[href*="Setup.exe"],a[href*="setup"],a[href*="installer"]');
        const release=actions?.querySelector('a[href*="/releases/"]');
        const winHref=win?.href||release?.href||'';
        const relHref=release?.href||('https://github.com/AradProgramming/AdLandSite/releases');
        box.innerHTML='<div class="al-update-head"><div><small class="al-update-kicker">ADLAND UPDATE CENTER</small><h3 data-fa="آپدیت همین‌جاست." data-en="Your update, in one place.">آپدیت همین‌جاست.</h3><p data-fa="نسخهٔ فعلی و دریافت Windows و macOS را یک‌جا گذاشتیم؛ دیگه لازم نیست بین چند لینک بگردی." data-en="Current version plus Windows and macOS downloads are grouped here, so you do not have to hunt through several links.">نسخهٔ فعلی و دریافت Windows و macOS را یک‌جا گذاشتیم؛ دیگه لازم نیست بین چند لینک بگردی.</p></div><div class="al-update-version"><small>VERSION</small><b>v'+esc(version)+'</b></div></div><div class="al-update-grid"><div class="al-update-os"><div class="al-update-os-head"><span class="al-update-os-icon">▣</span><div><strong>Windows</strong><small>10 / 11 · x64</small></div></div><div class="al-update-actions">'+(winHref?'<a class="al-update-btn primary" href="'+esc(winHref)+'" target="_blank" rel="noopener noreferrer" data-fa="دریافت Windows" data-en="Download Windows">دریافت Windows</a>':'<span class="al-update-btn" data-fa="لینک نصب بالا" data-en="Installer link above">لینک نصب بالا</span>')+'<a class="al-update-btn" href="'+esc(relHref)+'" target="_blank" rel="noopener noreferrer" data-fa="Release ↗" data-en="Release ↗">Release ↗</a></div></div><div class="al-update-os"><div class="al-update-os-head"><span class="al-update-os-icon">⌘</span><div><strong>macOS</strong><small>Universal · Apple Silicon + Intel</small></div></div><div class="al-update-actions"><a class="al-update-btn primary" href="'+macAsset(product.file)+'.dmg" target="_blank" rel="noopener noreferrer" data-fa="DMG مک" data-en="macOS DMG">DMG مک</a><a class="al-update-btn" href="'+macAsset(product.file)+'.zip" target="_blank" rel="noopener noreferrer" data-fa="ZIP مک" data-en="macOS ZIP">ZIP مک</a></div></div></div><div class="al-update-foot" data-fa="این پنل لینک‌های انتشار فعلی سایت را جمع می‌کند. جزئیات بعضی قابلیت‌های محلی ممکن است بین دو سیستم‌عامل فرق داشته باشد." data-en="This panel groups the current release links wired into the site. Some local features can still differ between operating systems.">این پنل لینک‌های انتشار فعلی سایت را جمع می‌کند. جزئیات بعضی قابلیت‌های محلی ممکن است بین دو سیستم‌عامل فرق داشته باشد.</div>';
        mount.insertAdjacentElement('afterend',box);setLocalized(box);
      }
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
        row.innerHTML='<span class="al-card-platform">Windows 10/11 · x64</span><a class="al-card-platform mac mac-download" href="'+macAsset(file)+'.dmg" target="_blank" rel="noopener noreferrer">⌘ macOS · '+esc(text('DMG','DMG'))+'</a>';
        const version=card.querySelector('.version');
        if(version&&/WINDOWS/i.test(version.textContent||'')) version.textContent='WINDOWS + macOS · UNIVERSAL';
      });
    }
    const anchor=document.querySelector('#apps .appsGrid')||grid;
    if(anchor&&!document.getElementById('al-mac-panel')){
      const p=document.createElement('div');
      p.id='al-mac-panel';
      p.className='al-mac-panel live';
      p.innerHTML='<div class="al-release-live"><span class="al-live-dot"></span><strong data-fa="macOS LIVE" data-en="macOS LIVE">macOS LIVE</strong><span>mac-v1.0.0</span></div><h3 data-fa="نسخه مک اکوسیستم AdLand منتشر شد." data-en="The AdLand macOS ecosystem is now live.">نسخه مک اکوسیستم AdLand منتشر شد.</h3><p data-fa="نسخه Universal همهٔ ۱۳ محصول/ابزار AdLand اکنون برای Mac با پردازنده‌های Apple Silicon و Intel آماده دانلود است. هر کارت محصول لینک مستقیم DMG دارد و فایل ZIP هم از صفحهٔ Release در دسترس است." data-en="The Universal build of all 13 AdLand products and tools is now available for Macs with Apple Silicon and Intel. Every product card has a direct DMG download, with ZIP packages also available from the release page.">نسخه Universal همهٔ ۱۳ محصول/ابزار AdLand اکنون برای Mac با پردازنده‌های Apple Silicon و Intel آماده دانلود است. هر کارت محصول لینک مستقیم DMG دارد و فایل ZIP هم از صفحهٔ Release در دسترس است.</p><div class="al-mac-meta"><span class="al-mac-pill">Apple Silicon</span><span class="al-mac-pill">Intel Mac</span><span class="al-mac-pill" data-fa="Universal · نسخه ۱.۰.۰" data-en="Universal · v1.0.0">Universal · نسخه ۱.۰.۰</span></div><div class="al-release-actions"><a class="al-release-btn primary" href="'+MAC_RELEASE_URL+'" target="_blank" rel="noopener noreferrer" data-fa="مشاهده Release ↗" data-en="Open Release ↗">مشاهده Release ↗</a><span class="al-release-note" data-fa="DMG مستقیم از کارت هر محصول" data-en="Direct DMG from every product card">DMG مستقیم از کارت هر محصول</span></div>';
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
    function globalShortcuts(){
    if(window.__alShortcutsBound)return;window.__alShortcutsBound=true;
    addEventListener('keydown',e=>{
      const tag=(e.target?.tagName||'').toLowerCase();
      const typing=['input','textarea','select'].includes(tag)||e.target?.isContentEditable;
      if(typing)return;
      if(e.key==='/' ){
        const input=document.querySelector('input:not([type="hidden"])');
        if(input){e.preventDefault();input.focus();alToast(text('ورودی آماده است؛ بزن بریم.','Input focused; ready to go.'));}
      }else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
        e.preventDefault();document.getElementById('al-support-launcher')?.click(); 
      }
    });
  }

  function iconIntegrity(){
    const makeFallback=(img)=>{
      if(!img||img.dataset.alIconFallback==='1')return;
      img.dataset.alIconFallback='1';
      img.addEventListener('error',()=>{
        if(img.dataset.alIconReplaced==='1')return;
        img.dataset.alIconReplaced='1';
        const label=(img.getAttribute('alt')||'A').trim().slice(0,1).toUpperCase();
        const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7df97"/><stop offset="1" stop-color="#9f772e"/></linearGradient></defs><rect width="128" height="128" rx="28" fill="#080a0e"/><circle cx="64" cy="64" r="39" fill="none" stroke="url(#g)" stroke-width="3"/><text x="64" y="75" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="46" font-weight="900" fill="url(#g)">'+label+'</text></svg>';
        img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
      });
    };
    document.querySelectorAll('img[src*="/icons/"],img[src*="/logo/"]').forEach(makeFallback);
    if(window.__alIconObserver)return;
    window.__alIconObserver=new MutationObserver(()=>document.querySelectorAll('img[src*="/icons/"],img[src*="/logo/"]').forEach(makeFallback));
    window.__alIconObserver.observe(document.body,{subtree:true,childList:true});
  }

function sync(){iconIntegrity();setLocalized();experience();globalShortcuts();productPlatform();homeMac();heroHome();upgradeUniverse();adminFeed();activateMac()}
  document.addEventListener('adland:language',sync);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{support();sync()});else{support();sync()}
})();