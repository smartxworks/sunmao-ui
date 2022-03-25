import { ComponentSchema } from '@sunmao-ui/core';

export function isFetchTraitComponent(component: ComponentSchema): boolean {
  return component.type === 'core/v1/dummy' && component.traits.filter(trait=> trait.type === 'core/v1/fetch').length > 0;
}
