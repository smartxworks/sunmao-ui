
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const SelectPropsSchema = {
  options: Type.Array(
    Type.Object({
      value: Type.String({
        title:'Value'
      }),
      text: Type.String({
        title:'Text'
      }),
      disabled: Type.Boolean({
        title:'Disabled'
      }),
    }),
    {
      title: 'Options',
      category: Category.Data,
    }
  ),
  defaultValue: Type.String({
    title: 'Default Value',
    category: Category.Data,
  }),
  multiple: Type.Boolean({
    title: 'Multiple',
    category: Category.Basic
  }),
  labelInValue: Type.Boolean({
    title: 'Label In Value',
    category: Category.Basic,
    description: 'Setting value format.The default is string, when set to true, the value format will turn to: { label: string, value: string }'
  }),
  placeholder: Type.String({
    title:'Placeholder',
    category: Category.Basic,
    weight: 5
  }),
  bordered: Type.Boolean({
    title:'Bordered',
    category: Category.Style
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title:'Size',
    category: Category.Style
  }),
  disabled: Type.Boolean({
    title:'Disabled',
    category: Category.Basic,
    weight: 4
  }),
  loading: Type.Boolean({
    title:'Loading',
    category: Category.Basic,
    weight: 3
  }),
  allowClear: Type.Boolean({
    title:'Allow Clear',
    category: Category.Basic,
  }),
  allowCreate: Type.Boolean({
    title:'Allow Create',
    category: Category.Basic,
    description:'Whether to allow new options to be created by input'
  }),
};
