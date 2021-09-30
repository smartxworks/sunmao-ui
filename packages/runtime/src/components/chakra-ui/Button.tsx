import { useEffect, useRef } from 'react';
import { createComponent } from '@meta-ui/core';
import { css } from '@emotion/react';
import { Static, Type } from '@sinclair/typebox';
import { Button as BaseButton } from '@chakra-ui/react';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../modules/registry';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const style = css`
  width: 100%;
  height: 100%;
`;

const Button: ComponentImplementation<Static<typeof PropsSchema>> = ({
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
      css={style}
      {...{ colorScheme, isLoading }}
      ref={ref}
      onClick={callbacks?.click}
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
      description: 'chakra-ui button',
    },
    spec: {
      properties: PropsSchema,
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
