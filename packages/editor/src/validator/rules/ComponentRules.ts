import {
  ComponentValidatorRule,
  ComponentValidateContext,
  ValidateErrorResult,
} from '../interfaces';

class ComponentPropertyValidatorRule implements ComponentValidatorRule {
  kind: 'component' = 'component';

  validate({
    component,
    validators,
    componentIdSpecMap,
  }: ComponentValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const validate = validators.components[component.type];
    if (!validate) {
      results.push({
        message: `Component is not registered: ${component.type}.`,
        componentId: component.id,
      });
      return results;
    }
    const properties = component.rawProperties;

    const valid = validate(properties);
    if (!valid) {
      validate.errors!.forEach(error => {
        const { instancePath, params } = error;
        let key = ''
        if (instancePath) {
          key = instancePath.split('/')[1];
        } else {
          key = params.missingProperty
        }
        const fieldModel = component.properties[key];
        // fieldModel could be undefiend. if is undefined, still throw error.
        if (fieldModel?.isDynamic !== true) {
          results.push({
            message: error.message || '',
            componentId: component.id,
            property: error.instancePath,
          });
        }
      });
    }

    for (const key in component.properties) {
      const fieldModel = component.properties[key];
      fieldModel.refs.forEach((id: string) => {
        if (!componentIdSpecMap[id]) {
          results.push({
            message: `Cannot find '${id}' in store.`,
            componentId: component.id,
            property: key,
          });
        }
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
    let moduleSpec;
    try {
      moduleSpec = registry.getModuleByType(component.rawProperties.type.value as string);
    } catch (err) {
      moduleSpec = undefined;
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
