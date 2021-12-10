import { ApplicationComponent, Application } from '@sunmao-ui/core';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { registry } from '../setup';
import {
  ISchemaValidator,
  ComponentValidatorRule,
  AllComponentsValidatorRule,
  TraitValidatorRule,
  ValidatorRule,
} from './interfaces';
import { ValidateResult } from './ValidateResult';

export class SchemaValidator implements ISchemaValidator {
  private components: ApplicationComponent[];
  private traitRules: TraitValidatorRule[] = [];
  private componentRules: ComponentValidatorRule[] = [];
  private allComponentsRules: AllComponentsValidatorRule[] = [];
  private result: ValidateResult[] = [];
  private ajv: Ajv;

  constructor(private app: Application) {
    this.components = this.app.spec.components;
    this.ajv = addFormats(new Ajv({}), [
      'date-time',
      'time',
      'date',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uri',
      'uri-reference',
      'uuid',
      'uri-template',
      'json-pointer',
      'relative-json-pointer',
      'regex',
    ])
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

  validate() {
    this.result = [];
    this.allComponentsRules.forEach(rule => {
      const r = rule.validate({ components: this.components, ajv: this.ajv });
      if (r.length > 0) {
        this.result = this.result.concat(r);
      }
    });
    this.componentRules.forEach(rule => {
      this.components.forEach(component => {
        const r = rule.validate({
          component,
          components: this.components,
          registry,
          ajv: this.ajv,
        });
        if (r.length > 0) {
          this.result = this.result.concat(r);
        }
      });
    });
    this.traitRules.forEach(rule => {
      this.components.forEach(component => {
        component.traits.forEach(trait => {
          const r = rule.validate({
            trait,
            component,
            components: this.components,
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
    this.result.forEach(r => {
      r.fix();
    });
    return this.components;
  }
}
