/* ========================
   CALASPACE — GLOBAL UTILITIES
   Handles: popup alerts, user session, navbar init, profile stats
======================== */

/* ── POPUP / TOAST (replaces all alert()) ── */
window.showPopup = function(message, type = 'info', duration = 3500) {
  // Remove existing popup
  const existing = document.getElementById('cs-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'cs-popup';
  popup.className = 'cs-popup cs-popup--' + type;
  popup.innerHTML = `<span class="cs-popup-msg">${message}</span><button class="cs-popup-close" onclick="this.parentElement.remove()">✕</button>`;
  document.body.appendChild(popup);

  // Animate in
  requestAnimationFrame(() => popup.classList.add('cs-popup--show'));

  if (duration > 0) {
    setTimeout(() => {
      popup.classList.remove('cs-popup--show');
      setTimeout(() => popup.remove(), 400);
    }, duration);
  }
};

/* Override native alert */
window._nativeAlert = window.alert;
window.alert = function(msg) {
  window.showPopup(msg, 'info');
};

/* ── USER SESSION ── */
window.CSUser = {
  get: () => JSON.parse(localStorage.getItem('csUser') || 'null'),
  set: (u) => localStorage.setItem('csUser', JSON.stringify(u)),
  clear: () => {
    localStorage.removeItem('csUser');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('csStats');
    localStorage.removeItem('cart');
    localStorage.removeItem('journals');
    localStorage.removeItem('classOrders');
    localStorage.removeItem('bookings');
    localStorage.removeItem('reminders');
    localStorage.removeItem('communityPosts');
  },
  isLoggedIn: () => !!localStorage.getItem('loggedIn'),

  /* Profile stats */
  getStats: () => JSON.parse(localStorage.getItem('csStats') || '{"days":0,"journals":0,"classes":0,"community":0,"joinedAt":null}'),
  setStats: (s) => localStorage.setItem('csStats', JSON.stringify(s)),
  initStats: () => {
    const existing = localStorage.getItem('csStats');
    if (!existing) {
      const stats = { days: 1, journals: 0, classes: 0, community: 0, joinedAt: Date.now() };
      localStorage.setItem('csStats', JSON.stringify(stats));
    }
  },
  addJournal: () => {
    const s = CSUser.getStats(); s.journals++; CSUser.setStats(s);
  },
  addClass: () => {
    const s = CSUser.getStats(); s.classes++; CSUser.setStats(s);
  },
  addCommunity: () => {
    const s = CSUser.getStats(); s.community++; CSUser.setStats(s);
  },
  getDays: () => {
    const s = CSUser.getStats();
    if (!s.joinedAt) return 1;
    return Math.max(1, Math.floor((Date.now() - s.joinedAt) / 86400000) + 1);
  }
};

/* ── DARK MODE ── */
window.CSTheme = {
  isDark: () => localStorage.getItem('csDarkMode') === '1',
  apply: () => {
    if (CSTheme.isDark()) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    document.querySelectorAll('.dark-toggle').forEach(btn => {
      btn.innerHTML = CSTheme.isDark() ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.title = CSTheme.isDark() ? 'Light Mode' : 'Dark Mode';
    });
  },
  toggle: () => {
    localStorage.setItem('csDarkMode', CSTheme.isDark() ? '0' : '1');
    CSTheme.apply();
  }
};
CSTheme.apply();

/* ── NAVBAR INIT ── */
document.addEventListener('DOMContentLoaded', function () {

  /* Apply dark mode after DOM ready */
  CSTheme.apply();

  /* Update navbar profile avatar to lavender default */
  document.querySelectorAll('.nav-avatar').forEach(img => {
    const savedAvatar = CSUser.get() && CSUser.get().avatar;
    img.src = savedAvatar || 'assets/lavender.png';
  });

  /* Update navbar profile name & dropdown */
  const user = CSUser.get();
  const profileSpans = document.querySelectorAll('.profile-btn span:not(.dropdown-arrow)');
  profileSpans.forEach(s => {
    if (user && user.name) s.textContent = user.name.split(' ')[0];
  });

  /* Profile dropdown — fix: use mousedown to prevent blur race */
  document.querySelectorAll('.profile-dropdown').forEach(pd => {
    const btn = pd.querySelector('.profile-btn');
    if (!btn) return;
    btn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      document.querySelectorAll('.profile-dropdown').forEach(o => {
        if (o !== pd) o.classList.remove('active');
      });
      pd.classList.toggle('active');
    });
  });

  document.addEventListener('mousedown', (e) => {
    document.querySelectorAll('.profile-dropdown').forEach(pd => {
      if (!pd.contains(e.target)) pd.classList.remove('active');
    });
  });

  /* Dark mode toggle buttons */
  document.querySelectorAll('.dark-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); CSTheme.toggle(); });
  });

  /* Hamburger */
  window.toggleMenu = function () {
    const menu = document.getElementById('dropdownMenu');
    if (menu) menu.classList.toggle('open');
  };
  document.addEventListener('click', function (e) {
    const wrapper = document.querySelector('.menu-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      const menu = document.getElementById('dropdownMenu');
      if (menu) menu.classList.remove('open');
    }
  });

  /* Help modal */
  window.openHelpModal = () => { const m = document.getElementById('helpModal'); if (m) m.style.display = 'flex'; };
  window.closeHelpModal = () => { const m = document.getElementById('helpModal'); if (m) m.style.display = 'none'; };

  /* Active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const parentPage = { 'pilates.html':'healing-hub.html','flowerarrangement.html':'healing-hub.html','candletherapy.html':'healing-hub.html','pottery.html':'healing-hub.html','relationship-check.html':'index.html' };
  const activePath = parentPage[path] || path;
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === activePath) a.classList.add('active');
  });

  /* Page transition: fade in */
  document.body.classList.add('page-ready');

  /* Intercept nav link clicks for smooth transition */
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });

  /* Logout link: clear session */
  document.querySelectorAll('a.logout-link, .footer-col a[href="login.html"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      CSUser.clear();
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = 'login.html'; }, 280);
    });
  });

});

