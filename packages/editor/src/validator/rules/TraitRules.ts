import { Static } from '@sinclair/typebox';
import {
  TraitValidatorRule,
  TraitValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { EventHandlerSchema } from '@sunmao-ui/runtime';
import { isExpression } from '../utils';

class TraitPropertyValidatorRule implements TraitValidatorRule {
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

class EventHandlerValidatorRule implements TraitValidatorRule {
  kind: 'trait' = 'trait';
  traitMethods = ['setValue', 'resetValue', 'triggerFetch'];

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
        return;
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

      if (
        methodSchema?.parameters &&
        !ajv.validate(methodSchema.parameters, parameters)
      ) {
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
export const TraitRules = [
  new TraitPropertyValidatorRule(),
  new EventHandlerValidatorRule(),
];
