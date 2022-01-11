import React, { useMemo, useState } from 'react';
import { css, cx } from '@emotion/css';
import { ComponentWrapperType } from '@sunmao-ui/runtime';
import { observer } from 'mobx-react-lite';
import { editorStore } from '../EditorStore';
import { registry } from '../setup';
import { eventBus } from '../eventBus';
import { genOperation } from '../operations';
import { Text } from '@chakra-ui/react';

type ComponentEditorState = 'drag' | 'select' | 'hover' | 'idle';

/**
 * to get a html element's sunmao wrapper, if it is a slot will also return slot id.
 * @param e the element need to find wrapper
 * @returns
 */
const findRelatedWrapper = (e: HTMLElement) => {
  let node: HTMLElement | null = e;
  let slot: string | undefined = undefined;
  while (node && node.tagName !== 'BODY') {
    if ('slot' in node.dataset) {
      slot = node.dataset['slot'];
    }
    if ('component' in node.dataset) {
      return {
        id: node.dataset['component']!,
        droppable: node.dataset['droppable'] === 'true',
        slot,
      };
    }
    node = node.parentElement;
  }
  return undefined;
};

// children of components in this list should render height as 100%
const fullHeightList = ['core/v1/grid_layout'];
const inlineList = ['chakra_ui/v1/checkbox', 'chakra_ui/v1/radio'];
// FIXME: add vertical property for component
const verticalStackList = ['chakra_ui/v1/vstack'];

const ComponentWrapperStyle = css`
  display: block;
  position: relative;
  &.inline {
    display: inline-block;
  }
  &.full-height {
    height: 100%;
  }

  .slots-wrapper {
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
  }
`;

const outlineMaskTextStyle = css`
  position: absolute;
  top: -4px;
  right: 0;
  transform: translateY(-100%);
  padding: 0 4px;
  font-size: 14px;
  font-weight: black;
  color: white;
  &.hover {
    background-color: black;
  }
  &.select {
    background-color: red;
  }
  &.idle,
  &.drag {
    display: none;
  }
`;

const outlineMaskStyle = css`
  position: absolute;
  border: 1px solid;
  pointer-events: none;
  /* create a bfc */
  transform: translate3d(0, 0, 0);
  z-index: 10;
  top: -4px;
  bottom: -4px;
  left: -4px;
  right: -4px;
  &.idle {
    display: none;
  }
  &.hover {
    border-color: black;
  }

  &.select {
    border-color: red;
  }

  &.drag {
    border-color: orange;
  }
`;

