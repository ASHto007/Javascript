const container = document.querySelector(".card-container");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let currentId = 1;
const renderedIds = new Set();
const cache = new Map();

/* ================= FETCH (CACHED) ================= */
async function fetchUser(id) {
  try {
    if (cache.has(id)) {
      return cache.get(id);
    }

    const res = await fetch(`https://dummyjson.com/users/${id}`);
    if (!res.ok) throw new Error("User not found");

    const user = await res.json();
    cache.set(id, user);
    return user;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
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

  observer.observe(card);
}

/* ================= INTERSECTION OBSERVER ================= */
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

/* ================= LOAD LOGIC ================= */
async function loadUsers(id) {
  showSkeleton(id > 1 ? 3 : 2);

  try {
    const centerUser = await fetchUser(id);

    clearContainer();
    displayUser(centerUser, true);

    let sideUser;

    if (id > 1) {
      sideUser = await fetchUser(id - 1);
      displayUser(sideUser);
      sideUser = await fetchUser(id + 1);
      displayUser(sideUser);
    } else {
      sideUser = await fetchUser(id + 1);
      displayUser(sideUser);
    }
  } catch (error) {
    console.error("Load Error:", error.message);
  }
}

/* ================= CONTROLS ================= */
nextBtn.onclick = async () => {
  currentId++;
  await loadUsers(currentId);
};

prevBtn.onclick = async () => {
  if (currentId > 1) {
    currentId--;
    await loadUsers(currentId);
  }
};

window.addEventListener("keydown", async (e) => {
  if (e.key === "ArrowRight") {
    currentId++;
    await loadUsers(currentId);
  }

  if (e.key === "ArrowLeft" && currentId > 1) {
    currentId--;
    await loadUsers(currentId);
  }
});

/* ================= IMAGE PARALLAX ================= */
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
