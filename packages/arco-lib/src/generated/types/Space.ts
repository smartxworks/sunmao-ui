
import { Type } from "@sinclair/typebox";
import { Category } from "../../constants/category";
import { StringUnion } from '../../sunmao-helper';

export const SpacePropsSchema = {
  align: StringUnion(['start', 'end', 'center', 'baseline'], {
    category: Category.Layout
  }),
  direction: StringUnion(['vertical', 'horizontal'], {
    category: Category.Layout
  }),
  wrap: Type.Boolean({
    category: Category.Layout
  }),
  size: Type.Union([
    Type.Optional(StringUnion(["mini", "small", "medium", "large"])),
    Type.Number(),
  ],{
    category: Category.Style
  }),
};
