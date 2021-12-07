import React from 'react';
import { SlotsMap } from 'types/RuntimeSchema';

export function getSlots(slotsMap: SlotsMap | undefined, slot: string): React.ReactElement[] {
  const components = slotsMap?.get(slot);
  if (!components) {
    const placeholder = <div style={{color: 'gray'}}>Slot {slot} is empty.Please drag component to this slot.</div>;
    return [placeholder]
  }
  return components.map(({ component: ImplWrapper, id }) => (
    <ImplWrapper key={id} />
  ));
}

const Slot: React.FC<{ slotsMap: SlotsMap | undefined; slot: string }> = ({
  slotsMap,
  slot,
}) => {
  return <>{getSlots(slotsMap, slot)}</>;
};

export default Slot;
