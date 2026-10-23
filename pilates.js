/* ========================
   PILATES
======================== */
/* MODAL */

function openModal(title,img,desc,price,map){

document.getElementById('studioModal').style.display='flex';

document.getElementById('modalTitle').innerText=title;

document.getElementById('modalImg').src=img;

document.getElementById('modalDesc').innerText=desc;

document.getElementById('modalPrice').innerText=price;

document.getElementById('mapLink').href=map;

}

function closeModal(){

document.getElementById('studioModal').style.display='none';

}

/* CLOSE WHEN CLICK OUTSIDE */

window.onclick=function(e){

const modal=document.getElementById('studioModal');

if(e.target===modal){

modal.style.display='none';

}

}

/* FILTER CITY */

const citySelect=document.getElementById('citySelect');

const cards=document.querySelectorAll('.studio-card');

citySelect.addEventListener('change',function(){

const selectedCity=this.value;
const grid=document.getElementById('studioGrid');

cards.forEach(card=>{

if(selectedCity==="all"){

card.style.display="block";

}

else if(card.dataset.city===selectedCity){

card.style.display='block';

}

else{

card.style.display='none';

}

});

/* Add filtered class so cards don't stretch full width */
if(selectedCity==="all"){
  grid.classList.remove('filtered');
} else {
  grid.classList.add('filtered');
}

});

function handleAddToCart(){

const session =
document.getElementById('sessionSelect').value;

const title =
document.getElementById('modalTitle').innerText;

/* IF ELSE */

if(session === ""){

alert("Please choose your session first");

}

else{

const added = addToCart(
title + " • " + session,
199000
);

closeModal();

if(added) alert("Class added to cart successfully");

}

}
