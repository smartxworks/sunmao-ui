/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { SlotDropArea } from './SlotDropArea';

// FIXME: add vertical property for component
const verticalStackList = ['chakra_ui/v1/vstack'];

const DropSlotMaskStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;

  &.vertical {
    flex-direction: column;
  }
`;

type Props = {
  services: EditorServices;
  hoverId: string;
  mousePosition: [number, number];
  onDragOverSlotChange: (slot: string) => void;
};

export const DropSlotMask: React.FC<Props> = observer((props: Props) => {
  const { services, hoverId, mousePosition, onDragOverSlotChange } = props;
  const { registry } = services;
  const [dragOverSlot, setDragOverSlot] = useState('');
  const maskRef = useRef<HTMLDivElement>(null);

  const componentType =
    services.editorStore.components.find(c => c.id === hoverId)?.type || 'core/v1/text';

  const slots = useMemo(() => {
    return registry.getComponentByType(componentType).spec.slots || [];
  }, [componentType, registry]);

  useEffect(() => {
    if (!maskRef.current) return;
    const maskRect = maskRef.current?.getBoundingClientRect();
    console.log('mouse', mousePosition[0], maskRect.left, slots.length);
    const index = Math.floor(
      (mousePosition[0] - maskRect.left) / (maskRect.width / slots.length)
    );
    console.log('index', index);
    setDragOverSlot(slots[index]);
    onDragOverSlotChange(slots[index]);
  }, [mousePosition, slots, onDragOverSlotChange]);

  const isDroppable = slots.length > 0;

  const vertical = useMemo(() => {
    if (!componentType) return false;
    verticalStackList.includes(componentType);
  }, [componentType]);

  if (!isDroppable) {
    return null;
  }

  return (
    <div
      className={cx(DropSlotMaskStyle, vertical ? 'vertical' : undefined)}
      ref={maskRef}
    >
      {slots.map(slot => {
        return (
          <SlotDropArea
            componentId={hoverId}
            isOver={dragOverSlot === slot}
            key={slot}
            slotId={slot}
          />
        );
      })}
    </div>
  );
});
