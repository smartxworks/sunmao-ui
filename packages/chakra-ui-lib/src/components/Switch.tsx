import { Switch } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { useEffect, useState } from 'react';
import { BASIC } from './constants/category';

const PropsSpec = Type.Object({
  size: Type.KeyOf(
    Type.Object({
      sm: Type.String(),
      md: Type.String(),
      lg: Type.String(),
      xs: Type.String(),
    }),
    {
      title: 'Size',
      category: BASIC,
    }
  ),
  isDisabled: Type.Boolean({
    title: 'Disabled',
    category: BASIC,
  }),
});

const StateSpec = Type.Object({
  value: Type.Boolean(),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'switch',
    displayName: 'Switch',
    description: 'chakra-ui switch',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      isDisabled: false,
    },
    exampleSize: [2, 1],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ isDisabled, size, customStyle, elementRef, mergeState }) => {
  const [value, setValue] = useState(false);
  const onChange = () => {
    setValue(!value);
  };
  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);
  return (
    <div ref={elementRef}>
      <Switch
        size={size}
        isDisabled={isDisabled}
        className={css`
          ${customStyle?.content}
        `}
        onChange={onChange}
        isChecked={value}
      />
    </div>
  );
});
