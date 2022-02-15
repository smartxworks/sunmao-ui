
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const CascaderValueSchema = Type.Array(Type.Union([Type.String(), Type.Array(Type.String())]), {
    category: Category.Data
})

export const CascaderPropsSchema = {
    options: Type.Array(Type.Array(Type.String()), {
        weight: 0,
        description: `An array of arrays`,
        category: Category.Data
    }),
    expandTrigger: StringUnion(['click', 'hover'],{
        category:Category.General
    }),
    multiple: Type.Boolean({
        category: Category.General
    }),
    showSearch: Type.Boolean({
        category: Category.General
    }),
    placeholder: Type.String({
        weight: 1,
        category: Category.General
    }),
    disabled: Type.Boolean({
        category: Category.General
    }),
    error: Type.Boolean({
        category: Category.General
    }),
    changeOnSelect: Type.Boolean({
        category: Category.General
    }),
    loading: Type.Boolean({
        category: Category.Style
    }),
    bordered: Type.Boolean({
        category: Category.Style
    }),
    size: StringUnion(['mini', 'small', 'default', 'large'], {
        category: Category.Style
    }),
    allowClear: Type.Boolean({
        category: Category.General
    }),
    allowCreate: Type.Boolean({
        category: Category.General
    }),
    maxTagCount: Type.Number({
        category: Category.General
    }),
    defaultValue: CascaderValueSchema,
}