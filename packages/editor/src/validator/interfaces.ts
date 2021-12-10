import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import Ajv from 'ajv';
import { ValidateResult } from './ValidateResult';

export interface ComponentValidateContext {
  component: ApplicationComponent;
  components: ApplicationComponent[];
  registry: Registry;
  ajv: Ajv;
}

export interface TraitValidateContext {
  trait: ComponentTrait;
  component: ApplicationComponent;
  components: ApplicationComponent[];
  registry: Registry;
  ajv: Ajv;
}
export interface AllComponentsValidateContext {
  components: ApplicationComponent[];
  ajv: Ajv;
}

export type ValidateContext =
  | ComponentValidateContext
  | TraitValidateContext
  | AllComponentsValidateContext;

export interface ComponentValidatorRule {
  kind: 'component';
  validate: (validateContext: ComponentValidateContext) => ValidateResult[];
  // fix: (
  //   component: ApplicationComponent,
  //   components: ApplicationComponent[]
  // ) => ApplicationComponent;
}

export interface AllComponentsValidatorRule {
  kind: 'allComponents';
  validate: (validateContext: AllComponentsValidateContext) => ValidateResult[];
  // fix: (components: ApplicationComponent[]) => ApplicationComponent[];
}

export interface TraitValidatorRule {
  kind: 'trait';
  validate: (validateContext: TraitValidateContext) => ValidateResult[];
  // fix: (
  //   trait: ComponentTrait,
  //   component: ApplicationComponent,
  //   components: ApplicationComponent[]
  // ) => ApplicationComponent;
}

export type ValidatorRule =
  | ComponentValidatorRule
  | AllComponentsValidatorRule
  | TraitValidatorRule;

export interface ISchemaValidator {
  addRules: (rule: ValidatorRule[]) => void;
  validate: () => ValidateResult[];
  fix: () => void;
}

export const DefaultValidateResult = new ValidateResult('ok', '', -1, () => undefined);
