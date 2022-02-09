import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const LinkPropsSchema = {
    disabled: Type.Boolean(),
    hoverable: Type.Boolean(),
    status: StringUnion(['success', 'warning', 'error']),
    href: Type.String(),
    content: Type.String()
}
