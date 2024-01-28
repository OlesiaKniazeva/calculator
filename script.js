const OPERATOR = {
  plus: '+',
  minus: '-',
  multiply: '*',
  divide: '/',
};

const SPECIAL_OPERATIONS = {
  float: 'float',
  clear: 'clear',
  backspace: 'backspace',
  equal: 'equal',
};

const NUMBERS = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

/ ***************** Logic *************** /;

class Calculator {
  constructor() {
    this.expression = [];
    this.decimalEntered = false;
    this.toClear = false;
  }

  get expression() {
    return this.expression;
  }

  operate(firstNum, operator, secondNum) {
    switch (operator) {
      case OPERATOR.plus:
        add(firstNum, secondNum);
        break;
      case OPERATOR.minus:
        substract(firstNum, secondNum);
        break;
      case OPERATOR.multiply:
        multiply(firstNum, secondNum);
        break;
      case OPERATOR.divide:
        divide(firstNum, secondNum);
        break;
    }
  }

  add(num1, num2) {
    return num1 + num2;
  }

  substract(num1, num2) {
    return num1 - num2;
  }

  multiply(num1, num2) {
    return num1 * num2;
  }

  divide(num1, num2) {
    if (num2 === 0) {
      console.log('division to zero!');
    }

    return num1 / num2;
  }

  processSymbol(button) {
    if (SPECIAL_OPERATIONS[button]) {
      evaluateSpecial(button);
    } else if (NUMBERS[button]) {
      stack.push(NUMBERS[button]);
    } else if (OPERATOR[button]) {
      evaluateOperator(button);
    }
  }

  evaluateOperator(button) {
    decimalEntered = false;
  }

  evaluateSpecial(button) {
    switch (button) {
      case SPECIAL_OPERATIONS.clear:
        clearData();
        decimalEntered = false;
        this.toClear = true;
        break;
      case SPECIAL_OPERATIONS.backspace:
        removeLast();
        break;
      case SPECIAL_OPERATIONS.float:
        if (decimalEntered) {
          return;
        } else {
          stack.push('.');
          decimalEntered = true;
        }
        break;
      default:
        console.log('def');
    }
  }

  removeLast() {
    let last = stack.pop();

    if (last == '.') {
      decimalEntered = false;
    }
  }

  clearData() {
    stack = [];

    display.textContent = 0;
  }

  parseExpression() {
    /* no */
  }

 convertExpressionToString() {
    let expression = stack.join('');
    return expression;
  }
}

/ ********************* UI ********************* /;


const buttonsContainer = document.querySelector('.buttons-container');
const display = document.querySelector('.display p');

const calculator = new Calculator();

buttonsContainer.addEventListener('click', (event) => {
  const button = getButtonId(event);

  calculator.processSymbol(button);
});

function getButtonId(event) {
  return event.target.id;
}

function displayTheExpression() {}

