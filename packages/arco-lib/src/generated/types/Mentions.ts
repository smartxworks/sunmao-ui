import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';


export const MentionsPropsSchema = {
  placeholder:Type.String(),
  disabled:Type.Boolean(),
  error:Type.Boolean(),
  allowClear:Type.Boolean(),
  defaultValue: Type.String(),
  options: Type.Array(Type.String()),
  prefix: Type.String(),
  split: Type.String(),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'])
}