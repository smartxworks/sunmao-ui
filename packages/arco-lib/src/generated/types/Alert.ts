import { Type } from '@sinclair/typebox';
import { Category } from 'src/constants/category';
import { StringUnion } from '../../sunmao-helper';

export const AlertPropsSchema = {
    disabled: Type.Boolean({
        category:Category.General
    }),
    closable: Type.Boolean({
        category:Category.General
    }),
    type: StringUnion(['info', 'success', 'warning', 'error'], {
        category: Category.Style
    }),
    showIcon: Type.Boolean({
        category: Category.Style
    }),
    banner: Type.Boolean({
        category: Category.Style,
        description:'Whether to show as banner on top of the page'
    }),
    content: Type.String({
        weight: 1,
        category:Category.General
    }),
    title: Type.String({
        weight: 0,
        category:Category.General
    }),
    visible: Type.Boolean({
        category: Category.Layout
    }),
}