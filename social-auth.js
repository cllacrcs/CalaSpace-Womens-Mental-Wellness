/* Social sign-in (Google / Apple) + account-not-found prompt.
   Front-end simulation: a real integration needs a backend / OAuth client ID. */
(function () {
  function close() { const o = document.getElementById('cs-social-overlay'); if (o) o.remove(); }
  function box(inner) {
    close();
    const o = document.createElement('div');
    o.id = 'cs-social-overlay';
    o.className = 'cs-login-required-overlay';
    o.innerHTML = '<div class="cs-login-required-box">' + inner + '</div>';
    document.body.appendChild(o);
    o.addEventListener('click', e => { if (e.target === o) close(); });
    return o;
  }
  const userIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  window.showAccountNotFound = function (email) {
    box('<div class="modal-icon">' + userIcon + '</div><h3>No account found</h3>' +
      '<p>We could not find an account' + (email ? ' for <b>' + email.replace(/</g, '&lt;') + '</b>' : '') + '. Please create an account first to start your healing journey.</p>' +
      '<div class="modal-btns"><button class="btn-login-now" onclick="window.location.href=\'register.html\'">Create Account</button>' +
      '<button class="btn-cancel-modal" onclick="document.getElementById(\'cs-social-overlay\').remove()">Try Again</button></div>');
  };

  function finishLogin(user) {
    localStorage.setItem('csUser', JSON.stringify(user));
    localStorage.setItem('loggedIn', 'true');
    if (window.CSUser) CSUser.initStats();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = 'index.html'; }, 280);
  }

  window.socialAuth = function (provider, mode) {
    const reg = mode === 'register';
    const o = box('<h3>Continue with ' + provider + '</h3>' +
      '<p>' + (reg ? 'Create your CalaSpace account with ' : 'Sign in to CalaSpace with ') + provider + '.</p>' +
      (reg ? '<input class="cs-social-input" id="cs-soc-name" placeholder="Your name">' : '') +
      '<input class="cs-social-input" id="cs-soc-email" type="email" placeholder="' + provider + ' email address">' +
      '<div class="modal-btns"><button class="btn-login-now" id="cs-soc-go">Continue</button>' +
      '<button class="btn-cancel-modal" onclick="document.getElementById(\'cs-social-overlay\').remove()">Cancel</button></div>');
    o.querySelector('#cs-soc-go').onclick = function () {
      const email = o.querySelector('#cs-soc-email').value.trim();
      const nameEl = o.querySelector('#cs-soc-name');
      const name = nameEl ? nameEl.value.trim() : '';
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showPopup('Please enter a valid email address', 'error'); return; }
      const existing = JSON.parse(localStorage.getItem('csUser') || 'null');
      const found = existing && existing.email === email;
      if (reg) {
        if (!name) { showPopup('Please enter your name', 'error'); return; }
        if (found) { close(); showPopup('This email is already registered. Please log in.', 'info', 2500); setTimeout(() => { window.location.href = 'login.html'; }, 2600); return; }
        localStorage.removeItem('csStats');
        finishLogin({ name, email, password: '', provider });
      } else {
        if (!found) { close(); showAccountNotFound(email); return; }
        finishLogin(existing);
      }
    };
  };
})();
