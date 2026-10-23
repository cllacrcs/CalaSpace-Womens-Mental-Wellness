/* ========================
   REGISTER PAGE
======================== */

function registerUser() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !email || !password) {
    showPopup('Please fill in all fields', 'error');
    return;
  }

  const user = { name: username, email, password };
  localStorage.setItem('csUser', JSON.stringify(user));
  localStorage.setItem('username', username);
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
  // Reset stats for new account
  localStorage.removeItem('csStats');

  showPopup('Account created successfully Please log in!', 'success', 2500);
  setTimeout(() => { window.location.href = 'login.html'; }, 2600);
}
