import { RuntimeComponentSpec, ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import Ajv, { ValidateFunction } from 'ajv';

export interface ValidatorMap {
  components: Record<string, ValidateFunction>;
  traits: Record<string, ValidateFunction>;
}

interface BaseValidateContext {
  validators: ValidatorMap;
  registry: Registry;
  components: ApplicationComponent[];
  componentIdSpecMap: Record<string, RuntimeComponentSpec>;
  ajv: Ajv
}

export interface ComponentValidateContext extends BaseValidateContext {
  component: ApplicationComponent;
}

export interface TraitValidateContext extends BaseValidateContext {
  trait: ComponentTrait;
  component: ApplicationComponent;
}
export type AllComponentsValidateContext = BaseValidateContext;

export type ValidateContext =
  | ComponentValidateContext
  | TraitValidateContext
  | AllComponentsValidateContext;

export interface ComponentValidatorRule {
  kind: 'component';
  validate: (validateContext: ComponentValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: ComponentValidateContext) => ApplicationComponent;
}

export interface AllComponentsValidatorRule {
  kind: 'allComponents';
  validate: (validateContext: AllComponentsValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: AllComponentsValidateContext) => ApplicationComponent[];
}

export interface TraitValidatorRule {
  kind: 'trait';
  validate: (validateContext: TraitValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: TraitValidateContext) => ApplicationComponent;
}

export type ValidatorRule =
  | ComponentValidatorRule
  | AllComponentsValidatorRule
  | TraitValidatorRule;

export interface ISchemaValidator {
  addRules: (rule: ValidatorRule[]) => void;
  validate: (components: ApplicationComponent[]) => ValidateErrorResult[];
  fix?: () => void;
}

export interface ValidateErrorResult {
  componentId: string;
  traitType?: string;
  property?: string;
  message: string;
  fix?: () => void;
}
