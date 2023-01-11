import React, { CSSProperties, useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { Box, Text } from '@chakra-ui/react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { DropSlotMask } from './DropSlotMask';
import { EditorMaskManager } from './EditorMaskManager';
import { EditorServices } from '../../types';

const outlineMaskTextStyle = css`
  position: absolute;
  z-index: 1;
  right: 0px;
  padding: 0 4px;
  height: 20px;
  right: 0;
  max-width: 100%;
  color: white;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  transform: translateY(-100%);
`;

const outlineMaskStyle = css`
  position: absolute;
  border: 1px solid transparent;
  /* create a bfc */
  transform: translate3d(0, 0, 0);
  z-index: 10;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

type Props = {
  services: EditorServices;
  mousePosition: [number, number];
  dragOverSlotRef: React.MutableRefObject<string>;
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
};

// Read this pr to understand the coordinates system before you modify this component.
// https://github.com/smartxworks/sunmao-ui/pull/286
export const EditorMask: React.FC<Props> = observer((props: Props) => {
  const { services, mousePosition, wrapperRef, dragOverSlotRef } = props;
  const { editorStore } = services;
  const { isDraggingNewComponent, hoverComponentId } = editorStore;
  const maskContainerRef = useRef<HTMLDivElement>(null);

  const manager = useLocalObservable(
    () => new EditorMaskManager(services, wrapperRef, maskContainerRef)
  );

  const { hoverMaskPosition, selectedMaskPosition } = manager;

  useEffect(() => {
    setTimeout(() => {
      manager.init();
    }, 0);
    return () => {
      manager.destroy();
    };
  }, [manager]);

  useEffect(() => {
    if (mousePosition[0] > 0 && mousePosition[1] > 0) {
      manager.setMousePosition(mousePosition);
    }
  }, [manager, mousePosition]);

  const hoverMask = hoverMaskPosition ? (
    <HoverMask style={hoverMaskPosition.style} id={hoverMaskPosition.id} />
  ) : undefined;

  const dragMask = hoverMaskPosition ? (
    <Box className={outlineMaskStyle} style={hoverMaskPosition.style} zIndex="2">
      <DropSlotMask
        services={services}
        hoverId={hoverComponentId}
        mousePosition={mousePosition}
        dragOverSlotRef={dragOverSlotRef}
      />
    </Box>
  ) : undefined;

  const selectMask = selectedMaskPosition ? (
    <SelectMask style={selectedMaskPosition.style} id={selectedMaskPosition.id} />
  ) : undefined;

  return (
    <Box
      id="editor-mask-container"
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      pointerEvents="none"
      zIndex="editorMask"
      ref={maskContainerRef}
    >
      {isDraggingNewComponent ? dragMask : hoverMask}
      {selectMask}
    </Box>
  );
});

type MaskProps = {
  style: CSSProperties;
  id: string;
};

const HoverMask: React.FC<MaskProps> = (props: MaskProps) => {
  return (
    <Box
      className={outlineMaskStyle}
      borderColor="gray.700"
      zIndex="1"
      style={props.style}
    >
      <Text className={outlineMaskTextStyle} background="gray.700">
        {props.id}
      </Text>
    </Box>
  );
};

const SelectMask: React.FC<MaskProps> = (props: MaskProps) => {
  return (
    <Box
      className={outlineMaskStyle}
      borderColor="blue.500"
      zIndex="0"
      style={props.style}
    >
      <Text className={outlineMaskTextStyle} background="blue.500">
        {props.id}
      </Text>
    </Box>
  );
};
