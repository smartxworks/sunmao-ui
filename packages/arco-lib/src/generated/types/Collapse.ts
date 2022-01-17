
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const CollapsePropsSchema = {
    className: Type.Optional(Type.String()),
    defaultActiveKey: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
    accordion: Type.Optional(Type.Boolean()),
    expandIconPosition: Type.Optional(StringUnion(['left', 'right'])),
    bordered: Type.Optional(Type.Boolean()),
    lazyload: Type.Optional(Type.Boolean()),
    destroyOnHide: Type.Optional(Type.Boolean()),
}

export const CollapseItemPropsSchema = {
    className: Type.Optional(Type.String()),
    name: Type.String(),
    disabled:Type.Optional(Type.Boolean()),
    showExpandIcon:Type.Optional(Type.Boolean()),
    destroyOnHide: Type.Optional(Type.Boolean()),
    header:Type.String()
}
