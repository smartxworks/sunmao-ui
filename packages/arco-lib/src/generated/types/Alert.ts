import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const AlertPropsSchema = {
    disabled: Type.Boolean({
        title:'Disabled',
        category:Category.Basic
    }),
    type: StringUnion(['info', 'success', 'warning', 'error'], {
        title:'Type',
        category: Category.Style
    }),
    showIcon: Type.Boolean({
        title:'Show Icon',
        category: Category.Style
    }),
    banner: Type.Boolean({
        title:'Banner',
        category: Category.Style,
        description:'Whether to show as banner on top of the page'
    }),
    content: Type.String({
        title:'Content',
        weight: 1,
        category:Category.Basic
    }),
    title: Type.String({
        title:'Title',
        weight: 2,
        category:Category.Basic
    }),
    visible: Type.Boolean({
        title:'Visible',
        category: Category.Basic
    }),
    closable: Type.Boolean({
        title:'Closable',
        category:Category.Basic
    }),
}