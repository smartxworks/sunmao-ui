import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ComponentWrapperType } from '@sunmao-ui/runtime';
import { eventBus, HoverComponentEvent, SelectComponentEvent } from '../eventBus';

// children of components in this list should render height as 100%
const fullHeightList = ['core/v1/grid_layout'];
const inlineList = ['chakra_ui/v1/checkbox', 'chakra_ui/v1/radio'];

export const ComponentWrapper: ComponentWrapperType = props => {
  const { component, parentType } = props;
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [hoverComponentId, setHoverComponentId] = useState('');

  useEffect(() => {
    const handler = (event: string, payload: any) => {
      switch (event) {
        case SelectComponentEvent:
          setSelectedComponentId(payload);
          break;
        case HoverComponentEvent:
          setHoverComponentId(payload);
          break;
      }
    };
    eventBus.on('*', handler);
    return () => eventBus.off('*', handler);
  }, [setSelectedComponentId, setHoverComponentId]);

  const isHover = hoverComponentId === component.id;
  const isSelected = selectedComponentId === component.id;
  let borderColor = 'transparent';
  if (isSelected) {
    borderColor = 'red';
  } else if (isHover) {
    borderColor = 'black';
  }
  const style = css`
    display: ${inlineList.includes(component.type) ? 'inline-block' : 'block'};
    height: ${fullHeightList.includes(parentType) ? '100%' : 'auto'};
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: -4px;
      bottom: -4px;
      left: -4px;
      right: -4px;
      border: 1px solid ${borderColor};
      pointer-events: none;
    }
  `;
  const onClickWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    eventBus.send(SelectComponentEvent as any, component.id);
  };
  const onMouseEnterWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    eventBus.send(HoverComponentEvent as any, component.id);
  };
  const onMouseLeaveWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    eventBus.send(HoverComponentEvent as any, '');
  };
  return (
    <div
      onClick={onClickWrapper}
      onMouseEnter={onMouseEnterWrapper}
      onMouseLeave={onMouseLeaveWrapper}
      css={style}
    >
      {props.children}
    </div>
  );
};
