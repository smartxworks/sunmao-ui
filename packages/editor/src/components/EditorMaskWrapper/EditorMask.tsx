import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { DropSlotMask } from './DropSlotMask';
import { debounce } from 'lodash-es';

const MaskWrapperStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const outlineMaskTextStyle = css`
  position: absolute;
  z-index: 1;
  right: 0px;
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
`;

const outlineMaskStyle = css`
  position: absolute;
  border: 1px solid;
  /* create a bfc */
  transform: translate3d(0, 0, 0);
  z-index: 10;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;

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

type Props = {
  services: EditorServices;
  mousePosition: [number, number];
  dragOverSlotRef: React.MutableRefObject<string>;
  hoverComponentIdRef: React.MutableRefObject<string>;
};

export const EditorMask: React.FC<Props> = observer((props: Props) => {
  const { services, mousePosition, hoverComponentIdRef, dragOverSlotRef } = props;
  const { eventBus, editorStore } = services;
  const { selectedComponentId, eleMap, isDraggingNewComponent } = editorStore;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRect = useRef<DOMRect>();
  const [rects, setRects] = useState<Record<string, DOMRect>>({});

  useEffect(() => {
    wrapperRect.current = wrapperRef.current?.getBoundingClientRect();
  }, []);

  // get rects of all elements
  const updateRects = useCallback(
    (eleMap: Map<string, HTMLElement>) => {
      const _rects: Record<string, DOMRect> = {};
      for (const id of eleMap.keys()) {
        const ele = eleMap.get(id);
        const rect = ele?.getBoundingClientRect();
        if (rect) {
          _rects[id] = rect;
        }
      }
      setRects(_rects);
    },
    [setRects]
  );

  useEffect(() => {
    eventBus.on('HTMLElementsUpdated', () => {
      updateRects(eleMap);
    });
  }, [eleMap, eventBus, updateRects]);

  // listen elements resize and update rects
  useEffect(() => {
    const debouncedUpdateRects = debounce(updateRects, 50);
    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdateRects(eleMap);
    });
    for (const id of eleMap.keys()) {
      const ele = eleMap.get(id);
      if (ele) {
        resizeObserver.observe(ele);
      }
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [eleMap, setRects, updateRects]);

  const hoverComponentId = useMemo(() => {
    return whereIsMouse(...mousePosition, rects);
  }, [mousePosition, rects]);

  useEffect(() => {
    hoverComponentIdRef.current = hoverComponentId;
  }, [hoverComponentIdRef, hoverComponentId]);

  const getMaskPosition = useCallback(
    (componentId: string) => {
      const rect = rects[componentId];
      if (!wrapperRect.current || !rect) return;
      return {
        id: componentId,
        style: {
          top: rect.top - wrapperRect.current.top - 2,
          left: rect.left - wrapperRect.current.left - 2,
          height: rect.height + 4,
          width: rect.width + 4,
        },
      };
    },
    [rects]
  );

  const hoverMaskPosition = useMemo(() => {
    if (
      !wrapperRect.current ||
      !hoverComponentId ||
      hoverComponentId === selectedComponentId
    ) {
      return undefined;
    }

    return getMaskPosition(hoverComponentId);
  }, [hoverComponentId, selectedComponentId, getMaskPosition]);

  const selectedMaskPosition = useMemo(() => {
    if (!wrapperRect.current || !selectedComponentId) return undefined;

    return getMaskPosition(selectedComponentId);
  }, [selectedComponentId, getMaskPosition]);

  const hoverMask = (
    <div className={cx([outlineMaskStyle, 'hover'])} style={hoverMaskPosition?.style}>
      <span className={cx([outlineMaskTextStyle, 'hover'])}>{hoverMaskPosition?.id}</span>
    </div>
  );

  const dragMask = (
    <div className={cx([outlineMaskStyle, 'drag'])} style={hoverMaskPosition?.style}>
      <DropSlotMask
        services={services}
        hoverId={hoverComponentId}
        mousePosition={mousePosition}
        dragOverSlotRef={dragOverSlotRef}
      />
    </div>
  );

  return (
    <div className={cx([MaskWrapperStyle])} ref={wrapperRef}>
      {isDraggingNewComponent ? dragMask : hoverMask}
      <div
        className={cx([outlineMaskStyle, 'select'])}
        style={selectedMaskPosition?.style}
      >
        <span className={cx([outlineMaskTextStyle, 'select'])}>
          {selectedMaskPosition?.id}
        </span>
      </div>
    </div>
  );
});

function whereIsMouse(left: number, top: number, rects: Record<string, DOMRect>): string {
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
