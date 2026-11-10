
(() => {
  'use strict';

  const $ = (selector, scope=document) => scope.querySelector(selector);
  const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];
  const STORAGE = {
    favorites: 'adland-app-favorites-v1',
    recent: 'adland-app-recent-v1',
    motion: 'adland-motion'
  };
  const diagnostics = { startedAt: Date.now(), errors: [], checks: [] };

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch (_) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }
  function rememberError(message) {
    const text = String(message || 'Unknown browser error').slice(0, 240);
    diagnostics.errors.push({ message: text, at: Date.now() });
    if (diagnostics.errors.length > 20) diagnostics.errors.shift();
    updateHealth();
  }

  // The brand mark has local SVG fallbacks and a final inline mark, so it never
  // depends on one raster file or on the page's current nested URL.
  const inlineLogo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6df9a"/><stop offset=".55" stop-color="#d9b55d"/><stop offset="1" stop-color="#8f641e"/></linearGradient></defs><circle cx="256" cy="256" r="235" fill="#090d13" stroke="#d9b55d" stroke-opacity=".55" stroke-width="8"/><path d="M98 390 218 116q15-34 38-34t38 34l120 274h-78l-27-69H203l-28 69zm132-133h52l-26-68z" fill="url(#g)"/><path d="M268 177h45q107 0 107 91t-107 91h-45z" fill="#e8e2d5" opacity=".8"/><text x="256" y="458" text-anchor="middle" fill="#d9b55d" font-family="Arial,sans-serif" font-size="36" font-weight="800" letter-spacing="9">ADLAND</text></svg>';
  const inlineLogoUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(inlineLogo);
  function protectLogo(img) {
    if (!img || img.dataset.adlandLogoGuard === '1') return;
    img.dataset.adlandLogoGuard = '1';
    img.alt = img.alt || 'AdLand Studio logo';
    img.loading = 'eager';
    img.decoding = 'async';
    img.fetchPriority = 'high';
    const base = new URL('/AdLandSite/', location.origin);
    const candidates = [
      new URL('assets/logo/adland-logo-transparent.svg?v=20261110', base).href,
      new URL('assets/logo/adland-logo.svg?v=20261110', base).href,
      inlineLogoUrl
    ];
    const current = new URL(img.getAttribute('src') || '', document.baseURI).href;
    let index = candidates.indexOf(current);
    if (index < 0) index = -1;
    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) img.dataset.adlandLogoState = 'ready';
    });
    img.addEventListener('error', () => {
      const next = index + 1;
      if (next < candidates.length) {
        index = next;
        img.dataset.adlandLogoState = 'fallback';
        img.src = candidates[index];
      } else {
        img.dataset.adlandLogoState = 'inline-fallback';
        img.src = inlineLogoUrl;
      }
    });
  }

  $$('[data-adland-brand-logo]').forEach(protectLogo);
  // Lazy-decode non-brand artwork while keeping the logo and first hero media eager.
  $$('img:not([data-adland-brand-logo])').forEach(img => {
    if (!img.hasAttribute('loading')) img.loading = 'lazy';
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
    if (!img.alt && img.closest('.project')) {
      const heading = $('.projectCopy h3', img.closest('.project'));
      img.alt = heading ? heading.textContent.trim() : '';
    }
  });

  window.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) {
      rememberError('Image failed: ' + (event.target.currentSrc || event.target.src));
    } else if (event.message) {
      rememberError(event.message);
    }
  }, true);
  window.addEventListener('unhandledrejection', event => {
    rememberError(event.reason?.message || event.reason || 'Unhandled promise rejection');
  });

  // Make the existing motion control actually affect page motion and background FX.
  function applyMotionSetting() {
    const reducedByOS = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let low = false;
    try { low = localStorage.getItem(STORAGE.motion) === 'low'; } catch (_) {}
    document.body.classList.toggle('al-motion-low', Boolean(low || reducedByOS));
    const button = $('#motionBtn');
    if (button) {
      button.textContent = 'MOTION: ' + (low || reducedByOS ? 'LOW' : 'HIGH');
      button.setAttribute('aria-pressed', String(!(low || reducedByOS)));
      button.title = reducedByOS ? 'Reduced motion is enabled by your device' : 'Toggle interface motion';
    }
  }
  applyMotionSetting();
  $('#motionBtn')?.addEventListener('click', () => queueMicrotask(applyMotionSetting));
  window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', applyMotionSetting);

  // Product catalogue: search, complete category coverage, favorites and recent apps.
  const cards = $$('.appsGrid .app');
  const favorites = new Set(readJSON(STORAGE.favorites, []).filter(x => typeof x === 'string'));
  let recent = readJSON(STORAGE.recent, []).filter(x => typeof x === 'string');
  let activeFilter = 'all';
  let searchTerm = '';
  const categoryMap = {
    focus: ['nexus', 'roshd'],
    creative: ['canvas', 'frame', 'prism', 'echo', 'anidiary'],
    developer: ['forge', 'ai-tools', 'face2face'],
    system: ['pulse', 'atlas', 'orbit', 'chrono'],
    utility: ['relay']
  };
  function getSlug(card) {
    if (card.dataset.appSlug) return card.dataset.appSlug.toLowerCase();
    const href = $('.appIcon[href]', card)?.getAttribute('href') || '';
    return href.split('/').filter(Boolean).pop()?.toLowerCase() || '';
  }
  cards.forEach(card => {
    const slug = getSlug(card);
    if (slug) card.dataset.appSlug = slug;
    const head = $('.appHead', card);
    if (head && !$('.al-favorite', head)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'al-favorite';
      button.setAttribute('aria-pressed', String(favorites.has(slug)));
      button.innerHTML = '<span aria-hidden="true">' + (favorites.has(slug) ? '★' : '☆') + '</span>';
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (favorites.has(slug)) favorites.delete(slug); else favorites.add(slug);
        writeJSON(STORAGE.favorites, [...favorites]);
        renderCatalog();
        showToast(favorites.has(slug) ? text('به علاقه‌مندی‌ها اضافه شد','Added to favorites') : text('از علاقه‌مندی‌ها حذف شد','Removed from favorites'));
      });
      head.insertBefore(button, $('.appTag', head) || null);
    }
    $$('a[href]', card).forEach(link => {
      link.addEventListener('click', () => {
        if (!slug || !link.href || link.origin !== location.origin) return;
        recent = [slug, ...recent.filter(item => item !== slug)].slice(0, 12);
        writeJSON(STORAGE.recent, recent);
      });
    });
  });

  function text(fa, en) { return document.documentElement.lang === 'en' ? en : fa; }
  const toolbar = $('.al-app-toolbar');
  const search = $('#adlandAppSearch');
  const count = $('#alAppCount');
  const empty = $('#alAppEmpty');
  const filterButtons = $$('.productFilter');
  function updateFavoriteButtons() {
    cards.forEach(card => {
      const slug = getSlug(card);
      const button = $('.al-favorite', card);
      if (!button) return;
      const saved = favorites.has(slug);
      button.setAttribute('aria-pressed', String(saved));
      button.innerHTML = '<span aria-hidden="true">' + (saved ? '★' : '☆') + '</span>';
      button.setAttribute('aria-label', saved ? text('حذف از علاقه‌مندی‌ها','Remove from favorites') : text('افزودن به علاقه‌مندی‌ها','Add to favorites'));
      button.title = saved ? text('ذخیره‌شده','Saved') : text('ذخیره در علاقه‌مندی‌ها','Save to favorites');
    });
  }
  function renderCatalog() {
    let visible = 0;
    cards.forEach(card => {
      const slug = getSlug(card);
      const category = activeFilter === 'all' || activeFilter === 'favorites' || activeFilter === 'recent'
        ? true : (categoryMap[activeFilter] || []).includes(slug);
      const saved = activeFilter !== 'favorites' || favorites.has(slug);
      const viewed = activeFilter !== 'recent' || recent.includes(slug);
      const searchable = (card.textContent + ' ' + slug).toLocaleLowerCase();
      const matched = !searchTerm || searchable.includes(searchTerm);
      const show = category && saved && viewed && matched;
      card.setAttribute('data-hidden-filter', show ? '0' : '1');
      card.setAttribute('aria-hidden', String(!show));
      if (show) visible++;
    });
    filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === activeFilter));
    if (count) count.textContent = text(visible + ' محصول از ' + cards.length, visible + ' of ' + cards.length + ' products');
    if (empty) {
      empty.hidden = visible > 0;
      empty.textContent = activeFilter === 'favorites' && favorites.size === 0
        ? text('هنوز محصولی را ذخیره نکرده‌ای. روی ستاره‌ی کارت‌ها بزن.','No saved apps yet. Use the star on any product card.')
        : activeFilter === 'recent' && recent.length === 0
          ? text('هنوز محصولی باز نکرده‌ای. بعد از ورود به یک محصول، اینجا ظاهر می‌شود.','No recently opened apps yet. Open a product and it will appear here.')
          : text('محصولی با این جست‌وجو پیدا نشد. عبارت یا دسته را تغییر بده.','No matching products. Try another search or category.');
    }
    updateFavoriteButtons();
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    renderCatalog();
  }));
  search?.addEventListener('input', () => {
    searchTerm = search.value.trim().toLocaleLowerCase();
    renderCatalog();
  });
  $('#alAppReset')?.addEventListener('click', () => {
    activeFilter = 'all'; searchTerm = '';
    if (search) search.value = '';
    renderCatalog();
    search?.focus();
  });
  document.addEventListener('adland:language', renderCatalog);
  renderCatalog();

  // A quiet diagnostics panel reports real DOM, asset and runtime checks without
  // transmitting any information or collecting personal data.
  const dialog = document.createElement('dialog');
  dialog.id = 'alDiagnostics';
  dialog.className = 'al-dialog';
  dialog.innerHTML = '<div class="al-dialog-inner"><div class="al-dialog-top"><div><small class="al-dialog-kicker">ADLAND / SELF TEST</small><h2></h2><p></p></div><button class="al-dialog-close" type="button" aria-label="Close">×</button></div><div class="al-checks" aria-live="polite"></div><div class="al-dialog-foot"><span></span><button class="al-dialog-run" type="button"></button></div></div>';
  document.body.appendChild(dialog);
  const checksNode = $('.al-checks', dialog);
  const dialogTitle = $('h2', dialog);
  const dialogSummary = $('.al-dialog-top p', dialog);
  const dialogFoot = $('.al-dialog-foot span', dialog);
  const runButton = $('.al-dialog-run', dialog);
  function runSelfCheck(openDialog = true) {
    const allImages = $$('img');
    const loadedImages = allImages.filter(img => img.complete);
    const failedImages = loadedImages.filter(img => img.naturalWidth === 0);
    const brandImages = $$('[data-adland-brand-logo]');
    const brandOk = brandImages.length > 0 && brandImages.some(img => img.complete && img.naturalWidth > 0);
    const required = ['#nav', '#hero', '#apps', '#command', '#boot'];
    const missing = required.filter(selector => !$(selector));
    const scripts = ['adland-language.js', 'adland-ecosystem.js', 'adland-face2face.js', 'adland-system.js'];
    const missingScripts = scripts.filter(name => !$$('script[src]').some(script => script.src.includes(name)));
    const checks = [
      {name:text('ساختار اصلی صفحه','Core page structure'),ok:missing.length===0,detail:missing.length?text('بخش‌های مفقود: ','Missing sections: ')+missing.join(', '):text('بخش‌های اصلی صفحه موجودند.','All required page sections are present.')},
      {name:text('نمایش لوگوی AdLand','AdLand brand logo'),ok:brandOk,detail:brandOk?text('حداقل یک نسخه‌ی لوگو با موفقیت بارگذاری شده.','At least one brand logo rendered successfully.'):text('هیچ‌یک از نسخه‌های لوگو هنوز با موفقیت نمایش داده نشده‌اند.','No brand logo has rendered successfully yet.')},
      {name:text('اسکریپت‌های اصلی','Core scripts'),ok:missingScripts.length===0,detail:missingScripts.length?text('فایل‌های مفقود: ','Missing files: ')+missingScripts.join(', '):text('اسکریپت‌های اصلی به HTML متصل‌اند.','All core scripts are linked in the page.')},
      {name:text('فهرست محصولات','Product catalogue'),ok:cards.length>=10,detail:text(cards.length+' کارت محصول شناسایی شد.','Detected '+cards.length+' product cards.')},
      {name:text('دارایی‌های تصویری بارگذاری‌شده','Loaded image assets'),ok:failedImages.length===0,detail:text(loadedImages.length+' تصویر بررسی شد؛ '+failedImages.length+' خطای بارگذاری.','Checked '+loadedImages.length+' images; '+failedImages.length+' failed to load.')},
      {name:text('اتصال شبکه','Network connection'),ok:navigator.onLine,warning:!navigator.onLine,detail:navigator.onLine?text('مرورگر آنلاین گزارش می‌دهد.','The browser reports an online connection.'):text('مرورگر آفلاین است؛ برخی قابلیت‌های آنلاین در دسترس نیستند.','The browser is offline; some online features may not be available.')},
      {name:text('خطاهای ثبت‌شده در نشست','Runtime errors in this session'),ok:diagnostics.errors.length===0,warning:diagnostics.errors.length>0,detail:diagnostics.errors.length?diagnostics.errors.length+' '+text('خطا ثبت شده است.','errors recorded.') : text('خطای جاوااسکریپت ثبت نشده است.','No JavaScript errors have been recorded.')}
    ];
    diagnostics.checks = checks;
    const passing = checks.filter(item => item.ok).length;
    dialogTitle.textContent = text('گزارش سلامت AdLand','AdLand system report');
    dialogSummary.textContent = text(passing+' از '+checks.length+' بررسی با موفقیت انجام شد.',''+passing+' of '+checks.length+' checks passed.');
    checksNode.replaceChildren();
    checks.forEach(item => {
      const row = document.createElement('div');
      row.className = 'al-check';
      row.dataset.state = item.ok ? 'ok' : item.warning ? 'warn' : 'fail';
      const icon = document.createElement('span');
      icon.className = 'al-check-icon';
      icon.textContent = item.ok ? '✓' : item.warning ? '!' : '×';
      const copy = document.createElement('div');
      const heading = document.createElement('strong');
      const detail = document.createElement('small');
      heading.textContent = item.name; detail.textContent = item.detail;
      copy.append(heading, detail); row.append(icon, copy); checksNode.append(row);
    });
    dialogFoot.textContent = text('این بررسی فقط در مرورگر اجرا می‌شود و داده‌ای ارسال نمی‌کند.','This check runs in your browser and sends no data.');
    runButton.textContent = text('اجرای دوباره','Run again');
    updateHealth();
    if (openDialog && typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    return checks;
  }
  function updateHealth() {
    const button = $('#alHealthBtn');
    if (!button) return;
    const state = diagnostics.errors.length ? 'warning' : navigator.onLine ? 'online' : 'offline';
    button.dataset.state = state;
    button.textContent = state === 'warning' ? text('نیاز به بررسی','Needs check') : state === 'offline' ? text('آفلاین','Offline') : text('آنلاین','Online');
  }
  function showToast(message) {
    let toast = $('#alToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'alToast'; toast.className = 'al-toast'; toast.setAttribute('role','status'); toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  window.AdLandSystem = Object.freeze({ version:'2026.11', runSelfCheck, getSnapshot:() => ({errors:diagnostics.errors.length, products:cards.length, favorites:favorites.size, recent:recent.length}) });
  $('#adlandSelfTest')?.addEventListener('click', () => runSelfCheck(true));
  $('#alHealthBtn')?.addEventListener('click', () => runSelfCheck(true));
  $('.al-dialog-close', dialog)?.addEventListener('click', () => dialog.close());
  runButton.addEventListener('click', () => runSelfCheck(false));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  window.addEventListener('online', updateHealth);
  window.addEventListener('offline', updateHealth);
  updateHealth();

  // Small quality-of-life additions: keyboard search, top button and skip navigation.
  if (!$('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link'; skip.href = '#apps'; skip.textContent = text('رفتن به محتوای اصلی','Skip to main content');
    document.body.prepend(skip);
  }
  const top = document.createElement('button');
  top.type = 'button'; top.className = 'al-top'; top.id = 'alBackToTop';
  top.setAttribute('aria-label', text('رفتن به بالای صفحه','Back to top')); top.textContent = '↑';
  document.body.appendChild(top);
  top.addEventListener('click', () => window.scrollTo({top:0,behavior:document.body.classList.contains('al-motion-low')?'auto':'smooth'}));
  const onScroll = () => top.classList.toggle('show', window.scrollY > 520);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    const typing = active && (['INPUT','TEXTAREA','SELECT'].includes(active.tagName) || active.isContentEditable);
    if (event.key === '/' && !typing && search) { event.preventDefault(); search.focus(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f' && search) {
      event.preventDefault(); search.focus();
    }
    if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'd') runSelfCheck(true);
  });
  document.addEventListener('adland:language', () => {
    if ($('.skip-link')) $('.skip-link').textContent = text('رفتن به محتوای اصلی','Skip to main content');
    top.setAttribute('aria-label', text('رفتن به بالای صفحه','Back to top'));
    updateHealth();
  });
  setTimeout(() => runSelfCheck(false), 1200);
})();
