import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const LinkPropsSchema = {
    className: Type.Optional(Type.String()),
    disabled: Type.Optional(Type.Boolean()),
    hoverable: Type.Optional(Type.Boolean()),
    status: Type.Optional(StringUnion(['default', 'success', 'warning', 'error'])),
    href: Type.Optional(Type.String()),
    content: Type.Optional(Type.String())
}