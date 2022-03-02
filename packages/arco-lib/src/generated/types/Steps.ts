
import { Type } from "@sinclair/typebox";
import { Category } from "../../constants/category";
import { StringUnion } from '../../sunmao-helper';

export const StepItemSchema = Type.Object({
  title: Type.String(),
  description: Type.String()
})

export const StepsPropsSchema = {
  type: StringUnion(['default', 'arrow', 'dot', 'navigation'], {
    title: 'Type',
    category: Category.Basic
  }),
  current: Type.Number({
    title: 'Current Step',
    category: Category.Basic
  }),
  size: StringUnion(['default', 'small'], {
    title: 'Size',
    category: Category.Style
  }),
  direction: StringUnion(['vertical', 'horizontal'], {
    title: 'Direction',
    category: Category.Layout
  }),
  status: StringUnion(['wait', 'process', 'finish', 'error'], {
    title: 'Status',
    category: Category.Style
  }),
  lineless: Type.Boolean({
    title: 'Lineless',
    category: Category.Style
  }),
  items: Type.Array(StepItemSchema, {
    title: 'Items',
    category: Category.Basic,
    weight: 10
  })
};
