/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useRef } from 'react';
import { css, cx } from '@emotion/css';
import { EditorServices } from '../types';
import { observer } from 'mobx-react-lite';

const MaskWrapperStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  top: 100px;
  left: 0;
  width: 200px;
  height: 100px;
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
  eleMap: Map<string, HTMLElement>;
};

export const ComponentContainerMask: React.FC<Props> = observer((props: Props) => {
  const { services, eleMap } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { hoverComponentId, setHoverComponentId } = services.editorStore;
  const rects: Record<string, DOMRect> = {};
  for (const id of eleMap.keys()) {
    const ele = eleMap.get(id);
    const rect = ele?.getBoundingClientRect();
    if (rect) {
      rects[id] = rect;
    }
  }
  console.log('rects', rects)

  const borders = useMemo(() => {
    if (!wrapperRef.current) {
      return null;
    }
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    return Object.keys(rects)
      .filter(id => id === hoverComponentId)
      .map(id => {
        console.log('id', id);
        const rect = rects[id];
        const style = {
          top: rect.top - wrapperRect.top - 2,
          left: rect.left - wrapperRect.left - 2,
          height: rect.height + 4,
          width: rect.width + 4,
        };
        return (
          <div key={id} className={cx([outlineMaskStyle, 'hover'])} style={style}>
            <span className={cx([outlineMaskTextStyle, 'hover'])}>{id}</span>
          </div>
        );
      });
  }, [hoverComponentId, rects]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = whereIsMouse(e.clientX, e.clientY, rects);
    setHoverComponentId(id);
    console.log(id)
  };

  return (
    <div className={MaskWrapperStyle} ref={wrapperRef} data-is-mask onMouseMove={onMouseMove}>
      {borders}
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
