import React from 'react';
import { SlotsMap } from '../../types/RuntimeSchema';

export function getSlots<T>(slotsMap: SlotsMap | undefined, slot: string, rest: T): React.ReactElement[] {
  const components = slotsMap?.get(slot);
  if (!components) {
    const placeholder = <div key='slot-placeholder' style={{color: 'gray'}}>Slot {slot} is empty.Please drag component to this slot.</div>;
    return [placeholder]
  }
  return components.map(({ component: ImplWrapper, id }) => (
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
