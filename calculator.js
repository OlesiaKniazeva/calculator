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
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

export class Calculator {
  #expression;
  #isDecimalEntered;
  #isOperatorEntered;
  #isDefault;

  constructor() {
    this.#expression = [];
    this.#isDecimalEntered = false;
    this.#isDefault = false;
    this.#isOperatorEntered = false;
  }

  resetState() {
    this.#expression = [];
    this.#isDecimalEntered = false;
    this.#isDefault = false;
    this.#isOperatorEntered = false;
  }

  setOperatorEntered() {
    this.#isOperatorEntered = true;
  }

  resetOperatorEntered() {
    this.#isOperatorEntered = false;
  }

  resetDefault() {
    this.#isDefault = false;
  }

  setDefault() {
    this.#isDefault = true;
  }

  resetDecimal() {
    this.#isDecimalEntered = false;
  }

  setDecimal() {
    this.#isDecimalEntered = true;
  }

  checkIfDefault() {
    return this.#isDefault;
  }

  checkIfDecimalEntered() {
    return this.#isDecimalEntered;
  }

  getExpression() {
    return this.#expression;
  }

  setExpression(expression) {
    this.#expression = expression;
  }

  getOperationDisplay() {
    let data = this.tokenize();
    return data.join(' ');
  }

  convertExpressionToString() {
    return this.getExpression().join('');
  }

  operate(firstNum, operator, secondNum) {
    switch (operator) {
      case OPERATOR.plus:
        return this.add(firstNum, secondNum);
      case OPERATOR.minus:
        return this.subtract(firstNum, secondNum);
      case OPERATOR.multiply:
        return this.multiply(firstNum, secondNum);
      case OPERATOR.divide:
        return this.divide(firstNum, secondNum);
      default:
        console.log('ERROR, unexpected operator');
    }
  }

  add(num1, num2) {
    return num1 + num2;
  }

  subtract(num1, num2) {
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

  addToStack(data) {
    this.#expression.push(data);
  }

  removeFromStack() {
    this.#expression.pop();
  }

  processSymbol(button) {
    if (SPECIAL_OPERATIONS[button]) {
      this.evaluateSpecial(button);
    } else if (NUMBERS[button]) {

      this.addToStack(NUMBERS[button]);
    } else if (OPERATOR[button]) {
      this.evaluateOperator(button);
    }
  }

  evaluateOperator(button) {
    if (Object.values(OPERATOR).includes(this.getLastElement())) {
      return;
    }

    if (this.isEmpty()) {
      this.addToStack('0');
    }

    this.resetDecimal();
    this.addToStack(OPERATOR[button]);
  }

  evaluateSpecial(button) {
    switch (button) {
      case SPECIAL_OPERATIONS.clear:
        this.clearData();
        this.resetDecimal();
        this.setDefault();
        break;
      case SPECIAL_OPERATIONS.backspace:
        this.removeLast();
        break;
      case SPECIAL_OPERATIONS.float:
        if (this.checkIfDecimalEntered()) {
          return;
        } else {
          this.addToStack('.');
          this.setDecimal();
        }
        break;
      case SPECIAL_OPERATIONS.equal:
        if (Object.values(OPERATOR).includes(this.getLastElement())) {
          return;
        }

        this.processExpression();
        break;
      default:
        console.log('def');
    }
  }

  getLastElement() {
    if (this.isEmpty()) {
      return null;
    }

    const data = this.getExpression();

    return data[data.length - 1];
  }

  tokenize() {
    const data = this.convertExpressionToString();

    const tokens = data.split(/([+\-*/])|(\d+\.\d+|\d+)/).filter(Boolean);
    return tokens;
  }

  convertToPostfix(tokens) {
    let posfixExp = [];
    let operatorsStack = [];

    for (const token of tokens) {
      if (isNumeric(token)) {
        posfixExp.push(token);
      } else {
        while (true) {
          let stackLast = getLastElement(operatorsStack);

          if (
            stackLast === null ||
            operatorPrecedence(token) > operatorPrecedence(stackLast)
          ) {
            break;
          }
          let last = operatorsStack.pop();
          posfixExp.push(last);
        }

        operatorsStack.push(token);
      }
    }

    while (!isEmpty(operatorsStack)) {
      let last = operatorsStack.pop();

      posfixExp.push(last);
    }

    return posfixExp;
  }

  calculate() {
    let tokens = this.tokenize();
    let postfix = this.convertToPostfix(tokens);
    return this.evaluatePostfix(postfix);
  }

  evaluatePostfix(posfixExp) {
    let numbersStack = [];

    for (const token of posfixExp) {
      if (isNumeric(token)) {
        numbersStack.push(Number(token));
      } else {
        const secondOperand = numbersStack.pop();
        const firstOperand = numbersStack.pop();

        let result = this.operate(firstOperand, token, secondOperand);
        numbersStack.push(result);
      }
    }

    let result = numbersStack.at(0);

    if (this.digitsAfterDecimal(result) > 2) {
      return this.round(result);
    }

    return String(result);
  }

  round(number) {
    return number.toFixed(2);
  }

  digitsAfterDecimal(number) {
    if (Number.isInteger(number)) {
      return 0;
    }

    const parts = number.toString().split('.');
    console.log(parts);

    return parts[1].length;
  }

  processExpression() {
    let result = this.calculate();
    this.resetState();
    this.addToStack(result);
  }

  isEmpty() {
    return this.getExpression().length === 0;
  }

  removeLast() {
    let last = this.removeFromStack();

    if (last == '.') {
      this.resetDecimal();
    }
    if (this.isEmpty()) {
      this.setDefault();
    }
  }

  clearData() {
    this.#expression = [];
  }
}

export function operatorPrecedence(operator) {
  if (operator === '*' || operator === '/') {
    return 2;
  } else if (operator === '+' || operator === '-') {
    return 1;
  } else {
    return -1;
  }
}

function isEmpty(data) {
  return data.length === 0;
}

function isNumeric(num) {
  return !isNaN(num);
}

function getLastElement(array) {
  if (isEmpty(array)) {
    return null;
  }

  return array[array.length - 1];
}
