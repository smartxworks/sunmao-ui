import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const LinkPropsSpec = {
  asLink: Type.Boolean({
    title: 'As Link',
    category: Category.Basic,
    description: 'If false, only the Link style is retained',
  }),
  href: Type.String({
    title: 'Href',
    category: Category.Basic,
    conditions: [
      {
        key: 'asLink',
        value: true,
      },
    ],
  }),
  content: Type.String({
    title: 'Content',
    category: Category.Basic,
    weight: 1,
  }),
  openInNewPage: Type.Boolean({
    title: 'Open In New Page',
    category: Category.Basic,
    conditions: [
      {
        key: 'asLink',
        value: true,
      },
    ],
  }),
  hoverable: Type.Boolean({
    title: 'Hoverable',
    category: Category.Style,
    description: 'Whether to hide background when hover',
  }),
  status: StringUnion(['default', 'success', 'warning', 'error'], {
    title: 'Status',
    category: Category.Style,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
};
