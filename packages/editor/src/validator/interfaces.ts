import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { ValidateFunction } from 'ajv';

export interface ValidatorMap {
  components: Record<string, ValidateFunction>;
  traits: Record<string, ValidateFunction>;
}

interface BaseValidateContext {
  validators: ValidatorMap;
}

export interface ComponentValidateContext extends BaseValidateContext {
  component: ApplicationComponent;
  components: ApplicationComponent[];
}

export interface TraitValidateContext extends BaseValidateContext {
  trait: ComponentTrait;
  component: ApplicationComponent;
  components: ApplicationComponent[];
}
export interface AllComponentsValidateContext extends BaseValidateContext {
  components: ApplicationComponent[];
}

export type ValidateContext =
  | ComponentValidateContext
  | TraitValidateContext
  | AllComponentsValidateContext;

export interface ComponentValidatorRule {
  kind: 'component';
  validate: (validateContext: ComponentValidateContext) => ValidateErrorResult[];
  // fix: (
  //   component: ApplicationComponent,
  //   components: ApplicationComponent[]
  // ) => ApplicationComponent;
}

export interface AllComponentsValidatorRule {
  kind: 'allComponents';
  validate: (validateContext: AllComponentsValidateContext) => ValidateErrorResult[];
  // fix: (components: ApplicationComponent[]) => ApplicationComponent[];
}

export interface TraitValidatorRule {
  kind: 'trait';
  validate: (validateContext: TraitValidateContext) => ValidateErrorResult[];
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
  validate: (components: ApplicationComponent[]) => ValidateErrorResult[];
  fix: () => void;
}

export interface ValidateErrorResult {
  componentId: string,
  traitType?: string,
  property?: string,
  message: string;
  fix?: () => void
}
