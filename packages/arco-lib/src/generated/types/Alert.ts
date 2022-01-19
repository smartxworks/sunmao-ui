import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const AlertPropsSchema = {
    className: Type.Optional(Type.String()),
    disabled: Type.Optional(Type.Boolean()),
    closable: Type.Optional(Type.Boolean()),
    type: Type.Optional(StringUnion(['info', 'success', 'warning', 'error'])),
    showIcon: Type.Optional(Type.Boolean()),
    banner: Type.Optional(Type.Boolean()),
    content:Type.Optional(Type.String()),
    title:Type.Optional(Type.String()),
    visible:Type.Optional(Type.String()),
}