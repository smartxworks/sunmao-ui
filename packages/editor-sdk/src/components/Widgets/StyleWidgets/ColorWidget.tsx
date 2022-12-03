import React, { Suspense, useRef } from 'react';
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
import { ComponentFormElementId } from '../../../constants';
import { Static, Type } from '@sinclair/typebox';

type ColorWidgetType = `${typeof CORE_VERSION}/${StyleWidgetName.Color}`;

const ColorWidgetOption = Type.Object({
  appendToBody: Type.Optional(Type.Boolean()),
  appendToParent: Type.Optional(Type.Boolean()),
});
declare module '../../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/color': Static<typeof ColorWidgetOption>;
  }
}

const SketchPicker = React.lazy(async () => {
  const { SketchPicker } = await import('react-color');
  return {
    default: SketchPicker,
  };
});

export const ColorWidget: React.FC<WidgetProps<ColorWidgetType, string>> = props => {
  const { value, onChange, spec } = props;
  const containerRef = useRef(
    spec.widgetOptions?.appendToBody
      ? null
      : document.getElementById(ComponentFormElementId)
  );
  const onColorChange = ({ rgb }: any) => {
    onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);
  };
  const onInputChange = (value: string) => {
    onChange(value);
  };

  const popoverContent = (
    <PopoverContent w="auto">
      <PopoverArrow />
      <PopoverBody padding={0}>
        <Suspense fallback={'Loading Color Picker'}>
          <SketchPicker
            width="250px"
            color={value || '#fff'}
            onChangeComplete={onColorChange}
          />
        </Suspense>
      </PopoverBody>
    </PopoverContent>
  );

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
        <Popover isLazy arrowSize={8} placement="left" matchWidth>
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
          {spec.widgetOptions?.appendToParent ? (
            popoverContent
          ) : (
            <Portal
              containerRef={spec.widgetOptions?.appendToBody ? undefined : containerRef}
            >
              {popoverContent}
            </Portal>
          )}
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
  spec: {
    options: ColorWidgetOption,
  },
})(ColorWidget);
