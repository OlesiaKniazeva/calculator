import { Calculator } from './calculator.js';

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('resetDecimal sets flag to false', () => {
    calculator.resetDecimal();
    expect(calculator.checkIfDecimalEntered()).toBe(false);
  });

  test('setDecimal sets flag to true', () => {
    calculator.setDecimal();
    expect(calculator.checkIfDecimalEntered()).toBe(true);
  });

  test('getExpression returns the current expression', () => {
    calculator.setExpression('2 + 3');
    expect(calculator.getExpression()).toBe('2 + 3');
  });

  test('getOperationDisplay returns the current operation as a string splitted with spaces', () => {
    calculator.setExpression(['2', '+', 3]);

    expect(calculator.getOperationDisplay()).toBe('2 + 3');
  });

  test('convertExpressionToString returns the expression as a string', () => {
    calculator.setExpression(['2', '+', 3]);

    expect(calculator.convertExpressionToString()).toBe('2+3');
  });

  test('add performs addition correctly', () => {
    const result = Calculator.add(2, 3);
    expect(result).toBe(5);
  });

  test('subtract performs subtraction correctly', () => {
    const result = Calculator.subtract(5, 2);
    expect(result).toBe(3);
  });

  test('multiply performs multiplication correctly', () => {
    const result = Calculator.multiply(2, 3);
    expect(result).toBe(6);
  });

  test('divide performs division correctly', () => {
    const result = Calculator.divide(6, 2);
    expect(result).toBe(3);
  });

  test('If no data and user input operator, first zero added', () => {
    calculator.processSymbol('plus');
    const expression = calculator.getExpression();

    expect(expression).toEqual(['0', '+']);
  });

  test('Evaluate operator add zero to stack if stack was empty before operation', () => {
    calculator.evaluateOperator('minus');
    const expression = calculator.getExpression();

    expect(expression).toEqual(['0', '-']);
  });

  test('Evaluate operator not add zero to stack if stack was filled before operation', () => {
    calculator.setExpression(['2']);
    calculator.evaluateOperator('minus');
    const expression = calculator.getExpression();

    expect(expression).toEqual(['2', '-']);
  });

  test('If i get an operator decimal flag should be disabled', () => {
    calculator.setDecimal();
    calculator.evaluateOperator('multiply');
    expect(calculator.checkIfDecimalEntered()).toBe(false);
  });

  test('Tokenize split operators and operands', () => {
    calculator.setExpression(['3', '4', '+', '6']);

    expect(calculator.tokenize()).toEqual(['34', '+', '6']);

    calculator.addToStack('.');
    calculator.addToStack('5');

    expect(calculator.tokenize()).toEqual(['34', '+', '6.5']);

    calculator.addToStack('/');
    calculator.addToStack('5');
    calculator.addToStack('.');
    calculator.addToStack('1');
    calculator.addToStack('1');

    expect(calculator.tokenize()).toEqual(['34', '+', '6.5', '/', '5.11']);
  });

  test('Tokenize right if first data is operator', () => {
    calculator.setExpression(['+', '5', '3']);

    expect(calculator.tokenize()).toEqual(['+', '53']);
  });

  test('Convert to postfix, change the infix expression to posfix expression', () => {
    const postfix = Calculator.convertToPostfix(['2.3', '+', '3', '*', '6']);

    expect(postfix).toEqual(['2.3', '3', '6', '*', '+']);
  });

  test('Convert to postfix, change the infix expression to posfix expression', () => {
    const postfix = Calculator.convertToPostfix([
      '2.3',
      '+',
      '3',
      '*',
      '2',
      '/',
      '4.5',
      '-',
      '0',
    ]);

    expect(postfix).toEqual(['2.3', '3', '2', '*', '4.5', '/', '+', '0', '-']);
  });

  test('Convert to postfix, change the infix expression to posfix expression', () => {
    const postfix = Calculator.convertToPostfix(['2.3', '+', '3']);

    expect(postfix).toEqual(['2.3', '3', '+']);
  });

  test('Postfix expression evaluated correctly', () => {
    const posfix = ['2', '3', '1', '*', '+', '9', '-'];

    expect(Calculator.evaluatePostfix(posfix)).toBe('-4');
  });

  test('Postfix expression evaluated correctly', () => {
    const posfix = ['100', '200', '+', '2', '/', '5', '*', '7', '+'];

    expect(Calculator.evaluatePostfix(posfix)).toBe('757');
  });

  test('Postfix expression evaluated correctly', () => {
    const posfix = ['1', '3', '/'];

    expect(Calculator.evaluatePostfix(posfix)).toBe('0.33');
  });

  test('digitsAfterDecimal return right amount of digits after the point of decimal', () => {
    expect(Calculator.digitsAfterDecimal(5)).toBe(0);
    expect(Calculator.digitsAfterDecimal(10)).toBe(0);
    expect(Calculator.digitsAfterDecimal(10.89)).toBe(2);
    expect(Calculator.digitsAfterDecimal(10.9989)).toBe(4);
    expect(Calculator.digitsAfterDecimal(10.1933743)).toBe(7);
  });

  test('Division to zero should show the infinity as a result', () => {
    calculator.setExpression(['100', '/', '0']);
    expect(calculator.calculate()).toBe(Infinity);
  });

  test('Input of several operators in a raw should be prevented', () => {
    calculator.processSymbol('one');
    calculator.processSymbol('plus');
    calculator.processSymbol('plus');

    expect(calculator.getExpression()).toEqual(['1', '+']);
  });

  test('If user pushed equal as a first key, it should return defaut zero', () => {
    calculator.processSymbol('equal');

    expect(calculator.getExpression()).toEqual(['0']);
  });

  test('OperatorPrecedence return right raiting for operators', () => {
    expect(Calculator.operatorPrecedence('+')).toBe(1);
    expect(Calculator.operatorPrecedence('-')).toBe(1);
    expect(Calculator.operatorPrecedence('/')).toBe(2);
    expect(Calculator.operatorPrecedence('*')).toBe(2);
    expect(Calculator.operatorPrecedence('=')).toBe(-1);
  });

  test('By default array is equal to ["0"] for the future display', () => {
    expect(calculator.getExpression()).toEqual(['0']);
  });

  test('If first user input is number, change zero to the number', () => {
    calculator.processSymbol('five');

    expect(calculator.getExpression()).toEqual(['5']);
  });

  test('If user input several operators, change them', () => {
    calculator.processSymbol('plus');
    calculator.processSymbol('multiply');

    expect(calculator.getExpression()).toEqual(['0', '*']);
  });

  test('After multiply or divide user can paste unary minus', () => {
    calculator.processSymbol('two');
    calculator.processSymbol('multiply');
    calculator.processSymbol('minus');
    calculator.processSymbol('five');

    expect(calculator.getExpression()).toEqual(['2', '*', '-', '5']);
    expect(calculator.getOperationDisplay()).toEqual('2 × - 5');

    calculator.processSymbol('equal');

    expect(calculator.getOperationDisplay()).toBe('-10');
  });

  test('If user pushed minus two times at a start of program, he should get unary minus', () => {
    calculator.processSymbol('minus');
    calculator.processSymbol('minus');
    calculator.processSymbol('five');

    expect(calculator.getExpression()).toEqual(['-', '5']);
    expect(calculator.getOperationDisplay()).toBe('-5');
  });
});
