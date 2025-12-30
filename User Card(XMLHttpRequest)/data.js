const container = document.querySelector(".card-container");

let currentId = 1;
const cache = new Map();

export async function fetchUser(id) {
  if (cache.has(id)) return cache.get(id);

  const res = await fetch(`https://dummyjson.com/users/${id}`);
  if (!res.ok) throw new Error("User not found");

  const user = await res.json();
  cache.set(id, user);
  return user;
}

export function clearCards() {
  container.innerHTML = "";
}

export function renderCard(user, center = false) {
  const card = document.createElement("div");
  card.className = "user-card";

  card.innerHTML = `
    <img src="${user.image}" />
    <h3>${user.firstName} ${user.lastName}</h3>
    <p class="email">${user.email}</p>
    <button class="btn">View Profile</button>
  `;

  container.appendChild(card);
  return card;
}

export async function loadCards(id) {
  clearCards();
  const users = await Promise.all([
    fetchUser(id),
    id > 1 ? fetchUser(id - 1) : null,
    fetchUser(id + 1),
  ]);

  return users.filter(Boolean);
}

export function setCurrentId(id) {
  currentId = Math.max(1, id);
}

export function getCurrentId() {
  return currentId;
}
