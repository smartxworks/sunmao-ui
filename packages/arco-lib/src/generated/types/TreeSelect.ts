
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';


const TreeSelectNodeSchema = Type.Object({
    label: Type.String(),
    value: Type.String(),
    disabled: Type.Optional(Type.Boolean())
})

export const TreeSelectValueSchema = Type.Union([
    Type.String(),
    Type.Array(Type.String()),
    TreeSelectNodeSchema,
    Type.Array(TreeSelectNodeSchema)
])

export const TreeSelectPropsSchema = {
    defaultValue: Type.Optional(TreeSelectValueSchema),
    multiple: Type.Optional(Type.Boolean()),
    unmountOnExit: Type.Optional(Type.Boolean()),
    treeCheckable: Type.Optional(Type.Boolean()),
    treeCheckStrictly: Type.Optional(Type.Boolean()),
    bordered: Type.Optional(Type.Boolean()),
    placeholder: Type.Optional(Type.String()),
    className: Type.Optional(Type.String()),
    size: Type.Optional(StringUnion(['mini', 'small', 'default', 'large'])),
    disabled: Type.Optional(Type.Boolean()),
    showSearch: Type.Optional(Type.Boolean()),
    error: Type.Optional(Type.Boolean()),
    labelInValue: Type.Optional(Type.Boolean()),
    loading: Type.Optional(Type.Boolean()),
    allowClear: Type.Optional(Type.Boolean()),
    allowCreate: Type.Optional(Type.Boolean()),
    maxTagCount: Type.Optional(Type.Number()),
    animation: Type.Optional(Type.Boolean()),
    treeData: Type.Array(
        Type.Object({
            key: Type.String(),
            title: Type.String(),
            disabled: Type.Optional(Type.Boolean()),
            children: Type.Array(Type.Any())
        })
    ),
}
