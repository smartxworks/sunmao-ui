
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const PaginationPropsSchema = {
  pageSize: Type.Number(),
  total: Type.Number(),
  defaultCurrent: Type.Number(),
  defaultPageSize: Type.Number(),
  disabled: Type.Boolean(),
  hideOnSinglePage: Type.Boolean(),
  size: StringUnion(['mini', 'small', 'default', 'large']),
  sizeCanChange: Type.Boolean(),
  pageSizeChangeResetCurrent: Type.Boolean(),
  simple: Type.Boolean(),
  showJumper: Type.Boolean(),
};
