import React from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Tooltip } from '@chakra-ui/react';
import { TextProps, TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const TooltipImpl: ComponentImplementation<{
  text: TextProps['value'];
  shouldWrapChildren: boolean;
  placement: Static<typeof PlacementPropertySchema>;
  isOpen: boolean;
  hasArrow: boolean;
  isDisabled: boolean;
  defaultIsOpen: boolean;
}> = ({
  text,
  shouldWrapChildren,
  placement = 'auto',
  isOpen,
  hasArrow,
  isDisabled,
  defaultIsOpen,
  slotsMap,
}) => {
  return (
    /* 
        Chakra tooltip requires children to be created by forwardRef.
        If not, should add shouldWrapChildren.
    */
    <Tooltip
      label={text}
      placement={placement}
      isOpen={isOpen}
      hasArrow={hasArrow}
      isDisabled={isDisabled}
      defaultIsOpen={defaultIsOpen}
      shouldWrapChildren={shouldWrapChildren}>
      <Slot slotsMap={slotsMap} slot="trigger" />
    </Tooltip>
  );
};
export const PlacementPropertySchema = Type.Optional(
  Type.KeyOf(
    Type.Object({
      top: Type.String(),
      right: Type.String(),
      bottom: Type.String(),
      left: Type.String(),
      auto: Type.String(),
      'auto-start': Type.String(),
      'auto-end': Type.String(),
      'top-start': Type.String(),
      'top-end': Type.String(),
      'bottom-start': Type.String(),
      'bottom-end': Type.String(),
      'right-start': Type.String(),
      'right-end': Type.String(),
      'left-start': Type.String(),
      'left-end': Type.String(),
    })
  )
);

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'tooltip',
      description: 'chakra-ui tooltip',
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
          name: 'shouldWrapChildren',
          ...Type.Boolean(),
        },
        {
          name: 'defaultIsOpen',
          ...Type.Boolean(),
        },
        {
          name: 'hasArrow',
          ...Type.Boolean(),
        },
        {
          name: 'isDisabled',
          ...Type.Boolean(),
        },
        {
          name: 'isOpen',
          ...Type.Boolean(),
        },
        {
          name: 'placement',
          ...PlacementPropertySchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: TooltipImpl,
};
