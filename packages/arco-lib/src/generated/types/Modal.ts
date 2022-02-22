
import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category'


export const ModalPropsSchema = {
    title: Type.String({
        title:'Title',
        category:Category.Basic,
        weight:10
    }),
    mask: Type.Boolean({
        'title':'Mask',
        category: Category.Style
    }),
    simple: Type.Boolean({
        title:'Simple',
        category: Category.Style
    }),
    okText: Type.String({
        title:'Ok Text',
        category:Category.Basic,
        weight:2
    }),
    cancelText: Type.String({
        title:'Cancel Text',
        category:Category.Basic,
        weight:1
    }),
    closable: Type.Boolean({
        title:'Closable',
        category:Category.Basic,
    }),
    maskClosable: Type.Boolean({
        title:'Mask Closable',
        description:'Whether enable click mask to close Modal',
        category:Category.Basic,
    }),
    confirmLoading: Type.Boolean({
        title:'Confirm Loading',
        category: Category.Basic
    }),
}