/* ── RECEIPT POPUP MODAL ── */
window.showReceiptModal = function(data) {
  const existing = document.getElementById('cs-receipt-modal');
  if (existing) existing.remove();

  /* Build chat link based on receipt type */
  let chatHref = 'chat.html';
  if (data.chatId) {
    chatHref = 'chat.html?open=' + encodeURIComponent(data.chatId);
  }

  /* Determine chat button label */
  const isConsultation = (data.subtitle || '').toLowerCase().includes('consultation');
  const chatLabel = isConsultation ? 'Chat with Psychologist' : 'Chat with Class Organizer';

  const modal = document.createElement('div');
  modal.id = 'cs-receipt-modal';
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="receipt-paper" style="position:relative;max-width:420px;width:90%;">
      <button class="close-modal" onclick="document.getElementById('cs-receipt-modal').remove()" style="position:absolute;top:12px;right:12px;">✕</button>
      <div class="receipt-header">
        <h2>CALASPACE</h2>
        <p>${data.subtitle || 'Transaction Receipt'}</p>
        <div class="dash"></div>
      </div>
      <div class="receipt-body">
        ${data.rows.map(r => `<div class="receipt-row"><span>${r.label}</span><span>${r.value}</span></div>`).join('')}
      </div>
      <div class="dash"></div>
      <div class="receipt-footer">
        <p>Thank you for trusting your healing journey</p>
        <div style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <a href="reminder.html" class="receipt-link receipt-link--soft">View Reminder</a>
          <a href="${chatHref}" class="receipt-link receipt-link--solid">${chatLabel}</a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.querySelector('.receipt-paper').style.animation = 'receiptSlide 0.4s ease');
};

