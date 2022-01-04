import { useState, useEffect } from 'react';
import { Type } from '@sinclair/typebox';
import { RadioGroup as BaseRadioGroup } from '@chakra-ui/react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';

const StateSchema = Type.Object({
  value: Type.Union([Type.String(), Type.Number()]),
});

const PropsSchema = Type.Object({
  defaultValue: Type.Union([Type.String(), Type.Number()]),
  isNumerical: Type.Optional(Type.Boolean()),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'radio_group',
    displayName: 'RadioGroup',
    description: 'chakra-ui radio group',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      defaultValue: 0,
      isNumerical: true,
    },
    exampleSize: [3, 3],
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
})(({ defaultValue, isNumerical, Slot, mergeState, customStyle }) => {
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
    >
      <Slot slot="content" />
    </BaseRadioGroup>
  );
});
