import {
  AllComponentsValidatorRule,
  AllComponentsValidateContext,
  ValidateErrorResult,
} from '../interfaces';

class RepeatIdValidatorRule implements AllComponentsValidatorRule {
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

class ParentValidatorRule implements AllComponentsValidatorRule {
  kind: 'allComponents' = 'allComponents';

  validate({
    components,
    componentIdSpecMap,
  }: AllComponentsValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    components.forEach(c => {
      const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');
      if (slotTrait) {
        const { id: parentId, slot } = slotTrait.properties.container as any;
        const parent = components.find(c => c.id === parentId)!;
        if (!parent) {
          results.push({
            message: `Cannot find parent component: ${parentId}.`,
            componentId: c.id,
            traitType: slotTrait.type,
            property: '/container/id',
          });
        } else {
          const parentSpec = componentIdSpecMap[parent.id];
          if (!parentSpec) {
            results.push({
              message: `Component is not registered: ${parent.type}.`,
              componentId: parent.id,
            });
          } else if (!parentSpec.spec.slots.includes(slot)) {
            results.push({
              message: `Parent component '${parent.id}' does not have slot: ${slot}.`,
              componentId: c.id,
              traitType: slotTrait.type,
              property: '/container/slot',
            });
          }
        }
      }
    });
    return results;
  }
}

export const AllComponentsRules = [new RepeatIdValidatorRule(), new ParentValidatorRule()];
