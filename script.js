const OPERATOR = {
  PLUS: '+',
  MINUS: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
};

let firstNum;
let secondNum;
let operator;

function operate(firstNum, operator, secondNum) {
  switch (operator) {
    case OPERATOR.PLUS:
      add(firstNum, secondNum);
    case OPERATOR.MINUS:
      substract(firstNum, secondNum);
    case OPERATOR.MULTIPLY:
      multiply(firstNum, secondNum);
    case OPERATOR.DIVIDE:
      divide(firstNum, secondNum);
  }
}

function add(num1, num2) {
  return num1 + num2;
}

function substract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) {
    console.log('division to zero!');
  }

  return num1 / num2;
}
