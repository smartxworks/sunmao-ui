export function isExpression (str: unknown) {
  const regExp = new RegExp('.*{{.*}}.*');
  return typeof str === 'string' && regExp.test(str)
}
