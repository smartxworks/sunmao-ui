import React, { useEffect, useRef } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Button as BaseButton } from '@chakra-ui/react';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../registry';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const Button: ComponentImplementation<{
  text: TextProps['value'];
  colorScheme?: Static<typeof ColorSchemePropertySchema>;
  isLoading?: Static<typeof IsLoadingPropertySchema>;
}> = ({
  text,
  mergeState,
  subscribeMethods,
  callbackMap: callbacks,
  colorScheme,
  isLoading,
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
      {...{ colorScheme, isLoading }}
      ref={ref}
      onClick={callbacks?.click}>
      <Text value={text} />
    </BaseButton>
  );
};

const IsLoadingPropertySchema = Type.Optional(Type.Boolean());

const StateSchema = Type.Object({
  value: Type.String(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'button',
      description: 'chakra-ui button',
    },
    spec: {
      properties: [
        {
          name: 'text',
          ...TextPropertySchema,
        },
        {
          name: 'colorScheme',
          ...ColorSchemePropertySchema,
        },
        {
          name: 'isLoading',
          ...IsLoadingPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [
        {
          name: 'click',
        },
      ],
    },
  }),
  impl: Button,
};
