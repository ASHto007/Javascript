document.addEventListener("DOMContentLoaded", () => {
  const emojiList = [
    { icon: "fa-face-laugh-beam", answer: "happy", hint: "A positive emotion" },
    { icon: "fa-face-sad-tear", answer: "sad", hint: "Opposite of happy" },
    { icon: "fa-face-angry", answer: "angry", hint: "Strong emotion" },
    { icon: "fa-face-surprise", answer: "surprised", hint: "Unexpected reaction" },
    { icon: "fa-face-grin-stars", answer: "excited", hint: "Very happy feeling" },
    { icon: "fa-face-tired", answer: "tired", hint: "Need rest" },
    { icon: "fa-face-kiss-wink-heart", answer: "love", hint: "Romantic emotion" },
    { icon: "fa-face-meh", answer: "confused", hint: "Not sure" },
  ];

  // ---------- STATE ----------
  let emojis = [];
  let currentEmojiIndex = 0;
  let score = 0;
  let timeLeft = 5;
  let timerInterval;

  // ---------- ELEMENTS ----------
  const emojiIcon = document.getElementById("emojiIcon");
  const guessInput = document.getElementById("guessInput");
  const submitBtn = document.getElementById("submitBtn");
  const hintText = document.getElementById("hint-text");
  const message = document.getElementById("message");
  const timerEl = document.getElementById("timer");
  const gameUI = document.getElementById("gameUI");
  const resultScreen = document.getElementById("resultScreen");
  const finalScore = document.getElementById("finalScore");
  const scoreEl = document.getElementById("score");
  const playAgainBtn = document.querySelector(".playAgain");

  // ---------- SHUFFLE ----------
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // ---------- LOAD EMOJI ----------
  function loadEmoji() {
    if (currentEmojiIndex >= emojis.length) {
      endGame();
      return;
    }

    const emoji = emojis[currentEmojiIndex];
    emojiIcon.className = `fa-solid ${emoji.icon}`;
    hintText.textContent = `Hint: ${emoji.hint}`;
    message.textContent = "";
    guessInput.value = "";

    resetTimer();
  }

  // ---------- CHECK ANSWER ----------
  function checkAnswer() {
    const userAnswer = guessInput.value.trim().toLowerCase();
    const correctAnswer = emojis[currentEmojiIndex].answer.toLowerCase();

    if (!userAnswer) return;

    if (userAnswer === correctAnswer) {
      score++;
      scoreEl.textContent = `Score: ${score}`;
      message.textContent = "✅ Correct!";
      message.className = "success";
    } else {
      message.textContent = `❌ ${correctAnswer}`;
      message.className = "error";
    }

    nextEmoji();
  }

  // ---------- NEXT ----------
  function nextEmoji() {
    clearInterval(timerInterval);
    currentEmojiIndex++;
    setTimeout(loadEmoji, 600);
  }

  // ---------- TIMER (5s per emoji) ----------
  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 1;

    timerEl.textContent = `⏱️ ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `⏱️ ${timeLeft}s`;

      if (timeLeft <= 0) {
        message.textContent = "⏰ Time Up!";
        message.className = "error";
        nextEmoji();
      }
    }, 1000);
  }

  // ---------- END GAME ----------
  function endGame() {
    clearInterval(timerInterval);
    gameUI.classList.add("hidden");
    timerEl.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    finalScore.textContent = `Your Score: ${score} / ${emojis.length}`;
    scoreEl.style.display = "none";
  }

  // ---------- RESTART ----------
  function restartGame() {
    emojis = shuffleArray([...emojiList]);
    currentEmojiIndex = 0;
    score = 0;

    scoreEl.textContent = "Score: 0";
    scoreEl.style.display = "inline";

    resultScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");
    timerEl.classList.remove("hidden");

    loadEmoji();
  }

  // ---------- EVENTS ----------
  submitBtn.addEventListener("click", checkAnswer);
  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  playAgainBtn.addEventListener("click", restartGame);

  // ---------- INIT ----------
  emojis = shuffleArray([...emojiList]);
  scoreEl.textContent = "Score: 0";
  loadEmoji();
});
