import React from 'react';
import { SlotsMap } from '../../App';

export function getSlots(slotsMap: SlotsMap | undefined, slot: string) {
  return (slotsMap?.get(slot) || []).map(({ component: ImplWrapper, id }) => (
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
