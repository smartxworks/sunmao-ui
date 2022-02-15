
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const PopoverPropsSchema = {
    title: Type.String({
        category: Category.General,
    }),
    disabled: Type.Boolean({
        category: Category.General,
    }),
    color: Type.String({
        category: Category.Style
    }),
    position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'], {
        category: Category.Style
    }),
    unmountOnExit: Type.Boolean({
        category: Category.General,
    }),
    controlled: Type.Boolean({
        category: Category.General,
    }),
    trigger: StringUnion(["click", "hover", "focus", "contextMenu"], {
        category: Category.General,
    })
}