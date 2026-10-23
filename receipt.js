/* ========================
   RECEIPT PAGE
======================== */
document.addEventListener('DOMContentLoaded', function() {
  var receipt = JSON.parse(localStorage.getItem('receipt') || '{}');
  var box = document.getElementById('receipt-card');
  if (receipt && receipt.id) {
    box.innerHTML = '<h2>Booking ID: '+receipt.id+'</h2><p>Name: '+receipt.name+'</p><p>Payment: '+receipt.payment+'</p><p>Total: Rp '+receipt.total+'</p>';
  } else {
    box.innerHTML = '<p>No receipt found.</p>';
  }
});
