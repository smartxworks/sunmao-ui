import { ValidatorRule } from '..';
import { AllComponentsRules } from './AllComponentsRules';
import { ComponentRules } from './ComponentRules';
import { TraitRules } from './TraitRules';

export const rules: ValidatorRule[] = [...AllComponentsRules, ...ComponentRules, ...TraitRules];
