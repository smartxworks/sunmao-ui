import { useEffect, useRef } from 'react';
import { createComponent } from '@meta-ui/core';
import { css } from '@emotion/react';
import { Static, Type } from '@sinclair/typebox';
import { Button as BaseButton } from '@chakra-ui/react';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../services/registry';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const Button: ComponentImplementation<Static<typeof PropsSchema>> = ({
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
      css={css`
        ${customStyle?.content}
      `}
      height="full"
      {...{ colorScheme, isLoading }}
      ref={ref}
      onClick={callbacks?.onClick}
    >
      <Text value={text} />
    </BaseButton>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  colorScheme: ColorSchemePropertySchema,
  isLoading: Type.Optional(Type.Boolean()),
});

export default {
  ...createComponent({
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
      methods: [
        {
          name: 'click',
        },
      ],
      slots: [],
      styleSlots: [],
      events: ['onClick'],
    },
  }),
  impl: Button,
};
