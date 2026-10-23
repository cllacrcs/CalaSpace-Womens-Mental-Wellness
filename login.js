/* ========================
   LOGIN PAGE
======================== */

function loginUser() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const savedEmail = localStorage.getItem('email');
  const savedPassword = localStorage.getItem('password');
  const csUser = JSON.parse(localStorage.getItem('csUser') || 'null');

  if (!email || !password) {
    showPopup('Please enter your email and password', 'error');
    return;
  }

  let user = null;

  // Check csUser (new format)
  if (csUser && csUser.email === email && csUser.password === password) {
    user = csUser;
  }
  // Check old format localStorage
  else if (savedEmail && savedEmail === email && savedPassword === password) {
    const name = localStorage.getItem('username') || email.split('@')[0];
    user = { name, email, password };
    localStorage.setItem('csUser', JSON.stringify(user));
  }

  if (user) {
    localStorage.setItem('loggedIn', 'true');
    // Reset stats on new login
    CSUser.initStats();
    document.body.classList.add('page-exit');
    setTimeout(() => { window.location.href = 'index.html'; }, 280);
  } else {
    const known = (csUser && csUser.email === email) || (savedEmail && savedEmail === email);
    if (!known) showAccountNotFound(email);
    else showPopup('Incorrect password. Please try again.', 'error');
  }
}
