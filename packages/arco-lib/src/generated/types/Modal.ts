import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';

export const ModalPropsSpec = {
  title: Type.String({
    title: 'Title',
    category: Category.Basic,
    weight: 10,
  }),
  defaultOpen: Type.Boolean({
    title: 'Default Open',
    category: Category.Behavior,
  }),
  mask: Type.Boolean({
    title: 'Mask',
    category: Category.Style,
  }),
  simple: Type.Boolean({
    title: 'Simple',
    category: Category.Style,
  }),
  okText: Type.String({
    title: 'Ok Text',
    category: Category.Basic,
    weight: 2,
  }),
  cancelText: Type.String({
    title: 'Cancel Text',
    category: Category.Basic,
    weight: 1,
  }),
  closable: Type.Boolean({
    title: 'Closable',
    category: Category.Behavior,
  }),
  maskClosable: Type.Boolean({
    title: 'Mask Closable',
    description: 'Whether enable click mask to close Modal',
    category: Category.Behavior,
  }),
  confirmLoading: Type.Boolean({
    title: 'Confirm Loading',
    category: Category.Behavior,
  }),
  unmountOnExit: Type.Boolean({
    title: 'Destroy On Hide',
    category: Category.Behavior,
  }),
  hideFooter: Type.Boolean({
    title: 'Hide Footer',
    category: Category.Behavior,
  }),
};
