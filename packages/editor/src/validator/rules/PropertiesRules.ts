import { get, has } from 'lodash';
import { ComponentId, ModuleId } from '../../AppModel/IAppModel';
import {
  PropertiesValidatorRule,
  PropertiesValidateContext,
  ValidateErrorResult,
} from '../interfaces';

class PropertySchemaValidatorRule implements PropertiesValidatorRule {
  kind: 'properties' = 'properties';

  validate({
    properties,
    component,
    trait,
    validators,
  }: PropertiesValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    let validate;

    if (trait) {
      validate = validators.traits[trait.type];
    } else {
      validate = validators.components[component.type];
    }

    if (!validate) return results;

    const valid = validate(properties.rawValue);
    if (valid) return results;
    validate.errors!.forEach(error => {
      // todo: detect deep error
      const { instancePath, params } = error;
      let key = '';
      if (instancePath) {
        key = instancePath.split('/')[1];
      } else {
        key = params.missingProperty;
      }
      const fieldModel = properties.getProperty(key);
      // if field is expression, ignore type error
      // fieldModel could be undefiend. if is undefined, still throw error.
      if (get(fieldModel, 'isDynamic') !== true) {
        results.push({
          message: error.message || '',
          componentId: component.id,
          property: error.instancePath,
          traitType: trait?.type,
        });
      }
    });

    return results;
  }
}

class ExpressionValidatorRule implements PropertiesValidatorRule {
  kind: 'properties' = 'properties';

  validate({
    properties,
    component,
    trait,
    appModel,
  }: PropertiesValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];

    // validate expression
    properties.traverse((fieldModel, key) => {
      Object.keys(fieldModel.refComponentInfos).forEach((id: string) => {
        const targetComponent = appModel.getComponentById(id as ComponentId);
        const paths = fieldModel.refComponentInfos[id as ComponentId].refProperties;

        if (targetComponent) {
          // case 1: id is a component
          for (const path of paths) {
            if (!has(targetComponent.stateExample, path)) {
              results.push({
                message: `Component '${id}' does not have property '${path}'.`,
                componentId: component.id,
                property: key,
                traitType: trait?.type,
              });
              break;
            }
          }
        } else if (id in window) {
          // case 2: id is a global variable
          for (const path of paths) {
            if (!has(window[id as keyof Window], path)) {
              results.push({
                message: `Window object '${id}' does not have property '${path}'.`,
                componentId: component.id,
                property: key,
                traitType: trait?.type,
              });
              break;
            }
          }
        } else if (appModel.moduleIds.includes(id as ModuleId)) {
          // case 3: id is a module
          // TODO: check module stateMap
        } else {
          // case 4: id doesn't exist
          results.push({
            message: `Cannot find '${id}' in store or window.`,
            componentId: component.id,
            property: key,
            traitType: trait?.type,
          });
        }
      });
    });

    return results;
  }
}

export const PropertiesRules = [
  new PropertySchemaValidatorRule(),
  new ExpressionValidatorRule(),
];
