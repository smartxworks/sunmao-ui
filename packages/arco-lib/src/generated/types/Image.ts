
import { Type } from "@sinclair/typebox";
import { Category } from "src/constants/category";
import { StringUnion } from '../../sunmao-helper';

export const ImagePropsSchema = {
  src: Type.String({
    category: Category.General
  }),
  title: Type.String({
    category: Category.General
  }),
  description: Type.String({
    category: Category.General
  }),
  footerPosition: StringUnion(['inner', 'outer'], {
    category: Category.Layout
  }),
  simple: Type.Boolean({
    category: Category.Style
  }),
  preview: Type.Boolean({
    category: Category.General
  })
};
