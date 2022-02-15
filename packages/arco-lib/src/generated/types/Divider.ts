
import { Category } from 'src/constants/category';
import { StringUnion } from '../../sunmao-helper';

export const DividerPropsSchema = {
  type: StringUnion(['vertical', 'horizontal'], {
    category: Category.Layout
  }),
  orientation: StringUnion(['center', 'left', 'right'], {
    category: Category.Layout
  })
};
