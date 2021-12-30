import { Link } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent2, Text, TextPropertySchema } from '@sunmao-ui/runtime';

const PropsSchema = Type.Object({
  text: TextPropertySchema,
  href: Type.String(),
  isExternal: Type.Optional(Type.Boolean()),
});

export default implementRuntimeComponent2({
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
    state: Type.Object({}),
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(({ text, href, isExternal, customStyle }) => {
  return (
    <Link
      href={href}
      isExternal={isExternal}
      color="blue.500"
      className={css`
        ${customStyle?.content}
      `}
    >
      <Text value={text} />
    </Link>
  );
});
