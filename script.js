import {Calculator}from './calculator.js';


/********************* UI *********************/

const buttonsContainer = document.querySelector('.buttons-container');
const display = document.querySelector('.display p');

const calculator = new Calculator();

buttonsContainer.addEventListener('click', (event) => {
  const button = getButtonId(event);
  console.log(button);
  

  calculator.processSymbol(button);
  
  displayTheExpression(calculator);
});

function getButtonId(event) {
  return event.target.id;
}

function displayTheExpression(calculator) {
  if (calculator.checkIfDefault()) {
    display.textContent = '0';
    calculator.resetDefault();
  }
  else {
    display.textContent = calculator.getOperationDisplay();
  }
}