export const ComponentWrapper: ComponentWrapperType = observer(props => {
  const { component, parentType } = props;
  const {
    selectedComponentId,
    setSelectedComponentId,
    hoverComponentId,
    setHoverComponentId,
    dragOverComponentId,
    setDragOverComponentId,
  } = editorStore;

  const [slots, isDroppable] = useMemo(() => {
    const slots = registry.getComponentByType(component.type).spec.slots;
    return [slots, slots.length > 0];
  }, [component.type]);

  const [currentSlot, setCurrentSlot] = useState<string>();

  const componentEditorState: ComponentEditorState = useMemo(() => {
    if (dragOverComponentId === component.id) {
      return 'drag';
    } else if (selectedComponentId === component.id) {
      return 'select';
    } else if (hoverComponentId === component.id) {
      return 'hover';
    } else {
      return 'idle';
    }
  }, [dragOverComponentId, selectedComponentId, hoverComponentId, component.id]);

  const [inline, fullHeight, vertical] = useMemo(() => {
    return [
      inlineList.includes(component.type),
      fullHeightList.includes(parentType),
      verticalStackList.includes(component.type),
    ];
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

  const onDragEnter = (e: React.DragEvent<HTMLElement>) => {
    if (!isDroppable) {
      return;
    }
    e.stopPropagation();
    const enter = findRelatedWrapper(e.target as HTMLElement);
    if (!enter) {
      // if enter a non-wrapper element (seems won't happen)
      setDragOverComponentId(dragOverComponentId);
      setCurrentSlot(undefined);
      return;
    }
    if (!enter.droppable) {
      // if not droppable element
      setDragOverComponentId('');
      setCurrentSlot(undefined);
      return;
    }
    // update dragover component id
    if (dragOverComponentId !== enter.id) {
      setDragOverComponentId(enter.id);
      setCurrentSlot(enter.slot);
    } else if (currentSlot !== enter.slot && enter.slot) {
      setCurrentSlot(enter.slot);
    }
  };

  const onDragLeave = (e: React.DragEvent<HTMLElement>) => {
    // not processing leave event when no element is marked as dragover
    if (!isDroppable || !dragOverComponentId) {
      return;
    }
    e.stopPropagation();
    const enter = findRelatedWrapper(e.relatedTarget as HTMLElement);
    if (!enter) {
      // if entered element is not a sunmao wrapper, set dragId to ''
      setDragOverComponentId('');
      setCurrentSlot(undefined);
    } else if ((!enter.slot && !enter.droppable) || enter.id !== component.id) {
      setCurrentSlot(undefined);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isDroppable) return;
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    if (!isDroppable) return;
    e.stopPropagation();
    e.preventDefault();
    setDragOverComponentId('');
    setCurrentSlot(undefined);
    const creatingComponent = e.dataTransfer?.getData('component') || '';
    eventBus.send(
      'operation',
      genOperation('createComponent', {
        componentType: creatingComponent,
        parentId: component.id,
        slot: currentSlot,
      })
    );
  };

  return (
    <div
      data-component={component.id}
      data-droppable={isDroppable}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClickWrapper}
      onMouseEnter={onMouseEnterWrapper}
      onMouseLeave={onMouseLeaveWrapper}
      onDragOver={onDragOver}
      className={cx(
        ComponentWrapperStyle,
        inline ? 'inline' : undefined,
        fullHeight ? 'full-height' : undefined
      )}
    >
      <Text className={cx(outlineMaskTextStyle, componentEditorState)}>
        {component.id}
      </Text>
      {props.children}
      {isDroppable && componentEditorState === 'drag' ? (
        <div className={cx('slots-wrapper', vertical ? 'vertical' : undefined)}>
          {slots.map(slot => {
            return (
              <SlotWrapper
                componentId={component.id}
                state={slot === currentSlot ? 'over' : 'sibling'}
                key={slot}
                slotId={slot}
              ></SlotWrapper>
            );
          })}
        </div>
      ) : (
        <div className={cx(outlineMaskStyle, 'component', componentEditorState)}></div>
      )}
    </div>
  );
});

const SlotWrapperTyle = css`
  flex-grow: 1;
  position: relative;
  pointer-events: auto;

  .outline {
    top: 4px;
    bottom: 4px;
    left: 4px;
    right: 4px;
    position: absolute;
    pointer-events: none;
    /* create a bfc */
    transform: translate3d(0, 0, 0);
    z-index: 10;
    opacity: 0.5;
  }

  .text {
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 13;
  }

  &.sibling {
    .outline {
      background-color: grey;
      z-index: 11;
    }
    .text {
      display: none;
    }
  }

  &.over {
    pointer-events: none;
    .outline {
      background-color: orange;
      box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.6);
      transform: scale(1.1);
      z-index: 12;
    }
    .text {
    }
  }
`;

const SlotWrapper: React.FC<{
  componentId: string;
  slotId: string;
  state: 'sibling' | 'over';
}> = ({ componentId, slotId, state }) => {
  return (
    <div
      onDragLeave={e => {
        const leave = findRelatedWrapper(e.target as HTMLElement);
        if (leave) {
          e.stopPropagation();
        }
      }}
      data-slot={slotId}
      className={cx(state, SlotWrapperTyle)}
    >
      <Text className={cx('text')}>
        {componentId}-{slotId}
      </Text>
      <div className={cx('outline')}></div>
    </div>
  );
};
