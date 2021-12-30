import { useEffect, useRef } from 'react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { Button as BaseButton } from '@chakra-ui/react';
import { Text, TextPropertySchema, implementRuntimeComponent2 } from '@sunmao-ui/runtime';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  colorScheme: ColorSchemePropertySchema,
  isLoading: Type.Optional(Type.Boolean()),
});

export default implementRuntimeComponent2({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'button',
    displayName: 'Button',
    description: 'chakra-ui button',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      text: {
        raw: 'text',
        format: 'plain',
      },
      colorScheme: 'blue',
      isLoading: false,
    },
    exampleSize: [2, 1],
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {
      click: void 0,
    },
    slots: [],
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(
  ({
    text,
    mergeState,
    subscribeMethods,
    callbackMap: callbacks,
    colorScheme,
    isLoading,
    customStyle,
  }) => {
    useEffect(() => {
      mergeState({ value: text.raw });
    }, [text.raw]);

    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      subscribeMethods({
        click() {
          ref.current?.click();
        },
      });
    }, []);

    return (
      <BaseButton
        className={css`
          ${customStyle?.content}
        `}
        {...{ colorScheme, isLoading }}
        ref={ref}
        onClick={callbacks?.onClick}
      >
        <Text value={text} />
      </BaseButton>
    );
  }
);
