
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const DividerPropsSpec = {
  type: StringUnion(['vertical', 'horizontal'], {
    category: Category.Layout
  }),
  orientation: StringUnion(['center', 'left', 'right'], {
    category: Category.Layout
  })
};
