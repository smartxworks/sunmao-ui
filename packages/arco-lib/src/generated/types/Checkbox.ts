import {Type} from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const CheckboxOptionSchema = Type.Array(
  Type.Object({
    'label': Type.String(),
    'value': Type.String(),
    'disabled': Type.Boolean(),
    'indeterminate': Type.Boolean(),
  })
);

export const CheckboxPropsSchema = {
  'options': CheckboxOptionSchema,
  'direction': StringUnion(['horizontal', 'vertical']),
  'defaultCheckedValues': Type.Array(Type.String()),
  'showCheckAll': Type.Boolean(),
  'checkAllText': Type.String(),
};
