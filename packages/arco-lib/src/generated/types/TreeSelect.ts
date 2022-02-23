
import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TreeSelectPropsSchema = {
    treeData: Type.Array(
        Type.Object({
            key: Type.String(),
            title: Type.String(),
            disabled: Type.Boolean(),
            children: Type.Array(Type.Any())
        }), {
        title: 'Options',
        category: Category.Data,
        widget: 'expression'
    }),
    defaultValue: Type.Array(Type.String(), {
        title: 'Default Value',
        category: Category.Data,
        widget: 'expression'
    }),
    multiple: Type.Boolean({
        title: 'Multiple',
        category: Category.Basic
    }),
    bordered: Type.Boolean({
        title: 'Bordered',
        category: Category.Style
    }),
    placeholder: Type.String({
        title: 'Placeholder',
        category: Category.Basic,
        weight: 10
    }),
    size: StringUnion(['mini', 'small', 'default', 'large'], {
        title: 'Size',
        category: Category.Style
    }),
    disabled: Type.Boolean({
        title: 'Disabled',
        category: Category.Basic,
        weight: 9
    }),
    showSearch: Type.Boolean({
        title: 'Show Search',
        category: Category.Basic
    }),
    error: Type.Boolean({
        title: 'Error',
        category: Category.Basic
    }),
    labelInValue: Type.Boolean({
        title: 'Label In Value',
        category: Category.Basic,
        description: 'Setting value format.The default is string, when set to true, the value format will turn to: { label: string, value: string }'
    }),
    loading: Type.Boolean({
        title: 'Loading',
        category: Category.Basic
    }),
    allowClear: Type.Boolean({
        title: 'AllowClear',
        category: Category.Basic
    }),
}
