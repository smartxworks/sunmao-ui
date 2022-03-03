import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { DropSlotMask } from './DropSlotMask';
import { debounce } from 'lodash-es';
import { Box, Text } from '@sunmao-ui/editor-sdk';

const outlineMaskTextStyle = css`
  position: absolute;
  z-index: 1;
  right: 0px;
  padding: 0 4px;
  font-size: 14px;
  font-weight: black;
  color: white;
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
  hoverComponentIdRef: React.MutableRefObject<string>;
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
};

// Read this pr to understand the coordinates system before you modify this component.
// https://github.com/webzard-io/sunmao-ui/pull/286
export const EditorMask: React.FC<Props> = observer((props: Props) => {
  const { services, mousePosition, wrapperRef, hoverComponentIdRef, dragOverSlotRef } =
    props;
  const { eventBus, editorStore } = services;
  const { selectedComponentId, eleMap, isDraggingNewComponent } = editorStore;
  const maskContainerRef = useRef<HTMLDivElement>(null);
  const maskContainerRect = useRef<DOMRect>();
  const [coordinates, setCoordinates] = useState<Record<string, DOMRect>>({});
  const [coordinatesOffset, setCoordinatedOffset] = useState<[number, number]>([0, 0]);
  // establish the coordinateSystem by getting all the rect of elements,
  // and recording the current scroll Offset
  // and the updating maskContainerRect, because maskContainer shares the same coordinates with app
  const updateCoordinateSystem = useCallback(
    (eleMap: Map<string, HTMLElement>) => {
      if (!wrapperRef.current) return;
      const _rects: Record<string, DOMRect> = {};
      for (const id of eleMap.keys()) {
        const ele = eleMap.get(id);
        const rect = ele?.getBoundingClientRect();
        if (!rect) continue;
        _rects[id] = rect;
      }
      maskContainerRect.current = maskContainerRef.current?.getBoundingClientRect();
      setCoordinates(_rects);
      setCoordinatedOffset([wrapperRef.current.scrollLeft, wrapperRef.current.scrollTop]);
    },
    [wrapperRef]
  );

  const resizeObserver = useMemo(() => {
    const debouncedUpdateRects = debounce(updateCoordinateSystem, 50);
    return new ResizeObserver(() => {
      debouncedUpdateRects(eleMap);
    });
  }, [eleMap, updateCoordinateSystem]);

  const observeResize = useCallback(
    (eleMap: Map<string, HTMLElement>) => {
      for (const id of eleMap.keys()) {
        const ele = eleMap.get(id);
        if (ele) {
          resizeObserver.observe(ele);
        }
      }
    },
    [resizeObserver]
  );

  useEffect(() => {
    eventBus.on('HTMLElementsUpdated', () => {
      observeResize(eleMap);
      updateCoordinateSystem(eleMap);
    });
  }, [eleMap, eventBus, observeResize, updateCoordinateSystem]);

  // listen elements resize and update coordinates
  useEffect(() => {
    observeResize(eleMap);
    return () => {
      resizeObserver.disconnect();
    };
  }, [eleMap, observeResize, resizeObserver]);

  const hoverComponentId = useMemo(() => {
    const where = whereIsMouse(
      mousePosition[0] - coordinatesOffset[0],
      mousePosition[1] - coordinatesOffset[1],
      coordinates
    );
    return where;
  }, [coordinatesOffset, mousePosition, coordinates]);

  useEffect(() => {
    hoverComponentIdRef.current = hoverComponentId;
  }, [hoverComponentIdRef, hoverComponentId]);

  const getMaskPosition = useCallback(
    (componentId: string) => {
      const rect = coordinates[componentId];
      const padding = 4;
      if (!maskContainerRect.current || !wrapperRef.current || !rect) return;
      return {
        id: componentId,
        style: {
          top: rect.top - maskContainerRect.current.top - padding,
          left: rect.left - maskContainerRect.current.left - padding,
          height: rect.height + padding * 2,
          width: rect.width + padding * 2,
        },
      };
    },
    [coordinates, wrapperRef]
  );

  const hoverMaskPosition = useMemo(() => {
    if (!maskContainerRect.current || !hoverComponentId) {
      return undefined;
    }

    return getMaskPosition(hoverComponentId);
  }, [hoverComponentId, getMaskPosition]);

  const selectedMaskPosition = useMemo(() => {
    if (!maskContainerRect.current || !selectedComponentId) return undefined;

    return getMaskPosition(selectedComponentId);
  }, [selectedComponentId, getMaskPosition]);

  const hoverMask = hoverMaskPosition ? (
    <Box className={outlineMaskStyle} borderColor="black" style={hoverMaskPosition.style}>
      <Text className={outlineMaskTextStyle} background="black">
        {hoverMaskPosition.id}
      </Text>
    </Box>
  ) : undefined;

  const dragMask = hoverMaskPosition ? (
    <Box className={outlineMaskStyle} style={hoverMaskPosition.style}>
      <DropSlotMask
        services={services}
        hoverId={hoverComponentId}
        mousePosition={mousePosition}
        dragOverSlotRef={dragOverSlotRef}
      />
    </Box>
  ) : undefined;

  const selectMask = selectedMaskPosition ? (
    <Box
      className={outlineMaskStyle}
      borderColor="red"
      style={selectedMaskPosition.style}
    >
      <Text className={outlineMaskTextStyle} background="red">
        {selectedMaskPosition.id}
      </Text>
    </Box>
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
      ref={maskContainerRef}
    >
      {isDraggingNewComponent ? dragMask : hoverMask}
      {selectMask}
    </Box>
  );
});

export function whereIsMouse(
  left: number,
  top: number,
  rects: Record<string, DOMRect>
): string {
  let nearest = {
    id: '',
    sum: 0,
  };
  for (const id in rects) {
    const rect = rects[id];
    if (
      top < rect.top ||
      left < rect.left ||
      top > rect.top + rect.height ||
      left > rect.left + rect.width
    ) {
      continue;
    }
    const sum = rect.top + rect.left;
    if (sum > nearest.sum) {
      nearest = { id, sum };
    }
  }
  return nearest.id;
}
