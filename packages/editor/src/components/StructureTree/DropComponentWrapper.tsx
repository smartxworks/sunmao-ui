import { Box } from '@chakra-ui/react';
import React, { useMemo, useRef, useState } from 'react';
import { genOperation } from '../../operations';
import { EditorServices } from '../../types';

type Props = {
  componentId: string | undefined;
  parentId: string | undefined;
  parentSlot: string | undefined;
  isExpanded: boolean;
  // only can be drop in and cannot drop before or after
  isDropInOnly?: boolean;
  services: EditorServices;
};

export const DropComponentWrapper: React.FC<Props> = props => {
  const { componentId, parentId, parentSlot, services, isDropInOnly, isExpanded } = props;
  const { registry, eventBus } = services;
  const ref = useRef<HTMLDivElement>(null);
  const [dragDirection, setDragDirection] = useState<'prev' | 'next' | undefined>();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const onDragOver = (e: React.DragEvent) => {
    setIsDragOver(true);
    e.preventDefault();
    e.stopPropagation();

    if (isDropInOnly) return;

    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    if (e.clientY < rect.top + rect.height / 2) {
      setDragDirection('prev');
    } else if (e.clientY >= rect.top + rect.height / 2) {
      setDragDirection('next');
    }
  };

  const onDragLeave = () => {
    setDragDirection(undefined);
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const creatingComponent = e.dataTransfer?.getData('component') || '';
    const movingComponent = e.dataTransfer?.getData('moveComponent') || '';

    let targetParentId = parentId;
    let targetParentSlot = parentSlot;
    let targetId = componentId;
    if (dragDirection === 'next' && isExpanded) {
      targetParentId = componentId;
      targetParentSlot = 'content';
      // should be the first of children
      targetId = undefined;
    }

    // move component before or after currentComponent
    if (movingComponent) {
      eventBus.send(
        'operation',
        genOperation(registry, 'moveComponent', {
          fromId: movingComponent,
          toId: targetParentId,
          slot: targetParentSlot,
          targetId: targetId,
          direction: dragDirection,
        })
      );
    }

    // create component as children
    if (creatingComponent) {
      eventBus.send(
        'operation',
        genOperation(registry, 'createComponent', {
          componentType: creatingComponent,
          parentId: targetParentId,
          slot: targetParentSlot,
          targetId: targetId,
          direction: dragDirection,
        })
      );
    }
    setDragDirection(undefined);
    setIsDragOver(false);
  };

  const boxShadow = useMemo(() => {
    if (isDropInOnly) return '';
    switch (dragDirection) {
      case 'prev':
        return '0 -1px 0 0 red';
      case 'next':
        return '0 1px 0 0 red';
    }
  }, [dragDirection, isDropInOnly]);

  return (
    <Box
      ref={ref}
      width="full"
      boxShadow={boxShadow}
      background={isDropInOnly && isDragOver ? 'pink' : undefined}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {props.children}
    </Box>
  );
};
