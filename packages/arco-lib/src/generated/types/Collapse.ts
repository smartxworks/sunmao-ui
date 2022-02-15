
import { Type } from '@sinclair/typebox';
import { Category } from 'src/constants/category';
import { StringUnion } from '../../sunmao-helper';

export const CollapsePropsSchema = {
    defaultActiveKey: Type.Array(Type.String(), {
        category: Category.General
    }),
    accordion: Type.Boolean({
        category: Category.Style
    }),
    expandIconPosition: StringUnion(['left', 'right'], {
        category: Category.Style
    }),
    bordered: Type.Boolean({
        category: Category.Style
    }),
    lazyload: Type.Boolean({
        category: Category.General
    }),
    destroyOnHide: Type.Boolean({
        category: Category.General
    }),
}

export const CollapseItemPropsSchema = {
    name: Type.String({
        category: Category.General,
        weight: 0
    }),
    disabled: Type.Boolean({
        category: Category.General
    }),
    showExpandIcon: Type.Boolean({
        category: Category.General
    }),
    destroyOnHide: Type.Boolean({
        category: Category.General
    }),
    header: Type.String({
        category: Category.General,
        weight: 1
    })
}
