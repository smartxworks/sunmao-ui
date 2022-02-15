
import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category'


export const ModalPropsSchema = {
    title: Type.String({
        category:Category.General,
        weight:0
    }),
    mask: Type.Boolean({
        category: Category.Style
    }),
    simple: Type.Boolean({
        category: Category.Style
    }),
    okText: Type.String({
        category:Category.General,
        weight:1
    }),
    cancelText: Type.String({
        category:Category.General,
        weight:2
    }),
    closable: Type.Boolean({
        category:Category.General,
    }),
    maskClosable: Type.Boolean({
        category:Category.General,
    }),
    confirmLoading: Type.Boolean({
        category: Category.Style
    }),
}
