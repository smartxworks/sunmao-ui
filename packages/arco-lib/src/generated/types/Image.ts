
import { Type } from "@sinclair/typebox";
import { Category } from "../../constants/category";
import { StringUnion } from '../../sunmao-helper';

export const ImagePropsSchema = {
  src: Type.String({
    title:'Src',
    category: Category.Basic
  }),
  title: Type.String({
    title:'Title',
    category: Category.Basic
  }),
  description: Type.String({
    title:'Description',
    category: Category.Basic
  }),
  footerPosition: StringUnion(['inner', 'outer'], {
    title:'Footer Position',
    category: Category.Layout
  }),
  simple: Type.Boolean({
    title:'Simple',
    category: Category.Style
  }),
  preview: Type.Boolean({
    title:'Preview',
    category: Category.Basic
  })
};
