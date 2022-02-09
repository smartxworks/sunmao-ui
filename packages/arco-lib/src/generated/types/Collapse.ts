
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const CollapsePropsSchema = {
    defaultActiveKey: Type.Array(Type.String()),
    accordion: Type.Boolean(),
    expandIconPosition: StringUnion(['left', 'right']),
    bordered: Type.Boolean(),
    lazyload: Type.Boolean(),
    destroyOnHide: Type.Boolean(),
}

export const CollapseItemPropsSchema = {
    name: Type.String(),
    disabled: Type.Boolean(),
    showExpandIcon: Type.Boolean(),
    destroyOnHide: Type.Boolean(),
    header: Type.String()
}
