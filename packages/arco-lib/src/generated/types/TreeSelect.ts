
import { Type } from '@sinclair/typebox';
import { Category } from 'src/constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TreeSelectPropsSchema = {
    treeData: Type.Array(
        Type.Object({
            key: Type.String(),
            title: Type.String(),
            disabled: Type.Boolean(),
            children: Type.Array(Type.Any())
        }), {
        category: Category.Data
    }),
    defaultValue: Type.Array(Type.String(), {
        category: Category.Data
    }),
    multiple: Type.Boolean({
        category: Category.General
    }),
    unmountOnExit: Type.Boolean({
        category: Category.General
    }),
    treeCheckStrictly: Type.Boolean({
        category: Category.General
    }),
    bordered: Type.Boolean({
        category: Category.Style
    }),
    placeholder: Type.String({
        category: Category.General
    }),
    size: StringUnion(['mini', 'small', 'default', 'large'], {
        category: Category.Style
    }),
    disabled: Type.Boolean({
        category: Category.General
    }),
    showSearch: Type.Boolean({
        category: Category.General
    }),
    error: Type.Boolean({
        category: Category.General
    }),
    labelInValue: Type.Boolean({
        category: Category.General
    }),
    loading: Type.Boolean({
        category: Category.Style
    }),
    allowClear: Type.Boolean({
        category: Category.General
    }),
    maxTagCount: Type.Number({
        category: Category.General
    }),
    animation: Type.Boolean({
        category: Category.Style
    }),
}
