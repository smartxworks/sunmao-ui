import React, { useState } from 'react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';
import {
  Grid,
  GridItem,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
} from '@chakra-ui/react';
import { css, cx } from '@emotion/css';

const marginCfg = [
  {
    direction: 'top',
    colStart: 3,
    rowStart: 1,
  },
  {
    direction: 'right',
    colStart: 5,
    rowStart: 3,
  },
  {
    direction: 'bottom',
    colStart: 3,
    rowStart: 5,
  },
  {
    direction: 'left',
    colStart: 1,
    rowStart: 3,
  },
];

const paddingCfg = [
  {
    direction: 'top',
    colStart: 3,
    rowStart: 2,
  },
  {
    direction: 'right',
    colStart: 2,
    rowStart: 3,
  },
  {
    direction: 'bottom',
    colStart: 3,
    rowStart: 4,
  },
  {
    direction: 'left',
    colStart: 4,
    rowStart: 3,
  },
];

const spaceItemStyle = css`
  align-self: center;
`;

const gridStyle = css`
  min-height: 200px;
  text-align: center;
`;

const textStyle = css`
  text-align: left;
  color: #ababab;
  font-style: italic;
  font-weight: bold;
  font-size: 12px;
  transform: scale(0.8);
  padding: 4px 0 0 4px;
  -webkit-transform-origin-x: 0;
  pointer-events: none;
`;

type SpaceItemProps = {
  direction: string;
  colStart: number;
  rowStart: number;
  value: string;
  type: string;
  onChange: (v: string | number | undefined, ...args: any[]) => void;
};

export const SpaceItem: React.FC<SpaceItemProps> = props => {
  const { direction, colStart, rowStart, value, onChange, type } = props;
  const [localValue, setLocalValue] = useState(value || '-');

  return (
    <GridItem
      className={cx(direction, spaceItemStyle)}
      gridColumnStart={colStart}
      gridRowStart={rowStart}
    >
      <Editable
        value={localValue}
        onChange={v => {
          setLocalValue(v);
        }}
        onBlur={() => {
          if (!localValue) {
            setLocalValue('-');
          }
          const newValue =
            localValue === '-' || localValue === undefined ? '' : localValue;
          onChange(newValue, direction, type);
        }}
      >
        <EditablePreview width="full" />
        <Input paddingInlineStart={0} paddingInlineEnd={0} as={EditableInput} />
      </Editable>
    </GridItem>
  );
};

type SpaceWidgetType = `${typeof CORE_VERSION}/${StyleWidgetName.Space}`;
declare module '../../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/space': {};
  }
}

export const SpaceWidget: React.FC<WidgetProps<SpaceWidgetType>> = props => {
  const { value, onChange } = props;
  const paddingValue = value.padding;
  const marginValue = value.margin;

  return (
    <div>
      <Grid
        templateRows="repeat(5,1fr)"
        templateColumns="1fr 1fr 2fr 1fr 1fr"
        gap="1"
        className={gridStyle}
      >
        <Grid
          templateRows="repeat(5,1fr)"
          templateColumns="1fr 1fr 2fr 1fr 1fr"
          gridArea="1 / 1 / -1 / -1"
          bg="rgb(247, 248, 250)"
        >
          <GridItem gridArea="1 / 1 / -1 / -1">
            <div className={textStyle}>MARGIN</div>
          </GridItem>
          <GridItem bg="rgb(242, 243, 245)" gridArea="2 / 2 / 5 / 5">
            <div className={textStyle}>PADDING</div>
          </GridItem>
          <GridItem bg="white" gridArea="3 / 3 / 3 / 3" />
        </Grid>
        {marginCfg.map((m, i) => {
          return (
            <SpaceItem
              key={i}
              onChange={onChange}
              value={marginValue[i]}
              direction={m.direction}
              rowStart={m.rowStart}
              colStart={m.colStart}
              type="margin"
            />
          );
        })}
        {paddingCfg.map((m, i) => {
          return (
            <SpaceItem
              key={i}
              onChange={onChange}
              value={paddingValue[i]}
              direction={m.direction}
              rowStart={m.rowStart}
              colStart={m.colStart}
              type="padding"
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default implementWidget<SpaceWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: StyleWidgetName.Space,
  },
})(SpaceWidget);
