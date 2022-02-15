
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const PaginationPropsSchema = {
  pageSize: Type.Number({
    category:Category.General,
  }),
  total: Type.Number({
    category:Category.General,
  }),
  defaultCurrent: Type.Number({
    category:Category.General,
  }),
  defaultPageSize: Type.Number({
    category:Category.General,
  }),
  disabled: Type.Boolean({
    category:Category.General,
  }),
  hideOnSinglePage: Type.Boolean({
    category:Category.Style
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'], {
    category: Category.Style
  }),
  sizeCanChange: Type.Boolean({
    category:Category.General,
  }),
  simple: Type.Boolean({
    category: Category.Style
  }),
  showJumper: Type.Boolean({
    category:Category.General,
    description: 'Whether to display quick jump'
  }),
};
