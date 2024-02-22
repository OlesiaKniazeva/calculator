import { Calculator } from './calculator.js';

/** ******************* UI ******************** */

const buttonsContainer = document.querySelector('.buttons-container');

const displayText = document.querySelector('.display .text');

const calculator = new Calculator();

buttonsContainer.addEventListener('click', (event) => {
  const button = getButtonId(event);

  calculator.processSymbol(button);

  updateTheDisplay();
});

function updateTheDisplay() {
  const content = calculator.getOperationDisplay();
  displayText.textContent = content;
}

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
  '=': 'equal',
  Backspace: 'backspace',
  Escape: 'clear',
  '.': 'float',
};

window.addEventListener('keydown', ({ key }) => {
  const symbol = KEYBOARD_MAPPING[key];
  if (symbol) {
    calculator.processSymbol(symbol);
  }

  updateTheDisplay();
});
