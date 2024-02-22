export function isEmpty(data) {
  return data.length === 0;
}

export function isNumericString(input) {
  return typeof input === 'string' && !Number.isNaN(parseFloat(input));
}

export function getLastElement(array) {
  return array[array.length - 1];
}

export function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}