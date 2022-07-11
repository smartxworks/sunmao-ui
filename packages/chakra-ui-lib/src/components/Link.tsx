import { Link } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent, Text, TextPropertySpec } from '@sunmao-ui/runtime';
import { BASIC, BEHAVIOR } from './constants/category';

const PropsSpec = Type.Object({
  text: TextPropertySpec,
  href: Type.String({
    title: 'Href',
    description: 'The URL to link to.',
    category: BASIC,
  }),
  isExternal: Type.Boolean({
    title: 'External',
    description: 'Whether the link should open in a new tab.',
    category: BEHAVIOR,
  }),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'link',
    displayName: 'Link',
    description: 'chakra-ui link',
    exampleProperties: {
      text: {
        raw: 'link',
        format: 'plain',
      },
      href: 'https://www.google.com',
      isExternal: false,
    },
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({}),
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ text, href, isExternal, customStyle, elementRef }) => {
  return (
    <Link
      href={href}
      isExternal={isExternal}
      color="blue.500"
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      <Text value={text} />
    </Link>
  );
});
