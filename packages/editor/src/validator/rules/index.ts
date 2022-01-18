import { ValidatorRule } from '..';
import { AllComponentsRules } from './AllComponentsRules';
import { ComponentRules } from './ComponentRules';
import { TraitRules } from './TraitRules';
import { PropertiesRules } from './PropertiesRules';

export const rules: ValidatorRule[] = [...AllComponentsRules, ...ComponentRules, ...TraitRules, ...PropertiesRules];
