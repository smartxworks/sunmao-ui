
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const TreeSelectPropsSchema = {
    defaultValue: Type.Array(Type.String()),
    multiple: Type.Boolean(),
    unmountOnExit: Type.Boolean(),
    treeCheckStrictly: Type.Boolean(),
    bordered: Type.Boolean(),
    placeholder: Type.String(),
    size: StringUnion(['mini', 'small', 'default', 'large']),
    disabled: Type.Boolean(),
    showSearch: Type.Boolean(),
    error: Type.Boolean(),
    labelInValue: Type.Boolean(),
    loading: Type.Boolean(),
    allowClear: Type.Boolean(),
    maxTagCount: Type.Number(),
    animation: Type.Boolean(),
    treeData: Type.Array(
        Type.Object({
            key: Type.String(),
            title: Type.String(),
            disabled: Type.Boolean(),
            children: Type.Array(Type.Any())
        })
    ),
}
