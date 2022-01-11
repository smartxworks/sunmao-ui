import { ComponentSchema } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import Ajv, { ValidateFunction } from 'ajv';
import { IAppModel, IComponentModel, ITraitModel } from '../AppModel/IAppModel';

export interface ValidatorMap {
  components: Record<string, ValidateFunction>;
  traits: Record<string, ValidateFunction>;
}

interface BaseValidateContext {
  validators: ValidatorMap;
  registry: Registry;
  appModel: IAppModel;
  ajv: Ajv;
}

export interface ComponentValidateContext extends BaseValidateContext {
  component: IComponentModel;
}

export interface TraitValidateContext extends BaseValidateContext {
  trait: ITraitModel;
  component: IComponentModel;
}
export type AllComponentsValidateContext = BaseValidateContext;

export type ValidateContext =
  | ComponentValidateContext
  | TraitValidateContext
  | AllComponentsValidateContext;

export interface ComponentValidatorRule {
  kind: 'component';
  validate: (validateContext: ComponentValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: ComponentValidateContext) => void;
}

export interface AllComponentsValidatorRule {
  kind: 'allComponents';
  validate: (validateContext: AllComponentsValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: AllComponentsValidateContext) => void[];
}

export interface TraitValidatorRule {
  kind: 'trait';
  validate: (validateContext: TraitValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: TraitValidateContext) => void;
}

export type ValidatorRule =
  | ComponentValidatorRule
  | AllComponentsValidatorRule
  | TraitValidatorRule;

export interface ISchemaValidator {
  addRules: (rule: ValidatorRule[]) => void;
  validate: (components: ComponentSchema[]) => ValidateErrorResult[];
  fix?: () => void;
}

export interface ValidateErrorResult {
  componentId: string;
  traitType?: string;
  property?: string;
  message: string;
  fix?: () => void;
}
