const toggleSwitch = document.querySelector(".toggle-input");

toggleSwitch.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement, errorTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.errorTextElement = errorTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
    this.hideError();
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    this.hideError();
    if (this.currentOperand.length >= 12) {
      alert("Maximum digits reached (12)");
      return;
    }
    if (this.readyToReset) {
      this.currentOperand = "";
      this.readyToReset = false;
    }

    // Mengubah koma (,) yang dimasukkan pengguna menjadi titik (.)
    if (number === ".") {
      number = ",";
    }

    // Cek jika sudah ada titik desimal
    if (number === "." && this.currentOperand.includes(".")) return;

    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand.length >= 12) {
      alert("Maximum digits reached (12)");
      return;
    }
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand.replace(",", "."));
    const current = parseFloat(this.currentOperand.replace(",", "."));

    if (isNaN(prev) || isNaN(current)) {
      this.showError("Error: Operasi tidak valid");
      return;
    }

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          this.currentOperand = "Error: Div/0";
          this.operation = undefined;
          this.previousOperand = "";
          this.readyToReset = true;
          this.updateDisplay();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = computation.toString().replace(".", ",");
    this.operation = undefined;
    this.previousOperand = "";
    this.readyToReset = true;
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;

    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand.replace(",", ".");
    this.currentOperand = "";
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const parts = stringNumber.split(".");
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let decimalPart = parts[1] ? parts[1].slice(0, 15) : "";

    // Batasi panjang integer part agar tidak lebih dari 12 digit
    if (integerPart.length > 12) {
      integerPart = integerPart.slice(0, 15);
    }

    return `${integerPart}${decimalPart !== "" ? "," : ""}${decimalPart}`;
  }

  updateDisplay() {
    if (this.currentOperand === "Error: Div/0") {
      this.currentOperandTextElement.innerText = this.currentOperand;
    } else {
      this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    }

    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }

  showError(message) {
    this.errorTextElement.innerText = message;
    this.errorTextElement.style.display = "block";
  }

  hideError() {
    this.errorTextElement.style.display = "none";
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");
const errorTextElement = document.querySelector("[data-error]");

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, errorTextElement);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});
