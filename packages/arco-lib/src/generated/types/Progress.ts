
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';


export const ProgressPropsSchema = {
    className: Type.Optional(Type.String()),
    type: StringUnion(['line', 'circle']),
    steps: Type.Optional(Type.Number()),
    animation: Type.Optional(Type.Boolean()),
    status: Type.Optional(StringUnion(['success', 'error', 'normal', 'warning'])),
    color: Type.Optional(Type.Union([Type.String(), Type.Object({ key: Type.String() })])),
    trailColor:Type.Optional(Type.String()),
    showText:Type.Optional(Type.Boolean()),
    percent: Type.Number(),
    width:Type.Optional(Type.Union([Type.String(),Type.Number()])),
    size:Type.Optional(StringUnion(['small' , 'default' , 'mini' , 'large'])),
    buffer:Type.Optional(Type.Boolean()),
    bufferColor:Type.Optional(Type.String())
}