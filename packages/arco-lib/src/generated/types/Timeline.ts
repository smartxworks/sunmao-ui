import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';


export const TimelineItemPropsSchema = {
    label: Type.String(),
    content: Type.String(),
    dotColor: Type.String(),
    lineType: StringUnion(['solid', 'dashed', 'dotted']),
    lineColor: Type.String(),
    dotType: StringUnion(['hollow', 'solid'])
}

export const TimelinePropsSchema = {
    items: Type.Array(Type.Object(
        TimelineItemPropsSchema
    ),{
        category:Category.Data
    }),
    reverse: Type.Boolean({
        category:Category.Style
    }),
    direction: StringUnion(['horizontal', 'vertical'],{
        category:Category.Style
    }),
    mode: StringUnion(['left', 'right', 'alternate'],{
        category:Category.Style
    }),
    labelPosition: StringUnion(['relative', 'same'],{
        category:Category.Style
    }),
}

