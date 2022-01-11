import { Static } from '@sinclair/typebox';
import {
  TraitValidatorRule,
  TraitValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { EventHandlerSchema } from '@sunmao-ui/runtime';
import { isExpression } from '../utils';
import { ComponentId, EventName } from '../../AppModel/IAppModel';
import { get } from 'lodash-es';

class TraitPropertyValidatorRule implements TraitValidatorRule {
  kind: 'trait' = 'trait';

  validate({
    trait,
    component,
    validators,
    componentIdSpecMap,
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
    const valid = validate(trait.rawProperties);
    if (!valid) {
      validate.errors!.forEach(error => {
        const { instancePath, params } = error;
        let key = '';
        if (instancePath) {
          key = instancePath.split('/')[1];
        } else {
          key = params.missingProperty;
        }
        const fieldModel = trait.properties.getProperty(key);
        // if field is expression, ignore type error
        // fieldModel could be undefiend. if is undefined, still throw error.
        if (get(fieldModel, 'isDynamic') !== true) {
          results.push({
            message: error.message || '',
            componentId: component.id,
            traitType: trait.type,
            property: error.instancePath,
          });
        }
      });
    }

    // validate expression
    trait.properties.traverse((fieldModel, key) => {
      fieldModel.refs.forEach((id: string) => {
        if (!componentIdSpecMap[id]) {
          results.push({
            message: `Cannot find '${id}' in store.`,
            componentId: component.id,
            property: key,
          });
        }
      });
    });
    return results;
  }
}

class EventHandlerValidatorRule implements TraitValidatorRule {
  kind: 'trait' = 'trait';
  traitMethods = ['setValue', 'resetValue', 'triggerFetch'];

  validate({
    appModel,
    trait,
    component,
    ajv,
  }: TraitValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    if (trait.type !== 'core/v1/event') {
      return results;
    }
    const handlers = trait.rawProperties.handlers as Static<typeof EventHandlerSchema>[];
    handlers.forEach((handler, i) => {
      const {
        type: eventName,
        componentId: targetId,
        method: { name: methodName, parameters },
      } = handler;

      if (!component.events.includes(eventName as EventName)) {
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

      const targetComponent = appModel.getComponentById(targetId as ComponentId);
      if (!targetComponent) {
        results.push({
          message: `Event target component is not exist: ${targetId}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/componentId`,
        });
        return;
      }

      const method = targetComponent.methods.find(m => m.name === methodName);
      if (!method) {
        results.push({
          message: `Event target component does not have method: ${methodName}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/method/name`,
        });
        return;
      }

      if (method.parameters && !ajv.validate(method.parameters, parameters)) {
        ajv.errors!.forEach(error => {
          if (error.keyword === 'type') {
            const { instancePath } = error;
            const path = instancePath.split('/')[1];
            const value = trait.rawProperties[path];

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
