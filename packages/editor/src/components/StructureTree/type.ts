import { ComponentSchema } from '@sunmao-ui/core';

// These fields can be computed from the schema
export type ComponentNode = {
  id: string;
  component: ComponentSchema;
  parentId: string | null;
  slot: string | null;
  depth: number;
  notEmptySlots: string[];
  parentSlots?: string[];
};

// These fields need computed with UI State
export type ComponentNodeWithState = ComponentNode & {
  droppable: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  shouldShowSelfSlotName: boolean;
};
