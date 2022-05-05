import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const ImagePropsSpec = {
  src: Type.String({
    title: 'Src',
    category: Category.Basic,
  }),
  title: Type.String({
    title: 'Title',
    category: Category.Basic,
  }),
  description: Type.String({
    title: 'Description',
    category: Category.Basic,
  }),
  width: Type.Number({
    title: 'Width',
    category: Category.Basic,
  }),
  height: Type.Number({
    title: 'Height',
    category: Category.Basic,
  }),
  error: Type.String({
    title: 'Error',
    description: 'Content displayed in error state',
    category: Category.Basic,
  }),
  footerPosition: StringUnion(['inner', 'outer'], {
    title: 'Footer Position',
    category: Category.Layout,
  }),
  simple: Type.Boolean({
    title: 'Simple',
    category: Category.Style,
  }),
  preview: Type.Boolean({
    title: 'Preview',
    category: Category.Basic,
  }),
};

const ImageItemsPropsSpec = Type.Object({
  src: Type.String({
    title: 'Src'
  }),
  width: Type.Number({
    title: 'Width'
  }),
  height: Type.Number({
    title: 'Height'
  }),
});
export const ImageGroupPropsSpec = {
  imageItems: Type.Array(ImageItemsPropsSpec, {
    title: 'Image Items',
    category: Category.Basic,
  }),
  infinite: Type.Boolean({
    title: 'Infinite',
    description: 'Whether to loop infinitely',
    category: Category.Basic,
  }),
  maskClosable: Type.Boolean({
    title: 'Mask Closable',
    description: 'Whether click mask to close',
    category: Category.Basic,
  }),
  closable: Type.Boolean({
    title: 'Closable',
    description: 'Whether display close button',
    category: Category.Basic,
  })
}

