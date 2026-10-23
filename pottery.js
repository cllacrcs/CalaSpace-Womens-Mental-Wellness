/* ========================
   POTTERY
======================== */
const citySelect = document.getElementById('potteryCitySelect');
const cards = document.querySelectorAll('#potteryGrid .flower-card');
const emptyState = document.getElementById('potteryEmptyState');

citySelect.addEventListener('change', function () {
  const selectedCity = this.value;
  let found = false;
  cards.forEach(card => {
    if (selectedCity === "all") {
      card.hidden = false;
      found = true;
    } else if (card.dataset.city === selectedCity) {
      card.hidden = false;
      found = true;
    } else {
      card.hidden = true;
    }
  });
  if (found) {
    emptyState.style.display = 'none';
  } else {
    emptyState.style.display = 'block';
  }
});

/* MODAL */
function openModal(title, img, desc, price, map) {
  document.getElementById('flowerModal').style.display = 'flex';
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalImg').src = img;
  document.getElementById('modalDesc').innerText = desc;
  document.getElementById('modalPrice').innerText = price;
  document.getElementById('mapLink').href = map;
}

function closeModal() {
  document.getElementById('flowerModal').style.display = 'none';
}

window.onclick = function(e) {
  const modal = document.getElementById('flowerModal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
};

function handleAddToCart() {
  const session = document.getElementById('sessionSelect').value;
  const title = document.getElementById('modalTitle').innerText;
  if (session === "") {
    alert("Please choose your session first");
  } else {
    const added = addToCart(title + " • " + session, 199000);
    closeModal();
    if (added) alert("Class added to cart successfully");
  }
}
