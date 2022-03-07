import React, { useMemo, useRef, useState } from 'react';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { Box } from '@chakra-ui/react';
import { EditorMask } from './EditorMask';
import { throttle } from 'lodash-es';
import { ExplorerMenuTabs } from '../../services/enum';
import { genOperation } from '../../operations';

type Props = {
  services: EditorServices;
};

export const EditorMaskWrapper: React.FC<Props> = observer(props => {
  const { children, services } = props;
  const { editorStore, eventBus, registry } = services;
  const { setSelectedComponentId, setExplorerMenuTab } = editorStore;
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  const [scrollOffset, setScrollOffset] = useState<[number, number]>([0, 0]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dragOverSlotRef = useRef<string>('');
  const hoverComponentIdRef = useRef<string>('');

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition([e.clientX, e.clientY]);
  };
  const onMouseLeave = () => {
    setMousePosition([-Infinity, -Infinity]);
  };
  const onScroll = () => {
    if (wrapperRef.current) {
      setScrollOffset([wrapperRef.current.scrollLeft, wrapperRef.current.scrollTop]);
    }
  };

  const onClick = () => {
    setSelectedComponentId(hoverComponentIdRef.current);
  };

  const throttleSetMousePosition = useMemo(() => {
    return throttle((position: [number, number]) => {
      setMousePosition(position);
    }, 50);
  }, [setMousePosition]);

  const onDragOver = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    throttleSetMousePosition([e.clientX, e.clientY]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExplorerMenuTab(ExplorerMenuTabs.UI_TREE);
    const creatingComponent = e.dataTransfer?.getData('component') || '';
    eventBus.send(
      'operation',
      genOperation(registry, 'createComponent', {
        componentType: creatingComponent,
        parentId: hoverComponentIdRef.current,
        slot: dragOverSlotRef.current,
      })
    );
  };

  const mousePositionWithOffset: [number, number] = [
    mousePosition[0] + scrollOffset[0],
    mousePosition[1] + scrollOffset[1],
  ];

  return (
    <Box
      id="editor-mask-wrapper"
      width="full"
      height="0"
      flex="1"
      overflow="auto"
      position="relative"
      // some components stop click event propagation, so here we should capture onClick
      onClickCapture={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onScroll={onScroll}
      ref={wrapperRef}
    >
      {children}
      <EditorMask
        services={services}
        mousePosition={mousePositionWithOffset}
        hoverComponentIdRef={hoverComponentIdRef}
        dragOverSlotRef={dragOverSlotRef}
        wrapperRef={wrapperRef}
      />
    </Box>
  );
});
