import { Link as BaseLink } from '@chakra-ui/react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../services/registry';
import Slot from '../_internal/Slot';
import { ColorSchemePropertySchema } from './Types/ColorScheme';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  isExternal: Type.Boolean(),
  href: Type.String(),
  color: ColorSchemePropertySchema,
  size: Type.String(),
  to: Type.String(),
});

const Link: ComponentImplementation<Static<typeof PropsSchema>> = ({
  slotsMap,
  isExternal,
  href,
  color,
  size,
  to,
}) => {
  return (
    <BaseLink href={href} isExternal={isExternal} color={color} size={size} to={to}>
      <Slot slotsMap={slotsMap} slot="text" />
    </BaseLink>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'link',
      displayName: 'Link',
      description: 'chakra_ui link',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        isExternal: true,
        href: 'https://github.com/webzard-io/meta-ui/',
      },
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Link,
};
