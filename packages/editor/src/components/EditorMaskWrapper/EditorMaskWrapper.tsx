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
  const { setSelectedComponentId, setExplorerMenuTab} = editorStore;
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  const dragOverSlotRef = useRef<string>('');
  const hoverComponentIdRef = useRef<string>('');

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition([e.clientX, e.clientY]);
  };
  const onMouseLeave = () => {
    setMousePosition([-1, -1]);
  };
  const onClick = () => {
    setSelectedComponentId(hoverComponentIdRef.current);
  };

  const onDragOver = useMemo(() => {
    return throttle((e: React.MouseEvent<HTMLDivElement>) => {
      setMousePosition([e.clientX, e.clientY]);
    }, 50);
  }, []);

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

  return (
    <Box
      width="full"
      overflow="auto"
      position="relative"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
      <EditorMask
        services={services}
        mousePosition={mousePosition}
        hoverComponentIdRef={hoverComponentIdRef}
        dragOverSlotRef={dragOverSlotRef}
      />
    </Box>
  );
});
