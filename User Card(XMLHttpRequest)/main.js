import { loadCards, renderCard, setCurrentId, getCurrentId } from "./data.js";

import { animateCards, imageParallax } from "./animations.js";

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

async function updateUI() {
  const users = await loadCards(getCurrentId());
  const cards = users.map((u) => renderCard(u));

  animateCards(cards);
  cards.forEach(imageParallax);
}

nextBtn.onclick = () => {
  setCurrentId(getCurrentId() + 1);
  updateUI();
};

prevBtn.onclick = () => {
  setCurrentId(getCurrentId() - 1);
  updateUI();
};

updateUI();
