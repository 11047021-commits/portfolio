// 共用：導覽列、頁尾、中英切換、浮現動畫、相簿燈箱，以及首頁的捲動效果
const LINKS = {
  email: 'mailto:r66151076@gs.ncku.edu.tw',
  linkedin: 'https://www.linkedin.com/in/tiffanyhuang0',
  medium: 'https://medium.com/@11047021',
  github: 'https://github.com/11047021-commits',
};
const page = document.body.dataset.page;
const MORE = ['experience', 'exchange', 'certificates', 'volunteer'];

/* ── 導覽列（產品頁跟範本一樣只有返回鍵，不放導覽列） ── */
if (page !== 'products') {
  const a = (href, id, zh, en, cls = '') =>
    `<a href="${href}" class="${[id === page ? 'active' : '', cls].join(' ').trim()}" data-en="${en}">${zh}</a>`;
  document.body.insertAdjacentHTML('afterbegin', `
  <nav class="nav" id="mainnav">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">Tiffany<span>.</span></a>
      <button class="menu-toggle" id="menuBtn" aria-label="Menu"><i class="fas fa-bars"></i></button>
      <div class="nav-links-wrap" id="navWrap">
        <ul class="nav-links">
          <li>${a('index.html', 'index', '首頁', 'Home')}</li>
          <li>${a('projects.html', 'projects', '專案作品', 'Projects')}</li>
          <li>${a('competitions.html', 'competitions', '競賽經歷', 'Competitions')}</li>
          <li>${a('products.html', 'products', '產品與系統作品', 'Product &amp; Systems', 'nav-moi')}</li>
          <li class="nav-drop">
            <button class="drop-btn ${MORE.includes(page) ? 'active' : ''}"><span data-en="More">更多</span> <i class="fas fa-chevron-down" style="font-size:.48rem"></i></button>
            <div class="drop-menu">
              ${a('experience.html', 'experience', '實習經歷', 'Internship')}
              ${a('exchange.html', 'exchange', '國際交流', 'Cultural Exchange')}
              ${a('certificates.html', 'certificates', '專業證照', 'Certificates')}
              ${a('volunteer.html', 'volunteer', '社團與志工', 'Clubs &amp; Volunteer')}
            </div>
          </li>
        </ul>
        <div class="lang-switch">
          <button class="lang-btn" data-lang="en">EN</button><span>/</span><button class="lang-btn" data-lang="zh">中</button>
        </div>
        <a href="resume.pdf" target="_blank" rel="noopener" class="nav-cv" data-en="Download CV">下載履歷</a>
      </div>
    </div>
  </nav>`);

  const menuBtn = document.getElementById('menuBtn');
  const navWrap = document.getElementById('navWrap');
  menuBtn.onclick = () => {
    navWrap.classList.toggle('open');
    menuBtn.innerHTML = navWrap.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  };
  window.addEventListener('scroll', () => {
    document.getElementById('mainnav').classList.toggle('scrolled', scrollY > 20);
  });
}

/* ── 頁尾 ── */
document.body.insertAdjacentHTML('beforeend', `
  <div class="foot-bar">
    <div class="foot-icons">
      <a href="${LINKS.email}" aria-label="Email"><i class="fas fa-envelope"></i></a>
      <a href="${LINKS.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
      <a href="${LINKS.medium}" target="_blank" rel="noopener" aria-label="Medium"><i class="fab fa-medium"></i></a>
      <a href="${LINKS.github}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
    </div>
  </div>
  <footer class="foot-bottom"><span data-en="© 2026 Yi-Chen (Tiffany) Huang — NCKU International Business">© 2026 黃翊禎 Tiffany Huang — 國立成功大學 國際企業研究所</span></footer>`);

/* ── 中英切換：每個要翻譯的元素把英文放在 data-en，中文就是原本內容 ── */
function setLang(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.zh;
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  try { localStorage.setItem('lang', lang); } catch (e) {}
}
document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
let savedLang = 'zh';
try { savedLang = localStorage.getItem('lang') || 'zh'; } catch (e) {}
setLang(savedLang);

