type BaseType = string | number | boolean;
type Field = { key: string };

// compare
type EQ = { value: BaseType };
type Not = { not: BaseType };
type GT = { gt: number };
type LT = { lt: number };
type GTE = { gte: number };
type LTE = { lte: number };
export type ComparisonOperator = Field & (EQ | Not | GT | LT | GTE | LTE);

// logic
type And = { and: (Logic | ComparisonOperator)[] };
type Or = { or: (Logic | ComparisonOperator)[] };
export type Logic = And | Or;

export type Condition = (ComparisonOperator | Logic);
