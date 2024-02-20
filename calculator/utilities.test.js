import { isEmpty, isNumericString, getLastElement } from './utilities.js';

// Test isEmpty function

test('isEmpty should return true for empty string', () => {
  expect(isEmpty('')).toBe(true);
});

test('isEmpty should return false for non-empty string', () => {
  expect(isEmpty('Hello')).toBe(false);
});

test('isEmpty should return true for empty array', () => {
  expect(isEmpty([])).toBe(true);
});

test('isEmpty should return false for non-empty array', () => {
  expect(isEmpty([1, 2, 3])).toBe(false);
});

// Test isNumericString function

test('isNumericString should return true for numeric string', () => {
  expect(isNumericString('123')).toBe(true);
});

test('isNumericString should return true for decimal numeric string', () => {
  expect(isNumericString('123.78')).toBe(true);
});

test('isNumericString should return false for non-numeric string', () => {
  expect(isNumericString('abc')).toBe(false);
});

// Test getLastElement function

test('getLastElement should return the last element of an array', () => {
  expect(getLastElement([1, 2, 3])).toBe(3);
});

test('getLastElement should return undefined for an empty array', () => {
  expect(getLastElement([])).toBeUndefined();
});
