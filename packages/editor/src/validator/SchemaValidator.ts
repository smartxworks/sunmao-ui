import { ComponentSchema, RuntimeComponent } from '@sunmao-ui/core';
import { Registry, StateManager } from '@sunmao-ui/runtime';
import Ajv from 'ajv';
import { PropertiesValidatorRule } from '.';
import { AppModel } from '../AppModel/AppModel';
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
  private propertiesRules: PropertiesValidatorRule[] = [];
  private componentIdSpecMap: Record<
    string,
    RuntimeComponent<string, string, string, string>
  > = {};

  private ajv!: Ajv;
  private validatorMap!: ValidatorMap;

  constructor(private registry: Registry, private stateManager: StateManager) {
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

  validate(components: ComponentSchema[]) {
    const appModel = new AppModel(components, this.registry);
    this.genComponentIdSpecMap(components);
    this.result = [];
    const baseContext = {
      components,
      validators: this.validatorMap,
      stateManager: this.stateManager,
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
        component.traits.forEach(trait => {
          const r = rule.validate({
            trait,
            component,
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

  genComponentIdSpecMap(components: ComponentSchema[]) {
    components.forEach(c => {
      this.componentIdSpecMap[c.id] = this.registry.getComponentByType(c.type);
    });
  }

  private initAjv() {
    this.ajv = new Ajv({})
      .addKeyword('kind')
      .addKeyword('modifier')
      .addKeyword('widget')
      .addKeyword('weight')
      .addKeyword('category')
      .addKeyword('widgetOptions');

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
