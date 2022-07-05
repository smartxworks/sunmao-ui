import React from 'react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget, mergeWidgetOptionsIntoSpec } from '../../../utils/widget';
import { ExpressionWidget } from '../ExpressionWidget';
import {
  Box,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Portal,
} from '@chakra-ui/react';
import { SketchPicker } from 'react-color';

type ColorWidgetType = `${typeof CORE_VERSION}/${StyleWidgetName.Color}`;

declare module '../../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/color': {};
  }
}

export const ColorWidget: React.FC<WidgetProps<ColorWidgetType, string>> = props => {
  const { value, onChange } = props;
  const onColorChange = ({ rgb }: any) => {
    onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);
  };
  const onInputChange = (value: string) => {
    onChange(value);
  };

  return (
    <InputGroup>
      <ExpressionWidget
        {...props}
        spec={mergeWidgetOptionsIntoSpec<'core/v1/expression'>(props.spec, {
          compactOptions: { isHiddenExpand: true, height: '32px' },
        })}
        value={value}
        onChange={onInputChange}
      />
      <InputRightElement>
        <Popover arrowSize={8} placement="left" matchWidth>
          <PopoverTrigger>
            <Box
              cursor="pointer"
              backgroundColor={value || '#fff'}
              borderRadius="3px"
              border="1px solid #eee"
              width="20px"
              height="20px"
              boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent w="auto">
              <PopoverArrow />
              <PopoverBody padding={0}>
                <SketchPicker
                  width="250px"
                  color={value || '#fff'}
                  onChangeComplete={onColorChange}
                />
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </InputRightElement>
    </InputGroup>
  );
};

export default implementWidget<ColorWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: StyleWidgetName.Color,
  },
})(ColorWidget);
