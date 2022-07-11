import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const AvatarPropsSpec = {
  shape: StringUnion(['circle', 'square'], {
    title: 'Shape',
    category: Category.Style,
  }),
  size: Type.Number({
    title: 'Size',
    category: Category.Style,
  }),
  type: StringUnion(['img', 'text'], {
    title: 'Type',
    category: Category.Basic,
  }),
  src: Type.Optional(
    Type.String({
      title: 'Src',
      category: Category.Basic,
      conditions: [
        {
          key: 'type',
          value: 'img',
        },
      ],
    })
  ),
  text: Type.Optional(
    Type.String({
      title: 'Text',
      category: Category.Basic,
      conditions: [
        {
          key: 'type',
          value: 'text',
        },
      ],
    })
  ),
  autoFixFontSize: Type.Optional(
    Type.Boolean({
      title: 'Auto Fix Font Size',
      category: Category.Basic,
      conditions: [
        {
          key: 'type',
          value: 'text',
        },
      ],
    })
  ),
  triggerType: StringUnion(['button', 'mask'], {
    title: 'Trigger Type',
    category: Category.Basic,
    description:
      'This option allows you to customize the style of the trigger icon after inserting the `triggerIcon` slot',
  }),
};
