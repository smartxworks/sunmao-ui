import { cloneDeep, get, has, set } from 'lodash';
import { ExpressionKeywords, generateDefaultValueFromSpec } from '@sunmao-ui/shared';
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
    traitIndex,
    componentIdSpecMap,
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
      let path = '';
      if (instancePath) {
        path = instancePath.split('/').slice(1).join('.');
      } else {
        path = params.missingProperty;
      }
      const fieldModel = properties.getPropertyByPath(path);
      // if field is expression, ignore type error
      // fieldModel could be undefiend. if is undefined, still throw error.
      if (get(fieldModel, 'isDynamic') !== true) {
        results.push({
          message: error.message || '',
          componentId: component.id,
          property: error.instancePath,
          traitType: trait?.type,
          traitIndex,
          fix: () => {
            const defaultValue = generateDefaultValueFromSpec(
              componentIdSpecMap[component.id].spec.properties
            ) as Object;
            const path = instancePath.split('/').slice(1).join('.');

            const newProperties = cloneDeep(properties.rawValue);
            set(newProperties, path, get(defaultValue, path));
            return newProperties;
          },
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
    dependencyNames,
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
        } else if (dependencyNames.includes(id)) {
          // case 4: id is from dependency
          // do nothing
        } else if (ExpressionKeywords.includes(id)) {
          // case 5: id is from expression keywords
          // do nothing
        } else {
          // case 6: id doesn't exist
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
