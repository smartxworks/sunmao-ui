import { ApplicationComponent, RuntimeComponentSpec } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import Ajv from 'ajv';
import { ApplicationModel } from '../AppModel/AppModel';
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

export class SchemaValidator implements ISchemaValidator {
  private result: ValidateErrorResult[] = [];
  private traitRules: TraitValidatorRule[] = [];
  private componentRules: ComponentValidatorRule[] = [];
  private allComponentsRules: AllComponentsValidatorRule[] = [];
  private componentIdSpecMap: Record<string, RuntimeComponentSpec> = {};
  private ajv!: Ajv;
  private validatorMap!: ValidatorMap;

  constructor(private registry: Registry) {
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
      }
    });
  }

  validate(components: ApplicationComponent[]) {
    const appModel = new ApplicationModel(components);
    this.genComponentIdSpecMap(components);
    this.result = [];
    const baseContext = {
      components,
      validators: this.validatorMap,
      registry: this.registry,
      appModel,
      componentIdSpecMap: this.componentIdSpecMap,
      ajv: this.ajv,
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
        
        this.traitRules.forEach(rule => {
          component.traits.forEach(trait => {
            const r = rule.validate({
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

  genComponentIdSpecMap(components: ApplicationComponent[]) {
    components.forEach(c => {
      this.componentIdSpecMap[c.id] = this.registry.getComponentByType(c.type);
    });
  }

  private initAjv() {
    this.ajv = new Ajv({}).addKeyword('kind').addKeyword('modifier');

    this.validatorMap = {
      components: {},
      traits: {},
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
  }
}
