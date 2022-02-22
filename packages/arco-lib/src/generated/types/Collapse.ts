
import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const CollapsePropsSchema = {
    defaultActiveKey: Type.Array(Type.String(), {
        title:'Default Active Key',
        category: Category.Basic
    }),
    accordion: Type.Boolean({
        title:'Accordion',
        category: Category.Style
    }),
    expandIconPosition: StringUnion(['left', 'right'], {
        title:'Expand Icon Position',
        category: Category.Layout
    }),
    bordered: Type.Boolean({
        title:'Bordered',
        category: Category.Style
    })
}

export const CollapseItemPropsSchema = {
    name: Type.String({
        title:'Name',
        category: Category.Basic,
        weight: 2
    }),
    disabled: Type.Boolean({
        title:'Disabled',
        category: Category.Basic
    }),
    showExpandIcon: Type.Boolean({
        title:'Show Expand Icon',
        category: Category.Basic
    }),
    header: Type.String({
        title:'Header',
        category: Category.Basic,
        weight: 1
    })
}
