/* ========================
   CHECKOUT PAGE
======================== */

function payNow() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const payment = document.getElementById('payment').value;

  if (!name || !email) {
    showPopup('Please fill in your name and email', 'error');
    return;
  }

  if (!payment) {
    showPopup('Please choose a payment method', 'error');
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  const receiptId = 'CS' + Math.floor(Math.random() * 99999);
  const total = cartItems.reduce((sum, i) => sum + (i.price || 0), 0);

  const receipt = { id: receiptId, name, payment, total };
  localStorage.setItem('receipt', JSON.stringify(receipt));

  /* Save class orders for Reminder */
  let classOrders = JSON.parse(localStorage.getItem('classOrders')) || [];
  cartItems.forEach(item => {
    classOrders.push({
      name: item.name,
      price: item.price || 0,
      classType: item.classType || 'Healing Class',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      payment,
      id: receiptId
    });
  });
  localStorage.setItem('classOrders', JSON.stringify(classOrders));

  // Track classes in stats
  if (typeof CSUser !== 'undefined') {
    cartItems.forEach(() => CSUser.addClass());
  }

  /* Clear cart */
  localStorage.removeItem('cart');

  /* Show receipt popup */
  const rows = [
    { label: 'Booking ID', value: receiptId },
    { label: 'Name', value: name },
    { label: 'Email', value: email },
    { label: 'Payment Method', value: payment },
    ...cartItems.map(i => ({ label: i.name, value: 'Rp ' + (i.price || 0).toLocaleString('id-ID') })),
    { label: 'Total', value: 'Rp ' + total.toLocaleString('id-ID') }
  ];

  showReceiptModal({ subtitle: 'Healing Class Receipt', chatId: 'class_' + receiptId, rows });
  showPopup('Payment successful! Happy healing', 'success', 4000);
}
