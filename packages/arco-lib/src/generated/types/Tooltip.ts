
import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TooltipPropsSchema = {
    color: Type.String({
        title:'Color',
        category: Category.Style
    }),
    position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'], {
        title:'Position',
        category: Category.Layout
    }),
    mini: Type.Boolean({
        title:'Mini',
        category: Category.Style
    }),
    disabled: Type.Boolean({
        title:'Disabled',
        category: Category.Basic
    }),
    content: Type.String({
        title:'Content',
        category:Category.Basic,
        weight: 100
    }),
    controlled: Type.Boolean({
        title:'Controlled',
        category: Category.Basic
    }),
    trigger: StringUnion(["click", "hover"],{
        title:'Trigger',
        category: Category.Basic,
        weight:3
    }),
}
