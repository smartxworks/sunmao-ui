/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useRef } from 'react';
import { css, cx } from '@emotion/css';
import { EditorServices } from '../../types';
import { observer } from 'mobx-react-lite';
import { DropSlotMask } from './DropSlotMask';
import { Box } from '@chakra-ui/react';

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
  &.idle,
  &.drag {
    display: none;
  }
  &.top {
    top: -4px;
    transform: translateY(-100%);
    border-radius: 3px 3px 0px 0px;
  }
  &.bottom {
    bottom: -4px;
    transform: translateY(100%);
    border-radius: 0px 0px 3px 3px;
  }
`;

const outlineMaskStyle = css`
  position: absolute;
  border: 1px solid;
  pointer-events: none;
  /* create a bfc */
  transform: translate3d(0, 0, 0);
  z-index: 10;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
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

type Props = {
  services: EditorServices;
  mousePosition: [number, number];
};

export const EditorMask: React.FC<Props> = observer((props: Props) => {
  const { services, mousePosition } = props;
  const { eleMap, setHoverComponentId, selectedComponentId } = services.editorStore;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperRect = useRef<DOMRect>();

  const rects = useMemo(() => {
    const _rects: Record<string, DOMRect> = {};
    for (const id of eleMap.keys()) {
      const ele = eleMap.get(id);
      const rect = ele?.getBoundingClientRect();
      if (rect) {
        _rects[id] = rect;
      }
    }
    return _rects;
  }, [eleMap]);

  useEffect(() => {
    wrapperRect.current = wrapperRef.current?.getBoundingClientRect();
  }, []);

  const hoverComponentId = useMemo(() => {
    return whereIsMouse(...mousePosition, rects);
  }, [mousePosition, rects]);

  useEffect(() => {
    setHoverComponentId(hoverComponentId);
  }, [hoverComponentId, setHoverComponentId]);

  const hoverMaskPosition = useMemo(() => {
    if (
      !wrapperRect.current ||
      !hoverComponentId ||
      hoverComponentId === selectedComponentId
    ) {
      return undefined;
    }

    const rect = rects[hoverComponentId];
    return {
      id: hoverComponentId,
      style: {
        top: rect.top - wrapperRect.current.top - 2,
        left: rect.left - wrapperRect.current.left - 2,
        height: rect.height + 4,
        width: rect.width + 4,
      },
    };
  }, [hoverComponentId, rects, selectedComponentId]);

  const selectedMaskPosition = useMemo(() => {
    if (!wrapperRect.current || !selectedComponentId) return undefined;

    const rect = rects[selectedComponentId];
    return {
      id: selectedComponentId,
      style: {
        top: rect.top - wrapperRect.current.top - 2,
        left: rect.left - wrapperRect.current.left - 2,
        height: rect.height + 4,
        width: rect.width + 4,
      },
    };
  }, [selectedComponentId, rects]);

  return (
    <div className={MaskWrapperStyle} ref={wrapperRef}>
      <div className={cx([outlineMaskStyle, 'hover'])} style={hoverMaskPosition?.style}>
        <span className={cx([outlineMaskTextStyle, 'hover'])}>
          {hoverMaskPosition?.id}
        </span>
      </div>
      <div
        className={cx([outlineMaskStyle, 'select'])}
        style={selectedMaskPosition?.style}
      >
        <span className={cx([outlineMaskTextStyle, 'select'])}>
          {selectedMaskPosition?.id}
        </span>
      </div>
      <div className={cx([outlineMaskStyle, 'drag'])} style={hoverMaskPosition?.style}>
        <DropSlotMask
          services={services}
          componentType="chakra_ui/v1/hstack"
          hoverId={hoverComponentId}
        />
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
