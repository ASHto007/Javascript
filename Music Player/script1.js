document.addEventListener("DOMContentLoaded", function () {
  const songs = [
    {
      id: 1,
      name: "All Of Me",
      artist: "John Legend",
      img: "src/all_of_me.jpeg",
      genre: "Pop",
      source: "songs/All of Me.mp3",
    },
    {
      id: 2,
      name: "Locked Away",
      artist: "R. City",
      img: "src/locked_away.jpeg",
      genre: "Pop",
      source: "songs/Locked Away.mp3",
    },
    {
      id: 3,
      name: "Shape Of You",
      artist: "Ed Sheeran",
      img: "src/Shape_of_You.jpg",
      genre: "Pop",
      source: "songs/hape of You.mp3",
    },
    {
      id: 4,
      name: "Someone Like You",
      artist: "Adele",
      img: "src/somelike_you.jpeg",
      genre: "Pop",
      source: "songs/Someone Like You.mp3",
    },
    {
      id: 5,
      name: "Sugar",
      artist: "Maroon",
      img: "src/sugar.jpeg",
      genre: "Rock",
      source: "songs/sugar.mp3",
    },
    {
      id: 6,
      name: "Wonderwall",
      artist: "Oasis",
      img: "src/wonderwall.jpeg",
      genre: "Rock",
      source: "songs/wonderwall.mp3",
    },
  ];

  let currentSongIndex = localStorage.getItem("currentSongIndex")
    ? parseInt(localStorage.getItem("currentSongIndex"))
    : 0;
  let isUserInteracted = false; // Flag to track user interaction
  let playlists = {}; // Object to store playlists
  let currentPlaylist = null; // Track the current selected playlist

  // Function to toggle between light and dark themes
  function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    body.setAttribute("data-theme", newTheme);
    updateToggleText(newTheme);
  }

  // Function to update toggle text based on theme
  function updateToggleText(theme) {
    const toggleText = theme === "dark" ? "Light" : "Dark";
    document.querySelector(".toggleThemeText").innerText = toggleText;
  }

  // Event listener for theme toggle switch
  document
    .getElementById("themeToggle")
    .addEventListener("change", toggleTheme);

  // Function to filter and display songs based on genre selection and search query
  function showSongs() {
    const genreFilter = document.getElementById("genreFilter").value;
    const searchQuery = document
      .getElementById("songSearch")
      .value.trim()
      .toLowerCase();
    const songList = document.getElementById("songsList");
    songList.innerHTML = "";

    const filteredSongs = songs.filter((song) => {
      const matchesGenre = genreFilter === "All" || song.genre === genreFilter;
      const matchesSearch =
        song.name.toLowerCase().includes(searchQuery) ||
        song.artist.toLowerCase().includes(searchQuery);
      return matchesGenre && matchesSearch;
    });

    filteredSongs.forEach((song, index) => {
      const songElement = document.createElement("div");
      songElement.innerText = `${song.name} - ${song.artist}`;
      songElement.addEventListener("click", () => {
        currentSongIndex = index;
        renderCurrentSong();
      });
      songList.appendChild(songElement);
    });
  }

  // Event listeners for genre filter change and search input change
  document.getElementById("genreFilter").addEventListener("change", showSongs);
  document.getElementById("songSearch").addEventListener("input", showSongs);

  // Function to render the current song details
  function renderCurrentSong() {
    const currentSong = songs[currentSongIndex];
    if (!currentSong) return;

    const songImage = document.getElementById("songImage");
    const songName = document.querySelector(".songName");
    const artistName = document.querySelector(".artistName");
    const audioPlayer = document.getElementById("audioPlayer");

    songImage.src = currentSong.img;
    songName.innerText = currentSong.name;
    artistName.innerText = currentSong.artist;
    audioPlayer.src = currentSong.source;

    // Play the song only if the user has interacted with the page
    if (isUserInteracted) {
      audioPlayer.play().catch((error) => {
        console.log("Autoplay failed:", error);
      });
    }

    // Save the current song index to localStorage
    localStorage.setItem("currentSongIndex", currentSongIndex);
  }

  // Event listeners for previous and next song buttons
  document.getElementById("prevButton").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    renderCurrentSong();
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    renderCurrentSong();
  });

  // Event listener for adding current song to playlist
  document
    .getElementById("addToPlaylistButton")
    .addEventListener("click", addToPlaylist);

  function addToPlaylist() {
    const currentSong = songs[currentSongIndex];
    if (!currentPlaylist) return; // Check if a playlist is selected

    const playlistSongs = document.getElementById("playlistSongs");
    const songElement = document.createElement("div");
    songElement.innerText = `${currentSong.name} - ${currentSong.artist}`;

    // Add the song to the current playlist in the playlists object
    if (!playlists[currentPlaylist]) {
      playlists[currentPlaylist] = [];
    }
    if (!playlists[currentPlaylist][currentSong]) {
      playlists[currentPlaylist].unshift(currentSong); // Add to the beginning of the playlist array
    }
    // Prepend the new song to the top of the playlist in the DOM
    playlistSongs.insertBefore(songElement, playlistSongs.firstChild);
  }

  // Event listener for creating a new playlist
  document
    .getElementById("createPlaylistButton")
    .addEventListener("click", createPlaylist);

  function createPlaylist() {
    const newPlaylistName = document
      .getElementById("newPlaylistName")
      .value.trim();
    if (newPlaylistName === "") return;

    if (playlists[newPlaylistName]) {
      alert("Playlist with this name already exists!");
      return;
    }

    playlists[newPlaylistName] = [];
    const allPlaylist = document.getElementById("allPlaylist");
    const playlistElement = document.createElement("div");
    playlistElement.innerText = newPlaylistName;
    playlistElement.addEventListener("click", () => {
      currentPlaylist = newPlaylistName;
      renderPlaylistSongs(newPlaylistName);
    });
    allPlaylist.appendChild(playlistElement);

    // Clear input field after creating playlist
    document.getElementById("newPlaylistName").value = "";
  }

  // Function to render songs in the selected playlist
  function renderPlaylistSongs(playlistName) {
    const playlistSongs = document.getElementById("playlistSongs");
    playlistSongs.innerHTML = ""; // Clear previous songs

    if (playlists[playlistName]) {
      playlists[playlistName].forEach((song) => {
        const songElement = document.createElement("div");
        songElement.innerText = `${song.name} - ${song.artist}`;
        playlistSongs.appendChild(songElement);
      });
    }
  }

  // Event listener for any user interaction with the page
  // document.addEventListener('click', function() {
  //     if (!isUserInteracted) {
  //         isUserInteracted = true;
  //         renderCurrentSong();
  //     }else{
  //       isUserInteracted= false;
  //       const audioPlayer = document.getElementById('audioPlayer');
  //       audioPlayer.pause();
  //     }
  // });

  // Initial setup: Show songs, render current song, etc.
  showSongs();
  renderCurrentSong();
});
