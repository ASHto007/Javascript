const container = document.querySelector(".card-container");

function getDetails(id) {
  // beforeend → extra class
  fetchUser(id - 1, "afterbegin");
  fetchUser(id, "beforeend");
  fetchUser(id + 1, "beforeend");
  fetchUser(id + 2, "beforeend");

}

function fetchUser(id, position) {
  if (id < 1) return;

  const req = new XMLHttpRequest();
  req.open("GET", `https://dummyjson.com/users/${id}`);
  req.send();

  req.onload = function () {
    if (req.status !== 200) {
      console.error("Failed to load user:", id);
      return;
    }

    const data = JSON.parse(req.responseText);
    displayUser(data, position);
  };

  req.onerror = function () {
    console.error("Network error for user:", id);
  };
}

function displayUser(user, position) {
  const card = `
    <div class="user-card">
      <img src="${user.image}" alt="Profile Image" />
      <h3>${user.firstName}</h3>
      <h3>${user.lastName}</h3>
      <p class="email">${user.email}</p>
      <button class="btn">View Profile</button>
    </div>
  `;

  container.insertAdjacentHTML(position, card);
  adjustLayout();
}

function adjustLayout() {
  const count = container.children.length;

  if (count === 1) {
    container.style.gridTemplateColumns = "max-content";
    container.style.justifyContent = "center";
  } else if (count === 2) {
    container.style.gridTemplateColumns = "repeat(2, max-content)";
    container.style.justifyContent = "center";
  } else if (count === 3) {
    container.style.gridTemplateColumns = "repeat(3, max-content)";
    container.style.justifyContent = "";
  } else {
    container.style.gridTemplateColumns = "repeat(4, 1fr)";
    container.style.justifyContent = "";
  }
}

// INIT
getDetails(6);
