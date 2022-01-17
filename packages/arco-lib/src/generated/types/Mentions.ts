import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';


export const MentionsPropsSchema = {
  placeholder:Type.Optional(Type.String()),
  disabled:Type.Optional(Type.Boolean()),
  error:Type.Optional(Type.Boolean()),
  allowClear:Type.Optional(Type.Boolean()),
  className:Type.Optional(Type.String()),
  defaultValue: Type.Optional(Type.String()),
  options: Type.Optional(Type.Array(Type.String())),
  prefix: Type.Optional(Type.String()),
  split: Type.Optional(Type.String()),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'])
}