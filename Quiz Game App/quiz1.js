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
  {
    id: 5,
    category: "JavaScript",
    question: "Which method is used to add an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: "push()",
  },
  {
    id: 6,
    category: "HTML",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink and Text Management Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    id: 7,
    category: "CSS",
    question: "Which property is used to change the font of an element?",
    options: ["font-style", "font-weight", "font-family", "font-size"],
    correctAnswer: "font-family",
  },
  {
    id: 8,
    category: "JavaScript",
    question: "Which operator is used to check both value and type equality?",
    options: ["=", "==", "===", "!="],
    correctAnswer: "===",
  },
  {
    id: 9,
    category: "HTML",
    question: "Which attribute is used to provide an image source?",
    options: ["link", "src", "href", "url"],
    correctAnswer: "src",
  },
  {
    id: 10,
    category: "CSS",
    question: "How do you make the text bold in CSS?",
    options: [
      "font-weight: bold",
      "text-decoration: bold",
      "font-style: bold",
      "text-weight: bold",
    ],
    correctAnswer: "font-weight: bold",
  },
];

// Game state variables
let score = 0;
let currentQuestionIndex = 0;
const totalScore = questions.length;
let timerInterval;

// DOM elements
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("nextBtn");
const timerElement = document.getElementById("timer");

// Initialize score display
scoreElement.textContent = `Score: ${score} / ${totalScore}`;

/**
 * Starts or updates the quiz question.
 */
function startQuiz() {
  if (currentQuestionIndex >= questions.length) {
    showFinalResult();
    return;
  }

  // Restart timer for each question (15 seconds)
  startTimer(5, timerElement);

  // Clear previous options
  optionsElement.innerHTML = "";

  // Always show next button but disable it until an answer is selected
  if (nextButton) {
    nextButton.style.display = "block";
    nextButton.disabled = true;
  }

  // Destructuring the current question object
  const { correctAnswer, options, question } = questions[currentQuestionIndex];

  // Shuffling options using a copy
  const shuffledOptions = shuffleOption([...options]);

  questionElement.textContent = `Q${currentQuestionIndex + 1}. ${question}`;

  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    optionsElement.appendChild(button);

    button.addEventListener("click", () => {
      // Clear timer once answered
      clearInterval(timerInterval);

      if (option === correctAnswer) {
        score++;
        button.classList.add("correct");
      } else {
        score = score - 0.25;
        button.classList.add("wrong");
      }

      scoreElement.textContent = `Score: ${score} / ${totalScore}`;

      // Disable all options buttons after an answer is selected
      Array.from(optionsElement.children).forEach((btn) => {
        btn.disabled = true;
      });

      // Enable the next button after selection
      if (nextButton) nextButton.disabled = false;
    });
  });
}

/**
 * Timer functionality - Now displays only seconds.
 */
function startTimer(duration, display) {
  clearInterval(timerInterval); // Clear any existing timer
  let timer = duration;

  const updateDisplay = () => {
    // Only display seconds as requested
    let displaySeconds = timer < 10 ? "0" + timer : timer;

    display.textContent = `⏱ ${displaySeconds}`;

    if (timer <= 0) {
      clearInterval(timerInterval);
      handleNextQuestion();
    }
    timer--;
  };

  updateDisplay(); // Initial call
  timerInterval = setInterval(updateDisplay, 1000);
}

/**
 * Handles navigation to the next question.
 */
function handleNextQuestion() {
  currentQuestionIndex++;
  startQuiz();
}

/**
 * Displays completion state.
 */
function showFinalResult() {
  clearInterval(timerInterval);
  optionsElement.innerHTML = "";
  questionElement.textContent = "Quiz Completed!";
  scoreElement.textContent = `Final Score: ${score} / ${totalScore}`;
  if (timerElement) timerElement.textContent = "";
  if (nextButton) nextButton.style.display = "none";
}

/**
 * Shuffle algorithm.
 */
function shuffleOption(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

// Event Listeners
if (nextButton) {
  nextButton.addEventListener("click", () => {
    handleNextQuestion();
  });
}

// Initial Call
startQuiz();
