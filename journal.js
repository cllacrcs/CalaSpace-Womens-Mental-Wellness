

/* =========================
DATA
========================= */

let journals =
JSON.parse(localStorage.getItem("journals")) || [];

let selectedMood = "😊";

/* =========================
MOOD SELECT
========================= */

const moodButtons =
document.querySelectorAll(".mood-btn");

moodButtons.forEach(button => {

button.addEventListener("click", () => {

moodButtons.forEach(btn => {
btn.classList.remove("active");
});

button.classList.add("active");

selectedMood =
button.dataset.mood;

});

});

/* =========================
SAVE JOURNAL
========================= */

function saveJournal(draft = false){

if(!CSUser.isLoggedIn()) {
  showLoginRequired('journal');
  return;
}

const text =
document.getElementById("journal-text").value.trim();

if(!text) return;

const today =
new Date().toLocaleDateString("en-GB",{
day:"numeric",
month:"long",
year:"numeric"
});

journals.unshift({

id: Date.now(),

mood: selectedMood,

text: text,

date: today,

draft: draft

});

localStorage.setItem(
"journals",
JSON.stringify(journals)
);

/* CLEAR TEXTAREA */

document.getElementById("journal-text").value = "";

/* REMOVE DRAFT */

localStorage.removeItem("journalDraft");

renderJournals();

}

/* =========================
AUTO SAVE DRAFT
========================= */

const journalInput =
document.getElementById("journal-text");

journalInput.addEventListener("input", () => {

localStorage.setItem(
"journalDraft",
journalInput.value
);

});

/* LOAD DRAFT */

const savedDraft =
localStorage.getItem("journalDraft");

if(savedDraft){

journalInput.value = savedDraft;

}

/* =========================
DELETE JOURNAL
========================= */

function deleteJournal(id){

journals = journals.filter(
journal => journal.id !== id
);

localStorage.setItem(
"journals",
JSON.stringify(journals)
);

renderJournals();

}

/* =========================
RENDER JOURNALS
========================= */

function renderJournals(){

const history =
document.getElementById("journal-history");

history.innerHTML = "";

journals.forEach(item => {

history.innerHTML += `

<div class="journal-entry fade-up">

<div class="journal-top">

<span class="journal-mood">
${item.mood}
</span>

<span class="journal-date">
${item.date}
</span>

</div>

<div class="journal-text">
${item.text}
</div>

<div class="journal-bottom">

${
item.draft
? '<span class="draft-badge">Draft</span>'
: '<span class="saved-badge">Private Entry</span>'
}

<button
class="delete-btn"
onclick="deleteJournal(${item.id})"
>
Delete
</button>

</div>

</div>

`;

});

}

/* =========================
INIT
========================= */

renderJournals();