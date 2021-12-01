import React from 'react';
import { css } from '@emotion/react';
import { ComponentWrapperType } from '@sunmao-ui/runtime';
import { observer } from 'mobx-react-lite';
import { editorStore } from '../EditorStore';

// children of components in this list should render height as 100%
const fullHeightList = ['core/v1/grid_layout'];
const inlineList = ['chakra_ui/v1/checkbox', 'chakra_ui/v1/radio'];

export const ComponentWrapper: ComponentWrapperType = observer(props => {
  const { component, parentType } = props;
  const {
    selectedComponentId,
    setSelectedComponentId,
    hoverComponentId,
    setHoverComponentId,
  } = editorStore;

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
    setSelectedComponentId(component.id);
  };
  const onMouseEnterWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setHoverComponentId(component.id);
  };
  const onMouseLeaveWrapper = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setHoverComponentId('');
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
});
