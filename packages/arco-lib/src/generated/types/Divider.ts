import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const DividerPropsSpec = {
  type: StringUnion(['vertical', 'horizontal'], {
    title: 'Type',
    category: Category.Layout,
  }),
  orientation: StringUnion(['center', 'left', 'right'], {
    title: 'Orientation',
    category: Category.Layout,
  }),
};
