import {
  Calculator,
  NUMBERS,
  OPERATOR,
  SPECIAL_OPERATIONS,
} from './calculator.js';

/** ******************* UI ******************** */

const buttonsContainer = document.querySelector('.buttons-container');

// const display = document.querySelector('.display');
const displayText = document.querySelector('.display p');

displayText.focus({ focusVisible: true });

const calculator = new Calculator();

buttonsContainer.addEventListener('click', (event) => {
  const button = getButtonId(event);

  calculator.processSymbol(button);

  const content = calculator.getOperationDisplay();
  displayText.textContent = content;

  displayText.focus();
});

function getButtonId(event) {
  return event.target.id;
}
const KEYBOARD_MAPPING = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  '+': 'plus',
  '-': 'minus',
  '*': 'multiply',
  '/': 'divide',
  Enter: 'equal',
  Backspace: 'backspace',
  Escape: 'clear',
  '.': 'float',
};

window.addEventListener('keydown', ({ key }) => {
  const symbol = KEYBOARD_MAPPING[key];
  if (symbol) {
    calculator.processSymbol(symbol);
  }

  // Update the display
  const content = calculator.getOperationDisplay();
  displayText.textContent = content;

  // Set focus on the display
  displayText.focus();
});
