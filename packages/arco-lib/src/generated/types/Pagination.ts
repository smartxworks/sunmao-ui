
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const PaginationPropsSchema = {
  className: Type.Optional(Type.String()),
  pageSize: Type.Optional(Type.Number()),
  total: Type.Optional(Type.Number()),
  defaultCurrent: Type.Optional(Type.Number()),
  defaultPageSize: Type.Optional(Type.Number()),
  disabled: Type.Optional(Type.Boolean()),
  hideOnSinglePage: Type.Optional(Type.Boolean()),
  size: Type.Optional(StringUnion(['mini', 'small', 'default', 'large'])),
  sizeCanChange: Type.Optional(Type.Boolean()),
  pageSizeChangeResetCurrent: Type.Optional(Type.Boolean()),
  simple: Type.Optional(Type.Boolean()),
  showJumper: Type.Optional(Type.Boolean()),
};
