import {
  ComponentValidatorRule,
  ComponentValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { isExpression } from '../utils';

class ComponentPropertyValidatorRule implements ComponentValidatorRule {
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
    const properties = component.rawProperties
    const valid = validate(properties);
    if (!valid) {
      validate.errors!.forEach(error => {
        if (error.keyword === 'type') {
          const { instancePath } = error;
          const path = instancePath.split('/')[1];
          const value = properties[path];
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

class ModuleValidatorRule implements ComponentValidatorRule {
  kind: 'component' = 'component';

  validate({ component, registry }: ComponentValidateContext): ValidateErrorResult[] {
    if (component.type !== 'core/v1/moduleContainer') {
      return [];
    }

    const results: ValidateErrorResult[] = [];
    let moduleSpec
    try {
      moduleSpec = registry.getModuleByType(component.rawProperties.type.value as string);
    } catch (err) {
      moduleSpec = undefined
    }
    if (!moduleSpec) {
      results.push({
        message: `Module is not registered: ${component.rawProperties.type}.`,
        componentId: component.id,
        property: '/type',
      });
    }
    return results;
  }
}
export const ComponentRules = [
  new ComponentPropertyValidatorRule(),
  new ModuleValidatorRule(),
];
