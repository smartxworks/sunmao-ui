import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const LinkPropsSchema = {
    href: Type.String({
        category: Category.General,
        weight: 0
    }),
    content: Type.String({
        category: Category.General,
        weight: 1
    }),
    hoverable: Type.Boolean({
        category: Category.Style
    }),
    status: StringUnion(['success', 'warning', 'error'], {
        category: Category.Style
    }),
    disabled: Type.Boolean({
        category: Category.General
    }),
}
