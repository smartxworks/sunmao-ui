import React from 'react';
import { SlotsMap } from '../../types/RuntimeSchema';

export type SlotType<K extends string> = React.FC<{
  slot: K;
}>;

export function getSlots<T, K extends string>(
  slotsMap: SlotsMap<K> | undefined,
  slot: K,
  rest: T
): React.ReactElement[] {
  const components = slotsMap?.get(slot);
  if (!components) {
    const placeholder = (
      <div key="slot-placeholder" style={{ color: 'gray' }}>
        Slot {slot} is empty.Please drag component to this slot.
      </div>
    );
    return [placeholder];
  }
  return components.map(({ component: ImplWrapper, id }) => (
    <ImplWrapper key={id} {...rest} />
  ));
}

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

export function getSlotWithMap<K extends string>(
  slotsMap: SlotsMap<K> | undefined
): SlotType<K> {
  return props => <Slot slotsMap={slotsMap} {...props} />;
}

export default Slot;
