import { ApplicationComponent } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import Ajv from 'ajv';
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
  private ajv!: Ajv;
  private validatorMap!: ValidatorMap;

  constructor(registry: Registry) {
    this.initAjv(registry);
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
    this.result = [];
    const t1 = performance.now();
    this.allComponentsRules.forEach(rule => {
      const r = rule.validate({ components: components, validators: this.validatorMap });
      if (r.length > 0) {
        this.result = this.result.concat(r);
      }
    });
    this.componentRules.forEach(rule => {
      components.forEach(component => {
        const r = rule.validate({
          component,
          components: components,
          validators: this.validatorMap,
        });
        if (r.length > 0) {
          this.result = this.result.concat(r);
        }
      });
    });
    this.traitRules.forEach(rule => {
      components.forEach(component => {
        component.traits.forEach(trait => {
          const r = rule.validate({
            trait,
            component,
            components: components,
            validators: this.validatorMap,
          });
          if (r.length > 0) {
            this.result = this.result.concat(r);
          }
        });
      });
    });
    const t2 = performance.now();
    console.log('validate time:', t2 - t1, 'ms');
    return this.result;
  }

  fix() {
    // this.result.forEach(r => {
    //   r.fix();
    // });
    // return components;
  }

  private initAjv(registry: Registry) {
    this.ajv = new Ajv({}).addKeyword('kind').addKeyword('modifier');

    this.validatorMap = {
      components: {},
      traits: {},
    };
    registry.getAllComponents().forEach(c => {
      this.validatorMap.components[`${c.version}/${c.metadata.name}`] = this.ajv.compile(
        c.spec.properties
      );
    });
    registry.getAllTraits().forEach(t => {
      this.validatorMap.traits[`${t.version}/${t.metadata.name}`] = this.ajv.compile(
        t.spec.properties
      );
    });
  }
}
