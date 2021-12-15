import { Static } from '@sinclair/typebox';
import {
  AllComponentsValidatorRule,
  ComponentValidatorRule,
  TraitValidatorRule,
  AllComponentsValidateContext,
  ComponentValidateContext,
  TraitValidateContext,
  ValidateErrorResult,
} from './interfaces';
import { EventHandlerSchema } from '@sunmao-ui/runtime';

function isExpression (str: unknown) {
  const regExp = new RegExp('.*{{.*}}.*');
  return typeof str === 'string' && regExp.test(str)
}
export class RepeatIdValidatorRule implements AllComponentsValidatorRule {
  kind: 'allComponents' = 'allComponents';

  validate({ components }: AllComponentsValidateContext): ValidateErrorResult[] {
    const componentIds = new Set<string>();
    const results: ValidateErrorResult[] = [];
    components.forEach(component => {
      if (componentIds.has(component.id)) {
        results.push({
          message: 'Duplicate component id.',
          componentId: component.id,
          fix: () => {
            `${component.id}_${Math.floor(Math.random() * 10000)}`;
          },
        });
      } else {
        componentIds.add(component.id);
      }
    });
    return results;
  }
}

export class ParentValidatorRule implements AllComponentsValidatorRule {
  kind: 'allComponents' = 'allComponents';

  validate({
    components,
    componentIdSpecMap,
  }: AllComponentsValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    components.forEach(c => {
      const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
      if (slotTrait) {
        const { id: parentId, slot } = slotTrait.properties.container as any;
        const parent = components.find(c => c.id === parentId)!;
        if (!parent) {
          results.push({
            message: `Cannot find parent component: ${parentId}.`,
            componentId: c.id,
            traitType: slotTrait.type,
            property: '/container/id',
          });
        } else {
          const parentSpec = componentIdSpecMap[parent.id];
          if (!parentSpec) {
            results.push({
              message: `Component is not registered: ${parent.type}.`,
              componentId: parent.id,
            });
          } else if (!parentSpec.spec.slots.includes(slot)) {
            results.push({
              message: `Parent component '${parent.id}' does not have slot: ${slot}.`,
              componentId: c.id,
              traitType: slotTrait.type,
              property: '/container/slot',
            });
          }
        }
      }
    });
    return results;
  }
}

export class ComponentPropertyValidatorRule implements ComponentValidatorRule {
  kind: 'component' = 'component';

  validate({ component, validators }: ComponentValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const validate = validators.components[component.type];
    if (!validate) {
      results.push({
        message: `Component is not registered: ${component.type}.`,
        componentId: component.id,
      });
      return results;
    }

    const valid = validate(component.properties);
    if (!valid) {
      validate.errors!.forEach(error => {
        if (error.keyword === 'type') {
          const { instancePath } = error;
          const path = instancePath.split('/')[1];
          const value = component.properties[path];
          // if value is an expression, skip it
          if (isExpression(value)) {
            return;
          }
        }

        results.push({
          message: error.message || '',
          componentId: component.id,
          property: error.instancePath,
        });
      });
    }
    return results;
  }
}
export class TraitPropertyValidatorRule implements TraitValidatorRule {
  kind: 'trait' = 'trait';

  validate({
    trait,
    component,
    validators,
  }: TraitValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const validate = validators.traits[trait.type];
    if (!validate) {
      results.push({
        message: `Trait is not registered: ${trait.type}.`,
        componentId: component.id,
      });
      return results;
    }

    const valid = validate(trait.properties);
    if (!valid) {
      validate.errors!.forEach(error => {
        if (error.keyword === 'type') {
          const { instancePath } = error;
          const path = instancePath.split('/')[1];
          const value = trait.properties[path];

          // if value is an expression, skip it
          if (isExpression(value)) {
            return;
          }
        }
        results.push({
          message: error.message || '',
          componentId: component.id,
          traitType: trait.type,
          property: error.instancePath,
        });
      });
    }
    return results;
  }
}

export class EventHandlerValidatorRule implements TraitValidatorRule {
  kind: 'trait' = 'trait';
  traitMethods = ['setValue', 'resetValue', 'triggerFetch']

  validate({
    trait,
    component,
    components,
    componentIdSpecMap,
    ajv,
  }: TraitValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    if (trait.type !== 'core/v1/event') {
      return results;
    }
    const handlers = trait.properties.handlers as Static<typeof EventHandlerSchema>[];
    handlers.forEach((handler, i) => {
      const {
        type: eventName,
        componentId: targetId,
        method: { name: methodName, parameters },
      } = handler;
      const componentSpec = componentIdSpecMap[component.id];
      if (!componentSpec.spec.events.includes(eventName)) {
        results.push({
          message: `Component does not have event: ${eventName}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/type`,
        });
      }

      if (isExpression(targetId)) {
        return
      }

      const targetComponent = components.find(c => c.id === targetId);
      if (!targetComponent) {
        results.push({
          message: `Event target component is not exist: ${targetId}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/componentId`,
        });
        return;
      }

      const targetComponentSpec = componentIdSpecMap[targetComponent.id];
      if (!targetComponentSpec) {
        results.push({
          message: `Event target component is not registered: ${targetId}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/componentId`,
        });
        return;
      }

      const methodSchema = targetComponentSpec.spec.methods.find(
        m => m.name === methodName
      );

      if (!methodSchema && !this.traitMethods.includes(methodName)) {
        results.push({
          message: `Event target component does not have method: ${methodName}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/method/name`,
        });
        return;
      }

      if (methodSchema?.parameters && !ajv.validate(methodSchema.parameters, parameters)) {
        ajv.errors!.forEach(error => {
          if (error.keyword === 'type') {
            const { instancePath } = error;
            const path = instancePath.split('/')[1];
            const value = trait.properties[path];

            // if value is an expression, skip it
          if (isExpression(value)) {
              return;
            }
          }
          results.push({
            message: error.message || '',
            componentId: component.id,
            traitType: trait.type,
            property: `/handlers/${i}/method/parameters${error.instancePath}`,
          });
        });
      }
    });

    return results;
  }
}
export const rules = [
  new RepeatIdValidatorRule(),
  new ParentValidatorRule(),
  new ComponentPropertyValidatorRule(),
  new TraitPropertyValidatorRule(),
  new EventHandlerValidatorRule()
];
