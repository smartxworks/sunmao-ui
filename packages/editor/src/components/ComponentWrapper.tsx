import { css } from '@emotion/react';
import { ComponentWrapperType } from '@meta-ui/runtime';
import React from 'react';

// children of components in this list should render height as 100%
const fullHeightList = ['core/v1/grid_layout'];
const inlineList = ['chakra_ui/v1/checkbox', 'chakra_ui/v1/radio'];

export const genComponentWrapper = (wrapperProps: {
  selectedComponentId: string;
  hoverComponentId: string;
  onClick: (id: string) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
}): ComponentWrapperType => {
  const { selectedComponentId, hoverComponentId, onClick, onMouseEnter, onMouseLeave } =
    wrapperProps;
  return props => {
    const componentId = props.component.id;
    const isHover = hoverComponentId === componentId;
    const isSelected = selectedComponentId === componentId;
    let borderColor = 'transparent';
    if (isSelected) {
      borderColor = 'red';
    } else if (isHover) {
      borderColor = 'black';
    }
    const style = css`
      display: ${inlineList.includes(props.component.type) ? 'inline-block' : 'block'};
      height: ${fullHeightList.includes(props.parentType) ? '100%' : 'auto'};
      width: ${inlineList.includes(props.component.type) ? 'auto' : '100%'};
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
      onClick(componentId);
    };
    const onMouseEnterWrapper = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onMouseEnter(componentId);
    };
    const onMouseLeaveWrapper = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onMouseLeave(componentId);
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
};
