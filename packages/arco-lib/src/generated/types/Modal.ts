
import { Type } from '@sinclair/typebox';

export const ModalPropsSchema = {
    className: Type.Optional(Type.String()),
    title:Type.Optional(Type.String()),
    mask:Type.Optional(Type.Boolean()),
    simple:Type.Optional(Type.Boolean()),
    okText:Type.Optional(Type.String()),
    cancelText:Type.Optional(Type.String()),
    closable:Type.Optional(Type.Boolean()),
    maskClosable:Type.Optional(Type.Boolean()),
    confirmLoading:Type.Optional(Type.Boolean()),
}
