/* ========================
   PROFESSIONAL HELP
======================== */
let currentTherapist = '';
let currentTherapistPrice = 0;

const therapists = {
  sari: {
    name: 'Dr. Sari Wijaya, M.Psi., Psikolog',
    img: 'assets/sariwijaya.jpeg',
    spec: 'Anxiety Specialist',
    edu: 'Harvard University - Clinical Psychology',
    cert: 'Licensed Clinical Psychologist (LCP)',
    rating: '4.9 ★',
    price: 'Rp150.000 / session',
    priceNum: 150000
  },
  ella: {
    name: 'Dr. Rafaela Putri, M.Psi., Psikolog',
    img: 'assets/ella.jpeg',
    spec: 'Clinical Psychologist - Trauma Healing Specialist',
    edu: 'SCU - Psychology',
    cert: 'Certified Trauma Therapist',
    rating: '4.8 ★',
    price: 'Rp180.000 / session',
    priceNum: 180000
  },
  sarah: {
    name: 'Dr. Sarah Pratiwi, M.Psi., Psikolog',
    img: 'assets/sarah.jpeg',
    spec: 'NLP Therapist - Mindfulness Coach',
    edu: 'UAJ - Psychology',
    cert: 'Certified NLP Practitioner',
    rating: '4.7 ★',
    price: 'Rp160.000 / session',
    priceNum: 160000
  }
};

let sessionType = '';

function selectType(type) {
  sessionType = type;
  document.getElementById('onlineBtn').classList.toggle('active', type === 'online');
  document.getElementById('offlineBtn').classList.toggle('active', type === 'offline');
}

function openTherapist(id) {
  const t = therapists[id];
  currentTherapist = t.name;
  currentTherapistPrice = t.priceNum;
  document.getElementById('therapistModal').style.display = 'flex';
  document.getElementById('t-img').src = t.img;
  document.getElementById('t-name').innerText = t.name;
  document.getElementById('t-spec').innerText = t.spec;
  document.getElementById('t-edu').innerText = t.edu;
  document.getElementById('t-cert').innerText = t.cert;
  document.getElementById('t-rating').innerText = t.rating;
  document.getElementById('t-price').innerText = t.price;
}

function closeModal() { document.getElementById('therapistModal').style.display = 'none'; }

function openBooking() {
  if (!CSUser.isLoggedIn()) {
    showLoginRequired('counseling');
    return;
  }
  document.getElementById('bookingModal').style.display = 'flex';
  document.getElementById('book-therapist').innerText = 'Therapist: ' + currentTherapist;
}

function closeBooking() { document.getElementById('bookingModal').style.display = 'none'; }

function confirmBooking() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('schedule').value;
  const payment = document.getElementById('payment').value;

  if (!name || !email || !date) {
    showPopup('Please complete all required fields', 'error');
    return;
  }
  if (!sessionType) {
    showPopup('Please select a session type first', 'error');
    return;
  }

  const bookingId = 'CS' + Math.floor(Math.random() * 99999);

  let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.push({ id: bookingId, therapist: currentTherapist, date, schedule: time, type: sessionType, payment, name });
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Track in stats
  if (typeof CSUser !== 'undefined') CSUser.addClass();

  closeBooking();
  closeModal();

  // Show receipt popup
  showReceiptModal({
    subtitle: 'Consultation Booking Receipt',
    chatId: 'consult_' + bookingId,
    rows: [
      { label: 'Booking ID', value: bookingId },
      { label: 'Name', value: name },
      { label: 'Therapist', value: currentTherapist },
      { label: 'Session Type', value: sessionType === 'online' ? 'Online' : 'Offline' },
      { label: 'Date', value: date },
      { label: 'Time', value: time },
      { label: 'Payment', value: payment },
      { label: 'Total', value: 'Rp ' + currentTherapistPrice.toLocaleString('id-ID') }
    ]
  });

  showPopup('Booking confirmed! See you soon', 'success', 4000);
}

function closeReceipt() { document.getElementById('receiptModal').style.display = 'none'; }
