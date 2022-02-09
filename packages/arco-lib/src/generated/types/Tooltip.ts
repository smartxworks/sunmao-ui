
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const TooltipPropsSchema = {
    color: Type.String(),
    position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb']),
    mini: Type.Boolean(),
    unmountOnExit: Type.Boolean(),
    disabled: Type.Boolean(),
    content: Type.String(),
    controlled: Type.Boolean(),
    trigger: StringUnion(["click", "hover"]),
}
