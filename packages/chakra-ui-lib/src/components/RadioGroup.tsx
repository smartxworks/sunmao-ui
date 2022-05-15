import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { RadioGroup as BaseRadioGroup } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { BASIC, BEHAVIOR } from './constants/category';

const StateSpec = Type.Object({
  value: Type.Union([Type.String(), Type.Number()]),
});

const PropsSpec = Type.Object({
  defaultValue: Type.Union([Type.String(), Type.Number()], {
    title: 'Default Value',
    category: BASIC,
  }),
  isNumerical: Type.Boolean({
    title: 'Numerical',
    description: 'Whether the value is a number',
    category: BEHAVIOR,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'radioGroup',
    displayName: 'RadioGroup',
    description: 'chakra-ui radio group',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      defaultValue: 0,
      isNumerical: true,
    },
    exampleSize: [3, 3],
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(
  ({ defaultValue, isNumerical, slotsElements, mergeState, customStyle, elementRef }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      mergeState({ value });
    }, [mergeState, value]);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    return (
      <BaseRadioGroup
        value={value}
        onChange={val => setValue(isNumerical ? Number(val) : val)}
        className={css`
          ${customStyle?.content}
        `}
        ref={elementRef}
      >
        {slotsElements.content ? slotsElements.content({}) : null}
      </BaseRadioGroup>
    );
  }
);
