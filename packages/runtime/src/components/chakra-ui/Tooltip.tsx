import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Tooltip } from '@chakra-ui/react';
import { TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../services/registry';
import Slot from '../_internal/Slot';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const TooltipImpl: ComponentImplementation<Static<typeof PropsSchema>> = ({
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
      shouldWrapChildren={shouldWrapChildren}
    >
      <Slot slotsMap={slotsMap} slot="content" />
    </Tooltip>
  );
};

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  colorScheme: ColorSchemePropertySchema,
  shouldWrapChildren: Type.Boolean(),
  defaultIsOpen: Type.Boolean(),
  hasArrow: Type.Boolean(),
  isDisabled: Type.Boolean(),
  isOpen: Type.Boolean(),
  placement: Type.Optional(
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
  ),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'tooltip',
      description: 'chakra-ui tooltip',
      displayName: 'Tooltip',
      isDraggable: false,
      isResizable: false,
      exampleProperties: {
        text: 'tooltip',
      },
      exampleSize: [2, 1],
    },
    spec: {
      properties: PropsSchema,
      state: {},
      methods: [],
      slots: ['content'],
      styleSlots: [],
      events: [],
    },
  }),
  impl: TooltipImpl,
};
