
import { Type } from '@sinclair/typebox';
import { Category } from 'src/constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TooltipPropsSchema = {
    color: Type.String({
        category: Category.Style
    }),
    position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'], {
        category: Category.Style
    }),
    mini: Type.Boolean({
        category: Category.Style
    }),
    disabled: Type.Boolean({
        category: Category.General
    }),
    content: Type.String({
        category:Category.General,
        weight: 0
    }),
    controlled: Type.Boolean({
        category: Category.General
    }),
    trigger: StringUnion(["click", "hover"],{
        category: Category.General
    }),
    unmountOnExit: Type.Boolean({
        category: Category.General
    }),
}
