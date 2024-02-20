import { isEmpty, isNumericString, getLastElement } from './utilities.js';

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
    const data = this.tokenize();
    return data.join(' ');
  }

  convertExpressionToString() {
    return this.getExpression().join('');
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
        console.log('ERROR, unexpected operator');
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
        }
        this.addToStack('.');
        this.setDecimal();
        break;
      case SPECIAL_OPERATIONS.equal:
        if (Object.values(OPERATOR).includes(this.getLastElement())) {
          return;
        }

        if (this.isEmpty()) {
          this.addToStack('0');
        }

        this.processExpression();
        break;
      default:
        console.log('def');
    }
  }

  getLastElement() {
    const data = this.getExpression();

    return data[data.length - 1];
  }

  tokenize() {
    const data = this.convertExpressionToString();

    const tokens = data.split(/([+\-*/])|(\d+\.\d+|\d+)/).filter(Boolean);
    return tokens;
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

  static operatorPrecedence(operator) {
    if (operator === '*' || operator === '/') {
      return 2;
    }

    if (operator === '+' || operator === '-') {
      return 1;
    }

    return -1;
  }

  calculate() {
    const tokens = this.tokenize();
    const postfix = Calculator.convertToPostfix(tokens);
    return Calculator.evaluatePostfix(postfix);
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

  static round(number) {
    return number.toFixed(2);
  }

  static digitsAfterDecimal(number) {
    if (Number.isInteger(number)) {
      return 0;
    }

    const parts = number.toString().split('.');
    console.log(parts);

    return parts[1].length;
  }

  processExpression() {
    const result = this.calculate();
    this.resetState();
    this.addToStack(result);
  }

  isEmpty() {
    return this.getExpression().length === 0;
  }

  removeLast() {
    const last = this.removeFromStack();

    if (last === '.') {
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
