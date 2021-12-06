import React, { useMemo } from 'react';
import { css } from '@emotion/react';
import { ComponentWrapperType } from '@sunmao-ui/runtime';
import { observer } from 'mobx-react-lite';
import { editorStore } from 'EditorStore';
import { registry } from 'setup';
import { eventBus } from '../eventBus';
import { genOperation } from '../operations';

// children of components in this list should render height as 100%
const fullHeightList = ['core/v1/grid_layout'];
const inlineList = ['chakra_ui/v1/checkbox', 'chakra_ui/v1/radio'];

export const ComponentWrapper: ComponentWrapperType = observer(props => {
  const { component, parentType } = props;
  const {
    selectedComponentId,
    setSelectedComponentId,
    hoverComponentId,
    setHoverComponentId,
    dragOverComponentId,
    pushDragIdStack,
    popDragIdStack,
  } = editorStore;

  const slots = useMemo(() => {
    return registry.getComponentByType(component.type).spec.slots;
  }, [component.type]);

  const isDroppable = slots.length > 0;

  const borderColor = useMemo(() => {
    if (dragOverComponentId === component.id) {
      return 'orange';
    } else if (selectedComponentId === component.id) {
      return 'red';
    } else if (hoverComponentId === component.id) {
      return 'black';
    } else {
      return 'transparent';
    }
  }, [dragOverComponentId, selectedComponentId, hoverComponentId, component.id]);

  const style = useMemo(() => {
    return css`
      display: ${inlineList.includes(component.type) ? 'inline-block' : 'block'};
      height: ${fullHeightList.includes(parentType) ? '100%' : 'auto'};
      position: relative;
    `;
  }, [component.type, parentType]);

  const onClickWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setSelectedComponentId(component.id);
  };
  const onMouseEnterWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setHoverComponentId(component.id);
  };
  const onMouseLeaveWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setHoverComponentId('');
  };

  const onDragEnter = () => {
    if (isDroppable) {
      pushDragIdStack(component.id);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isDroppable) return;
    popDragIdStack();
    const creatingComponent = e.dataTransfer?.getData('component') || '';
    eventBus.send(
      'operation',
      genOperation('createComponent', {
        componentType: creatingComponent,
        parentId: component.id,
        slot: slots[0],
      })
    );
  };

  const onDragLeave = () => {
    if (isDroppable) {
      popDragIdStack();
    }
  };

  return (
    <div
      // onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClickWrapper}
      onMouseEnter={onMouseEnterWrapper}
      onMouseLeave={onMouseLeaveWrapper}
      css={style}
    >
      {props.children}
      <OutlineMask color={borderColor} />
    </div>
  );
});

function OutlineMask({ color }: { color: string }) {
  const style = useMemo(() => {
    return css`
      position: absolute;
      top: -4px;
      bottom: -4px;
      left: -4px;
      right: -4px;
      border: 1px solid ${color};
      pointer-events: none;
    `;
  }, [color]);
  return <div css={style} />;
}
