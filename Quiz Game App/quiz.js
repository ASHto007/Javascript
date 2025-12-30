// ===============================
// QUESTIONS DATA
// ===============================
const questions = [
  {
    id: 1,
    category: "JavaScript",
    question: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "static"],
    correctAnswer: "const",
  },
  {
    id: 2,
    category: "JavaScript",
    question: "What will `typeof null` return in JavaScript?",
    options: ["null", "undefined", "object", "number"],
    correctAnswer: "object",
  },
  {
    id: 3,
    category: "HTML",
    question: "Which HTML tag is used to define an unordered list?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    correctAnswer: "<ul>",
  },
  {
    id: 4,
    category: "CSS",
    question: "Which CSS property is used to change the text color?",
    options: ["font-color", "text-style", "color", "background-color"],
    correctAnswer: "color",
  },
];

// ===============================
// DOM ELEMENTS
// ===============================
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");
const timerElement = document.getElementById("timer");
const quizCard = document.querySelector(".quiz-card");

// ===============================
// AUDIO
// ===============================
const correctSound = new Audio("sounds/correct.wav");
const wrongSound = new Audio("sounds/wrong.mp3");
const completeSound = new Audio("sounds/complete.mp3");

// ===============================
// STATE
// ===============================
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer = null;
let answered = false;
let results = [];

// ===============================
// FLASH ANIMATION
// ===============================
function flashCard() {
  quizCard.classList.add("flash");
  setTimeout(() => quizCard.classList.remove("flash"), 500);
}

// ===============================
// TIMER
// ===============================
function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  answered = false;
  timerElement.style.color = "#fff";
  timerElement.textContent = `⏱ ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `⏱ ${timeLeft}s`;

    if (timeLeft <= 5) timerElement.style.color = "#ff5252";

    if (timeLeft === 0) {
      clearInterval(timer);
      autoAdvance();
    }
  }, 1000);
}

// ===============================
// AUTO ADVANCE
// ===============================
function autoAdvance() {
  if (answered) return;
  answered = true;
  lockOptions();
  flashCard();
  setTimeout(() => nextButton.click(), 500);
}

// ===============================
// LOCK OPTIONS
// ===============================
function lockOptions() {
  Array.from(optionsElement.children).forEach((btn) => {
    btn.disabled = true;
  });
  nextButton.disabled = false;
}

// ===============================
// PROGRESS BAR
// ===============================
function updateProgress() {
  progressBar.style.width =
    ((currentQuestionIndex + 1) / questions.length) * 100 + "%";
}

// ===============================
// SHOW QUESTION
// ===============================
function showQuestion() {
  clearInterval(timer);

  const q = questions[currentQuestionIndex];
  questionElement.textContent = q.question;
  optionsElement.innerHTML = "";
  scoreElement.textContent = `Score: ${score}`;
  nextButton.disabled = true;

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => handleAnswer(btn, option);
    optionsElement.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

// ===============================
// HANDLE ANSWER
// ===============================
function handleAnswer(button, selectedOption) {
  if (answered) return;
  answered = true;
  clearInterval(timer);
  lockOptions();

  const q = questions[currentQuestionIndex];
  const isCorrect = selectedOption === q.correctAnswer;

  results.push({
    question: q.question,
    selected: selectedOption,
    correct: q.correctAnswer,
    isCorrect,
  });

  if (isCorrect) {
    button.classList.add("correct");
    correctSound.play();
    score++;
  } else {
    button.classList.add("wrong");
    wrongSound.play();
    Array.from(optionsElement.children).forEach((btn) => {
      if (btn.textContent === q.correctAnswer) {
        btn.classList.add("correct");
      }
    });
  }

  scoreElement.textContent = `Score: ${score}`;
}

// ===============================
// NEXT BUTTON
// ===============================
nextButton.onclick = () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    flashCard();
    showQuestion();
  } else {
    finishQuiz();
  }
};

// ===============================
// FINISH QUIZ
// ===============================
function finishQuiz() {
  clearInterval(timer);
  completeSound.play();

  // Save score
  localStorage.setItem("quizScore", score);

  questionElement.textContent = "🎉 Quiz Completed!";
  optionsElement.innerHTML = "";
  timerElement.style.display = "none";
  nextButton.style.display = "none";
  progressBar.style.width = "100%";

  

  // Restart button
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "🔁 Restart Quiz";
  restartBtn.onclick = restartQuiz;

  scoreElement.innerHTML = `Final Score: ${score}/${questions.length}`;
  optionsElement.append(restartBtn);
}

// ===============================
// RESTART QUIZ
// ===============================
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  results = [];
  timerElement.style.display = "block";
  nextButton.style.display = "inline-block";
  showQuestion();
}

// ===============================
// START QUIZ
// ===============================
showQuestion();
