import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const PopoverPropsSpec = {
  title: Type.String({
    title: 'Title',
    category: Category.Basic,
  }),
  trigger: StringUnion(['click', 'hover', 'focus', 'contextMenu'], {
    title: 'Trigger',
    category: Category.Behavior,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  color: Type.String({
    title: 'Background',
    description: 'Background color of the popup-layer',
    category: Category.Style,
  }),
  position: StringUnion(
    ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
    {
      title: 'Position',
      category: Category.Layout,
    }
  ),
  controlled: Type.Boolean({
    title: 'Controlled',
    category: Category.Behavior,
    description:
      'Control the opening and closing of popups via openPopupover and closePopupover events',
  }),
  unmountOnExit: Type.Boolean({
    title: 'Destroy On Hide',
    category: Category.Behavior,
  }),
};
