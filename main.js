document.addEventListener("DOMContentLoaded", () => {

/* =========================
SAFE INIT WRAPPER
========================= */

const user = JSON.parse(localStorage.getItem("calaspaceUser"));
const greeting = document.getElementById("greeting");

if (greeting && user) {
  greeting.innerHTML = `Welcome back, ${user.name}`;
}

/* =========================
MOOD SYSTEM
========================= */

const moodMessages = {
  happy: [
    "I’m so happy you’re feeling good today. Celebrate your little wins",
    "You’re glowing today, keep it going!",
    "This happiness looks good on you!"
  ],
  neutral: [
    "Slow days are valid too. You don’t need to rush your healing.",
    "It’s okay to just exist today.",
    "Not every day has to be productive."
  ],
  sad: [
    "It’s okay to cry and rest. You are not a burden.",
    "You’re allowed to feel this deeply.",
    "Healing takes time, and that’s okay."
  ],
  anxious: [
    "Take a deep breath. You are safe right now.",
    "You don’t have to solve everything today.",
    "One step at a time, you’re doing fine."
  ],
  angry: [
    "Your feelings are valid. Let it out gently.",
    "It’s okay to feel angry.",
    "You are still in control."
  ]
};

window.selectMood = function (mood, el) {
  const quote = document.getElementById("moodQuote");
  const buttons = document.querySelectorAll(".mood-btn");

  if (!quote) return;

  buttons.forEach(b => b.classList.remove("active"));
  el.classList.add("active");

  const msg = moodMessages[mood];
  const text = msg[Math.floor(Math.random() * msg.length)];

  quote.style.opacity = 0;

  setTimeout(() => {
    quote.innerHTML = text;
    quote.style.opacity = 1;
  }, 200);

  localStorage.setItem("moodQuote", text);
};

/* =========================
HEALING STREAK + CALENDAR
========================= */

const today = new Date();
// Per-user streak key
const _loggedIn = !!localStorage.getItem('loggedIn');
function getStreakKey() {
  const u = JSON.parse(localStorage.getItem('csUser') || 'null');
  return 'healingDays_' + (u ? (u.email || u.username || 'guest') : 'guest');
}
let streakDays = _loggedIn ? (JSON.parse(localStorage.getItem(getStreakKey())) || []) : [];

const streakCount = document.getElementById("streakCount");
const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function renderCalendar(month, year) {
  if (!calendarGrid || !calendarTitle) return;

  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  calendarTitle.innerHTML = `${monthNames[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= totalDays; day++) {
    const div = document.createElement("div");
    div.className = "calendar-day";
    div.innerHTML = day;

    const dateKey = `${year}-${month + 1}-${day}`;

    if (streakDays.includes(dateKey)) {
      div.classList.add("active");
      div.classList.add("streak-done");
    }

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    calendarGrid.appendChild(div);
  }
}

function updateStreak() {
  if (!streakCount) return;
  streakCount.innerHTML = `${streakDays.length} <small>${streakDays.length === 1 ? "day" : "days"}</small>`;
}

window.markTodayHealing = function () {
  if (!CSUser.isLoggedIn()) {
    showLoginRequired('streak');
    return;
  }
  const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  if (!streakDays.includes(key)) {
    streakDays.push(key);
    localStorage.setItem(getStreakKey(), JSON.stringify(streakDays));

    updateStreak();
    renderCalendar(currentMonth, currentYear);
  }
};

window.nextMonth = function () {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
};

window.prevMonth = function () {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
};

/* =========================
AFFIRMATION SLIDER (FORCED FIX)
========================= */

let current = 0;

const slides = document.querySelectorAll(".affirmation-slide");

function syncDots(i) {
  const dots = document.querySelectorAll(".affirmation-dots .dot");
  dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
}

function show(i) {
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove("active"));
  slides[i].classList.add("active");
  current = i;
  syncDots(i);
}

window.showAffirmation = function(i) { show(i); };

window.nextAffirmation = function () {
  if (!slides.length) return;
  current = (current + 1) % slides.length;
  show(current);
};

window.prevAffirmation = function () {
  if (!slides.length) return;
  current = (current - 1 + slides.length) % slides.length;
  show(current);
};

setInterval(() => {
  if (slides.length) nextAffirmation();
}, 5000);

/* =========================
INIT AFTER DOM READY
========================= */

const saved = localStorage.getItem("moodQuote");
const moodQuote = document.getElementById("moodQuote");

if (saved && moodQuote) {
  moodQuote.innerHTML = saved;
}

renderCalendar(currentMonth, currentYear);
updateStreak();

/* Profile dropdown handled by global.js */

});
/* ── DYNAMIC GREETING ── */
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('csUser') || 'null');
  const name = user ? user.name.split(' ')[0] : 'Beautiful';
  const hour = new Date().getHours();
  const greetWord = hour < 11 ? 'Good morning' : hour < 15 ? 'Good afternoon' : hour < 18 ? 'Good evening' : 'Good night';
  const g = document.getElementById('cs-greeting');
  if (g) g.textContent = greetWord + ', ' + name;
  const sn = document.getElementById('cs-streak-name');
  if (sn) sn.textContent = 'Keep going, ' + name + '. Every day counts.';
});
