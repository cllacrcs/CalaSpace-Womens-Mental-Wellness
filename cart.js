let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, classType) {
  if (!CSUser.isLoggedIn()) {
    showLoginRequired('healing-class');
    return false;
  }
  cart.push({ name, price, classType: classType || 'Healing Class' });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (typeof showPopup === 'function') {
    showPopup(name + ' added to cart', 'success');
  }
  return true;
}

function updateCartCount() {
  document.querySelectorAll('#cart-count').forEach(el => { el.innerText = cart.length; });
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  let total = 0;
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-note">Your cart is empty<br><small>Explore our healing classes to get started.</small></div>';
    const t = document.getElementById('cart-total');
    if (t) t.innerText = '0';
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <h3>${item.name}</h3>
      <p>Rp ${item.price.toLocaleString('id-ID')}</p>
      <button onclick="removeItem(${index})">Remove</button>`;
    container.appendChild(el);
  });

  const t = document.getElementById('cart-total');
  if (t) t.innerText = total.toLocaleString('id-ID');
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function proceedCheckout() {
  if (cart.length === 0) {
    showEmptyCartPopup();
    return;
  }
  window.location.href = 'checkout.html';
}

updateCartCount();
renderCart();
