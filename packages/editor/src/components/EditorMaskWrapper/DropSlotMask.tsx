import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { observer } from 'mobx-react-lite';
import { SlotDropArea } from './SlotDropArea';
import { EditorServices } from '../../types';

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
  dragOverSlotRef: React.MutableRefObject<string>;
};

export const DropSlotMask: React.FC<Props> = observer((props: Props) => {
  const { services, hoverId, mousePosition, dragOverSlotRef } = props;
  const { registry, editorStore } = services;
  const [dragOverSlot, setDragOverSlot] = useState('');
  const maskRef = useRef<HTMLDivElement>(null);

  const hoverComponentType =
    editorStore.components.find(c => c.id === hoverId)?.type || 'core/v1/text';

  const slots = useMemo(() => {
    return registry.getComponentByType(hoverComponentType).spec.slots || [];
  }, [hoverComponentType, registry]);

  // caculate the slot which is being dragged over
  useEffect(() => {
    if (!maskRef.current) return;
    const maskRect = maskRef.current?.getBoundingClientRect();
    const index = Math.floor(
      (mousePosition[0] - maskRect.left) / (maskRect.width / slots.length)
    );
    setDragOverSlot(slots[index]);
    dragOverSlotRef.current = slots[index];
  }, [dragOverSlotRef, mousePosition, slots]);

  const vertical = useMemo(() => {
    if (!hoverComponentType) return false;
    verticalStackList.includes(hoverComponentType);
  }, [hoverComponentType]);

  const isDroppable = slots.length > 0;

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
            key={slot}
            componentId={hoverId}
            isOver={dragOverSlot === slot}
            slotId={slot}
          />
        );
      })}
    </div>
  );
});
