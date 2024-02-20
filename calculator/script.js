import { Calculator } from './calculator.js';

/** ******************* UI ******************** */

const buttonsContainer = document.querySelector('.buttons-container');
const display = document.querySelector('.display p');

const calculator = new Calculator();

buttonsContainer.addEventListener('click', (event) => {
  const button = getButtonId(event);

  calculator.processSymbol(button);

  displayTheExpression(calculator);
});

function getButtonId(event) {
  return event.target.id;
}

function displayTheExpression(calc) {
  if (calc.checkIfDefault()) {
    display.textContent = '0';
    calc.resetDefault();
  } else {
    display.textContent = calc.getOperationDisplay();
  }
}
