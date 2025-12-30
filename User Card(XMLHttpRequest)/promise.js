const container = document.querySelector(".card-container");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let currentId = 1;
const renderedIds = new Set();
const cache = new Map();

/* ================= FETCH (CACHED) ================= */
function fetchUser(id) {
  if (cache.has(id)) {
    return Promise.resolve(cache.get(id));
  }

  return fetch(`https://dummyjson.com/users/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then((user) => {
      cache.set(id, user);
      return user;
    });
}

/* ================= UI HELPERS ================= */
function clearContainer() {
  container.innerHTML = "";
  renderedIds.clear();
}

function showSkeleton(count) {
  clearContainer();
  for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML("beforeend", `<div class="skeleton"></div>`);
  }
}

function displayUser(user, isCenter = false) {
  if (renderedIds.has(user.id)) return;
  renderedIds.add(user.id);

  const card = document.createElement("div");
  card.className = `user-card ${isCenter ? "center" : ""}`;

  card.innerHTML = `
    <img src="${user.image}" />
    <h3>${user.firstName} ${user.lastName}</h3>
    <p class="email">${user.email}</p>
    <button class="btn">View Profile</button>
  `;

  container.appendChild(card);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
}

/* ================= LOAD LOGIC ================= */
function loadUsers(id) {
  showSkeleton(id > 1 ? 3 : 2);

  fetchUser(id)
    .then((center) => {
      clearContainer();
      displayUser(center, true);
      return id > 1 ? fetchUser(id - 1) : fetchUser(id + 1);
    })
    .then((user) => {
      displayUser(user);
      if (user.id === id - 1) {
        return fetchUser(id + 1);
      }
      return null;
    })
    .then((user) => {
      if (user) displayUser(user);
    })
    .catch(console.error);
}

/* ================= CONTROLS ================= */
nextBtn.onclick = () => {
  currentId++;
  loadUsers(currentId);
};

prevBtn.onclick = () => {
  if (currentId > 1) {
    currentId--;
    loadUsers(currentId);
  }
};

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});

container.addEventListener("mousemove", (e) => {
  const card = e.target.closest(".user-card");
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  const img = card.querySelector("img");
  img.style.transform = `
    translate(${x * 6}px, ${y * 6}px)
    scale(1.05)
  `;
});

container.addEventListener("mouseleave", () => {
  document.querySelectorAll(".user-card img").forEach((img) => {
    img.style.transform = "";
  });
});

/* ================= INIT ================= */
loadUsers(currentId);
