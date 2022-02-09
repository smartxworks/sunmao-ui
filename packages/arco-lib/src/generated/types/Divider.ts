
import { StringUnion } from '../../sunmao-helper';

export const DividerPropsSchema = {
  'type': StringUnion(['vertical', 'horizontal']),
  'orientation': StringUnion(['center', 'left', 'right'])
};