/* ── 浮現動畫 ── */
const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── 相簿燈箱：同一個 data-gallery 的圖片可以左右切換 ── */
const triggers = document.querySelectorAll('.lb-trigger');
if (triggers.length) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="lightbox-overlay" id="lightbox">
      <span class="lightbox-close" id="lbClose">&times;</span>
      <div class="lightbox-content">
        <div class="lightbox-nav lightbox-prev" id="lbPrev"><i class="fas fa-chevron-left"></i></div>
        <img class="lightbox-image" id="lbImg" alt="">
        <div class="lightbox-nav lightbox-next" id="lbNext"><i class="fas fa-chevron-right"></i></div>
      </div>
    </div>`);
  const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg');
  let gallery = [], idx = 0;
  const show = () => { lbImg.src = gallery[idx]; };
  const close = () => { lb.classList.remove('active'); document.body.style.overflow = ''; };
  triggers.forEach(img => img.addEventListener('click', () => {
    gallery = [...new Set([...document.querySelectorAll(`.lb-trigger[data-gallery="${img.dataset.gallery}"]`)].map(el => el.src))];
    idx = gallery.indexOf(img.src);
    show();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }));
  const step = d => { idx = (idx + d + gallery.length) % gallery.length; show(); };
  document.getElementById('lbPrev').onclick = e => { e.stopPropagation(); step(-1); };
  document.getElementById('lbNext').onclick = e => { e.stopPropagation(); step(1); };
  document.getElementById('lbClose').onclick = close;
  lb.onclick = e => { if (e.target === lb || e.target.classList.contains('lightbox-content')) close(); };
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ── 首頁：照片旁 hashtag 依捲動亮起、作品卡片橫向捲動、底部浮動選單 ── */
if (page === 'index') {
  const tabIds = ['home', 'about', 'projects', 'pro', 'metrics'];
  const tabs = document.querySelectorAll('.ftab');
  tabs.forEach((t, i) => t.addEventListener('click', () => document.getElementById(tabIds[i]).scrollIntoView({ behavior: 'smooth' })));

  const onScroll = () => {
    const sec = document.querySelector('.photo-reveal-section');
    const r = sec.getBoundingClientRect();
    const prog = Math.max(0, Math.min(1, -r.top / Math.max(1, sec.offsetHeight - innerHeight)));
    const light = el => {
      const i = +el.dataset.idx;
      return Math.max(0, Math.min(1, (prog - i / 4) * 4));
    };
    document.querySelectorAll('.htag').forEach(h => {
      const l = innerWidth <= 1024 ? 1 : light(h);
      h.style.color = `rgba(0,100,200,${0.1 + l * 0.9})`;
      h.style.textShadow = l > .05 ? `0 0 ${12 * l}px rgba(0,120,212,${0.35 * l})` : 'none';
    });
    document.querySelectorAll('.hpill').forEach(p => {
      const l = innerWidth <= 1024 ? 1 : light(p);
      p.style.color = `rgba(0,100,200,${0.25 + l * 0.75})`;
      p.style.borderColor = `rgba(0,100,200,${0.15 + l * 0.65})`;
      p.style.background = `rgba(0,100,200,${0.03 + l * 0.07})`;
    });

    const track = document.getElementById('cardsTrack');
    if (innerWidth <= 1024) { track.style.transform = 'none'; }
    else {
      const wrap = document.querySelector('.hscroll-wrap');
      const w = wrap.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -w.top / (wrap.offsetHeight - innerHeight)));
      const max = Math.max(0, track.scrollWidth - innerWidth + 88);
      track.style.transform = `translateX(-${p * max}px)`;
    }

    document.getElementById('floatTabs').classList.toggle('show', scrollY > innerHeight * .5);
    let cur = '';
    tabIds.forEach(id => {
      const b = document.getElementById(id).getBoundingClientRect();
      if (b.top <= innerHeight * .5 && b.bottom > 0) cur = id;
    });
    tabs.forEach((t, i) => t.classList.toggle('active', tabIds[i] === cur));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
