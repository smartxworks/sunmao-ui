
import { Type } from '@sinclair/typebox';

export const ModalPropsSchema = {
    title:Type.String(),
    mask:Type.Boolean(),
    simple:Type.Boolean(),
    okText:Type.String(),
    cancelText:Type.String(),
    closable:Type.Boolean(),
    maskClosable:Type.Boolean(),
    confirmLoading:Type.Boolean(),
}
