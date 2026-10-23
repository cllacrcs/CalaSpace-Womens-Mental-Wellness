

let posts = [];

const SEED_POSTS = [
  { id: 1, topic: "stronggirl", text: "Tired of always being the strong one", score: "98%", meta: "2.4k women relate to this", reactions: { love: 2400, hug: 980, flower: 420, repost: 120 } },
  { id: 2, topic: "burnout", text: "Is college burnout normal?", score: "91%", meta: "1.8k discussions today", reactions: { love: 1800, hug: 910, flower: 330, repost: 95 } },
  { id: 3, topic: "lonely", text: "Feeling lonely even in a crowd", score: "95%", meta: "3.1k emotional interactions", reactions: { love: 3100, hug: 950, flower: 510, repost: 140 } },
  { id: 4, topic: "anxious", text: "Scared of not being enough", score: "94%", meta: "2.7k women opened up today", reactions: { love: 2700, hug: 940, flower: 480, repost: 110 } },
  { id: 5, topic: "future", text: "Anxious about the future", score: "90%", meta: "1.9k calming discussions", reactions: { love: 1900, hug: 900, flower: 370, repost: 102 } },
  { id: 6, topic: "pretending", text: "Pretending to be okay every day", score: "97%", meta: "4.2k emotional support reactions", reactions: { love: 4200, hug: 970, flower: 620, repost: 180 } }
];

document.addEventListener("DOMContentLoaded", () => {

const topic = window.location.hash.replace("#", "");

seedDefaultPosts();

const savedPosts = JSON.parse(localStorage.getItem("calaspacePosts"));
if (savedPosts) {
  posts = savedPosts.map(p => {
    const seed = SEED_POSTS.find(s => s.id === p.id && s.topic === p.topic);
    return seed && !p.score ? { ...p, text: seed.text, score: seed.score, meta: seed.meta } : p;
  });
  localStorage.setItem("calaspacePosts", JSON.stringify(posts));
}

renderPosts();

if (topic) {
  setTimeout(() => {
    const target = document.getElementById(topic);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("active-thread");
      setTimeout(() => { target.classList.remove("active-thread"); }, 3000);
    }
  }, 300);
}

});

/* ---- Per-user reaction storage ---- */
function getUserReactionKey() {
  const user = JSON.parse(localStorage.getItem('csUser') || 'null');
  const id = user ? (user.email || user.username || 'guest') : 'guest';
  return 'csReactedPosts_' + id;
}

function getReactedPosts() {
  return JSON.parse(localStorage.getItem(getUserReactionKey()) || "{}");
}
function saveReactedPosts(data) {
  localStorage.setItem(getUserReactionKey(), JSON.stringify(data));
}

function createPost() {
  if (!CSUser.isLoggedIn()) {
    showLoginRequired('community');
    return;
  }
  const input = document.getElementById("post-input");
  const text = input.value.trim();
  if (!text) return;
  posts.unshift({
    id: Date.now(),
    text,
    reactions: { love: 0, hug: 0, flower: 0, repost: 0 }
  });
  localStorage.setItem("calaspacePosts", JSON.stringify(posts));
  input.value = "";
  renderPosts();
}

function react(id, type) {
  if (!CSUser.isLoggedIn()) {
    showLoginRequired('community');
    return;
  }
  const reacted = getReactedPosts();
  const key = id + "_" + type;

  posts = posts.map(p => {
    if (p.id === id) {
      if (reacted[key]) {
        // Toggle OFF — remove reaction
        p.reactions[type] = Math.max(0, (p.reactions[type] || 0) - 1);
      } else {
        // Toggle ON — add reaction
        p.reactions[type] = (p.reactions[type] || 0) + 1;
      }
    }
    return p;
  });

  if (reacted[key]) {
    delete reacted[key];
  } else {
    reacted[key] = true;
  }

  saveReactedPosts(reacted);
  localStorage.setItem("calaspacePosts", JSON.stringify(posts));
  renderPosts();
}

function renderPosts() {
  const container = document.getElementById("community-feed");
  if (!container) {
    console.error("❌ community-feed NOT FOUND");
    return;
  }
  const reacted = getReactedPosts();
  container.innerHTML = posts.map(post => `
<div class="thread-card fade-up" id="${post.topic || ''}">
<div class="thread-top"><div class="thread-text">${post.text.replace(/^💗\s*/, "")}</div>${post.score ? `<span class="thread-pill">${post.score}</span>` : ''}</div>
${post.meta ? `<small class="thread-meta">${post.meta}</small>` : ''}
<div class="thread-actions">
<button onclick="react(${post.id}, 'love')" class="${reacted[post.id+'_love'] ? 'reacted' : ''}">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> ${post.reactions.love}</button>
<button onclick="react(${post.id}, 'hug')" class="${reacted[post.id+'_hug'] ? 'reacted' : ''}">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> ${post.reactions.hug}</button>
<button onclick="react(${post.id}, 'flower')" class="${reacted[post.id+'_flower'] ? 'reacted' : ''}">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/></svg> ${post.reactions.flower}</button>
<button onclick="react(${post.id}, 'repost')" class="${reacted[post.id+'_repost'] ? 'reacted' : ''}">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> ${post.reactions.repost}</button>
</div>
</div>
`).join("");
}

function seedDefaultPosts() {
  if (posts.length === 0) posts = SEED_POSTS.map(p => ({ ...p, reactions: { ...p.reactions } }));
}
