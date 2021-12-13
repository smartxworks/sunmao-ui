import { ApplicationComponent } from '@sunmao-ui/core';
import Ajv from 'ajv';
import { registry } from '../setup';
import {
  ISchemaValidator,
  ComponentValidatorRule,
  AllComponentsValidatorRule,
  TraitValidatorRule,
  ValidatorRule,
  ValidateErrorResult
} from './interfaces';
import { rules } from './rules';

export class SchemaValidator implements ISchemaValidator {
  private result: ValidateErrorResult[] = [];
  private traitRules: TraitValidatorRule[] = [];
  private componentRules: ComponentValidatorRule[] = [];
  private allComponentsRules: AllComponentsValidatorRule[] = [];
  private ajv: Ajv;

  constructor() {
    this.addRules(rules)
    this.ajv = new Ajv({})
      .addKeyword('kind')
      .addKeyword('modifier');
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
    this.allComponentsRules.forEach(rule => {
      const r = rule.validate({ components: components, ajv: this.ajv });
      if (r.length > 0) {
        this.result = this.result.concat(r);
      }
    });
    this.componentRules.forEach(rule => {
      components.forEach(component => {
        const r = rule.validate({
          component,
          components: components,
          registry,
          ajv: this.ajv,
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
            registry,
            ajv: this.ajv,
          });
          if (r.length > 0) {
            this.result = this.result.concat(r);
          }
        });
      });
    });
    return this.result;
  }

  fix() {
    // this.result.forEach(r => {
    //   r.fix();
    // });
    // return components;
  }
}
