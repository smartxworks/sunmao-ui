import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';
import { TextPropertySpec } from '@sunmao-ui/runtime';

export const FormControlPropsSpec = {
  label: TextPropertySpec,
  required: Type.Boolean({
    title: 'Required',
    category: Category.Basic,
  }),
  hidden: Type.Boolean({
    title: 'Hidden',
    category: Category.Basic,
  }),
  layout: StringUnion(['vertical', 'horizontal'], {
    title: 'Layout',
    category: Category.Layout,
  }),
  extra: Type.String({
    title: 'Extra',
    category: Category.Basic,
  }),
  errorMsg: Type.String({
    title: 'Error Message',
    category: Category.Basic,
  }),
  help: Type.String({
    title: 'Help Message',
    category: Category.Basic,
  }),
  labelAlign: StringUnion(['left', 'right'], {
    title: 'Label Align',
    category: Category.Layout,
  }),
  colon: Type.Boolean({
    title: 'Colon',
    category: Category.Style,
  })
};
