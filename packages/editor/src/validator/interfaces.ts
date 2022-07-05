import { ComponentSchema, RuntimeComponent } from '@sunmao-ui/core';
import { RegistryInterface } from '@sunmao-ui/runtime';
import Ajv, { ValidateFunction } from 'ajv';
import { AppModel } from '../AppModel/AppModel';
import {
  IAppModel,
  IComponentModel,
  IFieldModel,
  ITraitModel,
} from '../AppModel/IAppModel';

export interface ValidatorMap {
  components: Record<string, ValidateFunction>;
  traits: Record<string, ValidateFunction>;
}

interface BaseValidateContext {
  components: ComponentSchema[];
  validators: ValidatorMap;
  registry: RegistryInterface;
  appModel: IAppModel;
  ajv: Ajv;
  componentIdSpecMap: Record<string, RuntimeComponent<string, string, string, string>>;
}

export interface ComponentValidateContext extends BaseValidateContext {
  component: IComponentModel;
}

export interface TraitValidateContext extends BaseValidateContext {
  trait: ITraitModel;
  component: IComponentModel;
}

export interface PropertiesValidateContext extends BaseValidateContext {
  properties: IFieldModel;
  trait?: ITraitModel;
  component: IComponentModel;
}

export type AllComponentsValidateContext = BaseValidateContext;

export type ValidateContext =
  | ComponentValidateContext
  | TraitValidateContext
  | PropertiesValidateContext
  | AllComponentsValidateContext;

export interface ComponentValidatorRule {
  kind: 'component';
  validate: (validateContext: ComponentValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: ComponentValidateContext) => void;
}

export interface PropertiesValidatorRule {
  kind: 'properties';
  validate: (validateContext: PropertiesValidateContext) => ValidateErrorResult[];
  fix?: (validateContext: PropertiesValidateContext) => void;
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
  | PropertiesValidatorRule
  | TraitValidatorRule;

export interface ISchemaValidator {
  addRules: (rule: ValidatorRule[]) => void;
  validate: (appModel: AppModel) => ValidateErrorResult[];
  fix?: () => void;
}

export interface ValidateErrorResult {
  componentId: string;
  traitType?: string;
  property?: string;
  message: string;
  fix?: () => void;
}
