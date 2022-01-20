
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const CascaderValueSchema = Type.Array(Type.Union([Type.String(), Type.Array(Type.String())]))

export const CascaderPropsSchema = {
    className: Type.Optional(Type.String()),
    expandTrigger: StringUnion(['click', 'hover']),
    changeOnSelect: Type.Optional(Type.Boolean()),
    unmountOnExit: Type.Optional(Type.Boolean()),
    multiple: Type.Boolean(),
    defaultPopupVisible: Type.Optional(Type.Boolean()),
    showSearch: Type.Optional(Type.Boolean()),
    placeholder: Type.Optional(Type.String()),
    bordered: Type.Optional(Type.Boolean()),
    size: Type.Optional(StringUnion(['mini', 'small', 'default', 'large'])),
    disabled: Type.Optional(Type.Boolean()),
    error: Type.Optional(Type.Boolean()),
    loading: Type.Optional(Type.Boolean()),
    allowClear: Type.Optional(Type.Boolean()),
    allowCreate: Type.Optional(Type.Boolean()),
    maxTagCount: Type.Optional(Type.Number()),
    animation: Type.Boolean(),
    defaultValue: CascaderValueSchema,
    options: Type.Array(Type.Array(Type.String())),
}