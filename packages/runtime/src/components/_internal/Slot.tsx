import React from 'react';
import { SlotsMap } from '../../types/RuntimeSchema';

export function getSlots<T>(slotsMap: SlotsMap | undefined, slot: string, rest: T) {
  return (slotsMap?.get(slot) || []).map(({ component: ImplWrapper, id }) => (
    <ImplWrapper key={id} {...rest} />
  ));
}

const Slot: React.FC<{ slotsMap: SlotsMap | undefined; slot: string }> = ({
  slotsMap,
  slot,
  ...rest
}) => {
  if (!slotsMap?.has(slot)) {
    return null;
  }
  return <>{getSlots(slotsMap, slot, rest)}</>;
};

export default Slot;
