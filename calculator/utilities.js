export function isEmpty(data) {
  return data.length === 0;
}

export function isNumericString(input) {
  return typeof input === 'string' && !Number.isNaN(parseFloat(input));
}

export function getLastElement(array) {
  return array[array.length - 1];
}
