// Kindly do not modify the prewritten code.

let display = document.getElementById("display");
let currentInput = "";

// Clear everything
function clearDisplay() {
  currentInput = "";
  display.innerText = "0";
}

// Delete last character
function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  display.innerText = currentInput || "0";
}

// Append number or decimal
function appendNumber(number) {
  currentInput += number;
  display.innerText = currentInput;
}

// Append operator
function appendOperator(operator) {
  if (currentInput === "") return;

  const lastChar = currentInput[currentInput.length - 1];
  if ("+-*/%".includes(lastChar)) return;

  currentInput += operator;
  display.innerText = currentInput;
}

// Calculate result
function calculateResult() {
  try {
    let result = eval(currentInput);
    currentInput = result.toString();
    display.innerText = currentInput;
  } catch (error) {
    display.innerText = "Error";
    currentInput = "";
  }
}
