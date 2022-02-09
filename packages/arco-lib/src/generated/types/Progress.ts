
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';


export const ProgressPropsSchema = {
    percent: Type.Number(),
    type: StringUnion(['line', 'circle']),
    animation: Type.Boolean(),
    status: StringUnion(['success', 'error', 'normal', 'warning']),
    color: Type.Union([Type.String(), Type.Object({ key: Type.String() })]),
    trailColor:Type.String(),
    showText:Type.Boolean(),
    width:Type.Number(),
    size:StringUnion(['small' , 'default' , 'mini' , 'large']),
}