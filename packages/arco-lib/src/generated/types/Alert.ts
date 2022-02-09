import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const AlertPropsSchema = {
    disabled: Type.Boolean(),
    closable: Type.Boolean(),
    type: StringUnion(['info', 'success', 'warning', 'error']),
    showIcon: Type.Boolean(),
    banner: Type.Boolean(),
    content:Type.String(),
    title:Type.String(),
    visible:Type.String(),
}