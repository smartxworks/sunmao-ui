import { Static } from '@sinclair/typebox';
import {
  TraitValidatorRule,
  TraitValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { GLOBAL_UTIL_METHOD_ID } from '@sunmao-ui/runtime';
import { isExpression } from '../utils';
import { ComponentId, EventName } from '../../AppModel/IAppModel';
import {
  CORE_VERSION,
  CoreTraitName,
  EventHandlerSpec,
  MountEvents,
  MountEvent,
} from '@sunmao-ui/shared';
import { get } from 'lodash';
import { ErrorObject } from 'ajv';

class EventHandlerValidatorRule implements TraitValidatorRule {
  kind: 'trait' = 'trait';
  traitMethods = ['setValue', 'resetValue', 'triggerFetch'];

  private isErrorAnExpression(
    error: ErrorObject,
    parameters: Record<string, any> | undefined
  ) {
    let path = '';
    const { instancePath, params } = error;
    if (instancePath) {
      path = instancePath.split('/').slice(1).join('.');
    } else {
      path = params.missingProperty;
    }
    const field = get(parameters, path);
    return isExpression(field);
  }

  validate({
    appModel,
    trait,
    component,
    ajv,
    validators,
    traitIndex,
  }: TraitValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    if (trait.type !== `${CORE_VERSION}/${CoreTraitName.Event}`) {
      return results;
    }
    const handlers = trait.rawProperties.handlers as Static<typeof EventHandlerSpec>[];
    handlers.forEach((handler, i) => {
      const {
        type: eventName,
        componentId: targetId,
        method: { name: methodName, parameters },
      } = handler;

      if (!eventName) {
        results.push({
          message: `Event is empty.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/type`,
        });
      }

      if (
        eventName &&
        !component.events.includes(eventName as EventName) &&
        !MountEvents.includes(eventName as MountEvent)
      ) {
        results.push({
          message: `Component does not have event: ${eventName}.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/type`,
        });
      }

      if (!targetId) {
        results.push({
          message: `Target component Id is empty.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/componentId`,
        });
        return results;
      }

      if (!methodName) {
        results.push({
          message: `Method is empty.`,
          componentId: component.id,
          traitType: trait.type,
          property: `/handlers/${i}/method/name`,
        });
        return results;
      }

      if (targetId === GLOBAL_UTIL_METHOD_ID) {
        // case 1 : validate UtilMethod
        const validate = validators.utilMethods[methodName];
        // check whether util method exists
        if (!validate) {
          results.push({
            message: `$utils does not have method: ${methodName}.`,
            componentId: component.id,
            traitType: trait.type,
            property: `/handlers/${i}/method/name`,
          });
        }
        // check whether util method properties type
        const valid = validate(parameters);
        if (!valid) {
          validate.errors!.forEach(error => {
            if (!this.isErrorAnExpression(error, parameters)) {
              results.push({
                message: error.message || '',
                componentId: component.id,
                property: error.instancePath,
                traitType: trait?.type,
                traitIndex,
              });
              return results;
            }
          });
        }
      } else {
        // case 2 : validate component method
        const targetComponent = appModel.getComponentById(targetId as ComponentId);

        // check whether component exists
        if (!targetComponent) {
          results.push({
            message: `Event target component does not exist: ${targetId}.`,
            componentId: component.id,
            traitType: trait.type,
            property: `/handlers/${i}/componentId`,
          });
          return results;
        }

        // check whether component method exists
        const method = targetComponent.methods.find(m => m.name === methodName);
        if (!method) {
          results.push({
            message: `Event target component does not have method: ${methodName}.`,
            componentId: component.id,
            traitType: trait.type,
            property: `/handlers/${i}/method/name`,
          });
          return results;
        }
        // check component method properties type
        if (method.parameters && !ajv.validate(method.parameters, parameters)) {
          ajv.errors!.forEach(error => {
            if (!this.isErrorAnExpression(error, parameters)) {
              results.push({
                message: error.message || '',
                componentId: component.id,
                traitType: trait.type,
                property: `/handlers/${i}/method/parameters${error.instancePath}`,
              });
            }
          });
        }
      }
    });

    return results;
  }
}

export const TraitRules = [new EventHandlerValidatorRule()];
