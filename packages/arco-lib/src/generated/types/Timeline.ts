import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const TimelineItemPropsSchema = {
    label: Type.String(),
    content: Type.String(),
    dotColor: Type.String(),
    lineType: StringUnion(['solid', 'dashed', 'dotted']),
    lineColor: Type.String(),
    dotType: StringUnion(['hollow', 'solid'])
}

export const TimelinePropsSchema = {
    reverse: Type.Boolean(),
    direction: StringUnion(['horizontal', 'vertical']),
    mode: StringUnion(['left', 'right', 'alternate']),
    labelPosition: StringUnion(['relative', 'same']),
    items: Type.Array(Type.Object(
        TimelineItemPropsSchema
    ))
}

