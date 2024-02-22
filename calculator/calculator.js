import {
  isEmpty,
  isNumericString,
  getLastElement,
  arraysEqual,
} from './utilities.js';

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

  #hasEvaluated;

  #isUnaryMinus;

  constructor() {
    this.#expression = ['0'];
    this.#isDecimalEntered = false;
    this.#hasEvaluated = false;
  }

  processSymbol(button) {
    if (SPECIAL_OPERATIONS[button]) {
      this.resetHasEvaluated();
      this.evaluateSpecial(button);
    } else if (NUMBERS[button]) {
      if (this.isUnaryMinus()) {
        this.resetUnaryMinus();
      }

      if (this.hasEvaluated()) {
        this.setExpression([]);
        this.resetDecimal();
        this.resetHasEvaluated();
      }

      const expression = this.getExpression();
      if (expression.length === 1 && expression[0] === '0') {
        this.setExpression([]);
      }

      this.addToStack(NUMBERS[button]);
    } else if (OPERATOR[button]) {
      if (this.isUnaryMinus()) {
        return;
      }

      this.resetHasEvaluated();
      this.evaluateOperator(button);
    }
  }

  exchangeSymbolsForDisplay() {
    const symbolMap = {
      '*': '×',
      '/': '÷',
    };

    return this.getExpression().map((token) => symbolMap[token] || token);
  }

  getOperationDisplay() {
    const display = this.exchangeSymbolsForDisplay();
    const data = this.tokenize(display);
    console.log(data);

    return data.join(' ');
  }

  evaluateSpecial(button) {
    switch (button) {
      case SPECIAL_OPERATIONS.clear:
        this.clearData();
        this.resetDecimal();
        this.resetUnaryMinus();
        break;
      case SPECIAL_OPERATIONS.backspace:
        this.removeLast();
        break;
      case SPECIAL_OPERATIONS.float:
        if (this.checkIfDecimalEntered() || this.isUnaryMinus()) {
          return;
        }
        this.addToStack('.');
        this.setDecimal();
        break;
      case SPECIAL_OPERATIONS.equal:
        if (Object.values(OPERATOR).includes(this.getLastElement())) {
          return;
        }

        this.processExpression();
        this.setHasEvaluated();
        break;
      default:
        console.error('unexpected button value');
    }
  }

  clearData() {
    this.#expression = ['0'];
  }

  removeLast() {
    const last = this.removeFromStack();

    if (last === '.') {
      this.resetDecimal();
    }

    if (this.isUnaryMinus()) {
      this.resetUnaryMinus();
    }

    if (this.isEmpty()) {
      this.setExpression(['0']);
    }
  }

  processExpression() {
    const result = this.calculate();
    this.resetDecimal();
    this.setExpression([]);
    this.addToStack(result);
  }

  calculate() {
    const tokens = this.tokenize();
    console.log(tokens);

    const postfix = Calculator.convertToPostfix(tokens);
    return Calculator.evaluatePostfix(postfix);
  }

  tokenize(inputArray) {
    const data = inputArray
      ? inputArray.join('')
      : this.convertExpressionToString();

    const tokens = data
      .split(/([+\-*/])|(\d+\.\d+|\d+\.|\.\d+|\d+)/)
      .filter(Boolean);

    for (let i = 0; i < tokens.length; i++) {
      if (
        tokens[i] === '-' &&
        ((i === 0 && tokens[i + 1]) || ['*', '/'].includes(tokens[i - 1]))
      ) {
        tokens[i] += tokens[i + 1];
        tokens.splice(i + 1, 1);
      }
    }
    return tokens;
  }

  convertExpressionToString() {
    return this.getExpression().join('');
  }

  static convertToPostfix(tokens) {
    const posfixExp = [];
    const operatorsStack = [];

    tokens.forEach((token) => {
      if (isNumericString(token)) {
        posfixExp.push(token);
      } else {
        while (true) {
          const stackLast = getLastElement(operatorsStack);

          if (
            stackLast === undefined ||
            Calculator.operatorPrecedence(token) >
              Calculator.operatorPrecedence(stackLast)
          ) {
            break;
          }
          const last = operatorsStack.pop();
          posfixExp.push(last);
        }

        operatorsStack.push(token);
      }
    });

    while (!isEmpty(operatorsStack)) {
      const last = operatorsStack.pop();

      posfixExp.push(last);
    }

    return posfixExp;
  }

  static evaluatePostfix(posfixExp) {
    const numbersStack = [];

    posfixExp.forEach((token) => {
      if (isNumericString(token)) {
        numbersStack.push(Number(token));
      } else {
        const secondOperand = numbersStack.pop();
        const firstOperand = numbersStack.pop();

        const operationResult = Calculator.operate(
          firstOperand,
          token,
          secondOperand,
        );
        numbersStack.push(operationResult);
      }
    });

    const result = numbersStack.at(0);

    if (result === Infinity) {
      return result;
    }

    if (Calculator.digitsAfterDecimal(result) > 2) {
      return Calculator.round(result);
    }

    return String(result);
  }

  evaluateOperator(button) {
    if (Object.values(OPERATOR).includes(this.getLastElement())) {
      if (button === 'minus' && arraysEqual(this.getExpression(), ['0', '-'])) {
        this.setExpression([]);
        this.setUnaryMinus();
      } else if (
        button === 'minus' &&
        (this.getLastElement() === '*' || this.getLastElement() === '/')
      ) {
        this.setUnaryMinus();
      } else {
        this.removeLast();
      }
    }

    this.resetDecimal();
    this.addToStack(OPERATOR[button]);
  }

  getLastElement() {
    const data = this.getExpression();

    return data[data.length - 1];
  }

  setHasEvaluated() {
    this.#hasEvaluated = true;
  }

  resetHasEvaluated() {
    this.#hasEvaluated = false;
  }

  setUnaryMinus() {
    this.#isUnaryMinus = true;
  }

  resetUnaryMinus() {
    this.#isUnaryMinus = false;
  }

  isUnaryMinus() {
    return this.#isUnaryMinus === true;
  }

  hasEvaluated() {
    return this.#hasEvaluated === true;
  }

  resetDecimal() {
    this.#isDecimalEntered = false;
  }

  setDecimal() {
    this.#isDecimalEntered = true;
  }

  checkIfDecimalEntered() {
    return this.#isDecimalEntered === true;
  }

  getExpression() {
    return this.#expression;
  }

  setExpression(expression) {
    this.#expression = expression;
  }

  static operate(firstNum, operator, secondNum) {
    switch (operator) {
      case OPERATOR.plus:
        return Calculator.add(firstNum, secondNum);
      case OPERATOR.minus:
        return Calculator.subtract(firstNum, secondNum);
      case OPERATOR.multiply:
        return Calculator.multiply(firstNum, secondNum);
      case OPERATOR.divide:
        return Calculator.divide(firstNum, secondNum);
      default:
        console.error('unexpected operator');
        return null;
    }
  }

  static add(num1, num2) {
    return num1 + num2;
  }

  static subtract(num1, num2) {
    return num1 - num2;
  }

  static multiply(num1, num2) {
    return num1 * num2;
  }

  static divide(num1, num2) {
    return num1 / num2;
  }

  addToStack(data) {
    this.#expression.push(data);
  }

  removeFromStack() {
    this.#expression.pop();
  }

  static operatorPrecedence(operator) {
    if (operator === OPERATOR.multiply || operator === OPERATOR.divide) {
      return 2;
    }

    if (operator === OPERATOR.plus || operator === OPERATOR.minus) {
      return 1;
    }

    return -1;
  }

  static round(number) {
    return number.toFixed(2);
  }

  static digitsAfterDecimal(number) {
    if (Number.isInteger(number)) {
      return 0;
    }

    const parts = number.toString().split('.');

    return parts[1].length;
  }

  isEmpty() {
    return this.getExpression().length === 0;
  }
}
