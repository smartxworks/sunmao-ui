
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const BadgePropsSchema = {
    text:Type.String(),
    count:Type.Number(),
    dot: Type.Boolean(),
    maxCount: Type.Number(),
    offset: Type.Tuple([Type.Number(), Type.Number()]),
    color: StringUnion(['red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray']),
    status: StringUnion(['default', 'processing', 'success', 'warning', 'error']),
}