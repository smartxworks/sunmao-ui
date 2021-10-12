import { css } from '@emotion/react';
import React from 'react';

type ComponentWrapperProps = {
  id: string;
};

export const genComponentWrapper = (
  selectedComponentId: string,
  hoverComponentId: string,
  onClick: (id: string) => void,
  onMouseEnter: (id: string) => void,
  onMouseLeave: (id: string) => void
): React.FC<ComponentWrapperProps> => {
  return props => {
    const isHover = hoverComponentId === props.id;
    const isSelected = selectedComponentId === props.id;
    let borderColor = 'transparent';
    if (isSelected) {
      borderColor = 'red';
    } else if (isHover) {
      borderColor = 'black';
    }

    const style = css`
      height: 100%;
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
      onClick(props.id);
    };
    const onMouseEnterWrapper = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onMouseEnter(props.id);
    };
    const onMouseLeaveWrapper = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onMouseLeave(props.id);
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
