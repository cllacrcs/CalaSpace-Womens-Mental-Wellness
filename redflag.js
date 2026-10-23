/* =========================
RELATIONSHIP CHECK - redflag.js
========================= */

const questions = [
  {
    id: 1,
    text: "Does your partner often control who you can talk to or spend time with?",
    category: "control",
    weight: 3
  },

  {
    id: 2,
    text: "Has your partner ever dismissed your feelings or opinions?",
    category: "respect",
    weight: 2
  },

  {
    id: 3,
    text: "Do you feel afraid to be honest or disagree with them?",
    category: "fear",
    weight: 3
  },

  {
    id: 4,
    text: "Does your partner frequently blame you for relationship problems?",
    category: "blame",
    weight: 2
  },

  {
    id: 5,
    text: "Has your partner made you feel guilty for things that were not your fault?",
    category: "guilt",
    weight: 2
  },

  {
    id: 6,
    text: "Does your relationship feel warm, safe, and affectionate?",
    category: "positive",
    weight: 2,
    reverse: true
  },

  {
    id: 7,
    text: "Does your partner respect the boundaries you set?",
    category: "positive",
    weight: 3,
    reverse: true
  },

  {
    id: 8,
    text: "Has your partner threatened to leave whenever you argue?",
    category: "threat",
    weight: 3
  },

  {
    id: 9,
    text: "Do you feel happier and more emotionally healthy since being with them?",
    category: "positive",
    weight: 2,
    reverse: true
  },

  {
    id: 10,
    text: "Has your partner embarrassed or criticized you in front of others?",
    category: "humiliation",
    weight: 3
  },

  {
    id: 11,
    text: "Are conflicts usually solved with healthy communication?",
    category: "positive",
    weight: 2,
    reverse: true
  },

  {
    id: 12,
    text: "Has your partner checked your phone, messages, or private accounts without permission?",
    category: "privacy",
    weight: 3
  },

  {
    id: 13,
    text: "Do you feel comfortable being your authentic self around them?",
    category: "positive",
    weight: 2,
    reverse: true
  },

  {
    id: 14,
    text: "Does your partner suddenly switch from extremely sweet to cold or hurtful?",
    category: "lovebombing",
    weight: 3
  },

  {
    id: 15,
    text: "Does your partner support your dreams and personal goals?",
    category: "positive",
    weight: 2,
    reverse: true
  }
];

/* =========================
STATE
========================= */

let currentQ = 0;
let answers = [];

let totalScore = 0;
let maxScore = 0;

/* =========================
INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();
  updateProgress();
});

/* =========================
RENDER QUESTION
========================= */

function renderQuestion() {

  const q = questions[currentQ];

  const container = document.getElementById("question-container");

  container.style.opacity = 0;
  container.style.transform = "translateY(16px)";

  setTimeout(() => {

    document.getElementById("q-number").textContent =
      `Question ${currentQ + 1} of ${questions.length}`;

    document.getElementById("q-text").textContent = q.text;

    // reset selected button
    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.classList.remove("selected");
    });

    // restore previous answer
    if (answers[currentQ] !== undefined) {

      const val = answers[currentQ];

      document.querySelectorAll(".option-btn").forEach(btn => {

        if (parseInt(btn.dataset.value) === val) {
          btn.classList.add("selected");
        }

      });

    }

    container.style.transition = "0.4s ease";
    container.style.opacity = 1;
    container.style.transform = "translateY(0)";

  }, 150);

  // nav buttons
  document.getElementById("btn-prev").style.visibility =
    currentQ === 0 ? "hidden" : "visible";

  document.getElementById("btn-next").textContent =
    currentQ === questions.length - 1
      ? "See Result"
      : "Next →";

}

/* =========================
SELECT ANSWER
========================= */

function selectAnswer(value, el) {

  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.classList.remove("selected");
  });

  el.classList.add("selected");

  answers[currentQ] = value;

}

/* =========================
NAVIGATION
========================= */

function nextQuestion() {

  if (answers[currentQ] === undefined) {

    shakeQuestion();

    return;
  }

  if (currentQ < questions.length - 1) {

    currentQ++;

    renderQuestion();

    updateProgress();

  } else {

    showResult();

  }

}

function prevQuestion() {

  if (currentQ > 0) {

    currentQ--;

    renderQuestion();

    updateProgress();

  }

}

/* =========================
SHAKE EFFECT
========================= */

function shakeQuestion() {

  const box = document.getElementById("question-box");

  box.classList.add("shake");

  setTimeout(() => {
    box.classList.remove("shake");
  }, 500);

  const hint = document.getElementById("q-hint");

  hint.style.opacity = 1;

  setTimeout(() => {
    hint.style.opacity = 0;
  }, 2000);

}

/* =========================
PROGRESS BAR
========================= */

function updateProgress() {

  const percentage =
    (currentQ / questions.length) * 100;

  document.getElementById("progress-fill").style.width =
    percentage + "%";

  document.getElementById("progress-label").textContent =
    `${currentQ} / ${questions.length}`;

}