/* ── LOGIN REQUIRED MODAL ── */
window.showLoginRequired = function(feature) {
  const existing = document.getElementById('cs-login-required-overlay');
  if (existing) existing.remove();

  const featureMessages = {
    'healing-class': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', title: 'Login Required', desc: 'You need to be logged in to book a Healing Class. Join CalaSpace to start your healing journey!' },
    'counseling': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', title: 'Login Required', desc: 'Please log in to book a counseling session with our therapists. Your healing journey starts here.' },
    'streak': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>', title: 'Login Required', desc: 'Log in to track your Daily Healing Streak and see your progress calendar!' },
    'journal': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', title: 'Login Required', desc: 'Please log in to write and save your personal journal entries. Your space, your thoughts.' },
    'community': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Login Required', desc: 'Log in to share your thoughts in the Community. You are not alone — thousands of women are here with you.' },
    'profile': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', title: 'Login Required', desc: 'Please log in to view your profile, healing history and bookings.' },
    'default': { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', title: 'Login Required', desc: 'Please log in to access this feature. It only takes a moment!' }
  };

  const info = featureMessages[feature] || featureMessages['default'];

  const overlay = document.createElement('div');
  overlay.id = 'cs-login-required-overlay';
  overlay.className = 'cs-login-required-overlay';
  overlay.innerHTML = `
    <div class="cs-login-required-box">
      <div class="modal-icon">${info.icon}</div>
      <h3>${info.title}</h3>
      <p>${info.desc}</p>
      <div class="modal-btns">
        <button class="btn-login-now" onclick="window.location.href='login.html'">Log In Now</button>
        <button class="btn-cancel-modal" onclick="document.getElementById('cs-login-required-overlay').remove()">Maybe Later</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.remove();
  });
};

/* ── EMPTY CART POPUP ── */
window.showEmptyCartPopup = function() {
  const existing = document.getElementById('cs-empty-cart-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cs-empty-cart-overlay';
  overlay.className = 'cs-empty-cart-overlay';
  overlay.innerHTML = `
    <div class="cs-empty-cart-box">
      <div class="modal-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
      <h3>Your Cart is Empty</h3>
      <p>Add a healing class or session to your cart before proceeding to checkout.</p>
      <div class="modal-btns">
        <a href="healing-hub.html" class="receipt-link receipt-link--solid">Explore Classes</a>
        <button onclick="document.getElementById('cs-empty-cart-overlay').remove()" class="receipt-link receipt-link--soft">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.remove();
  });
};


/* ── SCROLL REVEAL ── */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const SEL = '.page-header, .hero-card, .featured-redflag, .widget, .trending-widget, .trend-card, .class-card, .therapist-card, ' +
    '.studio-card, .flower-card, .thread-composer, .thread-card, .journal-box, .journal-entry, .reminder-card, .cart-item, ' +
    '.checkout-box, .checkout-form-card, .profile-card, .city-dropdown, .chat-page-layout, .question-box, .progress-wrapper, ' +
    '.empty-state, .footer-brand, .footer-col';
  const io = new IntersectionObserver((entries) => {
    let i = 0;
    entries.filter(e => e.isIntersecting).forEach(e => {
      const el = e.target;
      io.unobserve(el);
      el.style.transitionDelay = Math.min(i++ * 80, 400) + 'ms';
      requestAnimationFrame(() => el.classList.add('cs-in'));
      setTimeout(() => { el.classList.remove('cs-reveal', 'cs-in'); el.style.transitionDelay = ''; }, 1300);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function watch(el) {
    if (el.dataset.csWatched || el.closest('.modal, .cala-floating, .navbar')) return;
    el.dataset.csWatched = '1';
    el.classList.add('cs-reveal');
    io.observe(el);
  }
  function scan(root) {
    if (root.matches && root.matches(SEL)) watch(root);
    root.querySelectorAll && root.querySelectorAll(SEL).forEach(watch);
  }
  function start() {
    scan(document.body);
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); })))
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
