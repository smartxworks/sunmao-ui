import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { CoreTraitName, CORE_VERSION } from '../constants';

export function isEventTrait(trait: RuntimeTraitSchema) {
  return (
    trait.parsedType.version === CORE_VERSION &&
    trait.parsedType.name === CoreTraitName.Event
  );
}
