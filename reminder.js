/* ========================
   REMINDER PAGE
======================== */

function loadReminders() {
  const container = document.getElementById('reminderList');
  if (!container) return;

  /* Load both bookings (consultation) and classOrders (healing class checkout) */
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const classOrders = JSON.parse(localStorage.getItem('classOrders')) || [];

  container.innerHTML = '';

  const all = [
    ...bookings.map(b => ({ ...b, source: 'consultation' })),
    ...classOrders.map(c => ({ ...c, source: 'healing-class' }))
  ];

  if (all.length === 0) {
    container.innerHTML = "<p class='empty-note'>No upcoming healing sessions yet</p>";
    return;
  }

  all.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reminder-card';

    if (item.source === 'consultation') {
      const chatId = 'consult_' + item.id;
      card.innerHTML = `
        <div class="reminder-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
        <div class="reminder-info">
          <h3>${item.therapist}</h3>
          <p>${item.date || ''} ${item.schedule ? '• ' + item.schedule : ''}</p>
          <span class="badge badge-purple">${item.type || 'Consultation'}</span>
          <br>
          <a href="chat.html?open=${encodeURIComponent(chatId)}" class="chat-reminder-btn">Chat with Psychologist</a>
        </div>
      `;
    } else {
      const chatId = 'class_' + item.id;
      card.innerHTML = `
        <div class="reminder-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div class="reminder-info">
          <h3>${item.name || item.className || 'Healing Class'}</h3>
          <p>${item.date || 'Upcoming'} ${item.payment ? '• ' + item.payment : ''}</p>
          <span class="badge badge-pink">${item.classType || 'Healing Class'}</span>
          <br>
          <a href="chat.html?open=${encodeURIComponent(chatId)}" class="chat-reminder-btn">Chat with Class Organizer</a>
        </div>
      `;
    }

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadReminders);
