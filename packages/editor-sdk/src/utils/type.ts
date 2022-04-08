const TypeMap = {
  undefined: 'Undefined',
  string: 'String',
  boolean: 'Boolean',
  number: 'Number',
  object: 'Object',
  function: 'Function',
  symbol: 'Symbol',
  bigint: 'BigInt',
};

export function getTypeString(value: any) {
  if (value === null) {
    return 'Null';
  } else if (value instanceof Array) {
    return 'Array';
  } else {
    return TypeMap[typeof value];
  }
}
