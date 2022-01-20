
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const BadgePropsSchema = {
    className: Type.Optional(Type.String()),
    text:Type.Optional(Type.String()),
    count:Type.Optional(Type.Number()),
    dot: Type.Optional(Type.Boolean()),
    maxCount: Type.Optional(Type.Number()),
    offset: Type.Optional(Type.Tuple([Type.Number(), Type.Number()])),
    color: Type.Optional(StringUnion(['red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray'])),
    status: Type.Optional(StringUnion(['default', 'processing', 'success', 'warning', 'error'])),
}