import { Calculator } from './calculator.js';
import { operatorPrecedence } from './calculator.js';

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('resetDefault sets flag to false', () => {
    calculator.resetDefault();
    expect(calculator.checkIfDefault()).toBe(false);
  });

  test('setDefault sets flag to true', () => {
    calculator.setDefault();
    expect(calculator.checkIfDefault()).toBe(true);
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
    calculator.addToStack('2');
    calculator.addToStack('+');
    calculator.addToStack('3');

    expect(calculator.getOperationDisplay()).toBe('2 + 3');
  });

  test('convertExpressionToString returns the expression as a string', () => {
    calculator.addToStack('2');
    calculator.addToStack('+');
    calculator.addToStack('3');

    expect(calculator.convertExpressionToString()).toBe('2+3');
  });

  test('add performs addition correctly', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  test('subtract performs subtraction correctly', () => {
    const result = calculator.subtract(5, 2);
    expect(result).toBe(3);
  });

  test('multiply performs multiplication correctly', () => {
    const result = calculator.multiply(2, 3);
    expect(result).toBe(6);
  });

  test('divide performs division correctly', () => {
    const result = calculator.divide(6, 2);
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
    calculator.addToStack('2');
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
    calculator.addToStack('3');
    calculator.addToStack('4');
    calculator.addToStack('+');
    calculator.addToStack('6');

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
    calculator.addToStack('-');
    calculator.addToStack('5');
    calculator.addToStack('3');

    expect(calculator.tokenize()).toEqual(['-', '53']);
  });

  test('Convert to postfix, change the infix expression to posfix expression', () => {
    const postfix = calculator.convertToPostfix(['2.3', '+', '3', '*', '6']);

    expect(postfix).toEqual(['2.3', '3', '6', '*', '+']);
  });

  test('Convert to postfix, change the infix expression to posfix expression', () => {
    const postfix = calculator.convertToPostfix([
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
    const postfix = calculator.convertToPostfix(['2.3', '+', '3']);

    expect(postfix).toEqual(['2.3', '3', '+']);
  });

  test('Postfix expression evaluated correctly', () => {
    const posfix = ['2', '3', '1', '*', '+', '9', '-'];

    expect(calculator.evaluatePostfix(posfix)).toBe('-4');
  })

  test('Postfix expression evaluated correctly', () => {
    const posfix = ['100', '200', '+', '2', '/', '5', '*', '7', '+'];

    expect(calculator.evaluatePostfix(posfix)).toBe('757');
  })

  test('Postfix expression evaluated correctly', () => {
    const posfix = ['1', '3', '/'];

    expect(calculator.evaluatePostfix(posfix)).toBe('0.33');
  })

  test("digitsAfterDecimal return right amount of digits after the point of decimal", () => {
    expect(calculator.digitsAfterDecimal(5)).toBe(0);
    expect(calculator.digitsAfterDecimal(10)).toBe(0);
    expect(calculator.digitsAfterDecimal(10.89)).toBe(2);
    expect(calculator.digitsAfterDecimal(10.9989)).toBe(4);
    expect(calculator.digitsAfterDecimal(10.1933743)).toBe(7);
  })

});

/* ************** functions tests **************** */

test('OperatorPrecedence return right raiting for operators', () => {
  expect(operatorPrecedence('+')).toBe(1);
  expect(operatorPrecedence('-')).toBe(1);
  expect(operatorPrecedence('/')).toBe(2);
  expect(operatorPrecedence('*')).toBe(2);
  expect(operatorPrecedence('=')).toBe(-1);
});
