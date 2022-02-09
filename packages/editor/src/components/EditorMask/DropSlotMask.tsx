/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from 'react';
import { css, cx } from '@emotion/css';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { SlotDropArea } from './SlotDropArea';

const inlineList = ['chakra_ui/v1/checkbox', 'chakra_ui/v1/radio'];
// FIXME: add vertical property for component
const verticalStackList = ['chakra_ui/v1/vstack'];

const DropSlotMaskStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  display: flex;

  &.vertical {
    flex-direction: column;
  }
`;

type Props = {
  services: EditorServices;
  componentType: string;
  hoverId: string;
};

export const DropSlotMask: React.FC<Props> = observer((props: Props) => {
  const { services, componentType, hoverId } = props;
  const { registry } = services;

  const slots = useMemo(() => {
    return registry.getComponentByType(componentType).spec.slots || [];
  }, [componentType, registry]);

  const isDroppable = slots.length > 0;

  const [inline, vertical] = useMemo(() => {
    if (!componentType) return [false, false];
    return [
      inlineList.includes(componentType),
      verticalStackList.includes(componentType),
    ];
  }, [componentType]);

  if (!isDroppable) {
    return null;
  }

  return (
    <div className={cx(DropSlotMaskStyle, vertical ? 'vertical' : undefined)}>
      {slots.map(slot => {
        return (
          <SlotDropArea
            componentId={hoverId}
            // state={slot === currentSlot ? 'over' : 'sibling'}
            key={slot}
            slotId={slot}
          />
        );
      })}
    </div>
  );
});
