import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const BadgePropsSpec = {
  text: Type.String({
    title: 'Text',
    category: Category.Basic,
    description: 'Set the display text of the status dot',
  }),
  count: Type.Number({
    title: 'Count',
    category: Category.Basic,
  }),
  maxCount: Type.Number({
    title: 'Max Count',
    category: Category.Basic,
    // eslint-disable-next-line no-template-curly-in-string
    description:
      'Max count to show. If count is larger than this value, it will be displayed as ${maxCount}+',
  }),
  dot: Type.Boolean({
    title: 'Dot Mode',
    category: Category.Basic,
  }),
  offset: Type.Tuple([Type.Number(), Type.Number()], {
    title: 'Offset',
    category: Category.Layout,
  }),
  dotColor: Type.Optional(
    StringUnion(
      [
        'red',
        'orangered',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'arcoblue',
        'purple',
        'pinkpurple',
        'magenta',
        'gray',
      ],
      {
        title: 'Dot Color',
        description: 'Set the badge color in dot mode',
        category: Category.Basic,
        conditions: [
          {
            key: 'dot',
            value: true,
          },
        ],
      }
    )
  ),
};
