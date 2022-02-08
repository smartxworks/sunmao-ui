/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useRef } from 'react';
import { css, cx } from '@emotion/css';
import { EditorServices } from '../types';

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

export const ComponentContainerMask: React.FC<Props> = props => {
  const { eleMap } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  // const { hoverComponentId } = editorStore;'
  const rects = Array.from(eleMap.keys()).map(id => {
    const ele = eleMap.get(id);
    return {
      id,
      rect: ele?.getBoundingClientRect(),
    };
  });

  const borders = useMemo(() => {
    if (!wrapperRef.current) {
      return null;
    }
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    return rects.map(({ id, rect }) => {
      console.log('rect', rect)
      console.log('wrapperRect', wrapperRect)
      const style = {
        top: (rect?.top || 0) - wrapperRect.top - 2,
        left: (rect?.left || 0) - wrapperRect.left - 2,
        height: (rect?.height || 0) + 4,
        width: (rect?.width || 0) + 4,
      };
      return (
        <div key={id} className={cx([outlineMaskStyle, 'hover'])} style={style}>
          <span className={cx([outlineMaskTextStyle, 'hover'])}>{id}</span>
        </div>
      );
    });
  }, [rects]);

  return (
    <div className={MaskWrapperStyle} ref={wrapperRef}>
      {borders}
    </div>
  );
};
