
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';

export const TooltipPropsSchema = {
    className: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    position: Type.Optional(StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'])),
    mini: Type.Optional(Type.Boolean()),
    unmountOnExit: Type.Optional(Type.Boolean()),
    defaultPopupVisible: Type.Optional(Type.Boolean()),
    popupHoverStay: Type.Boolean(),
    blurToHide: Type.Optional(Type.Boolean()),
    disabled: Type.Optional(Type.Boolean()),
    content: Type.Optional(Type.String()),
    controlled: Type.Optional(Type.Boolean()),
    trigger: Type.Optional(
        Type.Union([
            StringUnion(["click", "hover", "focus", "contextMenu"]),
            Type.Array(StringUnion(["click", "hover", "focus", "contextMenu"]))
        ])
    )
}
