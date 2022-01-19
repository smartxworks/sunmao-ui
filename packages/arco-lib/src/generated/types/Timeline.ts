import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const TimelineItemPropsSchema = {
    className: Type.Optional(Type.String()),
    label: Type.Optional(Type.String()),
    content: Type.String(),
    dotColor: Type.Optional(Type.String()),
    lineType: Type.Optional(StringUnion(['solid', 'dashed', 'dotted'])),
    lineColor: Type.Optional(Type.String()),
    dotType: Type.Optional(StringUnion(['hollow', 'solid']))
}

export const TimelinePropsSchema = {
    className: Type.Optional(Type.String()),
    reverse: Type.Optional(Type.Boolean()),
    direction: StringUnion(['horizontal', 'vertical']),
    mode: StringUnion(['left', 'right', 'alternate']),
    labelPosition: StringUnion(['relative', 'same']),
    items: Type.Optional(Type.Array(Type.Object(
        TimelineItemPropsSchema
    )))
}

