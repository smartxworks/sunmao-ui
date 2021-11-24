export function isNumeric(x: string | number) {
  return !isNaN(Number(x)) && x !== '';
}
