import {
  AllComponentsValidatorRule,
  ComponentValidatorRule,
  TraitValidatorRule,
  AllComponentsValidateContext,
  ComponentValidateContext,
  TraitValidateContext,
  ValidateErrorResult,
} from './interfaces';

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

  validate({ components }: AllComponentsValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const componentIds = components.map(component => component.id);
    components.forEach(c => {
      const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
      if (slotTrait) {
        const { id: parentId } = slotTrait.properties.container as any;
        if (!componentIds.includes(parentId)) {
          results.push({
            message: `Cannot find parent component: ${parentId}.`,
            componentId: c.id,
            traitType: slotTrait.type,
            property: '/container/id',
            fix: () => {
              slotTrait.properties.container = {
                id: componentIds[0],
                slot: 'content',
              };
            },
          });
        }
      }
    });
    return results;
  }
}

export class ComponentPropertyValidatorRule implements ComponentValidatorRule {
  kind: 'component' = 'component';

  validate({
    component,
    registry,
    ajv,
  }: ComponentValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const spec = registry.getComponentByType(component.type);
    if (!spec) {
      results.push({
        message: `Cannot find component spec: ${component.type}.`,
        componentId: component.id,
      });
      return results;
    }

    const propertySchema = spec.spec.properties;
    const regExp = new RegExp('.*{{.*}}.*');

    const validate = ajv.compile(propertySchema);
    const valid = validate(component.properties);
    if (!valid) {
      validate.errors!.forEach(error => {
        if (error.keyword === 'type') {
          const { instancePath } = error;
          const path = instancePath.split('/')[1];
          const value = component.properties[path];
          // if value is an expression, skip it
          if (typeof value === 'string' && regExp.test(value)) {
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
    registry,
    ajv,
  }: TraitValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const spec = registry.getTraitByType(trait.type);
    if (!spec) {
      results.push({
        message: `Cannot find trait spec: ${trait.type}.`,
        componentId: component.id,
        traitType: trait.type,
      });
      return results;
    }

    const propertySchema = spec.spec.properties;
    const regExp = new RegExp('.*{{.*}}.*');

    const validate = ajv.compile(propertySchema);
    const valid = validate(trait.properties);
    if (!valid) {
      validate.errors!.forEach(error => {
        if (error.keyword === 'type') {
          const { instancePath } = error;
          const path = instancePath.split('/')[1];
          const value = trait.properties[path];

          // if value is an expression, skip it
          if (typeof value === 'string' && regExp.test(value)) {
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

export const rules = [
  new RepeatIdValidatorRule(),
  new ParentValidatorRule(),
  new ComponentPropertyValidatorRule(),
  new TraitPropertyValidatorRule(),
];
