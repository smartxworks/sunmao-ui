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
    let shadowColor = 'transparent';
    console.log('hoverComponentId', hoverComponentId, props.id);
    if (isSelected) {
      shadowColor = 'red';
    } else if (isHover) {
      shadowColor = 'black';
    }

    console.log('shadowColor', shadowColor);
    const style = css`
      height: 100%;
      box-shadow: 0 0 1px ${shadowColor};
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
