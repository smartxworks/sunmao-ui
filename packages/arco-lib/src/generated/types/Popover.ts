
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const PopoverPropsSchema = {
    title: Type.String(),
    disabled: Type.Boolean(),
    color: Type.String(),
    position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb']),
    mini: Type.Boolean(),
    unmountOnExit: Type.Boolean(),
    controlled: Type.Boolean(),
    trigger: StringUnion(["click", "hover", "focus", "contextMenu"])
}