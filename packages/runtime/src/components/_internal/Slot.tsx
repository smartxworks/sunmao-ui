import React from 'react';
import { ImplWrapperProps } from '../../types/RuntimeSchema';
import { ImplWrapper } from './ImplWrapper';

export type SlotType<K extends string> = React.FC<{
  slot: K;
}>;

export function genSlots<K extends string>(
  props: Omit<ImplWrapperProps, 'targetSlot' | 'Slot'>
): SlotType<K> {
  return ({ slot }: { slot: string }) => {
    const childrenSchema = props.treeMap[props.component.id]?.[slot];
    if (!childrenSchema || childrenSchema.length === 0) {
      return null;
    }
    return (
      <>
        {childrenSchema.map(c => {
          return (
            <ImplWrapper
              Slot={() => null}
              targetSlot={null}
              key={c.id}
              {...props}
              component={c}
            />
          );
        })}
      </>
    );
  };
}

export function genSlotsAsArray<K extends string>(
  props: Omit<ImplWrapperProps, 'targetSlot' | 'Slot'>,
  slot: K
): React.FC[] {
  const childrenSchema = props.treeMap[props.component.id]?.[slot];
  if (!childrenSchema || childrenSchema.length === 0) {
    return [];
  }
  return childrenSchema.map(c => {
    return () => (
      <ImplWrapper
        Slot={() => null}
        targetSlot={null}
        key={c.id}
        {...props}
        component={c}
      />
    );
  });
}
