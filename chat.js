/* ========================
   CHAT PAGE
======================== */

let activeConversationId = null;

/* Load all bookings and class orders to build conversation list */
function loadConversations() {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const classOrders = JSON.parse(localStorage.getItem('classOrders')) || [];
  const list = document.getElementById('chatConversationList');
  const emptyMsg = document.getElementById('chatEmptySidebar');

  if (!list) return;

  const all = [
    ...bookings.map(b => ({
      id: 'consult_' + b.id,
      type: 'consultation',
      name: b.therapist,
      subtitle: b.type === 'online' ? 'Online Session' : 'Offline Session',
      date: b.date,
      badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      badgeClass: 'badge-purple'
    })),
    ...classOrders.map(c => ({
      id: 'class_' + c.id,
      type: 'class',
      name: c.name || c.className || 'Healing Class',
      subtitle: c.classType || 'Healing Class',
      date: c.date || 'Upcoming',
      badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      badgeClass: 'badge-pink'
    }))
  ];

  list.innerHTML = '';

  if (all.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'flex';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';

  all.forEach(item => {
    const messages = getChatMessages(item.id);
    const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
    const unread = getUnreadCount(item.id);

    const div = document.createElement('div');
    div.className = 'chat-conv-item' + (activeConversationId === item.id ? ' active' : '');
    div.setAttribute('data-id', item.id);
    div.innerHTML = `
      <div class="chat-conv-avatar">${item.badge}</div>
      <div class="chat-conv-info">
        <div class="chat-conv-top">
          <span class="chat-conv-name">${item.name}</span>
          ${unread > 0 ? `<span class="chat-unread-badge">${unread}</span>` : ''}
        </div>
        <div class="chat-conv-sub">
          <span class="badge ${item.badgeClass}" style="font-size:0.7rem;padding:2px 8px;">${item.subtitle}</span>
        </div>
        <div class="chat-conv-last">${lastMsg ? escapeHtml(lastMsg.text.substring(0, 45)) + (lastMsg.text.length > 45 ? '...' : '') : '<em class="chat-none">No messages yet</em>'}</div>
      </div>
    `;
    div.addEventListener('click', () => openConversation(item));
    list.appendChild(div);
  });
}

function openConversation(item) {
  activeConversationId = item.id;

  // Mark as read
  markAsRead(item.id);

  // Update sidebar active state
  document.querySelectorAll('.chat-conv-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-id') === item.id);
  });

  // Show chat window
  document.getElementById('chatPlaceholder').style.display = 'none';
  document.getElementById('chatActive').style.display = 'flex';

  // Set header
  const header = document.getElementById('chatWindowHeader');
  header.innerHTML = `
    <div class="chat-window-avatar">${item.badge}</div>
    <div class="chat-window-info">
      <h4>${escapeHtml(item.name)}</h4>
      <span class="badge ${item.badgeClass}" style="font-size:0.75rem;">${escapeHtml(item.subtitle)}</span>
      <small style="display:block;color:#aaa;margin-top:2px;">${escapeHtml(item.date)}</small>
    </div>
    <span class="chat-window-status">Active</span>
  `;

  // Render messages
  renderMessages(item.id);

  // Focus input
  const input = document.getElementById('chatInput');
  if (input) input.focus();

  // On mobile, hide sidebar
  if (window.innerWidth <= 768) {
    document.getElementById('chatSidebar').style.display = 'none';
  }
}

function renderMessages(convId) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const messages = getChatMessages(convId);

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="chat-msgs-empty">
        <div class="chat-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
        <p>No messages yet</p>
        <small>Start the conversation!</small>
      </div>
    `;
    return;
  }

  container.innerHTML = messages.map(msg => `
    <div class="chat-msg ${msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-other'}">
      <div class="chat-bubble">${escapeHtml(msg.text)}</div>
      <div class="chat-msg-time">${msg.time}</div>
    </div>
  `).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  if (!activeConversationId) return;

  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const messages = getChatMessages(activeConversationId);
  messages.push({ sender: 'user', text, time });
  saveChatMessages(activeConversationId, messages);

  input.value = '';
  renderMessages(activeConversationId);
  loadConversations();

  // Mark active item again
  document.querySelectorAll('.chat-conv-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-id') === activeConversationId);
  });
}

function handleChatEnter(event) {
  if (event.key === 'Enter') sendChatMessage();
}

/* ---- Purge expired conversations ---- */
function purgeExpiredChats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check bookings (consultations)
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const activeBookings = bookings.filter(b => {
    if (!b.date) return true; // no date = keep
    const d = new Date(b.date);
    return isNaN(d.getTime()) || d >= today; // keep if date is valid and not past
  });
  const expiredBookingIds = bookings
    .filter(b => b.date && !isNaN(new Date(b.date).getTime()) && new Date(b.date) < today)
    .map(b => b.id);

  // Check classOrders (healing classes)
  const classOrders = JSON.parse(localStorage.getItem('classOrders')) || [];
  const activeClassOrders = classOrders.filter(c => {
    if (!c.date) return true;
    // c.date format: "12 Mei 2026" (Indonesian locale) or ISO — try to parse
    const d = new Date(c.date);
    return isNaN(d.getTime()) || d >= today;
  });
  const expiredClassIds = classOrders
    .filter(c => c.date && !isNaN(new Date(c.date).getTime()) && new Date(c.date) < today)
    .map(c => c.id);

  // Remove expired chat messages and unread counts
  expiredBookingIds.forEach(id => {
    localStorage.removeItem('chat_consult_' + id);
    localStorage.removeItem('chat_unread_consult_' + id);
  });
  expiredClassIds.forEach(id => {
    localStorage.removeItem('chat_class_' + id);
    localStorage.removeItem('chat_unread_class_' + id);
  });

  // Update storage
  if (expiredBookingIds.length > 0) localStorage.setItem('bookings', JSON.stringify(activeBookings));
  if (expiredClassIds.length > 0) localStorage.setItem('classOrders', JSON.stringify(activeClassOrders));
}



function getChatMessages(convId) {
  const key = 'chat_' + convId;
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

function saveChatMessages(convId, messages) {
  const key = 'chat_' + convId;
  localStorage.setItem(key, JSON.stringify(messages));
}

function getUnreadCount(convId) {
  const key = 'chat_unread_' + convId;
  return parseInt(localStorage.getItem(key) || '0');
}

function markAsRead(convId) {
  localStorage.removeItem('chat_unread_' + convId);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', function() {
  purgeExpiredChats();
  loadConversations();

  // If ?open=ID in URL, auto-open that conversation
  const params = new URLSearchParams(window.location.search);
  const openId = params.get('open');
  if (openId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const classOrders = JSON.parse(localStorage.getItem('classOrders')) || [];

    const allItems = [
      ...bookings.map(b => ({
        id: 'consult_' + b.id,
        type: 'consultation',
        name: b.therapist,
        subtitle: b.type === 'online' ? 'Online Session' : 'Offline Session',
        date: b.date,
        badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        badgeClass: 'badge-purple'
      })),
      ...classOrders.map(c => ({
        id: 'class_' + c.id,
        type: 'class',
        name: c.name || c.className || 'Healing Class',
        subtitle: c.classType || 'Healing Class',
        date: c.date || 'Upcoming',
        badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        badgeClass: 'badge-pink'
      }))
    ];

    const found = allItems.find(i => i.id === openId);
    if (found) openConversation(found);
  }
});
