import { ComponentSchema, parseType, RuntimeTraitSchema } from '@sunmao-ui/core';
import { CoreTraitName, CoreComponentName, CORE_VERSION } from '../constants';

export function isEventTrait(trait: RuntimeTraitSchema) {
  return (
    trait.parsedType.version === CORE_VERSION &&
    trait.parsedType.name === CoreTraitName.Event
  );
}

export function isModuleContainer(c: ComponentSchema) {
  const parsedType = parseType(c.type);
  return (
    parsedType.version === CORE_VERSION &&
    parsedType.name === CoreComponentName.ModuleContainer
  );
}
