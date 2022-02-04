export function isExpression(str: unknown) {
  return typeof str === 'string' && /[\s\S]*{{[\s\S]*}}[\s\S]*/m.test(str);
}
