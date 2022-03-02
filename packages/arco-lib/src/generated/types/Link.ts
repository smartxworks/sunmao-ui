import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const LinkPropsSchema = {
    href: Type.String({
        title:'Href',
        category: Category.Basic,
        weight: 2
    }),
    content: Type.String({
        title:'Content',
        category: Category.Basic,
        weight: 1
    }),
    hoverable: Type.Boolean({
        title:'Hoverable',
        category: Category.Style
    }),
    status: StringUnion(['success', 'warning', 'error'], {
        title:'Status',
        category: Category.Style
    }),
    disabled: Type.Boolean({
        title:'Disabled',
        category: Category.Basic
    }),
}
