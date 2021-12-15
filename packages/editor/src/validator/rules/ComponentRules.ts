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
export const ComponentRules = [new ComponentPropertyValidatorRule()];
