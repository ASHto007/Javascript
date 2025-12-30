/* =================================================
   SONG DATA
   Each song has: id, name, artist, image, genre, source
   ================================================= */
const allSongs = [
  {
    id: 1,
    name: "All of Me",
    artist: "John Legend",
    image: "src/all_of_me.jpeg",
    genre: "pop",
    source: "songs/All of Me.mp3",
  },
  {
    id: 2,
    name: "Locked Away",
    artist: "R. City ft. Adam Levine",
    image: "src/locked_away.jpeg",
    genre: "pop",
    source: "songs/Locked Away.mp3",
  },
  {
    id: 3,
    name: "Shape of You",
    artist: "Ed Sheeran",
    image: "src/Shape_of_You.jpg",
    genre: "pop",
    source: "songs/Shape of You.mp3",
  },
  {
    id: 4,
    name: "Someone Like You",
    artist: "Adele",
    image: "src/somelike_you.jpeg",
    genre: "classical",
    source: "songs/Someone Like You.mp3",
  },
  {
    id: 5,
    name: "Sugar",
    artist: "Maroon 5",
    image: "src/sugar.jpeg",
    genre: "pop",
    source: "songs/Sugar.mp3",
  },
  {
    id: 6,
    name: "Wonderwall",
    artist: "Oasis",
    image: "src/wonderwall.jpeg",
    genre: "rock",
    source: "songs/Wonderwall.mp3",
  },
];

/* =================================================
   DOM ELEMENT SELECTION
   ================================================= */
const songList = document.querySelector(".songs-list");
const genreSelect = document.getElementById("genre-select");
const songImg = document.getElementById("song-img");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const audioPlayer = document.getElementById("audio-player");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const addPlaylistBtn = document.getElementById("add-playlist-btn");
const createPlaylistBtn = document.getElementById("create-playlist-btn");
const allPlaylistsEl = document.querySelector(".all-playlists");
const currentPlaylistEl = document.querySelector(".current-playlist");
const searchPlaylistInput = document.getElementById("search-playlist");
const themeSwitch = document.getElementById("theme-switch");

/* =================================================
   APPLICATION STATE
   ================================================= */
let currentSongIndex = 0;
let playlists = []; // Stores all playlists
let currentPlaylistIndex = null; // Index of selected playlist

/* =================================================
   THEME TOGGLE (Dark / Light)
   ================================================= */
themeSwitch.addEventListener("change", () => {
  document.body.setAttribute(
    "data-theme",
    themeSwitch.checked ? "dark" : "light"
  );
});

/* =================================================
   SHOW SONG LIST (WITH FILTER)
   ================================================= */
function showSongs(filter = "all") {
  songList.innerHTML = "";

  const songsToShow =
    filter === "all"
      ? allSongs
      : allSongs.filter((song) => song.genre === filter);

  songsToShow.forEach((song) => {
    const div = document.createElement("div");
    div.className = "song-item";
    div.innerHTML = `<h3>${song.name}</h3><p>${song.artist}</p>`;
    div.onclick = () => {
      document
        .querySelectorAll(".song-item")
        .forEach((el) => el.classList.remove("active"));

      div.classList.add("active");
      loadSong(allSongs.indexOf(song));
    };
    songList.appendChild(div);
  });
}

genreSelect.addEventListener("change", (e) => {
  showSongs(e.target.value);
});

/* =================================================
   LOAD & PLAY SONG
   ================================================= */
function loadSong(index) {
  currentSongIndex = index;
  const song = allSongs[index];

  songImg.src = song.image;
  songTitle.textContent = song.name;
  songArtist.textContent = song.artist;
  audioPlayer.src = song.source;
  audioPlayer.play();
}

/* =================================================
   PLAYER CONTROLS
   ================================================= */
nextBtn.onclick = () => {
  loadSong((currentSongIndex + 1) % allSongs.length);
};

prevBtn.onclick = () => {
  loadSong(currentSongIndex === 0 ? allSongs.length - 1 : currentSongIndex - 1);
};

/* =================================================
   PLAYLIST CREATION
   ================================================= */
createPlaylistBtn.onclick = () => {
  const name = document.getElementById("new-playlist-name").value.trim();
  if (!name) return alert("Enter playlist name");

  playlists.push({ name, songs: [] });
  document.getElementById("new-playlist-name").value = "";
  renderAllPlaylists();
};

/* =================================================
   RENDER ALL PLAYLISTS
   ================================================= */
function renderAllPlaylists() {
  allPlaylistsEl.innerHTML = "";

  playlists.forEach((playlist, index) => {
    const div = document.createElement("div");
    div.className = "playlist-item";
    div.textContent = playlist.name;

    // Highlight selected playlist
    if (index === currentPlaylistIndex) {
      div.classList.add("active");
    }

    div.onclick = () => {
      currentPlaylistIndex = index;
      renderAllPlaylists(); // refresh active class
      renderCurrentPlaylist(); // load songs
    };

    allPlaylistsEl.appendChild(div);
  });
}

/* =================================================
   ADD SONG TO CURRENT PLAYLIST
   ================================================= */
addPlaylistBtn.onclick = () => {
  if (currentPlaylistIndex === null) return alert("Select a playlist first");

  const playlist = playlists[currentPlaylistIndex];
  const song = allSongs[currentSongIndex];

  if (!playlist.songs.some((s) => s.id === song.id)) {
    playlist.songs.push(song);
    renderCurrentPlaylist();
  } else {
    alert("Song already in playlist");
  }
};

/* =================================================
   RENDER CURRENT PLAYLIST
   ================================================= */
function renderCurrentPlaylist() {
  currentPlaylistEl.innerHTML = "";

  playlists[currentPlaylistIndex].songs.forEach((song) => {
    const div = document.createElement("div");
    div.className = "song-item";
    div.innerHTML = `
      <span>${song.name}</span>
      <button class="remove-btn" title="Remove">
      <i class="fa-solid fa-trash"></i>
      </button>`;

    // Remove song
    div.querySelector("button").onclick = (e) => {
      e.stopPropagation(); // prevents song play
      playlists[currentPlaylistIndex].songs = playlists[
        currentPlaylistIndex
      ].songs.filter((s) => s.id !== song.id);
      renderCurrentPlaylist();
    };

    // Play song
    div.onclick = () => loadSong(allSongs.indexOf(song));
    currentPlaylistEl.appendChild(div);
  });
}

/* =================================================
   SEARCH WITHIN CURRENT PLAYLIST
   ================================================= */
searchPlaylistInput.oninput = (e) => {
  if (searchPlaylistInput.value === "") {
    renderCurrentPlaylist();
    return;
  }
  if (currentPlaylistIndex === null) return;

  const query = e.target.value.toLowerCase();
  currentPlaylistEl.innerHTML = "";

  playlists[currentPlaylistIndex].songs
    .filter((song) => song.name.toLowerCase().includes(query))
    .forEach((song) => {
      const div = document.createElement("div");
      div.textContent = song.name;
      currentPlaylistEl.appendChild(div);
    });
};

/* =================================================
   INITIAL LOAD
   ================================================= */
document.addEventListener("DOMContentLoaded", () => {
  showSongs();
  loadSong(0);
});