/* =========================
CALCULATE SCORE
========================= */

function calculateScore() {

  totalScore = 0;
  maxScore = 0;

  questions.forEach((q, i) => {

    const answer = answers[i];

    const weight = q.weight;

    maxScore += weight;

    if (q.reverse) {

      // positive question
      totalScore += answer === 0 ? weight : 0;

    } else {

      // negative question
      totalScore += answer === 1 ? weight : 0;

    }

  });

  return (totalScore / maxScore) * 100;

}

/* =========================
SHOW RESULT
========================= */

function showResult() {

  updateProgress();

  document.getElementById("progress-fill").style.width = "100%";

  document.getElementById("progress-label").textContent =
    `${questions.length} / ${questions.length}`;

  const percentage = calculateScore();

  let result;

  /* GREEN FLAG */

  if (percentage <= 25) {

    result = {

      type: "greenflag",

      emoji: "💚",

      label: "Green Flag",

      title: "This relationship appears healthy and emotionally safe",

      desc:
        "Your answers show signs of mutual respect, healthy communication, emotional safety, and support. No relationship is perfect, but this one seems to have a strong and caring foundation.",

      color: "#22c55e",

      bgColor: "#f0fdf4",

      borderColor: "#bbf7d0",

      solutions: [

        "Keep communicating openly and honestly with each other.",

        "Appreciate small moments and emotional efforts regularly.",

        "Continue supporting each other's personal growth and goals.",

        "Respect boundaries even when the relationship becomes deeper.",

        "Healthy relationships still need care, patience, and consistency."

      ]

    };

  }

  /* YELLOW FLAG */

  else if (percentage <= 55) {

    result = {

      type: "yellowflag",

      emoji: "💛",

      label: "Yellow Flag",

      title: "There are some patterns that need attention",

      desc:
        "Your relationship may not be entirely unhealthy, but there are emotional patterns that deserve awareness and honest conversations before they become more damaging.",

      color: "#f59e0b",

      bgColor: "#fffbeb",

      borderColor: "#fde68a",

      solutions: [

        "Try discussing uncomfortable feelings calmly and honestly.",

        "Learn more about each other's emotional needs and love languages.",

        "Prioritize your emotional well-being and independence too.",

        "Set clear boundaries and communicate them respectfully.",

        "Consider journaling, therapy, or counseling if needed.",

        "Repeated unhealthy patterns should never be ignored."

      ]

    };

  }

  /* RED FLAG */

  else {

    result = {

      type: "redflag",

      emoji: "🚩",

      label: "Red Flag",

      title: "This relationship shows serious warning signs",

      desc:
        "Your answers indicate several unhealthy behaviors that may affect your emotional safety and mental well-being. You deserve love that feels safe, respectful, peaceful, and supportive.",

      color: "#ef4444",

      bgColor: "#fff1f2",

      borderColor: "#fecaca",

      solutions: [

        "Your feelings are valid. You are not overreacting.",

        "Talk to someone you trust about what you're experiencing.",

        "Prioritize your emotional and physical safety first.",

        "Learn about emotional abuse, manipulation, and gaslighting.",

        "Consider reaching out to a counselor or mental health professional.",

        "Leaving a toxic relationship is not failure — it is courage.",

        "You deserve relationships that make your life lighter, not heavier."

      ]

    };

  }

  /* HIDE QUIZ */

  document.getElementById("quiz-section").style.display = "none";

  document.getElementById("result-section").style.display = "block";

  /* FILL RESULT */

  document.getElementById("result-emoji").textContent =
    result.emoji;

  document.getElementById("result-label").textContent =
    result.label;

  document.getElementById("result-label").style.color =
    result.color;

  document.getElementById("result-title").textContent =
    result.title;

  document.getElementById("result-desc").textContent =
    result.desc;

  const resultBox = document.getElementById("result-box");

  resultBox.style.background = result.bgColor;

  resultBox.style.borderColor = result.borderColor;

  /* SCORE BAR */

  document.getElementById("score-fill").style.width =
    percentage + "%";

  document.getElementById("score-fill").style.background =
    result.color;

  document.getElementById("score-pct").textContent =
    Math.round(percentage) + "%";

  /* SOLUTIONS */

  const solutionsList =
    document.getElementById("solutions-list");

  solutionsList.innerHTML =
    result.solutions.map(item => `<li>${item}</li>`).join("");

  /* ANIMATION */

  setTimeout(() => {

    resultBox.classList.add("result-visible");

  }, 100);

}

/* =========================
RESTART QUIZ
========================= */

function restartQuiz() {

  currentQ = 0;

  answers = [];

  totalScore = 0;

  maxScore = 0;

  document.getElementById("result-section").style.display =
    "none";

  document.getElementById("quiz-section").style.display =
    "block";

  renderQuestion();

  updateProgress();

  document.getElementById("progress-fill").style.width =
    "0%";

}