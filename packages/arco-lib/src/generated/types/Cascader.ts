
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const CascaderValueSchema = Type.Array(Type.Union([Type.String(), Type.Array(Type.String())]))

export const CascaderPropsSchema = {
    expandTrigger: StringUnion(['click', 'hover']),
    changeOnSelect: Type.Boolean(),
    multiple: Type.Boolean(),
    showSearch: Type.Boolean(),
    placeholder: Type.String(),
    bordered: Type.Boolean(),
    size: StringUnion(['mini', 'small', 'default', 'large']),
    disabled: Type.Boolean(),
    error: Type.Boolean(),
    loading: Type.Boolean(),
    allowClear: Type.Boolean(),
    allowCreate: Type.Boolean(),
    maxTagCount: Type.Number(),
    defaultValue: CascaderValueSchema,
    options: Type.Array(Type.Array(Type.String())),
}