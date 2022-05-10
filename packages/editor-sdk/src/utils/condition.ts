import { EQ, NOT, GT, LT, GTE, LTE, COMPARISON_OPERATORS } from '@sunmao-ui/shared';
import type { Condition, ComparisonOperator } from '@sunmao-ui/shared';

export function isComparisonOperator(
  condition: Condition
): condition is ComparisonOperator {
  return 'key' in condition;
}

export function checkComparisonCondition(
  condition: ComparisonOperator,
  data: Record<string, any>
): boolean {
  const { key, ...operators } = condition;
  const value = data[key];

  return (Object.keys(operators) as (keyof typeof COMPARISON_OPERATORS)[]).every(
    operator => {
      switch (operator) {
        case EQ:
          return operators[operator] === value;
        case NOT:
          return operators[operator] !== value;
        case GT:
          return operators[operator] < value;
        case LT:
          return operators[operator] > value;
        case GTE:
          return operators[operator] <= value;
        case LTE:
          return operators[operator] >= value;
      }

      return true;
    }
  );
}

export function checkUnionConditions(
  conditions: Condition[],
  data: Record<string, any>
): boolean {
  return conditions.some(condition => checkCondition(condition, data));
}

export function checkIntersectionConditions(
  conditions: Condition[],
  data: Record<string, any>
): boolean {
  return conditions.every(condition => checkCondition(condition, data));
}

export function checkCondition(condition: Condition, data: Record<string, any>): boolean {
  if (isComparisonOperator(condition)) {
    return checkComparisonCondition(condition, data);
  } else if ('or' in condition) {
    return checkUnionConditions(condition.or, data);
  } else if ('and' in condition) {
    return checkIntersectionConditions(condition.and, data);
  }

  return true;
}

export function shouldRender(
  conditions: Condition[],
  data: Record<string, any>
): boolean {
  if (!conditions) return true;

  return checkIntersectionConditions(conditions, data);
}
