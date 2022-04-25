import {
  AllComponentsValidatorRule,
  AllComponentsValidateContext,
  ValidateErrorResult,
} from '../interfaces';
import { CORE_VERSION, SLOT_TRAIT_NAME } from '@sunmao-ui/shared';

class ParentValidatorRule implements AllComponentsValidatorRule {
  kind: 'allComponents' = 'allComponents';

  validate({
    appModel,
  }: AllComponentsValidateContext): ValidateErrorResult[] {
    const results: ValidateErrorResult[] = [];
    const allComponents = appModel.allComponents;
    const allComponentsFromSchema = appModel.allComponentsWithOrphan;
    if (allComponents.length === allComponentsFromSchema.length) {
      return results;
    }

    const orphanComponents = allComponentsFromSchema.filter(c => !allComponents.find(c2 => c2.id === c.id));
  
    orphanComponents.forEach(c => {
      const parent = appModel.getComponentById(c.parentId!);
      if (!parent) {
        results.push({
          message: `Cannot find parent component: ${c.parentId}.`,
          componentId: c.id,
          traitType: `${CORE_VERSION}/${SLOT_TRAIT_NAME}`,
          property: '/container/id',
        });
      }

      if (parent && !parent.slots.includes(c.parentSlot!)) {
        results.push({
          message: `Parent component '${parent.id}' does not have slot: ${c.parentSlot}.`,
          componentId: c.id,
          traitType: `${CORE_VERSION}/${SLOT_TRAIT_NAME}`,
          property: '/container/slot',
        });
      }
    });
    return results;
  }
}

export const AllComponentsRules = [new ParentValidatorRule()];
