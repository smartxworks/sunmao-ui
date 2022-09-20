import { RuntimeComponent, SlotSpec } from '@sunmao-ui/core';
import { RegistryInterface } from '@sunmao-ui/runtime';
import Ajv from 'ajv';
import { PropertiesValidatorRule } from '.';
import { IAppModel } from '../AppModel/IAppModel';
import {
  ISchemaValidator,
  ComponentValidatorRule,
  AllComponentsValidatorRule,
  TraitValidatorRule,
  ValidatorRule,
  ValidateErrorResult,
  ValidatorMap,
} from './interfaces';
import { rules } from './rules';
import { JSONSchema7 } from 'json-schema';
import { initAjv } from '@sunmao-ui/shared';

export class SchemaValidator implements ISchemaValidator {
  private result: ValidateErrorResult[] = [];
  private traitRules: TraitValidatorRule[] = [];
  private componentRules: ComponentValidatorRule[] = [];
  private allComponentsRules: AllComponentsValidatorRule[] = [];
  private propertiesRules: PropertiesValidatorRule[] = [];
  private componentIdSpecMap: Record<
    string,
    RuntimeComponent<
      any,
      any,
      Record<string, JSONSchema7 | undefined>,
      ReadonlyArray<string>,
      Record<string, SlotSpec>,
      ReadonlyArray<string>
    >
  > = {};

  private ajv!: Ajv;
  private validatorMap!: ValidatorMap;

  constructor(private registry: RegistryInterface, private dependencyNames?: string[]) {
    this.initAjv();
    this.addRules(rules);
  }

  addRules(rules: ValidatorRule[]) {
    rules.forEach(rule => {
      switch (rule.kind) {
        case 'component':
          this.componentRules.push(rule);
          break;
        case 'allComponents':
          this.allComponentsRules.push(rule);
          break;
        case 'trait':
          this.traitRules.push(rule);
          break;
        case 'properties':
          this.propertiesRules.push(rule);
          break;
      }
    });
  }

  validate(appModel: IAppModel) {
    this.genComponentIdSpecMap(appModel);
    this.result = [];
    const components = appModel.toSchema();
    const baseContext = {
      components,
      validators: this.validatorMap,
      registry: this.registry,
      appModel,
      componentIdSpecMap: this.componentIdSpecMap,
      ajv: this.ajv,
      dependencyNames: this.dependencyNames || [],
    };
    this.allComponentsRules.forEach(rule => {
      const r = rule.validate(baseContext);
      if (r.length > 0) {
        this.result = this.result.concat(r);
      }
    });
    appModel.allComponents.forEach(component => {
      this.componentRules.forEach(rule => {
        const r = rule.validate({
          component,
          ...baseContext,
        });
        if (r.length > 0) {
          this.result = this.result.concat(r);
        }
      });

      // validate component properties
      this.propertiesRules.forEach(rule => {
        const r = rule.validate({
          properties: component.properties,
          component,
          ...baseContext,
        });
        if (r.length > 0) {
          this.result = this.result.concat(r);
        }
      });

      this.traitRules.forEach(rule => {
        component.traits.forEach((trait, i) => {
          const r = rule.validate({
            trait,
            component,
            traitIndex: i,
            ...baseContext,
          });
          if (r.length > 0) {
            this.result = this.result.concat(r);
          }
          // validate trait properties
          this.propertiesRules.forEach(rule => {
            const r = rule.validate({
              properties: trait.properties,
              trait,
              component,
              ...baseContext,
            });
            if (r.length > 0) {
              this.result = this.result.concat(r);
            }
          });
        });
      });
    });
    return this.result;
  }

  genComponentIdSpecMap(appModel: IAppModel) {
    appModel.traverseTree(c => {
      this.componentIdSpecMap[c.id] = this.registry.getComponentByType(c.type);
    });
  }

  fix() {
    this.result.forEach(r => {
      r.fix?.();
    });
  }

  private initAjv() {
    this.ajv = initAjv(new Ajv({}));

    this.validatorMap = {
      components: {},
      traits: {},
      utilMethods: {},
    };
    this.registry.getAllComponents().forEach(c => {
      this.validatorMap.components[`${c.version}/${c.metadata.name}`] = this.ajv.compile(
        c.spec.properties
      );
    });
    this.registry.getAllTraits().forEach(t => {
      this.validatorMap.traits[`${t.version}/${t.metadata.name}`] = this.ajv.compile(
        t.spec.properties
      );
    });
    this.registry.getAllUtilMethods().forEach(t => {
      this.validatorMap.utilMethods[`${t.version}/${t.metadata.name}`] = this.ajv.compile(
        t.spec.parameters
      );
    });
  }
}
