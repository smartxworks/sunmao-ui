import { Link } from '@chakra-ui/react';
import { Static, Type } from '@sinclair/typebox';
import { createComponent } from '@sunmao-ui/core';
import { ComponentImplementation } from '../../services/registry';
import Text, { TextPropertySchema } from '../_internal/Text';

const LinkImpl: ComponentImplementation<Static<typeof PropsSchema>> = ({
  text,
  href,
  isExternal,
}) => {
  return (
    <Link href={href} isExternal={isExternal} color="blue.500">
      <Text value={text} />
    </Link>
  );
};

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  href: Type.String(),
  isExternal: Type.Optional(Type.Boolean()),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'link',
      displayName: 'Link',
      description: 'chakra-ui link',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        text: {
          raw: 'link',
          format: 'plain',
        },
        href: 'https://www.google.com',
      },
      exampleSize: [2, 1],
    },
    spec: {
      properties: PropsSchema,
      state: {},
      methods: [],
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: LinkImpl,
};
