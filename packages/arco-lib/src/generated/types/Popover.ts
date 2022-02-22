
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const PopoverPropsSchema = {
    title: Type.String({
        title:'Title',
        category: Category.Basic,
    }),
    trigger: StringUnion(["click", "hover", "focus", "contextMenu"], {
        title:'Trigger',
        category: Category.Basic,
    }),
    disabled: Type.Boolean({
        title:'Disabled',
        category: Category.Basic,
    }),
    color: Type.String({
        title:'Color',
        category: Category.Style
    }),
    position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'], {
        title:'Position',
        category: Category.Layout
    }),
    controlled: Type.Boolean({
        title:'Controlled',
        category: Category.Basic,
    })
}