import React from 'react';
import { SlotsMap } from '../../types/RuntimeSchema';

export function getSlots<T, K extends string>(
  slotsMap: SlotsMap<K> | undefined,
  slot: K,
  rest: T
) {
  return (slotsMap?.get(slot) || []).map(({ component: ImplWrapper, id }) => (
    <ImplWrapper key={id} {...rest} />
  ));
}

export type SlotType<K extends string> = React.FC<{
  slotsMap: SlotsMap<K> | undefined;
  slot: K;
}>;

function Slot<K extends string>({
  slotsMap,
  slot,
  ...rest
}: {
  slotsMap: SlotsMap<K> | undefined;
  slot: K;
}): ReturnType<React.FC> {
  if (!slotsMap?.has(slot)) {
    return null;
  }
  return <>{getSlots(slotsMap, slot, rest)}</>;
}

export default Slot;
