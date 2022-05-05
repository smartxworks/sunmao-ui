import { Static } from '@sinclair/typebox';
import {
  TraitValidatorRule,
  TraitValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { EventHandlerSpec, GLOBAL_UTIL_METHOD_ID } from '@sunmao-ui/runtime';
import { isExpression } from '../utils';
import { ComponentId, EventName } from '../../AppModel/IAppModel';
import { CORE_VERSION, EVENT_TRAIT_NAME } from '@sunmao-ui/shared';

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
    if (trait.type !== `${CORE_VERSION}/${EVENT_TRAIT_NAME}`) {
      return results;
    }
    const handlers = trait.rawProperties.handlers as Static<typeof EventHandlerSpec>[];
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

      // TODO: util methods has no method schema to check the parameters, so now temporally skip validation
      if (isExpression(targetId) || targetId === GLOBAL_UTIL_METHOD_ID) {
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
  new EventHandlerValidatorRule(),
];
