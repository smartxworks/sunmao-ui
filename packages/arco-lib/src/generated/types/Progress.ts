
import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const ProgressPropsSchema = {
    percent: Type.Number({
        category:Category.General
    }),
    type: StringUnion(['line', 'circle'],{
        category:Category.Style
    }),
    animation: Type.Boolean({
        category:Category.Style
    }),
    status: StringUnion(['success', 'error', 'normal', 'warning'],{
        category:Category.Style
    }),
    color: Type.String({
        category:Category.Style,
        description:"Please input a color name such as 'red' or a color code such as '#c10'"
    }),
    trailColor:Type.String({
        category:Category.Style
    }),
    showText:Type.Boolean(),
    width:Type.Number({
        category:Category.Style
    }),
    size:StringUnion(['small' , 'default' , 'mini' , 'large'],{
        category:Category.Style
    }),
}